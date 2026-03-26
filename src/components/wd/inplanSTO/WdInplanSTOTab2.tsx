/*
 ############################################################################
 # FiledataField	: WdInplanSTOTab2.tsx
 # Description		: 광역출고현황 - 이력현황 탭(Tab2)
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

const WdInplanSTOTab2 = forwardRef((props: any, ref: any) => {
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
			// 플랜트
			headerText: t('lbl.PLANT'),
			dataField: 'plant',
			dataType: 'code',
		},
		{
			// 환산수량(CALQTY)
			headerText: t('lbl.CALQTY'),
			children: [
				{
					// 평균중량
					headerText: t('lbl.AVGWEIGHT'),
					dataField: 'avgweight',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					// 환산주문박스
					headerText: t('lbl.CALORDERBOX'),
					dataField: 'calorderbox',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					// 환산확정박스
					headerText: t('lbl.CALCONFIRMBOX'),
					dataField: 'calconfirmbox',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					// 실박스
					headerText: t('lbl.REALBOX'),
					dataField: 'realbox',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
			],
		},
		{
			// 주문수량
			headerText: t('lbl.ORDERQTY_WD'),
			dataField: 'orderqtyWd',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 분배량
			headerText: t('lbl.PROCESSQTY_WD'),
			dataField: 'distributeqtyWd',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 피킹량
			headerText: t('lbl.'),
			dataField: 'workqtyWd',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 출고검수량
			headerText: t('lbl.WORKQTY_WD'),
			dataField: 'inspectqtyWd',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 출고수량
			headerText: t('lbl.CONFIRMQTY_WD'),
			dataField: 'confirmqtyWd',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 이체단위
			headerText: t('lbl.UOM_STO'),
			dataField: 'uomSto',
			dataType: 'code',
		},
		{
			// 진행상태
			headerText: t('lbl.STATUS_WD'),
			dataField: 'statusWd',
			dataType: 'code',
		},
		{
			// 기준일(유통, 제조)
			headerText: t('lbl.LOTTABLE01_MFG_WO'),
			dataField: 'lottable01',
			dataType: 'code',
		},
		{
			// 유통기간(잔여/전체)
			headerText: t('lbl.DURATIONTERM'),
			dataField: 'durationTerm',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			// 상품이력정보 (=SERIALINFO)
			headerText: t('lbl.SERIALINFO'),
			children: [
				{
					// 이력번호
					headerText: t('lbl.SERIALNO'),
					dataField: 'serialno',
					dataType: 'numeric',
				},
				{
					// 바코드
					headerText: t('lbl.BARCODE'),
					dataField: 'barcode',
					dataType: 'code',
				},
				{
					// B/L 번호
					headerText: t('lbl.BLNO'),
					dataField: 'blno',
					dataType: 'numeric',
				},
				/**
				 * 이하 as-is QA 데이터 없음으로 인해 임의 dataType 설정 하였습니다.
				 */
				{
					// 도축일자
					headerText: t('lbl.BUTCHERYDT'),
					dataField: 'butcherydt',
					dataType: 'date',
				},
				{
					// 도축장
					headerText: t('lbl.FACTORYNAME'),
					dataField: 'factoryname',
					detaType: 'default',
				},
				{
					// 계약유형
					headerText: t('lbl.CONTRACTTYPE'),
					dataField: 'contracttype',
					dataType: 'code',
				},
				{
					// 계약업체
					headerText: t('lbl.CONTRACTCOMPANY'),
					dataField: 'contractcompany',
					dataType: 'default',
				},
				{
					// 계약업체명
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataField: 'contractcompanyname',
					dataType: 'default',
				},
				{
					// 유효일자(FROM)
					headerText: t('lbl.FROMVALIDDT'),
					dataField: 'fromvaliddt',
					dataType: 'date',
				},
				{
					// 유효일자(TO)
					headerText: t('lbl.TOVALIDDT'),
					dataField: 'tovaliddt',
					dataType: 'date',
				},
				{
					// 스캔예정량
					headerText: t('lbl.SERIALORDERQTY'),
					dataField: 'serialorderqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					// 스캔량
					headerText: t('lbl.SERIALINSPECTQTY'),
					dataField: 'serialinspectqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					// 스캔중량
					headerText: t('lbl.SERIALSCANWEIGHT'),
					dataField: 'serialscanweight',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
			],
		},
	];

	// const footerLayout = [];

	// 그리드 속성
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		showRowCheckColumn: false,
		enableFilter: true,
		// showFooter: true,
		// footerLayout: footerLayout,

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
			<GridAutoHeight id="history-status-grid">
				<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</GridAutoHeight>
		</>
	);
});

export default WdInplanSTOTab2;
