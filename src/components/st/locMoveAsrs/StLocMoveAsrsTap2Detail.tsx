/*
 ############################################################################
 # FiledataField	: StLocMoveAsrsTap2Detail.tsx
 # Description		: 자동창고보충(이동결과)
 # Author			: 공두경
 # Since			: 25.09.16
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

const StLocMoveAsrsTap2Detail = forwardRef((props: any, ref: any) => {
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

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE') /*물류센터*/,
			dataType: 'code',
		},
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE') /*창고*/,
			dataType: 'code',
		},
		{
			dataField: 'stocktype',
			headerText: t('lbl.STOCKTYPE') /*재고위치*/,
			dataType: 'code',
		},
		{
			dataField: 'stockgrade',
			headerText: t('lbl.STOCKGRADE') /*재고속성*/,
			dataType: 'code',
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC') /*로케이션*/,
			dataType: 'code',
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU') /*상품코드*/,
			dataType: 'code',
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME') /*상품명칭*/,
			dataType: 'code',
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE') /*저장조건*/,
			dataType: 'code',
		},
		{
			dataField: 'fixloc',
			headerText: t('lbl.FIXLOC') /*고정로케이션*/,
			dataType: 'code',
		},
		{
			headerText: t('lbl.POSBQTY') /*이동가능수량*/,
			children: [
				{
					dataField: 'posbqtyBox',
					headerText: t('lbl.BOX_ENG') /*BOX*/,
					dataType: 'code',
				},
				{
					dataField: 'posbqtyEa',
					headerText: t('lbl.EA_ENG') /*EA*/,
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.MOVEINFO') /*이동정보*/,
			children: [
				{
					dataField: 'toLoc',
					headerText: t('lbl.TOLOC_MV') /*이동로케이션*/,
					dataType: 'code',
				},
				{
					dataField: 'toOrderqtyBox',
					headerText: t('lbl.BOX_ENG') /*BOX*/,
					dataType: 'code',
				},
				{
					dataField: 'toOrderqtyEa',
					headerText: t('lbl.EA_ENG') /*EA*/,
					dataType: 'code',
				},
			],
		},
		{
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN') /*소비기한임박여부*/,
			dataType: 'code',
		},
		{
			dataField: 'lottable01',
			headerText: t('lbl.LOTTABLE01') /*기준일(소비,제조)*/,
			dataType: 'code',
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM') /*소비기간(잔여/전체)*/,
			dataType: 'code',
		},
		{
			headerText: t('lbl.STOCK_INFO') /*재고정보*/,
			children: [
				{
					dataField: 'uom',
					headerText: t('lbl.UOM_ST') /*단위*/,
					dataType: 'code',
				},
				{
					dataField: 'qty',
					headerText: t('lbl.QTY_ST') /*현재고수량*/,
					dataType: 'code',
				},
				{
					dataField: 'qtyallocated',
					headerText: t('lbl.QTYALLOCATED_ST') /*재고할당수량*/,
					dataType: 'code',
				},
				{
					dataField: 'qtypicked',
					headerText: t('lbl.QTYPICKED_ST') /*피킹수량*/,
					dataType: 'code',
				},
				{
					dataField: 'posbqty',
					headerText: t('lbl.POSBQTY') /*이동가능수량*/,
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.SERIALINFO') /*상품이력정보*/,
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO') /*이력번호*/,
					dataType: 'code',
				},
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE') /*바코드*/,
					dataType: 'code',
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO') /*B/L번호*/,
					dataType: 'code',
				},
				{
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT') /*도축일자*/,
					dataType: 'code',
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME') /*도축장*/,
					dataType: 'code',
				},
				{
					dataField: 'contracttype',
					headerText: t('lbl.CONTRACTTYPE') /*계약유형*/,
					dataType: 'code',
				},
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY') /*계약업체*/,
					dataType: 'code',
				},
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME') /*계약업체명*/,
					dataType: 'code',
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT') /*유효일자(FROM)*/,
					dataType: 'code',
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT') /*유효일자(TO)*/,
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.PROCESSFLAG') /*처리결과*/,
			children: [
				{
					dataField: 'processflag',
					headerText: t('lbl.PROCESSFLAG') /*PROCESSFLAG*/,
					dataType: 'code',
				},
				{
					dataField: 'processmsg',
					headerText: t('lbl.PROCESSMSG') /*PROCESSMSG*/,
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
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		// rowStyleFunction 함수 정의
		// 이 함수는 각 행이 렌더링될 때마다 호출됩니다.
		rowStyleFunction: function (rowIndex: any, item: any) {
			// item은 현재 행의 데이터 객체입니다.
			//console.log(('rowIndex:' + rowIndex + ', orderqty:' + item.orderqty + ', processqty:' + item.processqty);
			if (item.processflag === 'E') {
				return {
					//color: '#999',
					backgroundColor: '#fF8C00',
					//textDecoration: 'line-through',
				};
			}
			return ''; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
		},
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'dccode',
		},
		{
			dataField: 'posbqtyBox',
			positionField: 'posbqtyBox',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'posbqtyEa',
			positionField: 'posbqtyEa',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'toOrderqtyBox',
			positionField: 'toOrderqtyBox',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'toOrderqtyEa',
			positionField: 'toOrderqtyEa',
			operation: 'SUM',
			formatString: '#,##0',
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
		gridRefCur1?.setGridData(props.data);
		gridRefCur1?.setSelectionByIndex(0, 0);

		if (props.data.length > 0) {
			// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
			// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
			const colSizeList = gridRefCur1.getFitColumnSizeList(true);

			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRefCur1.setColumnSizeList(colSizeList);
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="h100">
				<GridTopBtn gridBtn={gridBtn} gridTitle="이동결과목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default StLocMoveAsrsTap2Detail;
