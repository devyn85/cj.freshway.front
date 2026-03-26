/*
 ############################################################################
 # FiledataField	: districtgroup.tsx
 # Description		: 기준정보 > 센터기준정보 > 배송권역 권역그룹 탭 메인 컴포넌트
 # Author			: insung son
 # Since			: 25.03.23
 ############################################################################
*/

// Lib
import dayjs from 'dayjs';

// Component
import DistrictGroupMasterListGrid from '@/components/ms/deliveryDistrict/districtGroup/districtGroupMasterListGrid';
import DistrictGroupSubListGrid from '@/components/ms/deliveryDistrict/districtGroup/districtGroupSubListGrid';

// Util
import { mergeGroupPopListByPopNo } from '@/components/ms/deliveryDistrict/common/deliveryDistrictUtils';
import { validateDistrictGroupPop } from '@/components/ms/deliveryDistrict/districtGroup/validations';

// API Call Function
import { apiPostGetDistrictGroupXPop, apiPostGetDlvDistrictgroupPopList } from '@/api/ms/apiMsDeliveryDistrict';

// Hooks
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

// Types
import Splitter from '@/components/common/Splitter';
import { TTabKeyUnion } from '@/pages/ms/MsDeliveryDistrict';

interface DistrictProps {
	tabSearchConditions: any; // 조회 조건
	districtGroupRefs: {
		// 그리드 접근 refs
		masterGridRef: React.RefObject<any>;
		subGridRef: React.RefObject<any>;
	};
	mainGridData: any[]; // 메인 그리드 데이터
	districtGroupTabDatasState: {
		subGridData: []; // 서브 그리드 데이터 (대표 POP)
		popList: []; // POP 리스트 (권역그룹에 속한 POP 리스트)
		selectMainGridRowData: any; // 선택된 메인 그리드 행 데이터
	};
	setDistrictGroupTabDataState: (districtGroupTabData: any) => void;
	onSearch: () => Promise<void>; //   검색 함수 추가 (저장 후 메인 그리드 재요청 처리)
	// 권역그룹 탭의 검색 조건 (권역그룹 저장 시 권역탭 조회가 되었다면 권역그룹 리스트 갱신을 위해 재요청분기 조건 처리용)
	districtTabSearchConditions: Record<TTabKeyUnion, any>;
	// 권역탭의 권역그리드 데이터 권역그룹 리스트 갱신 setState 처리 함수
	setDistrictTabDataState: (districtTabData: any) => void;
	isSearched: boolean; // 추가/삭제/저장 버튼의 보이기 유무 조건
	// 페이지 스크롤 처리 관련
	groupPage: number;
	groupTotalCount: number;
	onLoadMore: () => void;
}

