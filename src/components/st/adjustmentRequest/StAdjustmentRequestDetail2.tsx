/*
 ############################################################################
 # FiledataField	: StAdjustmentRequestDetail2.tsx
 # Description		: 재고 > 재고조정 > 재고조정처리 (요청처리결과)
 # Author					: JiHoPark
 # Since					: 2025.10.10.
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
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface StAdjustmentRequestDetail2Props {
	data: any;
	totalCnt: any;
}

const StAdjustmentRequestDetail2 = forwardRef((props: StAdjustmentRequestDetail2Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const reasonLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		const ynOptions = getCommonCodeList('REASONCODE_AJ');
		const option = ynOptions.find((item: any) => item.comCd === value);
		return option?.cdNm || value;
	};

	//그리드 컬럼
	const gridCol = [
		// {
		// 	headerText: t('lbl.RESULTMSG') /*처리결과*/,
		// 	children: [
		// 		{
		// 			headerText: t('lbl.PROCESSFLAG'),
		// 			/*처리결과*/ dataField: 'processflag',
		// 			dataType: 'code',
		// 			editable: false,
		// 			width: 120,
		// 		},
		// 		{
		// 			headerText: t('lbl.PROCESSMSG'),
		// 			/*처리메시지*/ dataField: 'processmsg',
		// 			dataType: 'string',
		// 			editable: false,
		// 			width: 250,
		// 		},
		// 	],
		// },
		{ headerText: t('lbl.DCCODE'), /*물류센터*/ dataField: 'dccode', dataType: 'code', width: 80 },
		{ headerText: t('lbl.STORE'), /*창고*/ dataField: 'organize', dataType: 'code', width: 100 },
		{
			headerText: t('lbl.STOCKTYPE') /*재고위치*/,
			children: [
				{ headerText: t('lbl.CODE'), /*코드*/ dataField: 'stocktype', dataType: 'code', editable: false, width: 80 },
				{
					headerText: t('lbl.DESCR'),
					/*명칭*/ dataField: 'stocktypenm',
					dataType: 'string',
					editable: false,
					width: 100,
				},
			],
		},
		{
			headerText: t('lbl.STOCKGRADE') /*재고속성*/,
			children: [
				{ headerText: t('lbl.CODE'), /*코드*/ dataField: 'stockgrade', dataType: 'code', editable: false, width: 80 },
				{
					headerText: t('lbl.DESCR'),
					/*명칭*/ dataField: 'stockgradename',
					dataType: 'string',
					editable: false,
					width: 100,
				},
			],
		},
		{ headerText: t('lbl.ZONE'), /*피킹존*/ dataField: 'zone', dataType: 'code', width: 80 },
		{ headerText: t('lbl.LOC_ST'), /*로케이션*/ dataField: 'loc', dataType: 'code', width: 100 },
		{
			headerText: t('lbl.SKUINFO') /*상품정보*/,
			children: [
				{
					headerText: t('lbl.SKU'),
					/*상품코드*/ dataField: 'sku',
					dataType: 'code',
					editable: false,
					width: 80,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.current.openPopup(e.item, 'sku');
						},
					},
				},
				{
					headerText: t('lbl.SKUNAME'),
					/*상품명칭*/ dataField: 'skuname',
					dataType: 'string',
					editable: false,
					width: 350,
				},
			],
		},
		{ headerText: t('lbl.UOM_RT'), /*단위*/ dataField: 'uom', dataType: 'code', width: 80 },
		{
			headerText: t('lbl.QTY_ST'),
			/*현재고수량*/ dataField: 'qty',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 120,
		},
		{
			headerText: t('lbl.OPENQTY_ST'),
			/*가용재고수량*/ dataField: 'openqty',
			dataType: 'numeric',
			width: 120,
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.QTYALLOCATED_ST'),
			/*재고할당수량*/ dataField: 'qtyallocated',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 120,
		},
		{
			headerText: t('lbl.QTYPICKED_ST'),
			/*피킹재고*/ dataField: 'qtypicked',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 120,
		},
		{
			headerText: t('lbl.ADJUSTQTY_AJ'),
			/*조정수량*/ dataField: 'tranqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
			width: 120,
		},

		//{ headerText: t('lbl.INQUIRYREASONCODE'), /*발생사유*/ dataField: 'reasoncode', dataType: 'code', width: 160 },
		// 2026.01.06 김동한 이창진님 요청으로 발생사유 한글로 보여지게 처리함.
		{
			headerText: t('lbl.INQUIRYREASONCODE'),
			/*발생사유*/ dataField: 'reasoncode',
			dataType: 'code',
			labelFunction: reasonLabelFunc,
			width: 160,
		},
		{ headerText: t('lbl.OTHER05_DMD_AJ'), /*물류귀책배부*/ dataField: 'processmain', dataType: 'code', width: 100 },
		{ headerText: t('lbl.REMARK_REASON'), /*비고(사유)*/ dataField: 'other05', dataType: 'code', width: 140 },
		// 2026.01.06 김동한 이창진님 요청으로 해당 컬럼 오른쪽 끝으로 이동
		{
			headerText: t('lbl.RESULTMSG') /*처리결과*/,
			children: [
				{
					headerText: t('lbl.PROCESSFLAG'),
					/*처리결과*/ dataField: 'processflag',
					dataType: 'code',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.PROCESSMSG'),
					/*처리메시지*/ dataField: 'processmsg',
					dataType: 'string',
					editable: false,
					width: 250,
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
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
			rounding: 'round',
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		showFooter: true,
		// row Styling 함수
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.processflag === 'Y') {
				return { backgroundColor: '' };
			} else {
				return { backgroundColor: 'darkorange' };
			}
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

			if (dataList.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} footerLayout={footerCol} />
			</AGrid>
		</>
	);
});

export default StAdjustmentRequestDetail2;
