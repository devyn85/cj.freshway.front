/*
 ############################################################################
 # FiledataField	: WdShipmentExDCDetail.tsx
 # Description		: 외부비축출고처리
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.30
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import dayjs from 'dayjs';

// Utils
import { showAlert, showConfirm, showMessage } from '@/util/MessageUtil';
import commUtil from '@/util/commUtil';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodebyCd, getCommonCodeListByData } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import { Button, InputText, SelectBox } from '@/components/common/custom/form';
import KpKxCloseDocPopup from '@/components/kp/kxClose/KpKxCloseDocPopup';
import WdShipmentExDCPricePopup from '@/components/wd/shipmentExDC/WdShipmentExDCPricePopup';

// API
import { apiGetStatus } from '@/api/cm/apiCmCheckSAPClose';
import { apiPostSaveREFERENCE10 } from '@/api/wd/apiWdShipmentExDC';

interface WdShipmentExDCDetailProps {
	dccode: any;
	searchForm: any;
	gridData: any;
	totalCount: any;
	callBackFn: any;
}

const WdShipmentExDCDetail = forwardRef((props: WdShipmentExDCDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [form] = Form.useForm();
	const refDocumentModal = useRef(null);

	// grid Ref
	ref.gridRef = useRef();

	// 전역 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 그리드 표시된 데이터 건수
	const [currentCount, setCurrentCount] = useState(0);

	const [fromSlipdt, setFromSlipdt] = useState();
	const [toSlipdt, setToSlipdt] = useState();
	const [selectedRow, setSelectedRow] = useState<any>(null);

	// 트랜잭션 팝업 Ref
	const refTranModal = useRef(null);

	// 운송비 팝업 Ref
	const refPriceModal = useRef(null);

	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});

	// transaction 처리 건수
	const [trProcessCnt, setTrProcessCnt] = useState({});

	// 그리드에서 선택한 데이터
	const [checkedList, setCheckedList] = useState(null);

	// 가/진오더여부 코드
	const realYnLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('REAL_YN', value)?.cdNm;
	};

	// 그리드 컬럼 설정
	const gridCol = [
		{
			headerText: t('lbl.SLIPINFO'), //전표정보
			children: [
				{
					dataField: 'slipno',
					headerText: t('lbl.WD_SLIPNO'), //출고전표번호
					dataType: 'code',
					editable: false,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							setSelectedRow(e.item); // 선택한 row를 state로 저장
							refDocumentModal.current?.handlerOpen();
						},
					},
				},
				{
					dataField: 'slipdt',
					headerText: t('lbl.SLIPDT_WD'), //출고전표일자
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.TODCINFO'), //공급센터정보
			children: [
				{
					dataField: 'dccode',
					headerText: t('lbl.DCCODE'), //물류센터
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'organize',
					headerText: t('lbl.ORGANIZE'), //창고
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'organizeName',
					headerText: t('lbl.ORGANIZENAME'), //창고명
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.DOCINFO'), //문서정보
			children: [
				{
					dataField: 'docno',
					headerText: t('lbl.DOCNO_WD'), //주문번호
					dataType: 'code',
					editable: false,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							setSelectedRow(e.item); // 선택한 row를 state로 저장
							refDocumentModal.current?.handlerOpen();
						},
					},
				},
				{
					dataField: 'docdt',
					headerText: t('lbl.DOCDT_WD'), //출고일자
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
				{
					dataField: 'ordertypeName',
					headerText: t('lbl.ORDERTYPE_WD'), //주문유형
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			dataField: 'deliverytypename',
			headerText: t('lbl.DELIVERY_TYPE'), //출고방법
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'stoflag',
			headerText: t('lbl.STO_FLAG_YN'), //STO주문여부
			dataType: 'code',
			editable: false,
		},
		// {
		// 	dataField: 'invoiceCrtType',
		// 	headerText: t('lbl.DELIVERY_TYPE'), //출고방법
		// 	renderer: {
		// 		// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
		// 		type: 'DropDownListRenderer',
		// 		list: getCommonCodeList('DELIVERYTYPE_FS', ''),
		// 		keyField: 'comCd', // key 에 해당되는 필드명
		// 		valueField: 'cdNm',
		// 	},
		// 	editable: true,
		// },
		{
			dataField: 'toCustkey',
			headerText: t('lbl.FROM_CUSTKEY_RT'), //관리처코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toCustname',
			headerText: t('lbl.FROM_CUSTNAME_RT'), //관리처명
			editable: false,
		},
		{
			dataField: 'statusname',
			headerText: t('lbl.STATUS'), //진행상태
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKUCD'), //상품코드
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'), //상품명칭
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'storagetypename',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPERBOX'), //박스입수
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.ORDERUNIT'), //주문단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'orgorderqty',
			headerText: t('lbl.SDORDERQTY'), //영업주문수량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY'), //주문수량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.QTY_WD'), //출고수량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'shortageqty',
			headerText: t('lbl.SHORTAGEQTY'), //결품수량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'tranqty',
			headerText: t('lbl.QCCONFIRMQTY_WD'), //출고처리량
			dataType: 'numeric',
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				showEditorBtnOver: false,
				onlyNumeric: true,
				allowPoint: true,
				allowNegative: true,
				textAlign: 'right',
				maxlength: 10,
				autoThousandSeparator: true,
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				if (!(item?.dpInplanStatus === '90')) {
					// 입고센터에서 입고확정하기 이전에는 수정할 수 있음
					return 'isEdit';
				}
				ref.gridRef.current.removeEditClass(columnIndex);
			},
			formatString: '#,##0.###',
		},
		{
			dataField: 'shortagetranqty',
			headerText: t('lbl.SHORTAGETRANQTY_WD'), //결품처리량
			dataType: 'numeric',
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				showEditorBtnOver: false,
				onlyNumeric: true,
				allowPoint: true,
				allowNegative: true,
				textAlign: 'right',
				maxlength: 10,
				autoThousandSeparator: true,
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				if (!(item?.dpInplanStatus === '90')) {
					// 입고센터에서 입고확정하기 이전에는 수정할 수 있음
					return 'isEdit';
				}
				ref.gridRef.current.removeEditClass(columnIndex);
			},
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.REASONINFO'), //결품정보
			children: [
				{
					dataField: 'reasoncode',
					headerText: t('lbl.REASONCODE_WD'), //결품사유
					renderer: {
						// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
						type: 'DropDownListRenderer',
						list: getCommonCodeListByData('REASONCODE_WD', null, 'EX', null, null, ''),
						keyField: 'comCd', // key 에 해당되는 필드명
						valueField: 'cdNm',
					},
					editable: true,
				},
				{
					dataField: 'reasonmsg',
					headerText: t('lbl.RESULTMSG'), //처리결과
					editable: true,
				},
			],
		},
		{
			headerText: t('lbl.BOXCALINFO'), //박스환산정보
			children: [
				{
					dataField: 'avgweight',
					headerText: t('lbl.AVGWEIGHT'), //평균중량
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'realorderbox',
					headerText: t('lbl.REALOPENBOX'), //실박스예정
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'realcfmbox',
					headerText: t('lbl.REALCFMBOX'), //실박스확정
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'tranbox',
					headerText: t('lbl.TRANBOXQTY'), //작업박스수량
					dataType: 'numeric',
					editable: true,
					styleFunction: (
						rowIndex: number,
						columnIndex: number,
						value: any,
						headerText: string,
						item: any,
						dataField: any,
					) => {
						if (item?.boxflag === 'Y') {
							return 'isEdit';
						}
						ref.gridRef.current.removeEditClass(columnIndex);
					},
					editRenderer: {
						type: 'InputEditRenderer',
						showEditorBtnOver: false,
						onlyNumeric: true,
						allowPoint: false,
						allowNegative: true,
						textAlign: 'right',
						maxlength: 10,
						autoThousandSeparator: true,
					},
				},
			],
		},
		{
			headerText: t('lbl.SKUINFO'), //상품이력정보
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'), //이력번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'), //바코드
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'), //B/L번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contracttype',
					headerText: t('lbl.CONTRACTTYPE'), //계약유형
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'), //계약업체
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'), //계약업체명
					editable: false,
				},
			],
		},
		{
			dataField: 'lottable01',
			headerText: t('lbl.LOTTABLE01'), //기준일(유통,제조)
			dataType: 'code',
			editable: false,
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) || value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD') ?? '';
			},
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM2'), //소비기간(잔여/전체)
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'trandeliveryprice',
			headerText: t('lbl.DELIVERYFEE_SUPPLY_EXDC'), //운송료(공급가)
			dataType: 'numeric',
			editable: true,
			styleFunction: (
				rowIndex: number,
				columnIndex: number,
				value: any,
				headerText: string,
				item: any,
				dataField: any,
			) => {
				// STO 이체 & ( 출고예정 || 입고센터에서 확정하기 이전  )
				if (
					item?.stoflag === 'Y' &&
					(commUtil.getByteLength(item.toCustkey) === 4 || item.toCustkey.substr(0, 4) === '1000') &&
					(item.status === '30' || item.dpInplanStatus !== '90')
				) {
					return 'isEdit';
				}
				ref.gridRef.current.removeEditClass(columnIndex);
			},
			editRenderer: {
				type: 'InputEditRenderer',
				showEditorBtnOver: false,
				onlyNumeric: true,
				allowPoint: true,
				allowNegative: false,
				textAlign: 'right',
				maxlength: 10,
				autoThousandSeparator: true,
			},
		},
		{
			dataField: 'reference09',
			headerText: t('lbl.STORAGEFEE'), //보관료
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'pokey',
			headerText: t('lbl.PONO'), //PO번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'poline',
			headerText: t('lbl.POLINE'), //PO항번
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'realYn',
			headerText: t('lbl.REAL_YN'), //가/진오더여부
			dataType: 'code',
			editable: false,
			labelFunction: realYnLabelFunc,
		},

		{
			dataField: 'addwhoNm',
			headerText: t('lbl.ADDWHO'), //등록자
			dataType: 'manager',
			managerDataField: 'addWho',
			editable: false,
		},
		{
			dataField: 'adddate',
			headerText: t('lbl.REGDATTM'), //등록일시
			dataType: 'code',
			editable: false,
		},

		{
			dataField: 'editwhoNm',
			headerText: t('lbl.CONFIRMWHO'), //확정자명
			dataType: 'manager',
			managerDataField: 'editwho',
			editable: false,
		},
		{
			dataField: 'editdate',
			headerText: t('lbl.CONFIRMDATE'), //확정시간
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'invoiceCrtType',
			headerText: t('lbl.FROM_CUSTKEY_RT'), //출고방법
			visible: false,
		},
		{
			dataField: 'addwho',
			visible: false,
		},
		{
			dataField: 'editwho',
			visible: false,
		},
		{
			dataField: 'reference08', //주문수량에 대한 총 보관료
			visible: false,
		},
		{
			dataField: 'other05', //과세,면세 구분(비율)
			visible: false,
		},
		{
			dataField: 'reference10', //운송료
			visible: false,
		},
		{
			dataField: 'channel', //배송채널
			visible: false,
		},
		{
			dataField: 'serialorderqty',
			visible: false,
		},
		{
			dataField: 'serialinspectqty',
			visible: false,
		},
		{
			dataField: 'serialscanweight',
			visible: false,
		},
		{
			dataField: 'line01',
			visible: false,
		},
		{
			dataField: 'docline',
			visible: false,
		},
		{
			dataField: 'stockid',
			visible: false,
		},
		{
			dataField: 'slipline',
			visible: false,
		},
		{
			dataField: 'area',
			visible: false,
		},
		{
			dataField: 'exdcrateYn',
			visible: false,
		},
		{
			dataField: 'weight',
			visible: false,
		},
		{
			dataField: 'storagetype',
			visible: false,
		},
		{
			dataField: 'serialkey',
			visible: false,
		},
		{
			dataField: 'serialkeyGroup',
			visible: false,
		},
		{
			dataField: 'trandeliverypricepre',
			visible: false,
		},
		{
			dataField: 'boxflag',
			visible: false,
		},
		{
			dataField: 'status',
			visible: false,
		},
		{
			dataField: 'dpInplanStatus',
			visible: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
		showFooter: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.shortageqty > 0 && item.orderqty === item.shortageqty) {
				// 전체 결품처리가 있으면 색상 표시함
				return 'color-danger';
			}
			return '';
		},
		rowCheckDisabledFunction: function (rowIndex, isChecked, item) {
			if (item.realYn === 'T') {
				// 가진오더여부가 'T'이면 disabeld 처리함
				return false;
				// } else if (item.status === '90') {
				// 	// 출고확정 상태이면 disabeld 처리함
				// 	return false;
			}
			return true;
		},
	};

	// 그리드 푸터 레이아웃
	const footerLayout = [
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
			dataField: 'reference09',
			positionField: 'reference09',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'trandeliveryprice',
			positionField: 'trandeliveryprice',
			operation: 'SUM',
			formatString: '#,##0',
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

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 선택한 행에 결품사유와 처리결과를 일괄 적용한다
	 */
	const onClickApplySelect = () => {
		const checkedItems = ref.gridRef.current?.getCheckedRowItems();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		const reasoncode = form.getFieldValue('reasoncode') ? form.getFieldValue('reasoncode') : '';
		const reasonmsg = form.getFieldValue('reasonmsg') ? form.getFieldValue('reasonmsg') : '';

		for (const item of checkedItems) {
			ref.gridRef.current?.setCellValue(item.rowIndex, 'reasoncode', reasoncode);
			ref.gridRef.current?.setCellValue(item.rowIndex, 'reasonmsg', reasonmsg);
		}
	};

	/**
	 * 수량 적용 (체크한 행에 적용 [입고작업량 = (구매수량 - 입고수량 - 결품수량)] 채워넣기)
	 */
	const onClickInputQtySelect = () => {
		const checkedItems = ref.gridRef.current?.getCheckedRowItems();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		for (const item of checkedItems) {
			// if (item.item.channel === '1' || globalVariable.gStorerkey === 'FW00') {
			// 	const tranqty = item.item.serialorderqty - item.item.serialinspectqty;
			// 	ref.gridRef.current.setCellValue(item.rowIndex, 'tranqty', tranqty);
			// } else {
			// 	const tranqty = item.item.orderqty - item.item.confirmqty;
			// 	ref.gridRef.current.setCellValue(item.rowIndex, 'tranqty', tranqty);
			// }

			const tranqty = item.item.orderqty - item.item.confirmqty;
			ref.gridRef.current.setCellValue(item.rowIndex, 'tranqty', tranqty);
		}
	};

	/**
	 * 선택된 행의 데이터를 기반으로 특정 칼럼의 값을 계산한다.
	 * @param {any} evnt 이벤트
	 * @param event
	 */
	const calculateColumnValue = (event: any) => {
		// 선택된 행의 데이터를 가져온다.
		if (event.dataField === 'tranqty') {
			// tranqty가 변경되었을 때, 다른 칼럼의 값을 계산한다.
			const rowIndex = event.rowIndex;
			const tranqty = event.item.tranqty ?? 0;
			const confirmqty = event.item.confirmqty ?? 0;
			const shortageqty = event.item.shortageqty ?? 0;
			const orderqty = event.item.orderqty ?? 0;
			const total = event.item.reference08 ?? 0;
			const shortagetranqty = event.item.shortagetranqty ?? 0;
			const storagefee = Math.round(total * ((tranqty + confirmqty) / orderqty));
			const uom = event.item.uom ?? '';
			ref.gridRef.current.setCellValue(rowIndex, 'reference09', storagefee);

			if (uom === 'KG' && confirmqty === 0 && shortageqty === 0) {
				let qty = orderqty - tranqty;
				if (qty < 0) {
					qty = 0;
				}

				if (tranqty < 0) {
					qty = 0;
				}
				ref.gridRef.current.setCellValue(rowIndex, 'shortagetranqty', qty);
			}
		}

		if (event.dataField === 'trandeliveryprice') {
			// trandeliveryprice 변경되었을 때, 다른 칼럼의 값을 계산한다.
			const rowIndex = event.rowIndex;
			let trandeliveryprice;
			if (commUtil.isEmpty(event.item.trandeliveryprice)) {
				trandeliveryprice = 0;
			} else {
				trandeliveryprice = event.item.trandeliveryprice;
			}
			//const deliveryfee = Math.round(trandeliveryprice * event.item.other05);
			const deliveryfee = Math.round(trandeliveryprice);
			ref.gridRef.current.setCellValue(rowIndex, 'reference10', deliveryfee);
		}
	};

	/**
	 * SAP 마감여부 조회
	 * @param {any[]} checkedItems
	 * @param {string} procType 출고(WD), 결품(SH) 구분
	 * @returns {bool} 조회결과
	 */
	const getSapCloseStatus = async (checkedItems: any[], procType: string) => {
		for (const item of checkedItems) {
			//const qty = procType === 'WD' ? item.tranqty : item.shortagetranqty;
			const qty = item.tranqty;

			if (qty > 0) {
				const params = {
					docno: item.docno,
					docline: item.docline,
					deliverydate: item.slipdt,
				};
				const res = await apiGetStatus(params);
				if (res.data.result !== 'Y') {
					showMessage({
						content: res.data.errorMsg,
						modalType: 'error',
					});
					return false;
				}
			}
		}
		return true;
	};

	/**
	 * Helper: 비정량 상품 수량 차이 체크
	 * @param {any[]} checkedItems
	 * @returns {string} 수량차이여부
	 */
	const checkNonQuantitativeDiff = (checkedItems: any[]) => {
		let msgYn;

		for (const item of checkedItems) {
			if (item.tranqty > 0 && item.line01 === 'Y') {
				const tranqty = item.tranqty;
				const orderqty = item.orderqty;
				if (tranqty >= 1 && tranqty <= 2000) {
					if (100 - (tranqty / orderqty) * 100 <= 5 && 100 - (tranqty / orderqty) * 100 >= -5) {
						msgYn = 'N';
					} else {
						msgYn = 'Y';
						break;
					}
				} else if (tranqty > 2000 && tranqty <= 4000) {
					if (100 - (tranqty / orderqty) * 100 <= 2.5 && 100 - (tranqty / orderqty) * 100 >= -2.5) {
						msgYn = 'N';
					} else {
						msgYn = 'Y';
						break;
					}
				} else if (tranqty > 4000) {
					if (100 - (tranqty / orderqty) * 100 <= 1.5 && 100 - (tranqty / orderqty) * 100 >= -1.5) {
						msgYn = 'N';
					} else {
						msgYn = 'Y';
						break;
					}
				} else if (tranqty === 0) {
					showMessage({
						content: '수량을 입력하신 후 확정처리 바랍니다.',
						modalType: 'warning',
					});
					msgYn = 'STOP';
					break;
				} else if (tranqty < 0) {
					msgYn = 'N';
				}
			} else {
				msgYn = 'N';
			}
		}

		return msgYn;
	};

	/**
	 * 전표대상을 확정 처리한다.
	 */
	// const confirmDoc = async () => {
	// 	const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

	// 	if (checkedItems.length < 1) {
	// 		showAlert(null, t('msg.MSG_COM_VAL_010'));
	// 		return;
	// 	}

	// 	for (const item of checkedItems) {
	// 		if (commUtil.isEmpty(item.exdcrateYn) || item.exdcrateYn === 'N') {
	// 			showMessage({
	// 				content: '상품 요율 등록 후 확정처리 바랍니다.',
	// 				modalType: 'warning',
	// 			});
	// 			return;
	// 		}
	// 	}

	// 	// SAP 마감여부 체크
	// 	// const sapCheck = await getSapCloseStatus(checkedItems, 'WD');
	// 	// if (!sapCheck) return;

	// 	// 비정량 상품일때 수량 차이 체크
	// 	const msgYn = checkNonQuantitativeDiff(checkedItems);
	// 	if (msgYn === 'STOP') return;

	// 	const confirmAction = () => loopTransaction(checkedItems, 0, checkedItems.length, 'CONFIRM', 'WD');

	// 	if (msgYn === 'Y') {
	// 		showConfirm(null, '계근 확인 중량에 대해 재확인 후 확정처리 바랍니다. (확인: 확정처리, 닫기: 취소)', () => {
	// 			confirmAction();
	// 		});
	// 	} else {
	// 		showConfirm(null, '출고대상 확정하시겠습니까?', async () => {
	// 			confirmAction();
	// 		});
	// 	}
	// };

	/**
	 * 결품처리 전표대상을 확정 처리한다.
	 */
	// const confirmDocShortage = async () => {
	// 	const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

	// 	if (checkedItems.length < 1) {
	// 		showAlert(null, t('msg.MSG_COM_VAL_010'));
	// 		return;
	// 	}

	// 	// SAP 마감여부 체크
	// 	// const sapCheck = await getSapCloseStatus(checkedItems, 'SH');
	// 	// if (!sapCheck) return;

	// 	// 결품사유코드 입력 체크
	// 	for (const item of checkedItems) {
	// 		if (commUtil.isEmpty(item.reasoncode)) {
	// 			showMessage({
	// 				content: '결품사유코드를 입력하시기 바랍니다.',
	// 				modalType: 'warning',
	// 			});
	// 			return;
	// 		}
	// 	}

	// 	showConfirm(null, '결품대상 확정하시겠습니까?', async () => {
	// 		loopTransaction(checkedItems, 0, checkedItems.length, 'CONFIRM', 'SH');
	// 	});
	// };

	/**
	 * 전표종결 처리한다.
	 */
	// const closeDoc = () => {
	// 	const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

	// 	if (checkedItems.length < 1) {
	// 		showAlert(null, t('msg.MSG_COM_VAL_010'));
	// 		return;
	// 	}

	// 	const reasoncode = form.getFieldValue('reasoncode') ? form.getFieldValue('reasoncode') : '';
	// 	const reasonmsg = form.getFieldValue('reasonmsg') ? form.getFieldValue('reasonmsg') : '';

	// 	if (commUtil.isEmpty(reasoncode)) {
	// 		showMessage({
	// 			content: '사유코드를 입력하시기 바랍니다.',
	// 			modalType: 'warning',
	// 		});
	// 		return;
	// 	}

	// 	showConfirm(null, '전표종결 하시겠습니까?', () => {
	// 		loopTransaction(checkedItems, 0, checkedItems.length, 'WDCLOSE', '');
	// 	});
	// };

	/**
	 * 출고, 결품 확정
	 */
	const saveMasterLit = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const checkedItems = ref.gridRef.current?.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		let isVaidate = true;

		//출고처리와 결품처리를 모두 입력했는지 체크
		for (const item of checkedItems) {
			// if (item.tranqty !== 0 && item.shortagetranqty !== 0) {
			// 	isVaidate = false;
			// 	showMessage({
			// 		content: '출고처리량과 결품처리량을 함께 입력할 수 없습니다.',
			// 		modalType: 'warning',
			// 	});

			// 	break;
			// } else
			if (item.tranqty === 0 && item.shortagetranqty === 0) {
				isVaidate = false;
				showMessage({
					content: '출고처리량이나 결품처리량을 입력하세요.',
					modalType: 'warning',
				});

				break;
			}
		}

		if (!isVaidate) {
			return;
		}

		// 상품 요율 등록 체크
		for (const item of checkedItems) {
			if ((item.tranqty > 0 && commUtil.isEmpty(item.exdcrateYn)) || item.exdcrateYn === 'N') {
				showMessage({
					content: '상품 요율 등록 후 확정처리 바랍니다.',
					modalType: 'warning',
				});

				return;
			}
		}

		if (!isVaidate) {
			return;
		}

		//결품처리량이 0이 아니면 결품사유코드 입력 체크
		for (const item of checkedItems) {
			if (item.shortagetranqty !== 0 && commUtil.isEmpty(item.reasoncode)) {
				isVaidate = false;
				showMessage({
					content: '결품사유코드를 입력하시기 바랍니다.',
					modalType: 'warning',
				});

				return;
			}
		}

		if (!isVaidate) {
			return;
		}

		// 비정량 상품일때 수량 차이 체크
		const msgYn = checkNonQuantitativeDiff(checkedItems);
		if (msgYn === 'STOP') return;

		const confirmAction = () => loopTransaction(checkedItems, 0, checkedItems.length, 'CONFIRM');

		if (msgYn === 'Y') {
			showConfirm(null, '계근 확인 중량에 대해 재확인 후 확정처리 바랍니다. (확인: 확정처리, 닫기: 취소)', () => {
				confirmAction();
			});
		} else {
			showConfirm(null, '확정하시겠습니까?', async () => {
				confirmAction();
			});
		}
	};

	/**
	 * 연쇄 트랜잭션 호출 함수
	 * @param {any} rowItems 전송 대상
	 * @param {number} index 현재 순번
	 * @param {number} total 전체 대상 건수
	 * @param {string} avcCommnd 프로시저명  ('CONFIRM':확정, 'BATCHCONFIRM':저장, 'WDCLOSE':전표종결)
	 * @param cfmPrcType
	 */
	const loopTransaction = (rowItems: any, index: number, total: number, avcCommnd: string) => {
		const reasoncode = form.getFieldValue('reasoncode') ? form.getFieldValue('reasoncode') : '';
		const reasonmsg = form.getFieldValue('reasonmsg') ? form.getFieldValue('reasonmsg') : '';

		let saveParams = {};
		if (avcCommnd === 'WDCLOSE') {
			saveParams = {
				apiUrl: '/api/wd/shipmentexdc/v1.0/saveMasterList',
				avc_DCCODE: props.dccode,
				avc_COMMAND: avcCommnd,
				fixdccode: props.dccode,
				inReasoncode: reasoncode,
				inReasonmsg: reasonmsg,
				//confirmPrcType: cfmPrcType,
				saveDataList: rowItems,
			};
		} else {
			saveParams = {
				apiUrl: '/api/wd/shipmentexdc/v1.0/saveMasterList',
				avc_DCCODE: props.dccode,
				avc_COMMAND: avcCommnd,
				fixdccode: props.dccode,
				///confirmPrcType: cfmPrcType,
				saveDataList: rowItems,
			};
		}

		setLoopTrParams(saveParams);
		refTranModal.current?.handlerOpen();
	};

	/**
	 * 트랜잭션 팝업 닫기
	 */
	const closeEventTranPopup = () => {
		refTranModal.current?.handlerClose();

		if (trProcessCnt) {
			if (trProcessCnt.total === trProcessCnt.success) {
				props.callBackFn?.();
			}
		}
	};

	/**
	 * 문서정보 팝업 닫기
	 */
	const closeDocPopup = () => {
		refDocumentModal.current.handlerClose();
	};

	/**
	 * 운송료 저장 함수
	 */
	const saveREFERENCE10 = () => {
		const checkedItems = ref.gridRef.current?.getCheckedRowItemsAll();
		const params = {
			saveList: checkedItems,
		};

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		for (const item of checkedItems) {
			if (item.trandeliveryprice === null || item.trandeliveryprice === undefined) {
				showAlert(null, '운송료를 입력하시기 바랍니다.');
				return;
			}
			if (
				!(
					item.stoflag === 'Y' &&
					(commUtil.getByteLength(item.toCustkey) === 4 || item.toCustkey.substr(0, 4) === '1000') &&
					(item.status === '30' || item.dpInplanStatus !== '90')
				)
			) {
				// STO 이체 & ( 출고예정 || 입고센터에서 확정하기 이전  )
				showAlert(null, 'STO 오더(FW센터 입고 미확정)만 운송료 입력이 가능합니다.');
				return;
			}
		}

		ref.gridRef.current.showConfirmSave(() => {
			apiPostSaveREFERENCE10(params).then(res => {
				if (res.statusCode === 0) {
					props.callBackFn?.();
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
				}
			});
		});
	};

	/**
	 * 운송비 팝업을 호출한다.
	 */
	const openPricePopup = () => {
		// 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		let custkeyInput = checkedItems[0].toCustkey;
		let organizeInput = checkedItems[0].organize;
		const storagetypeInput = checkedItems[0].storagetype;
		let serialkeyGroupInput =
			!commUtil.isEmpty(checkedItems[0].serialkeyGroup) && checkedItems[0].serialkeyGroup !== null
				? checkedItems[0].serialkeyGroup
				: null;

		for (const item of checkedItems) {
			const stoflag = item.stoflag;
			const toCustkey = item.toCustkey;
			const organize = item.organize;
			const realYn = item.realYn;
			const dpInplanStatus = item.dpInplanStatus;
			const serialkeyGroup =
				!commUtil.isEmpty(item.serialkeyGroup) && item.serialkeyGroup !== null ? item.serialkeyGroup : null;

			if (
				stoflag === 'Y' &&
				(commUtil.getByteLength(toCustkey) === 4 || toCustkey.substr(0, 4) === '1000') &&
				(item.status === '30' || dpInplanStatus !== '90')
			) {
				// STO 이체 & ( 출고예정 || 입고센터에서 확정하기 이전  )
				if (toCustkey !== custkeyInput) {
					showAlert(null, '동일한 관리처로 운송료 입력이 가능합니다.');
					return;
				}

				if (organize !== organizeInput) {
					showAlert(null, '동일한 출발 창고로 운송료 입력이 가능합니다.');
					return;
				}

				// if (storagetype !== storagetypeInput) {
				// 	showAlert(null, '동일한 저장조건으로 운송비 입력이 가능합니다.');
				// 	return;
				// }

				if (serialkeyGroup !== null && serialkeyGroupInput != null && serialkeyGroup !== serialkeyGroupInput) {
					showAlert(null, '다른 운송료를 입력한 출고 건을 함께 처리할 수 없습니다.');
					return;
				}
			} else {
				showAlert(null, 'STO 오더(FW센터 입고 미확정)만 운송료 입력이 가능합니다.');
				return;
			}

			custkeyInput = item.toCustkey;
			organizeInput = item.organize;
			serialkeyGroupInput =
				!commUtil.isEmpty(serialkeyGroup) && serialkeyGroup !== null ? serialkeyGroup : serialkeyGroupInput;
		}

		// 조회 조건
		const searchParams = dataTransform.convertSearchData(props.searchForm.getFieldsValue());
		setFromSlipdt(dayjs(searchParams.slipdtRange[0]).format('YYYYMMDD'));
		setToSlipdt(dayjs(searchParams.slipdtRange[1]).format('YYYYMMDD'));
		// organize: searchParams.organize,
		// fromCustkey: searchParams.fromCustkey,
		// wdCustkey: searchParams.wdCustkey,
		// status: searchParams.status,
		// sku: searchParams.skuCode,
		// contracttypeSn: searchParams.contracttypeSn,
		// storagetype: searchParams.storagetype,
		// docno: searchParams.docno,
		// blno: searchParams.blno,
		// serialno: searchParams.serialno,

		// 그리드에서 선택한 데이터
		setCheckedList(ref.gridRef.current.getCheckedRowItemsAll());

		refPriceModal.current?.handlerOpen();
	};

	/**
	 * 운송비 팝업 닫기
	 * @param {any} param
	 */
	const closeEventPricePopup = (param: any) => {
		refPriceModal.current?.handlerClose();

		if (!commUtil.isEmpty(param) && param === 'R') {
			props.callBackFn();
		}
	};

	/**
	 * 그리드 데이터를 엑셀 다운로드한다.
	 */
	const excelDownload = () => {};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'btn1', //운송비팝업
					callBackFn: openPricePopup,
				},
				{
					btnType: 'btn5', //운송비저장
					callBackFn: saveREFERENCE10,
				},
				{
					btnType: 'btn2', //확정
					callBackFn: saveMasterLit,
				},
				// {
				// 	btnType: 'btn3', //결품대상확정
				// 	callBackFn: confirmDocShortage,
				// },
				// {
				// 	btnType: 'btn4', //전표종결
				// 	callBackFn: closeDoc,
				// },
				// {
				// 	btnType: 'save', //저장(처리)
				// 	callBackFn: saveMasterLit,
				// },
				{
					btnType: 'excelDownload', //엑셀다운로드
					callBackFn: excelDownload,
				},
			],
		};

		return gridBtn;
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref.gridRef.current?.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 시작
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditBegin', (event: any) => {
			if (event.dataField === 'trandeliveryprice') {
				// 운송료 컬럼 편집 가능 여부
				// STO 이체 & ( 출고예정 || 입고센터에서 확정하기 이전  )
				if (
					event.item?.stoflag === 'Y' &&
					(commUtil.getByteLength(event.item?.toCustkey) === 4 || event.item?.toCustkey.substr(0, 4) === '1000') &&
					(event.item?.status === '30' || event.item?.dpInplanStatus !== '90')
				) {
					return true;
				} else {
					return false;
				}
			} else if (event.dataField === 'tranbox') {
				// 작업박스수량 컬럼 편집 가능 여부
				if (event.item.boxflag !== 'Y') {
					return false;
				} else {
					// 입고센터에서 입고확정하기 이전에는 수정할 수 있음
					if (event.item?.dpInplanStatus === '90') {
						return false;
					} else {
						return true;
					}
				}
			} else if (event.dataField === 'tranqty' || event.dataField === 'shortagetranqty') {
				// 출고처리량, 결품처리량 컬럼 편집 가능 여부
				// 입고센터에서 입고확정하기 이전에는 수정할 수 있음
				if (event.item?.dpInplanStatus === '90') {
					return false;
				} else {
					return true;
				}
			}
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditEnd', (event: any) => {
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			// ref.gridRef.current.addCheckedRowsByValue('serialkey', event.item.serialkey);
			calculateColumnValue(event);
		});

		/**
		 * 그리드 셀 더블클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellDoubleClick', (event: any) => {
			if (event.dataField === 'sku') {
				// 상품코드 셀 더블클릭하면 상품상세팝업 표시
				ref.gridRef.current.openPopup(event.item, 'sku');
			}
		});

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('selectionChange', (event: any) => {
			// const primeCell = event.primeCell;
			// 선택된 행의 상세 정보를 조회한다.
			//props.searchDtl(primeCell.item);
		});
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
	 * 데이터를 조회하면 그리드에 추가한다.
	 */
	useEffect(() => {
		if (ref.gridRef?.current && props.gridData) {
			ref.gridRef.current.setGridData(props.gridData);

			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리w드 크기에 맞추기
				const colSizeList = ref.gridRef.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef.current.setColumnSizeList(colSizeList);
			}

			setCurrentCount(ref.gridRef.current.getRowCount());
		}
	}, [props.gridData, ref.gridRef]);

	return (
		<>
			{/* 그리드 영역 정의 */}

			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={props.totalCount}>
					<Form form={form} layout="inline">
						<li>
							<SelectBox
								name="reasoncode"
								options={getCommonCodeListByData('REASONCODE_WD', null, 'EX', null, null, '', '', null)}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								placeholder="선택해주세요"
								className="bg-white"
								label={t('lbl.REASONCODE_WD')}
							/>
						</li>
						<li>
							<InputText
								name="reasonmsg"
								label={t('lbl.RESULTMSG')}
								placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.RESULTMSG')])}
								className="bg-white"
								allowClear
							/>
						</li>
					</Form>
					<Button size={'small'} onClick={onClickApplySelect}>
						{t('lbl.APPLY_SELECT')}
					</Button>
					<Button size={'small'} onClick={onClickInputQtySelect}>
						수량적용
					</Button>
				</GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>

			{/* 운송비 팝업 영역 정의 */}
			<CustomModal ref={refPriceModal} width="1000px">
				<WdShipmentExDCPricePopup
					closeEventHandler={closeEventPricePopup}
					sendData={checkedList}
					fromSlipdt={fromSlipdt}
					toSlipdt={toSlipdt}
				/>
			</CustomModal>

			{/* 트랜잭션 팝업 영역 정의 */}
			<CustomModal ref={refTranModal} width="1000px">
				<CmLoopTranPopup
					popupParams={loopTrParams}
					close={closeEventTranPopup}
					onResultChange={(success: number, fail: number, total: number) => {
						const tr = { total: total, success: success, fail: fail };
						setTrProcessCnt(tr);
					}}
				/>
			</CustomModal>

			{/* 문서정보 팝업 영역 정의 */}
			<CustomModal ref={refDocumentModal} width="1200px">
				<KpKxCloseDocPopup
					ref={ref.gridRef1}
					rowData={selectedRow} // rowData로 전달
					serialkey={'1'} // 선택한 행의 serialkey를 전달
					close={closeDocPopup}
				/>
			</CustomModal>
		</>
	);
});

export default WdShipmentExDCDetail;
