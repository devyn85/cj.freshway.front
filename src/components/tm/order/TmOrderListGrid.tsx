/*
############################################################################
# Component: TmOrderListGrid (주문목록 그리드)
# 목적: TmOrderList 화면의 주문 목록을 AUIGrid로 표시하고 상호작용 처리
# 
# [주요 기능]
# - AUIGrid 기반 주문 목록 표시
# - 좌표오류 컬럼 더블클릭 시 좌표 설정 모달 오픈
# - 우클릭 메뉴를 통한 좌표수정/거래처정보 기능
# - 차량정보 컬럼 (현재 비활성화, fixedVehicleInfo)
# - 필터링, 다중 셀 선택 등 그리드 기본 기능
# 
# [그리드 컬럼]
# - dcname: 물류센터
# - deliverydate: 배송일자
# - tmDeliverytype: 배송유형
# - ordertypeNm: 주문유형
# - dlvgroupNm: 권역그룹
# - dlvdistrictNm: 권역
# - popno: POP 여부
# - hjdongCd: 행정동코드
# - claimYn: 클레임 여부
# - toCustkey: 관리처코드
# - toCustname: 관리처명명
# - toCustAddress: 관리처 주소
# - toTruthcustkey: 실착지코드
# - toTruthcustname: 실착지명
# - toTruthcustAddress: 실착지 주소
# - coordinateYn: 좌표오류 (N -> Y로 표시)
# - orderQty: 주문수량
# - orderWeight: 중량
# - orderCube: 체적
# - fixedVehicleInfo: 차량정보(고정POP할당) - 현재 비활성화
# 
# [사용처]
# - TmOrderList.tsx에서 주문 목록 표시용으로 사용
# - gridViewData를 받아서 그리드에 표시
# 
# [Props]
# - data: 그리드에 표시할 주문 목록 데이터
# - totalCnt: 전체 데이터 건수
# - onClickEditGeo: 좌표 수정 모달 열기 함수
# - onClickCustInfo: 거래처 정보 모달 열기 함수
# - toolbarRight: 우측 툴바 영역에 표시할 컴포넌트
# - onGridReady: 그리드 준비 완료 시 호출되는 콜백 함수
############################################################################
*/
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { showAlert } from '@/util/MessageUtil';
import { Button, Dropdown } from 'antd';
import { useEffect, useRef } from 'react';

