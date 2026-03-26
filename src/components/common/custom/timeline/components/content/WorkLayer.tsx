import dayjs from 'dayjs';
import Konva from 'konva';
import React, { useCallback, useMemo, useRef } from 'react';
import { Layer } from 'react-konva';
import { ROW_HEIGHT, TICK_SIZE } from '../../constants';
import { useSnapAnimation } from '../../hooks/useSnapAnimation';
import { TimelineConfig, TimelineEvent, TimelineRow, TimeUnit } from '../../types';
import { moveTaskToRow } from '../../utils/taskOperations';
import { IndicatorCell } from './IndicatorCell';
import { TooltipInfo, WorkCell } from './WorkCell';

const EMPTY_TASKS: TimelineEvent[] = [];

/** Row 단위 메모이제이션 컴포넌트 - 변경된 row만 리렌더/재캐싱 */
const RowCells = React.memo(
	({
		row,
		rowIndex,
		tasks,
		timeUnit,
		startDate,
		selectedTaskId,
		config,
		onTooltipShow,
		onTooltipMove,
		onTooltipHide,
	}: {
		row: TimelineRow;
		rowIndex: number;
		tasks: TimelineEvent[];
		timeUnit: TimeUnit;
		startDate: dayjs.Dayjs;
		selectedTaskId?: string;
		config: TimelineConfig;
		onTooltipShow?: (info: TooltipInfo) => void;
		onTooltipMove?: (x: number, y: number) => void;
		onTooltipHide?: () => void;
	}) => {
		return (
			<>
				<IndicatorCell row={row} config={config} />
				{tasks.map((task, i) => (
					<WorkCell
						key={`${task.id}-${i}`}
						rowIndex={rowIndex}
						timeUnit={timeUnit}
						startDate={startDate}
						task={task}
						isSelected={selectedTaskId === task.id}
						onContextMenu={config.onContextMenu}
						onTaskClick={config.onTaskClick}
						onMouseEnter={onTooltipShow}
						onMouseMove={onTooltipMove}
						onMouseLeave={onTooltipHide}
					/>
				))}
			</>
		);
	},
	(prev, next) => {
		if (prev.tasks !== next.tasks) return false;
		if (prev.rowIndex !== next.rowIndex) return false;
		if (prev.timeUnit !== next.timeUnit) return false;
		if (prev.startDate !== next.startDate) return false;
		if (prev.row.id !== next.row.id) return false;
		if (prev.row.startWorkAt?.valueOf() !== next.row.startWorkAt?.valueOf()) return false;
		if (prev.row.endWorkAt?.valueOf() !== next.row.endWorkAt?.valueOf()) return false;

		// 이 row에 선택된 task가 있을 때만 리렌더
		const prevSel = prev.selectedTaskId;
		const nextSel = next.selectedTaskId;
		if (prevSel !== nextSel) {
			const prevInRow = prevSel ? prev.tasks.some(t => t.id === prevSel) : false;
			const nextInRow = nextSel ? next.tasks.some(t => t.id === nextSel) : false;
			if (prevInRow || nextInRow) return false;
		}

		return true;
	},
);

interface WorkLayerProps {
	config: TimelineConfig;
	tasks: TimelineEvent[];
	handleInternalTasksChange: (tasks: TimelineEvent[], effectedRowId?: string, effectedTaskId?: string) => void;
	onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
	onDragEnd: () => void;
	onTooltipShow?: (info: TooltipInfo) => void;
	onTooltipMove?: (x: number, y: number) => void;
	onTooltipHide?: () => void;
}

