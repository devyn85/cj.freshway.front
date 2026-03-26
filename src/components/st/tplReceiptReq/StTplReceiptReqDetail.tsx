/*
 ############################################################################
 # FiledataField	: StTplReceiptReqDetail.tsx
 # Description		: ​​정산항목관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.04
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function
import { apiGetDataSelectSkuForMsExDcRate } from '@/api/ms/apiMsExDcRate';
import { apisaveMasterList } from '@/api/st/apiStTplReceiptReq';
import AGridWrap from '@/assets/styled/AGridWrap/AGridWrap';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import StTplReceiptReqFileUploadPopup from '@/components/comfunc/func/filePage/StTplReceiptReqFileUploadPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import StTplReceiptReqUploadExcelPopup from '@/components/st/tplReceiptReq/StTplReceiptReqUploadExcelPopup';
import { useAppSelector } from '@/store/core/coreHook';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
//store
const StTplReceiptReqDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const gridId = uuidv4() + '_gridWrap';
	const dcCode = Form.useWatch('dcCode', props.form);
	// const custkey = Form.useWatch('custkey', props.form);
	const custkey = props.form.getFieldValue('custkey');
	const vendor = props.form.getFieldValue('vendor');
	const organize1 = Form.useWatch('organize', props.form);
	const tplBcnrId = Form.useWatch('tplUser', props.form);
	const organize = props.form.getFieldValue('organize');
	const user = useAppSelector(state => state.user.userInfo);

	const refModal = useRef(null);
	const refModal1 = useRef(null);
	const refModal2 = useRef(null);
	const uploadExcel = useRef(null);
	// 이미지 업로드
	const [docNo, setDocNo] = useState('');
	const [rowIndex, setRowIndex] = useState('');
	const [docType, setDocType] = useState('');
	const [flag, setFlag] = useState('');
	const [rowStatus, setRowStatus] = useState('');
	const [popupRef, setPopupRef] = useState(ref);
	const [isModalOpen, setIsModalOpen] = useState(false);
	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refModal2.current.handlerClose();
		setPopupRef(ref);
		setIsModalOpen(false);
		setDocNo('');
		setFlag('');
	};
	/**
	 * 셀 클릭 파일 업로드
	 * @param {object} item 파일 정보
	 * @returns {void}
	 */
	const onClickFileUploader = (item: any) => {
		//console.log((item);
		//console.log((flag);
		//console.log((docNo);
		// ...existing code...
		if (isEmpty(item.item.docNo)) {
			const validChk = popupRef.gridRef.current.getGridData();

			// rowStatus가 'I'이고 docNo가 있는 행들만 추출
			const rowsToUse = (validChk || []).filter((r: any) => r?.rowStatus === 'I' && r?.docNo);
			//console.log((rowsToUse);
			// 예: 첫 번째 매칭 행을 사용
			if (rowsToUse.length > 0) {
				const target = rowsToUse[0];
				// 필요한 필드로 payload 구성
				// const payload = {
				// 	docNo: target.docNo,
				// 	docType: target.docType,
				// 	tplBcnrId: target.tplBcnrId,
				// 	// ...추가로 보낼 필드
				// };
				//console.log(('use row:', target);
				setDocNo(target.docNo);
				setDocType(item.item.docType);
				setRowIndex(item.rowIndex);
				setRowStatus(item.item.rowStatus);
				refModal1.current.handlerOpen(popupRef);
				return;
				// 실제 처리 호출 예:
				// apisaveMasterList({ saveList: [target] }) 또는 원하는 로직
			} else {
				setDocNo('');
				setDocType(item.item.docType);
				setRowStatus(item.item.rowStatus);
				setRowIndex(item.rowIndex);
				refModal1.current.handlerOpen(popupRef);
				return;
			}
		}
		setDocNo(item.item.docNo);
		setDocType(item.item.docType);
		setRowStatus(item.item.rowStatus);
		setRowIndex(item.rowIndex);
		refModal1.current.handlerOpen(popupRef);
		return;
	};
	// ────────────────────────────────────────────────────────────────
	//  단가 / 수량 직접-환산 (EA·BOX·PAL·KG 전용)
	//  --------------------------------------------------------------
	//  • qtyPerBox   : EA per BOX
	//  • boxPerPal   : BOX per PAL
	//  • netWeightKg : kg  per EA
	// ────────────────────────────────────────────────────────────────
	type Unit = 'EA' | 'BOX' | 'PAL' | 'KG';

	const units: Unit[] = ['EA', 'BOX', 'PAL', 'KG'];
	const isUnit = (u: string | undefined | null): u is Unit => !!u && units.includes(u.toUpperCase() as Unit);

	const convertRate = (
		value: number,
		fromRaw: string | null | undefined,
		toRaw: string | null | undefined,
		qtyPerBox: number,
		boxPerPlt: number,
		netWeightKg: number,
		decimals = 2,
	): number | null => {
		if (!isUnit(fromRaw) || !isUnit(toRaw)) return null;
		if (value == null || Number.isNaN(value)) return null;

		// 필수 파라미터 방어 (0 또는 음수면 변환 불가)
		// if (qtyPerBox <= 0 || boxPerPlt <= 0 || netWeightKg <= 0) return null;

		const from = fromRaw.toUpperCase() as Unit;
		const to = toRaw.toUpperCase() as Unit;
		if (from === to) return value;

		// from → to 직접계수
		const factor: Record<Unit, Record<Unit, number>> = {
			EA: { EA: 1, BOX: 1 / qtyPerBox, PAL: 1 / (qtyPerBox * boxPerPlt), KG: netWeightKg },
			BOX: { EA: qtyPerBox, BOX: 1, PAL: 1 / boxPerPlt, KG: qtyPerBox * netWeightKg },
			PAL: { EA: qtyPerBox * boxPerPlt, BOX: boxPerPlt, PAL: 1, KG: qtyPerBox * boxPerPlt * netWeightKg },
			KG: {
				EA: 1 / netWeightKg,
				BOX: 1 / (qtyPerBox * netWeightKg),
				PAL: 1 / (qtyPerBox * boxPerPlt * netWeightKg),
				KG: 1,
			},
		};

		const coef = factor[from][to];
		const result = value * coef;

		// 소수 n자리 반올림
		const pow = Math.pow(10, decimals);
		const val = Math.round(result * pow) / pow;
		if (val === Infinity || val === undefined) {
			return 0;
		}
		return val;
		// return 1 / factor[from][to];
	};

	/**
	 * 편집 가능한 상태인지 확인하는 함수
	 * @param {any} item - 그리드 행 아이템
	 * @returns {boolean} - 편집 가능 여부
	 */
	const isDisabled = (item: any): boolean => {
		// 값이 없으면 ''가 아니고 null임
		// //console.log((item);
		if (commUtil.nvl(item.rowStatus, 'I') == 'I') {
			// 00:등록 상태일 때만 편집 가능
			return false;
		}
		return true;
	};
	/**
	 * SKU 상세 데이터 세팅
	 * @param value
	 * @param selectRow
	 */
	const getSkuSelectData = (value: any, selectRow: number) => {
		//console.log((value, 'value');
		const param = {
			sku: value,
		};

		apiGetDataSelectSkuForMsExDcRate(param).then(res => {
			const gridRef = ref.gridRef.current;
			const data = res.data;
			if (!data) {
				gridRef.setCellValue(selectRow, 'storageTypeSku', '');
				gridRef.setCellValue(selectRow, 'netWeight', '');
				gridRef.setCellValue(selectRow, 'qtyPerBox', '');
				gridRef.setCellValue(selectRow, 'baseUom', '');
				gridRef.setCellValue(selectRow, 'specCode', '');
				gridRef.setCellValue(selectRow, 'skuName', '');
				gridRef.setCellValue(selectRow, 'boxPerPlt', '');
				gridRef.setCellValue(selectRow, 'layerPerPlt', '');
				gridRef.setCellValue(selectRow, 'durationType', '');
				// gridRef.setCellValue(selectRow, 'orderQty', 0);
				// gridRef.setCellValue(selectRow, 'boxQty', 0);
				// gridRef.setCellValue(selectRow, 'pltQty', 0);

				return;
			}
			gridRef.setCellValue(selectRow, 'storageTypeSku', data.storageType);
			gridRef.setCellValue(selectRow, 'netWeight', data.netWeight);
			gridRef.setCellValue(selectRow, 'qtyPerBox', data.qtyPerBox);
			gridRef.setCellValue(selectRow, 'baseUom', data.baseUom);
			gridRef.setCellValue(selectRow, 'specCode', data.skuGroup);
			gridRef.setCellValue(selectRow, 'skuName', data.description);
			gridRef.setCellValue(selectRow, 'boxPerPlt', data.boxPerPlt);
			gridRef.setCellValue(selectRow, 'layerPerPlt', data.layerPerPlt);
			gridRef.setCellValue(selectRow, 'duration', data.duration);
			gridRef.setCellValue(selectRow, 'durationType', data.durationType);
			gridRef.setCellValue(selectRow, 'orderQty', 1);
			gridRef.setCellValue(selectRow, 'boxQty', 0);
			gridRef.setCellValue(selectRow, 'pltQty', 0);
		});
	};
	const gridCol = [
		// { dataField: 'duration', headerText: 'duration', width: 120, editable: false, visible: false },
		{ dataField: 'qtyPerBox', headerText: 'qtyPerBox', width: 120, editable: false, visible: false },
		{ dataField: 'netWeight', headerText: 'netWeight', width: 120, editable: false, visible: false },
		{ dataField: 'boxPerPlt', headerText: 'boxPerPlt', width: 120, editable: false, visible: false },
		{ dataField: 'tplBcnrId', headerText: 'tplBcnrId', width: 120, editable: false, visible: false },
		// { dataField: 'toCustKey', headerText: 'toCustKey', width: 120, editable: false, visible: false },
		{ dataField: 'durationType', headerText: 'durationType', width: 120, editable: false, visible: false },
		{ dataField: 'docType', headerText: '요청번호', width: 120, editable: false, visible: false },
		{ dataField: 'docNo', headerText: '요청번호', width: 120, editable: false },
		// {
		// 	dataField: 'sku',
		// 	headerText: '상품코드',
		// 	width: 130,
		// 	editable: true,
		// 	renderer: {
		// 		type: 'InputEditRenderer',
		// 		showEditorBtn: true, // 🔍 버튼처럼 보이게
		// 	},
		// },
		{
			dataField: 'sku',
			headerText: '상품코드',
			width: 109,
			dataType: 'code',
			// editable: false,
			required: true,
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	////console.log(((item.rowStatus);
			// 	if (!item || item.delYn == null) {
			// 		// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
			// 		return;
			// 	}
			// 	if (item.delYn !== 'N') {
			// 		// 편집 가능 class 삭제
			// 		ref.gridRef.current.removeEditClass(columnIndex);
			// 	} else {
			// 		// 편집 가능 class 추가
			// 		return 'isEdit';
			// 	}
			// },
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			commRenderer: {
				type: 'search',
				popupType: 'sku',
				searchDropdownProps: {
					dataFieldMap: {
						sku: 'code',
						skuName: 'name',
					},
					callbackBeforeUpdateRow: (e: any) => {
						const selectedIndex = ref.gridRef?.current?.getSelectedIndex();
						getSkuSelectData(e.code, selectedIndex[0]);
					},
				},
				params: {
					callFrom: '1',
					organize: organize,
					custkey: custkey,
				},

				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					const data = ref.gridRef.current.getSelectedRows();
					if (e.item?.rowStatus !== 'I') {
						return false;
					}

					// //console.log(params);
					refModal.current.open({
						gridRef: ref.gridRef,
						codeName: e.value, // 돋보기 눌러서는 모달 열 때 value는 undefined입니다. ( event type이 다름 )
						rowIndex,

						selectData: data[0],
						dataFieldMap: {
							sku: 'code',
							skuName: 'name',
						},
						data: {
							callFrom: '1',
							organize: data[0].organize,
							custkey: data[0].custKey,
						},
						onConfirm: (selectedRows: any[]) => {
							const dataFieldMap = {
								sku: 'code',
								skuName: 'name',
							};

							const rowData = selectedRows[0];
							const updateObj: Record<string, any> = {};
							Object.entries(dataFieldMap).forEach(([targetField, sourceField]) => {
								updateObj[targetField] = rowData[sourceField];
							});
							// 안전한 업데이트를 위해 next tick으로 밀기
							setTimeout(() => {
								getSkuSelectData(rowData.code, rowIndex);
								ref.gridRef?.current?.updateRow(updateObj, rowIndex);
								refModal.current?.handlerClose();
							}, 0);
							ref.gridRef?.current?.addCheckedRowsByIds(ref.gridRef?.current?.indexToRowId(rowIndex));
						},
						popupType: 'sku',
					});
				},
			},
		},
		{ dataField: 'skuName', headerText: '상품명', width: 160, editable: false, required: true },
		{ dataField: 'baseUom', headerText: '단위', width: 80, editable: false },
		{
			dataField: 'orderQty',
			headerText: '입고수량',
			dataType: 'numeric',
			width: 100,
			editable: true,
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'boxQty',
			headerText: '박스수량',
			dataType: 'numeric',
			width: 90,
			editable: false,
			// labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
			// 	//console.log((item);
			// 	return convertRate(item.orderQty, item.baseUom, 'BOX', item.qtyPerBox, item.boxPerPlt, item.netWeight);
			// },
		},
		{
			dataField: 'pltQty',
			headerText: 'PLT수량',
			dataType: 'numeric',
			width: 90,
			editable: false,
		},
		{
			dataField: 'deliveryDate',
			headerText: '입고예정일',
			width: 120,
			editable: true,
			required: true,
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) || value === '' ? '' : dayjs(value).format('YYYY-MM-DD') ?? '';
			},
		},
		// ...existing code...
		{
			dataField: 'openTime',
			headerText: '입고예정시간',
			width: 100,
			editable: true,

			dataType: 'code', // 시간 문자열(HHmm)로 처리
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowPoint: false,
				allowNegative: false,
				maxlength: 4,
				regExp: /^\d{0,4}$/,
			},
			labelFunction: (rowIndex: number, colIndex: number, value: any) => {
				if (value === null || value === undefined || value === '') return '';
				const s = String(value).replace(/\D/g, '').padStart(4, '0').slice(0, 4);
				return `${s.slice(0, 2)}:${s.slice(2)}`; // "HH:mm"
			},
		},
		{
			dataField: 'durationRate',
			headerText: '소비기한잔여(%)',
			dataType: 'code',
			width: 140,
			editable: false,
		},
		// {
		// 	dataField: 'lottable01',
		// 	headerText: 'lottable01',
		// 	width: 120,
		// 	editable: false,
		// },
		{
			dataField: 'durationFrom',
			headerText: '제조일자',
			width: 120,
			editable: true,
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (!isDisabled(item) || item.durationType === '1') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) || value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD') ?? '';
			},
		},

		{
			dataField: 'durationTo',
			headerText: '소비기한',
			width: 120,
			editable: true,
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (!isDisabled(item) || item.durationType === '2') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) || value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD') ?? '';
			},
		},
		{
			dataField: 'convSerialNo',
			headerText: 'B/L번호',
			width: 140,
			editable: true,
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		{
			dataField: 'serialNo',
			headerText: '이력번호',
			width: 140,
			editable: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'attachment',
			headerText: '증빙첨부',
			width: 100,
			editable: false,
			renderer: {
				type: 'ButtonRenderer',
				// labelText: '첨부',
				onClick: (event: any) => {
					onClickFileUploader(event);
				},
			},
		},
		{
			dataField: 'rmk',
			headerText: '비고',
			width: 200,
			editable: true,
			renderer: {
				type: 'InputEditRenderer',
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				// //console.log((item);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		{
			dataField: 'addWho',
			headerText: '등록자',
			width: 90,
			dataType: 'manager',
			managerDataField: 'addWhoId',
			editable: false,
		},
		{
			dataField: 'addDate',
			headerText: '등록일시',
			dataType: 'date',

			dateInputFormat: 'yyyymmddHHMMss', // 실제 데이터의 형식 지정
			formatString: 'yyyy-mm-dd HH:MM:ss', // 실제 데이터 형식을 어떻게 표시할지 지정
			editable: false,
		},
		{
			dataField: 'editWho',
			headerText: '수정자',
			width: 90,
			dataType: 'manager',
			managerDataField: 'editWhoId',
			editable: false,
		},
		{
			dataField: 'editDate',
			headerText: '수정일시',
			editable: false,
			dataType: 'date',

			dateInputFormat: 'yyyymmddHHMMss', // 실제 데이터의 형식 지정
			formatString: 'yyyy-mm-dd HH:MM:ss', // 실제 데이터 형식을 어떻게 표시할지 지정
		},
	];

	const gridProps = {
		editable: true,
		// showStateColumn: true,
		// editable: true,
		//editBeginMode: 'doubleClick',
		fillColumnSizeMode: false,
		enableColumnResize: true,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		enableFilter: true,
		matchColumnName: 'dataField', // ← headerText 말고 dataField 기준 매칭
		enableMovingColumn: false,
		// isLegacyRemove: true,
		// showFooter: true,
	};
	const footerLayout = [
		{
			dataField: 'slipDt',
			positionField: 'slipDt',
			operation: 'COUNT',
			postfix: ' rows',
		},
	];
	const popupCallBack = (item: any) => {
		//console.log((item);
		const selectedIndex = popupRef.gridRef?.current?.getSelectedIndex();
		//console.log((selectedIndex, '12');
		if (!isEmpty(item.newDocNo)) {
			//console.log(('없');
			const codeDtl1 = popupRef.gridRef.current.getChangedData({ validationYn: false });
			const codeDtl = (codeDtl1 || []).filter((r: any) => r?.rowStatus === 'I');
			//console.log((codeDtl);
			for (const e of codeDtl) {
				const data = {
					_$uid: e._$uid ?? e.uid ?? e.serialKey, // 그리드 식별자
					// serialKey: e.serialKey,
					// toDate: dayjs(n.fromDate, 'YYYYMMDD').subtract(1, 'day').format('YYYYMMDD'), // 종료일을 어제로 설정
					// rowStatus: 'U',
					docNo: item.newDocNo,
					attachment: item.count,
				};
				popupRef.gridRef.current.updateRowsById(data);
				// ref.gridRef?.current?.setCellValue(, 'docNo', item.newDocNo);
			}

			setDocNo(item.newDocNo);
			setFlag('Y');
			popupRef.gridRef?.current?.setCellValue(rowIndex, 'attachment', item.count);
		} else if (
			popupRef.gridRef.current
				.getChangedData({ validationYn: false })
				.filter((r: any) => r?.rowStatus === 'I' && !isEmpty(r?.docNo)).length > 0
		) {
			const list = popupRef.gridRef.current
				.getChangedData({ validationYn: false })
				.filter((r: any) => r?.rowStatus === 'I' && !isEmpty(r?.docNo));
			//console.log((list);
			const docno = list[0].docNo;
			//console.log((docno);
			const codeDtl1 = popupRef.gridRef.current.getChangedData({ validationYn: false });
			const codeDtl = (codeDtl1 || []).filter((r: any) => r?.rowStatus === 'I');
			for (const e of codeDtl) {
				const data = {
					_$uid: e._$uid ?? e.uid ?? e.serialKey, // 그리드 식별자
					// serialKey: e.serialKey,
					// toDate: dayjs(n.fromDate, 'YYYYMMDD').subtract(1, 'day').format('YYYYMMDD'), // 종료일을 어제로 설정
					// rowStatus: 'U',
					docNo: docNo,
					attachment: item.count,
				};
				popupRef.gridRef.current.updateRowsById(data);
				// popupRef.gridRef.current.addUncheckedRowsByValue('_$uid', e._$uid);
				// ref.gridRef?.current?.setCellValue(, 'docNo', item.newDocNo);
			}
		} else {
			// ref.gridRef?.current?.setCellValue(rowIndex, 'attachment', item.count);

			const codeDtl1 = popupRef.gridRef.current.getGridData();
			const docNo = popupRef.gridRef.current.getGridData()[selectedIndex[0]];

			const codeDtl = (codeDtl1 || []).filter(
				(r: any) =>
					(r?.rowStatus !== 'I' || r?.rowStatus === undefined || r.rowStatus === null || r.rowStatus === 'U') &&
					r.docNo === docNo.docNo,
			);
			//console.log((codeDtl);
			//console.log((docNo.docNo);
			//console.log((codeDtl1);
			for (const e of codeDtl) {
				const data = {
					_$uid: e._$uid ?? e.uid ?? e.serialKey, // 그리드 식별자
					// serialKey: e.serialKey,
					// toDate: dayjs(n.fromDate, 'YYYYMMDD').subtract(1, 'day').format('YYYYMMDD'), // 종료일을 어제로 설정
					// rowStatus: 'U',
					attachment: item.count,
				};
				popupRef.gridRef.current.updateRowsById(data);
				// popupRef.gridRef.current.addUncheckedRowsByValue('_$uid', e._$uid);
				// ref.gridRef?.current?.setCellValue(, 'docNo', item.newDocNo);
			}
			// ref.gridRef?.current?.addUncheckedRowsByIds('docNo', docNo);
		}
		//console.log((item.count);

		refModal1.current.handlerClose();
		// search();
	};

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	type RequestType = 'N' | 'Y' | 'R';
	type DurationTypeLike = 'EXPIRE' | 'MANUFACTURE' | '1' | '2' | '3' | '' | null | undefined;

	/**
	 * 내부: 'YYYYMMDD' 또는 'YYYY-MM-DD'를 Date(로컬 00:00)로 파싱
	 * @param ymdRaw
	 */
	function parseYmdToLocalDate(ymdRaw: string | null | undefined): Date | null {
		if (!ymdRaw) return null;
		const ymd = ymdRaw.replace(/-/g, '');
		if (!/^\d{8}$/.test(ymd)) return null;

		const y = Number(ymd.slice(0, 4));
		const m = Number(ymd.slice(4, 6)) - 1; // 0-based
		const d = Number(ymd.slice(6, 8));

		const dt = new Date(y, m, d, 0, 0, 0, 0); // 로컬 자정
		// 유효성 재확인 (월말 초과 등)
		if (dt.getFullYear() !== y || dt.getMonth() !== m || dt.getDate() !== d) return null;
		return dt;
	}

	/**
	 * 내부: 소수/문자 DURATION을 정수로 안전 변환
	 * @param n
	 */
	function toInt(n: number | string | null | undefined): number | null {
		if (n === null || n === undefined || n === '') return null;
		const v = typeof n === 'number' ? n : Number(String(n).trim());
		return Number.isFinite(v) ? Math.trunc(v) : null;
	}

	/** 내부: 오라클 TRUNC(SYSDATE) (로컬 타임존 기준 자정) */
	function todayTruncLocal(): Date {
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
	}

	/**
	 * 내부: 날짜 차이(일수). (end - start) 을 "정수일"로 계산
	 * @param end
	 * @param start
	 */
	function diffDays(end: Date, start: Date): number {
		// 밀리초 → 일수. 로컬자정만 쓰고 있으니 표류 최소화
		const MS = 24 * 60 * 60 * 1000;
		return Math.trunc((end.getTime() - start.getTime()) / MS);
	}

	/**
	 * 내부: 오라클 CASE 로직과 동일한 DURATIONTYPE 정규화
	 * @param raw
	 */
	function normalizeDurationType(raw: DurationTypeLike): 'EXPIRE' | 'MANUFACTURE' {
		if (raw === null || raw === undefined || raw === '') return 'EXPIRE';
		const s = String(raw).toUpperCase();
		if (s === 'EXPIRE' || s === '1') return 'EXPIRE';
		if (s === 'MANUFACTURE' || s === '2' || s === '3') return 'MANUFACTURE';
		return 'EXPIRE';
	}

	/**
	 * 오라클 FN_LOTDURATION과 동일한 규칙으로 동작
	 * - durationType: 'EXPIRE' | 'MANUFACTURE' | '1' | '2' | '3' | null | undefined
	 * - duration: 문자열/숫자 모두 허용 (정수로 변환)
	 * - lottable01: 'YYYYMMDD' 또는 'YYYY-MM-DD'
	 * - requestType: 'N' | 'Y' | 'R'
	 *
	 * 반환:
	 *  - 'N' | 'Y' : string (오라클처럼 문자열. 예외 시 '')
	 *  - 'R'       : number (반환형 VARCHAR2였지만 오라클도 숫자 → 문자열 암시변환하므로, 프런트에선 number가 편의적)
	 * @param durationType
	 * @param duration
	 * @param lottable01
	 * @param requestType
	 */
	function fnLotDuration(
		durationType: DurationTypeLike,
		duration: number | string | null | undefined,
		lottable01: string | null | undefined,
		requestType: RequestType,
	): string | number {
		try {
			const durType = normalizeDurationType(durationType);
			const dur = toInt(duration);
			const base = parseYmdToLocalDate(lottable01);
			const today = todayTruncLocal();

			if (dur === null || !base) {
				// 오라클 예외 처리와 동일
				return requestType === 'R' ? 0 : '';
			}

			// 오라클: EXPIRE → 유통기한 그대로
			//        MANUFACTURE → (제조일 + DURATION - 1)이 유통기한(마감일)
			let expireDate: Date;
			if (durType === 'EXPIRE') {
				expireDate = base;
			} else {
				const ex = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0, 0);
				ex.setDate(ex.getDate() + dur - 1);
				expireDate = ex;
			}

			if (requestType === 'N') {
				// 잔여일: (유통기한 - 오늘) + 1
				let n = diffDays(expireDate, today) + 1;
				// 오라클 보정: 0일이 나오지 않도록 0/음수는 -1 추가
				n = n >= 1 ? n : n - 1;

				// 오라클은 문자열 반환
				return String(Math.trunc(n));
			}

			if (requestType === 'Y') {
				// 오라클: 남은일수가 DURATION/3 보다 작은 경우 'Y'
				// (EXPIRE: expireDate - today)
				// (MANUFACTURE: base + DURATION - today) < DURATION/3
				const left =
					durType === 'EXPIRE'
						? diffDays(expireDate, today)
						: diffDays(new Date(base.getFullYear(), base.getMonth(), base.getDate() + dur), today);

				const isOver = left < dur / 3;
				return isOver ? 'Y' : 'N';
			}

			if (requestType === 'R') {
				// 오라클: N 호출 결과(잔여일수)를 이용해 (DURATION - 잔여)/DURATION*100 반올림
				// 주의: "잔여율"이라는 주석과 달리 '경과율'에 가까운 수식이므로 백엔드와 1:1로 유지
				const nStr = fnLotDuration(durationType, duration, lottable01, 'N') as string;
				const nRemain = Number(nStr);
				if (!Number.isFinite(nRemain)) return 0;

				if (nRemain > 0) {
					const rate = Math.round(((dur - nRemain) / dur) * 100);
					return rate;
				}
				return 0;
			}

			// 정의 외 요청타입은 오라클처럼 빈 값
			return requestType === 'R' ? 0 : '';
		} catch {
			// 오라클 EXCEPTION WHEN OTHERS THEN '' / 0
			return requestType === 'R' ? 0 : '';
		}
	}

	/**
	 * 저장로직
	 * @returns
	 */
	const saveMaster = () => {
		const codeDtl1 = ref.gridRef.current.getChangedData({ validationYn: false });
		const validChk = ref.gridRef.current.getGridData();
		// //console.log((codeDtl);
		const codeDtl = (codeDtl1 || []).filter((r: any) => r?.rowStatus === 'I');
		const rowsToUse = (codeDtl || []).filter((r: any) => r?.rowStatus !== 'I');
		// 수정:
		const fileList = codeDtl.filter(item => Number(item.attachment) !== 0);
		const attachedList = codeDtl.filter(item => Number(item.attachment) !== 0 && item.attachment != null);
		const missingAttachCount = codeDtl.length - attachedList.length;
		//console.log((fileList);
		//console.log((codeDtl, 'codeDtl');
		for (const e of rowsToUse) {
			const item = {
				_$uid: e._$uid ?? e.uid ?? e.serialKey, // 그리드 식별자
				rowStatus: 'U',
			};
			ref.gridRef.current.updateRowsById(item);
			ref.gridRef.current.addUncheckedRowsByValue('_$uid', e._$uid);
		}
		if (!codeDtl || codeDtl.length < 1) {
			ref.gridRef.current.showConfirmSave(() => {
				return;
			});
		} else if (codeDtl.length > 0 && !ref.gridRef.current.validateRequiredGridData()) {
			return;
		} else if (user.emptype !== 'A01' && missingAttachCount > 0) {
			showAlert('', '증빙첨부는 필수입니다.');
			return;
		} else {
			showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
				const saveList = {
					saveList: codeDtl,
				};

				////console.log((saveList);
				apisaveMasterList(saveList)
					.then(res => {
						if (res.statusCode === 0) {
							ref.gridRef.current.clearGridData();
							props.fnCallBack(); // 저장 성공 후에만 호출
							showAlert('저장', '저장되었습니다.');
							setDocNo('');
							setFlag('');
						} else {
							return false;
						}
					})
					.catch(e => {
						return false;
					});
			});
		}
	};

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					entrustedCarYn: 'N',
					fixCarYn: 'N',
					tmpCarYn: 'N',
					actualCostCarYn: 'N',
					dcCode: dcCode,
					rowStatus: 'I',
					fromCustKey: vendor,
					custKey: custkey,
					tplBcnrId: tplBcnrId,
					docType: 'DP',
					attachment: 0,
					// fromCustName: custkeyNm?.replace(/\[\d+\]/g, ''),
					organize: organize,
				},
				callBackFn: () => {
					if (isEmpty(custkey) || isEmpty(organize) || isEmpty(tplBcnrId)) {
						const rowindex = ref.gridRef.current.getSelectedIndex()[0];
						ref.gridRef.current.removeRow(rowindex);
						showAlert('', '검색 조건의 화주, 창고를 입력해주세요');
					}
				},
			},
			{
				btnType: 'delete', // 행삭제
			},

			{
				btnType: 'save', // 저장
				callBackFn: saveMaster,
			},
		],
	};
	// 'YYYYMMDD'만 허용. 하이픈/슬래시 등 있으면 숫자만 추출해 8자리 사용.
	const normalizeYMD = (raw?: string | null) => {
		if (!raw) return null;
		const onlyNum = (raw + '').toUpperCase().trim();
		if (onlyNum === 'STD') return null; // STD는 날짜 없음 처리
		const ymd = onlyNum.replace(/[^0-9]/g, '').slice(0, 8);
		return ymd.length === 8 ? ymd : null;
	};

	const parseYYYYMMDD_UTC = (ymd: string) => {
		const y = Number(ymd.slice(0, 4));
		const m = Number(ymd.slice(4, 6));
		const d = Number(ymd.slice(6, 8));
		const dt = new Date(Date.UTC(y, m - 1, d));
		// 유효성 체크 (예: 20250230 방지)
		if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
		return dt;
	};

	const formatYYYYMMDD_UTC = (dt: Date) => {
		const y = dt.getUTCFullYear();
		const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
		const d = String(dt.getUTCDate()).padStart(2, '0');
		return `${y}${m}${d}`;
	};

	// const addDaysUTC = (dt: Date, days: number) => {
	// 	const nd = new Date(dt.getTime());
	// 	nd.setUTCDate(nd.getUTCDate() + days);
	// 	return nd;
	// };
	const addDaysUTC = (dt: Date, days: number | string) => {
		const n = Number(days);
		if (!Number.isFinite(n)) return dt; // 또는 null 처리
		const nd = new Date(dt.getTime());
		nd.setUTCDate(nd.getUTCDate() + n);
		return nd;
	};
	// 문자열 'YYYYMMDD' <-> Date 사이 안전 변환
	const ymdPlusDays = (ymdRaw: string, days: number) => {
		const ymd = normalizeYMD(ymdRaw);
		if (!ymd) return null;
		const dt = parseYYYYMMDD_UTC(ymd);
		if (!dt) return null;

		return formatYYYYMMDD_UTC(addDaysUTC(dt, days));
	};
	/**
	 * 엑셀 업로드 팝업
	 */
	const onExcelUploadPopupClick = () => {
		// if (props.user !== '2170') return;
		if (ref.gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			showConfirm(
				null,
				t('msg.MSG_COM_CFM_009'),
				() => {
					// 					custKey={custkey}
					// tplBcnrId={tplBcnrId}
					// dcCode={dcCode}
					if (isEmpty(custkey) || isEmpty(tplBcnrId) || isEmpty(organize)) {
						showAlert('', '창고와 화주를 입력해주세요');
						return;
					}
					//console.log((custkey);
					setPopupRef(refModal2);
					refModal2.current.handlerOpen();

					setIsModalOpen(true);
				},
				() => {
					return false;
				},
			);
		} else {
			if (isEmpty(custkey) || isEmpty(tplBcnrId) || isEmpty(organize)) {
				showAlert('', '창고와 화주를 입력해주세요');
				return;
			}
			setPopupRef(refModal2);
			refModal2.current.handlerOpen();
			setIsModalOpen(true);
		}
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		//console.log((gridRefCur);

		ref.gridRef.current.bind('cellDoubleClick', (e: any) => {
			if (e.dataField === 'sku') {
				// 상품코드 셀 더블클릭하면 상품상세팝업 표시
				const rowIndex = e.rowIndex;
				//console.log((e);
				if (e.item.rowStatus !== 'I') return;
				// // 예: custcd 컬럼에서 팝업 열기
				// refModal.current.open({
				// 	gridRef: ref.gridRef,
				// 	rowIndex,
				// 	dataFieldMap: {
				// 		courier: 'code',
				// 		courierNm: 'name',
				// 	},
				// 	popupType: 'sku',
				// });
				// const rowIndex = e.rowIndex;
				// 	const data = ref.gridRef.current.getSelectedRows();
				// 	refModal.current.open({
				// 		gridRef: ref.gridRef,
				// 		codeName: e.value, // 돋보기 눌러서는 모달 열 때 value는 undefined입니다. ( event type이 다름 )
				// 		rowIndex,
				// 		selectData: data[0],
				// 		dataFieldMap: {
				// 			sku: 'code',
				// 			skuName: 'name',
				// 		},
				// 		onConfirm: (selectedRows: any[]) => {
				// 			const dataFieldMap = {
				// 				sku: 'sku',
				// 				skuName: 'name',
				// 			};
				// 			//console.log((selectedRows);
				// 			const rowData = selectedRows[0];
				// 			const updateObj: Record<string, any> = {};
				// 			Object.entries(dataFieldMap).forEach(([targetField, sourceField]) => {
				// 				updateObj[targetField] = rowData[sourceField];
				// 			});
				// 			// 안전한 업데이트를 위해 next tick으로 밀기
				// 			setTimeout(() => {
				// 				//console.log((rowData, 'rowData.code');
				// 				getSkuSelectData(rowData.sku, rowIndex);
				// 				ref.gridRef?.current?.updateRow(updateObj, rowIndex);
				// 				refModal.current?.handlerClose();
				// 			}, 0);
				// 			ref.gridRef?.current?.addCheckedRowsByIds(ref.gridRef?.current?.indexToRowId(rowIndex));
				// 		},
				// 		popupType: 'sku',
				// 	});
			}
		});
		gridRefCur.bind('cellEditBegin', function (event: any) {
			const row = event.rowIndex;
			// //console.log((event);
			const e = event.dataField;
			const data = event.item;
			// //console.log((data);
			if ((e === 'durationFrom' || e === 'durationTo') && (isEmpty(data.durationType) || data.durationType === 'N')) {
				return false;
			}
			if (e === 'durationFrom') {
				if (data.durationType === '1') {
					// 편집 불가
					return false;
				}
			}
			if (e === 'durationTo') {
				// item.durationType === '2';
				if (data.durationType === '2') {
					// 편집 불가
					return false;
				}
			}
			if (event.item.rowStatus !== 'I' || !event.item.rowStatus) {
				// //console.log((data?.rowStatus, 'FALSE');
				return false;
			} else {
				// //console.log((data?.rowStatus);
				return true;
			}
		});
		// gridRefCur.bind('addRow', function (event: any) {
		// 	//console.log((event);
		// 	// const rows = gridRefCur.getRowsByValue('docNo', ['Anna', 'Lawrence']);
		// 	const codeDtl = ref.gridRef.current.getChangedData({ validationYn: false });
		// 	const list = codeDtl.filter(item => {
		// 		!isEmpty(item.docNo) && item.rowStatus === 'I';
		// 	});
		// 	//console.log((list);
		// 	if (list.length > 0) {
		// 		gridRefCur.setCellValue(event.rowIndex, 'docNo', list.get(0).docNo);
		// 	}
		// });
		gridRefCur.bind('cellEditEnd', async (event: any) => {
			const row = event.rowIndex;
			//console.log((event);
			const e = event.dataField;
			const data = event.item;
			if (e === 'durationFrom' || e === 'durationTo') {
				//console.log((event.item);
				gridRefCur.setCellValue(row, 'lottable01', event.value);
				if (!isEmpty(event.item.durationType)) {
					const duration = event.item.duration;
					const durationType = event.item.durationType;
					// const date = new Date(event.item.lottable01);

					if (durationType === '1') {
						// "~까지": lottable01 = 소 비기한(만료일)
						const durationTo = event.value; // 그대로
						const durationFrom = ymdPlusDays(event.value, -duration); // 소비기한 - 기간

						gridRefCur.setCellValue(row, 'durationTo', durationTo ?? '');
						gridRefCur.setCellValue(row, 'durationFrom', durationFrom ?? '');
					} else if (durationType === '2') {
						// "~부터": lottable01 = 시작일(기준일)

						const durationFrom = event.value; // 그대로
						const durationTo = ymdPlusDays(event.value, duration); // 기준일 + 기간

						gridRefCur.setCellValue(row, 'durationFrom', durationFrom ?? '');
						gridRefCur.setCellValue(row, 'durationTo', durationTo ?? '');
					} else {
						// 정의되지 않은 타입은 둘 다 공백 처리
						gridRefCur.setCellValue(row, 'durationFrom', '');
						gridRefCur.setCellValue(row, 'durationTo', '');
						gridRefCur.setCellValue(row, 'lottable01', '');
						return false;
					}
				} else {
					// 정의되지 않은 타입은 둘 다 공백 처리
					gridRefCur.setCellValue(row, 'durationFrom', '');
					gridRefCur.setCellValue(row, 'durationTo', '');
					gridRefCur.setCellValue(row, 'lottable01', '');
					return false;
				}
			}
			if (e === 'orderQty') {
				//console.log((data.qtyPerBox, data.boxPerPlt, data.netWeight);
				// //console.log(event);
				if (event.value <= 0) {
					showAlert('', '입고량은 0보다 커야합니다.');
					gridRefCur.setCellValue(row, 'orderQty', event.oldValue);
					return;
				}
				const val = convertRate(data.orderQty, data.baseUom, 'BOX', data.qtyPerBox, data.boxPerPlt, data.netWeight);
				const val1 = convertRate(data.orderQty, data.baseUom, 'PAL', data.qtyPerBox, data.boxPerPlt, data.netWeight);
				//console.log((data.baseUom);
				//console.log((val);
				//console.log((val1);
				gridRefCur.setCellValue(row, 'boxQty', val);
				gridRefCur.setCellValue(row, 'pltQty', val1);
			}
			if (e === 'openTime') {
				if (isEmpty(event.value)) {
					gridRefCur.setCellValue(row, 'openTime', '');
					return;
				}
				const raw = String(event.value ?? '')
					.replace(/\D/g, '')
					.padStart(4, '0')
					.slice(0, 4);
				const hh = parseInt(raw.slice(0, 2), 10);
				const mm = parseInt(raw.slice(2), 10);
				if (Number.isNaN(hh) || Number.isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
					await showAlert('입력오류', '시간은 0000 ~ 2359 범위의 숫자로 입력해주세요.');
					// 되돌리기
					if (typeof event.revert === 'function') {
						event.revert();
					} else {
						// gridRefCur.setCellValue(row, 'openTime', event.oldValue);
					}
				} else {
					// 저장값은 "HHmm" (숫자4자리)로 유지
					gridRefCur.setCellValue(row, 'openTime', raw);
				}
			}
			if (e === 'lottable01') {
				// const
				if (!data.duration || !data.lottable01) {
					//console.log((1);
					return 0;
				}
				const val2 = fnLotDuration('EXPIRE', data.duration, data.lottable01, 'R'); // 예: "56"
				if (val2 === 0) {
					gridRefCur.setCellValue(row, 'durationRate', 0 + '%');
				}
				gridRefCur.setCellValue(row, 'durationRate', val2 + '%');
			}
			if (e === 'lottableFrom' || e === 'lottableTo') {
				//console.log((event);
			}
		});
	}, []);

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			const newData = (Array.isArray(props.data) ? props.data : [props.data]).map(item => ({
				...item,
				customRowCheckYn: 'N',
			}));

			gridRefCur?.setGridData(newData);
			// gridRefCur?.setGridData(props.data);

			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				gridRefCur.setColumnSizeList(colSizeList);
				gridRefCur.setColumnPropByDataField('sku', { width: 90 });
				////console.log((props.data);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGridWrap className="contain-wrap">
				<AGrid>
					<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} gridBtn={gridBtn}>
						<Button onClick={onExcelUploadPopupClick}>{t('lbl.EXCELUPLOAD')}</Button>
						<input ref={uploadExcel} id="uploadInput" type="file" style={{ display: 'none' }} />
					</GridTopBtn>
					<AUIGrid
						ref={ref.gridRef}
						name={gridId}
						columnLayout={gridCol}
						gridProps={gridProps}
						footerLayout={footerLayout}
					/>
				</AGrid>
			</AGridWrap>
			<CmSearchWrapper ref={refModal} />
			<CustomModal ref={refModal1} width="600px">
				<StTplReceiptReqFileUploadPopup
					ref={refModal1}
					docNo={docNo}
					docType={docType}
					rowStatus={rowStatus}
					callBack={popupCallBack}
				/>
			</CustomModal>
			<CustomModal ref={refModal2} width="1000px">
				<StTplReceiptReqUploadExcelPopup
					gridCol={gridCol}
					save={saveMaster}
					close={closeEvent}
					// uploadFile={onClickFileUploader}
					isDisabled={isDisabled}
					convert={convertRate}
					lotDuration={fnLotDuration}
					fromCustKey={vendor}
					fnCallBack={props.fnCallBack}
					custKey={custkey}
					tplBcnrId={tplBcnrId}
					dcCode={dcCode}
					ref={refModal2}
					docType={'DP'}
					organize={organize}
					// setSepecCodeDetail={setSepecCodeDetail}
				/>
			</CustomModal>
		</>
	);
});
export default StTplReceiptReqDetail;
