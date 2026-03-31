/*
 ############################################################################
 # FiledataField	: MgModifyLogDetail2.tsx
 # Description		: 재고 > 재고현황 > 재고변경사유현황(Detail)
 # Author			: sss
 # Since			: 25.08.04
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
// Redux
// API Call Function

const MgModifyLogDetail2 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form } = props; // Antd Form
	const [detailTotalCnt, setDetailTotalCnt] = useState(0);

	// Declare react Ref(2/4)
	ref.gridRef = useRef();

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{ dataField: 'modifydate', headerText: t('lbl.MODIFYDATE'), dataType: 'date', editable: false }, // 변경일자
		{ dataField: 'reasoncode', headerText: t('lbl.REASONCODE'), dataType: 'code', editable: false }, // 사유코드
		{ dataField: 'reasonmsg', headerText: t('lbl.REASONMSG'), dataType: 'string', editable: false }, // 사유메시지
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			disableMoving: true,
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'), // 상품코드
					dataType: 'code',
					filter: { showIcon: true },
					editable: false,
					disableMoving: true,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(e.item, 'sku');
						},
					},
				}, // 상품코드
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'), // 상품명
					dataType: 'name',
					editable: false,
					filter: { showIcon: true },
					disableMoving: true,
				}, // 상품명
			],
		},
		{ dataField: 'uom', headerText: t('lbl.UOM_ST'), dataType: 'code', editable: false }, // 단위
		// 20250827@sss 기능 미사용에 따른 주석처리(P/L 요청)
		// {
		// 	dataField: 'printyn',
		// 	headerText: t('lbl.PRINTYN'), // 출력여부
		// 	width: 80,
		// 	style: 'center',
		// 	commRenderer: {
		// 		type: 'checkBox',
		// 	},
		// },
		//{ dataField: 'printedqty', headerText: t('lbl.LABELPRINTEDQTY'), dataType: 'numeric' }, // 라벨출력수량
		{
			headerText: t('lbl.FROM_SERIALINFO'), // FROM 이력정보
			disableMoving: true,
			children: [
				{
					dataField: 'fromSerialno',
					headerText: t('lbl.SERIALNO'),
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // 이력번호
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'),
					dataType: 'stcodering',
					editable: false,
					disableMoving: true,
				}, // 바코드
				{
					dataField: 'fromConvserialno',
					headerText: t('lbl.BLNO'),
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // BL번호
				{
					dataField: 'fromButcherydt',
					headerText: t('lbl.BUTCHERYDT'),
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // 도축일자
				{
					dataField: 'fromFactoryname',
					headerText: t('lbl.FACTORYNAME'),
					dataType: 'string',
					editable: false,
					disableMoving: true,
				}, // 공장명
				{
					dataField: 'fromContracttype',
					headerText: t('lbl.CONTRACTTYPE'),
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // 계약유형
				{
					dataField: 'fromContractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'),
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // 계약회사
				{
					dataField: 'fromContractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'), // 계약회사명
					dataType: 'string',
					editable: false,
					disableMoving: true,
				}, // 계약회사명
				{
					dataField: 'fromFromvaliddt',
					headerText: t('lbl.FROMVALIDDT'),
					dataType: 'date',
					editable: false,
					disableMoving: true,
				}, // 유효시작일
				{
					dataField: 'fromTovaliddt',
					headerText: t('lbl.TOVALIDDT'),
					dataType: 'date',
					editable: false,
					disableMoving: true,
				}, // 유효종료일
			],
		},
		{
			headerText: t('lbl.TO_SERIALINFO'), // TO 이력정보
			disableMoving: true,
			children: [
				{
					dataField: 'toSerialno',
					headerText: t('lbl.SERIALNO'),
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // 이력번호
				{ dataField: 'barcode', headerText: t('lbl.BARCODE'), dataType: 'code', editable: false, disableMoving: true }, // 바코드
				{
					dataField: 'toConvserialno',
					headerText: t('lbl.BLNO'),
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // BL번호
				{
					dataField: 'toButcherydt',
					headerText: t('lbl.BUTCHERYDT'),
					dataType: 'date',
					editable: false,
					disableMoving: true,
				}, // 도축일자
				{
					dataField: 'toFactoryname',
					headerText: t('lbl.FACTORYNAME'),
					dataType: 'string',
					editable: false,
					disableMoving: true,
				}, // 공장명
				{
					dataField: 'toContracttype',
					headerText: t('lbl.CONTRACTTYPE'),
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // 계약유형
				{
					dataField: 'toContractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'), // 계약회사
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // 계약회사
				{
					dataField: 'toContractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'), // 계약회사명
					dataType: 'string',
					editable: false,
					disableMoving: true,
				}, // 계약회사명
				{
					dataField: 'toFromvaliddt',
					headerText: t('lbl.FROMVALIDDT'),
					dataType: 'date',
					editable: false,
					disableMoving: true,
				}, // 유효시작일
				{
					dataField: 'toTovaliddt',
					headerText: t('lbl.TOVALIDDT'),
					dataType: 'date',
					editable: false,
					disableMoving: true,
				}, // 유효종료일
			],
		},
		{
			headerText: t('lbl.EDITERINFO'), // 수정자정보
			disableMoving: true,
			children: [
				{
					dataField: 'editdate',
					headerText: t('lbl.EDITDATE'), // 수정일자
					dataType: 'date',
					formatString: 'yyyy-MM-dd HH:mm:ss',
					editable: false,
					disableMoving: true,
				}, // 수정일자
				{ dataField: 'editwho', headerText: t('lbl.EDITWHO'), dataType: 'code', editable: false, disableMoving: true }, // 수정자
				{
					dataField: 'username',
					headerText: t('lbl.USERNAME'),
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // 사용자명
			],
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: false,
		//independentAllCheckBox: true,
		fillColumnSizeMode: false,
		showFooter: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.delYn == 'Y') {
				return 'color-danger';
			}
			return '';
		},
	};
	// FooterLayout Props
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{ dataField: 'qty', positionField: 'qty', operation: 'SUM', formatString: '#,##0' },
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	useEffect(() => {
		//
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				{/* 상품LIST */}
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.PRODUCTLIST')} totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});
export default MgModifyLogDetail2;
