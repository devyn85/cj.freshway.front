/*
 ############################################################################
 # FiledataField	: DpInplanSNDetail.tsx
 # Description		: 이력상품입고현황(Detail)
 # Author			: 공두경
 # Since			: 25.06.17
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert } from '@/util/MessageUtil';
// API Call Function
import { apiGetDataExcelList, apiGetDetailList } from '@/api/dp/apiDpInplanSN';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';

const DpInplanSNDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
	ref.gridRef3 = useRef(null);
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	const searchDtl = () => {
		const selectedRow = ref.gridRef.current.getSelectedRows();
		const searchParams = props.form.getFieldsValue();
		searchParams.ordertype = searchParams?.ordertype?.join(',');
		const params = {
			fixdccode: searchParams.fixdccode,
			dccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			docdt: selectedRow[0].docdt,
			docno: selectedRow[0].docno,
			doctype: selectedRow[0].doctype,
			slipdt: selectedRow[0].slipdt,
			fromcustkey: searchParams.fromcustkey,
			sku: searchParams.sku,
			ordertype: searchParams.ordertype,
			channel: searchParams.channel,
			storagetype: searchParams.storagetype,
			serialno: searchParams.serialno,
			blno: searchParams.blno,
			contractcompany: searchParams.contractcompany,
			fromSlipdt: searchParams.slipdtRange[0].format('YYYYMMDD'),
			toSlipdt: searchParams.slipdtRange[1].format('YYYYMMDD'),
			serialCheck: '',
			tpltype: searchParams.tpltype,
		};

		if (
			!commUtil.isNull(searchParams.blno) ||
			!commUtil.isNull(searchParams.serialno) ||
			!commUtil.isNull(searchParams.contractcompany)
		) {
			params.serialCheck = 'Y';
		}

		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			props.setTotalCnt2(gridData?.length || 0);
			ref.gridRef2.current?.setGridData(gridData);
			const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current?.setColumnSizeList(colSizeList);
		});
	};

	// 그리드 엑셀 다운로드 정보 조회
	const searchExcel = () => {
		const params = props.form.getFieldsValue();
		params.ordertype = params?.ordertype?.join(',');

		if (commUtil.isNull(params.slipdtRange)) {
			showAlert('', '입고일자를 선택해주세요.');
			return;
		}
		if (commUtil.isNull(params.slipdtRange[0]) || commUtil.isNull(params.slipdtRange[1])) {
			showAlert('', '입고일자를 선택해주세요.');
			return;
		}

		params.fromSlipdt = params.slipdtRange[0].format('YYYYMMDD');
		params.toSlipdt = params.slipdtRange[1].format('YYYYMMDD');

		if (dateUtil.getDaysDiff(params.fromSlipdt, params.toSlipdt) > 31) {
			showAlert('', '최대 한 달 간의 데이터만\n조회 가능합니다.');
			return;
		}

		apiGetDataExcelList(params).then(res => {
			const gridData = res.data;
			ref.gridRef3.current?.setGridData(gridData);
			const colSizeList = ref.gridRef3.current.getFitColumnSizeList(true);

			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef3.current.setColumnSizeList(colSizeList);
			if (gridData.length > 0) {
				downloadExcel(colSizeList);
			} else {
				showAlert('', '엑셀다운로드 할 정보가 없습니다.');
			}
		});
	};

	/**
	 *
	 * @param cols
	 * @param sizes
	 * @param result
	 * @param idx
	 */
	function collectColumnSizes(cols: any[], sizes: any[], result: any, idx = { i: 0 }) {
		for (const col of cols) {
			if (col.children) {
				collectColumnSizes(col.children, sizes, result, idx);
			} else if (col.dataField) {
				result[String(col.dataField)] = sizes[idx.i];
				idx.i++;
			}
		}
	}

	// 그리드 엑셀 다운로드
	const downloadExcel = (colSizeList: any) => {
		// const result: any = {};
		// gridCol 배열을 순회하면서 dataField와 colsize를 매칭
		/*
		for (let i = 0; i < gridCol.length; i++) {
			const dataField = gridCol[i].dataField;
			const size = colSizeList[i];
			if (dataField) {
				result[dataField] = size;
			}
		}*/
		// collectColumnSizes(gridCol3, colSizeList, result);

		// //console.log('result', result);

		// 구해진 칼럼 사이즈를 적용 시킴.
		ref.gridRef3.current.setColumnSizeList(colSizeList);
		const params = {
			fileName: '이력상품입고현황',
			//columnSizeOfDataField: result,
			exportWithStyle: true, // 스타일 적용 여부
			progressBar: true,
			exceptColumnFields: ['lottable01', 'duration', 'durationtype'],
		};

		ref.gridRef3.current?.exportToXlsxGrid(params);
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{ headerText: '입고일자', dataField: 'slipdt', dataType: 'date' },
		{ headerText: '물류센터', dataField: 'dccode', dataType: 'code' },
		{ headerText: '창고', dataField: 'organizedesc', dataType: 'code' },
		{ headerText: '구매번호', dataField: 'docno', dataType: 'code' },
		{ headerText: '구매유형', dataField: 'ordertypeName', dataType: 'code' },
		{
			headerText: '공급업체',
			children: [
				{
					headerText: '협력사코드',
					dataField: 'fromCustkey',
					dataType: 'code',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(
								{
									custkey: e.item.fromCustkey,
									custtype:
										e.item.ordertypeName == '표준센터이동'
											? 'C'
											: 'P' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
								},
								'cust',
							);
						},
					},
				},
				{ headerText: '협력사명', dataField: 'fromCustname' },
			],
		},
		{ headerText: '진행상태', dataField: 'statusName', dataType: 'code' },
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: false,
	};

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelDownload', // excelDownload
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: searchExcel,
			},
		],
	};

	//그리드 컬럼(상세목록 그리드)
	const gridCol2 = [
		{ headerText: '품목번호', dataField: 'docline', dataType: 'code' },
		{
			headerText: '상품코드',
			dataField: 'sku',
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuName,
					};
					ref.gridRef.current.openPopup(params, 'sku');
				},
			},
		},
		{ headerText: '상품명칭', dataField: 'skuname' },
		{ headerText: '원산국', dataField: 'countryoforigin', dataType: 'code' },
		{ headerText: '플랜트', dataField: 'plantDescr', dataType: 'code' },
		{ headerText: '저장유무', dataField: 'channelname', dataType: 'code' },
		{ headerText: '저장조건', dataField: 'storagetypename', dataType: 'code' },
		{ headerText: '박스입수', dataField: 'qtyperbox', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '구매단위', dataField: 'uom', dataType: 'code' },
		{ headerText: '구매수량', dataField: 'orderqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '발주수량', dataField: 'purchaseQty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '결품수량', dataField: 'shortageqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '입고예정량', dataField: 'inplanqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '입고예정확정량', dataField: 'openqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '입고검수량', dataField: 'inspectqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '입고확정량', dataField: 'confirmqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '입고중량', dataField: 'weight', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '진행상태', dataField: 'statusName', dataType: 'code' },
		{
			// 제조일자
			dataField: 'lotManufacture',
			headerText: t('lbl.MANUFACTUREDT'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'calender',
			},
			// styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			// 	return {
			// 		backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''),
			// 	};
			// },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 90,
		},
		{
			// 소비일자
			dataField: 'lotExpire',
			headerText: t('lbl.EXPIREDT'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'calender',
			},
			// styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			// 	return {
			// 		backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''),
			// 	};
			// },
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			width: 90,
		},
		{
			headerText: t('lbl.DURATION_TERM'),
			dataField: 'durationTerm',
			dataType: 'code',
			formatString: 'yyyy-mm-dd',
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 유효기간-소비기간(잔여/전체)
		{
			headerText: t('lbl.USEBYDATE_FREE_RT'),
			dataField: 'usebydatefreert',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, // 소비기한잔여(%)
		{
			headerText: t('lbl.SERIALINFO'), //상품이력정보
			children: [
				{ headerText: '이력번호', dataField: 'serialno', dataType: 'code' },
				{ headerText: '바코드', dataField: 'stockid', dataType: 'code' },
				{ headerText: 'B/L 번호', dataField: 'convserialno', dataType: 'code' },
				{ headerText: '도축일자', dataField: 'butcherydt', dataType: 'date' },
				{ headerText: '도축장', dataField: 'factoryname', dataType: 'code' },
				{ headerText: '계약유형', dataField: 'contracttype', dataType: 'code' },
				{ headerText: '계약업체', dataField: 'contractcompany', dataType: 'code' },
				{ headerText: '계약업체명', dataField: 'contractcompanyname' },
				{ headerText: 'FROM', dataField: 'fromvalidDt', dataType: 'date' },
				{ headerText: 'TO', dataField: 'tovalidDt', dataType: 'date' },
				{ headerText: '스캔예정량', dataField: 'serialorderqty', dataType: 'numeric', formatString: '#,##0.##' },
				{ headerText: '스캔량', dataField: 'serialinspectqty', dataType: 'numeric', formatString: '#,##0.##' },
				{ headerText: '스캔중량', dataField: 'serialscanweight', dataType: 'numeric', formatString: '#,##0.##' },
			],
		},
	];

	// 그리드 Props(상세목록 그리드)
	const gridProps2 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
	};

	// FooterLayout Props(상세목록 그리드)
	const footerLayout2 = [
		{
			dataField: 'qtyperbox',
			positionField: 'qtyperbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'purchaseQty',
			positionField: 'purchaseQty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'shortageqty',
			positionField: 'shortageqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inplanqty',
			positionField: 'inplanqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'openqty',
			positionField: 'openqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},

		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'weight',
			positionField: 'weight',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn2: GridBtnPropsType = {
		tGridRef: ref.gridRef2, // 타겟 그리드 Ref
		btnArr: [],
	};

	//그리드 컬럼(엑셀 그리드)
	const gridCol3 = [
		{ headerText: '입고일자', dataField: 'slipdt', dataType: 'date' },
		{ headerText: '물류센터', dataField: 'dccode', dataType: 'code' },
		{ headerText: '창고', dataField: 'organize', dataType: 'code' },
		{ headerText: '구매번호', dataField: 'docno', dataType: 'code' },
		{ headerText: '구매유형', dataField: 'ordertypeName', dataType: 'code' },
		{
			headerText: '공급업체',
			children: [
				{ headerText: '협력사코드', dataField: 'fromCustkey', dataType: 'code' },
				{ headerText: '협력사명', dataField: 'fromCustname' },
			],
		},
		{ headerText: '진행상태', dataField: 'statusName', dataType: 'code' },
		{ headerText: '품목번호', dataField: 'docline', dataType: 'code' },
		{ headerText: '상품코드', dataField: 'sku', dataType: 'code' },
		{ headerText: '상품명칭', dataField: 'skuname' },
		{ headerText: '원산국', dataField: 'countryoforigin', dataType: 'code' },
		{ headerText: '플랜트', dataField: 'plantDescr', dataType: 'code' },
		{ headerText: '저장유무', dataField: 'channelname', dataType: 'code' },
		{ headerText: '저장조건', dataField: 'storagetypename', dataType: 'code' },
		{ headerText: '박스입수', dataField: 'qtyperbox', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '구매단위', dataField: 'uom', dataType: 'code' },
		{ headerText: '구매수량', dataField: 'orderqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '발주수량', dataField: 'purchaseQty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '결품수량', dataField: 'shortageqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '입고예정량', dataField: 'orderqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '입고예정확정량', dataField: 'openqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '입고검수량', dataField: 'confirmqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '입고확정량', dataField: 'confirmqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '입고중량', dataField: 'weight', dataType: 'numeric', formatString: '#,##0.##' },
		// {
		// 	headerText: '기준일(소비,제조)',
		// 	dataField: 'lottable01',
		// 	dataType: 'date',
		// 	styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
		// 		return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
		// 	},
		// },
		{
			// 제조일자
			dataField: 'manufacturedt',
			headerText: t('lbl.MANUFACTUREDT'),
			dataType: 'code',
			commRenderer: {
				type: 'calender',
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			editable: false,
		},
		{
			// 소비일자
			dataField: 'expiredt',
			headerText: t('lbl.EXPIREDT'),
			dataType: 'code',
			commRenderer: {
				type: 'calender',
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
			editable: false,
		},
		{
			headerText: '소비기간(잔여/전체)',
			dataField: 'durationTerm',
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: '상품이력정보',
			children: [
				{ headerText: '이력번호', dataField: 'serialno', dataType: 'code' },
				{ headerText: '바코드', dataField: 'stockid', dataType: 'code' },
				{ headerText: 'B/L 번호', dataField: 'convserialno', dataType: 'code' },
				{ headerText: '도축일자', dataField: 'butcherydt', dataType: 'date' },
				{ headerText: '도축장', dataField: 'factoryname' },
				{ headerText: '계약유형', dataField: 'contracttype', dataType: 'code' },
				{ headerText: '계약업체', dataField: 'contractcompany', dataType: 'code' },
				{ headerText: '계약업체명', dataField: 'contractcompanyname' },
				{ headerText: 'FROM', dataField: 'fromvalidDt', dataType: 'date' },
				{ headerText: 'TO', dataField: 'tovalidDt', dataType: 'date' },
				{ headerText: '스캔예정량', dataField: 'serialorderqty', dataType: 'numeric', formatString: '#,##0.##' },
				{ headerText: '스캔량', dataField: 'serialinspectqty', dataType: 'numeric', formatString: '#,##0.##' },
				{ headerText: '스캔중량', dataField: 'serialscanweight', dataType: 'numeric', formatString: '#,##0.##' },
			],
		},

		// Hidden 컬럼들
		{ dataField: 'lottable01', headerText: 'lottable01', dataType: 'code', visible: false }, // lottable01
		{ dataField: 'duration', headerText: 'duration', dataType: 'code', visible: false }, // duration
		{ dataField: 'durationtype', headerText: 'durationtype', dataType: 'code', visible: false }, // durationtype
	];

	// 그리드 Props(상세목록 그리드)
	const gridProps3 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
	};

	// FooterLayout Props(상세목록 그리드)
	const footerLayout3 = [
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'purchaseqty',
			positionField: 'purchaseqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'shortageqty',
			positionField: 'shortageqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},

		{
			dataField: 'orderadjustqty',
			positionField: 'orderadjustqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'openqty',
			positionField: 'openqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmweight',
			positionField: 'confirmweight',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

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
			} else {
				ref.gridRef2.current.clearGridData();
			}
		}
	}, [props.data]);

	let prevRowIndex: any = null;
	useEffect(() => {
		ref.gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			const field = event.primeCell.dataField;
			if (ref.gridRef.current.getColumnItemByDataField(field)?.renderer?.type == 'DropDownListRenderer') {
				return;
			}

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell?.item?._$uid;
			// 상세코드 조회
			searchDtl();
		});
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRefFile?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn2} gridTitle={t('lbl.DETAIL_TAB')} totalCnt={props.totalCnt2} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
						</GridAutoHeight>
					</>,
				]}
			/>

			<AGrid className={'dp-none'}>
				<AUIGrid ref={ref.gridRef3} columnLayout={gridCol3} gridProps={gridProps3} footerLayout={footerLayout3} />
			</AGrid>
		</>
	);
});

export default DpInplanSNDetail;
