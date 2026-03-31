import { ActualRouteItem, PlanRouteItem } from '@/types/tm/locationMonitor';
import { useMemo } from 'react';

// 시작점(Point) 마커 타입
export interface StartPointMarker {
	longitude: number;
	latitude: number;
	deliverydt: string;
	carno: string;
	priority: string;
}

/**
 * 경로 데이터를 GeoJSON FeatureCollection과 Point 마커로 분리 변환
 * @param { (ActualRouteItem | PlanRouteItem)[] | null | undefined } routeData - geojsonLinestring 또는 routePolyline 속성을 포함하는 객체 배열
 * @returns { polyline: object | null, point: StartPointMarker[] } LineString FeatureCollection과 Point 마커 배열
 */
const createPathFeatureCollection = (routeData: (ActualRouteItem | PlanRouteItem)[] | null | undefined) => {
	if (!routeData || routeData.length === 0) return { polyline: null, point: [] as StartPointMarker[] };

	const lineFeatures: any[] = [];
	const pointMarkers: StartPointMarker[] = [];

	routeData.forEach(routeItem => {
		let geometry;
		// 타입 가드를 사용하여 `geojsonLinestring` 또는 `routePolyline` 속성 확인
		if ('geojsonLinestring' in routeItem && routeItem.geojsonLinestring) {
			geometry = JSON.parse(routeItem.geojsonLinestring);
		} else if ('routePolyline' in routeItem && routeItem.routePolyline) {
			geometry = JSON.parse(routeItem.routePolyline);
		} else {
			return;
		}

		if (!geometry?.coordinates || geometry.coordinates.length === 0) {
			return;
		}

		// Point 타입이면 마커 데이터로
		if (geometry.type === 'Point' && routeItem?.custtype === 'D') {
			pointMarkers.push({
				longitude: geometry.coordinates[0],
				latitude: geometry.coordinates[1],
				deliverydt: (routeItem as any).deliverydt || '',
				carno: (routeItem as any).carno || '',
				priority: (routeItem as any).priority || '',
			});
			return;
		} else if (geometry.type === 'Point' && routeItem?.custtype !== 'D') {
			return;
		}

		// LineString은 Feature로
		const properties = { ...routeItem };
		delete (properties as any).geojsonLinestring;
		delete (properties as any).routePolyline;

		lineFeatures.push({
			type: 'Feature' as const,
			properties,
			geometry: {
				type: 'LineString' as const,
				coordinates: geometry.coordinates,
			},
		});
	});

	return {
		polyline: lineFeatures.length > 0 ? { type: 'FeatureCollection' as const, features: lineFeatures } : null,
		point: pointMarkers,
	};
};

interface UseLocationLayerProps {
	routeData?: ActualRouteItem[] | null;
	planRouteData?: PlanRouteItem[] | null;
}

export const useLocationLayer = ({ routeData, planRouteData }: UseLocationLayerProps) => {
	const routeResult = useMemo(() => createPathFeatureCollection(routeData), [routeData]);
	const planRouteResult = useMemo(() => createPathFeatureCollection(planRouteData), [planRouteData]);

	return {
		mergedRouteFeature: routeResult.polyline,
		mergedPlanRouteFeature: planRouteResult.polyline,
		planStartPoints: planRouteResult.point,
	};
};
