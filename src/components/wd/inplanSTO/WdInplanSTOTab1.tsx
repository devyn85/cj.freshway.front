/*
 ############################################################################
 # FiledataField	: WdInplanSTOTab1.tsx
 # Description		: 광역출고현황 - 주문현황 탭(Tab1)
 # Author			: YeoSeungCheol
 # Since			: 25.11.12
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import { GridBtnPropsType } from '@/types/common';

// Lib
import GridAutoHeight from '@/components/common/GridAutoHeight';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Store
// Type

// apiPostSaveMasterList

const WdInplanSTOTab1 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 그리드 초기화
	const gridCol = [
		{
			// 품목번호
			headerText: t('lbl.DOCLINE'),
			dataField: 'docline',
			dataType: 'code',
		},
		{
			// 상품코드
			headerText: t('lbl.SKU'),
			dataField: 'sku',
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
			// 상품명칭
			headerText: t('lbl.SKUNAME'),
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
		},
		{
			// 플랜트
			headerText: t('lbl.PLANT'),
			dataField: 'plant',
			dataType: 'code',
		},
		{
			// 저장유무
			headerText: t('lbl.CHANNEL_DMD'),
			dataField: 'channelDmd',
			dataType: 'code',
		},
		{
			// 저장조건
			headerText: t('lbl.STORAGETYPE'),
			dataField: 'storagetype',
			dataType: 'code',
		},
		{
			// 이체단위
			headerText: t('lbl.UOM_STO'),
			dataField: 'uomSto',
			dataType: 'code',
		},
		{
			// 주문수량
			headerText: t('lbl.ORDERQTY_WD'),
			dataField: 'orderqtyWd',
			dataType: 'numeric',
			rmatString: '#,##0.##',
		},
		{
			// 분배량
			headerText: t('lbl.DISTRIBUTEQTY_WD'),
			dataField: 'distributeqtyWd',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 피킹량
			headerText: t('lbl.WORKQTY_WD'),
			dataField: 'workqtyWd',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 검수량
			headerText: t('lbl.INSPECTQTY_TASK'), // INSPECTQTY_TASK
			children: [
				{
					// 출고
					headerText: t('lbl.WD'),
					dataField: 'inspectqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
					styleFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
						if (commUtil.isEmpty(item)) {
							return 'default';
						}
						if (item.inspectqty != item.tostoInspectqty) {
							return 'color-danger';
						} else {
							return 'color-info';
						}
					},
				},
				{
					// 입고
					headerText: t('lbl.DP'),
					dataField: 'tostoInspectqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
					styleFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
						if (commUtil.isEmpty(item)) {
							return 'default';
						}
						if (item.inspectqty != item.tostoInspectqty) {
							return 'color-danger';
						} else {
							return 'color-info';
						}
					},
				},
			],
		},
		{
			// 확정수량
			headerText: t('lbl.CONFIRMQTY_TASK'), // CONFIRMQTY
			children: [
				{
					// 출고
					headerText: t('lbl.WD'),
					dataField: 'confirmqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
					styleFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
						if (commUtil.isEmpty(item)) {
							return 'default';
						}
						if (item.confirmqty != item.tostoConfirmqty) {
							return 'color-danger';
						} else {
							return 'color-info';
						}
					},
				},
				{
					// 입고
					headerText: t('lbl.DP'),
					dataField: 'tostoConfirmqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
					styleFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
						if (commUtil.isEmpty(item)) {
							return 'default';
						}
						if (item.confirmqty != item.tostoConfirmqty) {
							return 'color-danger';
						} else {
							return 'color-info';
						}
					},
				},
			],
		},
		{
			// 중량
			headerText: t('lbl.WEIGHT_KG'), // WEIGHT_KG
			children: [
				{
					// 출고
					headerText: t('lbl.WD'),
					dataField: 'confirmweight',
					dataType: 'numeric',
					formatString: '#,##0.##',
					editRenderer: {
						type: 'InputEditRenderer',
						//allowNegative: true, // 음수허용
						allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
						// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
						// onlyNumeric: true, // 0~9만 입력가능
						//onlyNumeric: false,
						//textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
						//maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
						//autoThousandSeparator: true, // 천단위 구분자 삽입 여부
						// decimalPrecision: 2, // 소숫점 2자리까지 허용
						//regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
					},
					styleFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
						if (commUtil.isEmpty(item)) {
							return 'default';
						}
						if (item.confirmweight != item.tostoConfirmweight) {
							return 'color-danger';
						} else {
							return 'color-info';
						}
					},
				},
				{
					// 입고
					headerText: t('lbl.DP'),
					dataField: 'tostoConfirmweight',
					dataType: 'numeric',
					formatString: '#,##0.##',
					editRenderer: {
						type: 'InputEditRenderer',
						//allowNegative: true, // 음수허용
						allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
						// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
						// onlyNumeric: true, // 0~9만 입력가능
						//onlyNumeric: false,
						//textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
						//maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
						//autoThousandSeparator: true, // 천단위 구분자 삽입 여부
						// decimalPrecision: 2, // 소숫점 2자리까지 허용
						//regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
					},
					styleFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
						if (commUtil.isEmpty(item)) {
							return 'default';
						}
						if (item.confirmweight != item.tostoConfirmweight) {
							return 'color-danger';
						} else {
							return 'color-info';
						}
					},
				},
			],
		},
		{
			// 진행상태
			headerText: t('lbl.STATUS'), // STATUS
			children: [
				{
					// 출고
					headerText: t('lbl.WD'),
					dataField: 'status',
					dataType: 'code',
				},
				{
					// 입고
					headerText: t('lbl.DP'),
					dataField: 'tostoStatus',
					dataType: 'code',
				},
			],
		},
	];

	// 주문수량 / 분배량 / 피킹량 / 출고(검수량) / 입고(검수량) / 출고(확정수량) / 입고(확정수량) / 출고(중량) / 입고(중량)
	const footerLayout1 = [
		{
			dataField: 'orderqtyWd',
			positionField: 'orderqtyWd',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'distributeqtyWd',
			positionField: 'distributeqtyWd',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'workqtyWd',
			positionField: 'workqtyWd',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'tostoInspectqty',
			positionField: 'tostoInspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'tostoConfirmqty',
			positionField: 'tostoConfirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'confirmweight',
			positionField: 'confirmweight',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'tostoConfirmweight',
			positionField: 'tostoConfirmweight',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		showRowCheckColumn: false,
		enableFilter: true,
		showFooter: true,
		footerLayout: footerLayout1,
		rowStyleFunction: (rowIndex: any, item: any) => {
			if (item.delYn === 'Y') {
				return 'color-danger';
			}
			return '';
		},

		//
		customRowCheckColumnDataField: '', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 저장 함수
	 */
	// const saveMasterList = () => {
	// 	if (props.onSave) {
	// 		props.onSave();
	// 	}
	// };

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 */
		const gridRef = props.gridRef;

		gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			if (props.data && props.data.length > 0) {
				gridRef?.current.setSelectionByIndex(0);
			}
		});

		// /**
		//  * 그리드 셀 편집 종료
		//  * @param {any} event 이벤트
		//  */
		// gridRef?.current.bind('cellEditEnd', (event: any) => {
		// 	// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.

		// 	gridRef.current.addCheckedRowsByValue('issueno', event.item.issueno);
		// 	gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
		// });
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: props.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefToUse = ref || props.gridRef;
		const gridRefCur = gridRefToUse.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			// gridRefCur?.setSelectionByIndex(0, 0);

			if (props.data && props.data.length > 0) {
				// 데이터 설정 후 컬럼 크기 자동 조정
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data, ref, props.gridRef]);

	return (
		<>
			<AGrid style={{ marginTop: '15px' }}>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={props.totalCnt} />
			</AGrid>
			<GridAutoHeight id="order-status-grid">
				<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout1} />
			</GridAutoHeight>
		</>
	);
});

export default WdInplanSTOTab1;
