import { area, center, polygon, simplify } from '@turf/turf';

/**
 * center 좌표 계산 (MultiPolygon인 경우 가장 큰 폴리곤 기준)
 */
const calculateCenter = (geometry: any, properties: any, level?: 'sido' | 'sgg' | 'dem'): [number, number] | null => {
	try {
		let targetGeometry = geometry;

		// sido 레벨 + MultiPolygon인 경우 가장 큰 폴리곤만 추출
		if (level === 'sido' && geometry.type === 'MultiPolygon') {
			const polygons = geometry.coordinates.map((coords: any) => polygon(coords));

			let maxArea = 0;
			let largestPolygon = polygons[0];

			polygons.forEach((poly: any) => {
				const polyArea = area(poly);
				if (polyArea > maxArea) {
					maxArea = polyArea;
					largestPolygon = poly;
				}
			});

			targetGeometry = largestPolygon.geometry;
		}

		const centerPoint = center({ type: 'Feature', properties: {}, geometry: targetGeometry });
		const coords = centerPoint.geometry.coordinates as [number, number];

		// sido 레벨에서 경기도는 서울과 겹치므로 좌표 조정
		if (level === 'sido' && properties.ctpKorNm === '경기도') {
			coords[0] -= 0.3; // 경도 서쪽으로 이동
			coords[1] -= 0.3; // 위도 남쪽으로 이동
		}

		return coords;
	} catch (e) {
		return null;
	}
};

export const toFeatureCollection = (
	res: any,
	level?: 'sido' | 'sgg' | 'dem',
): { type: 'FeatureCollection'; features: any[] } => ({
	type: 'FeatureCollection' as const,
	features:
		res?.data?.map((item: any) => {
			try {
				const simplifiedJsonObject = simplify(JSON.parse(item?.geojson), { tolerance: 0.00001, highQuality: true });
				const centerCoords = calculateCenter(simplifiedJsonObject, item, level);

				return {
					type: 'Feature',
					properties: {
						...item,
						geojson: item.hjdongCd || 'null',
						// center 좌표를 properties에 저장
						centerLng: centerCoords?.[0] ?? null,
						centerLat: centerCoords?.[1] ?? null,
					},
					geometry: simplifiedJsonObject,
				};
			} catch (e) {
				const geometry = JSON.parse(item?.geojson);
				const centerCoords = calculateCenter(geometry, item, level);

				return {
					type: 'Feature',
					properties: {
						...item,
						geojson: item.hjdongCd || 'null',
						centerLng: centerCoords?.[0] ?? null,
						centerLat: centerCoords?.[1] ?? null,
					},
					geometry,
				};
			}
		}) ?? [],
});
