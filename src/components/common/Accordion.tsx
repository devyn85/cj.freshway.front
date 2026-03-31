import { CaretDownOutlined } from '@ant-design/icons';
import { CSSProperties, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

export type AccordionItem = {
	key: string | number;
	label?: string | ReactNode;
	children: ReactNode;
	disabled?: boolean;
};

export type ExpandIconPlacement = 'left' | 'right' | 'center';

export type AccordionRenderToggleParams = {
	item: AccordionItem;
	index: number;
	expanded: boolean;
	requestToggle: () => void;
};

export type AccordionProps = {
	items: AccordionItem[];
	expandIcon?: ReactNode;
	expandIconPlacement?: ExpandIconPlacement;
	showExpandIcon?: boolean;
	onResizeEnd?: () => void;
	onResizing?: () => void;
	onChange?: (expandedKeys: Array<string | number>) => void;
	onToggleRequest?: (itemKey: string | number, nextExpanded: boolean) => void;
	className?: string;
	style?: CSSProperties;
	defaultExpanded?: boolean;
	expandedKeys?: Array<string | number>;
	renderToggle?: (params: AccordionRenderToggleParams) => ReactNode;
};

const DEFAULT_TRANSITION_MS = 240;

const Accordion = ({
	items,
	expandIcon,
	expandIconPlacement = 'right',
	showExpandIcon = true,
	onResizeEnd,
	onResizing,
	onChange,
	onToggleRequest,
	className,
	style,
	defaultExpanded = false,
	expandedKeys,
	renderToggle,
}: AccordionProps) => {
	const isControlled = expandedKeys !== undefined;

	const [internalExpandedKeys, setInternalExpandedKeys] = useState<Array<string | number>>(() =>
		defaultExpanded ? items.map(item => item.key) : [],
	);

	useEffect(() => {
		if (!isControlled) {
			setInternalExpandedKeys(defaultExpanded ? items.map(item => item.key) : []);
		}
	}, [defaultExpanded, isControlled]);

	const resolvedExpandedKeys = isControlled ? expandedKeys : internalExpandedKeys;

	const isExpanded = useCallback(
		(key: string | number) => {
			return resolvedExpandedKeys.includes(key);
		},
		[resolvedExpandedKeys],
	);

	const emitChange = useCallback(
		(nextKeys: Array<string | number>) => {
			onChange?.(nextKeys);
		},
		[onChange],
	);

	const requestToggle = useCallback(
		(itemKey: string | number, disabled?: boolean) => {
			if (disabled) return;

			const expanded = resolvedExpandedKeys.includes(itemKey);
			const nextExpanded = !expanded;

			onResizing?.();

			if (isControlled) {
				const nextKeys = nextExpanded
					? [...resolvedExpandedKeys, itemKey]
					: resolvedExpandedKeys.filter(key => key !== itemKey);

				emitChange(nextKeys);
				onToggleRequest?.(itemKey, nextExpanded);
				return;
			}

			setInternalExpandedKeys(prev => {
				const nextKeys = prev.includes(itemKey) ? prev.filter(key => key !== itemKey) : [...prev, itemKey];

				emitChange(nextKeys);
				onToggleRequest?.(itemKey, !prev.includes(itemKey));

				return nextKeys;
			});
		},
		[resolvedExpandedKeys, onResizing, isControlled, onToggleRequest, emitChange],
	);

	const resolvedExpandIcon = useMemo(() => {
		if (expandIcon) return expandIcon;
		return <DefaultExpandIcon />;
	}, [expandIcon]);

	const shouldShowDefaultIcon = showExpandIcon && !renderToggle;
	const shouldUseHeaderToggle = !renderToggle;

	return (
		<Root className={className} style={style}>
			{items.map((item, index) => {
				const expanded = isExpanded(item.key);

				return (
					<ItemRoot key={item.key} $disabled={!!item.disabled}>
						<Header
							type="button"
							$disabled={!!item.disabled}
							$clickable={shouldUseHeaderToggle}
							$iconPlacement={expandIconPlacement}
							$expanded={expanded}
							onClick={() => {
								if (!shouldUseHeaderToggle) return;
								requestToggle(item.key, item.disabled);
							}}
						>
							{expandIconPlacement === 'left' && shouldShowDefaultIcon && (
								<InlineIconArea $disabled={!!item.disabled}>
									<IconRotation $expanded={expanded}>{resolvedExpandIcon}</IconRotation>
								</InlineIconArea>
							)}

							<HeaderContent $centered={expandIconPlacement === 'center' && shouldShowDefaultIcon}>
								{item.label !== undefined && item.label !== null && <Label>{item.label}</Label>}
							</HeaderContent>

							{expandIconPlacement === 'center' && shouldShowDefaultIcon && (
								<CenterIconArea $disabled={!!item.disabled}>
									<IconRotation $expanded={expanded}>{resolvedExpandIcon}</IconRotation>
								</CenterIconArea>
							)}

							{renderToggle && (
								<CustomToggleArea
									onClick={event => {
										event.stopPropagation();
									}}
								>
									{renderToggle({
										item,
										index,
										expanded,
										requestToggle: () => requestToggle(item.key, item.disabled),
									})}
								</CustomToggleArea>
							)}

							{expandIconPlacement === 'right' && shouldShowDefaultIcon && (
								<InlineIconArea $disabled={!!item.disabled}>
									<IconRotation $expanded={expanded}>{resolvedExpandIcon}</IconRotation>
								</InlineIconArea>
							)}
						</Header>

						<AccordionPanel expanded={expanded} onResizeEnd={onResizeEnd}>
							<PanelInner>{item.children}</PanelInner>
						</AccordionPanel>
					</ItemRoot>
				);
			})}
		</Root>
	);
};

type AccordionPanelProps = {
	expanded: boolean;
	children: ReactNode;
	onResizeEnd?: () => void;
};

const AccordionPanel = ({ expanded, children, onResizeEnd }: AccordionPanelProps) => {
	const innerRef = useRef<HTMLDivElement | null>(null);
	const [height, setHeight] = useState<number>(expanded ? 0 : 0);
	const [rendered, setRendered] = useState(expanded);

	useEffect(() => {
		const innerElement = innerRef.current;
		if (!innerElement) return;

		if (expanded) {
			setRendered(true);

			requestAnimationFrame(() => {
				setHeight(innerElement.scrollHeight);
			});
			return;
		}

		setHeight(innerElement.scrollHeight);

		requestAnimationFrame(() => {
			setHeight(0);
		});
	}, [expanded, children]);

	const handleTransitionEnd = useCallback(() => {
		const innerElement = innerRef.current;
		if (!innerElement) {
			onResizeEnd?.();
			return;
		}

		if (expanded) {
			setHeight(innerElement.scrollHeight);
		} else {
			setRendered(false);
		}

		onResizeEnd?.();
	}, [expanded, onResizeEnd]);

	return (
		<PanelWrapper $height={rendered ? height : 0} onTransitionEnd={handleTransitionEnd}>
			<PanelInnerMeasure ref={innerRef}>{children}</PanelInnerMeasure>
		</PanelWrapper>
	);
};

const DefaultExpandIcon = () => {
	return <CaretDownOutlined />;
};

const Root = styled.div`
	width: 100%;
`;

const ItemRoot = styled.div<{
	$disabled: boolean;
}>`
	position: relative;
	border: 1px solid #d9d9d9;
	border-radius: 4px;
	background: #fff;
	opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

	& + & {
		margin-top: 12px;
	}
`;

const Header = styled.button<{
	$disabled: boolean;
	$clickable: boolean;
	$iconPlacement: ExpandIconPlacement;
	$expanded: boolean;
}>`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: ${({ $iconPlacement }) => ($iconPlacement === 'center' ? 'center' : 'space-between')};
	gap: 12px;
	padding: ${({ $expanded }) => ($expanded ? '4px 4px 0 4px' : '4px')};
	border: 0;
	background: transparent;
	cursor: ${({ $disabled, $clickable }) => {
		if ($disabled) return 'not-allowed';
		return $clickable ? 'pointer' : 'default';
	}};
	text-align: left;
`;

const HeaderContent = styled.div<{
	$centered: boolean;
}>`
	flex: ${({ $centered }) => ($centered ? 'unset' : 1)};
	min-width: 0;
	display: flex;
	align-items: center;
	justify-content: ${({ $centered }) => ($centered ? 'center' : 'flex-start')};
`;

const Label = styled.div`
	width: 100%;
`;

const InlineIconArea = styled.div<{
	$disabled: boolean;
}>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	pointer-events: none;
`;

const CenterIconArea = styled.div<{
	$disabled: boolean;
}>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	pointer-events: none;
`;

const CustomToggleArea = styled.div`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
`;

const IconRotation = styled.div<{
	$expanded: boolean;
}>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	transform: rotate(${({ $expanded }) => ($expanded ? '180deg' : '0deg')});
	transition: transform ${DEFAULT_TRANSITION_MS}ms ease;
`;

const PanelWrapper = styled.div<{
	$height: number;
}>`
	height: ${({ $height }) => `${$height}px`};
	overflow: hidden;
	transition: height ${DEFAULT_TRANSITION_MS}ms ease;
`;

const PanelInnerMeasure = styled.div`
	display: block;
`;

const PanelInner = styled.div`
	padding: 0 4px 4px 4px;
`;

export default Accordion;
