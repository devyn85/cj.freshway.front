import dayjs from 'dayjs';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { ROW_HEIGHT, TICK_SIZE } from '../../constants';
import { TimeUnit, TimelineEvent } from '../../types';

const CHAR_WIDTH = 5.37890625;

export interface TooltipInfo {
	task: TimelineEvent;
	x: number;
	y: number;
}

interface WorkCellProps {
	rowIndex: number;
	startDate: dayjs.Dayjs;
	timeUnit: TimeUnit;
	task: TimelineEvent;
	isSelected?: boolean;
	onContextMenu?: (e: any, task: TimelineEvent) => void;
	onTaskClick?: (task: TimelineEvent) => void;
	onMouseEnter?: (info: TooltipInfo) => void;
	onMouseMove?: (x: number, y: number) => void;
	onMouseLeave?: () => void;
}

export const WorkCell = ({
	rowIndex,
	timeUnit,
	startDate,
	task,
	isSelected,
	onContextMenu,
	onTaskClick,
	onMouseEnter,
	onMouseMove,
	onMouseLeave,
}: WorkCellProps) => {
	const { id, title, startAt, spentTime, color, opacity } = task;
	const tickSize = TICK_SIZE[timeUnit];
	const afterMinutes = startAt.diff(startDate, 'minute');
	const startX = tickSize * afterMinutes;
	const cellWidth = tickSize * spentTime;

	const textWidth = title.length * CHAR_WIDTH;
	const showText = cellWidth >= textWidth + 4;

	const groupRef = useRef<Konva.Group>(null);

	useEffect(() => {
		if (!groupRef.current) return;
		const padding = 1; // stroke 여유분
		const cacheY = isSelected ? -(ROW_HEIGHT / 2) + 12 : 0;
		const cacheHeight = isSelected ? ROW_HEIGHT : 24;
		groupRef.current.cache({
			x: -padding,
			y: cacheY - padding,
			width: cellWidth + padding * 2,
			height: cacheHeight + padding * 2,
		});
	}, [cellWidth, color, title, isSelected, showText, opacity]);

	const handleMouseEnter = (e: Konva.KonvaEventObject<MouseEvent>) => {
		const stage = e.target.getStage();
		if (!stage) return;
		stage.container().style.cursor = 'pointer';

		if (!onMouseEnter) return;
		const pointerPos = stage.getPointerPosition();
		if (!pointerPos) return;

		const container = stage.container().getBoundingClientRect();
		onMouseEnter({
			task,
			x: container.left + pointerPos.x,
			y: container.top + pointerPos.y,
		});
	};

	const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
		if (!onMouseMove) return;
		const stage = e.target.getStage();
		if (!stage) return;

		const pointerPos = stage.getPointerPosition();
		if (!pointerPos) return;

		const container = stage.container().getBoundingClientRect();
		onMouseMove(container.left + pointerPos.x, container.top + pointerPos.y);
	};

	const handleMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>) => {
		const stage = e.target.getStage();
		if (stage) {
			stage.container().style.cursor = 'default';
		}
		if (onMouseLeave) onMouseLeave();
	};

	return (
		<Group
			ref={groupRef}
			id={id}
			x={24 + startX}
			y={ROW_HEIGHT * rowIndex + ROW_HEIGHT / 2 - 12}
			width={cellWidth}
			height={24}
			opacity={opacity ?? 1}
			draggable={true}
			name="workCell"
			onDragEnd={() => {}}
			onClick={() => {
				if (onTaskClick) onTaskClick(task);
			}}
			onContextMenu={(e: Konva.KonvaEventObject<PointerEvent>) => {
				if (onContextMenu) {
					e.evt.preventDefault();
					if (onMouseLeave) onMouseLeave(); // 우클릭 시 툴팁 숨기기
					onContextMenu(e, task);
				}
			}}
			onMouseEnter={handleMouseEnter}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			{isSelected && <Rect x={0} y={-(ROW_HEIGHT / 2) + 12} width={cellWidth} height={ROW_HEIGHT} fill={'#DADDE588'} />}
			<Rect
				x={0}
				y={0}
				width={cellWidth}
				height={24}
				fill={color}
				stroke={'#FFFFFF'}
				strokeWidth={1}
				cornerRadius={4}
			/>
			{showText && (
				<Text
					x={0}
					y={0}
					text={title}
					fontSize={12}
					fill="#FFFFFF"
					width={cellWidth}
					height={24}
					align="center"
					verticalAlign="middle"
					name={`workCell-${task.type}`}
					fontStyle="500"
					fontFamily="Pretendard"
				/>
			)}
		</Group>
	);
};
