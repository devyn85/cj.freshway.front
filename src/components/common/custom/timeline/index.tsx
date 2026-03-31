import { ItemTypes } from '@/components/tm/planTimeline/types';
import dayjs from 'dayjs';
import Konva from 'konva';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useActivate, useUnactivate } from 'react-activation';
import { useDrop } from 'react-dnd';
import { Content } from './components/Content';
import { Header } from './components/Header';
import { CELL_SIZE, HEADER_HEIGHT, ROW_HEIGHT, TICK_SIZE } from './constants';
import { useTimelineActions } from './hooks/useTimelineActions';
import './style.css';
import { TimelineConfig, TimelineEvent, TimelineHandle, TimelineRow } from './types';
import { measureSize } from './utils/measureSize';

function shallowEqual(objA: any, objB: any) {
	if (Object.is(objA, objB)) return true;
	if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) return false;

	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) return false;

	for (let i = 0; i < keysA.length; i++) {
		if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
			return false;
		}
	}

	return true;
}

const MemoizedRowContent = React.memo(
	({ item, renderer }: { item: TimelineRow; renderer?: (item: TimelineRow) => React.ReactNode }) => {
		return (
			<div className="scroll-item" style={{ width: '100%', height: ROW_HEIGHT, overflow: 'hidden' }}>
				{renderer ? renderer(item) : item.label}
			</div>
		);
	},
	(prev, next) => {
		if (prev.renderer !== next.renderer) return false;
		if (prev.item === next.item) return true;

		return (
			prev.item.id === next.item.id &&
			prev.item.label === next.item.label &&
			prev.item.startWorkAt?.valueOf() === next.item.startWorkAt?.valueOf() &&
			prev.item.endWorkAt?.valueOf() === next.item.endWorkAt?.valueOf() &&
			shallowEqual(prev.item.additionalInfo, next.item.additionalInfo)
		);
	},
);

const MemoizedRow = React.memo(
	({
		item,
		renderer,
		isHighlighted,
	}: {
		item: TimelineRow;
		renderer?: (item: TimelineRow) => React.ReactNode;
		isHighlighted: boolean;
	}) => {
		return (
			<div
				style={{
					width: '100%',
					backgroundColor: isHighlighted ? '#e6f7ff' : undefined,
					transition: 'background-color 0.2s',
				}}
			>
				<MemoizedRowContent item={item} renderer={renderer} />
			</div>
		);
	},
	(prev, next) => {
		// isHighlighted가 다르면 리렌더링 필요
		if (prev.isHighlighted !== next.isHighlighted) return false;
		// item 참조가 같으면 스킵
		if (prev.item === next.item) return true;
		// item 내용 비교 (renderer는 비교하지 않음 - 부모에서 useCallback 안 쓰면 매번 새 참조)
		return (
			prev.item.id === next.item.id &&
			prev.item.label === next.item.label &&
			prev.item.startWorkAt?.valueOf() === next.item.startWorkAt?.valueOf() &&
			prev.item.endWorkAt?.valueOf() === next.item.endWorkAt?.valueOf() &&
			shallowEqual(prev.item.additionalInfo, next.item.additionalInfo)
		);
	},
);

export interface TimelineProps {
	config: TimelineConfig;
	tasks: TimelineEvent[];
}

