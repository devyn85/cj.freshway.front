/*
############################################################################
# FiledataField   : MsCenterDlvDistrictMapPopup.tsx
# Description     : 배송 권역 검색 지도 팝업 (티맵 v2 폴리곤 표시)
# Author          : hyeonhobyun
# Since           : 25.09.18
############################################################################
*/
// lib
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

// api
import { apiGetCenterDistrictPolygon } from '@/api/ms/apiMsCenterDistrict';
import { apiGetDlvDistrictPolygon } from '@/api/ms/apiMsDeliveryDistrict';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

declare global {
	interface Window {
		Tmapv2: any;
	}
}

interface PropsType {
	params?: {
		dccode?: string;
		effectiveDate?: string;
		dlvgroupId?: string;
		dlvdistrictId?: string;
	} | null;
}

const MsCenterDlvDistrictMapPopup = (props: PropsType) => {
	const { params } = props;

	// v2 map refs
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<any>(null);
	const overlaysRef = useRef<any[]>([]);

	const [isMapReady, setIsMapReady] = useState(false);

	// init map like CmMapPopup (Tmapv2)
	useEffect(() => {
		if (!window.Tmapv2 || !mapRef.current) return;

		const timer = setTimeout(() => {
			try {
				const map = new window.Tmapv2.Map(mapRef.current, {
					center: new window.Tmapv2.LatLng(37.5665, 126.978),
					width: '100%',
					height: '560px',
					zoom: 12,
				});
				mapInstanceRef.current = map;
				setIsMapReady(true);
			} catch (e) {
				// eslint-disable-next-line no-console
			}
		}, 300);

		return () => clearTimeout(timer);
	}, []);

	// helper: draw GeoJSON Polygon/MultiPolygon on v2 map
	const drawFeatureOnMap = (feature: any, opts: any): void => {
		const geom = feature?.geometry;
		if (!geom || !mapInstanceRef.current) return;

		const createPolygon = (coords: number[][]) => {
			const path = coords.map((lngLat: number[]) => new window.Tmapv2.LatLng(lngLat[1], lngLat[0]));
			const polygon = new window.Tmapv2.Polygon({
				paths: path,
				strokeColor: opts?.strokeColor || '#008f69',
				strokeWeight: opts?.strokeWeight ?? 3,
				strokeOpacity: 1,
				fillColor: opts?.fillColor || '#86cab6',
				fillOpacity: opts?.fillOpacity ?? 0.3,
				map: mapInstanceRef.current,
			});
			overlaysRef.current.push(polygon);
		};

		if (geom.type === 'Polygon') {
			const rings = geom.coordinates || [];
			if (rings[0]) createPolygon(rings[0]);
		} else if (geom.type === 'MultiPolygon') {
			(geom.coordinates || []).forEach((poly: any) => {
				if (poly?.[0]) createPolygon(poly[0]);
			});
		}
	};

	const getCenterLatLng = (feature: any) => {
		const geom = feature?.geometry;
		const avg = (coords: number[][]) => {
			let sx = 0;
			let sy = 0;
			const n = coords.length || 1;
			coords.forEach(p => {
				sx += p[0];
				sy += p[1];
			});
			return { lng: sx / n, lat: sy / n };
		};
		if (!geom) return null;
		if (geom.type === 'Polygon') {
			const ring = geom.coordinates?.[0] || [];
			const c = avg(ring);
			return new window.Tmapv2.LatLng(c.lat, c.lng);
		} else if (geom.type === 'MultiPolygon') {
			const ring = geom.coordinates?.[0]?.[0] || [];
			const c = avg(ring);
			return new window.Tmapv2.LatLng(c.lat, c.lng);
		}
		return null;
	};

	// fetch polygons and render on v2
	useEffect(() => {
		if (!isMapReady || !params) return;

		(async () => {
			try {
				// clear previous overlays
				overlaysRef.current.forEach(ov => ov?.setMap?.(null));
				overlaysRef.current = [];

				const [centerRes, groupRes, districtRes] = await Promise.all([
					apiGetCenterDistrictPolygon({ effectiveDate: params.effectiveDate, dccode: params.dccode, hjdongCd: [] }),
					apiGetDlvDistrictPolygon({
						dccode: params.dccode,
						effectiveDate: params.effectiveDate,
						dlvDistrictType: 'GROUP',
						districtId: params.dlvgroupId,
					}),
					apiGetDlvDistrictPolygon({
						dccode: params.dccode,
						effectiveDate: params.effectiveDate,
						dlvDistrictType: 'DISTRICT',
						districtId: params.dlvdistrictId,
					}),
				]);

				let firstCenter: any = null;

				// // 추후 컴포넌트 루티 버전으로 교체 해야함
				// // center
				// if (centerRes?.data?.length > 0) {
				// 	const features = centerRes.data.map((centerObj: any) => ({
				// 		type: 'Feature',
				// 		properties: { ...centerObj },
				// 		geometry: JSON.parse(centerObj.geojson),
				// 	}));
				// 	firstCenter = features?.[0];
				// 	features.forEach((f: any) => drawFeatureOnMap(f, { strokeColor: '#1E90FF', fillColor: '#87CEFA' }));
				// }

				// // group
				// if (groupRes?.data?.length > 0) {
				// 	const features = groupRes.data.map((obj: any) => ({
				// 		type: 'Feature',
				// 		properties: { ...obj },
				// 		geometry: JSON.parse(obj.geojson),
				// 	}));
				// 	features.forEach((f: any) =>
				// 		drawFeatureOnMap(f, { strokeColor: '#FFD700', fillColor: '#FFD700', fillOpacity: 0.25 }),
				// 	);
				// }

				// district
				if (districtRes?.data?.length > 0) {
					const features = districtRes.data.map((obj: any) => ({
						type: 'Feature',
						properties: { ...obj },
						geometry: JSON.parse(obj.geojson),
					}));
					// 첫 폴리곤을 center 계산용으로 저장
          firstCenter = features[0] || null;
	
					features.forEach((f: any) =>
						drawFeatureOnMap(f, { strokeColor: '#00BFFF', fillColor: '#00BFFF', fillOpacity: 0.25 }),
					);
				}

				// center viewport
				const centerLatLng = firstCenter ? getCenterLatLng(firstCenter) : null;
				if (centerLatLng && mapInstanceRef.current) {
					mapInstanceRef.current.setCenter(centerLatLng);
					mapInstanceRef.current.setZoom(12);
				}
			} catch (e) {
				// eslint-disable-next-line no-console
			}
		})();
	}, [isMapReady, params?.dccode, params?.effectiveDate, params?.dlvgroupId, params?.dlvdistrictId]);

	return (
		<Wrapper>
			<PopupMenuTitle name="권역 지도" />
			<Body>
				<div ref={mapRef} style={{ width: '100%', height: '560px', border: '1px solid #aaa', cursor: 'grab' }} />
			</Body>
		</Wrapper>
	);
};

export default MsCenterDlvDistrictMapPopup;

const Wrapper = styled.div`
	width: 100%;
`;
const Body = styled.div``;
