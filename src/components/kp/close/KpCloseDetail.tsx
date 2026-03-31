/*
 ############################################################################
 # FiledataField	: KpCloseDetail.tsx
 # Description		: 모니터링 > 물동 > 물동마감 진행 현황 Grid
 # Author			: KimDongHan
 # Since			: 2025.08.22
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import { useMoveMenu } from '@/hooks/useMoveMenu';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const KpCloseDetail = ({ gridData, gridDataDetail, gridRef, gridRef1, searchDetailList, saveMasterList }: any) => {
	//const KpCloseDetail = ({ gridData, gridDataDetail, gridRef, gridRef1 }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const { moveMenu } = useMoveMenu();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 속성 Master
	const gridProps = {
		editable: false, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		showFooter: true, // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		enableCellMerge: true, // 그리드 머지에 필요한 속성
	};

	// 아래 컬럼 0 이 아닌 경우 색표시 처리
	// 입고 : 구매입고 > 미처리건, 진오더 미전환 건
	// 입고 : 광역입고 > 미처리건
	// 입고 : 반품입고 > 미처리건
	// 출고 : 고객출고 > 미처리건, 진오더 미전환 건
	// 출고 : 광역출고 > 미처리건
	// 출고 : 협력사반품 > 미처리건
	// 재고 : 운송중재고 > 오더건수
	// 재고 : 일배재고 > 오더건수
	// 재고 : 폐기예약 > 오더건수
	// 재고 : 감모예약 > 오더건수
	// 재고 : 반품예약 > 오더건수
	// 0 AS DP_NSTO_NREAL       /* 구매입고 : 진오더 미전환 건 */ AS-IS 해당컬럼 없음.
	// 0 AS WD_NSTO_NREAL       /* 고객출고 : 진오더 미전환 건 */ AS-IS 해당컬럼 없음.
	const styleFunction = (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
		return value !== 0 ? 'gc-user32' : '';
	};

	const gridCol = [
		// 1. 물류센터
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code', editable: false, width: 80 }, // 물류센터
		{ dataField: 'dcname', headerText: t('lbl.DCNAME'), dataType: 'code', editable: false, width: 100 }, // 물류센터명
		// 2. 플랜트
		{ dataField: 'plant', headerText: t('lbl.PLANT'), dataType: 'code', editable: false, width: 100 }, // 플랜트
		// 3. 입고
		{
			headerText: t('lbl.DP'),
			children: [
				{
					// 3-1. 구매입고
					headerText: t('lbl.RECEIPTQTY_KP'),
					children: [
						{
							dataField: 'dpNstoTot',
							headerText: t('lbl.TOTAL_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 100,
						}, // 구매입고 전체건
						{
							dataField: 'dpNstoComp',
							headerText: t('lbl.PROCESS_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 100,
						}, // 구매입고 처리건
						{
							dataField: 'dpNstoNcomp',
							headerText: t('lbl.UNPROCESS_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 100,
							styleFunction,
						}, // 구매입고 미처리건
						// {
						// 	// 3-1-4. 진오더 미전환 건
						// 	dataField: 'dpNstoNreal',
						// 	headerText: t('lbl.ORDER_CONVERSION_CNT'),
						// 	dataType: 'numeric',
						// 	editable: false,
						// 	width: 100,
						// 	styleFunction,
						// },
					],
				},
				{
					// 3-2. 광역입고
					headerText: t('lbl.RECEIPTQTY_STO_KP'),
					children: [
						{ dataField: 'dpStoTot', headerText: t('lbl.TOTAL_CNT'), dataType: 'numeric', editable: false, width: 100 }, // 광역입고 전체건
						{
							dataField: 'dpStoComp',
							headerText: t('lbl.PROCESS_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 100,
						}, // 광역입고 처리건
						{
							dataField: 'dpStoNcomp',
							headerText: t('lbl.UNPROCESS_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 100,
							styleFunction,
						}, // 광역입고 미처리건
					],
				},
				{
					// 3-3. 반품입고
					headerText: t('lbl.RETURNQTY_KP'),
					children: [
						{ dataField: 'rtTot', headerText: t('lbl.TOTAL_CNT'), dataType: 'numeric', editable: false, width: 100 }, // 반품입고 전체건
						{ dataField: 'rtComp', headerText: t('lbl.PROCESS_CNT'), dataType: 'numeric', editable: false, width: 100 }, // 반품입고 처리건
						{
							dataField: 'rtNcomp',
							headerText: t('lbl.UNPROCESS_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 100,
							styleFunction,
						}, // 반품입고 미처리건
					],
				},
			],
		},
		// 4. 출고
		{
			headerText: t('lbl.WD'),
			children: [
				{
					// 4-1. 고객출고
					headerText: t('lbl.ORDERQTY_KP'),
					children: [
						{
							dataField: 'wdNstoTot',
							headerText: t('lbl.TOTAL_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 100,
						}, // 고객출고 전체건
						{
							dataField: 'wdNstoComp',
							headerText: t('lbl.PROCESS_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 100,
						}, // 고객출고 처리건
						{
							dataField: 'wdNstoNcomp',
							headerText: t('lbl.UNPROCESS_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 100,
							styleFunction,
						}, // 고객출고 미처리건
						// {
						// 	// 4-1-4. 진오더 미전환 건
						// 	dataField: 'wdNstoNreal',
						// 	headerText: t('lbl.ORDER_CONVERSION_CNT'),
						// 	dataType: 'numeric',
						// 	editable: false,
						// 	width: 100,
						// 	styleFunction,
						// },
					],
				},
				{
					// 4-1. 출고정정
					headerText: t('lbl.WD_MODIFY'),
					children: [
						{
							dataField: 'wdQuickNcomp',
							headerText: t('lbl.UNPROCESS_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 100,
							styleFunction,
						}, // 출고정정 미처리건
					],
				},
				{
					// 4-2. 광역출고
					headerText: t('lbl.ORDERQTY_STO_KP'),
					children: [
						{ dataField: 'wdStoTot', headerText: t('lbl.TOTAL_CNT'), dataType: 'numeric', editable: false, width: 100 }, // 광역출고 전체건
						{
							dataField: 'wdStoComp',
							headerText: t('lbl.PROCESS_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 100,
						}, // 광역출고 처리건
						{
							dataField: 'wdStoNcomp',
							headerText: t('lbl.UNPROCESS_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 100,
							styleFunction,
						}, // 광역출고 미처리건
					],
				},
				{
					// 4-3. 협력사반품
					headerText: t('lbl.VENDORETURNYN'),
					children: [
						{ dataField: 'rtStoTot', headerText: t('lbl.TOTAL_CNT'), dataType: 'numeric', editable: false, width: 100 }, // 협력사반품 전체건
						{
							dataField: 'rtCustComp',
							headerText: t('lbl.PROCESS_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 100,
						}, // 협력사반품 처리건
						{
							dataField: 'rtCustNcomp',
							headerText: t('lbl.UNPROCESS_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 100,
							styleFunction,
						}, // 협력사반품 미처리건
					],
				},
			],
		},
		// 5. 재고
		{
			headerText: t('lbl.STOCK'),
			children: [
				{
					// 5-1. 운송중재고
					headerText: t('lbl.DELIVERYING_STOCK'),
					children: [
						{
							dataField: 'stoSt',
							headerText: t('lbl.ORDER_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 150,
							styleFunction,
						}, // 운송중재고 오더건수
					],
				},
				{
					// 5-2. 일배재고
					headerText: t('lbl.DAILYSTOCKQTY_KP'),
					children: [
						{
							dataField: 'dailySt',
							headerText: t('lbl.DAILYCROSS_SKU_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 150,
							styleFunction,
						}, // 일배재고 오더건수
					],
				},
				{
					// 5-3. 폐기예약
					headerText: t('lbl.DISUSE_RESERVE'),
					children: [
						{
							dataField: 'ajDuNcomp',
							headerText: t('lbl.ORDER_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 150,
							styleFunction,
						}, // 폐기예약 오더건수
					],
				},
				{
					// 5-4. 감모예약
					headerText: t('lbl.DECREASE_RESERVE'),
					children: [
						{
							dataField: 'ajDdNcomp',
							headerText: t('lbl.ORDER_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 150,
							styleFunction,
						}, // 감모예약 오더건수
					],
				},
				{
					// 5-5. 반품예약
					headerText: t('lbl.RETURN_RESERVE'),
					children: [
						{
							dataField: 'rtVendorNcomp',
							headerText: t('lbl.ORDER_CNT'),
							dataType: 'numeric',
							editable: false,
							width: 150,
							styleFunction,
						}, // 반품예약 오더건수
					],
				},
			],
		},

		// {
		// 	// expr:iif(CLOSEYN='Y','False','True')
		// 	// CLOSEYN 이 'Y' 면 버튼이 안보이고, Y가 아니면 버튼이 보인다.
		// 	// Y 면 Y 가 텍스트로 보여야 함.
		// 	dataField: 'closeyn',
		// 	headerText: t('lbl.MONTH_CLOSE_YN'),
		// 	dataType: 'code',
		// 	editable: false,
		// 	renderer: {
		// 		type: 'TemplateRenderer',
		// 	},
		// 	labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
		// 		// HTML 템플릿 작성
		// 		return item.closeyn === 'Y'
		// 			? `<div>${item.closeyn}</div>`
		// 			: `<button type="button" class="closeyn-btn">${t('lbl.CLOSE_REG')}</button>`;
		// 	},
		// 	width: 120,
		// },

		{
			dataField: 'closeyn',
			headerText: t('lbl.MONTH_CLOSE_YN'),
			dataType: 'code',
			renderer: {
				type: 'ButtonRenderer',
				onClick: (event: any) => {
					saveMasterList(event.item);
				},
				labelText: t('lbl.CLOSE_REG'), // 버튼에 표시할 텍스트
				disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any) => {
					return item.closeyn === 'Y' ? true : false;
				},
			},
		},
	];

	const footerLayout = [
		{ labelText: t('lbl.TOTAL'), positionField: 'dccode', colSpan: 3 }, // 합계 라벨
		{ dataField: 'dpNstoTot', positionField: 'dpNstoTot', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 구매입고 전체건
		{ dataField: 'dpNstoComp', positionField: 'dpNstoComp', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 구매입고 처리건
		{ dataField: 'dpNstoNcomp', positionField: 'dpNstoNcomp', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 구매입고 미처리건
		{ dataField: 'dpNstoNreal', positionField: 'dpNstoNreal', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 구매입고 진오더 미전환 건
		{ dataField: 'dpStoTot', positionField: 'dpStoTot', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 광역입고 전체건
		{ dataField: 'dpStoComp', positionField: 'dpStoComp', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 광역입고 처리건
		{ dataField: 'dpStoNcomp', positionField: 'dpStoNcomp', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 광역입고 미처리건
		{ dataField: 'rtTot', positionField: 'rtTot', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 반품입고 전체건
		{ dataField: 'rtComp', positionField: 'rtComp', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 반품입고 처리건
		{ dataField: 'rtNcomp', positionField: 'rtNcomp', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 반품입고 미처리건
		{ dataField: 'wdNstoTot', positionField: 'wdNstoTot', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 고객출고 전체건
		{ dataField: 'wdNstoComp', positionField: 'wdNstoComp', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 고객출고 처리건
		{ dataField: 'wdNstoNcomp', positionField: 'wdNstoNcomp', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 고객출고 미처리건
		{ dataField: 'wdNstoNreal', positionField: 'wdNstoNreal', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 고객출고 진오더 미전환 건
		{ dataField: 'wdStoTot', positionField: 'wdStoTot', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 광역출고 전체건
		{ dataField: 'wdStoComp', positionField: 'wdStoComp', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 광역출고 처리건
		{ dataField: 'wdStoNcomp', positionField: 'wdStoNcomp', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 광역출고 미처리건
		{ dataField: 'rtStoTot', positionField: 'rtStoTot', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 협력사반품 전체건
		{ dataField: 'rtCustComp', positionField: 'rtCustComp', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 협력사반품 처리건
		{ dataField: 'rtCustNcomp', positionField: 'rtCustNcomp', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 협력사반품 미처리건
		{ dataField: 'stoSt', positionField: 'stoSt', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 운송중재고 오더건수
		{ dataField: 'dailySt', positionField: 'dailySt', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 일배재고 오더건수
		{ dataField: 'ajDuNcomp', positionField: 'ajDuNcomp', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 폐기예약 오더건수
		{ dataField: 'ajDdNcomp', positionField: 'ajDdNcomp', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 감모예약 오더건수
		{
			dataField: 'rtVendorNcomp',
			positionField: 'rtVendorNcomp',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		}, // 반품예약 오더건수
	];
	////////////////////////////////////////////////////  하단 그리드
	// 그리드 버튼 설정
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 속성 Detail
	const gridProps1 = {
		editable: false, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		showFooter: false, // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	};

	const gridCol1 = [
		{ dataField: 'doctypenm', headerText: t('lbl.DOCTYPE'), dataType: 'code', editable: false, width: 100 }, // 문서유형
		{
			dataField: 'deliverydate',
			headerText: t('lbl.DELIVERY_REQ_DATE'),
			dataType: 'date',
			editable: false,
			width: 100,
		}, // 납품요청일
		{ dataField: 'docno', headerText: t('lbl.ORDER_NO'), dataType: 'code', editable: false, width: 100 }, // 오더번호
		// {
		// 	// 04. 업체코드
		// 	dataField: "custkey",
		// 	headerText: t('lbl.COMPANY_CODE'),
		// 	dataType: "code",
		// 	editable: false
		// },
		{
			dataField: 'custkey',
			headerText: t('lbl.COMPANY_CODE'),
			dataType: 'code',
			editable: false,
			width: 100,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef1.current?.openPopup(
						{
							custkey: e.item.custkey,
							custtype: e.item.custtype,
						},
						'cust',
					);
				},
			},
		}, // 업체코드
		{ dataField: 'custname', headerText: t('lbl.LBL_FROM_CUSTNAME'), dataType: 'text', editable: false, width: 150 }, // 업체명
		{ dataField: 'docline', headerText: t('품목번호'), dataType: 'code', editable: false, width: 100 }, // 품목번호
		{ dataField: 'ordertypenm', headerText: t('lbl.ORDER_TYPE1'), dataType: 'code', editable: false, width: 100 }, // 오더타입
		{ dataField: 'status', headerText: t('lbl.STATUS_WD'), dataType: 'code', editable: false, width: 100 }, // 진행상태
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			editable: false,
			width: 80,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuname,
					};
					gridRef1.current?.openPopup(params, 'sku');
				},
			},
		}, // 상품코드
		{ dataField: 'skuname', headerText: t('lbl.SKUNAME'), editable: false, width: 400, filter: { showIcon: true } }, // 상품명칭
		{ dataField: 'uom', headerText: t('lbl.UOM_RT'), dataType: 'code', editable: false, width: 80 }, // 단위
		{ dataField: 'dpOrderqty', headerText: t('lbl.ORDERQTY_DP'), dataType: 'numeric', editable: false, width: 80 }, // 구매수량
		{ dataField: 'dpConfirmqty', headerText: t('lbl.CONFIRMQTY_DP'), dataType: 'numeric', editable: false, width: 80 }, // 입고수량
		{ dataField: 'wdOrderqty', headerText: t('lbl.ORDERQTY_WD'), dataType: 'numeric', editable: false, width: 80 }, // 주문수량
		{ dataField: 'wdConfirmqty', headerText: t('lbl.CONFIRMQTY_WD'), dataType: 'numeric', editable: false, width: 80 }, // 출고수량
		// AS-IS가 쿼리에서 '' 이라서 주석처리함.
		// {
		// 	// 16. FROM센터
		// 	dataField: 'fromDccode',
		// 	headerText: t('lbl.FROM_CENTER'),
		// 	dataType: 'code',
		// 	editable: false,
		// 	width: 100,
		// },
		// {
		// 	// 17. 저장위치
		// 	dataField: 'fromLoc',
		// 	headerText: t('lbl.STORAGELOC'),
		// 	dataType: 'code',
		// 	editable: false,
		// 	width: 100,
		// },
		// {
		// 	// 18. TO센터
		// 	dataField: 'toDccode',
		// 	headerText: t('lbl.TO_CENTER'),
		// 	dataType: 'code',
		// 	editable: false,
		// 	width: 100,
		// },
		// {
		// 	// 19. TO저장위치
		// 	dataField: 'toLoc',
		// 	headerText: t('lbl.TO_STORAGELOC'),
		// 	dataType: 'code',
		// 	editable: false,
		// 	width: 100,
		// },
		{
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addId',
			editable: false,
			width: 100,
		}, // 등록자
		{ dataField: 'addId', visible: false }, // 등록자 ID(숨김)
		{
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'updId',
			editable: false,
			width: 100,
		}, // 수정자
		{ dataField: 'updId', visible: false }, // 수정자 ID(숨김)
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * ==========================================================================
-  AUI Grid Event Initailize
- [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		// gridRef.current?.bind('selectionChange', function () {
		// 	searchDetailList(gridRef.current?.getSelectedRows()[0]);
		// });

		// gridRef.current?.bind('selectionChange', (e: any) => {

		// 	//console.log('e', e);
		// 	//주문수량출력여부 체크시
		// 	//if (['closeyn'].includes(e.primeCell.dataField)) {
		// 	if (['closeyn'].includes(e.primeCell.dataField)) {
		// 		return;
		// 	}
		// 	searchDetailList(gridRef.current?.getSelectedRows()[0]);
		// });

		// let prevSelectedRow: Record<string, any> | null = null;
		// gridRef.current?.bind('selectionChange', (e: any) => {
		// 	// closeyn 컬럼 클릭시 실행 안함
		// 	if (['closeyn'].includes(e.primeCell.dataField)) {
		// 		return;
		// 	}
		// 	const selectedRow = gridRef.current?.getSelectedRows()[0];
		// 	// 이전 선택 행과 동일하면 실행 안함
		// 	if (prevSelectedRow && selectedRow && JSON.stringify(selectedRow) === JSON.stringify(prevSelectedRow)) {
		// 		return;
		// 	}
		// 	prevSelectedRow = selectedRow;
		// 	searchDetailList(selectedRow);
		// });

		// 이전 선택 행과 동일하면 실행 안함
		// closeyn 클릭시 디테일 조회 안함

		let prevSelectedRowJson: string | null = null;
		gridRef.current?.bind('selectionChange', (e: any) => {
			if (['closeyn'].includes(e.primeCell.dataField)) {
				return;
			}
			const selectedRow = gridRef.current?.getSelectedRows()[0];
			const selectedRowJson = selectedRow ? JSON.stringify(selectedRow) : null;
			if (prevSelectedRowJson !== null && selectedRowJson === prevSelectedRowJson) {
				return;
			}
			prevSelectedRowJson = selectedRowJson;

			//상세 조회
			searchDetailList(selectedRow);
		});

		// gridRef.current?.bind('cellClick', function (e: any) {
		// 	if (e.dataField === 'closeyn' && e.item.closeyn !== 'Y') {
		// 		const item = e.item;
		// 		saveMasterList(item);
		// 	}
		// });

		// 화면이동 이벤트
		gridRef1.current?.bind('cellDoubleClick', (event: any) => {
			// 주문번호
			if (event.dataField == 'docno') {
				// 1. 오더번호나 납품요청일이 없는 경우 return
				if (commUtil.isNull(event.item.docno) || commUtil.isNull(event.item.deliverydate)) {
					return;
				}

				const doctype = event.item.doctype;

				// 입고문서
				if (doctype === 'DP') {
					// 입고 > 입고작업 > 입고확정처리
					moveMenu('/dp/dpReceipt', {
						slipdtFrom: event.item.deliverydate,
						slipdtTo: event.item.deliverydate,
						docno: event.item.docno,
						sku: event.item.sku,
						skuName: `[${event.item.sku}] ` + event.item.skuname,
						dccode: event.item.dccode,
					});
					// 출고문서
				} else if (doctype === 'WD') {
					// 출고 > 출고작업 > 출고확정처리
					moveMenu('/wd/wdShipmentBatch', {
						fromSlipdt: event.item.deliverydate,
						toSlipdt: event.item.deliverydate,
						docno: event.item.docno,
						sku: event.item.sku,
						skuName: `[${event.item.sku}] ` + event.item.skuname,
						dccode: event.item.dccode,
					});
					// 반품문서
				} else if (doctype === 'RT') {
					// 반품 > 반품작업 > 반품확정처리
					moveMenu('/rt/RtReceiptConfirm', {
						slipdtFrom: event.item.deliverydate,
						slipdtTo: event.item.deliverydate,
						docno: event.item.docno,
						sku: event.item.sku,
						skuName: `[${event.item.sku}] ` + event.item.skuname,
						dccode: event.item.dccode,
					});
				}
			}
		});
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef.current) {
			// 그리드 초기화
			gridRef.current?.setGridData(gridData);
			//gridRef.current?.mergeCells("dccode");
			gridRef.current?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	useEffect(() => {
		if (gridRef1.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(gridDataDetail);
			gridRef1.current?.setSelectionByIndex(0, 0);

			if (gridDataDetail.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef1.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef1.current?.setColumnSizeList(colSizeList);
			}
		}
		gridRef.current?.setFocus();
	}, [gridDataDetail]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn
								gridBtn={gridBtn1}
								gridTitle={t('lbl.DETAIL')}
								totalCnt={gridDataDetail?.length}
								extraContentLeft={<span className="msg">{t('msg.KP_CLOSE_MSG_004')}</span>}
							/>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
};

export default KpCloseDetail;
