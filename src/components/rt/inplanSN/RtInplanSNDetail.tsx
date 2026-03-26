/*
 ############################################################################
 # FiledataField	: RtInplanSNDetail.tsx
 # Description		: 이력상품반품현황(Detail)
 # Author			: 공두경
 # Since			: 25.05.28
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
import { showAlert } from '@/util/MessageUtil';
// API Call Function
import { apiGetDataExcelList, apiGetDetailList } from '@/api/rt/apiRtInplanSN';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';

const DetailSampleCarDriver = forwardRef((props: any, ref: any) => {
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
			docdt: selectedRow[0].docdt,
			docno: selectedRow[0].docno,
			docline: selectedRow[0].docline,
			sourcekey: selectedRow[0].sourcekey,
			doctype: selectedRow[0].doctype,
			sku: selectedRow[0].sku,
			blno: searchParams.blno,
			serialno: searchParams.serialno,
			vendoreturn: searchParams.vendoreturn,
			returntype: searchParams.returntype,
			channel: searchParams.channel,
			potype: searchParams.potype,
			ordertype: searchParams.ordertype,
			storagetype: searchParams.storagetype,
			custkey: searchParams.custkey,
		};

		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef2.current?.setGridData(gridData);
			const colSizeList = ref.gridRef2.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current.setColumnSizeList(colSizeList);
		});
	};

	/**
	 *
	 * @param cols
	 * @param result
	 * @param idx
	 */
	function collectColumnSizes(cols: any[], result: any, idx = { i: 0 }) {
		for (const col of cols) {
			if (col.children) {
				collectColumnSizes(col.children, result, idx);
			} else if (col.dataField) {
				// dataField를 항상 문자열로 저장
				result[String(idx.i)] = String(col.style);
				idx.i++;
			}
		}
	}

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
			ref.gridRef3.current?.setGridData(gridData);
			//ref.gridRef3.current?.changeColumnLayoutData(gridCol3);
			const colSizeList = ref.gridRef3.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef3.current.setColumnSizeList(colSizeList);

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
			fileName: '이력상품반품현황',
			exportWithStyle: true, // 스타일 적용 여부
			progressBar: true, // 진행바 표시 여부
		};
		ref.gridRef3.current?.exportToXlsxGrid(params);
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'organizename',
			headerText: t('lbl.ORGANIZENAME'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sourcekey',
			headerText: t('lbl.DOCNO_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'docdtWd',
			headerText: t('lbl.SOURCECONFIRMDATE_RT'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'docno',
			headerText: t('lbl.SOURCEKEY_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'slipdt',
			headerText: t('lbl.DOCDT_RT'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'potypename',
			headerText: t('lbl.POTYPE_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'statusname',
			headerText: t('lbl.STATUS_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'returncarno',
			headerText: t('lbl.RETURNCARNO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
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
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'channel',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.CUSTORDERQTY_RT'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.RETURNQTY_RT'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'confirmdate',
			headerText: t('lbl.RETURNDATE_RT'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'packingmethod',
			headerText: t('lbl.PACKINGMETHOD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'returtypenname',
			headerText: t('lbl.RETURNTYPE_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'reasoncode',
			headerText: t('lbl.NOTRECALLREASON_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'reasonmsg',
			headerText: t('lbl.REASONMSG_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'other01',
			headerText: t('lbl.REASONTYPE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'blngdeptname',
			headerText: t('lbl.BLNGDEPTCD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'ordertypename',
			headerText: t('lbl.ORDERTYPE_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'salegroup',
			headerText: t('lbl.SALEGROUP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'saledepartment',
			headerText: t('lbl.SALEDEPARTMENT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'custgroup',
			headerText: t('lbl.CUSTGROUP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'fromCustkey',
			headerText: t('lbl.FROM_VATNO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'fromCustname',
			headerText: t('lbl.FROM_VATOWNER'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'other03',
			headerText: t('lbl.CLAIMDTLIDS'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'other04',
			headerText: t('lbl.CLAIMDTLID'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'vendoreturn',
			headerText: t('lbl.VENDORETURNYN'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'custname',
			headerText: t('lbl.FROM_CUSTNAME_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			manager: 'addwho',
			editable: false,
		},
		{
			dataField: 'editwho',
			headerText: t('확정자'),
			dataType: 'code',
			editable: false,
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

	//그리드 컬럼(상세목록 그리드)
	const gridCol2 = [
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'), // 상품코드
					dataType: 'code',
					filter: {
						showIcon: true,
					},
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
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNM'), // 상품명칭
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
		{ headerText: t('lbl.CHANNEL_DMD'), /*저장유무*/ dataField: 'channel', dataType: 'code' },
		{ headerText: t('lbl.STORAGETYPE'), /*저장조건*/ dataField: 'storagetype', dataType: 'code' },
		{
			headerText: t('lbl.CALQTY'), //
			children: [
				{
					dataField: 'avgweight',
					headerText: t('lbl.AVGWEIGHT'), //평균중량
					dataType: 'numeric',
				},
				{
					dataField: 'calorderbox',
					headerText: t('lbl.CALORDERBOX'), //환산주문박스
					dataType: 'numeric',
				},
				{
					dataField: 'calconfirmbox',
					headerText: t('lbl.CALCONFIRMBOX'), //환산확정박스
					dataType: 'numeric',
				},
				{
					dataField: 'realbox',
					headerText: t('lbl.REALBOX'), //실박스
					dataType: 'numeric',
				},
			],
		},
		{
			headerText: t('lbl.CUSTORDERQTY_RT'),
			/*고객반품주문수량*/ dataField: 'orderqty',
			dataType: 'numeric',
			style: 'right',
		},
		{
			headerText: t('lbl.RETURNQTY_RT'),
			/*반품입고수량*/ dataField: 'confirmqty',
			dataType: 'numeric',
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
				ref.gridRef2?.current?.removeEditClass(columnIndex);
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
				ref.gridRef2?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
			},
		},
		{
			headerText: t('lbl.DURATION_TERM'),
			dataField: 'durationTerm',
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				ref.gridRef2?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'gc-user32');
			},
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
					dataField: 'barcodeSn',
					headerText: t('lbl.BARCODE'), //바코드
					dataType: 'code',
				},
				{
					dataField: 'convSerialNo',
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
					dataField: 'wdCustkey',
					headerText: t('lbl.CONTRACTCOMPANY'), //계약업체
					dataType: 'code',
				},
				{
					dataField: 'wdCustName',
					headerText: t('lbl.CONTRACTCOMPANYNAME'), // 계약업체명
					dataType: 'string',
				},
				{
					dataField: 'fromValidDt',
					headerText: 'FROM',
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
				},
				{
					dataField: 'tovaliddt',
					headerText: 'TO',
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
				},
				{
					dataField: 'serialOrderQty',
					headerText: t('lbl.SERIALORDERQTY'), // 스캔예정량
					dataType: 'numeric',
				},
				{
					dataField: 'serialinspectqty',
					headerText: t('lbl.SERIALINSPECTQTY'), //스캔량
					dataType: 'numeric',
				},
				{
					dataField: 'serialscanweight',
					headerText: t('lbl.SERIALSCANWEIGHT'), //스캔중량
					dataType: 'numeric',
				},
			],
		},
		{ headerText: 'SERIALLEVEL', dataField: 'serialLevel', visible: false },
		{ headerText: 'SERIALTYPE', dataField: 'serialType', visible: false },
		{ headerText: 'COLORDESCR', dataField: 'colorDescr', visible: false },
		{ headerText: 'PLACEOFORIGIN', dataField: 'placeOfOrigin', visible: false },
		{ headerText: 'DURATION', dataField: 'duration', visible: false },
		{ headerText: 'DURATIONTYPE', dataField: 'durationType', visible: false },
		{ headerText: 'PLANT', dataField: 'plant', visible: false },
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
			labelText: '합계',
			positionField: 'sku',
		},
		{
			dataField: 'calorderbox',
			positionField: 'calorderbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'calconfirmbox',
			positionField: 'calconfirmbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'realbox',
			positionField: 'realbox',
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
			dataField: 'confirmqty',
			positionField: 'confirmqty',
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

	//그리드 컬럼(상세목록 그리드)
	const gridCol3 = [
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
			dataField: 'sourcekey',
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
			dataField: 'potypename',
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
			filter: {
				showIcon: true,
			},
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
				},
				{
					dataField: 'calorderbox',
					headerText: t('lbl.CALORDERBOX'), //환산주문박스
					dataType: 'numeric',
				},
				{
					dataField: 'calconfirmbox',
					headerText: t('lbl.CALCONFIRMBOX'), //환산확정박스
					dataType: 'numeric',
				},
				{
					dataField: 'realbox',
					headerText: t('lbl.REALBOX'), //실박스
					dataType: 'numeric',
				},
			],
		},
		{
			headerText: t('lbl.CUSTORDERQTY_RT'), //고객반품주문수량
			dataField: 'orderqty',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.RETURNQTY_RT'), //반품입고수량
			dataField: 'confirmqty',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.RETURNDATE_RT'), //미회수수량
			dataField: 'confirmdate',
			dataType: 'date',
		},
		{
			headerText: t('lbl.PACKINGMETHOD'), //반품확정일자
			dataField: 'packingmethod',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
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
			dataField: 'other01',
		},
		{
			headerText: t('lbl.ORDERTYPE_RT'), //반품유형
			dataField: 'ordertypename',
			dataType: 'code',
		},
		{
			headerText: t('lbl.SALEGROUP'), //영업조직
			dataField: 'salegroup',
		},
		{
			headerText: t('lbl.SALEDEPARTMENT'), //사업장
			dataField: 'saledepartment',
		},
		{
			headerText: t('lbl.CUSTGROUP'), //영업그룹
			dataField: 'custgroup',
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
			headerText: t('lbl.OTHER03_DMD_RT'), //클레임사유
			dataField: 'other03',
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
			headerText: '기준일(제조)',
			dataField: 'lotManufacture',
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
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
		},
		{
			headerText: t('lbl.DURATION_TERM2'), //소비기간(잔여/전체)
			dataField: 'durationTerm',
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
					dataField: 'barcodeSn',
					headerText: t('lbl.BARCODE'),
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
					dataField: 'wdCustKey', //계약업체
					headerText: t('lbl.CONTRACTCOMPANY'),
					dataType: 'code',
				},
				{
					dataField: 'wdCustName', // 계약업체명
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataType: 'string',
				},
				{
					dataField: 'fromvaliddt',
					headerText: 'FROM',
				},
				{
					dataField: 'tovaliddt',
					headerText: 'TO',
				},
				{
					dataField: 'serialorderqty',
					headerText: t('lbl.SERIALORDERQTY'), // 스캔예정량
					dataType: 'numeric',
				},
				{
					dataField: 'serialinspectqty',
					headerText: t('lbl.SERIALINSPECTQTY'), //스캔량
					dataType: 'numeric',
				},
				{
					dataField: 'serialscanweight',
					headerText: t('lbl.SERIALSCANWEIGHT'), //스캔중량
					dataType: 'numeric',
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
	};

	// FooterLayout Props(상세목록 그리드)
	const footerLayout3 = [
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
			searchDtl();
		});
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
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
							<GridTopBtn gridBtn={gridBtn2} gridTitle={t('lbl.DETAIL_TAB')} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
						</GridAutoHeight>
					</>,
				]}
			/>
			<AGrid className={'dp-none'}>
				<GridTopBtn gridBtn={gridBtn2} gridTitle="이력상품반품현황" />
				<AUIGrid ref={ref.gridRef3} columnLayout={gridCol3} gridProps={gridProps3} footerLayout={footerLayout3} />
			</AGrid>
		</>
	);
});

export default DetailSampleCarDriver;