export const WorkLayer = ({
	config,
	tasks,
	handleInternalTasksChange,
	onDragStart,
	onDragEnd,
	onTooltipShow,
	onTooltipMove,
	onTooltipHide,
}: WorkLayerProps) => {
	const dragPreviewRef = useRef<HTMLDivElement | null>(null);

	const startDate = useMemo(() => {
		return config.timeRange.startAt;
	}, [config.timeRange.startAt]);

	// Row별 tasks 그룹핑 (변경되지 않은 row는 이전 참조 유지 → React.memo가 스킵)
	const prevTasksByRowRef = useRef<Map<string, TimelineEvent[]>>(new Map());
	const tasksByRow = useMemo(() => {
		const prev = prevTasksByRowRef.current;
		const next = new Map<string, TimelineEvent[]>();

		const grouped = new Map<string, TimelineEvent[]>();
		config.rows.forEach(row => grouped.set(row.id, []));
		tasks.forEach(task => {
			grouped.get(task.rowId)?.push(task);
		});

		grouped.forEach((rowTasks, rowId) => {
			const prevTasks = prev.get(rowId);
			if (
				prevTasks &&
				prevTasks.length === rowTasks.length &&
				prevTasks.every((t, i) => t === rowTasks[i])
			) {
				next.set(rowId, prevTasks);
			} else {
				next.set(rowId, rowTasks);
			}
		});

		prevTasksByRowRef.current = next;
		return next;
	}, [tasks, config.rows]);

	const { animateToPosition } = useSnapAnimation({
		minX: 24,
		minY: ROW_HEIGHT / 2 - 12,
		maxY: (config.rows.length - 1) * ROW_HEIGHT + ROW_HEIGHT / 2 - 12,
	});

	const handleWorkCellDragStart = useCallback(
		(e: Konva.KonvaEventObject<DragEvent>) => {
			if (e.target.name() === 'workCell') {
				// 드래그 중 텍스트 선택 방지
				document.body.classList.add('timeline-dragging');

				// 드래그 시작 시 툴팁 숨기기
				if (onTooltipHide) onTooltipHide();

				// 드래그 시작 시 캐시 해제 (opacity 변경 등을 위해)
				e.target.clearCache();

				const taskId = e.target.id();
				const task = tasks.find(t => t.id === taskId);
				onDragStart(e);
				e.target.moveToTop();
				e.target.opacity(0);

				if (task) {
					const preview = document.createElement('div');
					preview.textContent = task.title || '-';
					preview.style.position = 'fixed';
					preview.style.zIndex = '9999';
					preview.style.pointerEvents = 'none';
					preview.style.backgroundColor = task.color || '#1890ff';
					preview.style.color = 'white';
					preview.style.padding = '2px 4px';
					preview.style.borderRadius = '4px';
					preview.style.fontSize = '12px';
					preview.style.whiteSpace = 'nowrap';
					preview.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
					preview.style.transform = 'translate(-50%, -50%)';

					const pointerPos = e.evt;
					const { clientX, clientY } = pointerPos as MouseEvent;
					if (clientX && clientY) {
						preview.style.left = `${clientX}px`;
						preview.style.top = `${clientY}px`;
					}
					document.body.appendChild(preview);
					dragPreviewRef.current = preview;
				}
			}
		},
		[onDragStart, tasks, config, onTooltipHide],
	);

	const handleWorkCellDragMove = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
		if (e.target.name() !== 'workCell') return;
		if (dragPreviewRef.current) {
			const pointerPos = e.evt;
			const { clientX, clientY } = pointerPos as MouseEvent;
			if (clientX && clientY) {
				dragPreviewRef.current.style.left = `${clientX}px`;
				dragPreviewRef.current.style.top = `${clientY}px`;
			}
		}
	}, []);

	const handleWorkCellDragEnd = useCallback(
		(e: Konva.KonvaEventObject<DragEvent>) => {
			if (e.target.name() !== 'workCell') return;

			// 드래그 종료 시 텍스트 선택 방지 해제
			document.body.classList.remove('timeline-dragging');

			onDragEnd();
			e.target.opacity(1);

			// HTML 드래그 프리뷰 제거
			if (dragPreviewRef.current) {
				document.body.removeChild(dragPreviewRef.current);
				dragPreviewRef.current = null;
			}

			const layer = e.target.getLayer();
			if (!layer) return;
			layer.find(`.workCell`).forEach(node => node.offset({ x: 0, y: 0 }));

			// 미할당 영역으로 드롭 체크
			let isFailedToMove = false;
			const pointerPos = e.evt;
			const { clientX, clientY } = pointerPos as MouseEvent;
			if (clientX && clientY) {
				const element = document.elementFromPoint(clientX, clientY);
				const unassignedDropZone = element?.closest('#unassigned-drop-zone');
				const returnDropZone = element?.closest('#return-drop-zone');
				if (unassignedDropZone || returnDropZone) {
					const taskId = e.target.id();
					const task = tasks.find(t => t.id === taskId);
					if (task && config.onMoveToList) {
						const dropZoneId = unassignedDropZone ? 'unassigned' : returnDropZone ? 'return' : null;
						if (dropZoneId === 'unassigned' && task.tmDeliveryType === '2') {
							showAlert('오류', '반품 주문은 미할당 영역으로 이동할 수 없습니다.');
							isFailedToMove = true;
						} else if (dropZoneId === 'return' && task.tmDeliveryType !== '2') {
							showAlert('오류', '해당 주문은 반품 주문이 아니므로 반품 영역으로 이동할 수 없습니다.');
							isFailedToMove = true;
						} else {
							config.onMoveToList(task, unassignedDropZone ? 'unassigned' : 'return');
							return;
						}
					}
				}
			}

			// stage 안인지 밖인지 체크 후 스테이지밖인경우 원래 위치로 복귀
			const stage = e.currentTarget.getStage();
			const stagePos = stage?.getRelativePointerPosition();
			if (!stage || !stagePos) return;

			const stageContainer = stage.container();
			const stageRect = stageContainer.getBoundingClientRect();

			// 마우스 위치가 stage 영역 밖인지 체크
			const isOutsideStage =
				clientX < stageRect.left || clientX > stageRect.right || clientY < stageRect.top || clientY > stageRect.bottom;

			const tickSize = TICK_SIZE[config.timeUnit];
			const leftPadding = 24;

			const snappedY = Math.floor(stagePos.y / ROW_HEIGHT) * ROW_HEIGHT + ROW_HEIGHT / 2 - 12;
			let snappedX = Math.max(
				leftPadding,
				Math.round((stagePos.x - leftPadding - 8 / 2) / tickSize) * tickSize + leftPadding,
			);

			const newStartTime = startDate.add((snappedX - leftPadding) / tickSize, 'minute');
			const taskId = e.target.id();
			const rowId = config.rows[Math.floor(snappedY / ROW_HEIGHT)]?.id;

			const droppedTask = tasks.find(t => t.id === taskId);
			if (!droppedTask) return;

			// 유효하지 않은 row로 드롭 시 원래 위치로 복귀
			if (!rowId || isOutsideStage || isFailedToMove) {
				const originalTask = tasks.find(t => t.id === taskId);
				if (originalTask) {
					const minutes = originalTask.startAt.diff(startDate, 'minute');
					const originalX = leftPadding + minutes * tickSize;
					const originalRowIndex = config.rows.findIndex(r => r.id === originalTask.rowId);
					const originalY = originalRowIndex * ROW_HEIGHT + ROW_HEIGHT / 2 - 12;
					animateToPosition(e.target, originalX, originalY);
				}
				return;
			}

			// taskOperations 유틸 함수 사용하여 태스크 이동
			const finalTasks = moveTaskToRow(tasks, taskId, rowId, newStartTime, {
				shouldForceSequential: config.shouldForceSequential,
				rows: config.rows,
				startWorkAt: config.timeRange.startAt,
			});

			// 강제 순차 배치일 경우, 드롭된 태스크의 최종 위치로 snappedX 업데이트
			const adjustedDroppedTask = finalTasks.find(t => t.id === taskId);
			if (adjustedDroppedTask) {
				const minutes = adjustedDroppedTask.startAt.diff(startDate, 'minute');
				snappedX = leftPadding + minutes * tickSize;
			}

			// Konva 노드 위치 설정
			e.target.position({
				x: snappedX,
				y: snappedY,
			});

			// 애니메이션 준비
			const animations: Array<{ id: string; x: number; y: number }> = [];

			finalTasks.forEach(task => {
				if (task.rowId === rowId || task.id === taskId) {
					const minutes = task.startAt.diff(startDate, 'minute');
					const targetX = leftPadding + minutes * tickSize;
					const rowIndex = config.rows.findIndex(r => r.id === task.rowId);
					const targetY = rowIndex * ROW_HEIGHT + ROW_HEIGHT / 2 - 12;

					const node = layer.findOne(`#${task.id}`);
					if (node) {
						animations.push({ id: task.id, x: targetX, y: targetY });
					}
				}
			});

			let completed = 0;
			const totalAnimations = animations.length;

			const onComplete = () => {
				completed++;
				if (completed >= totalAnimations) {
					handleInternalTasksChange(finalTasks, rowId, taskId);
				}
			};

			if (totalAnimations === 0) {
				handleInternalTasksChange(finalTasks, rowId, taskId);
			} else {
				animations.forEach(({ id, x, y }) => {
					const node = layer.findOne(`#${id}`);
					if (node) {
						animateToPosition(node, x, y, onComplete);
					} else {
						onComplete();
					}
				});
			}
		},
		[config, onDragEnd, animateToPosition, startDate, handleInternalTasksChange, tasks],
	);

	return (
		<Layer onDragStart={handleWorkCellDragStart} onDragMove={handleWorkCellDragMove} onDragEnd={handleWorkCellDragEnd}>
			{config.rows.map((row, rowIndex) => (
				<RowCells
					key={row.id}
					row={row}
					rowIndex={rowIndex}
					tasks={tasksByRow.get(row.id) || EMPTY_TASKS}
					timeUnit={config.timeUnit}
					startDate={startDate}
					selectedTaskId={config.selectedTaskId}
					config={config}
					onTooltipShow={onTooltipShow}
					onTooltipMove={onTooltipMove}
					onTooltipHide={onTooltipHide}
				/>
			))}
		</Layer>
	);
};
