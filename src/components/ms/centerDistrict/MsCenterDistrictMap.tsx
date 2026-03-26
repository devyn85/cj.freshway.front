/*
 ############################################################################
 # FiledataField	: MsCenterDistrictMap.tsx
 # Description		: 센터권역 관리 지도 컴포넌트
 # Author			: son insung
 # Since			: 26.03.20
 ############################################################################
 */

// libs
import * as turf from '@turf/turf';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// components
import { Layer, Source, useRooutyMap } from '@/components/common/custom/mapgl/mapbox';
import WrapperDistrictBoundaries from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/WrapperDistrictBoundaries';
// utils
import { getLevelFromHjdongCd } from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/utils/getLevelFromHjdongCd';
import { mergeCenterPolygonByDccode } from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/utils/polygons';
import { getRowStatusByIndex } from '@/lib/AUIGrid/auIGridUtil';
// styles
import {
	CenterDistrictClickedHjdongPloygonLayerStyle,
	CenterDistrictClosedHjdongPloygonLayerStyle,
	CenterDistrictNewHjdongPloygonLayerStyle,
	CenterPloygonLayerStyle,
	centerTextLayerStyle,
	DuplicateHjdongPloygonLayerStyle,
	SelectedCenterPloygonLayerStyle,
	SelectedCenterTextLayerStyle,
	UnusageHjdongPloygonLayerStyle,
} from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/utils/mapLayerStyles';
// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { dispatchSetLoading } from '@/store/core/loadingStore';
import { useDistrictBoundaryStore } from '@/store/districtBoundaryStore';
// types
import { NewHjdongListType } from '@/components/ms/centerDistrict/types';

interface IMsCenterDistrictMapProps {
	selectedRowInCenterGrid?: any;
	centerGridData?: any;
	form?: any;
	centerGridRef?: React.RefObject<any>;
	centerPolygonData?: any[];
	searchParams?: any;
	gridTick?: number;
	newHjdongList?: NewHjdongListType[];
	bumpGridTick: () => void; // 센터권역 그리드 삭제 및 행정동 변경 시 해당 tick 증가 처리 (지도 클릭 폴리곤 재계산 처리)
}

const ADD_DELAY_DAYS = 3;
const Add_DELAY_DAYS_2 = 2;
const FOREVER_DATE = '29991231';
const TWO_SECONDS_HIGHLIGHT_FIELDS = ['ctpKorNm', 'sigKorNm', 'hjdongCd'];
const MAP_ID = 'center-district-map';

// 에러 핸들링 관련 공통 함수
const logError = (msg: string, err?: any) => {};

const safeJSONParse = (text: any) => {
	try {
		return JSON.parse(text);
	} catch (e) {
		logError('JSON parse failed', e);
		return null;
	}
};

const callGrid = (grid: any, method: string, ...args: any[]) => {
	try {
		const fn = grid?.[method];
		if (typeof fn !== 'function') {
			logError(`grid.${method} is not a function`);
			return;
		}
		return fn.apply(grid, args);
	} catch (e) {
		logError(`grid.${method} failed`, e);
	}
};

// 지도 관련 공통 함수들
const toFC = (list?: any[]) => {
	const arr = Array.isArray(list) ? list : [];
	return {
		type: 'FeatureCollection' as const,
		features: arr.flatMap((item: any) => {
			try {
				const g = safeJSONParse(item?.geojson);
				if (!g?.type) return [];
				return [{ type: 'Feature' as const, properties: { ...item }, geometry: g }];
			} catch (e) {
				logError('toFC: feature conversion failed', e);
				return [];
			}
		}),
	};
};
// geometry > geojson 순서로 우선 사용
const toFCPreferGeometry = (list?: any[]) => {
	const arr = Array.isArray(list) ? list : [];
	return {
		type: 'FeatureCollection' as const,
		features: arr.flatMap((item: any) => {
			try {
				const geom = item?.geometry;
				const props = item?.properties;

				// 1) 이미 Feature 형태(geometry 존재)면 그대로 사용
				if (geom && (geom.type || Array.isArray(geom?.coordinates))) {
					return [
						{
							type: 'Feature' as const,
							properties: { ...(props ?? item) }, // props 없으면 item 자체를 props로
							geometry: geom,
						},
					];
				}

				// 2) geojson 문자열을 파싱해서 사용
				const g = safeJSONParse(item?.geojson);
				if (!g?.type) return [];
				return [
					{
						type: 'Feature' as const,
						properties: { ...item },
						geometry: g,
					},
				];
			} catch (e) {
				logError('toFCPreferGeometry: feature conversion failed', e);
				return [];
			}
		}),
	};
};

const fitGeom = (map: any, geom: any, padding = 60) => {
	try {
		if (!map || !geom) return;
		if (typeof map.fitBounds !== 'function') return;
		const bbox = turf?.bbox?.(geom);
		if (!Array.isArray(bbox) || bbox.length !== 4) return;
		const [minLng, minLat, maxLng, maxLat] = bbox;
		if (![minLng, minLat, maxLng, maxLat].every(isFinite)) return;
		if (minLng >= maxLng || minLat >= maxLat) return;
		map.fitBounds(
			[
				[minLng, minLat],
				[maxLng, maxLat],
			],
			{ padding, duration: 700 },
		);
	} catch (e) {
		logError('fitGeom failed', e);
	}
};

const batchUpdateRows = (grid: any, rows: any[], patch: any) => {
	try {
		const rowIdField = grid?.props?.gridProps?.rowIdField ?? '_$uid';
		const toIndex = (row: any) => {
			const rowId = row[rowIdField] ?? row?._$uid;
			const idxs = grid?.getRowIndexesByValue ? grid.getRowIndexesByValue(rowIdField, rowId) : [];
			return Array.isArray(idxs) && idxs.length ? idxs[0] : -1;
		};
		const idxArr = rows.map(toIndex).filter((i: number) => i > -1);
		const patchArr = idxArr.map(() => patch);
		if (idxArr.length) callGrid(grid, 'updateRows', patchArr, idxArr, true);
	} catch (e) {
		logError('batchUpdateRows failed', e);
	}
};

// 헬퍼 함수들 컴포넌트 외부로 이동 또는 별도 정의
const getOrCreateMap = (parentMap: Map<any, any>, key: string) => {
	let childMap = parentMap.get(key);
	if (!childMap) {
		childMap = new Map();
		parentMap.set(key, childMap);
	}
	return childMap;
};

