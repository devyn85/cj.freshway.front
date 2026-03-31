// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import dayjs from 'dayjs';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { Datepicker, InputNumber } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import { Button, Form, Modal } from 'antd/lib';
import OmPurchaseStorageAutoTotalPopupEmail from './OmPurchaseStorageAutoTotalPopupEmail';
import OmPurchaseStorageDetailCenterGrid from './OmPurchaseStorageDetailCenterGrid';
import OmPurchaseStorageDetailLeftGrid from './OmPurchaseStorageDetailLeftGrid';
import OmPurchaseStorageDetailRightGrid from './OmPurchaseStorageDetailRightGrid';

// API Call Function
import { apiPostReorderMasterOutSTO, apiPostReorderMasterPO } from '@/api/om/apiOmPurchaseModify';
import {
	apiGetDetailRightList,
	getLastCreation,
	recreationPurchaseTotal,
	savePoHoldYn,
	savePurchaseOutSTO,
	saveSuppImgLog,
	tmpSave,
} from '@/api/om/apiOmPurchaseStorageAutoTotal';

// Store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import Constants from '@/util/constants';

const OmPurchaseStorageAutoTotalOutDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	const [detailForm] = Form.useForm();
	const refModal = useRef(null);
	const refModal2 = useRef(null);
	const refTranModal = useRef(null);
	const refEmailModal = useRef(null);

	const [loopTrParams, setLoopTrParams] = useState({});
	const [lastCreation, setLastCreation] = useState('');
	const [poType, setPoType] = useState('');
	const [chkDiffTime, setChkDiffTime] = useState(false);
	const [purchaseCnt, setPurchaseCnt] = useState(0);
	const [allRowsVisible, setAllRowsVisible] = useState(true);
	const [selectedDetailRow, setSelectedDetailRow] = useState<any>(null);
	const [emailPopupDetailData, setEmailPopupDetailData] = useState<any[]>([]);
	const [emailPopupReceiverData, setEmailPopupReceiverData] = useState<any[]>([]);
	const inspectPopupRef = useRef<Window | null>(null);
	const inspectPopupMessageHandlerRef = useRef<((event: MessageEvent) => void) | null>(null);

	//출고추이 팝업
	let popupWindow: any = null;

	ref.gridRef = useRef<any>(null);
	const refDetailLeftGrid = useRef<any>(null);
	const refDetailCenterGrid = useRef<any>(null);
	const refDetailRightGrid = useRef<any>(null);

	const getGridCol = () => {
		return [
			{
				dataField: 'purchaseType',
				headerText: '발주구분',
				dataType: 'code',
				editable: false,
				labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
					return getCommonCodebyCd('PURCHASETYPE_PO', value)?.cdNm;
				},
			},
			{
				dataField: 'custKey',
				headerText: t('lbl.CUSTKEY_PO'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'custName',
				headerText: t('lbl.CUSTNAME_PO'),
				editable: false,
			},
			{
				dataField: 'dcCode',
				headerText: '수급센터',
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'dcName',
				headerText: '수급센터명',
				editable: false,
			},
			{
				dataField: 'organize',
				headerText: t('lbl.ORGANIZE'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'organizeName',
				headerText: t('lbl.ORGANIZENAME'),
				editable: false,
			},
			{
				dataField: 'sku',
				headerText: t('lbl.SKU'),
				dataType: 'code',
				editable: false,
				commRenderer: {
					type: 'popup',
					onClick: function (e: any) {
						e.item.skuDescr = e.item.skuName; // skuDescr 필드에 skuName 값을 설정
						ref.gridRef.current.openPopup(e.item, 'sku');
					},
				},
			},
			{
				dataField: 'skuName',
				headerText: t('lbl.SKUNAME'),
				editable: false,
			},
			{
				dataField: 'storageType',
				headerText: t('lbl.STORAGETYPE'),
				editable: false,
				dataType: 'code',
				visible: false,
			},
			{
				dataField: 'storageTypeNm',
				headerText: t('lbl.STORAGETYPE'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'serialYn',
				headerText: t('lbl.SERIALYN'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'line01',
				headerText: '비정량여부',
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'deliveryType',
				headerText: t('lbl.DELIVERYTYPE_PO'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'receiveDt',
				headerText: '입고예정일',
				dataType: 'date',
				formatString: 'yyyy-mm-dd',
				commRenderer: {
					type: 'calender',
					showExtraDays: true,
				},
				editable: true,
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					if (commUtil.isEmpty(item)) {
						return 'default';
					}
					if (item.rowType === 'parent') {
						return 'row-parent';
					}
					if (item.exhaustionStopYn === 'Y' || item.poHoldYn === 'Y') {
						return 'disabled';
					} else {
						return 'default';
					}
				},
			},
			{
				dataField: 'buyerKey',
				headerText: '수급담당',
				dataType: 'code',
				editable: false,
				labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
					return getCommonCodebyCd('BUYERKEY', value)?.cdNm;
				},
			},
			{
				dataField: 'autoExecDay',
				headerText: '자동발주산정기간',
				dataType: 'numeric',
				editable: false,
			},
			{
				headerText: '중단제어',
				children: [
					{
						dataField: 'controlType',
						headerText: t('lbl.CONTROLTYPE'),
						editable: false,
					},
					{
						dataField: 'controlFromDate',
						headerText: '시작일',
						dataType: 'date',
						editable: false,
					},
					{
						dataField: 'controlToDate',
						headerText: '종료일',
						dataType: 'date',
						editable: false,
					},
				],
			},
			{
				dataField: 'qty',
				headerText: t('lbl.ORDERQTY_2'),
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'shipQty',
				headerText: '당일예정출고수량',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'vendorConfirmQty',
				headerText: '업체확정량',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'receiveQty',
				headerText: '입고예정(당일)',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'afReceiveQty',
				headerText: '입고예정(당일이후)',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'stockQtyDisp',
				headerText: t('lbl.QTY_ST'),
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'stockQty',
				headerText: t('lbl.OPENQTY_ST'),
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'psbQty2',
				headerText: '주문차감현재고',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'psbQty',
				headerText: '주문차감가용재고',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'moveConfirmQty',
				headerText: '이동재고수량',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'fusibilityQty',
				headerText: '가용성점검',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'fusibilityQty2',
				headerText: '가용성점검2',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'qtyPicked',
				headerText: t('lbl.QTYPICKED_ST'),
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'reorderPoint',
				headerText: t('lbl.REORDERPOINT'),
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'stockGoal',
				headerText: t('lbl.TARGETPOQTY'),
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'uom',
				headerText: t('lbl.UOM'),
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'stockAvgDay',
				headerText: '일평균',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'maxStock',
				headerText: 'MAX',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'stockDay',
				headerText: t('lbl.STOCKDAY'),
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'label',
				headerText: '출고추이',
				editable: false,
				renderer: {
					type: 'ButtonRenderer',
					labelText: '출고추이',
					onClick: (event: any) => {
						const popupUrl = `/om/OmPurchaseStorageAutoTotalPopup?${Constants.WIN_POPUP.KEY}=${Constants.WIN_POPUP.VALUE}&filename=${event.item.sku}_${event.item.dcCode}`;

						const params = {
							...event.item,
							logId: '01',
						};
						saveSuppImgLog(params).then(res => {
							//img 조회 로그 생성
						});

						popupWindow = window.open(
							popupUrl,
							'OmPurchaseStorageAutoTotalPopup',
							`width=${'900px'},height=${'1200px'},left=0,top=0`,
						);
					},
					disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any) => {
						if (commUtil.isEmpty(value)) {
							return true;
						}
						return false;
					},
				},
			},
			// {
			// 	dataField: 'orderedQty',
			// 	headerText: '발주수량',
			// 	dataType: 'numeric',
			// 	editable: false,
			// },
			{
				dataField: 'stockQtyOutDisp',
				headerText: '외부창고 재고수량(EA)',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'stockQtyOutDispTrans',
				headerText: '외부창고 재고수량(BOX)',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'minOrderQty',
				headerText: '최소발주수량',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'orderQtyUnit',
				headerText: '발주수량단위',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'confirmQty',
				headerText: '확정오더량',
				dataType: 'numeric',
				formatString: '#,##0.##',
				editRenderer: {
					type: 'InputEditRenderer',
					onlyNumeric: true, // 0~9 까지만 허용
					allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
				},
				styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					if (commUtil.isEmpty(item)) {
						return 'default';
					}
					if (item.rowType === 'parent') {
						return 'row-parent';
					}
					if (item.exhaustionStopYn === 'Y' || item.poHoldYn === 'Y') {
						return 'disabled';
					} else if (item.stockQtyOutDispTrans - Math.ceil(item.wdInplanQty / item.boxCal) < value) {
						return 'fc-red';
					} else {
						return 'default';
					}
				},
			},
			{
				dataField: 'finalPlt',
				headerText: '확정오더량',
				visible: false,
			},
			// {
			// 	dataField: 'finalPltSum',
			// 	headerText: '확정오더량(합계)',
			// 	dataType: 'numeric',
			// 	editable: false,
			// 	visible: false,
			// 	labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
			// 		//전체 데이터에서 같은 sku의 finalPlt 값을 합산
			// 		const allData = ref.gridRef.current.getOrgGridData();
			// 		const sku = item.sku;
			// 		const finalPltSum = allData.reduce((sum: number, currentItem: any) => {
			// 			if (currentItem.sku === sku) {
			// 				sum += currentItem.finalPlt;
			// 			}
			// 			return sum;
			// 		}, 0);
			// 		return `${finalPltSum}`;
			// 	},
			// },
			{
				dataField: 'outOrganize',
				headerText: t('lbl.ORGANIZE'),
				dataType: 'code',
				editable: false,
				minWidth: 80,
			},
			{
				dataField: 'outOrganizeName',
				headerText: t('lbl.ORGANIZENAME'),
				editable: false,
				minWidth: 100,
			},
			{
				dataField: 'address',
				headerText: '주소',
				editable: false,
			},
			{
				dataField: 'serialNo',
				headerText: '이력번호',
				editable: false,
			},
			{
				dataField: 'convSerialNo',
				headerText: 'B/L번호',
				editable: false,
			},
			{
				dataField: 'contractType',
				headerText: '계약유형',
				dataType: 'code',
				editable: false,
				labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
					return getCommonCodebyCd('CONTRACTTYPE_SN', value)?.cdNm;
				},
			},
			{
				dataField: 'contractCustkey',
				headerText: '계약업체',
				editable: false,
			},
			{
				dataField: 'contractCustNm',
				headerText: '계약업체명',
				editable: false,
			},
			{
				dataField: 'poHoldYn',
				headerText: '발주보류',
				commRenderer: {
					type: 'checkBox',
					checkValue: 'Y',
					unCheckValue: 'N',
				},
				editable: false,
			},
			{
				dataField: 'confirmQtyAdd',
				headerText: '확정오더량2',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'confirmQtyEditYn',
				headerText: '확정오더량수기조정여부',
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'purchaseUom',
				headerText: '발주단위',
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'eaCalQty',
				headerText: '환산수량(EA)',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'boxCalQty',
				headerText: '환산수량(BOX)',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'kgCalQty',
				headerText: '환산수량(KG)',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'boxPerQty',
				headerText: '박스입수',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'reference01',
				headerText: t('lbl.REFERENCE01'),
				editable: false,
			},
			{
				dataField: 'reference02',
				headerText: t('lbl.REFERENCE02'),
				editable: false,
			},
			{
				dataField: 'reference03',
				headerText: t('lbl.REFERENCE03'),
				editable: false,
			},
			{
				dataField: 'reference06',
				headerText: '참조정보4',
				editable: false,
			},

			{
				dataField: 'boxPerPlt',
				headerText: 'PLT변환값',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'pltTrans',
				headerText: 'PLT환산',
				dataType: 'numeric',
				editable: false,
				visible: false,
			},
			{
				dataField: 'pltTransCal',
				headerText: '환산수량(PLT)',
				dataType: 'numeric',
				editable: false,
			},
			{
				headerText: 'MOQ(상품)',
				children: [
					{
						dataField: 'moqSku',
						headerText: 'BOX',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'moqSkuPlt',
						headerText: 'PLT',
						dataType: 'numeric',
						editable: false,
					},
				],
			},
			{
				headerText: 'MOQ(협력사)',
				children: [
					{
						dataField: 'moqVender',
						headerText: 'BOX',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'moqVenderPlt',
						headerText: 'PLT',
						dataType: 'numeric',
						editable: false,
					},
				],
			},
			{
				dataField: 'excptDpApprYn',
				headerText: '예외입고품의',
				commRenderer: {
					type: 'checkBox',
					checkValue: 'Y',
					unCheckValue: 'N',
					disabledFunction: () => true,
				},
				editable: false,
			},
			{
				dataField: 'leadTime2',
				headerText: '리드타임2',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'boxPerPltQty',
				headerText: '현재고(PLT)',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'wdInplanQty',
				headerText: '출고예정량',
				dataType: 'numeric',
				editable: false,
			},
			{
				headerText: '소비기한',
				children: [
					{
						dataField: 'duration',
						headerText: '기준일(유통,제조)',
						editable: false,
						dataType: 'date',
					},
					{
						dataField: 'durationTerm',
						headerText: '소비기간(잔여/전체)',
						editable: false,
						dataType: 'code',
					},
				],
			},
			{
				dataField: 'exhaustionStopYn',
				headerText: '소진후중단',
				commRenderer: {
					type: 'checkBox',
					checkValue: 'Y',
					unCheckValue: 'N',
					disabledFunction: () => true,
				},
				editable: false,
			},
			{
				headerText: '안전재고',
				children: [
					{
						dataField: 'stockSafety2',
						headerText: '수량',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'stockDay2',
						headerText: '보유일',
						dataType: 'numeric',
						editable: false,
					},
				],
			},
			{
				dataField: 'preOpenQty',
				headerText: '입고전까지일출고가능량',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'custSku',
				headerText: 'CJ코드',
				editable: false,
			},
			{
				dataField: 'confirmQtyStockDay',
				headerText: '확정오더량보유일',
				dataType: 'numeric',
				editable: false,
				labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
					if (!item.stockAvgDay || item.stockAvgDay === 0) {
						return 0;
					}

					if (item.confirmQty * item.eaCal > 0) {
						return Math.trunc((item.confirmQty * item.eaCal) / item.stockAvgDay);
					} else {
						return Math.trunc(item.confirmQty / item.stockAvgDay);
					}
				},
			},
			{
				dataField: 'stockQtyDispStockDay',
				headerText: '기존재고보유일',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'stopStatus',
				headerText: '할당여부',
				editable: false,
				dataType: 'code',
				width: 30,
				renderer: {
					type: 'ImageRenderer',
					imgHeight: 16,
					srcFunction: function (rowIndex: any, columnIndex: any, value: any) {
						return `/img/icon/${value}.png`;
					},
				},
			},
			{
				dataField: 'stopInfo',
				headerText: '할당기간',
				editable: false,
			},
			{
				dataField: 'confirmQtyCheck',
				headerText: '예측량점검',
				editable: false,
				dataType: 'code',
				width: 30,
				renderer: {
					type: 'ImageRenderer',
					imgHeight: 16,
					srcFunction: function (rowIndex: any, columnIndex: any, value: any) {
						return `/img/icon/${value}.png`;
					},
				},
			},
			{
				dataField: 'confirmQty1MonthAvg',
				headerText: '일평균예측',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'confirmQty1Month',
				headerText: 'D+1월',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'confirmQty1Week',
				headerText: '1주차',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'confirmQty2Week',
				headerText: '2주차',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'confirmQty3Week',
				headerText: '3주차',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'confirmQty4Week',
				headerText: '4주차',
				dataType: 'numeric',
				editable: false,
			},
			{
				dataField: 'reference07',
				headerText: '키맨번호',
				editable: false,
			},
			{
				headerText: '무출고',
				children: [
					{
						dataField: 'noShipDay',
						headerText: '합계',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'shipDay1W',
						headerText: 'D-1월',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'shipDay2W',
						headerText: 'D-2월',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'shipDay3W',
						headerText: 'D-3월',
						dataType: 'numeric',
						editable: false,
					},
				],
			},
			{
				headerText: '주문량(월)',
				children: [
					{
						dataField: 'shipQty1W',
						headerText: 'D-1월',
						dataType: 'numeric',
						editable: false,
						styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
							// 상태에 따른 스타일 적용 - CLASS명 반환
							if (item?.shipQtyChg1W > 0) {
								return 'row-contract-non10-blue';
							} else if (item?.shipQtyChg1W < 0) {
								return 'row-contract-non10';
							} else {
								return '';
							}
						},
					},
					{
						dataField: 'shipQty2W',
						headerText: 'D-2월',
						dataType: 'numeric',
						editable: false,
						styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
							// 상태에 따른 스타일 적용 - CLASS명 반환
							if (item?.shipQtyChg2W > 0) {
								return 'row-contract-non10-blue';
							} else if (item?.shipQtyChg2W < 0) {
								return 'row-contract-non10';
							} else {
								return '';
							}
						},
					},
					{
						dataField: 'shipQty3W',
						headerText: 'D-3월',
						dataType: 'numeric',
						editable: false,
					},
				],
			},
			{
				headerText: '주문량(일)',
				children: [
					{
						dataField: 'ord1Day',
						headerText: 'D-1일',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'ord2Day',
						headerText: 'D-2일',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'ord3Day',
						headerText: 'D-3일',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'ord4Day',
						headerText: 'D-4일',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'ord5Day',
						headerText: 'D-5일',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'ord6Day',
						headerText: 'D-6일',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'ord7Day',
						headerText: 'D-7일',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'ord8Day',
						headerText: 'D-8일',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'ord9Day',
						headerText: 'D-9일',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'ord10Day',
						headerText: 'D-10일',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'ord11Day',
						headerText: 'D-11일',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'ord12Day',
						headerText: 'D-12일',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'ord13Day',
						headerText: 'D-13일',
						dataType: 'numeric',
						editable: false,
					},
					{
						dataField: 'ord14Day',
						headerText: 'D-14일',
						dataType: 'numeric',
						editable: false,
					},
				],
			},
			{
				dataField: 'stockid',
				visible: false,
			},
			{
				dataField: 'stockgrade',
				visible: false,
			},
			{
				dataField: 'stocktype',
				visible: false,
			},
		];
	};

	/**
	 * 그리드 속성을 설정한다.
	 * @returns {object} 그리드 속성 설정 객체
	 */
	const getGridProps = () => {
		return {
			editable: true,
			fillColumnSizeMode: false,
			enableColumnResize: true,
			showRowCheckColumn: true,
			showRowNumColumn: false,
			enableFilter: true,
			isRestore: false,
			rowStyleFunction: (rowIndex: any, item: any) => {
				if (item.rowType === 'parent') {
					return 'row-parent';
				} else if (item.rowType === 'child') {
					if (item.contractType !== '10') {
						return 'row-contract-non10';
					} else if (
						commUtil.isNotEmpty(item.durationTerm?.split('/')[0]) &&
						Number(item.durationTerm?.split('/')[0]) < Number(item.durationTerm?.split('/')[1]) * 0.3 &&
						Number(item.durationTerm?.split('/')[1]) != 9999 // 260203 양준영님 요청
					) {
						return 'row-duration-warn';
					} else {
						return '';
					}
				} else {
					return '';
				}
			},
			rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
				if (item.exhaustionStopYn === 'Y' || item.poHoldYn === 'Y') {
					return false;
				}
				return true;
			},
			// Grouping 설정
			// 최초 보여질 때 모두 열린 상태로 출력 여부
			displayTreeOpen: false,
			// 트리 컬럼(즉, 폴딩 아이콘 출력 칼럼) 을 인덱스1번으로 설정함(디폴트 0번임)
			treeColumnIndex: 8,
		};
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	const setDetailGridData = (params: any) => {
		// 각 디테일 컴포넌트에 선택된 행 데이터 전달
		setSelectedDetailRow(params);

		// props.form.getFieldsValue().purchaseTypeArr에 'PO'가 포함되어 있으면
		let poSto = '';
		if (props.form.getFieldsValue().purchaseTypeArr.toString().includes('PO')) {
			poSto = 'PO';
		} else if (props.form.getFieldsValue().purchaseTypeArr.toString().includes('STO')) {
			poSto = 'STO';
		}

		setPoType(poSto);
	};

	let prevRowIndex: any = null;

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		refDetailLeftGrid.current?.setGridData?.([]);
		refDetailCenterGrid.current?.setGridData?.([]);
		refDetailRightGrid.current?.setGridData?.([]);

		const params = {};
		getLastCreation(params).then(res => {
			setLastCreation(res.data?.lastCreation || '');
		});

		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		// ref.gridRef?.current.bind('ready', (event: any) => {
		// 	// 그리드가 준비되면 첫 번째 행을 선택한다.
		// 	ref.gridRef?.current.setSelectionByIndex(0);
		// });

		/**
		 * 그리드 행 선택 이벤트
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('selectionConstraint', (event: any) => {
			if (
				event.dataField === 'directdlvChkYn' ||
				event.dataField === 'excptDpApprYn' ||
				event.dataField === 'exhaustionStopYn' ||
				event.dataField === 'poHoldYn'
			) {
				return false;
			}
		});

		ref.gridRef.current.bind('rowAllChkClick', (event: any) => {
			const selectedRows = ref.gridRef.current.getCheckedRowItems();
			detailForm.setFieldsValue({
				weightSum: selectedRows.reduce((sum: number, row: any) => sum + (row.item.kgCalQty || 0), 0),
			});
		});

		ref.gridRef?.current.bind('selectionChange', (event: any) => {
			if (commUtil.isNotEmpty(popupWindow) && !popupWindow.closed) {
				const item = event.primeCell.item;
				if (commUtil.isNotEmpty(item.label)) {
					const popupUrl = `/om/OmPurchaseStorageAutoTotalPopup?${Constants.WIN_POPUP.KEY}=${Constants.WIN_POPUP.VALUE}&filename=${item.sku}_${item.dcCode}`;

					const params = {
						...item,
						logId: '01',
					};
					saveSuppImgLog(params);

					popupWindow.location.href = popupUrl;
				}
			}

			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.rowIndex === prevRowIndex && refDetailLeftGrid.current.getGridData().length > 0) return;

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell.rowIndex;

			if (event.primeCell.item.rowType === 'parent') {
				const gridRefCur = ref.gridRef.current;
				if (gridRefCur) {
					// 조회 조건 설정
					const params = {
						...event.primeCell.item,
						children: '',
						slipDtFrom: event.primeCell.item.stdDt,
					};
					setDetailGridData(params);
				}
			}
		});

		//발주 보류 체크시 수정 불가
		ref.gridRef?.current.bind('cellEditBegin', (event: any) => {
			if (event.item.poHoldYn === 'Y') {
				return false;
			}

			if (event.dataField === 'confirmQty' && event.item.exhaustionStopYn === 'Y') {
				return false;
			}

			//직송개별 체크되어 있지 않으면 직송총발주량 수정 불가
			if (event.dataField === 'directdlvOrderQty' && event.item.directdlvChkYn !== '1') {
				return false;
			}
		});

		/**
		 * 그리드 행 체크 선택
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('rowCheckClick', (event: any) => {
			const selectedRows = ref.gridRef.current.getCheckedRowItems();
			detailForm.setFieldsValue({
				weightSum: selectedRows.reduce((sum: number, row: any) => sum + (row.item.kgCalQty || 0), 0),
			});
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('cellEditEnd', (event: any) => {
			if (
				event.dataField === 'confirmQty' ||
				event.dataField === 'directdlvChkYn' ||
				event.dataField === 'directdlvOrderQty' ||
				event.dataField === 'receiveDt'
			) {
				if (event.dataField === 'confirmQty' || event.dataField === 'receiveDt') {
					if (event.dataField === 'confirmQty' && event.item.stockQtyOutDispTrans < event.value * event.item.boxCal) {
						ref.gridRef.current.restoreEditedCells([event.rowIndex, 'confirmQty']);
						showMessage({
							content: '현재고수량 이상으로 발주 할 수 없습니다.',
							modalType: 'warning',
						});
					} else if (
						event.dataField === 'confirmQty' &&
						commUtil.isEmpty(event.item.contractType) &&
						event.item.rowType === 'child'
					) {
						ref.gridRef.current.restoreEditedRows(event.rowIndex);
						showMessage({
							content: '계약유형 미등록 상품입니다.',
							modalType: 'warning',
						});
						return;
					} else if (event.dataField === 'confirmQty' && event.item.rowType === 'parent') {
						// 첫번째 자식 행의 finalPlt 값을 부모행의 finalPlt 값으로 설정
						// 트리가 접혀있을 때
						const firstChildIndex = event.item.children.findIndex(
							(dataItem: any) =>
								dataItem.rowType === 'child' && dataItem.sku === event.item.sku && dataItem.poHoldYn !== 'Y',
						);
						if (firstChildIndex !== -1) {
							const children = event.item.children;
							children[firstChildIndex].confirmQty = event.value;
							ref.gridRef.current.setCellValue(event.rowIndex, 'children', children);
						}
						// 트리가 펴져있을 때
						const allData = ref.gridRef.current.getGridData();
						const firstChild = allData.findIndex(
							(dataItem: any) =>
								dataItem.rowType === 'child' && dataItem.sku === event.item.sku && dataItem.poHoldYn !== 'Y',
						);
						if (firstChild !== -1) {
							ref.gridRef.current.setCellValue(firstChild, 'confirmQty', event.value);
						}
					} else {
						// const allData = ref.gridRef.current.getGridData();
						// const sku = event.item.sku;
						// let totalFinalPlt = 0;
						// const parentIndexes: number[] = [];
						// allData.forEach((dataItem: any, index: number) => {
						// 	if (dataItem.sku !== sku) return; // SKU가 다르면 스킵
						// 	if (dataItem.rowType === 'child') {
						// 		totalFinalPlt += dataItem.finalPlt || 0; // undefined 방지
						// 	} else if (dataItem.rowType === 'parent') {
						// 		parentIndexes.push(index);
						// 	}
						// });
						// parentIndexes.forEach(idx => {
						// 	ref.gridRef.current.setCellValue(idx, 'finalPlt', totalFinalPlt);
						// });
					}

					ref.gridRef.current.setCellValue(event.rowIndex, 'eaCalQty', event.item.confirmQty * event.item.eaCal);
					ref.gridRef.current.setCellValue(
						event.rowIndex,
						'boxCalQty',
						Math.ceil(event.item.confirmQty * event.item.boxCal),
					);
					ref.gridRef.current.setCellValue(event.rowIndex, 'kgCalQty', event.item.confirmQty * event.item.kgCal);

					if (event.item.boxPerPlt > 0) {
						ref.gridRef.current.setCellValue(
							event.rowIndex,
							'pltTransCal',
							Math.ceil(Math.ceil(event.item.confirmQty * event.item.boxCal) / event.item.boxPerPlt),
						);
					} else {
						ref.gridRef.current.setCellValue(event.rowIndex, 'pltTransCal', 0);
					}
				}

				const selectedRows = ref.gridRef.current.getCheckedRowItems();
				detailForm.setFieldsValue({
					weightSum: selectedRows.reduce((sum: number, row: any) => sum + (row.item.kgCalQty || 0), 0),
				});
			}

			if (event.dataField === 'receiveDt') {
				setStockqtyStockDays(event.rowIndex);
			}

			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			if (ref.gridRef.current.getCellValue(event.rowIndex, 'rowStatus') !== 'I') {
				ref.gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
			}

			if (event.dataField === 'poHoldYn') {
				const params = {
					stockid: event.item.stockid,
					poHoldYn: event.value,
					sku: event.item.sku,
				};
				savePoHoldYn(params).then(res => {
					if (res.statusCode > -1) {
						console.info(res);
					}
				});
			}
		});
	};

	// 입출고 집계 재생성
	const recreationPurchase = (params: any) => {
		showConfirm(null, '입출고 집계를 재생성 하시겠습니까?', () => {
			recreationPurchaseTotal(params).then(() => {
				showMessage({
					content: t('msg.MSG_COM_SUC_009'),
					modalType: 'info',
					onOk: () => {
						// 생성일 재조회
						getLastCreation(params).then(res => {
							setLastCreation(res.data?.lastCreation || '');
						});
					},
				});
			});
		});
	};

	const applyAll = () => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			const selectedRows = gridRefCur.getCheckedRowItems();
			if (selectedRows.length === 0) {
				showMessage({
					content: t('msg.noSelect'), // '선택된 행이 없습니다.',
					modalType: 'warning',
				});
				return;
			}

			const receiveDt = detailForm.getFieldValue('receiveDt');
			if (!receiveDt) {
				showMessage({
					content: '입고예정일을 입력하시기 바랍니다.',
					modalType: 'warning',
				});
				return;
			}

			const updatedRows = selectedRows.map((row: any) => ({
				...row.item,
				receiveDt: dayjs(receiveDt).format('YYYYMMDD'),
			}));

			updatedRows.forEach((row: any) => {
				//console.log('row', row);
				row.children?.forEach((child: any, index: number) => {
					if (child.rowType === 'child' && child.sku === row.sku && child.poHoldYn !== 'Y') {
						child.receiveDt = dayjs(receiveDt).format('YYYYMMDD');
					}
				});
			});

			const updatedRowsIndex = selectedRows.map((row: any) => row.rowIndex);

			gridRefCur.updateRows(updatedRows, updatedRowsIndex);

			updatedRowsIndex.forEach((index: any) => {
				if (commUtil.isNotEmpty(index)) {
					setStockqtyStockDays(index);
				}
			});
		}
	};

	// 동기식 확인창 함수
	const showConfirmSync = (msg: string) => {
		return new Promise(resolve => {
			showConfirm(
				null,
				msg,
				() => {
					// 확인 버튼 클릭 시 true 반환
					resolve(true);
				},
				() => {
					// 취소/닫기 클릭 시 false 반환
					resolve(false);
				},
			);
		});
	};

	// 발주 저장
	const saveChanges = async () => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			const changedRows = gridRefCur.getCheckedRowItemsAll();

			const saveData = changedRows;

			let chkOrdDay = '';
			let ordWeekDay = '';

			for (const data of saveData) {
				if (data.rowType === 'parent') {
					continue;
				}

				if (data.confirmQty < 1) {
					showMessage({
						content: '발주수량을 1이상 입력하시기 바랍니다.',
						modalType: 'info',
					});
					return;
				}

				if (data.stockQtyOutDispTrans < data.confirmQty * data.boxCal) {
					showMessage({
						content: '현재고수량 이상으로 발주 할 수 없습니다.',
						modalType: 'info',
					});
					return;
				}

				if (commUtil.isEmpty(data.receiveDt)) {
					showMessage({
						content: '발주일자를 입력하시기 바랍니다.',
						modalType: 'info',
					});
					return;
				}

				if (data.moqSku + data.moqSkuPlt + data.moqVender + data.moqVenderPlt === 0 || data.leadTime === 0) {
					let msg = '';
					if (data.moqSku + data.moqSkuPlt + data.moqVender + data.moqVenderPlt === 0 && data.leadTime === 0) {
						msg += '(MOQ, LEADTIME)';
					} else if (data.moqSku + data.moqSkuPlt + data.moqVender + data.moqVenderPlt === 0) {
						msg += '(MOQ)';
					} else if (data.leadTime === 0) {
						msg += '(LEADTIME)';
					}

					showMessage({
						content: `[${data.sku}]${data.skuName} 수발주정보에서 기초정보${msg}가 입력이 안되었습니다. 해당상품의 필수값을 입력하여 주십시요`,
						modalType: 'info',
					});
					return;
				}

				if (
					(commUtil.getDay(data.receiveDt) === 1 && data.monYn === '0') ||
					(commUtil.getDay(data.receiveDt) === 2 && data.tueYn === '0') ||
					(commUtil.getDay(data.receiveDt) === 3 && data.wedYn === '0') ||
					(commUtil.getDay(data.receiveDt) === 4 && data.thuYn === '0') ||
					(commUtil.getDay(data.receiveDt) === 5 && data.friYn === '0') ||
					(commUtil.getDay(data.receiveDt) === 6 && data.satYn === '0') ||
					(commUtil.getDay(data.receiveDt) === 0 && data.sunYn === '0')
				) {
					ordWeekDay = '';
					if (data.monYn === '1') ordWeekDay = '월';
					if (data.tueYn === '1') ordWeekDay += commUtil.isEmpty(ordWeekDay) ? '화' : ',화';
					if (data.wedYn === '1') ordWeekDay += commUtil.isEmpty(ordWeekDay) ? '수' : ',수';
					if (data.thuYn === '1') ordWeekDay += commUtil.isEmpty(ordWeekDay) ? '목' : ',목';
					if (data.friYn === '1') ordWeekDay += commUtil.isEmpty(ordWeekDay) ? '금' : ',금';
					if (data.satYn === '1') ordWeekDay += commUtil.isEmpty(ordWeekDay) ? '토' : ',토';
					if (data.sunYn === '1') ordWeekDay += commUtil.isEmpty(ordWeekDay) ? '일' : ',일';

					chkOrdDay = `[${data.custName}] 의 [${data.sku}] 상품은 ${data.receiveDt}(${commUtil.getDayWeek(
						data.receiveDt,
					)}) 대응이 안될 수 있습니다.[가능요일:${ordWeekDay}]`;
				}

				// 사용자가 버튼을 누를 때까지 여기서 대기합니다.
				if (commUtil.isNotEmpty(chkOrdDay)) {
					const isConfirmed = await showConfirmSync(chkOrdDay + '\n계속 진행 하시겠습니까?');

					if (!isConfirmed) {
						return;
					}
				}

				//finalQty 값을 confirmQty에 세팅 확정오더량
				// data.confirmQty = data.finalPlt;

				if (commUtil.isEmpty(data.organize)) {
					data.organize = data.dcCode;
				}
			}

			const params: any = {
				//
			};

			params.saveOutSTOList = saveData;

			const saveList = [];
			for (const data of saveData) {
				if (data.poHoldYn !== 'Y' && data.rowType === 'child') {
					saveList.push(data);
				}
			}

			if (saveList.length === 0) {
				showMessage({
					content: t('msg.noChange'), // '변경된 행이 없습니다.',
					modalType: 'warning',
				});
				return;
			}

			params.saveOutSTOList = saveList;

			Modal.confirm({
				title: '',
				content: '발주와 함께 이메일 전송하시겠습니까?',
				footer: (_, { OkBtn, CancelBtn }) => (
					<>
						<Button onClick={() => Modal.destroyAll()}>취소</Button>
						<Button
							onClick={() => {
								savePurchase(params, 'N');
								Modal.destroyAll();
							}}
						>
							아니오
						</Button>
						<Button
							type="primary"
							onClick={() => {
								savePurchase(params, 'Y');
								Modal.destroyAll();
							}}
						>
							예
						</Button>
					</>
				),
			});
		}
	};

	const clickTmpSave = () => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			const changedRows = gridRefCur.getCheckedRowItemsAll();
			if (changedRows.length === 0) {
				showMessage({
					content: t('msg.noChange'), // '변경된 행이 없습니다.',
					modalType: 'warning',
				});
				return;
			}
			const saveData = changedRows;

			for (const data of saveData) {
				if (data.confirmQty < 1) {
					showMessage({
						content: '발주수량을 1이상 입력하시기 바랍니다.',
						modalType: 'info',
					});
					return;
				}

				if (commUtil.isEmpty(data.receiveDt)) {
					showMessage({
						content: '발주일자를 입력하시기 바랍니다.',
						modalType: 'info',
					});
					return;
				}

				if (commUtil.isEmpty(data.organize)) {
					data.organize = data.dcCode;
				}

				//finalQty 값을 confirmQty에 세팅 확정오더량
				// data.confirmQty = data.finalPlt;
			}

			const params = {
				saveList: saveData,
			};

			showConfirm(null, '임시저장 하시겠습니까?', () => {
				tmpSave(params).then(() => {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'), // '저장이 완료되었습니다.',
						modalType: 'info',
					});
				});
			});
		}
	};

	const savePurchase = (params: any, mailYn: string) => {
		const gridRefCur = ref.gridRef.current;
		savePurchaseOutSTO(params).then(res => {
			if (res.statusCode > -1) {
				showMessage({
					content: t('msg.MSG_COM_SUC_003'), // '저장이 완료되었습니다.',
					modalType: 'info',
					onOk: () => {
						// 선택된 행의 데이터를 가져온다.
						let selectedRow = [];
						if (gridRefCur.getSelectedRows().length === 0) {
							selectedRow = gridRefCur.getCheckedRowItemsAll()[0];
						} else {
							selectedRow = gridRefCur.getSelectedRows()[0];
						}
						// const item = gridRefCur.getItemByRowIndex(event.toRowIndex);
						// 조회 조건 설정
						const detailParams = {
							...selectedRow,
							slipDtFrom: selectedRow.stdDt,
							children: '',
						};

						apiGetDetailRightList(detailParams).then(res => {
							if (res.data.length > 0) {
								refDetailRightGrid.current?.setGridData(res.data);
								const colSizeList = refDetailRightGrid.current.getFitColumnSizeList(true);
								refDetailRightGrid.current.setColumnSizeList(colSizeList);
							}
						});
						if (mailYn === 'Y') {
							openEmailPopup();
						}
					},
				});
			}
		});
	};

	const handleClosePopup = () => {
		refModal.current?.handlerClose();
	};

	const confirmPopup = (selectedRow: any) => {
		ref.gridRef.current.setCellValue(ref.gridRef.current.getSelectedIndex()[0], 'routeOrganize', selectedRow[0].code);
		ref.gridRef.current.setCellValue(ref.gridRef.current.getSelectedIndex()[0], 'routeOrganizeNm', selectedRow[0].name);
		refModal2.current.handlerClose();
	};

	const closeEvent = () => {
		refModal2.current.handlerClose();
	};

	/**
	 * 연쇄 트랜잭션 호출 함수
	 * @param {any} rowItems 전송 대상
	 * @param {number} index 현재 순번
	 * @param {number} total 전체 대상 건수
	 */
	const loopTransaction = (rowItems: any) => {
		let apiUrl = '';
		if (poType === 'STO') {
			apiUrl = '/api/om/purchaseModify/v1.0/deleteMasterSTO';
		} else if (poType === 'PO') {
			for (const item of rowItems) {
				if (commUtil.isEmpty(item.requestNo)) {
					showMessage({
						content: '납품 확정이 되어 발주삭제가 되지 않습니다.',
						modalType: 'warning',
					});
					return;
				}
			}
			apiUrl = '/api/om/purchaseModify/v1.0/deleteMasterPO';
		} else {
			return;
		}

		// loop transaction
		const saveParams = {
			apiUrl: apiUrl,
			saveDataList: rowItems,
		};

		setLoopTrParams(saveParams);
		refTranModal.current.handlerOpen();
	};

	// 발주삭제 실행
	const handleDeletePurchaseModifyList = (delList: any[]) => {
		if (!delList || delList.length < 1) {
			return;
		}

		loopTransaction(delList);
	};

	/**
	 * 트랜잭션 팝업 닫기
	 */
	const closeEventTranPopup = () => {
		// 선택된 행의 데이터를 가져온다.
		const selectedRow = ref.gridRef.current.getSelectedRows()[0];
		// 조회 조건 설정
		const detailParams = {
			...selectedRow,
			slipDtFrom: selectedRow.stdDt,
			children: '',
		};
		apiGetDetailRightList(detailParams).then(res => {
			if (res.data.length > 0) {
				refDetailRightGrid.current?.setGridData?.(res.data);
			}
			refTranModal.current.handlerClose();
		});
	};

	//재발주 실행
	const handleReorderPurchaseModifyList = (reorderList: any[]) => {
		if (!reorderList || reorderList.length < 1) {
			return;
		}

		const masterItem = ref.gridRef.current.getSelectedRows()[0];

		if (poType === 'PO') {
			reorderList.forEach((item: any) => {
				item.modSlipDt = item.slipDt;
				item.orderQty = item.purchaseQty;
				item.buyerKey = item.buyerKey || props.form.getFieldValue('buyerKey');
				item.purchaseType = item.workProcessCode || poType;
				if (commUtil.isEmpty(item.modSlipDt)) {
					item.modSlipDt = dayjs().format('YYYYMMDD');
				}
				item.fromDcCode = masterItem.fromDcCode;
				item.fromOrganize = item.fromCustKey;
				item.area = masterItem.area;
				item.uom = masterItem.uom;
				item.purchaseUom = masterItem.purchaseUom;
				item.channel = masterItem.channel;
				item.organize = masterItem.organize;
				if (commUtil.isEmpty(item.organize)) {
					item.organize = masterItem.dcCode;
				}
				item.routeOrganize = masterItem.routeOrganize;
				item.buyerKey = masterItem.buyerKey;
			});

			const params = {
				...reorderList,
				saveList: reorderList,
			};

			showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
				apiPostReorderMasterPO(params).then(res => {
					if (res.statusCode > -1) {
						showMessage({
							content: t('msg.MSG_COM_SUC_003'),
							modalType: 'info',
							onOk: () => {
								// 선택된 행의 데이터를 가져온다.
								const selectedRow = ref.gridRef.current.getSelectedRows()[0];
								// 조회 조건 설정
								const detailParams = {
									...selectedRow,
									slipDtFrom: selectedRow.stdDt,
								};
								apiGetDetailRightList(detailParams).then(res => {
									if (res.data.length > 0) {
										refDetailRightGrid.current?.setGridData?.(res.data);
									}
								});
							},
						});
					}
				});
			});
		} else if (poType === 'STO') {
			reorderList.forEach((item: any) => {
				item.area = masterItem.area;
				item.receiveDt = item.slipDt;
				item.uom = masterItem.uom;
				item.purchaseUom = masterItem.purchaseUom;
				item.orderQty = item.purchaseQty;
				item.outOrganize = item.fromCustKey;
			});

			const params = {
				...reorderList,
				saveList: reorderList,
			};

			apiPostReorderMasterOutSTO(params).then(res => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							// 선택된 행의 데이터를 가져온다.
							const selectedRow = ref.gridRef.current.getSelectedRows()[0];
							// 조회 조건 설정
							const detailParams = {
								...selectedRow,
								slipDtFrom: selectedRow.stdDt,
							};
							apiGetDetailRightList(detailParams).then(res => {
								if (res.data.length > 0) {
									refDetailRightGrid.current?.setGridData?.(res.data);
								}
							});
						},
					});
				}
			});
		}
	};

	// 저장품자동발주검수 팝업 열기 (window.open)
	const handleOpenPurchaseInspectPopup = () => {
		const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

		// checekedItems rowType: 'parent'인 항목 제외
		const filteredCheckedItems = checkedItems.filter((item: any) => item.rowType !== 'parent');

		// checekedItems outOrganize 기준으로 정렬하기
		const popupPayload = [...filteredCheckedItems].sort((a: any, b: any) => {
			if (a.outOrganize < b.outOrganize) return -1;
			if (a.outOrganize > b.outOrganize) return 1;
			return 0;
		});

		if (popupPayload.length === 0) {
			showMessage({
				content: t('msg.noSelect'),
				modalType: 'warning',
			});
			return;
		}

		// 팝업 열기
		const popupUrl = `/om/OmPurchaseInspectOutPop?${Constants.WIN_POPUP.KEY}=${Constants.WIN_POPUP.VALUE}`;
		const popup = window.open(popupUrl, 'OmPurchaseInspectOutPop', `width=${'1200px'},height=${'480px'},left=0,top=0`);

		if (!popup) {
			showMessage({
				content: '팝업을 열 수 없습니다. 브라우저 팝업 차단을 확인해 주세요.',
				modalType: 'warning',
			});
			return;
		}

		inspectPopupRef.current = popup;

		if (inspectPopupMessageHandlerRef.current) {
			window.removeEventListener('message', inspectPopupMessageHandlerRef.current);
			inspectPopupMessageHandlerRef.current = null;
		}

		// 팝업이 준비되면 데이터 전송
		const handleMessage = (event: MessageEvent) => {
			if (event.origin !== window.location.origin) return;
			if (event.source !== inspectPopupRef.current) return;
			if (event.data === 'popup-ready' && inspectPopupRef.current && !inspectPopupRef.current.closed) {
				inspectPopupRef.current.postMessage(popupPayload, window.location.origin);
				window.removeEventListener('message', handleMessage);
				inspectPopupMessageHandlerRef.current = null;
			}
		};

		inspectPopupMessageHandlerRef.current = handleMessage;
		window.addEventListener('message', handleMessage);
	};

	// 기존재고 보유일 계산 함수
	const setStockqtyStockDays = (rowIndex: number) => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			//영업일 계산
			const receiveDt = dayjs(gridRefCur.getCellValue(rowIndex, 'receiveDt'), 'YYYYMMDD');
			const today = dayjs();
			const bizDate = receiveDt.diff(today, 'day');

			const stockQtyDisp = gridRefCur.getCellValue(rowIndex, 'stockQtyDisp');
			const stockAvgDay = gridRefCur.getCellValue(rowIndex, 'stockAvgDay') || 0;
			const bizDateQty = getBizdateQty(rowIndex, bizDate, stockAvgDay);

			//기존재고 보유일
			gridRefCur.setCellValue(rowIndex, 'stockQtyDispStockDay', calcStockDay(stockQtyDisp - bizDateQty, stockAvgDay));
		}
	};

	const calcStockDay = (qty: number, stockAvgDay: number) => {
		return stockAvgDay === 0 ? 0 : Math.round(qty / stockAvgDay).toString();
	};

	const getBizdateQty = (rowIndex: number, bizDate: number, stockAvgDay: number) => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			const dateDiff = bizDate;
			let qty = 0;

			if (dateDiff === 1) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty01');
			} else if (dateDiff === 2) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty02');
			} else if (dateDiff === 3) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty03');
			} else if (dateDiff === 4) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty04');
			} else if (dateDiff === 5) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty05');
			} else if (dateDiff === 6) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty06');
			} else if (dateDiff === 7) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty07');
			} else if (dateDiff === 8) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty08');
			} else if (dateDiff === 9) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty09');
			} else if (dateDiff === 10) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty10');
			} else if (dateDiff === 11) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty11');
			} else if (dateDiff === 12) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty12');
			} else if (dateDiff === 13) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty13');
			} else if (dateDiff === 14) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty14');
			} else if (dateDiff === 15) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty15');
			} else if (dateDiff === 16) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty16');
			} else if (dateDiff === 17) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty17');
			} else if (dateDiff === 18) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty18');
			} else if (dateDiff === 19) {
				qty = gridRefCur.getCellValue(rowIndex, 'afterDayWdQty19');
			}

			if (qty < bizDate * stockAvgDay) {
				return (qty = bizDate * stockAvgDay);
			}

			return qty;
		}
	};

	const chkCalcTime = () => {
		// lastCreation 값이 현재시간보다 30분 이후이면 true 반환
		if (commUtil.isEmpty(lastCreation)) {
			return false;
		}
		const now = dayjs();
		const creationTime = dayjs(lastCreation, 'YYYY-MM-DD HH:mm:ss');
		const diffMinutes = now.diff(creationTime, 'minute');
		return diffMinutes > 30;
	};

	const closeEmailPopup = () => {
		refEmailModal.current?.handlerClose();
	};

	// 메일 팝업 열기
	const openEmailPopup = () => {
		const checkedItems = ref.gridRef.current?.getCheckedRowItems?.() ?? [];
		if (checkedItems.length === 0) {
			showMessage({
				content: t('msg.MSG_COM_VAL_061'), // 체크된 항목이 없습니다.
				modalType: 'info',
			});
			return;
		}

		const detailData = checkedItems.map((row: any) => row.item ?? row);
		const receiverMap = new Map<string, { rcvrNm: string; rcvrEmail: string }>();
		detailData.forEach((item: any) => {
			const rcvrEmail = item.rcvrEmail ?? '';
			const rcvrNm = item.rcvrNm ?? '';
			if (rcvrEmail || rcvrNm) {
				const key = `${rcvrEmail}|${rcvrNm}`;
				if (!receiverMap.has(key)) {
					receiverMap.set(key, { rcvrNm, rcvrEmail });
				}
			}
		});

		setEmailPopupDetailData(detailData);
		setEmailPopupReceiverData(Array.from(receiverMap.values()));
		refEmailModal.current?.handlerOpen();
	};

	// 그리드 버튼 설정
	const headerGridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveChanges,
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

	useEffect(() => {
		return () => {
			if (inspectPopupMessageHandlerRef.current) {
				window.removeEventListener('message', inspectPopupMessageHandlerRef.current);
				inspectPopupMessageHandlerRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		setChkDiffTime(chkCalcTime());
	}, [lastCreation]);

	//B/L별 확대/축소
	useEffect(() => {
		if (allRowsVisible) {
			ref.gridRef.current.collapseAll();
		} else {
			ref.gridRef.current.expandAll();
		}
	}, [allRowsVisible]);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;

		refDetailLeftGrid?.current.clearGridData();
		refDetailCenterGrid?.current.clearGridData();
		refDetailRightGrid?.current.clearGridData();
		prevRowIndex = null;
		detailForm.setFieldsValue({
			weightSum: 0,
		});

		if (gridRefCur) {
			const map: Record<string, any> = {};
			const result: any[] = [];

			props.data.forEach((item: any) => {
				const confirmQty = Number(item.confirmQty ?? 0);
				const eaCal = Number(item.eaCal ?? 0);
				const boxCal = Number(item.boxCal ?? 0);
				const kgCal = Number(item.kgCal ?? 0);

				if (item.eaCalQty == null || item.eaCalQty === '' || Number.isNaN(Number(item.eaCalQty))) {
					item.eaCalQty = confirmQty * eaCal;
				}
				if (item.boxCalQty == null || item.boxCalQty === '' || Number.isNaN(Number(item.boxCalQty))) {
					item.boxCalQty = Math.ceil(confirmQty * boxCal);
				}
				if (item.kgCalQty == null || item.kgCalQty === '' || Number.isNaN(Number(item.kgCalQty))) {
					item.kgCalQty = confirmQty * kgCal;
				}
				if (item.pltTransCal == null || item.pltTransCal === '' || Number.isNaN(Number(item.pltTransCal))) {
					if (item.boxPerPlt > 0) {
						item.pltTransCal = Math.ceil(Number(item.boxCalQty) / item.boxPerPlt);
					} else {
						item.pltTransCal = 0;
					}
				}
				if (item.uom === 'BOX') {
					item.stockQtyOutDispTrans = Math.floor(item.stockQtyOutDisp / item.boxCal);
				} else if (item.uom === 'KG') {
					item.stockQtyOutDispTrans = Math.floor(item.stockQtyOutDisp / item.kgCal);
				} else {
					item.stockQtyOutDispTrans = Math.floor(item.stockQtyOutDisp / item.eaCal);
				}

				item.directdlvOrderQtyTemp = item.directdlvOrderQty;
				item.directYn = '';

				const skuKey = item.sku;

				if (!map[skuKey]) {
					// 부모 노드: 원본의 모든 필드 보존 + 계층용 필드 추가
					map[skuKey] = {
						addDate: item.addDate,
						addWho: item.addWho,
						afReceiveQty: item.afReceiveQty,
						afterDayWdQty01: item.afterDayWdQty01,
						afterDayWdQty02: item.afterDayWdQty02,
						afterDayWdQty03: item.afterDayWdQty03,
						afterDayWdQty04: item.afterDayWdQty04,
						afterDayWdQty05: item.afterDayWdQty05,
						afterDayWdQty06: item.afterDayWdQty06,
						afterDayWdQty07: item.afterDayWdQty07,
						afterDayWdQty08: item.afterDayWdQty08,
						afterDayWdQty09: item.afterDayWdQty09,
						afterDayWdQty10: item.afterDayWdQty10,
						afterDayWdQty11: item.afterDayWdQty11,
						afterDayWdQty12: item.afterDayWdQty12,
						afterDayWdQty13: item.afterDayWdQty13,
						afterDayWdQty14: item.afterDayWdQty14,
						afterDayWdQty15: item.afterDayWdQty15,
						afterDayWdQty16: item.afterDayWdQty16,
						afterDayWdQty17: item.afterDayWdQty17,
						afterDayWdQty18: item.afterDayWdQty18,
						afterDayWdQty19: item.afterDayWdQty19,
						afterDayWdQty20: item.afterDayWdQty20,
						area: item.area,
						autoExecDay: item.autoExecDay,
						avgWeight: item.avgWeight,
						bizDate: item.bizDate,
						box: item.box,
						boxCal: item.boxCal,
						boxCalQty: item.boxCalQty,
						boxFlag: item.boxFlag,
						boxPerLayer: item.boxPerLayer,
						boxPerPlt: item.boxPerPlt,
						boxPerPltQty: item.boxPerPltQty,
						boxPerQty: item.boxPerQty,
						boxQty: item.boxQty,
						bunja: item.bunja,
						bunjaCal: item.bunjaCal,
						bunmo: item.bunmo,
						bunmoCal: item.bunmoCal,
						buyerKey: item.buyerKey,
						calBox: item.calBox,
						channel: item.channel,
						channelNm: item.channelNm,
						coefficientSafety: item.coefficientSafety,
						confirmQty: item.confirmQty,
						confirmQty1Month: item.confirmQty1Month,
						confirmQty1MonthAvg: item.confirmQty1MonthAvg,
						confirmQty1Week: item.confirmQty1Week,
						confirmQty2Week: item.confirmQty2Week,
						confirmQty3Week: item.confirmQty3Week,
						confirmQty4Week: item.confirmQty4Week,
						confirmQtyAdd: item.confirmQtyAdd,
						confirmQtyCheck: item.confirmQtyCheck,
						confirmQtyEditYn: item.confirmQtyEditYn,
						confirmQtyOut: item.confirmQtyOut,
						confirmQtyStockDay: item.confirmQtyStockDay,
						controlFromDate: item.controlFromDate,
						controlToDate: item.controlToDate,
						customRowCheckYn: item.customRowCheckYn,
						dateDiffQty: item.dateDiffQty,
						dcCode: item.dcCode,
						dcName: item.dcName,
						deliveryType: item.deliveryType,
						directYn: item.directYn,
						dumCompany: item.dumCompany,
						dumQty: item.dumQty,
						dumYn: item.dumYn,
						ea: item.ea,
						eaCal: item.eaCal,
						eaCalQty: item.eaCalQty,
						editDate: item.editDate,
						editWho: item.editWho,
						execDay: item.execDay,
						finalPlt: item.confirmQty,
						friYn: item.friYn,
						fromDcCode: item.fromDcCode,
						fromOrganize: item.fromOrganize,
						fusibilityQty: item.fusibilityQty,
						fusibilityQty2: item.fusibilityQty2,
						kg: item.kg,
						kgCal: item.kgCal,
						kgCalQty: item.kgCalQty,
						label: item.label,
						leadTime: item.leadTime,
						leadTime2: item.leadTime2,
						line01: item.line01,
						maxStock: item.maxStock,
						minOrderQty: item.minOrderQty,
						monYn: item.monYn,
						moqSku: item.moqSku,
						moqSkuPlt: item.moqSkuPlt,
						moqVender: item.moqVender,
						moqVenderPlt: item.moqVenderPlt,
						moveConfirmQty: item.moveConfirmQty,
						ord1Day: item.ord1Day,
						ord2Day: item.ord2Day,
						ord3Day: item.ord3Day,
						ord4Day: item.ord4Day,
						ord5Day: item.ord5Day,
						ord6Day: item.ord6Day,
						ord7Day: item.ord7Day,
						ord8Day: item.ord8Day,
						ord9Day: item.ord9Day,
						ord10Day: item.ord10Day,
						ord11Day: item.ord11Day,
						ord12Day: item.ord12Day,
						ord13Day: item.ord13Day,
						ord14Day: item.ord14Day,
						orderQtyUnit: item.orderQtyUnit,
						organize: item.dcCode === '1000' ? props.form.getFieldValue('organizeCode') : item.organize,
						organizeName:
							item.dcCode === '1000' ? props.form.getFieldValue('organizeName').split(']')[1] : item.organizeName,
						palletUnit: item.palletUnit,
						plant: item.plant,
						pltTrans: item.pltTrans,
						pltTransCal: item.pltTransCal,
						poDt: item.poDt,
						preOpenQty: item.preOpenQty,
						psbQty: item.psbQty,
						psbQty2: item.psbQty2,
						purInterval: item.purInterval,
						purchaseType: item.purchaseType,
						purchaseUom: item.purchaseUom,
						qty: item.qty,
						qtyPicked: item.qtyPicked,
						receiveDt: item.receiveDt,
						receiveDtCal: item.receiveDtCal,
						receiveQty: item.receiveQty,
						reorderPoint: item.reorderPoint,
						route: item.route,
						routeOrganize: item.routeOrganize,
						routeOrganizeNm: item.routeOrganizeNm,
						satYn: item.satYn,
						serialKey: item.serialKey,
						serialYn: item.serialYn,
						shipDay1W: item.shipDay1W,
						shipDay2W: item.shipDay2W,
						shipDay3W: item.shipDay3W,
						shipQty1W: item.shipQty1W,
						shipQty2W: item.shipQty2W,
						shipQty3W: item.shipQty3W,
						sku: item.sku,
						skuName: item.skuName,
						std: item.std,
						stdDt: item.stdDt,
						stockAvgDay: item.stockAvgDay,
						stockDay: item.stockDay,
						stockGoal: item.stockGoal,
						stockQty: item.stockQty,
						stockQtyDisp: item.stockQtyDisp,
						stockSafety2: item.stockSafety2,
						stockGrade: item.stockGrade,
						stockid: item.stockid,
						stockType: item.stockType,
						storageType: item.storageType,
						storageTypeNm: item.storageTypeNm,
						sunYn: item.sunYn,
						thuYn: item.thuYn,
						totalCount: item.totalCount,
						tplSkuGroup: item.tplSkuGroup,
						tranBox: item.tranBox,
						tueYn: item.tueYn,
						uom: item.uom,
						valFnGetDayCount: item.valFnGetDayCount,
						vendorConfirmQty: item.vendorConfirmQty,
						// wdInplanQty: item.wdInplanQty,
						wedYn: item.wedYn,
						zero: item.zero,
						stockQtyOutDisp: 0,
						stockQtyOutDispTrans: 0,
						stopStatus: item.stopStatus,
						stopInfo: item.stopInfo,
						stockDay2: item.stockDay2,
						noShipDay: item.shipDay1W + item.shipDay2W + item.shipDay3W,
						shipQty: item.shipQty,
						uid: skuKey,
						id: skuKey,
						name: item.skuName,
						rowType: 'parent',
						children: [
							{
								purchaseType: item.purchaseType,
								organize: item.dcCode === '1000' ? props.form.getFieldValue('organizeCode') : item.organize,
								organizeName:
									item.dcCode === '1000' ? props.form.getFieldValue('organizeName').split(']')[1] : item.organizeName,
								dcCode: item.dcCode,
								dcName: item.dcName,
								area: item.area,
								bunja: item.bunja,
								bunmo: item.bunmo,
								stockid: item.stockid,
								sku: item.sku,
								skuName: item.skuName,
								constractType: item.constractType,
								storageType: item.storageType,
								storageTypeNm: item.storageTypeNm,
								serialYn: item.serialYn,
								line01: item.line01,
								deliveryType: item.deliveryType,
								receiveDt: item.receiveDt,
								buyerKey: item.buyerKey,
								autoExecDay: item.autoExecDay,
								controlType: item.controlType,
								controlFromDate: item.controlFromDate,
								controlToDate: item.controlToDate,
								confirmQty: item.confirmQty,
								finalPlt: item.finalPlt,
								convSerialNo: item.convSerialNo,
								poHoldYn: item.poHoldYn,
								outOrganizeName: item.outOrganizeName,
								outOrganize: item.outOrganize,
								stockQtyOutDisp: item.stockQtyOutDisp,
								address: item.address,
								serialNo: item.serialNo,
								contractCustkey: item.contractCustkey,
								contractCustNm: item.contractCustNm,
								eaCalQty: item.eaCalQty,
								boxCalQty: item.boxCalQty,
								kgCalQty: item.kgCalQty,
								pltTransCal: item.pltTransCal,
								contractType: item.contractType,
								duration: item.duration,
								durationTerm: item.durationTerm,
								stockQtyOutDispTrans: item.stockQtyOutDispTrans,
								minOrderQty: item.minOrderQty,
								orderQtyUnit: item.orderQtyUnit,
								purchaseUom: item.purchaseUom,
								uom: item.uom,
								boxPerQty: item.boxPerQty,
								boxPerPlt: item.boxPerPlt,
								eaCal: item.eaCal,
								boxCal: item.boxCal,
								kgCal: item.kgCal,
								stockAvgDay: item.stockAvgDay,
								wdInplanQty: item.wdInplanQty,
								uid: item.stockid || `${skuKey}_child`,
								id: item.stockid || skuKey,
								name: item.skuName,
								rowType: 'child',
							},
						],
					};
					result.push(map[skuKey]);
				} else {
					// 자식 노드: 원본의 필드 중에 외부창고 발주 관련 데이터만 보존 + 계층용 필드 추가
					map[skuKey].children.push({
						purchaseType: item.purchaseType,
						organize: item.dcCode === '1000' ? props.form.getFieldValue('organizeCode') : item.organize,
						organizeName:
							item.dcCode === '1000' ? props.form.getFieldValue('organizeName').split(']')[1] : item.organizeName,
						dcCode: item.dcCode,
						dcName: item.dcName,
						area: item.area,
						bunja: item.bunja,
						bunmo: item.bunmo,
						stockid: item.stockid,
						sku: item.sku,
						skuName: item.skuName,
						constractType: item.constractType,
						storageType: item.storageType,
						storageTypeNm: item.storageTypeNm,
						serialYn: item.serialYn,
						line01: item.line01,
						deliveryType: item.deliveryType,
						receiveDt: item.receiveDt,
						buyerKey: item.buyerKey,
						autoExecDay: item.autoExecDay,
						controlType: item.controlType,
						controlFromDate: item.controlFromDate,
						controlToDate: item.controlToDate,
						confirmQty: 0,
						finalPlt: 0,
						convSerialNo: item.convSerialNo,
						poHoldYn: item.poHoldYn,
						outOrganizeName: item.outOrganizeName,
						outOrganize: item.outOrganize,
						stockQtyOutDisp: item.stockQtyOutDisp,
						address: item.address,
						serialNo: item.serialNo,
						contractCustkey: item.contractCustkey,
						contractCustNm: item.contractCustNm,
						eaCalQty: 0,
						boxCalQty: 0,
						kgCalQty: 0,
						pltTransCal: 0,
						contractType: item.contractType,
						duration: item.duration,
						durationTerm: item.durationTerm,
						stockQtyOutDispTrans: item.stockQtyOutDispTrans,
						minOrderQty: item.minOrderQty,
						orderQtyUnit: item.orderQtyUnit,
						purchaseUom: item.purchaseUom,
						uom: item.uom,
						boxPerQty: item.boxPerQty,
						boxPerPlt: item.boxPerPlt,
						eaCal: item.eaCal,
						boxCal: item.boxCal,
						kgCal: item.kgCal,
						stockAvgDay: item.stockAvgDay,
						wdInplanQty: item.wdInplanQty,
						uid: item.stockid || `${skuKey}_child`,
						id: item.stockid || skuKey,
						name: item.skuName,
						rowType: 'child',
					});
				}
				//map[skuKey].stockQtyOutDisp 에 자식들의 stockQtyOutDisp 합계 저장
				map[skuKey].stockQtyOutDisp = map[skuKey].stockQtyOutDisp + item.stockQtyOutDisp;
				map[skuKey].stockQtyOutDispTrans = map[skuKey].stockQtyOutDispTrans + item.stockQtyOutDispTrans;
				// map[skuKey].finalPlt = map[skuKey].confirmQty + item.confirmQty;
			});

			//poHoldYn 값이 'Y' 이면 finalPlt, confirmQty, eaCalQty, boxCalQty, kgCalQty 값을 다음 chldren의 값으로 넘겨주고 상위 chidren의 값은 0으로 변경
			result.forEach((item: any, pIndex: number) => {
				item.children.forEach((child: any, index: number) => {
					if (child.poHoldYn === 'Y') {
						if (index < item.children.length - 1) {
							item.children[index + 1].finalPlt = item.children[index + 1].finalPlt + child.finalPlt;
							item.children[index + 1].confirmQty = item.children[index + 1].confirmQty + child.confirmQty;
							item.children[index + 1].eaCalQty = item.children[index + 1].eaCalQty + child.eaCalQty;
							item.children[index + 1].boxCalQty = item.children[index + 1].boxCalQty + child.boxCalQty;
							item.children[index + 1].kgCalQty = item.children[index + 1].kgCalQty + child.kgCalQty;
						}
						child.finalPlt = 0;
						child.confirmQty = 0;
						child.eaCalQty = 0;
						child.boxCalQty = 0;
						child.kgCalQty = 0;
					}
				});
			});

			gridRefCur?.setGridData(result);

			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		refDetailLeftGrid?.current?.resize?.('100%', '100%');
		refDetailCenterGrid?.current?.resize?.('100%', '100%');
		refDetailRightGrid?.current?.resize?.('100%', '100%');
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
							<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} purchaseCnt={purchaseCnt} gridBtn={headerGridBtn}>
								<Form form={detailForm} layout="inline" className="flex-wrap sect">
									<li className="sect">
										<span className={'pr10'}>선택 상품 발주 중량</span>
										<InputNumber
											name="weightSum"
											className="bg-white"
											width={120}
											defaultValue={0}
											precision={2}
											readOnly
										/>
									</li>
									<li className="sect">
										<span className={`pr10 ${chkDiffTime ? 'fc-red' : ''}`}>{lastCreation}</span>
										<Button name="" onClick={() => recreationPurchase({})}>
											집계생성
										</Button>
									</li>
									<li>
										<Datepicker name="receiveDt" placeholder={'입고예정일'} className="bg-white" />
									</li>
									<li className="sect">
										<Button name="" className="" onClick={applyAll}>
											일괄적용
										</Button>
									</li>
									{/* <Button>이메일발송</Button> */}
									<li>
										<Button onClick={() => setAllRowsVisible(!allRowsVisible)}>
											B/L별 {allRowsVisible ? '확대' : '축소'}
										</Button>
									</li>
									<li className={props.showTmpSaveButton ? 'sect' : ''}>
										<Button onClick={handleOpenPurchaseInspectPopup}>발주 전 검수</Button>
									</li>
									{/* <Button onClick={() => handleOpenPopup('BUYERKEY')}>수급담당</Button> */}
									<li>
										{/* <Button onClick={() => handleOpenPopup('DIRECTTYPE')}>직송그룹</Button> */}
										{props.showTmpSaveButton && (
											<Button onClick={clickTmpSave} className="ml5">
												조달임시저장
											</Button>
										)}
									</li>
								</Form>
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={getGridCol()} gridProps={getGridProps()} />
						</GridAutoHeight>
					</>,
					<Splitter
						key="OmPurchaseStorageDetail_Splitter_omPurchaseStorage_Auto_Out_Total"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<OmPurchaseStorageDetailLeftGrid
								key="OmPurchaseStorageDetailLeftGrid_omPurchaseStorage_Auto_Out_Total"
								ref={refDetailLeftGrid}
								selectedRow={selectedDetailRow}
							/>,
							<OmPurchaseStorageDetailCenterGrid
								key="OmPurchaseStorageDetailCenterGrid_omPurchaseStorage_Auto_Out_Total"
								ref={refDetailCenterGrid}
								selectedRow={selectedDetailRow}
							/>,
							<OmPurchaseStorageDetailRightGrid
								key="OmPurchaseStorageDetailRightGrid_omPurchaseStorage_Auto_Out_Total"
								ref={refDetailRightGrid}
								selectedRow={selectedDetailRow}
								masterItem={ref.gridRef.current?.getSelectedRows()[0]}
								gridRefMaster={ref.gridRef.current}
								poType={poType}
								isOutOrder={true}
								onDeleteList={handleDeletePurchaseModifyList}
								onReorderList={handleReorderPurchaseModifyList}
							/>,
						]}
					/>,
				]}
			/>

			<CustomModal ref={refModal2} width="1000px">
				<CmSearchPopup type={'allOrganize'} callBack={confirmPopup} close={closeEvent}></CmSearchPopup>
			</CustomModal>
			{/* 트랜잭션 팝업 영역 정의 */}
			<CustomModal ref={refTranModal} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEventTranPopup} />
			</CustomModal>
			<CustomModal ref={refEmailModal} width="800px">
				<OmPurchaseStorageAutoTotalPopupEmail
					close={closeEmailPopup}
					receiverData={emailPopupReceiverData}
					detailData={emailPopupDetailData}
				/>
			</CustomModal>
		</>
	);
});

export default OmPurchaseStorageAutoTotalOutDetail;
