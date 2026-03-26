/*
 ############################################################################
 # FiledataField	: index.tsx (District)
 # Description		: 기준정보 > 센터기준정보 > 배송권역 권역 탭 메인 컴포넌트
 # Author			: insung son
 # Since			: 25.03.23
 ############################################################################
*/

// Lib
import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

// Component
import { RooutyMapProvider } from '@/components/common/custom/mapgl/mapbox';
import DeliveryDistrictMap from '@/components/ms/deliveryDistrict/district/components/map';
import MasterListGrid from '@/components/ms/deliveryDistrict/district/components/masterListGrid';
import SubListGrid from '@/components/ms/deliveryDistrict/district/components/subListGrid';

// API Call Function
import { apiPostgetCenterHjdongIntersectionList, apiPostgetHjdongList } from '@/api/ms/apiMsDeliveryDistrict';

// Types
import Splitter from '@/components/common/Splitter';
import { IDistrictTabDataState } from '@/pages/ms/MsDeliveryDistrict';

interface DistrictProps {
	tabSearchConditions?: any; // 조회 조건
	districtGridRefs: {
		// 그리드 접근을 위한 ref
		masterGridRef: React.RefObject<any>; // 메인그리드
		subGridRef: React.RefObject<any>; // 서브그리드
	};
	mainGridData: any[]; // 메인 그리드 데이터
	districtTabDatasState: IDistrictTabDataState;
	// {
	// 	districtGroupList: any[]; // 메인 그리드 권역그룹 옵션 리스트 (셀 편집기에서 사용)
	// 	subGridData: any[]; // 서브 그리드 데이터 (행정동)
	// 	centerPolygonData: any[]; // 센터 폴리곤 데이터 (지도 데이터)
	// 	districtGroupPolygonData: any[]; // 권역그룹 폴리곤 데이터 (지도 데이터)
	// 	districtPolygonData: any[]; // 권역 폴리곤 데이터 (지도 데이터)
	// 	usageHjdongList: []; // 현재 등록된 행정동 리스트 (지도에서 권역에 포함된 구역만 클릭이 가능하도록 처리할때 사용)
	// 	unUsageHjdongList: []; // 미사용중인 행정동 리스트 (미사용중인 행정동 리스트 노랑색 색상을 표시 && 서브그리드 에서도 사용)
	// };
	setDistrictTabDataState: (updates: Partial<IDistrictTabDataState>) => void;
	onSearch: () => Promise<void>;
	isSearched: boolean; // 추가/삭제/저장 버튼의 보이기 유무 조건
	pForm: any; // 검색 조건
	// 스크롤 페이징 관련 - 그대로 메인그리드로 넘기기
	districtPage: number;
	districtTotalCount: number;
	onLoadMore: () => void;
	fetchDistrictTab: (values: any, page: number, selectedMasterGridRow?: any) => Promise<void>;
}

