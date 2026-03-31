// libs
import * as turf from '@turf/turf';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
// components
import { Layer, Source } from '@/components/common/custom/mapgl/mapbox';
import WrapperDistrictBoundaries from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/WrapperDistrictBoundaries';
// utils
import { useRooutyMap } from '@/components/common/custom/mapgl/mapbox';
import { getLevelFromHjdongCd } from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/utils/getLevelFromHjdongCd';
import { mergeCenterPolygonByDccode } from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/utils/polygons';
// hooks
// styles
import {
	CenterDistrictClickedHjdongPloygonLayerStyle,
	CenterDistrictClosedHjdongPloygonLayerStyle,
	CenterDistrictNewHjdongPloygonLayerStyle,
	CenterPloygonLayerStyle,
	DistrictPloygonLayerStyle,
	GroupDistirctPloygonLayerStyle,
	SelectedDistrictPloygonLayerStyle,
	SelectedDistrictTextLayerStyle,
	UnusageHjdongPloygonLayerStyle,
	districtTextLayerStyle,
} from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/utils/mapLayerStyles';
// types
import { IDistrictTabDataState } from '@/pages/ms/MsDeliveryDistrict';
// store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { dispatchSetLoading } from '@/store/core/loadingStore';
import { useDistrictBoundaryStore } from '@/store/districtBoundaryStore';
interface IDeliveryDistrictMapProps {
	districtTabDatasState: IDistrictTabDataState;
	// // {
	// // 	districtGroupList: any[]; // 메인 그리드 권역그룹 옵션 리스트 (셀 편집기에서 사용)
	// // 	subGridData: any[]; // 서브 그리드 데이터 (행정동)
	// // 	centerPolygonData: any[]; // 센터 폴리곤 데이터 (지도 데이터)
	// // 	districtGroupPolygonData: any[]; // 권역그룹 폴리곤 데이터 (지도 데이터)
	// // 	districtPolygonData: any[]; // 권역 폴리곤 데이터 (지도 데이터)
	// // 	usageHjdongList: []; // 현재 사용중이 아닌 행정동 리스트 (미사용중인 행정동 리스트 노랑색 색상을 표시) - useageList 에서 fromDate, toDate null | '' 인값만 넣어주기
	// // };
	selectMasterGridRow: any; // 메인그리드에서 선택된 행
	// 1. 메인 그리드 행 선택 시 지도 클릭 되게 처리
	// 2. 권역그룹 클릭 시 권역그룹 폴리곤으로 포커스 처리
	// 3. 권역 명 클릭 시 권역 폴리곤 데이터 주입 + 권역 폴리곤으로 포커스 처리
	// districtGridRefs: {
	// 	// 그리드 접근을 위한 ref
	// 	masterGridRef: React.RefObject<any>; // 메인그리드
	// 	subGridRef: React.RefObject<any>; // 서브그리드
	// };
	selectSubGridRow?: any; // 서브그리드에서 선택된 행
	subGridRef?: React.RefObject<any>;
	// 1. 서브그리드 ref 를 사용하여 지도 클릭 시 서브그리드 행 추가 처리를 해줘야 함!!
	// (GridTopBtn 의 plus 에서 사용된 그리드 행 추가 로직 사용해야함)
	// 2. 지도 클릭 시 해당 서브그리드에 존재시 제거 처리
	// 3. 구단위로 클릭 시 해당 행정동이 포함되어 있다면 전부 추가처리 ()
	gridTick?: number;
	// 그리드 변경시 바로 적용처리
	bumpGridTick?: () => void;
	tabSearchConditions: any; // 조회 조건 (적용일자 처리 시 오늘일자가 아닐 때 얼럿 막기위한 처리를 위한 props)
}

// 에러 핸들링 관련 공통 함수
const logError = (msg: string, err?: any) => {
	// 에러 조치
};

// GeoJSON 리스트를 turf.union 으로 합쳐 단일 geometry 반환
const mergeGeojsonUnion = (items: any[]): any => {
	let mergedGeom: any = null;
	for (const item of items) {
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
			const unioned = turf.union(turf.feature(mergedGeom), turf.feature(g));
			if (unioned?.geometry) mergedGeom = unioned.geometry;
		} catch {
			// union 실패 시 기존 mergedGeom 유지
		}
	}
	return mergedGeom;
};

