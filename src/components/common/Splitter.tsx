import React, { CSSProperties, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

type SplitDirection = 'horizontal' | 'vertical';
type SizeUnit = 'px' | '%';

type SplitterProps = {
	items: ReactNode[];
	direction?: SplitDirection;
	initialSize?: number;
	initialSizes?: number[];
	unit?: SizeUnit;
	minSize?: number;
	maxSize?: number;
	gutterSize?: number;
	lockTextSelection?: boolean;
	onSizeChange?: (size: number) => void;
	onSizesChange?: (sizes: number[]) => void;
	size?: number;
	sizes?: number[];
	className?: string;
	style?: CSSProperties;
	firstClassName?: string;
	secondClassName?: string;
	onResizeEnd?: () => void;
	onResizing?: () => void;
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const createDefaultSizes = (count: number, unit: SizeUnit) => {
	if (count <= 0) return [];
	if (unit === '%') {
		const each = 100 / count;
		return Array.from({ length: count }, () => each);
	}
	return Array.from({ length: count }, () => 0);
};

const normalizeSizes = (values: number[] | undefined, count: number, unit: SizeUnit) => {
	if (!values || values.length !== count) {
		return createDefaultSizes(count, unit);
	}

	return values.map(value => (Number.isFinite(value) ? value : 0));
};

const getSafeConstraintPx = (value: number) => (Number.isFinite(value) ? Math.max(value, 0) : Number.POSITIVE_INFINITY);

const getBoundedLeftPx = (leftPx: number, pairSumPx: number, minPx: number, maxPx: number) => {
	const safePairSumPx = Math.max(pairSumPx, 0);
	const safeMinPx = Math.min(getSafeConstraintPx(minPx), safePairSumPx / 2);
	const safeMaxPx = Number.isFinite(maxPx) ? Math.max(Math.min(maxPx, safePairSumPx), safeMinPx) : safePairSumPx;

	const lower = Math.max(safeMinPx, safePairSumPx - safeMaxPx);
	const upper = Math.min(safeMaxPx, safePairSumPx - safeMinPx);

	if (lower > upper) {
		return safePairSumPx / 2;
	}

	return clamp(leftPx, lower, upper);
};

const Splitter = ({
	items,
	direction = 'horizontal',
	initialSize = 50,
	initialSizes,
	unit = '%',
	minSize = 160,
	maxSize = Number.POSITIVE_INFINITY,
	gutterSize = 2,
	lockTextSelection = true,
	onSizeChange,
	onSizesChange,
	size,
	sizes,
	className,
	style,
	firstClassName,
	secondClassName,
	onResizeEnd,
	onResizing,
}: SplitterProps) => {
	const rootRef = useRef<HTMLDivElement | null>(null);

	const draggingRef = useRef(false);
	const dragGutterIndexRef = useRef<number>(-1);
	const startPointerRef = useRef(0);
	const startPairSizeRef = useRef<{ leftPx: number; rightPx: number }>({ leftPx: 0, rightPx: 0 });

	const rafRef = useRef<number | null>(null);

	const safeItems = useMemo(() => (items && items.length ? items : [null, null]), [items]);
	const paneCount = Math.max(safeItems.length, 2);

	const isTwoPane = paneCount === 2;
	const isControlled = isTwoPane && size !== undefined;
	const isArrayControlled = Array.isArray(sizes) && sizes.length > 0;
	const isTwoPaneArrayControlled = isTwoPane && isArrayControlled && typeof onSizesChange === 'function';
	const isMultiControlled =
		!isTwoPane && Array.isArray(sizes) && sizes.length === paneCount && typeof onSizesChange === 'function';

	const [innerSize, setInnerSize] = useState<number>(() => {
		if (Array.isArray(sizes) && sizes.length > 0 && Number.isFinite(sizes[0])) {
			return sizes[0];
		}

		if (Array.isArray(initialSizes) && initialSizes.length > 0) {
			return Number.isFinite(initialSizes[0]) ? initialSizes[0] : initialSize;
		}

		return initialSize;
	});

	const currentSize = isTwoPane
		? isControlled
			? (size as number)
			: isTwoPaneArrayControlled
			? (sizes?.[0] as number)
			: innerSize
		: 0;

	const [innerMultiSizes, setInnerMultiSizes] = useState<number[]>(() => {
		if (paneCount <= 2) return [];
		if (Array.isArray(sizes) && sizes.length === paneCount) {
			return normalizeSizes(sizes, paneCount, unit);
		}
		return normalizeSizes(initialSizes, paneCount, unit);
	});

	const currentMultiSizes = useMemo(() => {
		if (isTwoPane) return [];
		return isMultiControlled ? normalizeSizes(sizes, paneCount, unit) : innerMultiSizes;
	}, [innerMultiSizes, isMultiControlled, isTwoPane, paneCount, sizes, unit]);

	const getRootMainSizePx = useCallback(() => {
		const el = rootRef.current;
		if (!el) return 0;
		const rect = el.getBoundingClientRect();
		return direction === 'horizontal' ? rect.width : rect.height;
	}, [direction]);

	const getAvailableMainSizePx = useCallback(() => {
		const rootPx = getRootMainSizePx();
		const totalGutterPx = gutterSize * Math.max(paneCount - 1, 0);
		return Math.max(rootPx - totalGutterPx, 0);
	}, [getRootMainSizePx, gutterSize, paneCount]);

	const toPx = useCallback(
		(value: number) => {
			const availablePx = getAvailableMainSizePx();
			if (unit === 'px') return value;
			return availablePx ? (value / 100) * availablePx : 0;
		},
		[getAvailableMainSizePx, unit],
	);

	const fromPx = useCallback(
		(px: number) => {
			const availablePx = getAvailableMainSizePx();
			if (unit === 'px') return px;
			return availablePx ? (px / availablePx) * 100 : 0;
		},
		[getAvailableMainSizePx, unit],
	);

	const setSize2Pane = useCallback(
		(next: number) => {
			const availablePx = getAvailableMainSizePx();
			const requestedPx = unit === 'px' ? next : toPx(next);
			const boundedPx = getBoundedLeftPx(requestedPx, availablePx, minSize, maxSize);
			const bounded = unit === 'px' ? boundedPx : fromPx(boundedPx);

			if (!isControlled && !isTwoPaneArrayControlled) {
				setInnerSize(bounded);
			}

			onSizeChange?.(bounded);

			if (onSizesChange) {
				const rightPx = Math.max(availablePx - boundedPx, 0);
				const right = unit === 'px' ? rightPx : fromPx(rightPx);
				onSizesChange([bounded, right]);
			}
		},
		[
			fromPx,
			getAvailableMainSizePx,
			isControlled,
			isTwoPaneArrayControlled,
			maxSize,
			minSize,
			onSizeChange,
			onSizesChange,
			toPx,
			unit,
		],
	);

	const setMultiPaneSizes = useCallback(
		(next: number[]) => {
			if (!isMultiControlled) {
				setInnerMultiSizes(next);
			}
			onSizesChange?.(next);
		},
		[isMultiControlled, onSizesChange],
	);

	const callResizingRaf = useCallback(() => {
		if (!onResizing) return;
		if (rafRef.current) return;
		rafRef.current = window.requestAnimationFrame(() => {
			rafRef.current = null;
			onResizing();
		});
	}, [onResizing]);

	const applyNoSelect = useCallback(() => {
		if (!lockTextSelection) return;
		document.documentElement.classList.add('__splitter_no_select__');
		document.documentElement.dataset.splitterDir = direction === 'horizontal' ? 'horizontal' : 'vertical';
	}, [direction, lockTextSelection]);

	const clearNoSelect = useCallback(() => {
		if (!lockTextSelection) return;
		document.documentElement.classList.remove('__splitter_no_select__');
		delete document.documentElement.dataset.splitterDir;
	}, [lockTextSelection]);

	const onPointerDown = useCallback(
		(gutterIndex: number) => (e: React.PointerEvent) => {
			if (e.button !== 0) return;
			e.currentTarget.setPointerCapture?.(e.pointerId);

			draggingRef.current = true;
			dragGutterIndexRef.current = gutterIndex;
			startPointerRef.current = direction === 'horizontal' ? e.clientX : e.clientY;

			if (isTwoPane) {
				const availablePx = getAvailableMainSizePx();
				const leftPx = toPx(currentSize);
				startPairSizeRef.current = { leftPx, rightPx: Math.max(availablePx - leftPx, 0) };
			} else {
				const leftSize = currentMultiSizes[gutterIndex] ?? 0;
				const rightSize = currentMultiSizes[gutterIndex + 1] ?? 0;
				startPairSizeRef.current = { leftPx: toPx(leftSize), rightPx: toPx(rightSize) };
			}

			applyNoSelect();
		},
		[applyNoSelect, currentMultiSizes, currentSize, direction, getAvailableMainSizePx, isTwoPane, toPx],
	);

	const onPointerMove = useCallback(
		(e: PointerEvent) => {
			if (!draggingRef.current) return;

			const pointer = direction === 'horizontal' ? e.clientX : e.clientY;
			const delta = pointer - startPointerRef.current;

			if (isTwoPane) {
				const pairSumPx = startPairSizeRef.current.leftPx + startPairSizeRef.current.rightPx;
				const nextLeftPx = startPairSizeRef.current.leftPx + delta;
				const boundedLeftPx = getBoundedLeftPx(nextLeftPx, pairSumPx, minSize, maxSize);
				const next = unit === 'px' ? boundedLeftPx : fromPx(boundedLeftPx);

				setSize2Pane(next);
				callResizingRaf();
				return;
			}

			const gi = dragGutterIndexRef.current;
			if (gi < 0 || gi >= paneCount - 1) return;

			const leftStartPx = startPairSizeRef.current.leftPx;
			const rightStartPx = startPairSizeRef.current.rightPx;
			const pairSumPx = leftStartPx + rightStartPx;

			const nextLeftPx = leftStartPx + delta;
			const boundedLeftPx = getBoundedLeftPx(nextLeftPx, pairSumPx, minSize, maxSize);
			const boundedRightPx = Math.max(pairSumPx - boundedLeftPx, 0);

			const leftNext = unit === 'px' ? boundedLeftPx : fromPx(boundedLeftPx);
			const rightNext = unit === 'px' ? boundedRightPx : fromPx(boundedRightPx);

			const nextSizes = currentMultiSizes.slice();
			nextSizes[gi] = leftNext;
			nextSizes[gi + 1] = rightNext;

			setMultiPaneSizes(nextSizes);
			callResizingRaf();
		},
		[
			callResizingRaf,
			currentMultiSizes,
			direction,
			fromPx,
			isTwoPane,
			maxSize,
			minSize,
			paneCount,
			setMultiPaneSizes,
			setSize2Pane,
			unit,
		],
	);

	const endDrag = useCallback(() => {
		if (!draggingRef.current) return;
		draggingRef.current = false;
		dragGutterIndexRef.current = -1;

		if (rafRef.current) {
			window.cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}

		clearNoSelect();
		onResizeEnd?.();
	}, [clearNoSelect, onResizeEnd]);

	useEffect(() => {
		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', endDrag);
		window.addEventListener('pointercancel', endDrag);

		return () => {
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerup', endDrag);
			window.removeEventListener('pointercancel', endDrag);
		};
	}, [endDrag, onPointerMove]);

	useEffect(() => {
		return () => {
			if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
		};
	}, []);

	useEffect(() => {
		if (!isTwoPane) return;
		if (isControlled || isTwoPaneArrayControlled) return;

		if (Array.isArray(sizes) && sizes.length > 0) {
			setInnerSize(Number.isFinite(sizes[0]) ? sizes[0] : initialSize);
			return;
		}

		if (Array.isArray(initialSizes) && initialSizes.length > 0) {
			setInnerSize(Number.isFinite(initialSizes[0]) ? initialSizes[0] : initialSize);
			return;
		}

		setInnerSize(initialSize);
	}, [initialSize, initialSizes, isControlled, isTwoPane, isTwoPaneArrayControlled, sizes]);

	useEffect(() => {
		if (paneCount <= 2) return;
		if (isMultiControlled) return;

		if (Array.isArray(sizes) && sizes.length === paneCount) {
			setInnerMultiSizes(normalizeSizes(sizes, paneCount, unit));
			return;
		}

		setInnerMultiSizes(normalizeSizes(initialSizes, paneCount, unit));
	}, [initialSizes, isMultiControlled, paneCount, sizes, unit]);

	useEffect(() => {
		if (paneCount <= 2) return;
		if (unit !== 'px') return;
		if (isMultiControlled) return;

		const availablePx = getAvailableMainSizePx();
		if (!availablePx) return;

		const each = availablePx / paneCount;

		setInnerMultiSizes(prev => {
			if (prev.length !== paneCount) return Array.from({ length: paneCount }, () => each);
			if (prev.every(v => v > 0)) return prev;
			return Array.from({ length: paneCount }, () => each);
		});
	}, [getAvailableMainSizePx, isMultiControlled, paneCount, unit]);

	const paneStyle = useCallback(
		(index: number): React.CSSProperties | undefined => {
			if (isTwoPane) {
				if (index === 0) {
					if (unit === 'px') return { flex: `0 0 ${currentSize}px` };
					return { flex: `0 0 ${currentSize}%` };
				}
				return undefined;
			}

			const v = currentMultiSizes[index] ?? 0;

			if (index === paneCount - 1) {
				if (unit === 'px') return { flex: `1 1 ${v}px` };
				return { flex: `1 1 ${v}%` };
			}

			if (unit === 'px') return { flex: `0 0 ${v}px` };
			return { flex: `0 0 ${v}%` };
		},
		[currentMultiSizes, currentSize, isTwoPane, paneCount, unit],
	);

	const layout = useMemo(() => {
		const list = Array.isArray(safeItems) ? safeItems : [null, null];
		const count = paneCount;

		const nodes: ReactNode[] = [];

		for (let i = 0; i < count; i += 1) {
			const node = list[i] ?? null;
			const isFirst = i === 0;
			const isSecond = i === 1;
			const isLast = i === count - 1;

			nodes.push(
				<Pane
					key={`pane-${i}`}
					className={
						isTwoPane
							? isFirst
								? firstClassName
								: secondClassName
							: isFirst
							? firstClassName
							: isSecond
							? secondClassName
							: undefined
					}
					style={paneStyle(i)}
					$grow={isTwoPane ? !isFirst : false}
				>
					{node}
				</Pane>,
			);

			if (!isLast) {
				nodes.push(
					<Gutter
						key={`gutter-${i}`}
						$direction={direction}
						$size={gutterSize}
						role="separator"
						aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
						onPointerDown={onPointerDown(i)}
					/>,
				);
			}
		}

		return nodes;
	}, [
		direction,
		firstClassName,
		gutterSize,
		isTwoPane,
		onPointerDown,
		paneCount,
		paneStyle,
		safeItems,
		secondClassName,
	]);

	return (
		<>
			<GlobalNoSelectStyle />
			<Root ref={rootRef} $direction={direction} className={className} style={style}>
				{layout}
			</Root>
		</>
	);
};

export default Splitter;

const Root = styled.div<{ $direction: SplitDirection }>`
	display: flex;
	width: 100%;
	height: 100%;
	min-width: 0;
	min-height: 0;
	flex-direction: ${({ $direction }) => ($direction === 'horizontal' ? 'row' : 'column')};
`;

const Pane = styled.div<{ $grow?: boolean }>`
	min-width: 0;
	min-height: 0;
	${({ $grow }) => ($grow ? 'flex: 1 1 auto;' : '')}
	overflow: hidden;
	display: flex;
	flex-direction: column;
`;

const Gutter = styled.div<{ $direction: SplitDirection; $size: number }>`
	flex: 0 0 ${({ $size }) => `${$size}px`};
	${({ $direction }) => ($direction === 'horizontal' ? 'cursor: col-resize;' : 'cursor: row-resize;')}
	touch-action: none;
	position: relative;
	padding: 5px;

	&:hover::after {
		opacity: 0.7;
		background-color: #007651;
	}

	&::before {
		content: '';
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		background-color: rgba(0, 0, 0, 0.15);

		${({ $direction }) =>
			$direction === 'horizontal'
				? `
					width: 2px;
					height: 20px;
					transform: translate(-50%, -50%);
				`
				: `
					width: 20px;
					height: 2px;
					transform: translate(-50%, -50%);
				`}
	}

	&::after {
		content: '';
		position: absolute;
		inset: 4px;
		background-color: rgba(0, 0, 0, 0.04);

		${({ $direction }) =>
			$direction === 'horizontal'
				? `
					width: 2px;
					height: calc(100% - 8px);
					left: 50%;
					top: 4px;
					transform: translateX(-50%);
				`
				: `
					width: calc(100% - 8px);
					height: 2px;
				`}
	}
`;

const GlobalNoSelectStyle = styled.div`
	:global(html.__splitter_no_select__),
	:global(html.__splitter_no_select__ *) {
		user-select: none !important;
		cursor: col-resize;
	}

	:global(html.__splitter_no_select__[data-splitter-dir='vertical']),
	:global(html.__splitter_no_select__[data-splitter-dir='vertical'] *) {
		cursor: row-resize;
	}
`;