const District = ({
	tabSearchConditions,
	districtGridRefs,
	mainGridData,
	districtTabDatasState,
	setDistrictTabDataState,
	onSearch,
	isSearched,
	pForm,
	districtPage,
	districtTotalCount,
	onLoadMore,
	fetchDistrictTab,
}: DistrictProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 행 클릭 시 메인그리드 clearGridtick 처리 용 ref
	const clearTickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	// 메인그리드 선택한 행 데이터 (지도에 맵 폴리곤 표시 처리 + 포커스)- 권역
	const [selectMasterGridRow, setSelectMasterGridRow] = useState<(any & { clickedField: string }) | null>(null); // NOSONAR
	// 서브그리드 선택한 행 데이터 (선택한 행의 rowStatus 가 'I' 인 경우 지도에서 클릭 처리 해야함)
	// (서브 그리드 행추가 + rowStatus I 인 경우 지도 행정동에 표시 위해 사용)
	const [selectSubGridRow, setSelectSubGridRow] = useState<any>(null);

	// 센터권역 그리드 삭제 및 행정동 변경 시 해당 tick 증가 처리 (지도 클릭 폴리곤 재계산 처리)
	const [gridTick, setGridTick] = useState(0);
	const bumpGridTick = useCallback(() => setGridTick(t => t + 1), []); // 센터권역 그리드 삭제 및 행정동 변경 시 해당 tick 증가 처리 (지도 클릭 폴리곤 재계산 처리)
	const clearGridTick = useCallback(() => setGridTick(0), []); // 센터권역 그리드 삭제 및 행정동 변경 시 해당 tick 초기화 처리 (지도 클릭 폴리곤 재계산 처리)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	//   API 요청 함수 분리
	const fetchSubGridData = useCallback(
		async (selectedMasterGridItem: any) => {
			if (!selectedMasterGridItem || !tabSearchConditions) {
				//console.warn('필수 파라미터가 없습니다:', { selectedMasterGridItem, tabSearchConditions });
				return {
					subGridData: [],
					hjdongPeriodList: [],
				};
			}

			const effectiveDateStr = dayjs(tabSearchConditions?.effectiveDate).format('YYYYMMDD');

			try {
				// 행정동 리스트 조회 전 tick 초기화 처리 (지도 클릭 폴리곤 재계산 처리)
				// clearGridTick();
				// 행정동 리스트 조회 전 tick 초기화 처리 (지도 클릭 폴리곤 재계산 처리)
				// 행정동 리스트 요청 처리 && 서브 그리드 리스트 요청 처리
				// const [apiPostgetHjdongListResponse, apiPostgetCenterHjdongIntersectionListResponse] = await Promise.allSettled(
				// 	[
				// 		// 1-2. 서브 그리드 리스트 ->  메인 그리드 행 선택 시 (배송 권역 행정동 리스트 조회)
				// 		apiPostgetHjdongList({
				// 			effectiveDate: dayjs(tabSearchConditions?.effectiveDate).format('YYYYMMDD'),
				// 			dccode: selectedMasterGridItem?.dccode,
				// 			dlvdistrictId: selectedMasterGridItem?.dlvdistrictId,
				// 			dlvgroupId: selectedMasterGridItem?.dlvgroupId,
				// 		}),
				// 		apiPostgetCenterHjdongIntersectionList({
				// 			effectiveDate: dayjs(tabSearchConditions?.effectiveDate).format('YYYYMMDD'),
				// 			dccode: selectedMasterGridItem?.dccode,
				// 			dlvdistrictId: selectedMasterGridItem?.dlvdistrictId,
				// 		}),
				// 	],
				// );

				const [subGridRes, intersectionRes] = await Promise.all([
					apiPostgetHjdongList({
						effectiveDate: effectiveDateStr,
						dccode: selectedMasterGridItem?.dccode,
						dlvdistrictId: selectedMasterGridItem?.dlvdistrictId,
						dlvgroupId: selectedMasterGridItem?.dlvgroupId,
					}),
					apiPostgetCenterHjdongIntersectionList({
						effectiveDate: effectiveDateStr,
						dccode: selectedMasterGridItem?.dccode,
						dlvdistrictId: selectedMasterGridItem?.dlvdistrictId,
					}),
				]);

				const subGridData = (subGridRes?.data ?? []).map((item: any) => ({
					...item,
					rowStatus: 'R',
				}));

				const hjdongPeriodList = Array.isArray(intersectionRes?.data)
					? intersectionRes.data
					: intersectionRes?.data ?? [];

				return { subGridData, hjdongPeriodList };
			} catch (error) {
				// 오류 발생 시 빈 배열 반환

				return {
					subGridData: [],
					hjdongPeriodList: [],
				};
			}
		},
		[tabSearchConditions, bumpGridTick, clearGridTick],
	);

	//   현재 선택된 마스터 그리드 행 기준으로 서브 그리드 데이터 재요청
	const handleRequestHjdongList = useCallback(async () => {
		if (!selectMasterGridRow) {
			//console.warn('선택된 마스터 그리드 행이 없습니다.');
			return;
		}

		await fetchDistrictTab(tabSearchConditions, 1, selectMasterGridRow);

		clearGridTick();
	}, [selectMasterGridRow, tabSearchConditions, fetchDistrictTab, clearGridTick]);

	const DEBOUNCE_MS = 80;
	// 행 클릭 시 메인그리드 clearGridtick 처리 용 디바운스 함수
	const clearGridTickDebounced = useCallback(() => {
		if (clearTickTimerRef.current) {
			clearTimeout(clearTickTimerRef.current);
		}

		clearTickTimerRef.current = setTimeout(() => {
			clearGridTick();
			clearTickTimerRef.current = null;
		}, DEBOUNCE_MS);
	}, [clearGridTick]);

	const EDIT_FIELDS = new Set(['dlvdistrictNm', 'fromDate', 'toDate']);

	const restoreEditor = (row: any) => {
		const grid = districtGridRefs.masterGridRef.current;
		if (!grid) return;

		const field = row?.clickedField;
		const rowIndex = row?.rowIndex;
		if (!EDIT_FIELDS.has(field)) return;
		if (typeof rowIndex !== 'number') return;

		const colIndex = grid.getColumnIndexByDataField?.(field);
		if (typeof colIndex !== 'number' || colIndex < 0) return;

		grid.setSelectionByIndex?.(rowIndex, colIndex);
		grid.setFocus?.();
		grid.openInputer?.();
	};

	// 그리드 선택 함수
	const onSelectMasterGridRow = useCallback(
		async (selectedMasterGridItem: any) => {
			// 선택된 행 정보 즉시 저장 (같은 행이더라도 클릭한 그리드 필드 업데이트 필요로 여기에서 처리)
			setSelectMasterGridRow({
				...selectedMasterGridItem,
				clickedField: selectedMasterGridItem?.clickedField || null,
			});
			// 같은 권역 선택 시 tick 증가 처리 (지도 클릭 폴리곤 재계산 처리)
			clearGridTickDebounced();

			// 메인 그리드 행의 rowStatus 가 'I' 인 경우는 서브그리드리스트 빈값 처리
			if (selectedMasterGridItem?.rowStatus === 'I') {
				setDistrictTabDataState({
					subGridData: [],
				});
			} else {
				try {
					//   분리된 API 요청 함수 호출
					const { subGridData, hjdongPeriodList } = await fetchSubGridData(selectedMasterGridItem);

					//   한 번에 상태 업데이트
					setDistrictTabDataState({
						subGridData,
						hjdongPeriodList,
					});
				} catch (error) {}
			}

			// 2) 편집 필드 클릭이면, 지도 포커싱으로 닫힌 편집을 다시 열기
			if (EDIT_FIELDS.has(selectedMasterGridItem?.clickedField)) {
				setTimeout(() => restoreEditor(selectedMasterGridItem), 150);
			}
		},
		[setDistrictTabDataState, setSelectMasterGridRow, selectMasterGridRow, fetchSubGridData, clearGridTick],
	);
	const onSelectSubGridRow = useCallback((selectedSubGridItem: any) => {
		setSelectSubGridRow(selectedSubGridItem);
	}, []);

	// 검색 검색 후 폴리곤용 tick 초기화(클릭한 행정동 폴리곤 초기화 처리)
	useEffect(() => {
		clearGridTick();
	}, [tabSearchConditions, clearGridTick]);

	// 언마운트 시 디바운스 정리
	useEffect(() => {
		return () => {
			if (clearTickTimerRef.current) clearTimeout(clearTickTimerRef.current);
		};
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		districtGridRefs?.masterGridRef?.current?.resize?.('100%', '100%');
		districtGridRefs?.subGridRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
			{/* 그리드 + 지도 영역 */}
			<div style={{ flex: 1, overflow: 'hidden' }}>
				{/* 그리드 영역 */}
				<Row gutter={16} wrap={false} style={{ height: '100%' }}>
					<Col flex="5 5 0" style={{ height: '100%' }}>
						{/* 컨테이너에 고정 높이 설정 */}
						<div style={{ height: '100%', width: '100%' }}>
							<Splitter
								direction="vertical"
								onResizing={resizeAllGrids}
								onResizeEnd={resizeAllGrids}
								items={[
									<div key="MasterListGrid" style={{ height: '100%', overflow: 'hidden' }}>
										<MasterListGrid
											tabSearchConditions={tabSearchConditions}
											gridRef={districtGridRefs?.masterGridRef}
											gridData={mainGridData}
											districtGroupList={districtTabDatasState.districtGroupList}
											onSelectMasterGridRow={onSelectMasterGridRow}
											setSelectMasterGridRow={setSelectMasterGridRow}
											onRequestDistrictList={onSearch}
											isSearched={isSearched}
											pForm={pForm}
											districtPage={districtPage}
											districtTotalCount={districtTotalCount}
											onLoadMore={onLoadMore}
										/>
									</div>,
									<div key="SubListGrid" style={{ height: '100%', overflow: 'hidden' }}>
										<SubListGrid
											gridRef={districtGridRefs?.subGridRef}
											gridData={districtTabDatasState?.subGridData}
											// unUsageHjdongList={districtTabDatasState?.usageHjdongList}
											hjdongPeriodList={districtTabDatasState?.hjdongPeriodList}
											onRequestHjdongList={handleRequestHjdongList}
											selectMasterGridRow={selectMasterGridRow}
											onSelectSubGridRow={onSelectSubGridRow}
											bumpGridTick={bumpGridTick}
											tabSearchConditions={tabSearchConditions}
										/>
									</div>,
								]}
							/>
						</div>
					</Col>
					{/* 지도 영역 */}
					<Col flex="5 5 0" style={{ height: '100%' }}>
						<RooutyMapProvider>
							<DeliveryDistrictMap
								districtTabDatasState={districtTabDatasState}
								selectMasterGridRow={selectMasterGridRow}
								selectSubGridRow={selectSubGridRow}
								subGridRef={districtGridRefs?.subGridRef}
								gridTick={gridTick}
								bumpGridTick={bumpGridTick}
								tabSearchConditions={tabSearchConditions}
							/>
						</RooutyMapProvider>
					</Col>
				</Row>
			</div>
		</div>
	);
};
export default District;
