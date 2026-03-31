/*
 ############################################################################
 # FiledataField	: WdShipmentETCEXDCDetail1.tsx
 # Description		: 출고 > 기타출고 > 외부센터매각출고처리 (기타출고 요청)
 # Author					: JiHoPark
 # Since					: 2025.09.11.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';

// Component
import CmCostCenterSearch from '@/components/cm/popup/CmCostCenterSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import WdShipmentETCEXDCDetail1UploadExcelPopup from '@/components/wd/shipmentETCEXDC/WdShipmentETCEXDCDetail1UploadExcelPopup';

// Util

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// API
import { apiSaveMasterList1 } from '@/api/wd/apiWdShipmentETCEXDC';

// Hooks

// lib
import dayjs from 'dayjs';
// type
import { GridBtnPropsType } from '@/types/common';
// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';
import GridAutoHeight from '@/components/common/GridAutoHeight';

interface WdShipmentETCEXDCDetail1Props {
	data: any;
	totalCnt: any;
	form: any;
	initialValues: any;
	fixdccode: string;
	handleGridData2: any;
	reasonCodeList: any;
	globalVariable: any;
}

const WdShipmentETCEXDCDetail1 = forwardRef((props: WdShipmentETCEXDCDetail1Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const [form] = Form.useForm();

	const refModal = useRef(null);
	const refModal2 = useRef(null);
	const excelRef = useRef(null);

	const { handleGridData2, initialValues } = props;

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.DCCODE'), /*물류센터*/ dataField: 'dccode', dataType: 'code', editable: false, width: 80 },
		{ headerText: t('lbl.STORE'), /*창고*/ dataField: 'organize', dataType: 'code', editable: false, width: 100 },
		{
			headerText: t('lbl.ORGANIZENAME'),
			/*창고명*/ dataField: 'organizename',
			dataType: 'string',
			editable: false,
			width: 180,
		},
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
		{ headerText: t('lbl.ZONE'), /*피킹존*/ dataField: 'zone', dataType: 'code', editable: false, width: 80 },
		{ headerText: t('lbl.LOC_ST'), /*로케이션*/ dataField: 'loc', dataType: 'code', editable: false, width: 100 },
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
					width: 380,
				},
			],
		},
		{ headerText: t('lbl.UOM_RT'), /*단위*/ dataField: 'uom', dataType: 'code', editable: false, width: 80 },
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
			formatString: '#,##0.###',
			editable: false,
			width: 120,
		},
		{
			headerText: t('lbl.BOXQTY'),
			/*박스수량*/ dataField: 'boxqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 120,
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
			headerText: t('lbl.ETCQTY_WD'),
			/*처리수량*/ dataField: 'tranqty',
			editable: true,
			required: true,
			width: 120,
			dataType: 'numeric',
			formatString: '#,##0.###',
			editRenderer: {
				type: 'InputEditRenderer',
				allowPoint: true,
				allowNegative: true,
			},
		},
		{
			headerText: t('lbl.STOCKTRANSTYPE'),
			/*처리유형*/ dataField: 'potype',
			dataType: 'string',
			width: 160,
			editable: true,
			required: true,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PROCESSTYPE_ETC', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{
			headerText: t('lbl.PROCESSREASON_ETC'),
			/*처리사유*/ dataField: 'reasoncode',
			dataType: 'string',
			width: 160,
			editable: true,
			required: true,
			renderer: {
				type: 'DropDownListRenderer',
				list: props.reasonCodeList,
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{
			headerText: t('lbl.BOXCALINFO') /*박스환산정보*/,
			children: [
				{
					headerText: t('lbl.AVGWEIGHT'),
					/*평균중량*/ dataField: 'avgweight',
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.CALBOX'),
					/*환산박스*/ dataField: 'calbox',
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.REALOPENBOX'),
					/*실박스예정*/ dataField: 'realorderbox',
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.REALCFMBOX'),
					/*실박스확정*/ dataField: 'realcfmbox',
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.TRANBOXQTY'),
					/*작업박스수량*/ dataField: 'tranbox',
					dataType: 'numeric',
					width: 120,
					required: false,
					formatString: '#,##0.###',
					editRenderer: {
						type: 'InputEditRenderer',
						onlyInteger: true, // 정수만 입력
						allowNegative: true, // 음수 입력 허용
					},
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						if (commUtil.isNotEmpty(item?.boxflag) && item.boxflag === 'Y') {
							return 'isEdit';
						} else {
							ref.current.removeEditClass(columnIndex);
							return '';
						}
					},
				},
			],
		},
		{
			headerText: t('lbl.COSTCENTER') /*귀속부서*/,
			children: [
				{
					headerText: t('lbl.COSTCENTER'),
					/*귀속부서*/ dataField: 'costcd',
					dataType: 'code',
					required: true,
					editable: true,
					commRenderer: {
						type: 'search',
						popupType: 'costCenter',
						searchDropdownProps: {
							dataFieldMap: {
								costcd: 'code',
								costcdname: 'name',
							},
						},
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							// 예: custcd 컬럼에서 팝업 열기
							refModal.current.open({
								gridRef: ref,
								rowIndex,
								dataFieldMap: {
									costcd: 'code',
									costcdname: 'name',
								},
								popupType: 'costCenter',
							});
						},
					},
					width: 100,
				},
				{
					headerText: t('lbl.COSTCENTERNAME'),
					/*귀속부서명*/ dataField: 'costcdname',
					dataType: 'string',
					editable: false,
					width: 220,
				},
			],
		},
		{
			headerText: t('lbl.CUST') /*거래처*/,
			children: [
				{
					headerText: t('lbl.CUST'),
					/*거래처*/ dataField: 'custkey',
					dataType: 'code',
					required: true,
					editable: true,
					commRenderer: {
						type: 'search',
						popupType: 'cust',
						searchDropdownProps: {
							dataFieldMap: {
								custkey: 'code',
								custname: 'name',
							},
						},
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							// 예: custcd 컬럼에서 팝업 열기
							refModal.current.open({
								gridRef: ref,
								rowIndex,
								dataFieldMap: {
									custkey: 'code',
									custname: 'name',
								},
								popupType: 'cust',
							});
						},
					},
					width: 100,
				},
				{
					headerText: t('lbl.CUST_NAME'),
					/*거래처명*/ dataField: 'custname',
					dataType: 'string',
					editable: false,
					width: 240,
				},
			],
		},
		{
			headerText: t('lbl.WONEARDURATIONYN'),
			/*유통기한임박여부*/ dataField: 'neardurationyn',
			dataType: 'code',
			editable: false,
			width: 120,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.EXPIREDT'),
			/*소비일자*/ dataField: 'expiredt',
			dataType: 'code',
			editable: false,
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.MANUFACTUREDT'),
			/*제조일자*/ dataField: 'manufacturedt',
			dataType: 'code',
			editable: false,
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.DURATIONTERM'),
			/*유통기간(잔여/전체)*/ dataField: 'durationTerm',
			dataType: 'code',
			editable: false,
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.SERIALINFO') /*상품이력정보*/,
			children: [
				{
					headerText: t('lbl.SERIALNO_SKU'),
					/*이력번호*/ dataField: 'serialno',
					dataType: 'string',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.BARCODE'),
					/*바코드*/ dataField: 'barcode',
					dataType: 'string',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.BLNO'),
					/*B/L 번호*/ dataField: 'convserialno',
					dataType: 'string',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.CONVERTLOT'),
					/*도축일자*/ dataField: 'butcherydt',
					dataType: 'date',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.FACTORYNAME'),
					/*도축장*/ dataField: 'factoryname',
					dataType: 'string',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.CONTRACTTYPE'),
					/*계약유형*/ dataField: 'contracttype',
					dataType: 'string',
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
					dataType: 'string',
					editable: false,
					width: 220,
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
		{
			headerText: t('lbl.WODURATIO'),
			/*유통기간*/ dataField: 'duration',
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			headerText: t('lbl.WODURATIONTYPE'),
			/*유통기한관리방법*/ dataField: 'durationtype',
			dataType: 'string',
			width: 170,
			editable: false,
			labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
				const arrCodeList = getCommonCodeList('DURATIONTYPE')?.find(v => v['comCd'] === value);
				if (arrCodeList === undefined) return '';
				return arrCodeList['cdNm'];
			},
		},
		{ headerText: t('lbl.LOT'), /*로트*/ dataField: 'lot', dataType: 'string', editable: false, width: 200 },
		{
			headerText: t('lbl.WOSTOCKID'),
			/*개체식별/유통이력*/ dataField: 'stockid',
			dataType: 'string',
			editable: false,
			width: 200,
		},
		{
			headerText: t('lbl.STORERKEY'),
			/*회사*/ dataField: 'storerkey',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: 'AREA',
			/*AREA*/ dataField: 'area',
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.OTHER01_DMD_AJ'),
			/*귀책*/ dataField: 'imputetype',
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.OTHER05_DMD_AJ'),
			/*물류귀책배부*/ dataField: 'processmain',
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{ headerText: 'OTHER03', /*OTHER03*/ dataField: 'other03', dataType: 'string', editable: false, visible: false },
		{
			headerText: t('lbl.LOTTABLE01_MFG_WO'),
			/*기준일(유통,제조)*/ dataField: 'lottable01',
			dataType: 'string',
			editable: false,
			visible: false,
		},
		// {
		// 	headerText: t('lbl.OTHER05_DMD_AJ'),
		// 	/*물류귀책배부*/ dataField: 'other05',
		// 	dataType: 'code',
		// 	editable: true,
		// },
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
		},
		{
			dataField: 'qty',
			positionField: 'qty',
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
			dataField: 'boxqty',
			positionField: 'boxqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'calbox',
			positionField: 'calbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'realorderbox',
			positionField: 'realorderbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'realcfmbox',
			positionField: 'realcfmbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},

		{
			dataField: 'tranbox',
			positionField: 'tranbox',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		showFooter: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 재고조정 저장 callback
	 * @returns {void}
	 */
	const saveCallback = () => {
		let errMsg = ''; // 에러메시지
		const chkDataList = ref.current.getCheckedRowItemsAll();
		const reqFormData = form.getFieldsValue();

		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'), // 변경사항이 없습니다.
				modalType: 'info',
			});
			return;
		}

		if (!reqFormData.docdt) {
			errMsg = '처리일자는 필수입니다.';
		}

		if (errMsg) {
			showMessage({
				content: errMsg,
				modalType: 'info',
			});
			return;
		}

		const findData = chkDataList.find((data: any) => {
			const curCustkey = data.custkey; // 거래처
			const curTranqty = data.tranqty; // 처리수량
			const curBoxflag = data.boxflag; // boxflag
			const curBoxqty = data.calbox; // 박스수량
			const curTranbox = data.tranbox; // 작업박스수량
			const curPotype = data.potype; // 처리유형
			const curReasoncode = data.reasoncode; // 처리사유

			if (commUtil.isEmpty(curCustkey)) {
				errMsg = t('msg.placeholder1', [t('lbl.CUST')]); // 거래처을 입력해주세요.
				return true;
			}

			if (curBoxflag === 'Y' && (Number(curTranbox) === 0 || commUtil.isEmpty(curTranbox))) {
				errMsg = t('msg.placeholder1', [t('lbl.TRANBOXQTY')]); // 작업박스수량을 입력해주세요.
				return true;
			}

			if (Number(curBoxqty) < Number(curTranbox)) {
				errMsg = t('msg.MSG_COM_VAL_236', [t('lbl.TRANBOXQTY'), t('lbl.BOXQTY')]); // {{0}}은(는) {{1}} 보다 값이 같거나 작아야 합니다.
				return true;
			}

			if (Number(curTranqty) === 0 || commUtil.isEmpty(curTranqty)) {
				errMsg = t('msg.placeholder1', [t('lbl.ETCQTY_WD')]); // 처리수량을 입력해주세요.
				return true;
			}

			if (commUtil.isEmpty(curPotype)) {
				errMsg = t('msg.placeholder1', [t('lbl.STOCKTRANSTYPE')]); // 처리유형을 입력해주세요.
				return true;
			}

			if (commUtil.isEmpty(curReasoncode)) {
				errMsg = t('msg.placeholder1', [t('lbl.PROCESSREASON_ETC')]); // 처리사유을 입력해주세요.
				return true;
			}
		});

		if (findData) {
			showMessage({
				content: errMsg,
				modalType: 'info',
			});
			return;
		}

		// 저장하시겠습니까?\n(신규 : {{0}}건, 수정 : {{1}}건, 삭제 : {{2}}건)
		showConfirm(null, t('msg.MSG_COM_VAL_207', [0, chkDataList.length, 0]), () => {
			const params = {
				avc_DCCODE: props.fixdccode,
				procedure: 'SPAJ_REQUEST',
				avc_COMMAND: 'APPROVALREQ_SA',
				processtype: 'AJ_ADJUSTMENTREQ_SA',
				temptabletype: 'AJ',
				docdt: dayjs(reqFormData.docdt).format('YYYYMMDD'),
				ifSendType: 'WMSAJ',
				workprocesscode: 'WMSAJ',
				omsFlg: 'Y',
				wdMemo: reqFormData.wdMemo,
				saveMasterList1: chkDataList,
			};

			apiSaveMasterList1(params).then(res => {
				if (res.statusCode === 0) {
					handleGridData2(res.data);
				}
			});
		});
	};

	/**
	 * 선택적용 callback
	 * @returns {void}
	 */
	const applySelectedDataCallback = () => {
		const chkDataList = ref.current.getCheckedRowItems();

		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.noSelect'), // 선택한 행이 없습니다.
				modalType: 'info',
			});
			return;
		}

		const reqData = form.getFieldsValue();
		chkDataList.forEach((chkData: { rowIndex: number; item: any }) => {
			const { rowIndex, item } = chkData;

			const updateItem = {
				...item,
				potype: commUtil.isNotEmpty(reqData.potype) ? reqData.potype : item.potype,
				reasoncode: commUtil.isNotEmpty(reqData.reasoncode) ? reqData.reasoncode : item.reasoncode,
				costcd: commUtil.isNotEmpty(reqData.costcd) ? reqData.costcd : item.costcd,
				costcdname: commUtil.isNotEmpty(reqData.costcd) ? reqData.costcdname : item.costcdname,
				custkey: commUtil.isNotEmpty(reqData.custkey) ? reqData.custkey : item.custkey,
				custname: commUtil.isNotEmpty(reqData.custkey) ? reqData.custname : item.custname,
			};

			ref.current.updateRow(updateItem, rowIndex);
		});
	};

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

		/**
		 * 셀 편집 시작 전
		 * @event cellEditEndBefore
		 * @param {object} event 이벤트
		 * @returns {void} 최종 수정값
		 */
		ref?.current.bind('cellEditBegin', (event: any) => {
			const curDataField = event.dataField;
			const curBoxflag = event.item.boxflag;

			if (curDataField === 'tranbox' && curBoxflag !== 'Y') {
				return false;
			}

			return true;
		});

		/**
		 * 셀 편집 종료 후
		 * @event cellEditEndBefore
		 * @param {object} event 이벤트
		 * @returns {void} 최종 수정값
		 */
		ref?.current.bind('cellEditEnd', (event: any) => {
			const curDataField = event.dataField;
			const curRowIndex = event.rowIndex;
			const curBoxflag = event.item.boxflag;

			if (curBoxflag !== 'D') {
				if (curDataField === 'tranqty') {
					const newValue = Number(event.value);
					const curAvgweight = Number(event.item.avgweight);

					if (commUtil.isEmpty(newValue) || newValue === 0) {
						ref.current.setCellValue(curRowIndex, 'tranqty', 0);
						ref.current.setCellValue(curRowIndex, 'tranbox', 0);
					} else {
						if (curBoxflag === 'Y' && curAvgweight > 0) {
							const calTranbox = Math.round(newValue / curAvgweight);
							if (calTranbox > 0) {
								ref.current.setCellValue(curRowIndex, 'tranbox', calTranbox);
							} else {
								ref.current.setCellValue(curRowIndex, 'tranbox', 0);
							}
						}
						if (newValue > 0 && newValue / curAvgweight < 1) {
							ref.current.setCellValue(curRowIndex, 'tranbox', 1);
						}
					}
				} else if (curDataField === 'tranbox') {
					const newValue = Number(event.value);
					if (commUtil.isEmpty(newValue) || newValue <= 0) {
						ref.current.setCellValue(curRowIndex, 'tranbox', 0);
					}
				}
			}
		});
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const onExcelUploadPopupClick = () => {
		refModal2.current.handlerOpen();
	};

	/**
	 * 엑셀 팝업 닫기
	 * @param popupData
	 */
	const closeEvent = () => {
		refModal2.current.handlerClose();

		const excelChkDataList = excelRef.current.getCheckedRowItemsAll();
		if (excelChkDataList.length > 0) {
			const excelParams = excelChkDataList.map((item: any) => {
				let boxflag = 'Y';
				if (commUtil.isEmpty(item.dccode)) {
					boxflag = 'D';
				}
				if (commUtil.isEmpty(item.loc)) {
					boxflag = 'D';
				}
				if (commUtil.isEmpty(item.sku)) {
					boxflag = 'D';
				}
				if (commUtil.isEmpty(item.uom)) {
					boxflag = 'D';
				}
				if (commUtil.isEmpty(item.lot)) {
					boxflag = 'D';
				}
				if (commUtil.isEmpty(item.stockid)) {
					boxflag = 'D';
				}
				if (commUtil.isEmpty(item.stockgrade)) {
					boxflag = 'D';
				}
				if (commUtil.isEmpty(item.stocktype)) {
					boxflag = 'D';
				}

				let rowStatus = '';
				if (commUtil.isNotEmpty(item.tranqty) && Number(item.tranqty) !== 0 && boxflag !== 'D') {
					rowStatus = 'U';
				}

				// 처리유형
				const findPotype = getCommonCodeList('PROCESSTYPE_ETC').find(val => {
					const curPotype = item.potype;

					if (val.comCd === curPotype || val.cdNm === curPotype) {
						return true;
					}
				});

				// 처리사유
				const findReason = getCommonCodeList('PROCESSREASON_ETC').find(val => {
					const curReasoncode = item.reasoncode;

					if (val.comCd === curReasoncode || val.cdNm === curReasoncode) {
						return true;
					}
				});

				const param = {
					...item,
					chk: rowStatus === 'U' ? '1' : '0',
					area: '1000',
					storerkey: props.globalVariable.gStorerkey,
					boxflag: 'D',
					rowStatus,
					potype: findPotype ? findPotype.comCd : '',
					reasoncode: findReason ? findReason.comCd : '',
					other03:
						' < SERIALNO > ' +
						item.serialno +
						' < /SERIALNO >  < CONVSERIALNO > ' +
						item.convserialno +
						' < /CONVSERIALNO >  < POLINE >  < /POLINE >  < CUTKEY > ' +
						item.contractcompany +
						' < /CUTKEY > ',
				};

				return param;
			});

			ref.current.clearGridData();
			ref.current.setGridData(excelParams);
		}
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 엑셀업로드
				callBackFn: onExcelUploadPopupClick,
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveCallback,
			},
		],
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
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}

			<AGrid style={{ marginTop: '15px' }}>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt}>
					<Button onClick={applySelectedDataCallback}>{t('lbl.APPLY_SELECT')}</Button>
				</GridTopBtn>

				<UiDetailViewArea>
					<Form form={form} initialValues={initialValues}>
						<UiDetailViewGroup>
							<li>
								<DatePicker
									name="docdt"
									label={t('lbl.APPROVALREQDT')} // 결재요청일자
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li>
								<SelectBox
									name="potype"
									span={24}
									options={getCommonCodeList('PROCESSTYPE_ETC', t('lbl.SELECT'), '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.STOCKTRANSTYPE')} // 처리유형
								/>
							</li>
							<li>
								<SelectBox
									name="reasoncode"
									span={24}
									options={props.reasonCodeList}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.PROCESSREASON_ETC')} // 처리사유
								/>
							</li>
							<li>
								<CmCostCenterSearch
									form={form}
									selectionMode="singleRow"
									name="costcdname"
									code="costcd"
									returnValueFormat="name"
								/>
							</li>
							<li>
								<CmCustSearch
									form={form}
									selectionMode="singleRow"
									name="custname"
									code="custkey"
									returnValueFormat="name"
								/>
							</li>
							<li>
								<InputText
									name="wdMemo"
									label={t('lbl.MEMO')} // 메모
								/>
							</li>
							<li className="ta-r">
								<span style={{ textAlign: 'left' }}>
									이 프로그램은 기부, 매각, 예외 조정들을 위한 조정 주문처리 프로그램 입니다.
								</span>
							</li>
						</UiDetailViewGroup>
					</Form>
				</UiDetailViewArea>
				<GridAutoHeight id="other-delivery-requests-gird">
					<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} footerLayout={footerCol} />
				</GridAutoHeight>
			</AGrid>
			<CmSearchWrapper ref={refModal} />
			<CustomModal ref={refModal2} width="1000px">
				<WdShipmentETCEXDCDetail1UploadExcelPopup close={closeEvent} ref={excelRef} />
			</CustomModal>
		</>
	);
});

export default WdShipmentETCEXDCDetail1;
