// src/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/hooks/useToggleButtons.ts
import { useMemo, useState } from 'react';
import type { IMapToggleBtn } from '../mapOverlay/MapToggleBtn';

/**
 *
 * @param extra
 * @returns {isShowBoundary: boolean, setIsShowBoundary: (isShowBoundary: boolean) => void, toggleButtons: IMapToggleBtn[]}
 */
export function useToggleButtons(extra: IMapToggleBtn[] = []) {
	const [isShowBoundary, setIsShowBoundary] = useState(false);

	const toggleButtons = useMemo<IMapToggleBtn[]>(() => {
		const defaults: IMapToggleBtn[] = [
			{
				isOn: isShowBoundary,
				onToggle: () => setIsShowBoundary(v => !v),
				label: '행정경계',
				width: '130px',
				marginTop: '0px',
			},
		];
		return [...defaults, ...extra];
	}, [extra, isShowBoundary]);

	return { isShowBoundary, setIsShowBoundary, toggleButtons };
}
