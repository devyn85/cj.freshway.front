// src/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/hooks/useViewState.ts
import type { ViewStateChangeEvent } from '@/components/common/custom/mapgl/mapbox/types';
import { useCallback, useState } from 'react';

export type TViewState = {
	latitude: number;
	longitude: number;
	zoom: number;
	bearing: number;
	pitch: number;
};

/**
 *
 * @param initial - 초기 뷰 상태
 * @returns {viewState: TViewState, setViewState: (viewState: TViewState) => void, handleOnMove: (event: ViewStateChangeEvent) => void}
 */
export function useViewState(initial: TViewState) {
	const [viewState, setViewState] = useState<TViewState>(initial);
	const handleOnMove = useCallback((event: ViewStateChangeEvent) => {
		setViewState({
			latitude: event?.viewState?.latitude,
			longitude: event?.viewState?.longitude,
			zoom: event?.viewState?.zoom,
			bearing: event?.viewState?.bearing,
			pitch: event?.viewState?.pitch,
		});
	}, []);
	return { viewState, setViewState, handleOnMove };
}
