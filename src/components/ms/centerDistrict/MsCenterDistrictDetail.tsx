/*
 ############################################################################
 # FiledataField	: MsCenterDistrictDetail.tsx
 # Description		: 센터권역 관리 상세 영역
 # Author			: son insung
 # Since			: 26.03.20
 ############################################################################
 */

// Lib
import { Collapse } from 'antd';
import { Col, Row } from 'antd/lib';

// Component
import { RooutyMapProvider } from '@/components/common/custom/mapgl/mapbox';
import MsCenterDistrictListGrid from '@/components/ms/centerDistrict/MsCenterDistrictListGrid';
import MsCenterDistrictMap from '@/components/ms/centerDistrict/MsCenterDistrictMap';
import MsCenterDistrictNewHjdongWithoutPolygonListGrid from '@/components/ms/centerDistrict/MsCenterDistrictNewHjdongWithoutPolygonListGrid';

// Types
import { NewHjdongListType } from '@/components/ms/centerDistrict/types';

interface MsCenterDistrictDetailProps {
	form: any;
	searchParams: any;
	centerGridData: any;
	centerGridRef: React.RefObject<any>;
	centerPolygonData: any[];
	selectedRowInCenterGrid: any;
	setSelectedRowInCenterGrid: (row: any) => void;
	newHjdongList: NewHjdongListType[];
	newCreatedHjdongWithoutPolygonList: NewHjdongListType[];
	isNewCreatedHjdongWithoutPolygonGridOpen: boolean;
	setIsNewCreatedHjdongWithoutPolygonGridOpen: (open: boolean) => void;
	gridTick: number;
	bumpGridTick: () => void;
	hasSearched: boolean;
	refetchList: (requestType: 'ALL' | 'MAIN', searchParams: any) => void;
}

const MsCenterDistrictDetail = ({
	form,
	searchParams,
	centerGridData,
	centerGridRef,
	centerPolygonData,
	selectedRowInCenterGrid,
	setSelectedRowInCenterGrid,
	newHjdongList,
	newCreatedHjdongWithoutPolygonList,
	isNewCreatedHjdongWithoutPolygonGridOpen,
	setIsNewCreatedHjdongWithoutPolygonGridOpen,
	gridTick,
	bumpGridTick,
	hasSearched,
	refetchList,
}: MsCenterDistrictDetailProps) => {
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

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<div style={{ height: 'calc(85vh - 115px)', display: 'flex', flexDirection: 'column' }}>
			<div style={{ flex: 1, overflow: 'hidden' }}>
				{/* Layout : 가로 2row */}
				<Row gutter={16} wrap={false} style={{ height: '100%' }}>
					{/* 왼쪽 */}
					<Col flex="5 5 0" style={{ height: '100%' }}>
						<Row style={{ position: 'relative', height: '100%' }}>
							<div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
								{/* 상단: 기존 센터권역 그리드 */}
								<div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
									<MsCenterDistrictListGrid
										gridData={centerGridData}
										gridRef={centerGridRef}
										setSelectedRowInCenterGrid={setSelectedRowInCenterGrid}
										refetchList={refetchList}
										form={form}
										searchParams={searchParams}
										bumpGridTick={bumpGridTick}
										newHjdongList={newHjdongList}
										hasSearched={hasSearched}
										isNewCreatedHjdongWithoutPolygonGridOpen={isNewCreatedHjdongWithoutPolygonGridOpen}
									/>
								</div>

								{/* 하단: 신설 행정동 그리드 리스트 */}
								<div
									style={{
										flex: `0 0 ${isNewCreatedHjdongWithoutPolygonGridOpen ? 280 : 40}px`,
										height: isNewCreatedHjdongWithoutPolygonGridOpen ? 280 : 40,
										minHeight: 0,
										overflow: 'hidden',
										transition: 'height 0.2s ease, flex-basis 0.2s ease',
									}}
								>
									<Collapse
										activeKey={isNewCreatedHjdongWithoutPolygonGridOpen ? ['return'] : []}
										onChange={keys => {
											const arr = Array.isArray(keys) ? keys : [keys];
											const nextOpen = arr.includes('return');
											setIsNewCreatedHjdongWithoutPolygonGridOpen(nextOpen);
										}}
										style={{ height: '100%' }}
									>
										<Collapse.Panel header={`신설 행정동 ${newCreatedHjdongWithoutPolygonList.length}건`} key="return">
											<div style={{ height: 220 }}>
												<MsCenterDistrictNewHjdongWithoutPolygonListGrid
													gridData={newCreatedHjdongWithoutPolygonList}
													searchParams={searchParams}
													isOpen={isNewCreatedHjdongWithoutPolygonGridOpen}
													refetchList={refetchList}
												/>
											</div>
										</Collapse.Panel>
									</Collapse>
								</div>
							</div>
						</Row>
					</Col>

					{/* 오른쪽 지도 영역 */}
					<Col flex="5 5 0" style={{ height: '100%' }}>
						<RooutyMapProvider>
							<MsCenterDistrictMap
								selectedRowInCenterGrid={selectedRowInCenterGrid}
								centerGridData={centerGridData}
								centerGridRef={centerGridRef}
								centerPolygonData={centerPolygonData}
								form={form}
								searchParams={searchParams}
								gridTick={gridTick}
								newHjdongList={newHjdongList}
								bumpGridTick={bumpGridTick}
							/>
						</RooutyMapProvider>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default MsCenterDistrictDetail;