// (getInitialValues - 1. dccode 추출 로직 분리)
const extractDccodeHelper = (dccodeParam: any) => {
	if (!dccodeParam) return null;

	// 배열인 경우: 길이가 1일 때만 유효
	if (_.isArray(dccodeParam)) {
		return dccodeParam.length === 1 ? dccodeParam[0] : null;
	}

	// 문자열인 경우: 빈 문자열이 아니면 유효
	if (typeof dccodeParam === 'string') {
		return dccodeParam.length > 0 ? dccodeParam : null;
	}

	return null;
};

// (getInitialValues - 2. 날짜 계산 로직 분리)
const calculateFromDateHelper = (hjdongObj: any, isNewHjdong: boolean) => {
	const today = dayjs().startOf('day');

	// hjdongObj에 날짜가 있는 경우 (주로 복구 로직 등)
	if (hjdongObj?.fromDate) {
		const raw = String(hjdongObj.fromDate).replaceAll('-', '');
		const parsed = dayjs(raw, 'YYYYMMDD', true);

		// 유효하지 않거나 오늘 이전이면 -> 오늘 날짜
		if (!parsed.isValid() || parsed.isBefore(today)) {
			return today.format('YYYYMMDD');
		}
		// 유효하면 해당 날짜 사용
		return parsed.format('YYYYMMDD');
	}

	// 날짜 없고, 미사용 행정동(신규 리스트 포함)인 경우 -> 오늘 날짜
	if (isNewHjdong) {
		return today.format('YYYYMMDD');
	}

	// 기본 로직 -> 3일 뒤
	return dayjs().add(ADD_DELAY_DAYS, 'day').format('YYYYMMDD');
};

