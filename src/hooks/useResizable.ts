import { useCallback, useLayoutEffect, useRef } from 'react';

interface UseResizableProps {
	initialHeight?: number;
	minHeight?: number;
}

export const useResizable = ({ initialHeight = 300, minHeight = 150 }: UseResizableProps = {}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const resizeRef = useRef<{ startY: number; startHeight: number } | null>(null);

	useLayoutEffect(() => {
		if (containerRef.current) {
			containerRef.current.style.height = `${initialHeight}px`;
		}
	}, []);

	const handleResizeMove = useCallback(
		(e: MouseEvent) => {
			if (!resizeRef.current || !containerRef.current) return;
			const diff = e.clientY - resizeRef.current.startY;
			const newHeight = Math.max(minHeight, resizeRef.current.startHeight + diff);
			containerRef.current.style.height = `${newHeight}px`;
		},
		[minHeight],
	);

	const handleResizeEnd = useCallback(() => {
		resizeRef.current = null;
		document.removeEventListener('mousemove', handleResizeMove);
		document.removeEventListener('mouseup', handleResizeEnd);
		document.body.style.userSelect = '';
	}, [handleResizeMove]);

	const handleResizeStart = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			if (!containerRef.current) return;
			resizeRef.current = {
				startY: e.clientY,
				startHeight: containerRef.current.offsetHeight,
			};
			document.addEventListener('mousemove', handleResizeMove);
			document.addEventListener('mouseup', handleResizeEnd);
			document.body.style.userSelect = 'none';
		},
		[handleResizeMove, handleResizeEnd],
	);

	return {
		containerRef,
		handleResizeStart,
	};
};
