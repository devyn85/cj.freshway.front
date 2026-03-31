import type { MapEvent } from '@/components/common/custom/mapgl/mapbox/types';
import { getLevelFromHjdongCd } from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/utils/getLevelFromHjdongCd';
import { useDistrictBoundaryStore } from '@/store/districtBoundaryStore';
import { useCallback, useRef, useState } from 'react';

/**
 * 호버 상태 관리 훅
 * @param isUsingHover 호버 기능 사용 여부
 * @param clickableHjdongList 클릭 가능한 행정동 리스트
 */
export function useHover(isUsingHover: boolean, clickableHjdongList?: any[]) {
	const [hoveredEventFeature, setHoveredEventFeature] = useState<any>(null);
	const [hoveredFullFeature, setHoveredFullFeature] = useState<any>(null);
	const pointerXYRef = useRef<{ x: number; y: number } | null>(null);

	// 전역 스토어에서 원본 데이터 가져오기
	const listenerSource = useDistrictBoundaryStore(s => s.listenerSource);

	// 1) 원본 데이터에서 완전한 폴리곤 찾기
	const findCompletePolygon = useCallback(
		(eventFeature: any) => {
			if (!eventFeature?.properties) return eventFeature;

			const props = eventFeature.properties;
			const code = props.hjdongCd as string | undefined;
			if (!code) return eventFeature;

			const level = getLevelFromHjdongCd(code);
			const sourceData = listenerSource[level];
			if (!sourceData?.features) return eventFeature;

			const completeFeature = sourceData.features.find((f: any) => f?.properties?.hjdongCd === code);

			return completeFeature || eventFeature;
		},
		[listenerSource],
	);

	// 2) 공통 hover 적용 함수 (마우스무브 + 휠에서 함께 사용)
	const applyHover = useCallback(
		(poly: any, point: { x: number; y: number } | null) => {
			if (!poly || !point) {
				setHoveredEventFeature(null);
				setHoveredFullFeature(null);
				pointerXYRef.current = null;
				return;
			}

			// 클릭 가능한 행정동 리스트 체크
			if (clickableHjdongList && clickableHjdongList.length > 0) {
				const props = poly.properties;
				let isClickable = false;
				const level = getLevelFromHjdongCd(props?.hjdongCd);
				if (level === 'dem') {
					isClickable = clickableHjdongList.some((item: any) => item?.hjdongNm === props.hjdongNm);
				} else if (level === 'sgg') {
					isClickable = clickableHjdongList.some((item: any) => item?.sigKorNm === props.sigKorNm);
				} else if (level === 'sido') {
					isClickable = clickableHjdongList.some((item: any) => item?.ctpKorNm === props.ctpKorNm);
				}

				if (!isClickable) {
					setHoveredEventFeature(null);
					setHoveredFullFeature(null);
					pointerXYRef.current = null;
					return;
				}
			}

			setHoveredEventFeature(poly);
			setHoveredFullFeature(findCompletePolygon(poly));
			pointerXYRef.current = { x: point.x, y: point.y };
		},
		[clickableHjdongList, findCompletePolygon],
	);

	// 3) 마우스 이동 시 hover 갱신
	const onMouseMove = useCallback(
		(event: MapEvent) => {
			if (!isUsingHover) {
				setHoveredEventFeature(null);
				setHoveredFullFeature(null);
				pointerXYRef.current = null;
				return;
			}

			const poly = event.features?.find((f: any) => f?.layer?.id === 'base-fill-layer');
			if (poly && event.point) {
				applyHover(poly, { x: event.point.x, y: event.point.y });
			} else {
				applyHover(null, null);
			}
		},
		[isUsingHover, applyHover],
	);

	// 4) 마우스 아웃 시 초기화
	const onMouseOut = useCallback((event: MapEvent) => {
		setHoveredEventFeature(null);
		setHoveredFullFeature(null);
		pointerXYRef.current = null;
	}, []);

	// 4-1) 컴포넌트 언마운트 시 모든 hover 상태 정리
	const clearHover = useCallback(() => {
		setHoveredEventFeature(null);
		setHoveredFullFeature(null);
		pointerXYRef.current = null;
	}, []);

	// 5) 휠/줌 이후, 마지막 마우스 위치 기준으로 hover 재계산
	const refreshHover = useCallback(
		(map: any) => {
			if (!isUsingHover || !map || !pointerXYRef.current) return;

			const p = pointerXYRef.current;
			if (!p || typeof p.x !== 'number' || typeof p.y !== 'number') return;

			const pt: [number, number] = [p.x, p.y];

			let features: any[] = [];
			try {
				features = map.queryRenderedFeatures(pt, { layers: ['base-fill-layer'] }) as any[];
			} catch (e) {
				return;
			}

			const poly = features?.find((f: any) => f?.layer?.id === 'base-fill-layer') ?? null;
			applyHover(poly, p);
		},
		[isUsingHover, applyHover],
	);

	return { hoveredEventFeature, hoveredFullFeature, pointerXYRef, onMouseMove, onMouseOut, refreshHover, clearHover };
}
