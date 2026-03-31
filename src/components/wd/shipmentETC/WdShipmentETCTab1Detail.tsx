/*
 ############################################################################
 # FiledataField	: WdShipmentETCTap1Detail.tsx
 # Description		: 출고 > 기타출고 > 매각출고처리 (기타출고)
 # Author			    : 고혜미
 # Since		    	: 25.10.15
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Api
import { apiSaveMasterList, apiSaveMasterList01, apiSaveMasterList02 } from '@/api/wd/apiWdShipmentETC';

//Component
import CmCostCenterSearch from '@/components/cm/popup/CmCostCenterSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
import { validateForm } from '@/util/FormUtil';
import { Form } from 'antd';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import dayjs from 'dayjs';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// asset
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';

const WdShipmentETCTap1Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const { handleGridData2, initialValues } = props;
	const [reasoncodeDisabled, setReasoncodeDisabled] = useState(false); // 처리사유
	const [reasonmsgDisabled, setReasonmsgDisabled] = useState(false); // 세부사유
	const [other05Disabled, setOther05Disabled] = useState(false); // 물류귀책여부
	const [costcdDisabled, setCostcdDisabled] = useState(false); // 귀속부서코드/명
	const [costcdnameDisabled, setCostcdnameDisabled] = useState(false);
	const [custkeyDisabled, setCustkeyDisabled] = useState(false); // 거리처코드/명
	const [custnameDisabled, setCustnameDisabled] = useState(false); // 비고
	const [other03Disabled, setOther03Disabled] = useState(false);
	const [prevPotype, setPrevPotype] = useState<string | null>(null);
	const [popupType, setPopupType] = useState('');

	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	const refModal = useRef(null);
	const refModal1 = useRef(null);
	const refModal2 = useRef(null);
	const refModalPop = useRef(null); // 그리드 팝업용 ref

	// Declare init value(3/4)

	// 기타(4/4)

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE') /*물류센터*/,
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE') /*창고*/,
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			dataField: 'stocktypenm',
			headerText: t('lbl.STOCKTYPE') /*재고위치*/,
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			dataField: 'stockgradename',
			headerText: t('lbl.STOCKGRADE') /*재고속성*/,
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			dataField: 'zone',
			headerText: t('lbl.ZONE') /*피킹존*/,
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC') /*로케이션*/,
			dataType: 'code',
			editable: false,
			width: 120,
		},
		{
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU') /*상품코드*/,
					dataType: 'code',
					editable: false,
					width: 80,
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
					editable: false,
					width: 380,
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_ST') /*단위*/,
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			dataField: 'qty',
			headerText: t('lbl.QTY_ST') /*현재고수량*/,
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
			width: 120,
		},
		{
			dataField: 'openqty',
			headerText: t('lbl.OPENQTY_ST') /*가용재고수량*/,
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
			width: 120,
		},
		{
			dataField: 'qtyallocated',
			headerText: t('lbl.QTYALLOCATED_ST') /*재고할당수량*/,
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
			width: 120,
		},
		{
			dataField: 'qtypicked',
			headerText: t('lbl.QTYPICKED_ST') /*피킹재고*/,
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
			width: 120,
		},
		{
			dataField: 'etcqty',
			headerText: t('lbl.ETCQTY_WD') /*처리수량*/,
			dataType: 'numeric',
			formatString: '#,##0.##',
			width: 120,
			required: true,
		},
		{
			headerText: t('lbl.STOCKTRANSTYPE') /*처리유형*/,
			dataField: 'potype',
			dataType: 'string',
			editable: false,
			width: 160,
			labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
				const arrCodeList = getCommonCodeList('PROCESSTYPE_ETC')?.find(v => v['comCd'] === value);
				if (arrCodeList === undefined) return '';
				return arrCodeList['cdNm'];
			},
		},
		{
			dataField: 'reasoncode',
			headerText: t('lbl.PROCESSREASON_ETC') /*처리사유*/,
			dataType: 'string',
			width: 160,
			editable: true,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PROCESSREASON_ETC', '선택', '').filter(item => {
					return item.comCd === '' || item.data4 === '2170';
				}),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'reasonmsg',
			headerText: t('lbl.REASONDTL_ETC') /*세부사유*/,
			dataType: 'string',
			editable: true,
			width: 160,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('REASONDETAIL_ETC', '선택', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'other05',
			headerText: t('lbl.OTHER05_DMD_AJ') /*물류귀책배부*/,
			dataType: 'string',
			editable: true,
			width: 160,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('YN', '선택', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},

		{
			headerText: t('lbl.COSTCENTER'), //귀속부서
			children: [
				// {
				// 	dataField: 'costcd',
				// 	headerText: t('lbl.COSTCENTER'), // 귀속부서
				// 	dataType: 'code',
				// 	editable: true,
				// 	//required: true,
				// 	disableMoving: true,
				// 	commRenderer: {
				// 		type: 'search',
				// 		popupType: 'costCenter',
				// 		searchDropdownProps: {
				// 			dataFieldMap: {
				// 				costcd: 'code',
				// 				costcdname: 'name',
				// 			},
				// 			callbackBeforeUpdateRow: (e: any) => {
				// 				const selectedIndex = ref.gridRef?.current?.getSelectedIndex();
				// 			},
				// 		},
				// 		onClick: function (e: any) {
				// 			const rowIndex = e.rowIndex;
				// 			// 편집 불가능한 상태에서는 팝업을 띄우지 않음
				// 			if (isDisabled(e.item)) {
				// 				return;
				// 			}
				// 			refModalPop.current.open({
				// 				gridRef: ref.gridRef,
				// 				rowIndex,
				// 				dataFieldMap: {
				// 					costcd: 'code',
				// 					costcdname: 'name',
				// 				},
				// 				popupType: 'costCenter',
				// 			});
				// 		},
				// 	},
				// 	//
				// 	styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				// 		if (isDisabled(item)) {
				// 			// 편집 가능 class 삭제
				// 			ref.gridRef.current.removeEditClass(columnIndex);
				// 		} else {
				// 			// 편집 가능 class 추가
				// 			return 'isEdit';
				// 		}
				// 	},
				// },
				{
					dataField: 'costcd',
					headerText: t('lbl.COSTCENTER'),
					dataType: 'code',
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
							refModal.current?.open({
								gridRef: ref.gridRef,
								codeName: e.text,
								rowIndex: e.rowIndex,
								dataFieldMap: {
									costcd: 'code',
									costcdname: 'name',
								},
								popupType: 'costCenter',
							});
						},
					},
					style: 'isEdit',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'costcdname',
					headerText: t('lbl.COSTCENTERNAME'), //귀속부서명
					dataType: 'text',
					editable: false,
					disableMoving: true,
				},
			],
		},
		{
			headerText: t('lbl.LB_VENDOR'), //거래처
			children: [
				// {
				// 	dataField: 'custkey',
				// 	headerText: t('lbl.CUST_CODE'), //거래처
				// 	dataType: 'code',
				// 	editable: true,
				// 	required: true,
				// 	disableMoving: true,
				// 	commRenderer: {
				// 		type: 'search',
				// 		popupType: 'cust',
				// 		searchDropdownProps: {
				// 			dataFieldMap: {
				// 				custkey: 'code',
				// 				custname: 'name',
				// 			},
				// 			callbackBeforeUpdateRow: (e: any) => {
				// 				const selectedIndex = ref.gridRef?.current?.getSelectedIndex();
				// 			},
				// 		},
				// 		onClick: function (e: any) {
				// 			const rowIndex = e.rowIndex;
				// 			// 편집 불가능한 상태에서는 팝업을 띄우지 않음
				// 			if (isDisabled(e.item)) {
				// 				return;
				// 			}
				// 			refModalPop.current.open({
				// 				gridRef: ref.gridRef,
				// 				rowIndex,
				// 				dataFieldMap: {
				// 					custkey: 'code',
				// 					custname: 'name',
				// 				},
				// 				popupType: 'cust',
				// 			});
				// 		},
				// 	},
				// 	//
				// 	styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				// 		if (isDisabled(item)) {
				// 			// 편집 가능 class 삭제
				// 			ref.gridRef.current.removeEditClass(columnIndex);
				// 		} else {
				// 			// 편집 가능 class 추가
				// 			return 'isEdit';
				// 		}
				// 	},
				// },
				{
					dataField: 'custkey',
					headerText: t('lbl.LB_VENDOR'),
					dataType: 'code',
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
							refModal1.current?.open({
								gridRef: ref.gridRef,
								codeName: e.text,
								rowIndex: e.rowIndex,
								dataFieldMap: {
									custkey: 'code',
									custname: 'name',
								},
								popupType: 'cust',
							});
						},
					},
					style: 'isEdit',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'custname',
					headerText: t('lbl.LB_VENDOR_NM'), //거래처명
					dataType: 'text',
					editable: false,
					disableMoving: true,
				},
			],
		},
		{
			dataField: 'other03',
			headerText: t('lbl.REMARK'), //거래처명
			dataType: 'text',
			editable: true,
			disableMoving: true,
		},
		// {
		// 	dataField: 'disposeAmount',
		// 	headerText: t('lbl.AMT') /*금액*/,
		// 	dataType: 'numeric',
		// 	formatString: '#,##0.##',
		// 	editable: true,
		// 	width: 120,
		// },
		// {
		// 	dataField: 'other03',
		// 	headerText: t('lbl.MEMO1') /*비고*/,
		// 	width: 100,
		// },
		{
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN') /*유통기한임박여부*/,
			dataType: 'code',
			editable: false,
			width: 120,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'lottable01',
			headerText: t('lbl.LOTTABLE01_MFG_WO') /*기준일(소비,제조)*/,
			dataType: 'code',
			editable: false,
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATIONTERM') /*소비기간(잔여/전체)*/,
			dataType: 'code',
			editable: false,
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.SERIALINFO'),
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO') /*이력번호*/,
					dataType: 'code',
					editable: false,
					width: 200,
				},
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE') /*바코드*/,
					dataType: 'code',
					editable: false,
					width: 200,
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO') /*B/L번호*/,
					dataType: 'code',
					editable: false,
					width: 200,
				},
				{
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT') /*도축일자*/,
					dataType: 'date',
					editable: false,
					width: 120,
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME') /*도축장*/,
					dataType: 'code',
					editable: false,
					width: 200,
				},
				{
					dataField: 'contracttype',
					headerText: t('lbl.CONTRACTTYPE') /*계약유형*/,
					dataType: 'code',
					editable: false,
					width: 120,
				},
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY') /*계약업체*/,
					dataType: 'code',
					editable: false,
					width: 150,
				},
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME') /*계약업체명*/,
					editable: false,
					width: 220,
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT') /*유효일자(FROM)*/,
					dataType: 'date',
					editable: false,
					width: 120,
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT') /*유효일자(TO)*/,
					dataType: 'date',
					editable: false,
					width: 120,
				},
			],
		},
		{
			dataField: 'lot',
			headerText: t('lbl.LOT') /*로트*/,
			dataType: 'sting',
			editable: false,
			width: 200,
		},
		{
			dataField: 'ordertype',
			headerText: t('lbl.ORDERTYPE') /*주문유형*/,
			dataType: 'sting',
			editable: false,
			width: 150,
		},
		{
			dataField: 'duration',
			headerText: t('lbl.DURATION') /*소비기간*/,
			dataType: 'sting',
			editable: false,
			width: 80,
		},
		{
			dataField: 'durationtype',
			headerText: t('lbl.DURATIONTYPE') /*소비기한관리방법*/,
			dataType: 'sting',
			editable: false,
			width: 170,
			labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
				const arrCodeList = getCommonCodeList('DURATIONTYPE')?.find(v => v['comCd'] === value);
				if (arrCodeList === undefined) return '';
				return arrCodeList['cdNm'];
			},
		},
		{
			dataField: 'stockid',
			headerText: t('lbl.STOCKID') /*개체식별/소비이력*/,
			dataType: 'sting',
			editable: false,
			width: 200,
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		// autoGridHeight: true, // 자동 높이 조절
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		showFooter: true,
	};

	// FooterLayout Props
	const footerLayout = [{}];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 편집 가능한 상태인지 확인하는 함수
	 * @param {any} item - 그리드 행 아이템
	 * @returns {boolean} - 편집 가능 여부
	 */
	const isDisabled = (item: any): boolean => {
		// 2026.01.23 김동한 박의병님 오더로 현재고수량이 0 이어도 수정 가능하게 변경.
		// if ((item?.qty || 0) > 0) {
		// 	// 재고 있으면 가능
		// 	return false;
		// }
		//return true;
		return false;
	};

	const handlePotypeFocus = () => {
		// 현재 값을 저장해둠 (변경 전 값)
		setPrevPotype(props.form.getFieldValue('potype'));
	};

	const onChange = async () => {
		const potype = props.form.getFieldValue('potype');

		if (ref.gridRef.current.getChangedData({ validationYn: false })?.length > 0) {
			// 그리드 수정여부 체크
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
			if (!isConfirm) {
				props.form.setFieldValue('potype', prevPotype);
				return false;
			} else {
				// 전체 체크 해제
				ref.gridRef.current.setAllCheckedRows(false);
				// AUIGrid 변경이력 Cache 삭제
				ref.gridRef.current.resetUpdatedItems();
				props.searchMasterList?.();
			}
		}

		if (potype === '3') {
			//매각
			props.form.setFieldValue('reasoncode', null);
			props.form.setFieldValue('reasonmsg', null);
			props.form.setFieldValue('other05', null);
			props.form.setFieldValue('costcd', null);
			props.form.setFieldValue('costcdname', null);
			props.form.setFieldValue('custkey', null);
			props.form.setFieldValue('custname', null);

			setReasoncodeDisabled(true);
			setReasonmsgDisabled(true);
			setOther05Disabled(true);
			setCostcdDisabled(true);
			setCostcdnameDisabled(true);
			setCustkeyDisabled(true);
			setCustnameDisabled(true);
			setOther03Disabled(false);

			ref.gridRef.current.showColumnByDataField(['disposeAmount', 'other03']);
			ref.gridRef.current.hideColumnByDataField([
				'reasoncode',
				'reasonmsg',
				'other05',
				'costcd',
				'costcdname',
				'custkey',
				'custname',
			]);
		} else if (potype === '10') {
			//기부
			props.form.setFieldValue('other03', null);

			setReasoncodeDisabled(false);
			setReasonmsgDisabled(false);
			setOther05Disabled(false);
			setCostcdDisabled(false);
			setCostcdnameDisabled(false);
			setCustkeyDisabled(false);
			setCustnameDisabled(false);
			setOther03Disabled(true);

			ref.gridRef.current.showColumnByDataField([
				'reasoncode',
				'reasonmsg',
				'other05',
				'costcd',
				'costcdname',
				'custkey',
				'custname',
			]);
			ref.gridRef.current.hideColumnByDataField(['disposeAmount', 'other03']);
		} else {
			setReasoncodeDisabled(false);
			setReasonmsgDisabled(false);
			setOther05Disabled(false);
			setCostcdDisabled(false);
			setCostcdnameDisabled(false);
			setCustkeyDisabled(false);
			setCustnameDisabled(false);
			setOther03Disabled(false);

			ref.gridRef.current.showColumnByDataField([
				'reasoncode',
				'reasonmsg',
				'other05',
				'costcd',
				'costcdname',
				'custkey',
				'custname',
				'disposeAmount',
				'other03',
			]);
		}
	};
	('');
	/**
	 * 선택적용 callback
	 * @returns {void}
	 */
	const applySelectedDataCallback = () => {
		const gridRef = ref.gridRef.current;
		const chkDataList = ref.gridRef.current.getCheckedRowItems();

		const potype = props.form.getFieldValue('potype') ?? ''; // 처리유형
		const reasoncode = props.form.getFieldValue('reasoncode') ?? ''; // 처리사유
		const reasonmsg = props.form.getFieldValue('reasonmsg') ?? ''; // 세뷰사유
		const other05 = props.form.getFieldValue('other05') ?? ''; // 물류귀책배부
		const costcd = props.form.getFieldValue('costcd') ?? ''; // 귀속부서코드
		const costcdname = props.form.getFieldValue('costcdname') ?? ''; // 귀속부서명
		const custkey = props.form.getFieldValue('custkey') ?? ''; // 거래처코드
		const custname = props.form.getFieldValue('custname') ?? ''; // 거래처명
		const other03 = props.form.getFieldValue('other03') ?? ''; // 기타

		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.noSelect'), // 선택한 행이 없습니다.
				modalType: 'info',
			});
			return;
		}

		// 성능 개선: cell단위 변경 대신 전체 데이터를 한번에 변경
		const allData = gridRef.getGridData();
		// setGridData() 호출 시 체크가 해제되므로, 이전에 체크된 행들의 ID를 저장해 둡니다.
		const rowIdField = gridRef.getProp('rowIdField') || '_$uid';

		const checkedRowIds = chkDataList.map((item: any) => item.item[rowIdField]);
		const checkedRowIndexes = new Set(chkDataList.map((item: any) => item.rowIndex));

		const newData = allData.map((row: any, index: number) => {
			if (checkedRowIndexes.has(index)) {
				return {
					...row,
					potype: potype,
					reasoncode: reasoncode,
					reasonmsg: reasonmsg,
					other05: other05,
					costcd: costcd,
					costcdname: costcdname,
					custkey: custkey,
					custname: custname,
					other03: other03,
				};
			}
			return row;
		});

		// setGridData 대신 updateRowsById 사용햐여 변경된 행만 업데이트
		if (newData.length > 0) {
			gridRef.updateRowsById(newData, true); // isMarkEdited: true
		}
		// 이전에 체크된 행들을 다시 체크합니다.
		gridRef.setCheckedRowsByIds(checkedRowIds);
	};

	const saveMasterList = async () => {
		const requestParams = props.form.getFieldsValue();
		requestParams.wdDate = requestParams.wdDate.format('YYYYMMDD');
		requestParams.potype = requestParams.potype;

		const isValid = await validateForm(props.form);

		if (!isValid) {
			return;
		}

		const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length === 0) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		// 수정된 것만(체크박스 제외)
		// validationYn: false 옵션으로 유효성 검사 로직 제외
		const updatedItems = ref.gridRef.current.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length === 0) {
			// 변경된 데이터가 없습니다.
			showAlert(null, t('msg.noModifiedData'));
			return;
		}

		// 필수값 체크
		if (!ref.gridRef.current?.validateRequiredGridData()) {
			return;
		}

		updatedItems.forEach((row: any) => {
			row.potype = requestParams.potype;
		});

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), async () => {
			const params = {
				//apiUrl: '/api/wd/shipmentETC/v1.0/saveMasterList',
				avc_COMMAND: 'BATCHCONFIRM_DC',
				processtype: 'WDSHIPMENTETC',
				wdDate: requestParams.wdDate,
				//potype: requestParams.potype,
				saveList: updatedItems,
				dataKey: 'saveList',
			};

			apiSaveMasterList(params).then(res => {
				if (res.statusCode === 0) {
					handleGridData2(res.data);
				}
			});

			// setLoopTrParams(params);
			// modalRef.current?.handlerOpen();
		});
	};

	const saveCloseEvent = () => {
		modalRef.current?.handlerClose();
		handleGridData2();
	};

	/**
	 * 저장
	 */
	const saveMasterList_backup = () => {
		const gridRef = ref.gridRef.current;
		const checkedRows = gridRef.getCheckedRowItems();
		const updatedItems = ref.gridRef.current.getCheckedRowItemsAll();
		const reqFormData = props.form.getFieldsValue();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		const isChanged = gridRef.getChangedData({ validationYn: false });
		if (!isChanged || isChanged.length < 1) {
			showAlert(null, t('msg.noChange')); // 변경사항이 없습니다.
			return;
		}

		//처리유형이 '기부'인경우
		if (reqFormData.potype === '10') {
			for (let i = 0; i < checkedRows.length; i++) {
				const row = checkedRows[i].item; // row items
				const rowIndex = checkedRows[i].rowIndex; // 원래 Row번호

				const etcqty = Number(row.etcqty) || 0;
				const potype = row.potype || '';
				const custkey = row.custkey || '';

				if (etcqty <= 0) {
					showAlert(null, `${rowIndex + 1}번째 행의 처리수량을 확인하시기 바랍니다.`);
					ref.gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('etcqty'));
					return;
				}

				if (potype.length < 1) {
					showAlert(null, `${rowIndex + 1}번째 행의 처리유형을 입력하시기 바랍니다.`);
					ref.gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('potype'));
					return;
				}

				if (custkey.length < 1) {
					showAlert(null, `${rowIndex + 1}번째 행의 거래처를 입력하시기 바랍니다.`);
					ref.gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('custkey'));
					return;
				}
			}

			// 저장하시겠습니까?
			showConfirm(null, t('msg.confirmSave'), () => {
				const params = {
					avc_DCCODE: props.fixdccode,
					avc_COMMAND: 'BATCHCONFIRM_DC',
					docdt: dayjs(reqFormData.wdDate).format('YYYYMMDD'),
					saveList: updatedItems, // 선택된 행의 데이터
				};

				apiSaveMasterList02(params).then(res => {
					if (res.statusCode === 0) {
						handleGridData2(res.data);
					}
				});
			});
		}

		if (reqFormData.potype === '3') {
			//처리유형이 '매각'인경우
			for (let i = 0; i < checkedRows.length; i++) {
				const row = checkedRows[i].item; // row items
				const rowIndex = checkedRows[i].rowIndex; // 원래 Row번호

				const etcqty = Number(row.etcqty) || 0;
				const disposeAmount = Number(row.disposeAmount) || 0;
				const potype = row.potype || '';

				if (etcqty <= 0) {
					showAlert(null, `${rowIndex + 1}번째 행의 처리수량을 확인하시기 바랍니다.`);
					ref.gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('toOrderqty'));
					return;
				}

				if (disposeAmount <= 0) {
					showAlert(null, `${rowIndex + 1}번째 행의 매각금액 확인하시기 바랍니다.`);
					ref.gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('disposeAmount'));
					return;
				}

				if (potype.length < 1) {
					showAlert(null, `${rowIndex + 1}번째 행의 처리유형을 입력하시기 바랍니다.`);
					ref.gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('potype'));
					return;
				}
			}

			// 저장하시겠습니까?
			showConfirm(null, t('msg.confirmSave'), () => {
				const params = {
					disposeDate: dayjs(reqFormData.wdDate).format('YYYYMMDD'),
					saveList: updatedItems, // 선택된 행의 데이터
				};

				apiSaveMasterList01(params).then(res => {
					if (res.statusCode === 0) {
						handleGridData2(res.data);
					}
				});
			});
		}
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		const gridRef = ref.gridRef.current;

		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef.setSelectionByIndex(0);
		});

		// 셀 편집 시작 전
		gridRef.bind('cellEditBegin', (event: any) => {
			if (gridRef) {
				// 셀 편집 시작 이벤트 바인딩
				gridRef?.bind('cellEditBegin', function (event: any) {
					// 등록(00) 상태인 경우에만 편집 허용
					if (!isDisabled(event.item)) {
						return true;
					} else {
						return false;
					}
				});
			}

			if (
				event.dataField != 'etcqty' &&
				event.dataField != 'reasoncode' &&
				event.dataField != 'reasonmsg' &&
				event.dataField != 'other05' &&
				event.dataField != 'costcd' &&
				event.dataField != 'custkey' &&
				event.dataField != 'other03' &&
				event.dataField != 'disposeAmount'
			) {
				return false;
			}
		});

		// 셀 편집 완료 이벤트 바인딩
		gridRef.bind('cellEditEnd', (event: any) => {
			handleCellEditEnd(event, ref, t);
		});
	};

	/**
	 * =====================================================================
	 * 그리드 셀 편집 완료 이벤트 처리 함수
	 * - 조정수량 변경 시: 양수 검증 + 총중량/폐기비용 자동 계산
	 * - 귀책(최종) 변경 시: 기존 귀책과 비교하여 변경구분 자동 설정
	 * - 귀속부서 코드 변경 시: 귀속부서명 클리어
	 * @param {object} event - AUIGrid 셀 편집 이벤트 객체
	 * @param {any} ref - 그리드 ref 객체
	 * @param {Function} t - 번역 함수
	 * @param {string} costperkg - KG당 폐기비용
	 * =====================================================================
	 */
	const handleCellEditEnd = (event: any, ref: any, t: any) => {
		const { value, item, oldValue } = event;
		const gridRef = ref.gridRef.current;

		// 귀속부서 코드 편집 시 처리 - 부서명 클리어
		if (event.dataField === 'costcd') {
			const updatedRow = {
				...item,
				costcd: value,
				costcdname: '', // 부서명 클리어
				rowStatus: 'U',
			};
			gridRef.updateRowsById([updatedRow], true);
			return;
		} // 거래처 코드 편집 시 처리 - 거래처명 클리어
		else if (event.dataField === 'custkey') {
			const updatedRow = {
				...item,
				custkey: value,
				custname: '', // 거래처명 클리어
				rowStatus: 'U',
			};
			gridRef.updateRowsById([updatedRow], true);
			return;
		}
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 선택적용
				callBackFn: applySelectedDataCallback,
			},
			{
				btnType: 'save',
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * 팝업조회
	 * @param selectedRow
	 * @returns {void}
	 */
	const confirmPopup = (selectedRow: any) => {
		const gridRef = ref.gridRef.current;

		setTimeout(() => {
			if (popupType === 'cucostCenterst') {
				gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'respDeptCd', selectedRow[0].code);
				gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'respDeptNm', selectedRow[0].name);
			}
			refModalPop.current.handlerClose();
		}, 0);
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refModalPop.current.handlerClose();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 컴포넌트 마운트 시 그리드 이벤트 초기화
	 * - 셀 편집 완료 이벤트 바인딩
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.gridRef.current;

		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="h100">
				<GridTopBtn gridBtn={gridBtn} gridTitle="기타출고목록" totalCnt={props.totalCnt} />
				{/* START.일괄적용영역 */}
				<UiDetailViewArea>
					<Form form={props.form} initialValues={initialValues}>
						<UiDetailViewGroup>
							<li>
								<DatePicker
									name="wdDate"
									label={t('lbl.TASKDT_RT')} // 처리일자
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li>
								<SelectBox
									name="potype"
									span={24}
									options={getCommonCodeList('PROCESSTYPE_ETC', '선택', '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.STOCKTRANSTYPE')} // 처리유형
									onFocus={handlePotypeFocus} // 포커스 될 때 현재값 저장
									//onChange={onChange}
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li>
								<SelectBox
									name="reasoncode"
									span={24}
									options={getCommonCodeList('PROCESSREASON_ETC', '선택', '').filter(item => {
										return item.comCd === '' || item.data4 === '2170';
									})}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.PROCESSREASON_ETC')} // 처리사유
									disabled={reasoncodeDisabled}
								/>
							</li>
							<li>
								<SelectBox
									name="reasonmsg"
									span={24}
									options={getCommonCodeList('REASONDETAIL_ETC', '선택', '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.REASONDTL_ETC')} // 세부사유
									disabled={reasonmsgDisabled}
								/>
							</li>
							<li>
								<SelectBox
									name="other05"
									span={24}
									options={getCommonCodeList('YN', '전체', '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.OTHER05_DMD_AJ')} // 물류귀책배부
									disabled={other05Disabled}
								/>
							</li>
							<li>
								<CmCostCenterSearch
									form={props.form}
									selectionMode="singleRow"
									name="costcdname"
									code="costcd"
									returnValueFormat="name"
								/>
							</li>
							<li>
								<CmCustSearch
									form={props.form}
									selectionMode="singleRow"
									name="custname"
									code="custkey"
									returnValueFormat="name"
								/>
							</li>

							<li>
								<InputText
									name="other03"
									label={t('lbl.MEMO1')} // 비고
									disabled={other03Disabled}
								/>
							</li>

							<li className="ta-r">
								<span>이 프로그램은 기부, 매각, 예외 조정들을 위한 조정 주문처리 프로그램 입니다.</span>
							</li>
						</UiDetailViewGroup>
					</Form>
				</UiDetailViewArea>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
			<CmSearchWrapper ref={refModal} />
			<CmSearchWrapper ref={refModal1} />
			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CustomModal ref={refModalPop} width="1000px">
				<CmSearchPopup type={popupType} callBack={confirmPopup} close={closeEvent} />
			</CustomModal>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={saveCloseEvent} />
			</CustomModal>
		</>
	);
});

export default WdShipmentETCTap1Detail;
