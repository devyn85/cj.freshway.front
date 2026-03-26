import Konva from 'konva';
import { forwardRef } from 'react';
import { Group, Rect, Text } from 'react-konva';

interface TimeTooltipProps {
	textRef: React.RefObject<Konva.Text | null>;
}

export const TimeTooltip = forwardRef<Konva.Group, TimeTooltipProps>(({ textRef }, ref) => {
	return (
		<Group ref={ref} visible={false}>
			{/* Shadow */}
			<Rect x={1} y={1} width={48} height={24} fill="#000000" cornerRadius={4} opacity={0.15} />

			{/* Main background */}
			<Rect x={0} y={0} width={48} height={24} fill="#374151" cornerRadius={4} opacity={0.65} />

			{/* Border */}
			<Rect x={0} y={0} width={48} height={24} stroke="#6b7280" strokeWidth={1} cornerRadius={4} opacity={0.3} />

			{/* Time text */}
			<Text
				ref={textRef}
				x={0}
				y={0}
				text=""
				fontSize={12}
				fill="#ffffff"
				width={48}
				height={24}
				align="center"
				verticalAlign="middle"
				fontFamily="Pretendard"
				fontStyle="600"
			/>
		</Group>
	);
});
