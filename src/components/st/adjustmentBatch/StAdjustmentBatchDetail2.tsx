/*
 ############################################################################
 # FiledataField	: StAdjustmentBatchDetai2.tsx
 # Description		: 재고 > 재고조정 > 일괄재고조정 (처리결과)
 # Author					: JiHoPark
 # Since					: 2025.09.24.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Util

// Store

// API

// Hooks

// lib

// type
import { GridBtnPropsType } from '@/types/common';
// asset
import AGrid from '@/assets/styled/AGrid/AGrid';

interface StAdjustmentBatchDetai2Props {
	data: any;
	totalCnt: any;
}

const StAdjustmentBatchDetai2 = forwardRef((props: StAdjustmentBatchDetai2Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//그리드 컬럼
	const gridCol = [
		{
			headerText: '처리결과',
			children: [
				{
					dataField: 'processflag',
					headerText: t('lbl.PROCESSFLAG'),
					width: 80,
					editable: false,
					dataType: 'code',
				}, // 처리결과
				{
					dataField: 'processmsg',
					headerText: t('lbl.PROCESSMSG'),
					width: 120,
					editable: false,
					dataType: 'name',
				}, // 처리메시지
			],
		},
		{ headerText: t('lbl.DCCODE'), /*물류센터*/ dataField: 'dccode', dataType: 'code', width: 80 },
		{ headerText: t('lbl.STORE'), /*창고*/ dataField: 'organize', dataType: 'code', width: 100 },
		{ headerText: t('lbl.STOCKTYPE'), /*재고위치*/ dataField: 'stocktype', dataType: 'code', width: 100 },
		{ headerText: t('lbl.STOCKGRADE'), /*재고속성*/ dataField: 'stockgrade', dataType: 'code', width: 100 },
		{ headerText: t('lbl.LOC_ST'), /*로케이션*/ dataField: 'loc', dataType: 'code', width: 100 },
		{
			headerText: t('lbl.SKU'),
			/*상품코드*/ dataField: 'sku',
			dataType: 'code',
			width: 80,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.current.openPopup(e.item, 'sku');
				},
			},
		},
		{
			headerText: t('lbl.SKUNM'),
			/*상품명칭*/ dataField: 'skuname',
			dataType: 'string',
			editable: false,
			width: 350,
		},
		{ headerText: t('lbl.STORAGETYPE'), /*저장조건*/ dataField: 'storagetype', dataType: 'code', width: 100 },
		{
			headerText: t('lbl.STOCK_INFO') /*재고정보*/,
			children: [
				{ headerText: t('lbl.UOM_RT'), /*단위*/ dataField: 'uom', dataType: 'code', width: 80 },
				{
					headerText: t('lbl.QTY_ST'),
					/*현재고수량*/ dataField: 'qty',
					dataType: 'numeric',
					formatString: '#,##0.##',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.QTYALLOCATED_ST'),
					/*재고할당수량*/ dataField: 'qtyallocated',
					dataType: 'numeric',
					formatString: '#,##0.##',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.QTYPICKED_ST'),
					/*피킹재고*/ dataField: 'qtypicked',
					dataType: 'numeric',
					formatString: '#,##0.##',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.SHOTAGE_QTY'),
					/*가용수량*/ dataField: 'shotageQty',
					dataType: 'numeric',
					formatString: '#,##0.##',
					editable: false,
					width: 120,
				},
			],
		},
		{
			headerText: t('lbl.ETCQTY_WD'),
			/*처리수량*/ dataField: 'tranqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			width: 120,
		},
		{ headerText: t('lbl.INQUIRYREASONCODE'), /*발생사유*/ dataField: 'reasoncode', dataType: 'code', width: 160 },
		{
			headerText: t('lbl.WONEARDURATIONYN'),
			/*유통기한임박여부*/ dataField: 'neardurationyn',
			dataType: 'code',
			width: 120,
		},
		{
			headerText: t('lbl.LOTTABLE01_MFG_WO'),
			/*기준일(유통,제조)*/ dataField: 'lottable01',
			dataType: 'string',
			width: 120,
		},
		{
			headerText: t('lbl.DURATIONTERM'),
			/*유통기간(잔여/전체)*/ dataField: 'durationTerm',
			dataType: 'string',
			width: 150,
		},
		{
			headerText: t('lbl.SERIALINFO') /*상품이력정보*/,
			children: [
				{
					headerText: t('lbl.SERIALNO_SKU'),
					/*이력번호*/ dataField: 'serialno',
					dataType: 'code',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.BARCODE'),
					/*바코드*/ dataField: 'barcode',
					dataType: 'code',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.BLNO'),
					/*B/L 번호*/ dataField: 'convserialno',
					dataType: 'code',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.CONVERTLOT'),
					/*도축일자*/ dataField: 'butcherydt',
					dataType: 'date',
					editable: false,
					width: 80,
				},
				{
					headerText: t('lbl.FACTORYNAME'),
					/*도축장*/ dataField: 'factoryname',
					dataType: 'code',
					editable: false,
					width: 150,
				},
				{
					headerText: t('lbl.CONTRACTTYPE'),
					/*계약유형*/ dataField: 'contracttype',
					dataType: 'code',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.CONTRACTCOMPANY'),
					/*계약업체*/ dataField: 'contractcompany',
					dataType: 'code',
					editable: false,
					width: 150,
				},
				{
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					/*계약업체명*/ dataField: 'contractcompanyname',
					dataType: 'code',
					editable: false,
					width: 180,
				},
				{
					headerText: t('lbl.FROMVALIDDT'),
					/*유효일자(FROM)*/ dataField: 'fromvaliddt',
					dataType: 'date',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.TOVALIDDT'),
					/*유효일자(TO)*/ dataField: 'tovaliddt',
					dataType: 'date',
					editable: false,
					width: 120,
				},
			],
		},
	];

	// FooterLayout Props
	const footerCol = [
		{
			dataField: 'tranqty',
			positionField: 'tranqty',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'float',
			style: 'right',
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		// autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		isLegacyRemove: true,
		showFooter: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.processflag === 'E') {
				return { backgroundColor: 'darkorange' }; // CSS 클래스 이름 반환
			} else if (item.processflag === 'Y') {
				return { backgroundColor: '' }; // 성공 행 스타일
			}
			return {};
		},
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref?.current.setSelectionByIndex(0);
		});
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
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

	/**
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			const dataList = props.data;
			gridRef?.setGridData(dataList);
			gridRef?.setSelectionByIndex(0, 0);

			// if (dataList.length > 0) {
			// 	// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
			// 	// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
			// 	const colSizeList = gridRef.getFitColumnSizeList(true);

			// 	// 구해진 칼럼 사이즈를 적용 시킴.
			// 	gridRef.setColumnSizeList(colSizeList);
			// }
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="">
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} footerLayout={footerCol} />
			</AGrid>
		</>
	);
});

export default StAdjustmentBatchDetai2;
