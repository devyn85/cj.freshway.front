/*
 ############################################################################
 # FiledataField	: MsDeliveryDistrictDetail.tsx
 # Description		: 기준정보 > 센터기준정보 > 배송권역 화면 영역
 # Author			: insung son
 # Since			: 25.03.23
 ############################################################################
*/

// Lib
import { Tabs } from 'antd';

// Component
import MsDisTrict from '@/components/ms/deliveryDistrict/district';
import DistrictGroup from '@/components/ms/deliveryDistrict/districtGroup/districtgroup';
import PopGrid from '@/components/ms/deliveryDistrict/pop/components/grid/PopGrid';

// Types
import { IDistrictTabDataState, TTabKeyUnion } from '@/pages/ms/MsDeliveryDistrict';

interface MsDeliveryDistrictDetailProps {
	activeTabKey: TTabKeyUnion;
	onTabChange: (key: string) => void;
	onTabClick: (key: string) => void;
	onSearch: (forceRequest?: TTabKeyUnion, isSearch?: boolean) => Promise<void>;
	// 탭별 그리드 데이터 & 페이징
	currentGridData: any[];
	currentPage: Record<TTabKeyUnion, number>;
	totalCnt: Record<TTabKeyUnion, number>;
	// 탭별 상태
	districtTabDatasState: IDistrictTabDataState;
	setDistrictTabDataState: (updates: Partial<IDistrictTabDataState>) => void;
	districtGroupTabDatasState: any;
	setDistrictGroupTabDataState: (updates: any) => void;
	// refs
	districtGridRefs: { masterGridRef: React.RefObject<any>; subGridRef: React.RefObject<any> };
	districtGroupRefs: { masterGridRef: React.RefObject<any>; subGridRef: React.RefObject<any> };
	popGridRef: React.RefObject<any>;
	// 기타
	hasSearched: Record<TTabKeyUnion, boolean>;
	tabSearchConditions: Record<TTabKeyUnion, any>;
	tabGridData: Record<TTabKeyUnion, any[]>;
	// 스크롤 페이징 콜백
	onLoadMoreDistrict: () => Promise<void>;
	onLoadMoreGroup: () => Promise<void>;
	onLoadMorePop: () => Promise<void>;
	// fetch 함수
	fetchDistrictTab: (values: any, page: number, selectedMasterGridRow?: any) => Promise<void>;
	form: any;
}

const MsDeliveryDistrictDetail = ({
	activeTabKey,
	onTabChange,
	onTabClick,
	onSearch,
	currentGridData,
	currentPage,
	totalCnt,
	districtTabDatasState,
	setDistrictTabDataState,
	districtGroupTabDatasState,
	setDistrictGroupTabDataState,
	districtGridRefs,
	districtGroupRefs,
	popGridRef,
	hasSearched,
	tabSearchConditions,
	tabGridData,
	onLoadMoreDistrict,
	onLoadMoreGroup,
	onLoadMorePop,
	fetchDistrictTab,
	form,
}: MsDeliveryDistrictDetailProps) => {
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

	return (
		<Tabs
			className={'contain-wrap'}
			activeKey={activeTabKey}
			onChange={onTabChange}
			onTabClick={onTabClick}
			items={[
				{
					key: 'district',
					label: '권역',
					children: (
						<MsDisTrict
							onSearch={onSearch}
							districtGridRefs={districtGridRefs}
							tabSearchConditions={tabSearchConditions['district']}
							mainGridData={currentGridData}
							districtTabDatasState={districtTabDatasState}
							setDistrictTabDataState={setDistrictTabDataState}
							isSearched={hasSearched['district']}
							pForm={form}
							// 페이지 스크롤 처리 관련
							districtPage={currentPage['district']}
							districtTotalCount={totalCnt['district']}
							onLoadMore={onLoadMoreDistrict}
							fetchDistrictTab={fetchDistrictTab}
						/>
					),
				},
				{
					key: 'districtGroup',
					label: '권역그룹',
					children: (
						<DistrictGroup
							tabSearchConditions={tabSearchConditions['districtGroup']}
							districtGroupRefs={districtGroupRefs}
							mainGridData={currentGridData}
							districtGroupTabDatasState={districtGroupTabDatasState}
							setDistrictGroupTabDataState={setDistrictGroupTabDataState}
							onSearch={onSearch}
							districtTabSearchConditions={tabSearchConditions['district']}
							setDistrictTabDataState={setDistrictTabDataState}
							isSearched={hasSearched['districtGroup']}
							// 페이지 스크롤 처리 관련
							groupPage={currentPage['districtGroup']}
							groupTotalCount={totalCnt['districtGroup']}
							onLoadMore={onLoadMoreGroup}
						/>
					),
				},
				{
					key: 'pop',
					label: '대표POP',
					children: (
						<PopGrid
							gridRef={popGridRef}
							gridData={currentGridData}
							onSearch={onSearch}
							tabSearchConditions={tabSearchConditions}
							setDistrictGroupTabDataState={setDistrictGroupTabDataState}
							isSearched={hasSearched['pop']}
							popPage={currentPage['pop']}
							popTotalCount={totalCnt['pop']}
							onLoadMore={onLoadMorePop}
						/>
					),
				},
			]}
		/>
	);
};

export default MsDeliveryDistrictDetail;
