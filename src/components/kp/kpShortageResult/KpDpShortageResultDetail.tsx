/*
 ############################################################################
 # FiledataField	: KpDpShortageResultDetail.tsx
 # Description		: 지표 > 센터 운영 > 입고 결품 현황 Grid
 # Author			: KimDongHan
 # Since			: 2025.09.08
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import CmIndividualPopup from '@/components/cm/popup/CmIndividualPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const KpDpShortageResultDetail = ({
	activeKey,
	//activeKeyRef,
	gridRef,
	gridRef1,
	gridRef2,
	gridRef3,
	gridData,
	gridData1,
	gridData2,
	gridData3,
	setActiveKey,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const [popUpParams, setPopUpParams] = useState({}); // 팝업 파마리터
	const refModal = useRef<any>(null);
	/////////////////////////////////////////// 1. 저장_탭 ///////////////////////////////////////////
	// 그리드 버튼 설정
	// const gridBtn: GridBtnPropsType = {
	// 	tGridRef: gridRef, // 타겟 그리드 Ref
	// 	btnArr: [],
	// };

	// // 그리드 속성
	// const gridProps = {
	// 	editable: false, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
	// 	showStateColumn: false, // row 편집 여부
	// 	enableColumnResize: true, // 열 사이즈 조정 여부
	// 	//showRowCheckColumn: true, // 체크박스
	// 	//showFooter: true,         // 불필요한 경우 삭제 해도 됨
	// 	fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	// };

	// // 그리드 초기화
	// const gridCol = [
	// 	{
	// 		dataField: '',
	// 		headerText: 'AS-IS 안됨',
	// 		//dataType: 'code',
	// 	},
	// ];

	/////////////////////////////////////////// 2. 일배_탭 ///////////////////////////////////////////
	// 그리드 버튼 설정
	// const gridBtn1: GridBtnPropsType = {
	// 	tGridRef: gridRef1, // 타겟 그리드 Ref
	// 	btnArr: [],
	// };

	// // 그리드 속성
	// const gridProps1 = {
	// 	editable: false, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
	// 	showStateColumn: false, // row 편집 여부
	// 	enableColumnResize: true, // 열 사이즈 조정 여부
	// 	//showRowCheckColumn: true, // 체크박스
	// 	//showFooter: true,         // 불필요한 경우 삭제 해도 됨
	// 	fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	// };

	// // 그리드 초기화
	// const gridCol1 = [
	// 	{
	// 		dataField: '',
	// 		headerText: 'AS-IS 안됨',
	// 	},
	// ];

	/////////////////////////////////////////// 3. 일배요약_탭 ///////////////////////////////////////////
	// 그리드 버튼 설정
	const gridBtn2: GridBtnPropsType = {
		tGridRef: gridRef2, // 타겟 그리드 Ref
		btnArr: [],
	};
	// 그리드 속성
	const gridProps2 = {
		editable: false, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		showFooter: true, // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	};
	// 그리드 초기화
	const gridCol2 = [
		{ dataField: 'slipdt', headerText: t('lbl.DOCDT_DP'), dataType: 'date', width: 100 }, // 01. 입고일자
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code', width: 80 }, // 02. 물류센터
		{ dataField: 'dcname', headerText: t('lbl.DCNAME'), dataType: 'code', width: 100 }, // 물류센터명
		{ dataField: 'sourcekey', headerText: t('lbl.SOURCEKEY'), dataType: 'code', width: 100 }, // 03. 원주문번호
		{
			dataField: 'custkey',
			headerText: t('lbl.FROM_VATNO'),
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef2.current.openPopup({ custkey: e.item.custkey, custtype: 'C' }, 'cust');
				},
			},
			width: 100,
		}, // 04. 고객코드
		{ dataField: 'custname', headerText: t('lbl.FROM_VATOWNER'), dataType: 'text', width: 150 }, // 05. 고객명
		{
			dataField: 'toCustkey',
			headerText: t('lbl.TO_CUSTKEY'),
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef2.current.openPopup({ custkey: e.item.toCustkey, custtype: 'C' }, 'cust');
				},
			},
			width: 100,
		}, // 06. 배송인도처코드
		{ dataField: 'toCustname', headerText: t('lbl.TO_CUSTNAME'), dataType: 'text', width: 150 }, // 07. 배송인도처명
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			filter: { showIcon: true },
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = { sku: e.item.sku, skuDescr: e.item.skuname };
					gridRef2.current?.openPopup(params, 'sku');
				},
			},
			width: 80,
		}, // 08. 상품코드
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			dataType: 'text',
			style: 'ta-l',
			filter: { showIcon: true },
			width: 400,
		}, // 09. 상품명칭
		{ dataField: 'storeruom', headerText: t('lbl.UOM_PO'), dataType: 'code', width: 80 }, // 10. 구매단위
		{ dataField: 'orderqty', headerText: t('lbl.ORDERQTY'), dataType: 'numeric', formatString: '#,##0.##', width: 110 }, // 11. 주문수량
		{
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY_WD'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			width: 110,
		}, // 12. 출고수량
		{
			dataField: 'shortageqty',
			headerText: t('lbl.SHORTAGEQTY'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			width: 110,
		}, // 13. 결품수량
		{ dataField: 'reasoncodename', headerText: t('lbl.REASONCODE_WD'), dataType: 'text', width: 150 }, // 14. 결품사유
		{ dataField: 'reasontypename', headerText: t('귀책구분'), dataType: 'text', width: 150 }, // 귀책구분
		{ dataField: 'actionhistname', headerText: t('lbl.ACTION_HIST'), dataType: 'code', width: 100 }, // 15. 조치내역
		{
			dataField: 'inspectynDpQty',
			headerText: t('lbl.INSPECT_IN_QTY'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			width: 100,
		}, // 16. 입고검수수량
		{
			dataField: 'inspectynQty',
			headerText: t('lbl.LOAD_INSP_QTY'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			width: 100,
		}, // 17. 상차검수수량
		{
			dataField: 'fromCustkeyDp',
			headerText: t('lbl.FROM_CUSTKEY_DP'),
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef2.current.openPopup({ custkey: e.item.fromCustkeyDp, custtype: 'P' }, 'cust');
				},
			},
			width: 100,
		}, // 18. 협력사코드
		{ dataField: 'fromCustnameDp', headerText: t('lbl.FROM_CUSTNAME_DP'), dataType: 'text', width: 150 }, // 19. 협력사명
		{ dataField: 'empNm', headerText: t('lbl.PERSON_IN_CHARGE'), dataType: 'code', width: 100 }, // 20. 담당자
		{ dataField: 'storagetypename', headerText: t('lbl.STORAGETYPE'), dataType: 'code', width: 100 }, // 22. 저장조건
	];

	const footerLayout2 = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: 'slipdt',
		},
		// 주문수량
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		// 출고수량
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		// 결품수량
		{
			dataField: 'shortageqty',
			positionField: 'shortageqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
	];
	/////////////////////////////////////////// 4. 저장요약_탭 ///////////////////////////////////////////
	// 그리드 버튼 설정
	const gridBtn3: GridBtnPropsType = {
		tGridRef: gridRef3, // 타겟 그리드 Ref
		btnArr: [],
	};
	// 그리드 속성
	const gridProps3 = {
		editable: false, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		showFooter: true, // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
	};

	const gridCol3 = [
		{ dataField: 'slipdt', headerText: t('lbl.DOCDT_DP'), dataType: 'date', width: 100 }, // 01. 입고일자
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code', width: 80 }, // 02. 센터코드
		{ dataField: 'dcname', headerText: t('lbl.DCNAME'), dataType: 'code', width: 100 }, // 물류센터명
		{ dataField: 'slipno', headerText: t('lbl.SLIPNO_DP'), dataType: 'code', width: 100 }, // 03. 입고전표번호
		{ dataField: 'storagetypename', headerText: t('lbl.STORAGETYPE'), dataType: 'code', width: 100 }, // 04. 저장조건
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			filter: { showIcon: true },
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = { sku: e.item.sku, skuDescr: e.item.skuname };
					gridRef3.current?.openPopup(params, 'sku');
				},
			},
			width: 80,
		}, // 05. 상품코드
		{ dataField: 'skuname', headerText: t('lbl.SKUNAME'), dataType: 'text', filter: { showIcon: true }, width: 400 }, // 06. 상품명칭
		{ dataField: 'storeruom', headerText: t('lbl.UOM_PO'), dataType: 'code', width: 80 }, // 07. 구매단위
		{ dataField: 'orderqty', headerText: t('lbl.ORDERQTY'), dataType: 'numeric', formatString: '#,##0.##', width: 120 }, // 08. 주문수량
		{
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY_DP'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			width: 120,
		}, // 09. 입고수량
		{
			dataField: 'shortageqty',
			headerText: t('lbl.SHORTAGEQTY'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			width: 120,
		}, // 10. 결품수량
		{ dataField: 'reasoncodename', headerText: t('lbl.REASONCODE_WD'), dataType: 'text', width: 150 }, // 11. 결품사유
		{ dataField: 'reasontypename', headerText: t('귀책구분'), dataType: 'text', width: 150 }, // 귀책구분
		{
			dataField: 'fromCustkey',
			headerText: t('lbl.FROM_CUSTKEY_DP'),
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef2.current.openPopup({ custkey: e.item.fromCustkey, custtype: 'P' }, 'cust');
				},
			},
			width: 100,
		}, // 12. 협력사코드
		{ dataField: 'fromCustname', headerText: t('lbl.FROM_CUSTNAME_DP'), dataType: 'text', width: 150 }, // 13. 협력사명
		{ dataField: 'mdcode', headerText: t('lbl.MDCODE_KP'), dataType: 'code', width: 100 }, // 14. 담당MD
		{ dataField: 'pomdcodename', headerText: t('lbl.POMDCODE'), dataType: 'code', width: 100 }, // 15. 수급담당
	];

	const footerLayout3 = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: 'slipdt',
		},
		// 주문수량
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		// 출고수량
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		// 결품수량
		{
			dataField: 'shortageqty',
			positionField: 'shortageqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
	];
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  02. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
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

	/**
	 * 팝업 열기 이벤트
	 * @param params
	 */
	// const fnCmIndividualPopup = (params: any) => {
	// 	setPopUpParams(params);
	// 	refModal.current.handlerOpen();
	// };

	/**
	 * 팝업 닫기 이벤트
	 */
	const closeEvent = () => {
		refModal.current.handlerClose();
	};

	const initEvent = () => {
		// 그리드 초기화
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef.current) {
			// 그리드 초기화
			gridRef.current?.setGridData(gridData);
			gridRef.current?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	useEffect(() => {
		if (gridRef1.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(gridData1);
			gridRef1.current?.setSelectionByIndex(0, 0);

			if (gridData1.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//	const colSizeList = gridRef1.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef1.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData1]);

	useEffect(() => {
		if (gridRef2.current) {
			// 그리드 초기화
			gridRef2.current?.setGridData(gridData2);
			gridRef2.current?.setSelectionByIndex(0, 0);

			if (gridData2.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef2.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef2.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData2]);

	useEffect(() => {
		if (gridRef3.current) {
			// 그리드 초기화
			gridRef3.current?.setGridData(gridData3);
			gridRef3.current?.setSelectionByIndex(0, 0);

			if (gridData3.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef3.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef3.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData3]);

	return (
		<>
			<Tabs activeKey={activeKey} onChange={key => setActiveKey(key)} className="contain-wrap">
				{/* 일배요약 */}
				<TabPane tab={t('lbl.DAILYDTL_TAB')} key="3">
					<AGrid>
						<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn2} totalCnt={gridData2?.length} />
						<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
					</AGrid>
				</TabPane>
				{/* 저장요약 */}
				<TabPane tab={t('lbl.STORAGEDTL_TAB')} key="4">
					<AGrid>
						<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn3} totalCnt={gridData3?.length} />
						<AUIGrid ref={gridRef3} columnLayout={gridCol3} gridProps={gridProps3} footerLayout={footerLayout3} />
					</AGrid>
				</TabPane>
			</Tabs>
			<CustomModal ref={refModal} width="700px">
				<CmIndividualPopup popUpParams={popUpParams} close={closeEvent} />
			</CustomModal>
		</>
	);
};

export default KpDpShortageResultDetail;
