import Konva from 'konva';
import { useCallback } from 'react';

interface UseSnapAnimationOptions {
	duration?: number;
	easing?: (progress: number) => number;
	minX?: number;
	maxY?: number;
	minY?: number;
}

export const useSnapAnimation = (options?: UseSnapAnimationOptions) => {
	const duration = options?.duration ?? 0.2;
	const minX = options?.minX ?? 24;
	const maxY = options?.maxY;
	const minY = options?.minY ?? 0;

	const animateToPosition = useCallback(
		(node: Konva.Node, targetX: number, targetY: number, callback?: () => void) => {
			const constrainedX = Math.max(minX, targetX);
			const constrainedY = Math.max(minY, maxY !== undefined ? Math.min(maxY, targetY) : targetY);

			node.to({
				x: constrainedX,
				y: constrainedY,
				duration: 0,
				onFinish: callback,
			});
		},
		[duration, minX, maxY, minY],
	);

	return { animateToPosition };
};
