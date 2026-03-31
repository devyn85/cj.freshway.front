/*
 ############################################################################
 # FiledataField	: WdInplanSTOTab3.tsx
 # Description		: 광역출고현황 - 출고이력정보 탭(Tab3)
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

const WdInplanSTOTab3 = forwardRef((props: any, ref: any) => {
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
		},
		{
			// 상품명칭
			headerText: t('lbl.SKUNAME'),
			dataField: 'skuname',
			dataType: 'default',
		},
		{
			// 로케이션
			headerText: t('lbl.LOC'),
			dataField: 'loc',
			dataType: 'default',
		},
		{
			// 기준일(유통,제조)
			headerText: t('lbl.LOTTABLE01_MFG_WO'),
			dataField: 'lottable01',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			// 단위
			headerText: t('lbl.UOM'),
			dataField: 'uom',
			dataType: 'code',
		},
		{
			// 진행수량
			headerText: t('lbl.PROCESSQTY'),
			dataField: 'processqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 현장작업량
			headerText: t('lbl.WORKQTY'),
			dataField: 'workqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 검품수량
			headerText: t('lbl.INSPECTQTY'),
			dataField: 'inspectqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 확정수량
			headerText: t('lbl.CONFIRMQTY'),
			dataField: 'confirmqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
	];

	// 진행수량, 현장작업량, 검품수량, 확정수량
	const footerLayout1 = [
		{
			dataField: 'processqty',
			positionField: 'processqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		},
		{
			dataField: 'workqty',
			positionField: 'workqty',
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
			dataField: 'confirmqty',
			positionField: 'confirmqty',
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
			<GridAutoHeight id="shipping-history-information">
				<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout1} />
			</GridAutoHeight>
		</>
	);
});

export default WdInplanSTOTab3;
