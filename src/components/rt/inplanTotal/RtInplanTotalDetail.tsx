/*
 ############################################################################
 # FiledataField	: RtInplanTotalDetail.tsx
 # Description		: 반품진행현황(Detail)
 # Author			: 공두경
 # Since			: 25.06.04
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
import { Tabs } from 'antd';
// Utils
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';
// API Call Function
import { apiGetDataExcelList, apiGetDetailList, apiGetSerialInfoList } from '@/api/rt/apiRtInplanTotal';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';

const { TabPane } = Tabs;

const RtInplanTotalDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
	ref.gridRef3 = useRef(null);
	ref.gridRef4 = useRef(null);
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);
	// 현재 탭 정보
	const [activeKey, setActiveKey] = useState('2');

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
			docno: selectedRow[0].docno,
			docline: selectedRow[0].docline,
			doctype: selectedRow[0].doctype,
		};

		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef2.current?.setGridData(gridData || []);
			//setTotalCnt(res.data.length);
			ref.gridRef2.current?.resize('100%', '100%');
			const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);

			// 구해진 칼럼 사이즈를 적용 시킴.
			// ref.gridRef2.current?.setColumnSizeList(colSizeList);
		});
	};

	const searchSerialInfo = () => {
		const selectedRow = ref.gridRef.current?.getSelectedRows();
		if (commUtil.isEmpty(selectedRow)) {
			ref.gridRef3.current?.setGridData([]);
			return;
		}
		const searchParams = props.form.getFieldsValue();
		const params = {
			dccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			docdt: selectedRow[0].docdt,
			doctype: selectedRow[0].doctype,
			sourcekey: selectedRow[0].sourcekey,
			sku: selectedRow[0].sku,
			docno: selectedRow[0].docno,
			vendoreturn: searchParams.vendoreturn,
			returntype: searchParams.returntype,
			channel: searchParams.channel,
			sotype: searchParams.sotype,
			ordertype: searchParams.ordertype,
			storagetype: searchParams.storagetype,
			blno: searchParams.blno,
			serialno: searchParams.serialno,
			custkey: searchParams.custkey,
			fromcustkey: searchParams.fromcustkey,
		};

		apiGetSerialInfoList(params).then(res => {
			const gridData = res.data;
			ref.gridRef3.current?.setGridData(gridData || []);
			//setTotalCnt(res.data.length);
			ref.gridRef3.current?.resize('100%', '100%');
			const colSizeList = ref.gridRef3.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef3.current?.setColumnSizeList(colSizeList);
		});
	};

	// 그리드 엑셀 다운로드 정보 조회
	const searchExcel = () => {
		const params = props.form.getFieldsValue();

		if (params.searchDateType == 'DOCDT') {
			params.fromSlipdt = params.docdtRange[0].format('YYYYMMDD');
			params.toSlipdt = params.docdtRange[1].format('YYYYMMDD');
		} else if (params.searchDateType == 'CONFIRMDT') {
			params.fromConfirmdate = params.docdtRange[0].format('YYYYMMDD');
			params.toConfirmdate = params.docdtRange[1].format('YYYYMMDD');
		}

		apiGetDataExcelList(params).then(res => {
			const gridData = res.data;
			ref.gridRef4.current?.setGridData(gridData || []);
			const colSizeList = ref.gridRef4.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef4.current?.setColumnSizeList(colSizeList);

			if (gridData.length > 0) {
				downloadExcel();
			} else {
				showAlert('', '엑셀다운로드 할 정보가 없습니다.');
			}
		});
	};

	// 그리드 엑셀 다운로드
	const downloadExcel = () => {
		const params = {
			fileName: '반품진행현황',
			exportWithStyle: true, // 스타일 적용 여부
			progressBar: true, // 진행바 표시 여부
		};
		ref.gridRef4.current?.exportToXlsxGrid(params);
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
			headerText: t('lbl.ORGANIZE'), //창고
			dataField: 'organize',
			dataType: 'code',
		},
		{
			headerText: t('lbl.ORGANIZENAME'), //창고명
			dataField: 'organizeName',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DOCNO_RT'), //고객주문번호
			dataField: 'docnoWd',
			dataType: 'code',
		},
		{
			headerText: t('lbl.SOURCECONFIRMDATE_RT'), //출고일자
			dataField: 'docdtWd',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: t('lbl.SOURCEKEY_RT'), //고객반품주문번호
			dataField: 'docno',
		},
		{
			headerText: t('lbl.DOCDT_RT'), //반품요청일자
			dataField: 'slipdt',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: t('lbl.POTYPE_RT'), //주문사유
			dataField: 'sotypename',
		},
		{
			headerText: t('lbl.STATUS_RT'), //진행상태
			dataField: 'statusname',
			dataType: 'code',
		},
		{
			headerText: t('lbl.RETURNCARNO'), //반품차량번호
			dataField: 'returncarno',
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
		},
		{
			headerText: t('lbl.SKUNAME'), //상품명칭
			dataField: 'skuname',
			dataType: 'string',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.PLANT'), //플랜트
			dataField: 'plantDescr',
			dataType: 'code',
		},
		{
			headerText: t('lbl.CHANNEL_DMD'), //저장유무
			dataField: 'channelname',
			dataType: 'code',
		},
		{
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataField: 'storagetypename',
			dataType: 'code',
		},
		{
			headerText: t('lbl.UOM_DP'), //구매단위
			dataField: 'uom',
			dataType: 'code',
		},
		{
			headerText: t('lbl.CUSTORDERQTY_RT'), //고객반품주문수량
			dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.RETURNQTY_RT'), //반품입고수량
			dataField: 'confirmqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.UNRETURNQTY_RT'), //미회수수량
			dataField: 'shortageqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.CONFIRMDATE_RT'), //반품확정일자
			dataField: 'confirmdate',
			dataType: 'date',
		},
		{
			headerText: t('lbl.PACKINGMETHOD'), //실물여부
			dataField: 'packingmethod',
			dataType: 'code',
		},
		{
			headerText: t('lbl.RETURNTYPE_RT'), //회수여부
			dataField: 'returntypename',
			dataType: 'code',
		},
		{
			headerText: t('lbl.NOTRECALLREASON_RT'), //미회수사유
			dataField: 'reasoncode',
		},
		{
			headerText: t('lbl.REASONMSG_RT'), //세부내역
			dataField: 'reasonmsg',
		},
		{
			headerText: t('lbl.REASONTYPE'), //귀책구분
			dataField: 'other01',
			dataType: 'code',
		},
		{
			headerText: t('lbl.BLNGDEPTCD'), //귀속구분
			dataField: 'blngdeptname',
			dataType: 'code',
		},
		{
			headerText: t('lbl.ORDERTYPE_RT'), //반품유형
			dataField: 'orderTypename',
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
			headerText: t('lbl.FROM_CUSTKEY_RT'), //관리처코드
			dataField: 'fromCustkey',
			dataType: 'code',
		},
		{
			headerText: t('lbl.FROM_CUSTNAME_RT'), //관리처명
			dataField: 'fromCustname',
			dataType: 'string',
		},
		{
			headerText: t('lbl.TO_VATNO'), //고객코드
			dataField: 'billtocustkey',
			dataType: 'code',
		},
		{
			headerText: t('lbl.TO_VATOWNER'), //고객명
			dataField: 'billtocustname',
			dataType: 'string',
		},
		{
			headerText: t('lbl.CLAIMDTLIDS'), //VoC(소)
			dataField: 'other03',
			dataType: 'code',
		},
		{
			headerText: t('lbl.CLAIMDTLID'), //VoC(세)
			dataField: 'other04',
			dataType: 'code',
		},
		{
			headerText: t('lbl.VENDORETURNYN'), //협력사반품
			dataField: 'vendoreturn',
			dataType: 'code',
		},
		{
			headerText: t('lbl.FROM_CUSTNAME_DP'), //협력사명
			dataField: 'custname',
			dataType: 'string',
		},
		{
			headerText: '반품요청일',
			dataField: 'startDt',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			minWidth: 100,
		},
		{
			headerText: '반품확정일',
			dataField: 'endDt',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			minWidth: 100,
		},
		{
			headerText: '반품수거일수',
			dataField: 'reCount',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
	];

	// 그리드 Props
	const gridProps = {
		// editable: false,
		// //autoGridHeight: true, // 자동 높이 조절
		// //Row Status 영역 여부
		// showStateColumn: true, // row 편집 여부
		// fillColumnSizeMode: false,
		// showFooter: true,
		// enableColumnResize: true,

		// rowStyleFunction 함수 정의
		// 이 함수는 각 행이 렌더링될 때마다 호출됩니다.
		rowStyleFunction: function (rowIndex: any, item: any) {
			// item은 현재 행의 데이터 객체입니다.
			//console.log(('rowIndex:' + rowIndex + ', delYn:' + item.delYn);
			if (item?.delYn == 'Y') {
				return 'color-danger'; // CSS 클래스 이름 반환
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
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'shortageqty',
			positionField: 'shortageqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
	];

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
	//그리드 컬럼(클레임내역 그리드)
	const gridCol2 = [
		{
			headerText: t('lbl.CLAIMNO'),
			/*클레임번호*/ dataField: 'sapclaimno',
			dataType: 'code',
			width: 100,
		},
		{
			headerText: t('lbl.SKU'),
			/*상품코드*/ dataField: 'sku',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			width: 100,
		},
		{
			headerText: t('lbl.SKUNAME'),
			/*상품명칭*/ dataField: 'skuname',
			dataType: 'string',
			filter: {
				showIcon: true,
			},
			width: 500,
		},
		{
			headerText: t('lbl.CLAIMMSG') /*세부내역*/,
			dataField: 'memo',
			// wrapText: true,
			style: 'memo-cell',
			// width: 347,
		},
		{
			headerText: t('lbl.WRITER'),
			/*작성자*/ dataField: 'writer',
			dataType: 'code',
			width: 100,
		},
		{
			headerText: t('lbl.WRITERDATE'),
			/*작성일자*/ dataField: 'writedate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			width: 100,
		},
		{
			headerText: t('lbl.WRITETIME'),
			/*작성시간*/ dataField: 'writetime',
			dataType: 'code',
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return value.substring(0, 2) + ':' + value.substring(2, 4) + ':' + value.substring(4, 6); // 시간 형식으로 변환
			},
			width: 100,
		},
	];

	// 그리드 Props(클레임내역 그리드)
	const gridProps2 = {
		editable: false,
		wordWrap: true,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
	};

	// FooterLayout Props(클레임내역 그리드)
	const footerLayout2 = [{}];

	//그리드 컬럼(이력정보 그리드)
	const gridCol3 = [
		{
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'), //상품코드
					dataType: 'code',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNM'), //상품명칭
					dataType: 'string',
					width: 300,
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{ headerText: t('lbl.PLANT'), /*플랜트*/ dataField: 'plantDescr', dataType: 'code' },
		{ headerText: t('lbl.UOM_RT'), /*단위*/ dataField: 'uom', dataType: 'code' },
		{ headerText: t('lbl.CHANNEL_DMD'), /*저장유무*/ dataField: 'channelname', dataType: 'code' },
		{ headerText: t('lbl.STORAGETYPE'), /*저장조건*/ dataField: 'storagetypename', dataType: 'code' },
		{
			headerText: t('lbl.CALQTY'), //
			children: [
				{
					dataField: 'avgweight',
					headerText: t('lbl.AVGWEIGHT'), //평균중량
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
				{
					dataField: 'calorderbox',
					headerText: t('lbl.CALORDERBOX'), //환산주문박스
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
				{
					dataField: 'calconfirmbox',
					headerText: t('lbl.CALCONFIRMBOX'), //환산확정박스
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
				{
					dataField: 'realbox',
					headerText: t('lbl.REALBOX'), //실박스
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
			],
		},
		{
			headerText: t('lbl.CUSTORDERQTY_RT'),
			/*고객반품주문수량*/ dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			headerText: t('lbl.RETURNQTY_RT'),
			/*반품입고수량*/ dataField: 'confirmqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			headerText: '기준일(제조)',
			dataField: 'lotManufacture',
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				if (columnIndex) {
					ref.gridRef3?.current?.removeEditClass(columnIndex);
				}
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
			},
		},
		{
			headerText: '기준일(소비)',
			dataField: 'lotExpire',
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				if (columnIndex) {
					ref.gridRef3?.current?.removeEditClass(columnIndex);
				}
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
			},
		},
		{
			headerText: t('lbl.DURATION_TERM2'), //소비기간(잔여/전체)
			dataField: 'durationTerm',
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},

		{
			headerText: t('lbl.STOCKID'), // 재고ID
			dataField: 'stockid',
			width: 100,
			editable: false,
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
					dataField: 'stockid',
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
					dataField: 'contractcompany', //계약업체
					headerText: t('lbl.CONTRACTCOMPANY'),
					dataType: 'code',
				},
				{
					dataField: 'contractcompanyname', // 계약업체명
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataType: 'code',
				},
				{
					dataField: 'fromvaliddt',
					headerText: 'FROM',
					dataType: 'date',
				},
				{
					dataField: 'tovaliddt',
					headerText: 'TO',
					dataType: 'date',
				},
				{
					dataField: 'serialorderwty',
					headerText: t('lbl.SERIALORDERQTY'), // 스캔예정량
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
				{
					dataField: 'serialinspectqty',
					headerText: t('lbl.SERIALINSPECTQTY'), //스캔량
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
				{
					dataField: 'serialscanweight',
					headerText: t('lbl.SERIALSCANWEIGHT'), //스캔중량
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
			],
		},
	];

	// 그리드 Props(이력정보 그리드)
	const gridProps3 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
	};

	// FooterLayout Props(이력정보 그리드)
	const footerLayout3 = [
		{
			labelText: '합계',
			positionField: 'sku',
		},
		{
			dataField: 'calorderbox',
			positionField: 'calorderbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'calconfirmbox',
			positionField: 'calconfirmbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'realbox',
			positionField: 'realbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
	];

	//그리드 컬럼(엑셀 그리드)
	const gridCol4 = [
		{
			headerText: t('lbl.DCCODE'), //물류센터
			dataField: 'dccode',
			dataType: 'code',
		},
		{
			headerText: t('lbl.ORGANIZENAME'), //창고명
			dataField: 'organizename',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DOCNO_RT'), //고객주문번호
			dataField: 'docnoWd',
			dataType: 'code',
		},
		{
			headerText: t('lbl.SOURCECONFIRMDATE_RT'), //출고일자
			dataField: 'docdtWd',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: t('lbl.SOURCEKEY_RT'), //고객반품주문번호
			dataField: 'docno',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DOCDT_RT'), //반품요청일자
			dataField: 'slipdt',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: t('lbl.POTYPE_RT'), //주문사유
			dataField: 'sotypename',
			dataType: 'code',
		},
		{
			headerText: t('lbl.STATUS_RT'), //진행상태
			dataField: 'statusname',
			dataType: 'code',
		},
		{
			headerText: t('lbl.RETURNCARNO'), //반품차량번호
			dataField: 'returncarno',
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
		},
		{
			headerText: t('lbl.SKUNAME'), //상품명칭
			dataField: 'skuname',
			dataType: 'string',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.CHANNEL_DMD'), //저장유무
			dataField: 'channelname',
			dataType: 'code',
		},
		{
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataField: 'storagetypename',
			dataType: 'code',
		},
		{
			headerText: t('lbl.UOM_DP'), //구매단위
			dataField: 'uom',
			dataType: 'code',
		},
		{
			headerText: t('lbl.CALQTY'), //환산수량
			children: [
				{
					dataField: 'avgweight',
					headerText: t('lbl.AVGWEIGHT'), //평균중량
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
				{
					dataField: 'calorderbox',
					headerText: t('lbl.CALORDERBOX'), //환산주문박스
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
				{
					dataField: 'calconfirmbox',
					headerText: t('lbl.CALCONFIRMBOX'), //환산확정박스
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
				{
					dataField: 'realbox',
					headerText: t('lbl.REALBOX'), //실박스
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
			],
		},
		{
			headerText: t('lbl.CUSTORDERQTY_RT'), //고객반품주문수량
			dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.RETURNQTY_RT'), //반품입고수량
			dataField: 'confirmqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.UNRETURNQTY_RT'), //미회수수량
			dataField: 'shortageqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.CONFIRMDATE_RT'), //반품확정일자
			dataField: 'confirmdate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: t('lbl.PACKINGMETHOD'), //실물여부
			dataField: 'packingmethod',
			dataType: 'code',
		},
		{
			headerText: t('lbl.RETURNTYPE_RT'), //회수여부
			dataField: 'returntypename',
			dataType: 'code',
		},
		{
			headerText: t('lbl.NOTRECALLREASON_RT'), //미회수사유
			dataField: 'reasoncode',
		},
		{
			headerText: t('lbl.REASONMSG_RT'), //세부내역
			dataField: 'reasonmsg',
		},
		{
			headerText: t('lbl.REASONTYPE'), //귀책구분
			dataField: 'other01',
			dataType: 'code',
		},
		{
			headerText: t('lbl.BLNGDEPTCD'), //귀속구분
			dataField: 'blngDeptName',
			dataType: 'code',
		},
		{
			headerText: t('lbl.SALEGROUP'), //영업조직
			dataField: 'salegroup',
			dataType: 'code',
		},
		{
			headerText: t('lbl.SALEDEPARTMENT'), //사업장
			dataField: 'saledepartment',
			dataType: 'code',
		},
		{
			headerText: t('lbl.CUSTGROUP'), //영업그룹
			dataField: 'custgroup',
			dataType: 'code',
		},
		{
			headerText: t('lbl.FROM_CUSTKEY_RT'), //고객코드
			dataField: 'fromCustKey',
			dataType: 'code',
		},
		{
			headerText: t('lbl.FROM_CUSTNAME_RT'), //고객명
			dataField: 'fromCustName',
			dataType: 'string',
		},
		{
			headerText: t('lbl.CLAIMDTLIDS'), //VoC(소)
			dataField: 'other03',
			dataType: 'code',
		},
		{
			headerText: t('lbl.CLAIMDTLID'), //VoC(세)
			dataField: 'other04',
			dataType: 'code',
		},
		{
			headerText: t('lbl.VENDORETURNYN'), //협력사반품
			dataField: 'vendorreturn',
			dataType: 'code',
		},
		{
			headerText: t('lbl.FROM_CUSTNAME_DP'), //협력사명
			dataField: 'custname',
			dataType: 'string',
		},
		{
			headerText: t('lbl.IF_AUDIT_FILE_SAP'), //SAP실적전송
			dataField: 'ifAuditFile',
			dataType: 'code',
		},
		{
			headerText: t('lbl.IF_SEND_FILE_SAP'), //전송시간
			dataField: 'ifSendFile',
			dataType: 'date',
		},
		{
			headerText: t('lbl.CLAIMNO'), //SAP클레임번호
			dataField: 'sapclaimno',
			dataType: 'code',
		},
		{
			headerText: t('lbl.SEQ'), //순번
			dataField: 'claimseq',
			dataType: 'code',
		},
		{
			headerText: t('lbl.CLAIMMSG'), //세부내역
			dataField: 'memo',
		},
		{
			headerText: t('lbl.WRITER'), //작성자
			dataField: 'writer',
			dataType: 'code',
		},
		{
			headerText: t('lbl.WRITERDATE'), //작성일자
			dataField: 'writedate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: t('lbl.WRITETIME'), //작성시간
			dataField: 'writetime',
			dataType: 'date',
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return value.substring(0, 2) + ':' + value.substring(2, 4) + ':' + value.substring(4, 6); // 시간 형식으로 변환
			},
		},
	];

	// 그리드 Props(엑셀 그리드)
	const gridProps4 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
	};

	// FooterLayout Props(엑셀 그리드)
	const footerLayout4 = [
		{
			dataField: 'calorderbox',
			positionField: 'calorderbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'calconfirmbox',
			positionField: 'calconfirmbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'realbox',
			positionField: 'realbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'shortageqty',
			positionField: 'shortageqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
		},
	];

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(
				props.data.map((item: any) => ({
					...item,
					other03: item.other03 == 'UNKNOWN' ? '' : item.other03,
					other04: item.other04 == 'UNKNOWN' ? '' : item.other04,
				})),
			);
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
			setActiveKey('2');
			searchDtl();
		});
	}, []);

	useEffect(() => {
		ref?.gridRef2?.current?.resize('100%', '100%');
		ref?.gridRef3?.current?.resize('100%', '100%');
		if (activeKey === '1') {
			searchSerialInfo();
		}
	}, [activeKey]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
		ref.gridRef3?.current?.resize?.('100%', '100%');
		ref.gridRef4?.current?.resize?.('100%', '100%');
	}, []);

	// *  탭 목록
	const tabItemList = [
		{
			key: '1',
			label: '이력정보',
			children: (
				<GridAutoHeight id="rtInplanTotal-history-grid" style={{ marginTop: '15px' }}>
					<AUIGrid ref={ref.gridRef3} columnLayout={gridCol3} gridProps={gridProps3} footerLayout={footerLayout3} />
				</GridAutoHeight>
			),
		},
		{
			key: '2',
			label: '클레임내역',
			children: (
				<GridAutoHeight id="rtInplanTotal-claim-grid" style={{ marginTop: '15px' }}>
					<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
				</GridAutoHeight>
			),
		},
	];

	return (
		<>
			{/* 그리드 영역 */}
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ marginTop: '15px' }}>
							<GridTopBtn gridBtn={gridBtn} gridTitle="반품진행목록" totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight id="rtInplanTotal-grid">
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<TabsArray
							activeKey={activeKey}
							onChange={key => setActiveKey(key)}
							items={tabItemList.map(item => {
								return {
									label: item.label,
									key: item.key,
									children: item.children,
								};
							})}
						/>
					</>,
				]}
			/>
			<>
				<AGrid className="dp-none">
					<GridTopBtn gridBtn={gridBtn} gridTitle="반품진행현황" style={{ marginTop: '15px' }} />
				</AGrid>
				<div id="dp-none-grid" className="dp-none">
					<AUIGrid ref={ref.gridRef4} columnLayout={gridCol4} gridProps={gridProps4} footerLayout={footerLayout4} />
				</div>
			</>
		</>
	);
});

export default RtInplanTotalDetail;