const DeliveryDistrictMap = ({
	districtTabDatasState,
	selectMasterGridRow,
	selectSubGridRow,
	subGridRef,
	gridTick,
	bumpGridTick,
	tabSearchConditions,
}: IDeliveryDistrictMapProps) => {
	const maps = useRooutyMap();
	const FOREVER_DATE = '29991231';

	// 컴포넌트 상단
	// const { listenerSource } = useDistrictBoundariesData();
	const { listenerSource } = useDistrictBoundaryStore(s => s);
	const commonCodeList = getCommonCodeList('WMS_MNG_DC') ?? [];

	// dem: hjdongCd → feature 매핑
	const demMap = useMemo(() => {
		try {
			const m = new Map<string, any>();
			const feats = listenerSource?.dem?.features ?? [];
			for (const f of feats) {
				const cd = f?.properties?.hjdongCd;
				if (cd) m.set(cd, f);
			}
			return m;
		} catch (e) {
			logError('demMap build failed', e);
			return new Map();
		}
	}, [listenerSource?.dem]);

	// 사용 행정동 Set (지도 클릭 여부 사용)
	const usageSet = useMemo(() => {
		const list = selectMasterGridRow
			? districtTabDatasState?.hjdongPeriodList ?? []
			: districtTabDatasState?.usageHjdongList ?? [];

		return new Set(list.map((i: any) => i.hjdongCd));
	}, [districtTabDatasState?.usageHjdongList, districtTabDatasState?.hjdongPeriodList, selectMasterGridRow]);

	// 미사용 행정동 Set (fromDate/toDate 비어있음) (노랑색 폴리곤 처리를 위해 사용)
	const unUsageSet = useMemo(() => {
		// 권역 선택 하지 않으면 원래대로 처리
		if (!selectMasterGridRow) {
			const list = districtTabDatasState?.unUsageHjdongList ?? [];
			return new Set(list.map((i: any) => i.hjdongCd));
		}
		// 권역 선택 시 권역에 포함된 행정동만 처리
		const unuse = (districtTabDatasState?.unUsageHjdongList ?? []).filter((unUseObj: any) => {
			const hjdongList = (districtTabDatasState?.hjdongPeriodList ?? []).map((item: any) => item.hjdongCd);
			if (hjdongList.includes(unUseObj.hjdongCd)) {
				return true;
			} else {
				return false;
			}
		});
		return new Set(unuse.map((i: any) => i.hjdongCd));
	}, [
		districtTabDatasState?.unUsageHjdongList,
		districtTabDatasState?.hjdongPeriodList,
		districtTabDatasState?.subGridData,
		selectMasterGridRow,
	]);

	// 공통 함수
	// 공통: 원시 리스트 → FeatureCollection
	const toFC = (list?: any[]) => {
		const arr = Array.isArray(list) ? list : [];
		return {
			type: 'FeatureCollection' as const,
			features: arr.flatMap((item: any) => {
				try {
					const g = JSON.parse(item?.geojson);
					if (!g?.type) return [];
					return [{ type: 'Feature' as const, properties: { ...item }, geometry: g }];
				} catch {
					return [];
				}
			}),
		};
	};

	// 공통: 지도 포커스(안전 가드 포함)
	const fitGeom = (map: any, geom: any, padding = 60) => {
		if (!map || !geom) return;
		const [minLng, minLat, maxLng, maxLat] = turf.bbox(geom);
		if (![minLng, minLat, maxLng, maxLat].every(isFinite)) return;
		if (minLng >= maxLng || minLat >= maxLat) return;
		map.fitBounds(
			[
				[minLng, minLat],
				[maxLng, maxLat],
			],
			{ padding, duration: 700 },
		);
	};

	// 공통: 그리드 배치 업데이트(체크 처리 포함)
	const batchUpdateRows = (grid: any, rows: any[], patch: any) => {
		const rowIdField = grid.props?.gridProps?.rowIdField ?? '_$uid';
		const toIndex = (row: any) => {
			const rowId = row[rowIdField] ?? row._$uid;
			const idxs = grid.getRowIndexesByValue(rowIdField, rowId);
			return Array.isArray(idxs) && idxs.length ? idxs[0] : -1;
		};
		const idxArr = rows.map(toIndex).filter((i: number) => i > -1);
		const patchArr = idxArr.map(() => patch);
		if (idxArr.length) grid.updateRows(patchArr, idxArr, true);
	};

	// 센터 폴리곤 레이어 데이터
	const centerPolygonSourceData = useMemo(
		() => toFC(districtTabDatasState?.centerPolygonData),
		[districtTabDatasState?.centerPolygonData],
	);

	// 권역그룹 폴리곤 레이어 데이터
	const districtGroupPolygonSourceData = useMemo(() => {
		const filteredList = districtTabDatasState?.districtGroupPolygonData.filter(
			(it: any) => it.districtId !== selectMasterGridRow?.dlvgroupId,
		);
		return toFC(filteredList);
	}, [districtTabDatasState?.districtGroupPolygonData, selectMasterGridRow]);
	// 선택한 그룹 폴리곤 레이어 데이터
	const selectedDistrictGroupPolygonSourceData = useMemo(() => {
		const filtered = districtTabDatasState?.districtGroupPolygonData.filter(
			(it: any) => it.districtId === selectMasterGridRow?.dlvgroupId,
		);
		return toFC(filtered);
	}, [districtTabDatasState?.districtGroupPolygonData, selectMasterGridRow]);
	// 권역그룹 텍스트 레이어 데이터
	const districtGroupTextFC = useMemo(() => {
		const list =
			districtTabDatasState?.districtGroupPolygonData.filter(
				(it: any) => it.districtId !== selectMasterGridRow?.dlvgroupId,
			) ?? [];
		const mergedList = mergeCenterPolygonByDccode(list);
		const features = mergedList.flatMap((item: any) => {
			try {
				const g = JSON.parse(item?.geojson);
				if (!g?.type) return [];
				const c = turf.center(g)?.geometry?.coordinates;
				if (!c) return [];
				return [
					{
						type: 'Feature' as const,
						properties: { name: item.dlvDistrictNm ?? '' },
						geometry: { type: 'Point', coordinates: c },
					},
				];
			} catch {
				return [];
			}
		});
		return { type: 'FeatureCollection' as const, features };
	}, [districtTabDatasState?.districtGroupPolygonData, selectMasterGridRow]);
	// 선택한 권역그룹 텍스트 레이어 데이터
	const selectedDistrictGroupTextFC = useMemo(() => {
		const list =
			districtTabDatasState?.districtGroupPolygonData.filter(
				(it: any) => it.districtId === selectMasterGridRow?.dlvgroupId,
			) ?? [];
		const mergedList = mergeCenterPolygonByDccode(list);
		const features = mergedList.flatMap((item: any) => {
			try {
				const g = JSON.parse(item?.geojson);
				if (!g?.type) return [];
				const c = turf.center(g)?.geometry?.coordinates;
				if (!c) return [];
				return [
					{
						type: 'Feature' as const,
						properties: { name: item.dlvDistrictNm ?? '' },
						geometry: { type: 'Point', coordinates: c },
					},
				];
			} catch {
				return [];
			}
		});
		return { type: 'FeatureCollection' as const, features };
	}, [districtTabDatasState?.districtGroupPolygonData, selectMasterGridRow]);

	const buildDistrictTextFCByDistrictId = (list: any[]) => {
		const grouped = new Map<string, any[]>();

		for (const it of Array.isArray(list) ? list : []) {
			const key = String(it?.districtId ?? '');
			if (!key) continue;
			if (!grouped.has(key)) grouped.set(key, []);
			grouped.get(key)?.push(it);
		}

		const features = Array.from(grouped.values()).flatMap(groupItems => {
			try {
				const mergedGeom = mergeGeojsonUnion(groupItems);
				if (!mergedGeom) return [];

				const c = turf.center(mergedGeom)?.geometry?.coordinates;
				if (!c) return [];

				const first = groupItems[0];
				return [
					{
						type: 'Feature' as const,
						properties: { name: first?.dlvDistrictNm ?? '' },
						geometry: { type: 'Point', coordinates: c },
					},
				];
			} catch {
				return [];
			}
		});

		return { type: 'FeatureCollection' as const, features };
	};

	// 권역 폴리곤 레이어 데이터
	const districtPolygonSourceData = useMemo(() => {
		const filtered = districtTabDatasState?.districtPolygonData.filter(
			(it: any) => it.districtId !== selectMasterGridRow?.dlvdistrictId,
		);
		return toFC(filtered);
	}, [districtTabDatasState?.districtPolygonData, selectMasterGridRow]);
	// 선택한 권역 폴리곤 레이어 데이터
	const selectedDistrictPolygonSourceData = useMemo(() => {
		const filtered = districtTabDatasState?.districtPolygonData.filter(
			(it: any) => it.districtId === selectMasterGridRow?.dlvdistrictId,
		);
		return toFC(filtered);
	}, [districtTabDatasState?.districtPolygonData, selectMasterGridRow]);

	// 권역 텍스트 레이어 데이터
	const districtTextFC = useMemo(() => {
		const list =
			districtTabDatasState?.districtPolygonData.filter(
				(it: any) => it.districtId !== selectMasterGridRow?.dlvdistrictId,
			) ?? [];

		return buildDistrictTextFCByDistrictId(list);
	}, [districtTabDatasState?.districtPolygonData, selectMasterGridRow?.dlvdistrictId]);

	// 선택한 권역 텍스트 레이어 데이터
	const selectedDistrictTextFC = useMemo(() => {
		const list =
			districtTabDatasState?.districtPolygonData.filter(
				(it: any) => it.districtId === selectMasterGridRow?.dlvdistrictId,
			) ?? [];

		return buildDistrictTextFCByDistrictId(list);
	}, [districtTabDatasState?.districtPolygonData, selectMasterGridRow?.dlvdistrictId]);

	// 미사용중인 행정동 폴리곤 레이어 데이터
	const unUsageHjdongPolygonSourceData = useMemo(() => {
		const features: any[] = [];
		for (const cd of unUsageSet) {
			const feat = demMap.get(cd);
			if (feat) features.push(feat);
		}
		return { type: 'FeatureCollection' as const, features };
	}, [unUsageSet, demMap]);

	// 그리드 폴리곤 추가/제거 버전
	const [gridVersion, setGridVersion] = useState(0);

	// 그리드 이벤트 구독 (행 추가/삭제/편집 완료)
	useEffect(() => {
		const grid = subGridRef?.current;
		if (!grid) return;
		const onGridChange = () => setGridVersion(v => v + 1);

		if (typeof grid.bind === 'function') {
			try {
				grid.bind(['addRow', 'removeRow', 'cellEditEnd'], onGridChange);
			} catch (e) {
				logError('grid.bind failed', e);
			}
		}

		return () => {
			if (typeof grid?.unbind === 'function') {
				try {
					grid.unbind(['addRow', 'removeRow', 'cellEditEnd']);
				} catch (e) {
					logError('grid.unbind failed', e);
				}
			}
		};
	}, [subGridRef]);

	// 기존 신규행(I) 폴리곤 바로 아래에 추가
	const closedHjdongPolygonData = useMemo(() => {
		try {
			const grid = subGridRef?.current;
			if (!grid) return { type: 'FeatureCollection' as const, features: [] };

			if (gridTick === 0) {
				// 조회시 초기화 처리
				return { type: 'FeatureCollection' as const, features: [] };
			}

			// 1) 체크된 행 가져오기 (getCheckedRowItemsAll 이 있으면 그쪽 우선)
			const checkedRows = (grid.getCheckedRowItemsAll?.() as any[]) ?? (grid.getCheckedRowItems?.() as any[]) ?? [];

			if (!checkedRows.length) {
				return { type: 'FeatureCollection' as const, features: [] };
			}

			const today = dayjs().startOf('day');
			const todayStr = today.format('YYYYMMDD');
			const todayPlus2Str = today.add(2, 'day').format('YYYYMMDD');

			const normYmd = (v: any) => {
				if (!v) return '';
				return String(v).replace(/-/g, '');
			};

			const seen = new Set<string>();
			const features = checkedRows.flatMap(rowWrap => {
				const r = rowWrap.item ?? rowWrap; // {rowIndex, item} 또는 item 둘 다 대응
				if (!r) return [];

				// 2) rowStatus 가 U 인 행만
				if (r.rowStatus !== 'U') return [];

				const cd = r.hjdongCd;
				if (!cd || seen.has(cd)) return [];

				const fromYmd = normYmd(r.fromDate);
				const toYmd = normYmd(r.toDate);
				if (!toYmd) return [];

				// 3) fromDate == toDate 이거나, toDate 가 오늘 또는 오늘+2
				const isSameFromTo = !!fromYmd && fromYmd === toYmd;
				const isTodayOrPlus2 = toYmd === todayStr || toYmd === todayPlus2Str;
				if (!isSameFromTo && !isTodayOrPlus2) return [];

				const demFeat = demMap.get(cd);
				if (!demFeat?.geometry) return [];

				seen.add(cd);
				return [
					{
						type: 'Feature' as const,
						properties: { ...r },
						geometry: demFeat.geometry,
					},
				];
			});

			return { type: 'FeatureCollection' as const, features };
		} catch (e) {
			logError('closedHjdongPolygonData build failed', e);
			return { type: 'FeatureCollection' as const, features: [] };
		}
	}, [demMap, gridVersion, subGridRef, gridTick]);

	// 신규행(I) 하이라이트 폴리곤
	const clickableHjdongPolygonData = useMemo(() => {
		try {
			if (gridTick === 0) {
				// 조회시 초기화 처리
				return { type: 'FeatureCollection' as const, features: [] };
			}
			const grid = subGridRef?.current;
			if (!grid) return { type: 'FeatureCollection' as const, features: [] };
			const rows = Array.isArray(grid.getGridData?.()) ? grid.getGridData() : [];
			const target = rows.filter((r: any) => r?.rowStatus === 'I' && !!r?.hjdongCd);
			const seen = new Set<string>();
			const features = target.flatMap((r: any) => {
				try {
					const cd = r.hjdongCd;
					if (!cd || seen.has(cd)) return [];
					const demFeat = demMap.get(cd);
					if (!demFeat?.geometry) return [];
					seen.add(cd);
					return [{ type: 'Feature' as const, properties: { ...r }, geometry: demFeat.geometry }];
				} catch {
					return [];
				}
			});
			return { type: 'FeatureCollection' as const, features };
		} catch (e) {
			logError('clickableHjdongPolygonData build failed', e);
			return { type: 'FeatureCollection' as const, features: [] };
		}
	}, [demMap, gridVersion, subGridRef, gridTick]);

	// 지도 클릭 가능 여부 처리
	const isClickableMap = useMemo(() => {
		return (
			!!(
				selectMasterGridRow &&
				selectMasterGridRow.rowStatus !== 'I' &&
				selectMasterGridRow?.clickedField === 'dlvdistrictNm'
			) || usageSet.size > 0
		);
	}, [selectMasterGridRow, usageSet]);

	// 행정동에 포함된  (wrapper 에 전달 -> 호버 객체 넣는 훅에 넘겨줘서 처리)
	const clickableHjdongList = useMemo(() => {
		if (!isClickableMap) return [];
		const propsList: any[] = [];
		for (const cd of usageSet) {
			const feat = demMap.get(cd);
			if (feat?.properties) propsList.push(feat.properties);
		}
		return propsList;
	}, [isClickableMap, usageSet, demMap]);

	// 2초 동안만 보여줄 행정동 클릭 하이라이트 on/off
	const [showClickedHighlight, setShowClickedHighlight] = useState(false);
	// 그리드에서 행정동 셀 클릭 시 2초 동안 하이라이트 표시
	useEffect(() => {
		try {
			if (selectSubGridRow) {
				setShowClickedHighlight(true);
				const t = window.setTimeout(() => setShowClickedHighlight(false), 2000);
				return () => clearTimeout(t);
			}
		} catch (e) {
			logError('clicked highlight timer failed', e);
		}
	}, [selectSubGridRow]);
	// 그리드 행정동 클릭 시 2초 후 사라지는 행정동 폴리곤 레이어 데이터
	const clickedHjdongPolygonSourceData = useMemo(() => {
		try {
			if (!showClickedHighlight) return { type: 'FeatureCollection' as const, features: [] };

			const field = selectSubGridRow?.clickedField;

			// 1) 시/도 단위 (ctpKorNm)
			if (field === 'ctpKorNm') {
				const sidoFeaturesList = listenerSource['sido']?.features ?? [];
				if (sidoFeaturesList.length > 0) {
					const filteredFeatures = sidoFeaturesList.filter(
						(item: any) => item?.properties?.ctpKorNm === selectSubGridRow?.ctpKorNm,
					);
					return { type: 'FeatureCollection' as const, features: filteredFeatures };
				} else {
					return { type: 'FeatureCollection' as const, features: [] };
				}
			}
			// 2) 시/군/구 단위 (sigKorNm)
			if (field === 'sigKorNm') {
				const sggFeaturesList = listenerSource['sgg']?.features ?? [];
				if (sggFeaturesList.length > 0) {
					const filteredFeatures = sggFeaturesList.filter(
						(item: any) =>
							item?.properties?.ctpKorNm === selectSubGridRow?.ctpKorNm &&
							item?.properties?.sigKorNm === selectSubGridRow?.sigKorNm,
					);
					return { type: 'FeatureCollection' as const, features: filteredFeatures };
				} else {
					return { type: 'FeatureCollection' as const, features: [] };
				}
			}
			// 3) 행정동 단위 (hjdongCd)
			if (field === 'hjdongCd') {
				const cd = selectSubGridRow?.hjdongCd;
				if (!cd) return { type: 'FeatureCollection' as const, features: [] };
				const demFeat = demMap.get(cd);
				if (!demFeat?.geometry) return { type: 'FeatureCollection' as const, features: [] };
				return {
					type: 'FeatureCollection' as const,
					features: [
						{
							type: 'Feature' as const,
							properties: { ...demFeat.properties },
							geometry: demFeat.geometry,
						},
					],
				};
			}
		} catch (e) {
			logError('clickedHjdongPolygonSourceData build failed', e);
			return { type: 'FeatureCollection' as const, features: [] };
		}
	}, [showClickedHighlight, selectSubGridRow, demMap, listenerSource]);

	// 센터 폴리곤 권역(1개일 때) 포커스
	useEffect(() => {
		try {
			const map = maps['delivery-district-map']?.mapbox;
			const fc: any = centerPolygonSourceData;
			if (!map || !fc?.features?.length) return;
			fitGeom(map, fc.features[0]?.geometry);
		} catch (e) {
			logError('center polygon focus failed', e);
		}
	}, [centerPolygonSourceData]);

	// 선택한 권역그룹 폴리곤 || 권역 폴리곤 포커스 처리
	useEffect(() => {
		try {
			const map = maps['delivery-district-map']?.mapbox;
			if (!map || !(selectMasterGridRow && selectMasterGridRow?.rowStatus !== 'I')) return;

			let fc: any;
			// 권역명 셀 클릭 시 권역 폴리곤 포커스 처리
			if (['dlvdistrictNm', 'popList'].includes(selectMasterGridRow?.clickedField)) {
				fc = selectedDistrictPolygonSourceData;
			}
			// // 일단 권역그룹 폴리곤 포커싱은 사용하지 않고 권역 폴리곤만 포커싱 처리
			// else if (selectMasterGridRow?.clickedField === 'popList') {
			// 	// poplist 클릭 시 권역그룹 폴리곤 포커스 처리
			// 	fc = selectedDistrictGroupPolygonSourceData;
			// }
			else return;

			if (!fc?.features?.length) return;
			fitGeom(map, fc.features[0]?.geometry);
		} catch (e) {
			logError('selected polygon focus failed', e);
		}
	}, [selectedDistrictGroupPolygonSourceData, selectedDistrictPolygonSourceData, selectMasterGridRow]);

	// 서브 그리드 행 선택 시 지도 포커스 처리
	useEffect(() => {
		try {
			const map = maps['delivery-district-map']?.mapbox;
			if (!map || !selectSubGridRow || selectSubGridRow?.rowStatus === 'I') return;

			// 시/도
			if (selectSubGridRow?.clickedField === 'ctpKorNm') {
				const filteredFeature = listenerSource['sido'].features.filter(
					(item: any) => item?.properties?.ctpKorNm === selectSubGridRow?.ctpKorNm,
				);
				fitGeom(map, filteredFeature?.[0]?.geometry);
			}
			// 시/군/구
			if (selectSubGridRow?.clickedField === 'sigKorNm') {
				const filteredFeature = listenerSource['sgg'].features.filter(
					(item: any) =>
						item?.properties?.ctpKorNm === selectSubGridRow?.ctpKorNm &&
						item?.properties?.sigKorNm === selectSubGridRow?.sigKorNm,
				);
				fitGeom(map, filteredFeature?.[0]?.geometry);
			}
			// 행정동
			if (selectSubGridRow?.clickedField === 'hjdongCd') {
				fitGeom(map, demMap.get(selectSubGridRow?.hjdongCd)?.geometry);
			}
		} catch (e) {
			logError('sub grid focus failed', e);
		}
	}, [selectSubGridRow, maps, demMap]);

	// ── 지도 클릭 가드 체크 ──
	const validateMapClick = useCallback(() => {
		if (
			!tabSearchConditions ||
			!(tabSearchConditions?.effectiveDate && dayjs(tabSearchConditions?.effectiveDate).isSame(dayjs(), 'day'))
		) {
			showAlert(null, `${dayjs().format('YYYY-MM-DD')}(현재일)로 조회 후 입력/수정/삭제가 가능합니다.`);
			return false;
		}
		if (!selectMasterGridRow) {
			showAlert(null, '권역 선택 후 행정동 등록이 가능합니다.');
			return false;
		}
		if (selectMasterGridRow?.initialDelYn === true) {
			showAlert(
				null,
				'선택한 권역 그리드 행의 사용여부가 중단 상태 이므로 지도를 선택하여 추가 및 수정할 수 없습니다.',
			);
			return false;
		}
		if (selectMasterGridRow?.rowStatus === 'I') return false;
		return true;
	}, [tabSearchConditions, selectMasterGridRow]);

	// ── 날짜 파싱 유틸 ──
	const parseYmd = useCallback((v: any) => {
		if (!v) return null;
		const s = String(v).replaceAll('-', '');
		const d = dayjs(s, 'YYYYMMDD', true);
		return d.isValid() ? d : null;
	}, []);

	const normalizeYmd = useCallback((v: any) => String(v ?? '').replace(/-/g, ''), []);

	const toYmdDayjs = useCallback((v: any) => dayjs(normalizeYmd(v), 'YYYYMMDD', true), [normalizeYmd]);

	// ── 초기값 생성 ──
	const getInitialValues = useCallback(
		(obj: any) => {
			const todayPlus3 = dayjs().add(3, 'day');
			const todayPlus3Str = todayPlus3.format('YYYYMMDD');
			const todayPlus2 = dayjs().add(2, 'day');

			const masterFrom = parseYmd(selectMasterGridRow?.fromDate);
			const masterTo = dayjs(FOREVER_DATE, 'YYYYMMDD', true);

			try {
				const selectedFrom = masterFrom ?? todayPlus3; // dayjs 객체
				let from = selectedFrom.isBefore(todayPlus3) ? todayPlus3 : selectedFrom;
				const tempTo = dayjs(obj?.toDate, 'YYYYMMDD', true);
				const to = tempTo ?? masterTo ?? todayPlus2; // dayjs 객체

				if (obj?.fromDate) {
					const raw = String(obj.fromDate).replace(/-/g, '');
					const parsed = dayjs(raw, 'YYYYMMDD', true);

					if (parsed.isValid() && parsed.isBefore(todayPlus3)) {
						// fromDate 가 오늘+3일보다 이전이면 → 오늘+3일로 보정
						from = todayPlus3;
					} else if (parsed.isValid()) {
						// 유효하고 오늘+3일 이후/동일이면 그대로 사용
						from = parsed;
					} else {
						// 파싱 실패 시 안전하게 오늘+3일로 보정
						from = todayPlus3;
					}

					if (obj?.toDate) {
						const raw = String(obj.toDate).replace(/-/g, '');
						const parsed = dayjs(raw, 'YYYYMMDD', true);
						// 종료일자가 오늘+3일 이전이면 처리 안함
						if (parsed.isValid() && parsed.isBefore(todayPlus3)) {
							const centerObj = commonCodeList.find(c => c.comCd === tabSearchConditions?.dccode);
							// 중첩 템플릿 리터럴 분리
							const centerName = centerObj ? `[${centerObj?.comCd}]${centerObj?.cdNm}\n` : '';

							const firstDongName = obj?.hjdongNm ?? '행정동명';

							const message =
								`일부 행정동의 적용기간이 설정 가능한 범위를 벗어났습니다.\n` +
								`센터 관할권역 행정동 기간 및 권역 기간을 확인 후 다시 설정해 주세요.\n\n` +
								`센터 : ${centerName}\n` +
								`대상 행정동 : ${firstDongName}`;

							showAlert(null, message);

							return;
						}
					}
				}

				// fromDate > toDate 이면 from 을 오늘+3일로 세팅
				if (from.isAfter(to)) {
					from = todayPlus3;
				}

				const fromDate = from.format('YYYYMMDD');
				const toDate = to.format('YYYYMMDD');

				const isDeYn = dayjs(obj?.toDate || toDate).isBefore(dayjs(FOREVER_DATE));
				const delYn = isDeYn ? 'Y' : 'N';

				return {
					rowStatus: 'I',
					serialkey: '',
					hjdongCd: obj?.hjdongCd || '',
					hjdongNm: obj?.hjdongNm || '',
					ctpKorNm: obj?.ctpKorNm || '',
					sigKorNm: obj?.sigKorNm || '',
					fromDate,
					toDate,
					delYn: delYn,
					initialDelYn: false,
				};
			} catch {
				return {
					rowStatus: 'I',
					serialkey: '',
					hjdongCd: obj?.hjdongCd || '',
					hjdongNm: obj?.hjdongNm || '',
					ctpKorNm: obj?.ctpKorNm || '',
					sigKorNm: obj?.sigKorNm || '',
					fromDate: todayPlus3Str,
					toDate: FOREVER_DATE,
					delYn: 'N',
					initialDelYn: false,
				};
			}
		},
		[selectMasterGridRow, parseYmd, commonCodeList, tabSearchConditions],
	);

	// ── 그리드 데이터 취득 ──
	const getGridData = useCallback((grid: any) => {
		try {
			const data = grid.getGridData?.();
			if (!Array.isArray(data)) return [];
			return data.map((item: any, index: number) => ({ ...item, rowIndex: index }));
		} catch {
			return [];
		}
	}, []);

	// ── rowIdField 취득 ──
	const getRowIdField = useCallback((grid: any) => grid.props?.gridProps?.rowIdField ?? '_$uid', []);

	// ── 행 삭제 ──
	const removeRowsByIds = useCallback(
		(grid: any, rows: any[]) => {
			try {
				if (!rows.length) return;
				const rowIdField = getRowIdField(grid);
				const ids = rows.map((r: any) => r[rowIdField] ?? r._$uid).filter(Boolean);
				if (ids.length) grid.removeRowByRowId(ids);
			} catch (e) {
				//console.warn('removeRowByRowId failed:', e);
			}
		},
		[getRowIdField],
	);

	// ── 그리드 행 포커스 ──
	const focusGridRow = useCallback(
		(rowIndex: number) => {
			try {
				const grid = subGridRef?.current;
				if (!grid) return;

				// 유효하지 않은 인덱스면 그냥 그리드에 포커스만
				if (rowIndex == null || rowIndex < 0) {
					grid.setFocus?.();
					return;
				}

				// 기존 선택된 컬럼 유지 (없으면 0번 컬럼)
				const selected = grid.getSelectedIndex?.() ?? [];
				const colIndex = selected[1] ?? 0;

				// 행 선택 + 스크롤 이동 + 포커스
				grid.setSelectionByIndex?.(rowIndex, colIndex);
				grid.setRowPosition?.(rowIndex);
				grid.setFocus?.();
			} catch (error) {
				//console.warn('focusGridRow failed:', error);
			}
		},
		[subGridRef],
	);

	// ── 개별 동(dem) 행 액션 분기 ──
	const resolveDemRowAction = useCallback(
		(params: {
			grid: any;
			iRows: any[];
			rRows: any[];
			uRows: any[];
			allRowsForCd: any[];
			clickedHjdongCd: string;
			periods: any[];
			currentGridData: any[];
		}): boolean => {
			const { grid, iRows, rRows, uRows, allRowsForCd, clickedHjdongCd, periods, currentGridData } = params;

			const todayPlus2 = dayjs().add(2, 'day');
			const todayPlus2Str = todayPlus2.format('YYYYMMDD');

			const findPeriodForRow = (row: any) => {
				// (우선) row가 이미 hidden periodFrom/To를 들고 있으면 그걸 최우선 사용
				const storedPf = normalizeYmd(row?.periodFromDate);
				const storedPt = normalizeYmd(row?.periodToDate);
				if (storedPf && storedPt) {
					const hit = periods.find((p: any) => p?.periodFromDate === storedPf && p?.periodToDate === storedPt);
					if (hit) return hit;
				}

				const rf = toYmdDayjs(row?.fromDate);
				const rt = toYmdDayjs(row?.toDate);

				if (rf.isValid() && rt.isValid()) {
					// 포함 관계 매칭
					const hit = periods.find((p: any) => !rf.isBefore(p.__pf) && !rt.isAfter(p.__pt));
					if (hit) return hit;

					// (안전망) 시작일이 period 안에 들어오는 가장 가까운 후보
					const hit2 = periods.find((p: any) => !rf.isBefore(p.__pf) && !rf.isAfter(p.__pt));
					if (hit2) return hit2;
				}

				return periods[0];
			};

			const computeEndFromStr = (periodFromDate: string) => {
				// max(periodFromDate, 오늘+2)
				const pf = toYmdDayjs(periodFromDate);
				const t2 = toYmdDayjs(todayPlus2Str);
				const v = t2.isAfter(pf) ? t2 : pf;
				return v.format('YYYYMMDD');
			};

			const removeIRows = () => {
				try {
					removeRowsByIds(grid, iRows);
				} catch (e) {
					//console.warn('removeRowsByIds failed (dem):', e);
				}
			};

			const restoreURows = (rows: any[]) => {
				rows.forEach((r: any) => {
					try {
						grid.restoreEditedRows(r.rowIndex);
					} catch (e) {
						//console.warn('restoreEditedRows failed (dem):', e);
					}
				});
			};

			const endRRowsToU = (rows: any[]) => {
				rows.forEach((r: any) => {
					try {
						// toDate만 변경, fromDate는 유지 (구/시 단위 로직과 동일)
						let changedToDate = todayPlus2Str;
						if (dayjs(todayPlus2Str).isBefore(dayjs(r?.fromDate))) changedToDate = r?.fromDate;

						if (r?.toDate === changedToDate) {
							grid.restoreEditedRows(r.rowIndex);
						} else {
							grid.setCellValue(r.rowIndex, 'toDate', changedToDate);
							grid.setCellValue(r.rowIndex, 'delYn', 'Y');
							grid.setCellValue(r.rowIndex, 'rowStatus', 'U');
						}
					} catch (e) {
						//console.warn('setCellValue failed (dem R→U):', e);
					}
				});
			};

			const addNewRows = districtTabDatasState?.hjdongPeriodList
				.filter((item: any) => item?.hjdongCd === clickedHjdongCd)
				.filter(
					(item: any) =>
						!allRowsForCd.some(
							(r: any) =>
								r?.hjdongCd === item?.hjdongCd &&
								dayjs(r?.fromDate).isSameOrAfter(dayjs(item?.fromDate)) &&
								dayjs(r?.toDate).isSameOrBefore(dayjs(item?.toDate)),
						),
				);

			// Case 6) 둘다 U → 원복
			if (uRows.length >= 2 && rRows.length === 0 && iRows.length === 0) {
				restoreURows(uRows);
				bumpGridTick();
				focusGridRow(uRows[0]?.rowIndex ?? -1);
				return true;
			}

			// Case 1) I 2개 → 둘다 삭제
			if (iRows.length >= 2 && rRows.length === 0 && uRows.length === 0) {
				removeIRows();
				bumpGridTick();
				focusGridRow(-1);
				return true;
			}

			// Case 5) R 2개 → 둘다 U(중단)
			if (rRows.length >= 2 && iRows.length === 0) {
				endRRowsToU(rRows);
				bumpGridTick();
				focusGridRow(rRows[0]?.rowIndex ?? -1);
				return true;
			}

			// Case 4) R 1개 + I 1개 → I 삭제, R은 U로 전환
			if (rRows.length === 1 && iRows.length === 1) {
				removeIRows();
				endRRowsToU(rRows);
				bumpGridTick();
				focusGridRow(rRows[0]?.rowIndex ?? -1);
				return true;
			}

			// 안전망(단일 period 토글)
			if (rRows.length === 1 && iRows.length === 0 && uRows.length === 0) {
				endRRowsToU(rRows);
				bumpGridTick();
				focusGridRow(rRows[0]?.rowIndex ?? -1);
				return true;
			}
			if (iRows.length === 1 && rRows.length === 0 && uRows.length === 0) {
				removeIRows();
				bumpGridTick();
				focusGridRow(-1);
				return true;
			}
			if (uRows.length === 1 && rRows.length === 0 && iRows.length === 0) {
				restoreURows(uRows);
				bumpGridTick();
				focusGridRow(uRows[0]?.rowIndex ?? -1);
				return true;
			}

			// 같은 행정동 미등록 1개 이상 존재시 신규 등록처리
			if (addNewRows.length > 0) {
				addNewRows.forEach((item: any) => {
					grid.addRow(
						getInitialValues({
							...item,
							fromDate: item?.fromDate || dayjs().add(3, 'days').format('YYYYMMDD'),
							toDate: item?.toDate || FOREVER_DATE,
						}),
					);
				});
				return true;
			}

			return false;
		},
		[districtTabDatasState, normalizeYmd, toYmdDayjs, removeRowsByIds, bumpGridTick, focusGridRow, getInitialValues],
	);

	// ── 개별 period 행 추가 처리 ──
	const processAddRow = useCallback(
		(item: any, grid: any, currentGridData: any[], todayPlus3: dayjs.Dayjs, todayPlus3Str: string) => {
			const hjdongCd = item?.hjdongCd;
			if (!hjdongCd) return;

			const endedRowsForCd = currentGridData
				.filter((r: any) => r?.hjdongCd === hjdongCd && r?.initialDelYn === true)
				.sort((a: any, b: any) => dayjs(b?.toDate).diff(dayjs(a?.toDate)));

			const fromDateOverride =
				endedRowsForCd.length > 0 ? dayjs(endedRowsForCd[0]?.toDate).add(1, 'day').format('YYYYMMDD') : undefined;

			const pf = normalizeYmd(item?.periodFromDate ?? item?.fromDate) || todayPlus3Str;
			const pt = normalizeYmd(item?.periodToDate ?? item?.toDate) || FOREVER_DATE;

			// fromDate = max(periodFromDate, today+3, fromDateOverride)
			let from = toYmdDayjs(pf);
			if (!from.isValid() || from.isBefore(todayPlus3)) from = todayPlus3;
			if (fromDateOverride) {
				const o = toYmdDayjs(fromDateOverride);
				if (o.isValid() && o.isAfter(from)) from = o;
			}

			const to = toYmdDayjs(pt);
			if (to.isValid() && to.isBefore(from)) return;

			const base = getInitialValues({
				...item,
				fromDate: from.format('YYYYMMDD'),
				toDate: pt,
			});

			grid.addRow({
				...base,
				periodFromDate: pf,
				periodToDate: pt,
			});
		},
		[normalizeYmd, toYmdDayjs, getInitialValues],
	);

	// ── dem 레벨 클릭 처리 ──
	const handleDemLevelClick = useCallback(
		(properties: any, grid: any, currentGridData: any[]) => {
			const clickedHjdongCd = properties?.hjdongCd;

			const periodListRaw = (districtTabDatasState?.hjdongPeriodList ?? []).filter(
				(p: any) => p?.hjdongCd === clickedHjdongCd,
			);

			const periods =
				periodListRaw.length > 0
					? periodListRaw
							.map((p: any) => {
								const periodFromDate = normalizeYmd(p?.periodFromDate ?? p?.fromDate);
								const periodToDate = normalizeYmd(p?.periodToDate ?? p?.toDate ?? FOREVER_DATE);
								const pf = toYmdDayjs(periodFromDate);
								const pt = toYmdDayjs(periodToDate);
								if (!pf.isValid() || !pt.isValid()) return null;
								return {
									...p,
									hjdongCd: clickedHjdongCd,
									periodFromDate,
									periodToDate,
									__pf: pf,
									__pt: pt,
								};
							})
							.filter(Boolean)
					: [];

			const allRowsForCd = currentGridData.filter((r: any) => r?.hjdongCd === clickedHjdongCd);

			if (allRowsForCd.length > 0) {
				const iRows = allRowsForCd.filter((r: any) => r?.rowStatus === 'I');
				const rRows = allRowsForCd
					.filter((r: any) => r?.rowStatus === 'R')
					.filter((r: any) => !dayjs(r?.toDate).isBefore(dayjs(FOREVER_DATE)));
				const uRows = allRowsForCd.filter((r: any) => r?.rowStatus === 'U');

				const handled = resolveDemRowAction({
					grid,
					iRows,
					rRows,
					uRows,
					allRowsForCd,
					clickedHjdongCd,
					periods,
					currentGridData,
				});

				if (handled) return;
			}

			// 활성행은 없고, 과거에 중단된(initialDelYn === true) 행만 있는 경우
			const endedRows = currentGridData
				.filter((r: any) => r?.hjdongCd === clickedHjdongCd && r?.initialDelYn === true)
				.sort((a: any, b: any) => dayjs(b?.toDate).diff(dayjs(a?.toDate))); // 종료일 내림차순

			let fromDateOverride: string | undefined;
			if (endedRows.length > 0) {
				// 마지막 종료일 + 1일을 시작일로 사용
				fromDateOverride = dayjs(endedRows[0]?.toDate).add(1, 'day').format('YYYYMMDD');
			}

			try {
				const addRowsData = (districtTabDatasState?.hjdongPeriodList ?? []).filter(
					(item: any) => item?.hjdongCd === properties?.hjdongCd,
				);
				addRowsData.forEach((item: any) => {
					const fromDate = item?.fromDate || dayjs().add(3, 'days').format('YYYYMMDD');
					const toDate = item?.toDate || FOREVER_DATE;
					grid.addRow(
						getInitialValues({
							...item,
							fromDate: fromDate,
							toDate: toDate,
						}),
					);
				});
				bumpGridTick();
				// 새 행 인덱스를 정확히 모르면 -1 로 그리드 포커스만 주는 기존 패턴 유지
				focusGridRow(-1);
			} catch (e) {
				//console.warn('addRow failed:', e);
			}
		},
		[
			districtTabDatasState,
			normalizeYmd,
			toYmdDayjs,
			resolveDemRowAction,
			getInitialValues,
			bumpGridTick,
			focusGridRow,
		],
	);

	// ── 구/시 단위 그룹 클릭 처리 ──
	const handleGroupLevelClick = useCallback(
		async (groupKey: 'sigKorNm' | 'ctpKorNm', properties: any, grid: any, currentGridData: any[]) => {
			if (!Object.hasOwn(properties, groupKey)) return;

			const todayPlus3 = dayjs().add(3, 'day');
			const todayPlus3Str = todayPlus3.format('YYYYMMDD');
			const todayPlus2Str = dayjs().add(2, 'day').format('YYYYMMDD');

			const isRowInsidePeriod = (row: any, period: any) => {
				if (!row || !period) return false;
				if (row?.hjdongCd !== period?.hjdongCd) return false;

				const rowFrom = toYmdDayjs(row?.periodFromDate ?? row?.fromDate);
				const rowTo = toYmdDayjs(row?.periodToDate ?? row?.toDate);
				const perFrom = toYmdDayjs(period?.periodFromDate ?? period?.fromDate);
				const perTo = toYmdDayjs(period?.periodToDate ?? period?.toDate);

				if (!rowFrom.isValid() || !rowTo.isValid() || !perFrom.isValid() || !perTo.isValid()) return false;
				return !rowFrom.isBefore(perFrom) && !rowTo.isAfter(perTo);
			};

			// 구 단위(sigKorNm)일 때는 시/도(ctpKorNm)도 함께 확인해야 함 (같은 구 이름이 다른 시/도에 존재할 수 있음)
			// 1) 클릭한 레벨에 맞는 필터 함수 만들기
			const filterPredicate = (item: any) => {
				if (groupKey === 'sigKorNm') {
					return item?.sigKorNm === properties?.sigKorNm && item?.ctpKorNm === properties?.ctpKorNm;
				}
				return item?.[groupKey] === properties?.[groupKey];
			};

			if (!(clickableHjdongList ?? []).some(filterPredicate)) return;

			// 2) 클릭 가능한 행정동 리스트 중에서 이 구/시에 해당하는 행정동들만 추출
			const filteredList = (clickableHjdongList ?? []).filter(filterPredicate);
			// 클릭한 구/시에 해당하는 행정동 코드 세트 생성
			const targetHjdongCdSet = new Set(filteredList.map(x => x?.hjdongCd).filter(Boolean));

			// 동별 period 목록 (없으면 fallback 1개)
			const getPeriodsForCd = (hjdongCd: string, base: any) => {
				const raws = (districtTabDatasState?.hjdongPeriodList ?? [])
					.filter((p: any) => p?.hjdongCd === hjdongCd)
					.filter((p: any) => !dayjs(p?.toDate).isBefore(dayjs(todayPlus3Str)));

				const validPeriods = raws.map((p: any) => ({
					...base,
					...p,
					hjdongCd,
					periodFromDate: normalizeYmd(p?.periodFromDate ?? p?.fromDate),
					periodToDate: normalizeYmd(p?.periodToDate ?? p?.toDate ?? FOREVER_DATE),
					fromDate: normalizeYmd(p?.periodFromDate ?? p?.fromDate),
					toDate: normalizeYmd(p?.periodToDate ?? p?.toDate ?? FOREVER_DATE),
				}));

				const tempPeriods = (districtTabDatasState?.hjdongPeriodList ?? [])
					.filter((p: any) => p?.hjdongCd === hjdongCd)
					.filter((p: any) => dayjs(p?.toDate).isBefore(dayjs(todayPlus3Str)));

				const inValidPeriods = tempPeriods.map((p: any) => ({
					...base,
					...p,
					hjdongCd,
					periodFromDate: normalizeYmd(p?.periodFromDate ?? p?.fromDate),
					periodToDate: normalizeYmd(p?.periodToDate ?? p?.toDate ?? FOREVER_DATE),
					fromDate: normalizeYmd(p?.periodFromDate ?? p?.fromDate),
					toDate: normalizeYmd(p?.periodToDate ?? p?.toDate ?? FOREVER_DATE),
				}));

				return { validPeriods, inValidPeriods };
			};

			// 3) 이 구/시에 속한 행정동이 "현재 그리드에 모두 들어와 있는지" 체크
			//    활성행(initialDelYn === false) 기준으로만 포함 여부 판단 (센터권역과 동일)
			//    isAllIncluded: "동이 들어있냐"가 아니라 "동의 period가 전부 들어있냐"
			const isAllIncluded = filteredList.every((base: any) => {
				const cd = base?.hjdongCd;
				if (!cd) return true;

				const { validPeriods: periods } = getPeriodsForCd(cd, base);
				const activeRowsForCd = currentGridData.filter((r: any) => r?.hjdongCd === cd);

				return periods.every((period: any) => activeRowsForCd.some((r: any) => isRowInsidePeriod(r, period)));
			});

			// 누락된 period만 flat list로 모으기
			const missingPeriodRows: any[] = [];
			const inValidPeriodRows: any[] = [];
			filteredList.forEach((base: any) => {
				const cd = base?.hjdongCd;
				if (!cd) return;

				const { validPeriods: periods, inValidPeriods } = getPeriodsForCd(cd, base);
				const activeRowsForCd = currentGridData.filter((r: any) => r?.hjdongCd === cd && r?.initialDelYn === false);

				periods.forEach((period: any) => {
					const exists = activeRowsForCd.some((r: any) => isRowInsidePeriod(r, period));
					if (!exists) missingPeriodRows.push(period);
				});
				inValidPeriods.forEach((period: any) => {
					const exists = activeRowsForCd.some((r: any) => isRowInsidePeriod(r, period));
					if (!exists) inValidPeriodRows.push(period);
				});
			});

			// period 단위 추가 (기존 addMissingRows 스타일: CHUNK + endedOverride 유지)
			const addMissingRowsPeriod = async (rows: any[]) => {
				try {
					const CHUNK = 20;
					for (let i = 0; i < rows.length; i += CHUNK) {
						const chunk = rows.slice(i, i + CHUNK);
						chunk.forEach((item: any) => processAddRow(item, grid, currentGridData, todayPlus3, todayPlus3Str));
						await new Promise(r => setTimeout(r, 0));
					}
				} catch (e) {
					//console.warn('addMissingRowsPeriod failed:', e);
				}
			};
			// === 기존 "한번에 처리" 흐름 유지 ===
			if (!isAllIncluded) {
				// [상태 A] 누락 추가 + U 원복
				await addMissingRowsPeriod(missingPeriodRows);

				const latestGrid = subGridRef.current;
				if (!latestGrid) return;

				const ruList = currentGridData
					.map((row: any, idx: number) => ({ ...row, rowIndex: idx }))
					.filter((r: any) => r?.rowStatus === 'U' && targetHjdongCdSet.has(r?.hjdongCd));

				ruList.forEach(r => {
					try {
						latestGrid.restoreEditedRows(r.rowIndex);
					} catch (e) {
						//console.warn('restoreEditedRows failed (group):', e);
					}
				});

				bumpGridTick();
				focusGridRow(ruList[0]?.rowIndex ?? -1);

				// 추가 시 유효하지 않은 행정동 얼럿 처리
				if (inValidPeriodRows.length > 0) {
					const centerObj = commonCodeList.find(c => c.comCd === tabSearchConditions?.dccode);
					// 중첩 템플릿 리터럴 분리
					const centerName = centerObj ? `[${centerObj?.comCd}]${centerObj?.cdNm}\n` : '';

					const firstDongName =
						inValidPeriodRows[0]?.hjdongNm ?? inValidPeriodRows[0]?.dongNm ?? inValidPeriodRows[0]?.name ?? '행정동명';

					const extraCount = Math.max(0, inValidPeriodRows.length - 1);

					const message =
						`일부 행정동의 적용기간이 설정 가능한 범위를 벗어났습니다.\n` +
						`센터 관할권역 행정동 기간 및 권역 기간을 확인 후 다시 설정해 주세요.\n\n` +
						`센터 : ${centerName}\n` +
						`대상 행정동 : ${firstDongName}` +
						(extraCount > 0 ? ` 외 ${extraCount}건` : '');

					showAlert(null, message);
					return;
				}

				return;
			}

			// [상태 B] 기존 종료/원복 토글 로직 그대로
			const iList = currentGridData.filter((r: any) => r?.rowStatus === 'I' && targetHjdongCdSet.has(r?.hjdongCd));
			removeRowsByIds(grid, iList);

			const ruList = currentGridData
				.map((r: any, idx: number) => ({ ...r, rowIndex: idx }))
				.filter(
					(r: any) =>
						(r?.rowStatus === 'R' || r?.rowStatus === 'U') &&
						targetHjdongCdSet.has(r?.hjdongCd) &&
						r?.initialDelYn === false,
				);

			const latestGrid = subGridRef.current;
			if (latestGrid) {
				ruList.forEach(r => {
					try {
						let changedToDate = todayPlus2Str;
						if (dayjs(todayPlus2Str).isBefore(dayjs(r?.fromDate))) changedToDate = r?.fromDate;

						if (r?.toDate === changedToDate) {
							latestGrid.restoreEditedRows(r.rowIndex);
						} else {
							latestGrid.setCellValue(r.rowIndex, 'toDate', changedToDate);
							latestGrid.setCellValue(r.rowIndex, 'delYn', 'Y');
							latestGrid.setCellValue(r.rowIndex, 'rowStatus', 'U');
						}
					} catch (e) {
						//console.warn('setCellValue failed (group off):', e);
					}
				});
			}

			bumpGridTick();
			focusGridRow(ruList[0]?.rowIndex);
		},
		[
			clickableHjdongList,
			districtTabDatasState,
			normalizeYmd,
			toYmdDayjs,
			removeRowsByIds,
			getInitialValues,
			processAddRow,
			bumpGridTick,
			focusGridRow,
			subGridRef,
			commonCodeList,
			tabSearchConditions,
		],
	);

	// ── 지도 클릭 핸들러 (오케스트레이터) ──
	const handleMapClick = useCallback(
		async (event: any) => {
			const grid = subGridRef?.current;
			if (!grid?.getGridData || !validateMapClick()) return;

			// 메인 그리드가 없거나 신규행(I)이면 서브 편집 불가
			if (!selectMasterGridRow || selectMasterGridRow?.rowStatus === 'I') return;

			const features = Array.isArray(event?.features) ? event.features : [];
			if (!features.length) return;

			const clickedLayer = features.find((f: any) => f?.layer?.id === 'base-fill-layer');
			const properties = clickedLayer?.properties;
			if (!properties) return;
			const level = getLevelFromHjdongCd(properties.hjdongCd);

			if (!Array.isArray(clickableHjdongList) || !clickableHjdongList.length) return;

			const currentGridData = getGridData(grid);

			// 개별 동 클릭 처리
			if (level === 'dem') {
				if (!(clickableHjdongList ?? []).some(x => x?.hjdongNm === properties?.hjdongNm)) return;
				handleDemLevelClick(properties, grid, currentGridData);
				return;
			}

			// 구 단위
			if (level === 'sgg') {
				await handleGroupLevelClick('sigKorNm', properties, grid, currentGridData);
				return;
			}

			// 시 단위
			if (level === 'sido') {
				try {
					dispatchSetLoading(true);
					await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
					await handleGroupLevelClick('ctpKorNm', properties, grid, currentGridData);
				} finally {
					dispatchSetLoading(false);
				}
				return;
			}
		},
		[
			selectMasterGridRow,
			clickableHjdongList,
			subGridRef,
			validateMapClick,
			getGridData,
			handleDemLevelClick,
			handleGroupLevelClick,
		],
	);

	return (
		<div style={{ height: 'calc(100% - 50px)', width: '100%' }}>
			<WrapperDistrictBoundaries
				id="delivery-district-map"
				isUsingMapSearchSelect={true}
				isUsingHover={isClickableMap}
				clickableHjdongList={clickableHjdongList}
				onDblClick={handleMapClick}
				interactiveLayerIds={[
					'center-polygon-layer',
					'center-polygon-line-layer',
					'district-group-polygon-layer',
					'district-group-polygon-line-layer',
					'district-polygon-layer',
					'district-polygon-line-layer',
					'un-usage-hjdong-polygon-layer',
					'un-usage-hjdong-polygon-line-layer',
				]}
				textLayerChildren={
					<>
						{/* <Source id="district-group-text-source" type="geojson" data={districtGroupTextFC as any}>
							<Layer
								id="district-group-text-layer"
								type="symbol"
								layout={districtTextLayerStyle.layout as any}
								paint={districtTextLayerStyle.paint}
							/>
						</Source> */}
						{/* <Source id="selected-district-group-text-source" type="geojson" data={selectedDistrictGroupTextFC as any}>
							<Layer
								id="selected-district-group-text-layer"
								type="symbol"
								layout={SelectedDistrictTextLayerStyle.layout as any}
								paint={SelectedDistrictTextLayerStyle.paint}
							/>
						</Source> */}
						<Source id="district-text-source" type="geojson" data={districtTextFC as any}>
							<Layer
								id="district-text-layer"
								type="symbol"
								layout={{ ...districtTextLayerStyle.layout, 'text-offset': [0, 2] } as any}
								paint={districtTextLayerStyle.paint}
							/>
						</Source>
						<Source id="selected-district-text-source" type="geojson" data={selectedDistrictTextFC as any}>
							<Layer
								id="selected-district-text-layer"
								type="symbol"
								layout={{ ...SelectedDistrictTextLayerStyle.layout, 'text-offset': [0, 2] } as any}
								paint={SelectedDistrictTextLayerStyle.paint}
							/>
						</Source>
					</>
				}
			>
				{/* 센터 폴리곤 레이어 */}
				<Source id="center-polygon-source" type="geojson" data={centerPolygonSourceData}>
					<Layer
						id="center-polygon-layer"
						type="fill"
						paint={{
							'fill-color': CenterPloygonLayerStyle.fillColor,
							'fill-opacity': 1,
						}}
					/>
					<Layer
						id="center-polygon-line-layer"
						type="line"
						paint={{
							'line-color': CenterPloygonLayerStyle.lineColor,
							'line-width': 1,
						}}
					/>
				</Source>
				{/* 권역그룹 폴리곤 레이어 */}
				<Source id="district-group-polygon-source" type="geojson" data={districtGroupPolygonSourceData}>
					<Layer
						id="district-group-polygon-layer"
						type="fill"
						paint={{
							'fill-color': GroupDistirctPloygonLayerStyle.fillColor,
							'fill-opacity': 1,
						}}
					/>
					<Layer
						id="district-group-polygon-line-layer"
						type="line"
						paint={{
							'line-color': GroupDistirctPloygonLayerStyle.lineColor,
							'line-width': 4,
						}}
					/>
				</Source>
				{/* 선택된 권역그룹 폴리곤 레이어 */}
				{/* <Source
					id="selected-district-group-polygon-source"
					type="geojson"
					data={selectedDistrictGroupPolygonSourceData}
				>
					<Layer
						id="selected-district-group-polygon-layer"
						type="fill"
						paint={{
							'fill-color': SelectedGroupDistirctPloygonLayerStyle.fillColor,
							'fill-opacity': 1,
						}}
					/>
					<Layer
						id="selected-district-group-polygon-line-layer"
						type="line"
						paint={{
							'line-color': SelectedGroupDistirctPloygonLayerStyle.lineColor,
							'line-width': 5,
						}}
					/>
				</Source> */}
				{/* 권역 폴리곤 레이어 */}
				<Source id="district-polygon-source" type="geojson" data={districtPolygonSourceData}>
					<Layer
						id="district-polygon-layer"
						type="fill"
						paint={{
							'fill-color': DistrictPloygonLayerStyle.fillColor,
							'fill-opacity': 1,
						}}
					/>
					<Layer
						id="district-polygon-line-layer"
						type="line"
						paint={{
							'line-color': DistrictPloygonLayerStyle.lineColor,
							'line-width': 3,
						}}
					/>
				</Source>
				{/* 선택된 권역 폴리곤 레이어 */}
				<Source id="selected-district-polygon-source" type="geojson" data={selectedDistrictPolygonSourceData}>
					<Layer
						id="selected-district-polygon-layer"
						type="fill"
						paint={{
							'fill-color': SelectedDistrictPloygonLayerStyle.fillColor,
							'fill-opacity': 1,
						}}
					/>
					<Layer
						id="selected-district-polygon-line-layer"
						type="line"
						paint={{
							'line-color': SelectedDistrictPloygonLayerStyle.lineColor,
							'line-width': 4,
						}}
					/>
				</Source>
				{/* 미사용 행정동 폴리곤 레이어 */}
				<Source id="un-usage-hjdong-polygon-source" type="geojson" data={unUsageHjdongPolygonSourceData}>
					<Layer
						id="un-usage-hjdong-polygon-layer"
						type="fill"
						paint={{
							'fill-color': UnusageHjdongPloygonLayerStyle.fillColor,
							'fill-opacity': 1,
						}}
					/>
					<Layer
						id="un-usage-hjdong-polygon-line-layer"
						type="line"
						paint={{
							'line-color': UnusageHjdongPloygonLayerStyle.lineColor,
							'line-width': 1,
						}}
					/>
				</Source>
				{/* 기존 행정동의 종료일자가 오늘 날짜 + 2 이거나 오늘 날짜인 경우 보라색 폴리곤 표시 */}
				<Source id="closed-hjdong-polygon-source" type="geojson" data={closedHjdongPolygonData}>
					<Layer
						id="closed-hjdong-polygon-layer"
						type="fill"
						paint={{
							'fill-color': CenterDistrictClosedHjdongPloygonLayerStyle.fillColor, // 옅은 보라색
							'fill-opacity': 0.7,
						}}
					/>
					<Layer
						id="closed-hjdong-polygon-line-layer"
						type="line"
						paint={{
							'line-color': CenterDistrictClosedHjdongPloygonLayerStyle.lineColor, // 조금 진한 보라색
							'line-width': 1,
						}}
					/>
				</Source>
				{/* 센터 권역 그리드 신규행 폴리곤 연동 레이어 */}
				<Source id="clickable-hjdong-polygon-source" type="geojson" data={clickableHjdongPolygonData}>
					<Layer
						id="clickable-hjdong-polygon-layer"
						type="fill"
						paint={{
							'fill-color': CenterDistrictNewHjdongPloygonLayerStyle.fillColor,
							'fill-opacity': 0.45,
						}}
					/>
					<Layer
						id="clickable-hjdong-polygon-line-layer"
						type="line"
						paint={{
							'line-color': CenterDistrictNewHjdongPloygonLayerStyle.lineColor,
							'line-width': 1,
						}}
					/>
				</Source>
				{/* 2 초 동안만 보여줄 행정동 그리드(서브그리드) 권역 폴리곤 레이어 */}
				<Source id="clicked-2sec-hjdong-polygon-source" type="geojson" data={clickedHjdongPolygonSourceData}>
					<Layer
						id="clicked-2sec-hjdong-polygon-layer"
						type="fill"
						paint={{
							'fill-color': CenterDistrictClickedHjdongPloygonLayerStyle.fillColor,
							'fill-opacity': 0.6,
						}}
					/>
					<Layer
						id="clicked-2sec-hjdong-polygon-line-layer"
						type="line"
						paint={{
							'line-color': CenterDistrictClickedHjdongPloygonLayerStyle.lineColor,
							'line-width': 2,
						}}
					/>
				</Source>
			</WrapperDistrictBoundaries>
		</div>
	);
};

export default DeliveryDistrictMap;
