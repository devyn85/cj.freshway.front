// lib
import * as turf from '@turf/turf';
// types
import { TViewState } from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/hooks/useViewState';
import { IFeature } from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/types/feature';

interface IViewportPadding {
	top: number;
	bottom: number;
	left: number;
	right: number;
}

const DEFAULT_PADDING: IViewportPadding = {
	top: 60,
	bottom: 60,
	left: 60,
	right: 60,
};

// 줌에 따라 구분 기준 정의
export const getRegionLevel = (zoom: number) => {
	if (zoom >= 12) return 'dem'; // 동
	if (zoom >= 9) return 'sgg'; // 구
	return 'sido'; // 시/도
};

// 폴리곤 영역에 대한 화면이동 처리 함수
export const calculateViewportForFeatures = (
	features: IFeature[],
	mapInstance: any,
	padding: IViewportPadding = DEFAULT_PADDING,
): TViewState | null => {
	if (!features || features.length === 0 || !mapInstance) return null;

	// FeatureCollection 생성
	const featureCollection = {
		type: 'FeatureCollection',
		features: features,
	};

	// turf.js로 전체 경계 계산
	const bbox = turf.bbox(featureCollection);
	const [minLng, minLat, maxLng, maxLat] = bbox;

	// 지도 컨테이너 크기 가져오기
	const mapDiv = mapInstance.getDiv();
	if (!mapDiv) return null;

	const mapWidth = mapDiv.offsetWidth;
	const mapHeight = mapDiv.offsetHeight;

	// 유효 뷰포트 크기 계산 (패딩 제외)
	const viewWidth = mapWidth - padding.left - padding.right;
	const viewHeight = mapHeight - padding.top - padding.bottom;

	// 경계 상자 크기 계산
	const latDiff = maxLat - minLat;
	const lngDiff = maxLng - minLng;

	// 중심점 계산
	const centerLat = (minLat + maxLat) / 2;
	const centerLng = (minLng + maxLng) / 2;

	// 줌 레벨 계산
	const lngZoom = Math.log2((360 * viewWidth) / (lngDiff * 256));
	const latFactor = Math.abs(
		Math.log(Math.tan(Math.PI / 4 + (maxLat * Math.PI) / 360)) -
			Math.log(Math.tan(Math.PI / 4 + (minLat * Math.PI) / 360)),
	);
	const latZoom = Math.log2((Math.PI * viewHeight) / (latFactor * 256));

	// 둘 중 작은 값 선택 (전체가 보이도록)
	let zoom = Math.min(lngZoom, latZoom);
	// 안전 마진 추가 및 정수 줌 레벨로 조정
	const safetyMargin = 1; // 1단계 더 축소하여 안전 마진 확보
	zoom = Math.floor(zoom - safetyMargin); // 소수점 이하 버림으로 정수 줌 레벨
	zoom = Math.max(3, Math.min(zoom, 18)); // 줌 레벨 제한

	return {
		latitude: centerLat,
		longitude: centerLng,
		zoom,
		bearing: 0,
		pitch: 0,
	};
};