const DistrictGroup = ({
	tabSearchConditions,
	districtGroupRefs,
	mainGridData,
	districtGroupTabDatasState,
	setDistrictGroupTabDataState,
	onSearch,
	districtTabSearchConditions,
	setDistrictTabDataState,
	isSearched,
	groupPage,
	groupTotalCount, // TODO: 추후 api 처리 시 그리드 상단 총 갯수를 이걸로 교체 처리하기기
	onLoadMore,
}: DistrictProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 메인 그리드 행 선택 함수 (선택 시 서브그리드 + POP 리스트 갱신)
	const onSelectMasterGridRow = useCallback(
		async (selectedGridRowObj: any) => {
			if (districtGroupTabDatasState?.selectMainGridRowData) {
				// 이전에 선택한 행 처리 안함 처리하기
				const prevData = districtGroupTabDatasState?.selectMainGridRowData;
				const isSameRow =
					districtGroupTabDatasState?.selectMainGridRowData &&
					districtGroupTabDatasState?.selectMainGridRowData?.dlvgroupId === selectedGridRowObj?.dlvgroupId &&
					districtGroupTabDatasState?.selectMainGridRowData?.dlvgroupNm === selectedGridRowObj?.dlvgroupNm &&
					dayjs(prevData?.fromDate, 'YYYYMMDD').isSame(dayjs(selectedGridRowObj?.fromDate, 'YYYYMMDD'), 'day') &&
					dayjs(prevData?.toDate, 'YYYYMMDD').isSame(dayjs(selectedGridRowObj?.toDate, 'YYYYMMDD'), 'day');

				if (isSameRow) {
					return;
				}

				// 선택된 행 정보 즉시 저장 (중복 방지를 위해 필수)
				setDistrictGroupTabDataState({
					selectMainGridRowData: selectedGridRowObj,
				});

				// 메인 그리드 행의 rowStatus 가 'I' 인 경우는 서브그리드리스트 빈값 처리
				// 대표pop 리스트는 전체 조회시만 변경 처리
				if (selectedGridRowObj?.rowStatus === 'I') {
					setDistrictGroupTabDataState({
						subGridData: [],
					});
				} else {
					try {
						//   분리된 API 요청 함수 호출
						const response = await apiPostGetDistrictGroupXPop({
							dccode: selectedGridRowObj?.dccode,
							dlvgroupId: selectedGridRowObj?.dlvgroupId,
							effectiveDate: dayjs(tabSearchConditions.effectiveDate).format('YYYYMMDD'),
						});

						if (response?.statusCode === 0) {
							const subGridData = (response.data || []).map((x: any) => ({ ...x, rowStatus: 'R' }));
							setDistrictGroupTabDataState({
								subGridData: subGridData,
							});
							// pop 리스트 유효성 검사 처리
							validateDistrictGroupPop(
								subGridData,
								dayjs(selectedGridRowObj?.fromDate, 'YYYYMMDD'),
								dayjs(selectedGridRowObj?.toDate, 'YYYYMMDD'),
							);
						} else {
							setDistrictGroupTabDataState({
								subGridData: [],
							});
						}
					} catch (error) {}
				}
			}
		},
		[districtGroupTabDatasState, setDistrictGroupTabDataState, tabSearchConditions],
	);

	// 서브그리드 재요청 처리 (저장 후)
	const onRequestSubGridList = useCallback(async () => {
		try {
			//   분리된 API 요청 함수 호출
			const response = await apiPostGetDistrictGroupXPop({
				dccode: districtGroupTabDatasState?.selectMainGridRowData?.dccode,
				dlvgroupId: districtGroupTabDatasState?.selectMainGridRowData?.dlvgroupId,
				effectiveDate: dayjs(tabSearchConditions.effectiveDate).format('YYYYMMDD'),
			});

			if (response?.statusCode === 0) {
				const subGridData = (response.data || []).map((x: any) => ({ ...x, rowStatus: 'R' }));
				setDistrictGroupTabDataState({
					subGridData: subGridData,
				});
				// pop 리스트 유효성 검사 처리
				validateDistrictGroupPop(
					subGridData,
					dayjs(districtGroupTabDatasState?.selectMainGridRowData?.fromDate, 'YYYYMMDD'),
					dayjs(districtGroupTabDatasState?.selectMainGridRowData?.toDate, 'YYYYMMDD'),
				);
			} else {
				// 싱패시 일단 그냥 냅두기
			}

			// 권역탭 권역그룹 리스트 재요청 처리
			const responseAllGroupList = await apiPostGetDlvDistrictgroupPopList({
				dccode: districtGroupTabDatasState?.selectMainGridRowData?.dccode,
				effectiveDate: dayjs(tabSearchConditions.effectiveDate).format('YYYYMMDD'),
			});
			if (responseAllGroupList?.statusCode === 0) {
				const allGroupList = (responseAllGroupList.data || []).map((x: any) => ({
					...x,
					groupPopList: mergeGroupPopListByPopNo(x.groupPopList),
				}));
				setDistrictTabDataState({
					districtGroupList: allGroupList,
				});
			}
		} catch (error) {}
	}, [districtGroupTabDatasState, setDistrictGroupTabDataState, tabSearchConditions]);

	useScrollPagingAUIGrid({
		gridRef: districtGroupRefs?.masterGridRef,
		callbackWhenScrollToEnd: () => {
			onLoadMore();
		},
		totalCount: groupTotalCount,
	});

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		districtGroupRefs?.masterGridRef?.current?.resize?.('100%', '100%');
		districtGroupRefs?.subGridRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<div key="DistrictGroupMasterListGrid" style={{ height: '100%', overflow: 'hidden' }}>
						<DistrictGroupMasterListGrid
							gridData={mainGridData}
							gridRef={districtGroupRefs?.masterGridRef}
							tabSearchConditions={tabSearchConditions}
							onSelectMasterGridRow={onSelectMasterGridRow}
							onSearch={onSearch}
							districtTabSearchConditions={districtTabSearchConditions}
							setDistrictTabDataState={setDistrictTabDataState}
							isSearched={isSearched}
							selectMasterGridRow={districtGroupTabDatasState?.selectMainGridRowData}
						/>
					</div>,
					<div key="DistrictGroupSubListGrid" style={{ height: '100%', overflow: 'hidden' }}>
						<DistrictGroupSubListGrid
							gridData={districtGroupTabDatasState?.subGridData}
							gridRef={districtGroupRefs?.subGridRef}
							selectablePopList={districtGroupTabDatasState?.popList}
							selectMasterGridRow={districtGroupTabDatasState?.selectMainGridRowData}
							onRequestSubGridList={onRequestSubGridList}
							tabSearchConditions={tabSearchConditions}
						/>
					</div>,
				]}
			/>
		</div>
	);
};

export default DistrictGroup;
