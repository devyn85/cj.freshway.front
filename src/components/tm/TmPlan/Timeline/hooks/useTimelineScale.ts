import { PIXELS_PER_MINUTE, TOTAL_MINUTES } from '@/components/tm/planTimeline/constants';
import { useMemo, useState } from 'react';

interface UseTimelineScaleReturn {
	timeUnit: 60 | 30 | 10;
	pxPerMinute: number;
	timelineWidth: number;
}

export const useTimelineScale = (): UseTimelineScaleReturn => {
	const [timeUnit] = useState<60 | 30 | 10>(60);

	// 타임라인 계산값들
	const pxPerMinute = useMemo(() => PIXELS_PER_MINUTE * (60 / timeUnit), [timeUnit]); // 분당 픽셀 수
	const timelineWidth = useMemo(() => TOTAL_MINUTES * pxPerMinute, [pxPerMinute]); // 전체 타임라인 너비

	return {
		timeUnit,
		pxPerMinute,
		timelineWidth,
	};
};
