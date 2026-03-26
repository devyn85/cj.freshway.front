import Konva from 'konva';
import { forwardRef } from 'react';
import { Layer, Line, Stage, Text } from 'react-konva';
import { HEADER_HEIGHT } from '../constants';
import { TimelineConfig } from '../types';
import { drawTimeHeadersText } from '../utils/drawings';
import { measureSize } from '../utils/measureSize';

interface HeaderProps {
	size: { width: number };
	moveStage: (x: number, y: number, on: 'header' | 'stage') => void;
	config: TimelineConfig;
}

export const Header = forwardRef<Konva.Stage, HeaderProps>(({ size, moveStage, config }, ref) => {
	const headers = drawTimeHeadersText({ config });
	const { width: mWidth } = measureSize({ config });

	return (
		<Stage
			width={size.width}
			height={HEADER_HEIGHT}
			draggable={true}
			ref={ref}
			onDragMove={e => e.target instanceof Konva.Stage && moveStage(e.target.x(), e.target.y(), 'header')}
			dragBoundFunc={pos => ({
				x: Math.max(-mWidth, Math.min(0, pos.x)),
				y: 0,
			})}
		>
			<Layer>
				{headers.map((header, i) => (
					<Text
						key={`header-text-${i}`}
						text={header.time}
						x={header.x}
						y={0}
						width={140}
						fontSize={12}
						verticalAlign="middle"
						offsetX={-8}
						height={HEADER_HEIGHT}
						fontStyle="500"
						fontFamily="Pretendard"
					/>
				))}
				{headers.map((header, i) => (
					<Line
						key={`header-line-${i}`}
						points={[header.x + 27, HEADER_HEIGHT - 10, header.x + 27, HEADER_HEIGHT - 0]}
						stroke="#DADDE5"
						strokeWidth={1}
					/>
				))}
				<Line points={[0, HEADER_HEIGHT - 0.5, mWidth, HEADER_HEIGHT - 0.5]} stroke="#DADDE5" strokeWidth={1} />
			</Layer>
		</Stage>
	);
});
