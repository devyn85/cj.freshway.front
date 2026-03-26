/*
 ############################################################################
 # FiledataField	: WdDistributePlanNewTab1.tsx
 # Description		: 미출예정확인 - 미출예정 탭
 # Author			: YeoSeungCheol
 # Since			: 25.11.06
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import { GridBtnPropsType } from '@/types/common';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
// Type

// API

const WdDistributePlanNewTab1 = forwardRef((props: any, ref: any) => {
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
			// 출고일자
			headerText: t('lbl.DOCDT_WD'),
			dataField: 'slipdt',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			// 주문번호
			headerText: t('lbl.DOCNO_WD'),
			dataField: 'docno',
			dataType: 'code',
		},
		{
			// 관리처코드
			headerText: t('lbl.TO_CUSTKEY_WD'),
			dataField: 'toCustkey',
			dataType: 'code',
		},
		{
			// 관리처명
			headerText: t('lbl.TO_CUSTNAME_WD'),
			dataField: 'toCustname',
			dataType: 'default',
		},
		{
			// 상품코드
			headerText: t('lbl.SKU'),
			dataField: 'sku',
			dataType: 'code',
		},
		{
			// 상품명칭
			headerText: t('lbl.SKUNAME'),
			dataField: 'skuname',
			dataType: 'default',
		},
		{
			// 플랜트
			headerText: t('lbl.PLANT'),
			dataField: 'plantDescr',
			dataType: 'code',
		},
		{
			// 상품유형-1
			headerText: t('lbl.SKUTYPE'),
			dataField: 'skutype',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('SKUTYPE', value)?.cdNm;
			},
		},
		{
			// 외식전용구분
			headerText: t('lbl.REFERENCE15'),
			dataField: 'reference15',
			dataType: 'code',
		},
		{
			// 현재고수량
			headerText: t('lbl.QTY_ST'),
			dataField: 'qty',
			dataType: 'numeric',
		},
		{
			// 이천
			headerText: t('lbl.QTY2600'),
			dataField: 'qty2600',
			dataType: 'numeric',
		},
		{
			// 수원
			headerText: t('lbl.QTY2620'),
			dataField: 'qty2620',
			dataType: 'numeric',
		},
		{
			// 수원2
			headerText: t('lbl.QTY2630'),
			dataField: 'qty2630',
			dataType: 'numeric',
		},
		{
			// 동탄
			headerText: t('lbl.QTY2650'),
			dataField: 'qty2650',
			dataType: 'numeric',
		},
		{
			// 동탄2
			headerText: t('lbl.QTY2660'),
			dataField: 'qty2660',
			dataType: 'numeric',
		},
		{
			// 양산
			headerText: t('lbl.QTY2260'),
			dataField: 'qty2260',
			dataType: 'numeric',
		},
		{
			// 장성
			headerText: t('lbl.QTY2230'),
			dataField: 'qty2230',
			dataType: 'numeric',
		},
		{
			// 이동중재고
			headerText: t('lbl.MOVEQTY_KP'),
			dataField: 'stoSt',
			dataType: 'numeric',
		},
		{
			// 통합이동중재고
			headerText: t('lbl.TOTAL_STO_ST'),
			dataField: 'totalStoSt',
			dataType: 'numeric',
		},
		{
			// 가용재고수량
			headerText: t('lbl.SHOTAGE_QTY'),
			dataField: 'stOpenqty',
			dataType: 'numeric',
		},
		{
			// 부족수량
			headerText: t('lbl.SHORTAGE_QTY'),
			dataField: 'shortageqty2',
			dataType: 'numeric',
		},
		{
			// 주문량
			headerText: t('lbl.STOREROPENQTY'),
			dataField: 'orderqty',
			dataType: 'numeric',
		},
		{
			// 통합주문량
			headerText: t('lbl.TOTAL_ORDER_QTY'),
			dataField: 'totalOrderqty',
			dataType: 'numeric',
		},
		{
			// 입고예정량
			headerText: t('lbl.INPLANQTY_DP'),
			dataField: 'dpQty',
			dataType: 'numeric',
		},
		{
			// 통합입고예정량
			headerText: t('lbl.TOTAL_DP_QTY'),
			dataField: 'totalDpQty',
			dataType: 'numeric',
		},
		{
			// PO수량
			headerText: t('lbl.PO_DP_QTY'),
			dataField: 'poDpQty',
			dataType: 'numeric',
		},
		{
			// 재고할당수량
			headerText: t('lbl.QTYALLOCATED_ST'),
			dataField: 'qtyallocated',
			dataType: 'numeric',
		},
		{
			// 피킹재고
			headerText: t('lbl.QTYPICKED_ST'),
			dataField: 'qtypicked',
			dataType: 'numeric',
		},
		{
			// 주문단위
			headerText: t('lbl.UOM_WD'),
			dataField: 'uom',
			dataType: 'code',
		},
		{
			// C/D타입
			headerText: t('lbl.CROSSDOCKTYPE'),
			dataField: 'crossdocktype',
			dataType: 'code',
		},
		{
			// 수급담당
			headerText: t('lbl.POMDCODE'),
			dataField: 'buyername',
			dataType: 'code',
		},
		{
			// 주문조정등재
			headerText: t('lbl.WD_PROCPOSS_YN'),
			dataField: 'procpossYn',
			dataType: 'code',
		},
	];

	const footerLayout = [
		// 현재고수량
		{
			dataField: 'qty',
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		},

		// 이동중재고
		{
			dataField: 'stoSt',
			positionField: 'stoSt',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		},

		// 가용재고수량
		{
			dataField: 'stOpenqty',
			positionField: 'stOpenqty',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		},

		// 부족수량
		{
			dataField: 'shortageqty2',
			positionField: 'shortageqty2',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		},

		// 주문량
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		},

		// 입고예정량
		{
			dataField: 'dpQty',
			positionField: 'dpQty',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		},

		// PO수량
		{
			dataField: 'poDpQty',
			positionField: 'poDpQty',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		},

		// 재고할당수량
		{
			dataField: 'qtyallocated',
			positionField: 'qtyallocated',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		},

		// 피킹재고
		{
			dataField: 'qtypicked',
			positionField: 'qtypicked',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		// showRowCheckColumn: true,
		enableFilter: true,
		showFooter: true,
		footerLayout: footerLayout,

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
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.data && props.data.length > 0) {
				// 데이터 설정 후 컬럼 크기 자동 조정
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data, ref, props.gridRef]);

	return (
		<>
			<AGrid className="h100">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={props.totalCnt} />
				<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default WdDistributePlanNewTab1;
