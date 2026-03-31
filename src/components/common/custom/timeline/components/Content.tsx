import { useGrabScroll } from '@/components/common/custom/timeline/hooks/useGrabScroll';
import Konva from 'konva';
import { forwardRef, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Layer, Line, Rect, Stage } from 'react-konva';
import { HEADER_HEIGHT, ROW_HEIGHT } from '../constants';
import { useStageBounds } from '../hooks/useStageBounds';
import { TimelineConfig, TimelineEvent } from '../types';
import { drawRowsLine } from '../utils/drawings';
import { measureSize } from '../utils/measureSize';
import { TooltipInfo } from './content/WorkCell';
import { WorkLayer } from './content/WorkLayer';

// 스크롤 인디케이터 컴포넌트
const ScrollIndicator = ({
	direction,
	width,
	height,
}: {
	direction: 'left' | 'right' | 'top' | 'bottom';
	width?: number;
	height?: number;
}) => {
	const chevron = direction === 'left' || direction === 'top' ? '‹' : '›';
	const rotation = direction === 'top' ? 'rotate(90deg)' : direction === 'bottom' ? 'rotate(90deg)' : 'none';

	const directionStyles: Record<string, React.CSSProperties> = {
		left: {
			left: 0,
			top: 0,
			width: 50,
			height: height,
			background: 'linear-gradient(to right, rgba(0, 0, 0, 0.12), transparent)',
		},
		right: {
			right: 0,
			top: 0,
			width: 50,
			height: height,
			background: 'linear-gradient(to left, rgba(0, 0, 0, 0.12), transparent)',
		},
		top: {
			top: 0,
			left: 0,
			width: width,
			height: 50,
			background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.12), transparent)',
		},
		bottom: {
			bottom: 0,
			left: 0,
			width: width,
			height: 50,
			background: 'linear-gradient(to top, rgba(0, 0, 0, 0.12), transparent)',
		},
	};

	return (
		<div
			style={{
				position: 'absolute',
				pointerEvents: 'none',
				zIndex: 100,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				...directionStyles[direction],
			}}
		>
			<span
				style={{
					fontSize: '24px',
					color: '#fff',
					fontWeight: 400,
					transform: rotation,
					textShadow: '0 0 3px rgba(0,0,0,0.5), 0 0 6px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)',
				}}
			>
				{chevron}
			</span>
		</div>
	);
};

interface ContentProps {
	size: { width: number; height: number };
	moveStage: (x: number, y: number, on: 'header' | 'stage') => void;
	config: TimelineConfig;
	tasks: TimelineEvent[];
	handleInternalTasksChange: (tasks: TimelineEvent[], effectedRowId?: string, effectedTaskId?: string) => void;
	highlightedRowId?: string | null;
}

export const Content = forwardRef<Konva.Stage, ContentProps>(
	({ size, moveStage, config, tasks, handleInternalTasksChange, highlightedRowId }, ref) => {
		const lines = drawRowsLine({ config });

		const stageRef = useRef<Konva.Stage>(null);
		const tooltipRef = useRef<HTMLDivElement>(null);
		const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

		const { width: mWidth, height: mHeight } = measureSize({
			config,
		});

		const { bounds, dragBoundFunc } = useStageBounds({
			stageWidth: size.width,
			stageHeight: size.height,
			contentWidth: mWidth,
			contentHeight: mHeight,
		});

		const { handleDragStart, handleDragEnd, scrollDirection } = useGrabScroll({
			stageRef,
			onScroll: (x, y) => {
				moveStage(x, y, 'stage');
			},
			bounds,
		});

		const handleStageDragMove = useCallback(
			(e: Konva.KonvaEventObject<DragEvent>) => {
				if (e.target instanceof Konva.Stage) {
					moveStage(e.target.x(), e.target.y(), 'stage');
				}
			},
			[moveStage],
		);
		const highlightedRowIndex = highlightedRowId ? config.rows.findIndex(r => r.id === highlightedRowId) : -1;

		const handleTooltipShow = useCallback((info: TooltipInfo) => {
			setTooltip(info);
		}, []);

		const handleTooltipMove = useCallback((x: number, y: number) => {
			if (tooltipRef.current) {
				tooltipRef.current.style.left = `${x}px`;
				tooltipRef.current.style.top = `${y + 20}px`;
			}
		}, []);

		const handleTooltipHide = useCallback(() => {
			setTooltip(null);
		}, []);

		const isScrolling = scrollDirection.left || scrollDirection.right || scrollDirection.top || scrollDirection.bottom;

		return (
			<div
				style={{ position: 'relative' }}
				onContextMenu={e => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				{/* 스크롤 인디케이터 오버레이 */}
				{isScrolling && (
					<>
						{scrollDirection.left && <ScrollIndicator direction="left" height={size.height - HEADER_HEIGHT} />}
						{scrollDirection.right && <ScrollIndicator direction="right" height={size.height - HEADER_HEIGHT} />}
						{scrollDirection.top && <ScrollIndicator direction="top" width={size.width} />}
						{scrollDirection.bottom && <ScrollIndicator direction="bottom" width={size.width} />}
					</>
				)}
				<Stage
					width={size.width}
					height={size.height - HEADER_HEIGHT}
					draggable={true}
					ref={node => {
						stageRef.current = node;
						if (typeof ref === 'function') ref(node);
						else if (ref) ref.current = node;
					}}
					onDragMove={handleStageDragMove}
					dragBoundFunc={dragBoundFunc}
					onMouseLeave={handleTooltipHide}
				>
					<Layer>
						{highlightedRowIndex !== -1 && (
							<Rect x={0} y={highlightedRowIndex * ROW_HEIGHT} width={mWidth} height={ROW_HEIGHT} fill="#e6f7ff" />
						)}
						{lines.map((line, i) => (
							<Line key={i} points={line.points} stroke={line.color} strokeWidth={line.size} />
						))}
					</Layer>
					<WorkLayer
						config={config}
						tasks={tasks}
						handleInternalTasksChange={handleInternalTasksChange}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
						onTooltipShow={handleTooltipShow}
						onTooltipMove={handleTooltipMove}
						onTooltipHide={handleTooltipHide}
					/>
				</Stage>

				{/* 호버 툴팁 - Portal로 body에 직접 렌더링 */}
				{tooltip &&
					createPortal(
						<div ref={tooltipRef} className="timeline-tooltip" style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}>
							<div className="timeline-tooltip-address">{tooltip?.task?.custAddress}</div>
							<div className="timeline-tooltip-detail">
								<span className="timeline-tooltip-item">순번: {tooltip?.task?.title || '-'}</span>
								{tooltip.task.weight !== undefined && (
									<span className="timeline-tooltip-item">중량: {Number(tooltip?.task?.weight ?? 0).toFixed(3)}kg</span>
								)}
								{tooltip.task.cube !== undefined && (
									<span className="timeline-tooltip-item">체적: {Number(tooltip?.task?.cube ?? 0).toFixed(2)}m³</span>
								)}
								{tooltip.task.splitDeliveryYn === 'Y' && <span className="timeline-tooltip-item">분할: Y</span>}
							</div>
							<div className="timeline-tooltip-detail">
								<span className="timeline-tooltip-item" style={{ marginTop: '4px' }}>
									우클릭 하여{' '}
									<span style={{ color: '#ff6262' }}>{tooltip?.task?.tmDeliveryType === '2' ? '반품' : '미배차'}</span>{' '}
									영역으로 이동
								</span>
							</div>
						</div>,
						document.body,
					)}
			</div>
		);
	},
);