const MsCenterDistrictMap = ({
	selectedRowInCenterGrid,
	centerGridData,
	form,
	centerGridRef,
	centerPolygonData,
	searchParams,
	gridTick,
	newHjdongList,
	bumpGridTick,
}: IMsCenterDistrictMapProps) => {
	const maps = useRooutyMap();

	// 물류센터 코드 리스트
	const allCommonCodeList = getCommonCodeList('WMS_MNG_DC') ?? [];

	// indexedDB 행정동 데이터 조회
	// const { listenerSource } = useDistrictBoundariesData();
	const { listenerSource } = useDistrictBoundaryStore(s => s);

	// 언마운트/타이머 안전 처리
	const isMountedRef = useRef(true);
	const siTimeoutRef = useRef<number | null>(null);
	useEffect(() => {
		return () => {
			isMountedRef.current = false;
			if (siTimeoutRef.current != null) {
				clearTimeout(siTimeoutRef.current);
			}
		};
	}, []);

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

	// (시/구/동) 계층 매핑
	const siGuDongToHjdongListMap = useMemo(() => {
		try {
			const rootMap = new Map<string, Map<string, Map<string, any[]>>>();
			const feats = listenerSource?.dem?.features ?? [];

			for (const f of feats) {
				const props = f?.properties;
				const si = props?.ctpKorNm;
				const gu = props?.sigKorNm;
				const dong = props?.hjdongNm;

				if (!si || !gu || !dong) continue;

				// 1. 시(Si) 키로 구(Gu) Map 가져오기
				const guMap = getOrCreateMap(rootMap, si);

				// 2. 구(Gu) 키로 동(Dong) Map 가져오기
				const dongMap = getOrCreateMap(guMap, gu);

				// 3. 동(Dong) 키로 리스트 가져오기 (리스트는 Map이 아니므로 별도 처리)
				let dongList = dongMap.get(dong);
				if (!dongList) {
					dongList = [];
					dongMap.set(dong, dongList);
				}

				// 데이터 추가
				dongList.push(props);
			}
			return rootMap;
		} catch (e) {
			logError('siGuDongToHjdongListMap build failed', e);
			return new Map();
		}
	}, [listenerSource?.dem]);

	const siGuToHjdongListMap = useMemo(() => {
		try {
			const m = new Map<string, Map<string, any[]>>();
			const feats = listenerSource?.dem?.features ?? [];
			for (const f of feats) {
				const si = f?.properties?.ctpKorNm;
				const gu = f?.properties?.sigKorNm;
				if (!si || !gu) continue;
				if (!m.has(si)) m.set(si, new Map());
				const gm = m.get(si);
				if (!gm) continue;
				if (!gm.has(gu)) gm.set(gu, []);
				const guList = gm.get(gu);
				if (!guList) continue;
				guList.push(f.properties);
			}
			return m;
		} catch (e) {
			logError('siGuToHjdongListMap build failed', e);
			return new Map();
		}
	}, [listenerSource?.dem]);

	const siToHjdongListMap = useMemo(() => {
		try {
			const m = new Map<string, any[]>();
			const feats = listenerSource?.dem?.features ?? [];
			for (const f of feats) {
				const si = f?.properties?.ctpKorNm;
				if (!si) continue;
				if (!m.has(si)) m.set(si, []);
				const siList = m.get(si);
				if (!siList) continue;
				siList.push(f.properties);
			}
			return m;
		} catch (e) {
			logError('siToHjdongListMap build failed', e);
			return new Map();
		}
	}, [listenerSource?.dem]);

	// 공통 헬퍼
	const getRowIdField = (grid: any) => grid?.props?.gridProps?.rowIdField ?? '_$uid';
	const toIndex = (grid: any, row: any) => {
		try {
			const rowIdField = getRowIdField(grid);
			const rowId = row?.[rowIdField] ?? row?._$uid;
			const idxArr = grid?.getRowIndexesByValue ? grid.getRowIndexesByValue(rowIdField, rowId) : [];
			return Array.isArray(idxArr) && idxArr.length ? idxArr[0] : -1;
		} catch (e) {
			logError('toIndex failed', e);
			return -1;
		}
	};
	const getCurrentGridDataWithIndex = (grid: any) => {
		try {
			const data = grid?.getGridData?.();
			if (!Array.isArray(data)) return [];
			return data.map((item: any, index: number) => ({
				...item,
				rowIndex: index,
				rowStatus: getRowStatusByIndex(grid, index),
			}));
		} catch (e) {
			logError('getGridData failed', e);
			return [];
		}
	};
	// 추가하거나 수정된 행의 체크박스 체크
	const addCheckedForRows = (grid: any, rows: any[], rowIdField: string) => {
		if (!grid?.addCheckedRowsByValue) return;
		rows.forEach((r: any) => {
			const id = r?.[rowIdField] ?? r?._$uid;
			if (id != null) grid.addCheckedRowsByValue(rowIdField, id);
		});
	};

	// 추가된 행(신규 I) - hjdongCd 기준으로 그리드에서 찾아 체크
	const addCheckedForAddedRows = (grid: any, hjdongCdSet: Set<string>, rowIdField: string) => {
		if (!grid?.addCheckedRowsByValue) return;
		const gridData = Array.isArray(grid?.getGridData?.()) ? grid.getGridData() : [];
		const toCheck = gridData.filter((r: any) => r?.rowStatus === 'I' && hjdongCdSet.has(r?.hjdongCd));
		toCheck.forEach((r: any) => {
			const id = r?.[rowIdField] ?? r?._$uid;
			if (id != null) grid.addCheckedRowsByValue(rowIdField, id);
		});
	};

	// 센터 폴리곤 레이어 데이터
	const centerPolygonSourceData = useMemo(() => {
		// 선택한 센터 폴리곤만 그려준다. (전체 센터를 선택할 수 있는 방법이 조회시 말고는 없다.)
		// const selectedCenterPolygonData = centerPolygonData.filter(
		// 	(item: any) => item.dccode === selectedRowInCenterGrid?.dccode
		// 	&& item?.fromdate === selectedRowInCenterGrid?.fromDate
		// 	&& item?.todate === selectedRowInCenterGrid?.toDate,
		// );
		const selectedCenterPolygonData = centerPolygonData.filter((item: any) => {
			if (!selectedRowInCenterGrid) return false;

			return (
				item.dccode === selectedRowInCenterGrid.dccode
				// itemFrom.isSame(selFrom, 'day') &&
				// && itemTo.isSame(selTo, 'day')
			);
		});
		return toFC(selectedCenterPolygonData);
	}, [centerPolygonData, selectedRowInCenterGrid]);
	// 선택한 센터 폴리곤 레이어 데이터
	const unSelectedCenterPolygonSourceData = useMemo(() => {
		const unSelectedCenterPolygonData = centerPolygonData.filter(
			(item: any) => item.dccode !== selectedRowInCenterGrid?.dccode,
		);
		return toFC(unSelectedCenterPolygonData);
	}, [centerPolygonData, selectedRowInCenterGrid]);

	// 센터 텍스트 레이어 데이터
	const centerTextSourceData = useMemo(() => {
		try {
			const list = centerPolygonData.filter((item: any) => item.dccode !== selectedRowInCenterGrid?.dccode) ?? [];
			// 여기서 병합 로직 넣기?
			const mergedList = mergeCenterPolygonByDccode(list);
			const features = mergedList.flatMap((item: any) => {
				try {
					const g = safeJSONParse(item?.geojson);
					if (!g?.type) return [];
					const c = turf?.center?.(g)?.geometry?.coordinates;
					if (!c) return [];
					return [
						{
							type: 'Feature' as const,
							properties: { name: item.dcname ?? '' },
							geometry: { type: 'Point', coordinates: c },
						},
					];
				} catch (e) {
					logError('center text feature build failed', e);
					return [];
				}
			});
			return { type: 'FeatureCollection' as const, features };
		} catch (e) {
			logError('centerTextSourceData build failed', e);
			return { type: 'FeatureCollection' as const, features: [] };
		}
	}, [centerPolygonData, selectedRowInCenterGrid]);
	// 선택한 센터 텍스트 레이어 데이터
	const selectedCenterTextSourceData = useMemo(() => {
		try {
			const list = centerPolygonData.filter((item: any) => item.dccode === selectedRowInCenterGrid?.dccode) ?? [];
			// 여기서 병합 처리
			const mergedList = mergeCenterPolygonByDccode(list);
			const features = mergedList.flatMap((item: any) => {
				try {
					const g = safeJSONParse(item?.geojson);
					if (!g?.type) return [];
					const c = turf?.center?.(g)?.geometry?.coordinates;
					if (!c) return [];
					return [
						{
							type: 'Feature' as const,
							properties: { name: item.dcname ?? '' },
							geometry: { type: 'Point', coordinates: c },
						},
					];
				} catch (e) {
					logError('center text feature build failed', e);
					return [];
				}
			});
			return { type: 'FeatureCollection' as const, features };
		} catch (e) {
			logError('centerTextSourceData build failed', e);
			return { type: 'FeatureCollection' as const, features: [] };
		}
	}, [centerPolygonData, selectedRowInCenterGrid]);

	// 중복된 행정동 폴리곤 레이어
	const duplicateHjdongPolygonSourceData = useMemo(() => {
		try {
			const filteredDuplicateHjdongList = centerGridData?.filter((item: any) => item.isDuplicate === true) ?? [];
			if (filteredDuplicateHjdongList?.length > 0) {
				const features: any[] = [];
				for (const item of filteredDuplicateHjdongList) {
					const feat = demMap.get(item.hjdongCd);
					if (feat) features.push(feat);
				}
				return { type: 'FeatureCollection' as const, features };
			}
			return toFC([]);
		} catch (e) {
			logError('duplicateHjdongPolygonSourceData build failed', e);
			return toFC([]);
		}
	}, [centerGridData, demMap]);

	// 미등록(미사용) 행정동 코드 Set
	const newHjdongSet = useMemo(() => {
		try {
			const s = new Set<string>();
			(newHjdongList ?? []).forEach((item: NewHjdongListType) => {
				const cd = item?.hjdongCd;
				if (cd) s.add(cd);
			});
			return s;
		} catch (e) {
			logError('newHjdongSet build failed', e);
			return new Set<string>();
		}
	}, [newHjdongList]);

	// 미사용 행정동 폴리곤 레이어
	// 미등록(미사용) 행정동 폴리곤 레이어 데이터
	const unregisteredHjdongPolygonSourceData = useMemo(() => {
		try {
			const features: any[] = [];
			for (const cd of newHjdongSet) {
				const feat = demMap.get(cd);
				if (feat?.geometry) {
					// deliveryDistrict 쪽과 동일하게 dem 의 feature 를 그대로 사용
					features.push(feat);
				}
			}
			return { type: 'FeatureCollection' as const, features };
		} catch (e) {
			logError('unregisteredHjdongPolygonSourceData build failed', e);
			return { type: 'FeatureCollection' as const, features: [] };
		}
	}, [newHjdongSet, demMap]);

	// 그리드 폴리곤 추가/제거 버전
	const [gridVersion, setGridVersion] = useState(0);

	// 그리드 이벤트 구독 (행 추가/삭제/편집 완료)
	useEffect(() => {
		const grid = centerGridRef?.current;
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
	}, [centerGridRef]);

	// 기존 신규행(I) 폴리곤 바로 아래에 추가
	const closedHjdongPolygonData = useMemo(() => {
		try {
			const grid = centerGridRef?.current;
			if (!grid) return { type: 'FeatureCollection' as const, features: [] };

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
				return String(v).replaceAll('-', '');
			};

			const seen = new Set<string>();
			const features = checkedRows.flatMap(rowWrap => {
				const r = rowWrap.item ?? rowWrap; // {rowIndex, item} 또는 item 둘 다 대응
				if (!r) return [];

				// 2) AUIGrid 내부 상태 기준 U(수정됨) 인 행만
				const rowId = r._$uid;
				if (!rowId || grid.isAddedById?.(rowId) || !grid.isEditedById?.(rowId)) return [];

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
	}, [demMap, centerGridRef, gridTick]);

	// 신규행(I) 하이라이트 폴리곤
	const clickableHjdongPolygonData = useMemo(() => {
		try {
			if (gridTick === 0) {
				// 조회시 초기화 처리
				return { type: 'FeatureCollection' as const, features: [] };
			}
			const grid = centerGridRef?.current;
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
	}, [demMap, gridVersion, centerGridRef, gridTick]);

	const isClickable = useMemo(() => {
		try {
			if (!searchParams || (_.isArray(searchParams?.dccode) && searchParams?.dccode?.length !== 1)) return false;
			return true;
		} catch (e) {
			logError('isClickable compute failed', e);
			return true;
		}
	}, [searchParams]);

	// 포커스 처리 (물류센터/행정동 클릭 시)
	useEffect(() => {
		// 포커싱할 대상 Geometry 추출 함수 (복잡도 해결을 위해 분리)
		const getTargetGeometry = () => {
			if (!selectedRowInCenterGrid) return null;

			const { clickedField, rowStatus, dccode, ctpKorNm, sigKorNm, hjdongCd } = selectedRowInCenterGrid;

			// 1. 물류센터
			if (clickedField === 'dcname') {
				return centerPolygonSourceData?.features?.find((item: any) => item?.properties?.dccode === dccode)?.geometry;
			}

			// 그 외 필드들은 신규('I') 상태면 이동하지 않음
			if (rowStatus === 'I') return null;

			// 2. 시/도
			if (clickedField === 'ctpKorNm') {
				return listenerSource['sido']?.features?.find((item: any) => item?.properties?.ctpKorNm === ctpKorNm)?.geometry;
			}

			// 3. 시/군/구
			if (clickedField === 'sigKorNm') {
				return listenerSource['sgg']?.features?.find(
					(item: any) => item?.properties?.ctpKorNm === ctpKorNm && item?.properties?.sigKorNm === sigKorNm,
				)?.geometry;
			}

			// 4. 행정동
			if (clickedField === 'hjdongCd') {
				return demMap.get(hjdongCd)?.geometry;
			}

			return null;
		};

		try {
			const map = maps?.[MAP_ID]?.mapbox;
			if (!map) return;

			const geometry = getTargetGeometry();
			if (geometry) {
				fitGeom(map, geometry);
			}
		} catch (e) {
			logError('focus effect failed', e);
		}
	}, [selectedRowInCenterGrid, maps, centerPolygonSourceData, demMap]);

	// 2초 동안만 보여줄 행정동 클릭 하이라이트 on/off
	const [showClickedHighlight, setShowClickedHighlight] = useState(false);
	// 그리드에서 행정동 셀 클릭 시 2초 동안 하이라이트 표시
	useEffect(() => {
		try {
			if (
				TWO_SECONDS_HIGHLIGHT_FIELDS.includes(selectedRowInCenterGrid?.clickedField) &&
				selectedRowInCenterGrid?.rowStatus !== 'I'
			) {
				setShowClickedHighlight(true);
				const t = window.setTimeout(() => setShowClickedHighlight(false), 2000);
				return () => clearTimeout(t);
			}
		} catch (e) {
			logError('clicked highlight timer failed', e);
		}
	}, [selectedRowInCenterGrid]);

	// 그리드 행정동 클릭 시 2초 후 사라지는 행정동 폴리곤 레이어 데이터
	const clickedHjdongPolygonSourceData = useMemo(() => {
		try {
			if (!showClickedHighlight) return { type: 'FeatureCollection' as const, features: [] };

			const field = selectedRowInCenterGrid?.clickedField;

			// 1) 시/도 단위 (ctpKorNm)
			if (field === 'ctpKorNm') {
				const sidoFeaturesList = listenerSource['sido']?.features ?? [];
				if (sidoFeaturesList.length > 0) {
					const filteredFeatures = sidoFeaturesList.filter(
						(item: any) => item?.properties?.ctpKorNm === selectedRowInCenterGrid?.ctpKorNm,
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
							item?.properties?.ctpKorNm === selectedRowInCenterGrid?.ctpKorNm &&
							item?.properties?.sigKorNm === selectedRowInCenterGrid?.sigKorNm,
					);
					return { type: 'FeatureCollection' as const, features: filteredFeatures };
				} else {
					return { type: 'FeatureCollection' as const, features: [] };
				}
			}

			// 3) 개별 행정동 (기존 로직)
			if (field === 'hjdongCd') {
				const cd = selectedRowInCenterGrid?.hjdongCd;
				if (!cd) return { type: 'FeatureCollection' as const, features: [] };
				const demFeat = demMap.get(cd);
				if (!demFeat?.geometry) return { type: 'FeatureCollection' as const, features: [] };
				return {
					type: 'FeatureCollection' as const,
					features: [
						{
							type: 'Feature' as const,
							properties: { ...selectedRowInCenterGrid },
							geometry: demFeat.geometry,
						},
					],
				};
			}

			// 그 외
			return { type: 'FeatureCollection' as const, features: [] };
		} catch (e) {
			logError('clickedHjdongPolygonSourceData build failed', e);
			return { type: 'FeatureCollection' as const, features: [] };
		}
	}, [showClickedHighlight, selectedRowInCenterGrid, demMap, siGuToHjdongListMap, siToHjdongListMap, listenerSource]);

	// onClick: 공통 초기값
	const getInitialValues = useCallback(
		(hjdongObj: any) => {
			// 1. dccode 추출 로직 분리
			const searchParamsDccode = extractDccodeHelper(searchParams?.dccode);
			// 만약 클릭 조건이 없다면 클릭 시 초기값 처리 X
			if (!searchParamsDccode) return;

			try {
				const mappingDccodeObj = allCommonCodeList.find(item => item?.comCd === searchParamsDccode);

				// 미사용 행정동 선택 시 적용시작일자 오늘 날짜로 처리 여부 확인
				const isFromDateToday = newHjdongList?.some((item: NewHjdongListType) => {
					return item.hjdongCd === hjdongObj?.hjdongCd;
				});
				// 2. 날짜 계산 로직 분리
				const fromDate = calculateFromDateHelper(hjdongObj, isFromDateToday);

				return {
					serialkey: null as any,
					dccode: mappingDccodeObj?.comCd ?? '',
					dcname: mappingDccodeObj?.cdNm ?? '',
					hjdongCd: hjdongObj?.hjdongCd,
					hjdongNm: hjdongObj?.hjdongNm,
					ctpKorNm: hjdongObj?.ctpKorNm,
					sigKorNm: hjdongObj?.sigKorNm,
					fromDate: fromDate,
					toDate: FOREVER_DATE,
					delYn: 'N',
					isDuplicate: false,
					errorMessages: [] as any[],
					rowStatus: 'I',
					initialDelYn: false,
				};
			} catch (e) {
				logError('getInitialValues failed', e);
				return {
					serialkey: null as any,
					dccode: '',
					dcname: '',
					hjdongCd: '',
					hjdongNm: '',
					fromDate: dayjs().add(ADD_DELAY_DAYS, 'day').format('YYYYMMDD'),
					toDate: FOREVER_DATE,
					delYn: 'N',
					isDuplicate: false,
					errorMessages: [] as any[],
					rowStatus: 'I',
					initialDelYn: false,
				};
			}
		},
		[allCommonCodeList, searchParams, newHjdongList],
	);

	const focusGridRow = (rowIndex: number) => {
		try {
			const grid = centerGridRef?.current;
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
	};

	// onClick: 분기 처리 (동)
	const handleDongClick = useCallback(
		(clickedLayerProperties: any, grid: any, currentGridData: any[], rowIdField: string) => {
			try {
				const si = clickedLayerProperties?.ctpKorNm;
				const gu = clickedLayerProperties?.sigKorNm;
				const dong = clickedLayerProperties?.hjdongNm;
				if (!si || !gu || !dong) return;

				const clickedDongList = siGuDongToHjdongListMap.get(si)?.get(gu)?.get(dong) ?? [];
				const clickedCdSet = new Set(clickedDongList.map((i: any) => i?.hjdongCd));
				const targetRows = currentGridData
					.filter((r: any) => clickedCdSet.has(r?.hjdongCd))
					.filter((r: any) => r?.initialDelYn !== true); // 기존 행정동이 중단 상태일때

				if (targetRows.length > 0) {
					targetRows.forEach((row: any) => {
						const rowIndex = row?.rowIndex ?? toIndex(grid, row);
						if (row?.rowStatus === 'I') {
							callGrid(grid, 'removeRow', rowIndex);
							setGridVersion(v => v + 1);
							bumpGridTick();
							focusGridRow(rowIndex);
						} else if (row?.rowStatus === 'R') {
							const todayPlus2Str = dayjs().add(Add_DELAY_DAYS_2, 'day').format('YYYYMMDD');
							let changedToDate = todayPlus2Str;
							// 오늘 + 2일 설정 시 fromDate 보다 이전일 경우 fromDate 로 설정
							if (dayjs(todayPlus2Str).isBefore(dayjs(row?.fromDate))) {
								changedToDate = row?.fromDate;
							}
							callGrid(grid, 'setCellValue', rowIndex, 'toDate', changedToDate);
							callGrid(grid, 'setCellValue', rowIndex, 'rowStatus', 'U');
							callGrid(grid, 'setCellValue', rowIndex, 'delYn', 'Y');
							setGridVersion(v => v + 1);
							bumpGridTick();
							focusGridRow(rowIndex);
						} else if (row?.rowStatus === 'U') {
							callGrid(grid, 'restoreEditedRows', rowIndex);
							setGridVersion(v => v + 1);
							bumpGridTick();
							focusGridRow(rowIndex);
						}
					});
					addCheckedForRows(grid, targetRows, rowIdField);
				} else {
					const targetRows = currentGridData
						.filter((r: any) => clickedCdSet.has(r?.hjdongCd))
						.filter((r: any) => r?.initialDelYn === true) // 기존 행정동이 중단 상태일때
						.sort((a: any, b: any) => dayjs(b?.toDate).diff(dayjs(a?.toDate))); // 종료일자 내림차순 정렬

					let fromDate = null;
					if (targetRows.length > 0) {
						fromDate = dayjs(targetRows[0]?.toDate).add(1, 'day').format('YYYYMMDD');
					} // 기존 행이 중단으로 존재 시 종료일자 내림차순 정렬 후 종료일자 + 1 일 처리
					clickedDongList.forEach((props: any) => {
						callGrid(
							grid,
							'addRow',
							getInitialValues({
								...props,
								fromDate: fromDate,
							}),
						);
						setGridVersion(v => v + 1);
					});
					const addedCdSet = new Set(clickedDongList.map((p: any) => p?.hjdongCd));
					addCheckedForAddedRows(grid, addedCdSet as Set<string>, rowIdField); // 추가
					bumpGridTick();
				}
			} catch (e) {
				logError('handleDongClick failed', e);
			}
		},
		[siGuDongToHjdongListMap, getInitialValues, bumpGridTick, focusGridRow],
	);

	// onClick: 분기 처리 (구)
	const handleGuClick = useCallback(
		(clickedLayerProperties: any, grid: any, currentGridData: any[], rowIdField: string) => {
			try {
				const si = clickedLayerProperties?.ctpKorNm;
				const gu = clickedLayerProperties?.sigKorNm;
				if (!si || !gu) return;

				// 클릭한 구의 행정동 리스트
				const clickedGuHjdongList = siGuToHjdongListMap.get(si)?.get(gu) ?? [];

				// 현재 그리드에 데이터가 없을 때 - 전부 추가
				if (currentGridData.length === 0) {
					clickedGuHjdongList.forEach((item: any) => {
						callGrid(grid, 'addRow', getInitialValues(item));
					});
					setGridVersion(v => v + 1);
					return;
				}

				const clickedCdSet = new Set((clickedGuHjdongList ?? []).map((i: any) => i?.hjdongCd));

				const isAllIncluded = clickedGuHjdongList.every((item: any) =>
					currentGridData.some((hjdong: any) => hjdong?.hjdongCd === item?.hjdongCd && item?.initialDelYn === false),
				);
				const todayPlus2 = dayjs().add(Add_DELAY_DAYS_2, 'day').startOf('day');

				const temp = clickedGuHjdongList.filter(
					(item: any) =>
						!currentGridData.some(
							(hjdong: any) => hjdong?.hjdongCd === item?.hjdongCd && hjdong?.initialDelYn === false,
						),
				);

				if (!isAllIncluded && temp.length > 0) {
					const toAdd = clickedGuHjdongList.filter(
						(item: any) =>
							!currentGridData.some(
								(hjdong: any) => hjdong?.hjdongCd === item?.hjdongCd && hjdong?.initialDelYn === false,
							),
					);
					toAdd.forEach((item: any) => {
						const fromDateObj = currentGridData.find((hjdong: any) => hjdong?.hjdongCd === item?.hjdongCd);
						if (fromDateObj) {
							item.fromDate = dayjs(fromDateObj.toDate).add(1, 'day').format('YYYYMMDD');
						}
						callGrid(grid, 'addRow', getInitialValues(item));
					});
					setGridVersion(v => v + 1);

					const rowStatusUList = currentGridData.filter(
						(r: any) => r?.rowStatus === 'U' && clickedCdSet.has(r?.hjdongCd),
					);
					rowStatusUList.forEach((r: any) => {
						const idx = Number.isInteger(r?.rowIndex) ? r.rowIndex : toIndex(grid, r);
						if (idx > -1) {
							callGrid(grid, 'restoreEditedRows', idx);
							setGridVersion(v => v + 1);
						}
					});

					bumpGridTick();
					focusGridRow(rowStatusUList[0]?.rowIndex ?? toAdd[0]?.rowIndex ?? -1);
				} else {
					// [상태 B] 이 구에 속한 동이 모두 포함되어 있고, 아직 종료 상태가 아닌 경우
					// → I 삭제 + R/U 를 오늘+2, delYn='Y', rowStatus='U' 로 종료

					const rowStatusIList = currentGridData.filter(
						(item: any) => item?.rowStatus === 'I' && clickedCdSet.has(item?.hjdongCd),
					);
					if (rowStatusIList.length > 0) {
						const ids = rowStatusIList.map((r: any) => r?.[rowIdField] ?? r?._$uid);
						callGrid(grid, 'removeRowByRowId', ids);
					}

					const ruList = currentGridData.filter(
						(r: any) =>
							(r?.rowStatus === 'R' || r?.rowStatus === 'U') &&
							clickedCdSet.has(r?.hjdongCd) &&
							r?.initialDelYn === false,
					);

					const todayPlus2Str = todayPlus2.format('YYYYMMDD');

					ruList.forEach((r: any) => {
						try {
							const rowIndex = Number.isInteger(r?.rowIndex) ? r.rowIndex : toIndex(grid, r);
							if (rowIndex < 0) return;

							// 오늘 + 2일 설정 시 fromDate 보다 이전일 경우 fromDate 로 설정
							let changedToDate = todayPlus2Str;
							if (dayjs(todayPlus2Str, 'YYYYMMDD').isBefore(dayjs(String(r?.fromDate), 'YYYYMMDD'))) {
								changedToDate = String(r?.fromDate);
							}

							// (저장 이전!) 모든 행이 중단 버튼으로 되어 있을 경우 (모든행의 적용종료일자가 최소일자로 되어 있을 경우) -> 원복
							// (저장 이전!) 모든 행이 정상 상태일 경우 (모든행의 적용종료일자가 최소일자로 되어 있을 경우) -> 최소일자 처리
							if (String(r?.toDate) === changedToDate) {
								// 이미 같은 종료일이면 원복(토글)
								callGrid(grid, 'restoreEditedRows', rowIndex);
							} else {
								// 종료일/상태/삭제여부 설정
								callGrid(grid, 'setCellValue', rowIndex, 'toDate', changedToDate);
								callGrid(grid, 'setCellValue', rowIndex, 'delYn', 'Y');
								callGrid(grid, 'setCellValue', rowIndex, 'rowStatus', 'U');
							}
						} catch (e) {
							logError('handleGuClick RU close failed', e);
						}
					});

					setGridVersion(v => v + 1);
					bumpGridTick();
					focusGridRow(ruList[0]?.rowIndex ?? -1);
				}
			} catch (e) {
				logError('handleGuClick failed', e);
			}
		},
		[siGuToHjdongListMap, getInitialValues, bumpGridTick, focusGridRow],
	);

	// 시(시/도) 클릭 시 - 빈 그리드에 전체 추가
	const handleSiClickEmptyGrid = useCallback(
		async (gridRef: any, clickedSiHjdongList: any[]) => {
			const hasBatch = typeof gridRef?.beginUpdate === 'function' && typeof gridRef?.endUpdate === 'function';
			const CHUNK = 20;

			if (hasBatch) callGrid(gridRef, 'beginUpdate');
			for (let i = 0; i < clickedSiHjdongList.length; i += CHUNK) {
				const chunk = clickedSiHjdongList.slice(i, i + CHUNK);
				chunk.forEach((item: any) => callGrid(gridRef, 'addRow', getInitialValues(item)));
				await new Promise(r => setTimeout(r, 0));
			}
			if (hasBatch) callGrid(gridRef, 'endUpdate');

			if (!isMountedRef.current) return;
			setGridVersion(v => v + 1);
			bumpGridTick();
		},
		[getInitialValues, bumpGridTick],
	);

	// 시(시/도) 클릭 시 - 상태 A: 빠진 동 추가 + U 행 원복
	const handleSiClickStateA = useCallback(
		async (gridRef: any, clickedSiHjdongList: any[], currentGridDataLocal: any[], clickedCdSet: Set<string>) => {
			const hasBatch = typeof gridRef?.beginUpdate === 'function' && typeof gridRef?.endUpdate === 'function';
			const CHUNK = 20;

			const toAdd = clickedSiHjdongList.filter(
				(item: any) =>
					!currentGridDataLocal.some(
						(hjdong: any) => hjdong?.hjdongCd === item?.hjdongCd && hjdong?.initialDelYn === false,
					),
			);

			if (hasBatch) callGrid(gridRef, 'beginUpdate');
			for (let i = 0; i < toAdd.length; i += CHUNK) {
				const chunk = toAdd.slice(i, i + CHUNK);
				chunk.forEach((item: any) => {
					// [구 로직과 동일] 과거에 중단(initialDelYn === true)된 행이 있으면
					// 그 동의 마지막 toDate + 1일을 fromDate 로 사용
					const endedRowsForCd = currentGridDataLocal
						.filter((r: any) => r?.hjdongCd === item?.hjdongCd && r?.initialDelYn === true)
						.sort((a: any, b: any) => dayjs(b?.toDate).diff(dayjs(a?.toDate)));

					const fromDate =
						endedRowsForCd.length > 0 ? dayjs(endedRowsForCd[0]?.toDate).add(1, 'day').format('YYYYMMDD') : undefined;

					callGrid(
						gridRef,
						'addRow',
						getInitialValues({
							...item,
							fromDate,
						}),
					);
				});
				await new Promise(r => setTimeout(r, 0));
			}
			if (hasBatch) callGrid(gridRef, 'endUpdate');

			if (!isMountedRef.current) return;
			setGridVersion(v => v + 1);

			const rowStatusUList = currentGridDataLocal.filter(
				(r: any) => r?.rowStatus === 'U' && clickedCdSet.has(r?.hjdongCd),
			);
			rowStatusUList.forEach((r: any) => {
				const idx = Number.isInteger(r?.rowIndex) ? r.rowIndex : toIndex(gridRef, r);
				if (idx > -1) {
					callGrid(gridRef, 'restoreEditedRows', idx);
					if (!isMountedRef.current) return;
					setGridVersion(v => v + 1);
				}
			});

			bumpGridTick();
			focusGridRow(rowStatusUList[0]?.rowIndex ?? toAdd[0]?.rowIndex ?? -1);
		},
		[getInitialValues, bumpGridTick, focusGridRow],
	);

	// 시(시/도) 클릭 시 - 상태 B: I 삭제 + R/U 종료 처리
	const handleSiClickStateB = useCallback(
		(
			gridRef: any,
			currentGridDataLocal: any[],
			clickedCdSet: Set<string>,
			rowIdFieldLocal: string,
			todayPlus2: dayjs.Dayjs,
		) => {
			// 1) I 삭제
			const rowStatusIList = currentGridDataLocal.filter(
				(item: any) => item?.rowStatus === 'I' && clickedCdSet.has(item?.hjdongCd),
			);
			if (rowStatusIList.length > 0) {
				const ids = rowStatusIList.map((r: any) => r?.[rowIdFieldLocal] ?? r?._$uid);
				callGrid(gridRef, 'removeRowByRowId', ids);
			}

			// 2) R/U 종료 처리 대상 (활성행만)
			const ruList = currentGridDataLocal.filter(
				(r: any) =>
					(r?.rowStatus === 'R' || r?.rowStatus === 'U') && clickedCdSet.has(r?.hjdongCd) && r?.initialDelYn === false,
			);

			const todayPlus2Str = todayPlus2.format('YYYYMMDD');

			ruList.forEach((r: any) => {
				try {
					const rowIndex = Number.isInteger(r?.rowIndex) ? r.rowIndex : toIndex(gridRef, r);
					if (rowIndex < 0) return;

					// 오늘 + 2일 설정 시 fromDate 보다 이전일 경우 fromDate 로 보정
					let changedToDate = todayPlus2Str;
					const from = dayjs(String(r?.fromDate).replace(/-/g, ''), 'YYYYMMDD');
					const base = dayjs(todayPlus2Str, 'YYYYMMDD');
					if (base.isBefore(from)) {
						changedToDate = from.format('YYYYMMDD');
					}

					// (저장 이전!) 이미 종료일이 최소일자(= changedToDate)면 → 원복
					if (String(r?.toDate).replace(/-/g, '') === changedToDate) {
						callGrid(gridRef, 'restoreEditedRows', rowIndex);
					} else {
						// 종료일/삭제여부/상태 설정
						callGrid(gridRef, 'setCellValue', rowIndex, 'toDate', changedToDate);
						callGrid(gridRef, 'setCellValue', rowIndex, 'delYn', 'Y');
						callGrid(gridRef, 'setCellValue', rowIndex, 'rowStatus', 'U');
					}
				} catch (e) {
					logError('handleSiClickStateB RU close failed', e);
				}
			});

			if (!isMountedRef.current) return;
			setGridVersion(v => v + 1);
			bumpGridTick();
			focusGridRow(ruList[0]?.rowIndex ?? -1);
		},
		[bumpGridTick, focusGridRow],
	);

	// handleSiClick 내부 로직 분리
	const processSiClickAsync = useCallback(
		async (clickedLayerProperties: any, gridRef: any, currentGridDataLocal: any[], rowIdFieldLocal: string) => {
			try {
				// 스피너가 실제로 그려지도록 보장 (double rAF)
				await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

				const si = clickedLayerProperties?.ctpKorNm;
				if (!si) return;
				const clickedSiHjdongList = siToHjdongListMap.get(si) ?? [];
				const clickedCdSet = new Set<string>(clickedSiHjdongList.map((i: any) => String(i?.hjdongCd)));

				// 빈 그리드인 경우
				if (currentGridDataLocal.length === 0) {
					await handleSiClickEmptyGrid(gridRef, clickedSiHjdongList);
					return;
				}

				const isAllIncluded = clickedSiHjdongList.every((item: any) =>
					currentGridDataLocal.some(
						(hjdong: any) => hjdong?.hjdongCd === item?.hjdongCd && hjdong?.initialDelYn === false,
					),
				);

				const todayPlus2 = dayjs().add(Add_DELAY_DAYS_2, 'day').startOf('day');

				if (!isAllIncluded) {
					// [상태 A] 아직 다 안 들어왔거나, 이미 today+2 로 종료된 상태에서 다시 켜는 경우
					await handleSiClickStateA(gridRef, clickedSiHjdongList, currentGridDataLocal, clickedCdSet);
				} else {
					// [상태 B] 이 시(시/도)에 속한 동이 모두 포함되어 있고, 아직 종료 상태가 아닌 경우
					handleSiClickStateB(gridRef, currentGridDataLocal, clickedCdSet, rowIdFieldLocal, todayPlus2);
				}
			} catch (e) {
				logError('handleSiClick async failed', e);
			} finally {
				dispatchSetLoading(false);
			}
		},
		[siToHjdongListMap, handleSiClickEmptyGrid, handleSiClickStateA, handleSiClickStateB],
	);

	// onClick: 분기 처리 (시)
	const handleSiClick = useCallback(
		(clickedLayerProperties: any, gridRef: any, currentGridDataLocal: any[], rowIdFieldLocal: string) => {
			try {
				dispatchSetLoading(true);

				// async chunk 작업 스케줄링
				siTimeoutRef.current = window.setTimeout(() => {
					processSiClickAsync(clickedLayerProperties, gridRef, currentGridDataLocal, rowIdFieldLocal);
				}, 0);
			} catch (e) {
				logError('handleSiClick schedule failed', e);
				dispatchSetLoading(false);
			}
		},
		[processSiClickAsync],
	);

	// 지도 클릭 함수 (라우팅만 담당)
	const handleMapClick = useCallback(
		async (event: any) => {
			// 물류센터가 복수개일때 클릭 불가능 처리
			if (searchParams?.dccode?.split(',').length > 1) {
				showAlert(null, '물류센터 1개 조회 시 클릭 가능합니다.');
				return;
			}
			if (!isClickable) return;
			try {
				const grid = centerGridRef?.current;
				if (!grid) return;

				// 조회일자가 오늘이 아닐 경우에는 아래의 얼럿 띄우기
				if (
					!searchParams ||
					!(searchParams?.effectiveDate && dayjs(searchParams?.effectiveDate).isSame(dayjs(), 'day'))
				) {
					showAlert(null, `${dayjs().format('YYYY-MM-DD')}(현재일)로 조회 후 입력/수정/삭제가 가능합니다.`);
					return;
				}

				const features = Array.isArray(event?.features) ? event.features : [];
				if (features.length === 0) return;
				const clickedLayer = features.find((item: any) => item?.layer?.id === 'base-fill-layer');
				if (!clickedLayer?.properties) return;
				const clickedLayerProperties = clickedLayer?.properties;
				const currentGridData = getCurrentGridDataWithIndex(grid);
				const rowIdField = getRowIdField(grid);

				const level = getLevelFromHjdongCd(clickedLayerProperties?.hjdongCd);

				if (level === 'sido') {
					handleSiClick(clickedLayerProperties, grid, currentGridData, rowIdField);
				} else if (level === 'sgg') {
					handleGuClick(clickedLayerProperties, grid, currentGridData, rowIdField);
				} else if (level === 'dem') {
					handleDongClick(clickedLayerProperties, grid, currentGridData, rowIdField);
				}
			} catch (error) {
				logError('handleMapClick error', error);
			}
		},
		[centerGridRef, handleDongClick, handleGuClick, handleSiClick, isClickable, searchParams],
	);

	return (
		<div style={{ height: 'calc(100% - 50px)', width: '100%' }}>
			<WrapperDistrictBoundaries
				id={MAP_ID}
				isUsingMapSearchSelect={true}
				isUsingHover={isClickable}
				onDblClick={handleMapClick}
				interactiveLayerIds={['center-polygon-layer', 'center-polygon-line-layer']}
				textLayerChildren={
					<>
						<Source id="district-group-text-source" type="geojson" data={centerTextSourceData as any}>
							<Layer
								id="district-group-text-layer"
								type="symbol"
								layout={centerTextLayerStyle.layout as any}
								paint={centerTextLayerStyle.paint}
							/>
						</Source>
						<Source id="selected-district-group-text-source" type="geojson" data={selectedCenterTextSourceData as any}>
							<Layer
								id="selected-district-group-text-layer"
								type="symbol"
								layout={SelectedCenterTextLayerStyle.layout as any}
								paint={SelectedCenterTextLayerStyle.paint}
							/>
						</Source>
					</>
				}
			>
				{/* 센터 폴리곤 레이어 */}
				<Source id="center-polygon-source" type="geojson" data={unSelectedCenterPolygonSourceData}>
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
				{/* 선택한 센터 폴리곤 레이어 */}
				<Source id="selected-center-polygon-source" type="geojson" data={centerPolygonSourceData}>
					<Layer
						id="selected-center-polygon-layer"
						type="fill"
						paint={{
							'fill-color': SelectedCenterPloygonLayerStyle.fillColor,
							'fill-opacity': 1,
						}}
					/>
					<Layer
						id="selected-center-polygon-line-layer"
						type="line"
						paint={{
							'line-color': SelectedCenterPloygonLayerStyle.lineColor,
							'line-width': 1,
						}}
					/>
				</Source>

				{/* 중복된 행정동 폴리곤 레이어 */}
				<Source id="duplicate-hjdong-polygon-source" type="geojson" data={duplicateHjdongPolygonSourceData}>
					<Layer
						id="duplicate-hjdong-polygon-layer"
						type="fill"
						paint={{
							'fill-color': DuplicateHjdongPloygonLayerStyle.fillColor,
							'fill-opacity': 1,
						}}
					/>
					<Layer
						id="duplicate-hjdong-polygon-line-layer"
						type="line"
						paint={{
							'line-color': DuplicateHjdongPloygonLayerStyle.lineColor,
							'line-width': 1,
						}}
					/>
				</Source>

				{/* 미등록 행정동 폴리곤 레이어 */}
				<Source id="unregistered-hjdong-polygon-source" type="geojson" data={unregisteredHjdongPolygonSourceData}>
					<Layer
						id="unregistered-hjdong-polygon-layer"
						type="fill"
						paint={{
							'fill-color': UnusageHjdongPloygonLayerStyle.fillColor,
							'fill-opacity': 1,
						}}
					/>
					<Layer
						id="unregistered-hjdong-polygon-line-layer"
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
				{/* 그리드 행정동 클릭 시 2초 후 사라지는 행정동 폴리곤 레이어  */}
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

export default MsCenterDistrictMap;