const TmOrderListGrid = ({
	data,
	totalCnt,
	onClickEditGeo,
	onClickCustInfo,
	onClickClaim,
	toolbarRight,
	onGridReady,
}: any) => {
	// AUIGrid 인스턴스 참조
	const gridRef: any = useRef(null);

	// 그리드 버튼 설정 (엑셀 내보내기, 인쇄 등)
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
	};

	//푸터 설정
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'dccode',
		},
		{
			dataField: 'claimYn',
			positionField: 'claimYn',
			expFunction: function (columnValues: any) {
				return columnValues.filter((v: any) => v === 'Y').length;
			},
		},
		{
			dataField: 'selfTypeYn',
			positionField: 'selfTypeYn',
			expFunction: function (columnValues: any) {
				return columnValues.filter((v: any) => v === 'Y').length;
			},
		},
		{
			dataField: 'toCustkey',
			positionField: 'toCustkey',
			operation: 'COUNT',
			expFunction: function (columnValues: any) {
				const uniqueKeys = new Set(columnValues);
				return uniqueKeys.size;
			},
		},
		{
			dataField: 'toTruthcustkey',
			positionField: 'toTruthcustkey',
			operation: 'COUNT',
			expFunction: function (columnValues: any) {
				const uniqueKeys = new Set(columnValues);
				return uniqueKeys.size;
			},
		},
		{
			dataField: 'orderQty',
			positionField: 'orderQty',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
		{
			dataField: 'orderCube',
			positionField: 'orderCube',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
		{
			dataField: 'orderWeight',
			positionField: 'orderWeight',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
	];

	// AUIGrid 기본 속성 설정
	const gridProps = {
		editable: false, // 편집 불가 모드
		fillColumnSizeMode: false, // 컬럼 크기 자동 조정 비활성화
		showFooter: true, // 하단 푸터 표시
		enableFilter: true, // 필터링 기능 활성화
		useContextMenu: true, // 우클릭 컨텍스트 메뉴 활성화
	} as any;

	// 그리드 컬럼 정의
	const gridCol: any[] = [
		{ dataField: 'dccode', dataType: 'code', headerText: '물류센터코드' },
		{ dataField: 'dcname', dataType: 'code', headerText: '물류센터' },
		{ dataField: 'deliverydate', dataType: 'date', headerText: '배송일자', minWidth: 100 },
		{ dataField: 'tmDeliverytypeNm', dataType: 'code', headerText: '배송유형' },
		{ dataField: 'ordertypeNm', dataType: 'code', headerText: '주문유형' },
		{ dataField: 'dlvgroupNm', dataType: 'code', headerText: '권역그룹' },
		{ dataField: 'dlvdistrictNm', dataType: 'code', headerText: '권역' },
		{ dataField: 'popno', dataType: 'code', headerText: 'POP' },
		{ dataField: 'hjdongCd', dataType: 'code', headerText: '행정동코드' },
		{ dataField: 'claimYn', dataType: 'code', headerText: '클레임' },
		{ dataField: 'selfTypeYn', dataType: 'code', headerText: '고객자차', visible: false },
		{ dataField: 'toCustkey', headerText: '관리처코드' },
		{ dataField: 'toCustname', headerText: '관리처명' },
		{ dataField: 'toCustAddress', headerText: '관리처주소' },
		{
			dataField: 'toTruthcustkey',
			headerText: '실착지코드',
			styleFunction: (
				rowIndex: number,
				columnIndex: number,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
			) => {
				if (String(item?.truthcustkeyExistsYn || '').toUpperCase() === 'N') {
					return 'coordinate-error';
				}
			},
		},
		{ dataField: 'toTruthcustname', headerText: '실착지' },
		{ dataField: 'toTruthcustAddress', headerText: '실착지주소' },
		{
			dataField: 'coordinateYn',
			dataType: 'code',
			headerText: '좌표오류',
			labelFunction: (_r: any, _c: any, v: any) => String(v).toUpperCase(),
			styleFunction: (
				rowIndex: number,
				columnIndex: number,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
			) => {
				if (String(value).toUpperCase() === 'Y') {
					return 'coordinate-error';
				}
			},
		},
		{
			dataField: 'otdTimeYn',
			dataType: 'code',
			headerText: 'OTD오류',
			labelFunction: (_r: any, _c: any, v: any) => String(v).toUpperCase(),
			styleFunction: (
				rowIndex: number,
				columnIndex: number,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
			) => {
				if (String(value).toUpperCase() === 'Y') {
					return 'coordinate-error';
				}
			},
		},
		{ dataField: 'orderQty', headerText: '주문수량', dataType: 'numeric', formatString: '#,##0.00' },
		{ dataField: 'orderWeight', headerText: '중량(kg)', dataType: 'numeric', formatString: '#,##0.00' },
		{ dataField: 'orderCube', headerText: '체적(m³)', dataType: 'numeric', formatString: '#,##0.00' },
		{
			dataField: 'carnoYn',
			dataType: 'code',
			headerText: '고정차량번호여부',
			visible: false,
			styleFunction: (
				rowIndex: number,
				columnIndex: number,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
			) => {
				if (String(value).toUpperCase() === 'N') {
					return 'coordinate-error';
				}
			},
		},
	];

	// 데이터 바인딩: props로 받은 데이터를 그리드에 설정
	useEffect(() => {
		const grid = gridRef.current;
		grid.setFooter(footerLayout);
		if (grid) {
			if (Array.isArray(data) && data.length > 0) {
				grid.setGridData(data);
				if (!commUtil.isEmpty(data)) grid.setColumnSizeList(grid.getFitColumnSizeList(true));
			} else {
				grid.setGridData([]);
			}
		}
	}, [data]);

	// 부모 컴포넌트에서 AUIGrid 인스턴스 접근 가능하도록 노출
	useEffect(() => {
		if (onGridReady && gridRef.current) {
			onGridReady(gridRef.current);
		}
	}, [onGridReady]);

	// 좌표오류 컬럼 더블클릭 시 좌표설정 모달 오픈
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;

		const handleCellDblClick = (event: any) => {
			// 좌표오류 컬럼만 처리
			if (event?.dataField !== 'coordinateYn' && event?.dataField !== 'claimYn') return;

			const row = event?.item;

			if (event?.dataField === 'coordinateYn') {
				const needsGeoFix = String(row?.coordinateYn || '').toUpperCase() === 'Y';
				if (!needsGeoFix) return;

				// 부모 컴포넌트의 좌표 수정 함수 호출
				if (onClickEditGeo) onClickEditGeo(row, event?.rowIndex);
			}

			if (event?.dataField === 'claimYn') {
				if (row?.claimYn === 'Y') {
					onClickClaim(row, event?.rowIndex);
				}
			} //
		};

		grid.bind('cellDoubleClick', handleCellDblClick);
		return () => {
			grid.unbind('cellDoubleClick', handleCellDblClick);
		};
	}, [onClickEditGeo]);

	// 우클릭 메뉴 항목 정의
	const moreMenuItems = [
		{ key: 'editGeo', label: '좌표수정' },
		{ key: 'custInfo', label: '거래처정보' },
	];

	// 우클릭 메뉴 클릭 처리
	const handleClickMoreMenu = ({ key }: { key: string }) => {
		// 선택된 행과 인덱스 가져오기
		const selected = gridRef.current?.getSelectedRows?.()?.[0];
		const selectedIndex = gridRef.current?.getSelectedIndex?.()?.[0];
		if (!selected) {
			showAlert('알림', '먼저 행을 선택하세요.');
			return;
		}

		// 메뉴 항목에 따른 처리
		switch (key) {
			case 'editGeo':
				onClickEditGeo?.(selected, selectedIndex);
				break;
			case 'custInfo':
				onClickCustInfo?.(selected);
				break;
			default:
				break;
		}
	};

	return (
		<>
			<AGrid className="contain-wrap">
				{/* 그리드 상단 버튼 영역 */}
				<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={totalCnt} position="postfix">
					{/* 우측 툴바: 부모에서 전달받은 버튼 또는 기본 더보기 메뉴 */}
					{toolbarRight || (
						<Dropdown menu={{ items: moreMenuItems, onClick: handleClickMoreMenu }}>
							<Button>더보기</Button>
						</Dropdown>
					)}
				</GridTopBtn>
				{/* AUIGrid 컴포넌트 */}
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			{/* 페이지네이션 제거: 전체 데이터 한번에 표시 */}
		</>
	);
};

export default TmOrderListGrid;
