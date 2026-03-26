/*
 ############################################################################
 # FiledataField	: WdShipmentETCTap2Detail.tsx
 # Description		: 출고 > 기타출고 > 매각출고처리 (처리결과)
 # Author			    : 고혜미
 # Since		    	: 25.10.16
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
import { getCommonCodeList } from '@/store/core/comCodeStore';

const WdShipmentETCTap2Detail = forwardRef((props: any, ref: any) => {
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
	/**
	 * 스타일 함수
	 * @param rowIndex 행 인덱스
	 * @param columnIndex 열 인덱스
	 * @param value 셀 값
	 * @param headerText 헤더 텍스트
	 * @param item 데이터 항목
	 * @returns 스타일 객체
	 */
	const styleFunction = (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
		return item.processflag === 'E' ? { backgroundColor: '#fF8C00' } : {};
	};

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
			dataField: 'zone',
			headerText: t('lbl.ZONE') /*피킹존*/,
			dataType: 'code',
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC') /*로케이션*/,
			dataType: 'code',
		},
		{
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU') /*상품코드*/,
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
					headerText: t('lbl.SKUNAME') /*상품명칭*/,
					filter: { showIcon: true },
				},
			],
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_ST') /*단위*/,
			dataType: 'code',
		},
		{
			dataField: 'qty',
			headerText: t('lbl.QTY_ST') /*현재고수량*/,
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'openqty',
			headerText: t('lbl.OPENQTY_ST') /*가용재고수량*/,
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'qtyallocated',
			headerText: t('lbl.QTYALLOCATED_ST') /*재고할당수량*/,
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'qtypicked',
			headerText: t('lbl.QTYPICKED_ST') /*피킹재고*/,
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'etcqty',
			headerText: t('lbl.ETCQTY_WD') /*처리수량*/,
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'potype',
			headerText: t('lbl.STOCKTRANSTYPE') /*처리유형*/,
			labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
				const arrCodeList = getCommonCodeList('PROCESSTYPE_ETC')?.find(v => v['comCd'] === value);
				if (arrCodeList === undefined) return '';
				return arrCodeList['cdNm'];
			},
			dataType: 'string',
		},
		{
			dataField: 'reasoncode',
			headerText: t('lbl.PROCESSREASON_ETC') /*처리사유*/,
			labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
				const arrCodeList = getCommonCodeList('PROCESSREASON_ETC')?.find(v => v['comCd'] === value);
				if (arrCodeList === undefined) return '';
				return arrCodeList['cdNm'];
			},
			dataType: 'string',
		},
		{
			dataField: 'reasonmsg',
			headerText: t('lbl.REASONDTL_ETC') /*세부사유*/,
			dataType: 'string',
			labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
				const arrCodeList = getCommonCodeList('REASONDETAIL_ETC')?.find(v => v['comCd'] === value);
				if (arrCodeList === undefined) return '';
				return arrCodeList['cdNm'];
			},
		},
		{
			dataField: 'other05',
			headerText: t('lbl.OTHER05_DMD_AJ') /*물류귀책배부*/,
			dataType: 'code',
			labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
				const arrCodeList = getCommonCodeList('YN')?.find(v => v['comCd'] === value);
				if (arrCodeList === undefined) return '';
				return arrCodeList['cdNm'];
			},
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
			headerText: t('lbl.SERIALINFO'),
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
					dataField: '',
					headerText: t('lbl.BLNO') /*B/L번호*/,
					dataType: 'code',
				},
				{
					dataField: '',
					headerText: t('lbl.BUTCHERYDT') /*도축일자*/,
					dataType: 'date',
				},
				{
					dataField: '',
					headerText: t('lbl.FACTORYNAME') /*도축장*/,
					dataType: 'code',
				},
				{
					dataField: '',
					headerText: t('lbl.CONTRACTTYPE') /*계약유형*/,
					dataType: 'code',
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.CONTRACTCOMPANY') /*계약업체*/,
					dataType: 'code',
				},
				{
					dataField: 'seriallevel',
					headerText: t('lbl.CONTRACTCOMPANYNAME') /*계약업체명*/,
				},
				{
					dataField: 'serialtype',
					headerText: t('lbl.FROMVALIDDT') /*유효일자(FROM)*/,
					dataType: 'date',
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.TOVALIDDT') /*유효일자(TO)*/,
					dataType: 'date',
				},
			],
		},
		{
			dataField: 'lot',
			headerText: t('lbl.LOT') /*로트*/,
			dataType: 'code',
		},
		{
			dataField: 'ordertype',
			headerText: t('lbl.ORDERTYPE') /*주문유형*/,
			dataType: 'code',
		},
		{
			dataField: 'duration',
			headerText: t('lbl.DURATION') /*소비기간*/,
			dataType: 'code',
		},
		{
			dataField: 'durationtype',
			headerText: t('lbl.DURATIONTYPE') /*소비기한관리방법*/,
			labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
				const arrCodeList = getCommonCodeList('DURATIONTYPE')?.find(v => v['comCd'] === value);
				if (arrCodeList === undefined) return '';
				return arrCodeList['cdNm'];
			},
			dataType: 'code',
		},
		{
			dataField: 'stockid',
			headerText: t('lbl.STOCKID') /*개체식별/소비이력*/,
			dataType: 'code',
		},
		{
			headerText: t('lbl.PROCESSFLAG'),
			children: [
				{
					dataField: 'processflag',
					headerText: t('lbl.PROCESSFLAG') /*프로세스 플래그*/,
					dataType: 'code',
					//styleFunction,
				},
				{
					dataField: 'processmsg',
					headerText: t('lbl.PROCESSMSG') /*프로세스 메시지*/,
					//styleFunction,
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
		//enableColumnResize: true, // 열 사이즈 조정 여부
		// item.processflag === 'E' ? { backgroundColor: '#fF8C00' } : {};
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.processflag == 'E') {
				return { backgroundColor: 'darkorange' };
			}
			return '';
		},
	};

	// FooterLayout Props
	// FooterLayout Props
	const footerLayout = [
		{ labelText: '합계', positionField: gridCol[0].dataField },
		{ dataField: 'qty', positionField: 'qty', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 현재고수량 합계
		{ dataField: 'openqty', positionField: 'openqty', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 가용재고수량 합계
		{
			dataField: 'qtyallocated',
			positionField: 'qtyallocated',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		}, // 재고할당수량 합계
		{ dataField: 'qtypicked', positionField: 'qtypicked', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 피킹재고 합계
		{ dataField: 'etcqty', positionField: 'etcqty', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 처리수량 합계
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

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle="처리결과목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default WdShipmentETCTap2Detail;
