/*
 ############################################################################
 # FiledataField	: WdInplanSNDetail.tsx
 # Description		: 이력상품출고현황(Detail)
 # Author			: 공두경
 # Since			: 25.06.10
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
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert } from '@/util/MessageUtil';
// API Call Function
import { apiGetDataExcelList, apiGetDetailList } from '@/api/wd/apiWdInplanSN';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';

const WdInplanSNDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
	ref.gridRef3 = useRef(null);
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	const searchDtl = () => {
		const selectedRow = ref.gridRef.current.getSelectedRows();
		const searchParams = props.form.getFieldsValue();
		const params = {
			dccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			docdt: selectedRow[0].slipdt,
			docno: selectedRow[0].docno,
			doctype: selectedRow[0].doctype,
			deliverygroup: selectedRow[0].deliverygroup,
			carno: selectedRow[0].carno,
			toCustkey: searchParams.toCustkey,
			sku: searchParams.sku,
			status: searchParams.status,
			channel: searchParams.channel,
			storagetype: searchParams.storagetype,
			serialno: searchParams.serialno,
			blno: searchParams.blno,
			contractcompany: searchParams.contractcompany,
			delYn: searchParams.delYn,
			searchserial: '',
		};
		if (
			!commUtil.isNull(params.blno) ||
			!commUtil.isNull(params.serialno) ||
			!commUtil.isNull(params.contractcompany)
		) {
			params.searchserial = 'Y';
		}

		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef2.current?.setGridData(gridData);
			//setTotalCnt(res.data.length);
			const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current?.setColumnSizeList(colSizeList);
		});
	};

	// 그리드 엑셀 다운로드 정보 조회
	const searchExcel = () => {
		const params = props.form.getFieldsValue();

		if (commUtil.isNull(params.slipdtRange)) {
			showAlert('', '출고일자를 선택해주세요.');
			return;
		}
		if (commUtil.isNull(params.slipdtRange[0]) || commUtil.isNull(params.slipdtRange[1])) {
			showAlert('', '출고일자를 선택해주세요.');
			return;
		}

		params.fromSlipdt = params.slipdtRange[0].format('YYYYMMDD');
		params.toSlipdt = params.slipdtRange[1].format('YYYYMMDD');

		if (dateUtil.getDaysDiff(params.fromSlipdt, params.toSlipdt) > 31) {
			showAlert('', '최대 한 달 간의 데이터만\n조회 가능합니다.');
			return;
		}
		if (
			!commUtil.isNull(params.blno) ||
			!commUtil.isNull(params.serialno) ||
			!commUtil.isNull(params.contractcompany)
		) {
			params.searchserial = 'Y';
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
		const result: any = {};
		// gridCol 배열을 순회하면서 dataField와 colsize를 매칭
		/*
		for (let i = 0; i < gridCol.length; i++) {
			const dataField = gridCol[i].dataField;
			const size = colSizeList[i];
			if (dataField) {
				result[dataField] = size;
			}
		}*/
		collectColumnSizes(gridCol3, colSizeList, result);

		const params = {
			fileName: '이력상품출고현황',
			//columnSizeOfDataField: result,
			exportWithStyle: true, // 스타일 적용 여부
			progressBar: true,
		};
		ref.gridRef3.current?.exportToXlsxGrid(params);
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.DCCODE'), //물류센터
			dataField: 'dccode',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DCNAME'), //물류센터
			dataField: 'dccodeName',
		},
		{
			headerText: t('lbl.ORGANIZE'), //창고
			dataField: 'organize',
			dataType: 'code',
		},
		{
			headerText: t('lbl.ORGANIZENAME'), //창고명
			dataField: 'organizeName',
		},
		{
			headerText: t('lbl.DOCDT_WD'), //출고일자
			dataField: 'slipdt',
			dataType: 'date',
			//formatstring: 'yyyy-mm-dd',
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8); // 날짜 형식으로 변환
			},
		},
		{
			headerText: t('lbl.ORDERTYPE_WD'), //주문유형
			dataField: 'ordertype',
			dataType: 'code',
		},
		{
			headerText: t('lbl.POTYPE_WD'), //주문사유
			dataField: 'potype',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DOCNO_WD'), //주문번호
			dataField: 'docno',
			dataType: 'code',
		},
		{
			headerText: t('lbl.SALEGROUP'), //영업조직
			dataField: 'saleorganize',
		},
		{
			headerText: t('lbl.SALEDEPARTMENT'), //사업장
			dataField: 'saledepartment',
		},
		{
			headerText: t('lbl.CUSTGROUP'), //영업그룹
			dataField: 'salegroup',
		},
		{
			headerText: t('lbl.TO_VATNO'), //판매처코드
			dataField: 'toVatno',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.TO_VATOWNER'), //판매처명
			dataField: 'toVatowner',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.TO_CUSTKEY_WD'), //관리처코드
			dataField: 'toCustKey',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.toCustKey,
						},
						'cust',
					);
				},
			},
			dataType: 'code',
		},
		{
			headerText: t('lbl.TO_CUSTNAME_WD'), //관리처명
			dataField: 'toCustName',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.STATUS_WD'), //진행상태
			dataField: 'status',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DELIVERYGROUP'), //POP번호
			dataField: 'deliverygroup',
			dataType: 'code',
		},
		{
			headerText: t('lbl.CARNO'), //차량번호
			dataField: 'carno',
			dataType: 'code',
		},
	];

	// 그리드 Props
	const gridProps = useMemo(
		() => ({
			editable: false,
			//autoGridHeight: true, // 자동 높이 조절
			//Row Status 영역 여부
			showStateColumn: false, // row 편집 여부
			enableColumnResize: true, // 열 사이즈 조정 여부
			fillColumnSizeMode: false,
			showFooter: false,
			// rowStyleFunction 함수 정의
			// 이 함수는 각 행이 렌더링될 때마다 호출됩니다.
			rowStyleFunction: function (rowIndex: any, item: any) {
				// item은 현재 행의 데이터 객체입니다.
				//console.log(('rowIndex:' + rowIndex + ', delYn:' + item.delYn);
				if (item.delYn != 'N') {
					return 'color-danger'; // CSS 클래스 이름 반환
				}
				return ''; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
			},
		}),
		[],
	);

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelDownload', // excelDownload
				callBackFn: searchExcel,
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
			},
		],
	};

	//그리드 컬럼(상세목록 그리드)
	const gridCol2 = [
		{ headerText: t('lbl.DOCLINE'), dataField: 'docline', dataType: 'code' }, //품목번호
		{
			headerText: t('lbl.SKU'), //상품코드
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
			headerText: t('lbl.SKUNAME'),
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
		}, //상품명칭
		{ headerText: t('lbl.COUNTRYOFORIGIN'), dataField: 'countryoforigin', dataType: 'code' }, //원산국
		{ headerText: t('lbl.DELIVERYTYPE'), dataField: 'deliverytype', dataType: 'code' }, //배송수단
		{ headerText: t('lbl.SERIALMGTYN'), dataField: 'serialyn', dataType: 'code' }, //이력관리대상
		{ headerText: t('lbl.SKUNOTFIXEDAMOUNTYN'), dataField: 'line01', dataType: 'code' }, //비정량여부
		{ headerText: t('lbl.BEFORESHORTAGEPLANYN'), dataField: 'beforeshortageplanyn', dataType: 'code' }, //사전주문조정의뢰여부
		{ headerText: t('lbl.PLANT'), dataField: 'plantDescr', dataType: 'code' }, //플랜트
		{ headerText: t('lbl.CHANNEL_DMD'), dataField: 'channel', dataType: 'code' }, //저장유무
		{ headerText: t('lbl.STORAGETYPE'), dataField: 'storagetype', dataType: 'code' }, //저장조건
		{ headerText: t('lbl.ORDERQTY_WD'), dataField: 'orderqty', dataType: 'numeric', formatString: '#,##0.##' }, //주문수량
		{ headerText: t('lbl.DISTRIBUTEQTY_WD'), dataField: 'processqty', dataType: 'numeric', formatString: '#,##0.##' }, //분배량
		{ headerText: t('lbl.WORKQTY_WD'), dataField: 'workqty', dataType: 'numeric', formatString: '#,##0.##' }, //피킹량
		{ headerText: t('lbl.INSPECTQTY_WD'), dataField: 'inspectqty', dataType: 'numeric', formatString: '#,##0.##' }, //출고검수량
		{ headerText: t('lbl.CONFIRMQTY_WD'), dataField: 'confirmqty', dataType: 'numeric', formatString: '#,##0.##' }, //출고수량
		{ headerText: t('lbl.UOM_SO'), dataField: 'uom', dataType: 'code' }, //판매단위
		{
			headerText: t('lbl.CONFIRMWEIGHT_WD'),
			dataField: 'confirmweight',
			dataType: 'numeric',
			formatString: '#,##0.##',
		}, //출고중량
		{ headerText: t('lbl.STATUS_WD'), dataField: 'status', dataType: 'code' }, //진행상태
		{ headerText: t('lbl.MANUFACTUREDT'), dataField: 'manufacturedt', dataType: 'date' }, //제조일자
		{ headerText: t('lbl.EXPIREDT'), dataField: 'expiredt', dataType: 'date' }, //소비일자
		{ headerText: t('lbl.DURATION_TERM2'), dataField: 'durationTerm', dataType: 'code' }, //소비기간(잔여/전체)
		{
			headerText: t('lbl.SERIALINFO'), //상품이력정보
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'), //이력번호
					dataType: 'code',
				},
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'), //바코드
					dataType: 'code',
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'), //B/L번호
					dataType: 'code',
				},
				{
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT'), //도축일자
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'), //도축장
				},
				{
					dataField: 'contracttype', //계약유형
					headerText: t('lbl.CONTRACTTYPE'),
					dataType: 'code',
				},
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'), //계약업체
					dataType: 'code',
				},
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'), // 계약업체명
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'), // 유효일자(FROM)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'), // 유효일자(TO)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
				},
				{
					dataField: 'serialorderqty',
					headerText: t('lbl.SERIALORDERQTY'), // 스캔예정량
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'serialinspectqty',
					headerText: t('lbl.SERIALINSPECTQTY'), //스캔량
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'serialscanweight',
					headerText: t('lbl.SERIALSCANWEIGHT'), //스캔중량
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
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
		// rowStyleFunction 함수 정의
		// 이 함수는 각 행이 렌더링될 때마다 호출됩니다.
		rowStyleFunction: function (rowIndex: any, item: any) {
			// item은 현재 행의 데이터 객체입니다.
			//console.log(('rowIndex:' + rowIndex + ', delYn:' + item.delYn);
			if (item.delYn != 'N') {
				return 'color-danger'; // CSS 클래스 이름 반환
			}
			return ''; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
		},
	};

	// FooterLayout Props(상세목록 그리드)
	const footerLayout2 = [
		{
			labelText: '합계',
			positionField: 'docline',
		},
		{
			dataField: 'serialorderqty',
			positionField: 'serialorderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'serialinspectqty',
			positionField: 'serialinspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'serialscanweight',
			positionField: 'serialscanweight',
			operation: 'SUM',
			formatString: '#,##0.##',
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
		{
			headerText: t('lbl.DCCODE'), //물류센터
			dataField: 'dccode',
			dataType: 'code',
		},
		{
			headerText: t('lbl.ORGANIZE'), //창고
			dataField: 'organize',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DOCDT_WD'), //출고일자
			dataField: 'slipdt',
			dataType: 'date',
		},
		{
			headerText: t('lbl.ORDERTYPE_WD'), //주문유형
			dataField: 'ordertype',
			dataType: 'code',
		},
		{
			headerText: t('lbl.POTYPE_WD'), //주문사유
			dataField: 'potype',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DOCNO_WD'), //주문번호
			dataField: 'docno',
			dataType: 'code',
		},
		{
			headerText: t('lbl.SALEGROUP'), //영업조직
			dataField: 'saleorganize',
		},
		{
			headerText: t('lbl.SALEDEPARTMENT'), //시업장
			dataField: 'saledepartment',
		},
		{
			headerText: t('lbl.CUSTGROUP'), //영업그룹
			dataField: 'salegroup',
		},
		{
			headerText: t('lbl.TO_VATNO'), //판매처코드
			dataField: 'toVatno',
			dataType: 'code',
		},
		{
			headerText: t('lbl.TO_VATOWNER'), //판매처명
			dataField: 'toVatowner',
		},
		{
			headerText: t('lbl.TO_CUSTKEY_WD'), //관리처코드
			dataField: 'toCustkey',
			dataType: 'code',
		},
		{
			headerText: t('lbl.TO_CUSTNAME_WD'), //관리처명
			dataField: 'toCustname',
		},
		{
			headerText: t('lbl.STATUS_WD'), //진행상태
			dataField: 'status',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DELIVERYGROUP'), //POP번호
			dataField: 'deliverygroup',
			dataType: 'code',
		},
		{
			headerText: t('lbl.CARNO'), //차량번호
			dataField: 'carno',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DOCLINE'), //품목번호
			dataField: 'docline',
			dataType: 'code',
		},
		{
			headerText: t('lbl.SKU'), //상품코드
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
			headerText: t('lbl.SKUNAME'), //상품명칭
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.COUNTRYOFORIGIN'), //원산국
			dataField: 'countryoforigin',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DELIVERYTYPE'), //배송수단
			dataField: 'deliverytype',
			dataType: 'code',
		},
		{
			headerText: t('lbl.SERIALMGTYN'), //이력관리대상
			dataField: 'serialyn',
			dataType: 'code',
		},
		{
			headerText: t('lbl.SKUNOTFIXEDAMOUNTYN'), //비정량여부
			dataField: 'line01',
			dataType: 'code',
		},
		{
			headerText: t('lbl.BEFORESHORTAGEPLANYN'), //사전주문조정의뢰여부
			dataField: 'beforeshortageplanyn',
			dataType: 'code',
		},
		{
			headerText: t('lbl.PLANT'), //플랜트
			dataField: 'plantDescr',
			dataType: 'code',
		},
		{
			headerText: t('lbl.CHANNEL_DMD'), //저장유무
			dataField: 'channel',
			dataType: 'code',
		},
		{
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataField: 'storagetype',
			dataType: 'code',
		},
		{
			headerText: t('lbl.ORDERQTY_WD'), //주문수량
			dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.DISTRIBUTEQTY_WD'), //분배량
			dataField: 'processqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.WORKQTY_WD'), //피킹량
			dataField: 'workqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.INSPECTQTY_WD'), //출고검수량
			dataField: 'inspectqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.CONFIRMQTY_WD'), //출고수량
			dataField: 'confirmqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.UOM_SO'), //판매단위
			dataField: 'uom',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.CONFIRMWEIGHT_WD'), //출고중량
			dataField: 'confirmweight',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.STATUS_WD'), //진행상태
			dataField: 'status',
			dataType: 'code',
		},
		{
			headerText: t('lbl.LOTTABLE06'), //기준일(소비,제조)
			dataField: 'lottable01',
			dataType: 'date',
		},
		{
			headerText: t('lbl.DURATION_TERM2'), //소비기간(잔여/전체)
			dataField: 'durationTerm',
			dataType: 'code',
		},
		{
			headerText: t('lbl.SERIALINFO'), //상품이력정보
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'), //이력번호
					dataType: 'code',
				},
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'),
					dataType: 'code',
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'), //바코드
					dataType: 'code',
				},
				{
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT'), //도축일자
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'), //도축장
				},
				{
					dataField: 'contracttype', //계약유형
					headerText: t('lbl.CONTRACTTYPE'),
					dataType: 'code',
				},
				{
					dataField: 'contractcompany', //계약업체
					headerText: t('lbl.CONTRACTCOMPANY'),
				},
				{
					dataField: 'contractcompanyname', // 계약업체명
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'), // 유효일자(FROM)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'), // 유효일자(TO)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
				},
				{
					dataField: 'serialorderqty',
					headerText: t('lbl.SERIALORDERQTY'), // 스캔예정량
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'serialinspectqty',
					headerText: t('lbl.SERIALINSPECTQTY'), //스캔량
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'serialscanweight',
					headerText: t('lbl.SERIALSCANWEIGHT'), //스캔중량
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
			],
		},
	];

	// 그리드 Props(상세목록 그리드)
	const gridProps3 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		// rowStyleFunction 함수 정의
		// 이 함수는 각 행이 렌더링될 때마다 호출됩니다.
		rowStyleFunction: function (rowIndex: any, item: any) {
			// item은 현재 행의 데이터 객체입니다.
			//console.log(('rowIndex:' + rowIndex + ', delYn:' + item.delYn);
			if (item.delYn != 'N') {
				return 'color-danger'; // CSS 클래스 이름 반환
			}
			return ''; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
		},
	};

	// FooterLayout Props(상세목록 그리드)
	const footerLayout3 = [
		{
			dataField: 'serialorderqty',
			positionField: 'serialorderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'serialinspectqty',
			positionField: 'serialinspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'serialscanweight',
			positionField: 'serialscanweight',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
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
			}
		}
	}, [props.data]);

	let prevRowItem: any = null;
	useEffect(() => {
		ref.gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row의 item이 다를 경우에만 검색
			if (event.primeCell.item === prevRowItem) return;

			// 이전 행 item 갱신
			prevRowItem = event.primeCell.item;

			// 상세코드 조회
			searchDtl();
		});
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef2.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn} gridTitle="이력상품출고목록" totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn2} gridTitle="이력상품출고상세" />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
						</GridAutoHeight>
					</>,
				]}
			/>

			<AGrid className="dp-none">
				<GridTopBtn gridBtn={gridBtn2} gridTitle="이력상품출고현황" />
				<AUIGrid ref={ref.gridRef3} columnLayout={gridCol3} gridProps={gridProps3} footerLayout={footerLayout3} />
			</AGrid>
		</>
	);
});

export default WdInplanSNDetail;
