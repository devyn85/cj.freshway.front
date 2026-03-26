import * as turf from '@turf/turf';
import dayjs from 'dayjs';

// dccode 별로 fromdate 오름차순 정렬 후 geojson 을 합쳐서
// dccode 당 1개 객체만 남기는 헬퍼
export const mergeCenterPolygonByDccode = (list: any[]): any[] => {
	if (!Array.isArray(list)) return [];

	// 1) dccode 별 그룹핑
	const grouped: Record<string, any[]> = list.reduce((acc, item) => {
		const code = item?.dccode;
		if (!code) return acc;
		if (!acc[code]) acc[code] = [];
		acc[code].push(item);
		return acc;
	}, {} as Record<string, any[]>);

	const result: any[] = [];

	Object.values(grouped).forEach(group => {
		if (!group.length) return;

		// 2) fromdate 기준 오름차순 정렬
		const sorted = [...group].sort((a, b) => {
			const aFrom = dayjs(String(a.fromdate), 'YYYYMMDD');
			const bFrom = dayjs(String(b.fromdate), 'YYYYMMDD');
			if (!aFrom.isValid() || !bFrom.isValid()) return 0;
			return aFrom.diff(bFrom);
		});

		// 3) geojson 파싱 + union 으로 geometry 합치기
		let mergedGeom: any = null;

		for (const item of sorted) {
			if (!item?.geojson) continue;

			let g: any;
			try {
				g = JSON.parse(item.geojson);
			} catch {
				continue;
			}
			if (!g?.type) continue;

			if (!mergedGeom) {
				mergedGeom = g;
				continue;
			}

			try {
				const baseFeat = turf.feature(mergedGeom);
				const nextFeat = turf.feature(g);
				const unioned = turf.union(baseFeat, nextFeat);
				if (unioned?.geometry) {
					mergedGeom = unioned.geometry;
				}
			} catch (e) {
				// union 실패 시 기존 mergedGeom 그대로 유지
				// 필요하면 log 출력
				// console.warn('center polygon union failed', e);
			}
		}

		// 유효한 geometry 가 하나도 없으면, 원본 그룹 그대로 넣거나 스킵
		if (!mergedGeom) {
			// 최소한 첫 항목이라도 살리고 싶다면:
			result.push(sorted[0]);
			return;
		}

		// 4) dccode 당 1개 객체만 생성 (fromdate/todate 범위는 통합)
		const first = sorted[0];
		const last = sorted[sorted.length - 1];

		result.push({
			...first,
			fromdate: first.fromdate, // 가장 이른 시작일
			todate: last.todate, // 가장 늦은 종료일
			geojson: JSON.stringify(mergedGeom),
		});
	});

	return result;
};
