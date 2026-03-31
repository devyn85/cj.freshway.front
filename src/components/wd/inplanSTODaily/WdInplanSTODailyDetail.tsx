/*
 ############################################################################
 # FiledataField	: WdInplanSTODailyDetail.tsx
 # Description		: 광역일배검수현황 Detail
 # Author			: 공두경
 # Since			: 25.11.29
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils
// API Call Function

const WdInplanSTODailyDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	// const qtyColor = (_rowIndex: number, _columnIndex: number, _value: any, _headerText: string, item: any) => {
	// 	if (item.orderqty !== item.dpInspectqty || item.orderqty !== item.wdInspectqty) {
	// 		return 'red';
	// 	} else {
	// 		return 'blue';
	// 	}
	// };

	const qtyColor = (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
		if (item.orderqty !== item.dpInspectqty || item.orderqty !== item.wdInspectqty) {
			return { color: 'red' };
		} else {
			return { color: 'blue' };
		}
	};
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.DCSTODAILYINFO'), // 광역일배정보
			children: [
				{
					dataField: 'slipdt',
					headerText: t('lbl.DOCDT_WD'), // 출고일자
					dataType: 'date',
				},
				{
					dataField: 'docno',
					headerText: t('lbl.DOCNO_WD'), // 주문번호
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.FROM_DCCODE'), // 공급센터
			children: [
				{
					dataField: 'wdDccode',
					headerText: t('lbl.DCCODE'), // 물류센터
					dataType: 'code',
				},
				{
					dataField: 'wdDcname',
					headerText: t('lbl.DCNAME'), // 물류센터명
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'), // 공급받는센터
			children: [
				{
					dataField: 'dpDccode',
					headerText: t('lbl.DCCODE'), // 물류센터
					dataType: 'code',
				},
				{
					dataField: 'dpDcname',
					headerText: t('lbl.DCNAME'), // 물류센터명
				},
			],
		},
		{
			headerText: t('lbl.VENDORINFO'), // 공급업체
			children: [
				{
					dataField: 'ppCustkey',
					headerText: t('lbl.FROM_CUSTKEY_DP'), // 협력사코드
					dataType: 'code',
					filter: {
						showIcon: true,
					},
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(
								{
									custkey: e.item.ppCustkey,
									custtype: 'P' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능 */,
								},
								'cust',
							);
						},
					},
				},
				{
					dataField: 'ppCustname',
					headerText: t('lbl.FROM_CUSTNAME_DP'), // 협력사명
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			headerText: t('lbl.CUSTINFO'), // 고객
			children: [
				{
					dataField: 'ccCustkey',
					headerText: t('lbl.TO_CUSTKEY_WD'), // 관리처코드
					dataType: 'code',
					filter: {
						showIcon: true,
					},
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(
								{
									custkey: e.item.ccCustkey,
								},
								'cust',
							);
						},
					},
				},
				{
					dataField: 'ccCustname',
					headerText: t('lbl.TO_CUSTNAME_WD'), // 관리처명
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), // 상품코드
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							sku: e.item.sku,
						},
						'sku',
					);
				},
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'), // 상품명칭
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'), // 저장조건
			dataType: 'code',
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'), // 단위
			dataType: 'code',
		},
		{
			headerText: t('lbl.QTYINFO'), // 수량정보
			children: [
				{
					dataField: 'orderqty',
					headerText: t('lbl.ORDERQTY'), // 주문수량
					dataType: 'numeric',
					formatString: '#,##0.##',
					styleFunction: qtyColor,
					// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					// 	if (item.orderqty !== item.dpInspectqty || item.orderqty !== item.wdInspectqty) {
					// 		return { color: 'red' };
					// 	} else {
					// 		return { color: 'blue' };
					// 	}
					// },
				},
				{
					dataField: 'wdInspectqty',
					headerText: t('lbl.INSPECTQTY_WD_STO'), // 광역출고검수량
					dataType: 'numeric',
					formatString: '#,##0.##',
					styleFunction: qtyColor,
					// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					// 	if (item.orderqty !== item.dpInspectqty || item.orderqty !== item.wdInspectqty) {
					// 		return { color: 'red' };
					// 	} else {
					// 		return { color: 'blue' };
					// 	}
					// },
				},
				{
					dataField: 'dpInspectqty',
					headerText: t('lbl.INSPECTQTY_DP_STO'), // 광역입고검수량
					dataType: 'numeric',
					formatString: '#,##0.##',
					styleFunction: qtyColor,
					// 	styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					// 		if (item.orderqty !== item.dpInspectqty || item.orderqty !== item.wdInspectqty) {
					// 			return { color: 'red' };
					// 		} else {
					// 			return { color: 'blue' };
					// 		}
					// 	},
					// },
				},
			],
		},
		{
			headerText: t('lbl.STATUS_INSPECT'), // 검수상태
			children: [
				{
					dataField: 'statusInspectWd',
					headerText: t('lbl.WD'), // 출고
					dataType: 'code',
				},
				{
					dataField: 'statusInspectDp',
					headerText: t('lbl.DP'), // 입고
					dataType: 'code',
				},
			],
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: false, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'slipdt',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'wdInspectqty',
			positionField: 'wdInspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'dpInspectqty',
			positionField: 'dpInspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default WdInplanSTODailyDetail;
