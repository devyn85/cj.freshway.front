import { TOTAL_MINUTES } from '@/components/tm/planTimeline/constants';
import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

interface UseVisibleTimeRangeProps {
	scrollXRef: RefObject<HTMLDivElement>;
	pxPerMinute: number;
}

interface UseVisibleTimeRangeReturn {
	visibleTimeRange: { start: number; end: number };
}

export const useVisibleTimeRange = ({
	scrollXRef,
	pxPerMinute,
}: UseVisibleTimeRangeProps): UseVisibleTimeRangeReturn => {
	const [visibleTimeRange, setVisibleTimeRange] = useState<{ start: number; end: number }>({
		start: 0,
		end: TOTAL_MINUTES,
	});

	// 가로 가시 범위(시간) 계산 (성능 최적화용)
	useEffect(() => {
		const scroller = scrollXRef.current;
		if (!scroller) return;
		let rafId: number | null = null;
		const update = () => {
			const leftPx = scroller.scrollLeft || 0;
			const widthPx = scroller.clientWidth || 0;
			const start = Math.max(0, Math.floor(leftPx / pxPerMinute));
			const end = Math.min(TOTAL_MINUTES, Math.ceil((leftPx + widthPx) / pxPerMinute));
			setVisibleTimeRange(prev => (prev.start !== start || prev.end !== end ? { start, end } : prev));
		};
		const onScroll = () => {
			if (rafId) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(update);
		};
		update();
		scroller.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', update);
		return () => {
			scroller.removeEventListener('scroll', onScroll as any);
			window.removeEventListener('resize', update);
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, [scrollXRef, pxPerMinute]);

	return { visibleTimeRange };
};