export const Timeline = forwardRef<TimelineHandle, TimelineProps>(({ config, tasks }, ref) => {
	const [internalTasks, setInternalTasks] = useState<TimelineEvent[]>([]);
	const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);

	const [size, setSize] = useState({ width: 0, height: 0 });

	const panelRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<Konva.Stage>(null);
	const headerRef = useRef<Konva.Stage>(null);
	const lastXYRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const containerRef = useRef<HTMLDivElement>(null);
	const isActivatedRef = useRef(false);
	const isInitialized = useRef(false);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const isProgrammaticScrollRef = useRef(false); // 프로그래밍적 스크롤 중인지 추적

	const contentSize = measureSize({ config });

	useActivate(() => {
		isActivatedRef.current = true;
		requestAnimationFrame(() => {
			moveStage(lastXYRef.current.x, lastXYRef.current.y, 'stage');
		});
	});

	useUnactivate(() => {
		lastXYRef.current = { x: stageRef.current?.x() || 0, y: stageRef.current?.y() || 0 };
	});

	useEffect(() => {
		if (!isActivatedRef.current) return;
		isActivatedRef.current = false;
		requestAnimationFrame(() => {
			moveStage(lastXYRef.current.x, lastXYRef.current.y, 'stage');
		});
	}, [size.width, size.height]);
	useEffect(() => {
		setInternalTasks(tasks);
		stageRef.current?.batchDraw();
	}, [tasks]);

	const handleInternalTasksChange = useCallback(
		(tasks: TimelineEvent[], effectedRowId?: string, effectedTaskId?: string) => {
			setInternalTasks(tasks);
			config.onTasksChange?.(tasks, effectedRowId, effectedTaskId);
		},
		[config],
	);

	// useTimelineActions 훅 사용
	const actions = useTimelineActions({
		tasks: internalTasks,
		rows: config.rows,
		timeRange: config.timeRange,
		onTasksChange: handleInternalTasksChange,
		shouldForceSequential: config.shouldForceSequential,
	});

	const moveStage = useCallback((x: number, y: number, on: 'header' | 'stage' | 'scroll') => {
		if (stageRef.current) {
			const originY = on === 'header' ? stageRef.current.y() : y;
			if (on === 'header') stageRef.current.position({ x, y: originY });
			else stageRef.current.position({ x, y });
		}

		// Header 이동
		if (headerRef.current) headerRef.current.position({ x, y: 0 });

		// 프로그래밍적 스크롤 플래그 설정 (피드백 루프 방지)
		isProgrammaticScrollRef.current = true;

		// 스크롤 오버레이 위치 동기화 (스크롤 오버레이가 직접 이벤트를 발생시킨 경우가 아닐 때)
		if (on !== 'scroll' && scrollContainerRef.current) {
			scrollContainerRef.current.scrollLeft = Math.abs(x);
			scrollContainerRef.current.scrollTop = Math.abs(y);
		}

		if (panelRef.current) panelRef.current.scrollTop = Math.abs(y);

		// 다음 프레임에서 플래그 해제
		requestAnimationFrame(() => {
			isProgrammaticScrollRef.current = false;
		});
	}, []);

	// 스크롤 관련 메서드
	const scrollToTime = useCallback(
		(time: dayjs.Dayjs) => {
			if (!stageRef.current || !config.timeRange.startAt) return;

			const tickSize = TICK_SIZE[config.timeUnit] || TICK_SIZE['30M'];
			const leftPadding = 24;
			const diffMinutes = time.diff(config.timeRange.startAt, 'minute');
			const targetX = -(diffMinutes * tickSize) + leftPadding;

			// 뷰포트 중앙에 오도록 계산
			const viewportWidth = size.width;
			const centeredX = targetX + viewportWidth / 2 - 100;

			const minX = Math.min(0, size.width - contentSize.width);
			const maxX = 0;
			const finalX = Math.max(minX, Math.min(maxX, centeredX));

			const currentY = stageRef.current.y();
			moveStage(finalX, currentY, 'stage');
		},
		[config.timeRange.startAt, config.timeUnit, size.width, contentSize.width, moveStage],
	);

	const scrollToRow = useCallback(
		(rowId: string) => {
			const rowIndex = config.rows.findIndex(r => r.id === rowId);
			if (rowIndex === -1) return;

			const targetY = -(rowIndex * ROW_HEIGHT);
			const currentX = stageRef.current?.x() || 0;

			moveStage(currentX, targetY, 'scroll');
		},
		[config.rows, moveStage],
	);

	// 특정 task로 스크롤
	const scrollToTask = useCallback(
		(taskId: string) => {
			const task = internalTasks.find(t => t.id === taskId);
			if (!task || !config.timeRange.startAt) return;

			// Y 좌표 계산 (row)
			const rowIndex = config.rows.findIndex(r => r.id === task.rowId);
			if (rowIndex === -1) return;
			const taskY = rowIndex * ROW_HEIGHT;

			// X 좌표 계산 (시간)
			const tickSize = TICK_SIZE[config.timeUnit] || TICK_SIZE['30M'];
			const diffMinutes = task.startAt.diff(config.timeRange.startAt, 'minute');
			const taskX = diffMinutes * tickSize;

			// 뷰포트 중앙에 오도록 계산
			const viewportHeight = size.height - HEADER_HEIGHT;
			const centeredX = taskX - size.width / 2 + 100;
			const centeredY = taskY - viewportHeight / 2 + ROW_HEIGHT / 2;

			// viewport 범위 제한
			const maxScrollX = Math.max(0, contentSize.width - size.width);
			const maxScrollY = Math.max(0, contentSize.height - HEADER_HEIGHT - viewportHeight);
			const finalX = Math.max(0, Math.min(maxScrollX, centeredX));
			const finalY = Math.max(0, Math.min(maxScrollY, centeredY));

			const targetX = -finalX;
			const targetY = -finalY;

			// moveStage 내부에서 isProgrammaticScrollRef 플래그 관리
			moveStage(targetX, targetY, 'stage');
		},
		[
			internalTasks,
			config.rows,
			config.timeRange.startAt,
			config.timeUnit,
			size.width,
			size.height,
			contentSize.width,
			contentSize.height,
			moveStage,
		],
	);

	// TimelineHandle 메서드들 노출
	useImperativeHandle(
		ref,
		() => ({
			insertTask: (task, rowId, time) => {
				actions.insertTask(task, rowId, time);
			},
			moveTask: (taskId, targetRowId, time) => {
				actions.moveTask(taskId, targetRowId, time);
			},
			removeTask: taskId => {
				return actions.removeTask(taskId);
			},
			scrollToTime,
			scrollToRow,
			scrollToTask,
			getTasks: () => internalTasks,
			reorderRow: rowId => {
				actions.reorderRow(rowId);
			},
		}),
		[actions, scrollToTime, scrollToRow, scrollToTask, internalTasks],
	);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// ResizeObserver로 컨테이너 크기 변화 감지
		const resizeObserver = new ResizeObserver(entries => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				setSize({ width, height });
			}
		});

		resizeObserver.observe(container);

		// 초기 크기 설정
		const initialSize = container.getBoundingClientRect();
		setSize({ width: initialSize.width, height: initialSize.height });

		return () => {
			resizeObserver.disconnect();
		};
	}, [containerRef.current?.clientHeight]); // clientHeight가 변경될 때마다 size 업데이트

	useEffect(() => {
		if (!stageRef.current) return;
		const currentX = stageRef.current.x();
		const minX = Math.min(0, size.width - contentSize.width);

		if (currentX < minX) {
			const currentY = stageRef.current.y();
			moveStage(minX, currentY, 'stage');
		}
	}, [size.width, contentSize.width, moveStage]);

	const handlePanelScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
		// 프로그래밍적 스크롤 중이면 무시
		if (isProgrammaticScrollRef.current) return;
		// 사용자가 왼쪽 패널을 직접 스크롤할 때
		const scrollTop = e.currentTarget.scrollTop;
		if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = scrollTop;
	}, []);

	const handleScrollOverlay = useCallback(
		(e: React.UIEvent<HTMLDivElement>) => {
			// 프로그래밍적 스크롤 중이면 무시
			if (isProgrammaticScrollRef.current) return;
			// 버추얼 스크롤 오버레이 핸들러
			const scrollLeft = e.currentTarget.scrollLeft;
			const scrollTop = e.currentTarget.scrollTop;
			moveStage(-scrollLeft, -scrollTop, 'scroll');
		},
		[moveStage],
	);

	// 스크롤 오버레이에서 마우스 이벤트를 Stage canvas로 위임
	useEffect(() => {
		const scrollOverlay = scrollContainerRef.current;
		const stage = stageRef.current;
		if (!scrollOverlay || !stage) return;

		const canvas = stage.container().querySelector('canvas');
		if (!canvas) return;

		const forwardMouseEvent = (e: MouseEvent) => {
			// contextmenu 이벤트는 기본 동작 방지
			if (e.type === 'mousedown') document.body.classList.add('timeline-dragging');
			else if (e.type === 'mouseup') document.body.classList.remove('timeline-dragging');

			if (e.type === 'contextmenu') {
				e.preventDefault();
			}
			const clonedEvent = new MouseEvent(e.type, {
				bubbles: true,
				cancelable: true,
				clientX: e.clientX,
				clientY: e.clientY,
				button: e.button,
				buttons: e.buttons,
			});
			canvas.dispatchEvent(clonedEvent);
		};

		// 캔버스 커서 변경 감지하여 스크롤 오버레이에도 적용
		const stageContainer = stage.container();
		const cursorObserver = new MutationObserver(() => {
			scrollOverlay.style.cursor = stageContainer.style.cursor || 'default';
		});
		cursorObserver.observe(stageContainer, { attributes: true, attributeFilter: ['style'] });

		const mouseEvents = [
			'mousedown',
			'mouseup',
			'mousemove',
			'click',
			'dblclick',
			'contextmenu',
			'mouseleave',
		] as const;
		mouseEvents.forEach(eventType => {
			scrollOverlay.addEventListener(eventType, forwardMouseEvent);
		});

		return () => {
			mouseEvents.forEach(eventType => {
				scrollOverlay.removeEventListener(eventType, forwardMouseEvent);
			});
			cursorObserver.disconnect();
		};
	}, [size.width, size.height]); // size가 변경되면 stage가 다시 마운트될 수 있으므로

	const handleDragOver = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.dataTransfer.dropEffect = 'copy';
			const container = containerRef.current;
			if (!container) return;

			const rect = container.getBoundingClientRect();
			const clientY = e.clientY;
			const localY = clientY - rect.top;
			const stageY = stageRef.current ? stageRef.current.y() : 0;
			const yInContent = localY - HEADER_HEIGHT - stageY;

			if (yInContent < 0) {
				if (highlightedRowId !== null) setHighlightedRowId(null);
				return;
			}

			const rowIndex = Math.floor(yInContent / ROW_HEIGHT);

			if (rowIndex < 0 || rowIndex >= config.rows.length) {
				if (highlightedRowId !== null) setHighlightedRowId(null);
				return;
			}

			const row = config.rows[rowIndex];
			if (highlightedRowId !== row.id) {
				setHighlightedRowId(row.id);
			}
		},
		[config.rows, highlightedRowId],
	);

	const handleDragLeave = useCallback(() => {
		setHighlightedRowId(null);
	}, []);

	const [, drop] = useDrop(
		() => ({
			accept: [ItemTypes.UNASSIGNED_ORDER, ItemTypes.RETURN_ORDER],
			drop: (item: { taskIds?: string[]; isReturnOrder?: boolean }, monitor) => {
				if (!config.onExternalDrop) return;

				const offset = monitor.getClientOffset();
				if (!offset) return;

				const container = containerRef.current;
				if (!container) return;

				const rect = container.getBoundingClientRect();
				const clientY = offset.y;
				const localY = clientY - rect.top;
				const stageY = stageRef.current ? stageRef.current.y() : 0;

				const rowIndex = Math.floor((localY - HEADER_HEIGHT - stageY) / ROW_HEIGHT);
				if (rowIndex < 0 || rowIndex >= config.rows.length) return;

				const row = config.rows[rowIndex];
				const rowId = row.id;

				const clientX = offset.x;
				const localX = clientX - rect.left;
				const stageX = stageRef.current ? stageRef.current.x() : 0;
				const xInContent = localX - stageX;

				const tickSize = TICK_SIZE[config.timeUnit] || TICK_SIZE['30M'];
				const leftPadding = 24;

				// 스냅 적용 (WorkLayer 로직 참고)
				const snappedX = Math.max(
					leftPadding,
					Math.round((xInContent - leftPadding) / tickSize) * tickSize + leftPadding,
				);

				const minutesFromStart = (snappedX - leftPadding) / tickSize;
				const dropTime = config.timeRange.startAt.clone().add(minutesFromStart, 'minute');

				// taskIds 배열로 전달 (단일/다중 모두 지원)
				const taskIds = item.taskIds || [];
				config.onExternalDrop(taskIds, rowId, dropTime, scrollToTime, item.isReturnOrder);
			},
		}),
		[config, contentSize.width, moveStage, size.width, scrollToTime],
	);

	const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setHighlightedRowId(null);
	}, []);

	const setRefs = useCallback(
		(node: HTMLDivElement | null) => {
			containerRef.current = node;
			drop(node);
		},
		[drop],
	);

	useEffect(() => {
		if (!stageRef.current || isInitialized.current) return;
		if (size.width === 0) return;
		if (config.rows.length === 0) return;

		const initTime = config.rows[0].startWorkAt;
		if (!initTime || !config.timeRange.startAt) return;

		const diffMinutes = initTime.diff(config.timeRange.startAt, 'minute');
		const pxPerMinute = CELL_SIZE / 30;
		const x = -(diffMinutes * pxPerMinute);

		const currentY = stageRef.current.y();
		moveStage(x, currentY, 'stage');
		isInitialized.current = true;
	}, [config.rows, config.timeRange.startAt, moveStage, size.width]);

	return (
		<div className="timeline-container">
			<div className="left-panel">
				<div className="header" style={{ height: HEADER_HEIGHT }}>
					차량 요약 정보
				</div>
				<div className="scroll-container" ref={panelRef} onScroll={handlePanelScroll}>
					{config.rows.map(item => (
						<MemoizedRow
							key={item.id}
							item={item}
							renderer={config.infoPanelRenderer}
							isHighlighted={highlightedRowId === item.id}
						/>
					))}
				</div>
			</div>
			<div
				ref={setRefs}
				style={{
					flex: 1,
					height: '100%',
					backgroundColor: 'white',
					position: 'relative',
					overflow: 'hidden',
				}}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				{size.width > 0 && size.height > 0 && (
					<>
						<Header size={size} ref={headerRef} moveStage={moveStage} config={config} />
						<Content
							size={size}
							ref={stageRef}
							moveStage={moveStage}
							config={config}
							tasks={internalTasks}
							handleInternalTasksChange={handleInternalTasksChange}
							highlightedRowId={highlightedRowId}
						/>

						{/* 스크롤 오버레이 - 네이티브 스크롤로 Stage 제어 */}
						<div
							ref={scrollContainerRef}
							className="timeline-scroll-overlay"
							style={{
								position: 'absolute',
								top: HEADER_HEIGHT,
								left: 0,
								right: 0,
								bottom: 0,
								overflow: 'auto',
								zIndex: 1,
							}}
							onScroll={handleScrollOverlay}
						>
							{/* 스크롤 영역 확보를 위한 더미 콘텐츠 */}
							<div style={{ width: contentSize.width, height: contentSize.height - HEADER_HEIGHT - 10 }} />
						</div>
					</>
				)}
			</div>
		</div>
	);
});

Timeline.displayName = 'Timeline';
