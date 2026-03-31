/*
 ############################################################################
 # FiledataField	: TmAmountByCarSearch.tsx
 # Description		: 차량별 수당관리
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.07.14
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import dateUtils from '@/util/dateUtil';
import { Button, Form } from 'antd/lib';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';

// Component
import CmSearchCarrierWrapper from '@/components/cm/popup/CmSearchCarrierWrapper';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import TmAmountByCarExcelPopup from '@/components/tm/amountbycar/TmAmountByCarExcelPopup';
import TmAmountByCarFileUploadPopup from '@/components/tm/amountbycar/TmAmountByCarFileUploadPopup';

// Type
import { GridBtnPropsType } from '@/types/common';

// API Call Function
import { apiGetCarInfo, apiGetTrspCloseChk, apiSaveExcel as apiSaveMasterList } from '@/api/tm/apiTmAmountByCar';
import { apiGetMasterList } from '@/api/tm/apiTmEntityRule';
import { apiGetMasterList as apiGetMasterMngList } from '@/api/tm/apiTmManageEntity';

// Store
import { getCommonCodebyCd, getCommonCodeList, getCommonCodeListByData } from '@/store/core/comCodeStore';

const TmAmountByCarDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const [sttlItemList, setSttlItemList] = useState([]);
	// 다국어
	const { t } = useTranslation();
	const dccode = Form.useWatch('fixdccode', props.form);
	const searchDate = Form.useWatch('basedtRange', props.form);
	const courier = Form.useWatch('courier', props.form);
	const [applyForm] = Form.useForm();
	const [totalCnt, setTotalCnt] = useState(props.totalCnt);
	const [changeDccode, setChangeDccode] = useState(false);
	const refModal = useRef(null);
	const refModal1 = useRef(null);
	const refAttchFileModal = useRef(null);
	const excelInputRef = useRef(null);
	const refSttlItemList = useRef([]);
	const refSttlItemList1 = useRef([]);
	const [codeList, setCodeLiist] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const today = dayjs().format('YYYYMMDD');
	const [serialkeyH, setSerialkeyH] = useState();

	// 차량 톤수 코드 조회
	const carcapacityLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CARCAPACITY', value)?.cdNm;
	};
	// 계약유형 코드 조회
	const contracttypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;
	};
	//
	const carOrderLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CAR_ORDERCLOSE', value)?.cdNm;
	};
	//
	const getTmcaclItmeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('TM_CALC_ITEM', value)?.cdNm;
	};
	//
	const getApplyCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('ADJUST_APPLY_TYPE', value)?.cdNm;
	};
	// 정산유형 코드 조회
	const sttlItemCdFunc = () => {
		// data1이 'D' 또는 'P'인 항목만 필터링
		const D = getCommonCodeListByData('TM_CALC_ITEM', 'D', null, null, null);
		const P = getCommonCodeListByData('TM_CALC_ITEM', 'P', null, null, null);
		return [...D, ...P];
	};
	// 정산구분 코드 조회
	const sttlItemTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('TM_CALC_TYPE', value)?.cdNm;
	};
	//물류센터 공통코드 호출
	const getCustomCommonCodeList = (owIndex: any, columnIndex: any, value: any) => {
		const list = getCommonCodeList('WMS_MNG_DC', '공통', 'STD');
		const convert = list.map(item => ({
			...item,
			display: item.comCd && item.comCd !== 'STD' ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
		}));
		let result = null;
		if (!commUtil.isEmpty(convert)) {
			result = convert.find((el: any) => {
				if (el.comCd === value) {
					return el;
				}
			});
		}
		return result ? result.display : null;
	};

	const setCarInfo = (value: any) => {
		const selectRow = ref.gridRef.current.getSelectedIndex()[0];
		const currentCourier = ref.gridRef.current.getCellValue(selectRow, 'courier');
		const currentCourierNm = ref.gridRef.current.getCellValue(selectRow, 'couriername');
		const fromdate = ref.gridRef.current.getCellValue(selectRow, 'fromdate');
		const dccode = ref.gridRef.current.getCellValue(selectRow, 'dccode');

		apiGetCarInfo({
			carno: value.carno,
			sttlitemcd: value.sttlItemCd,
			courier: value.courier,
			fromdt: fromdate,
			fixdccode: dccode,
		})
			.then((res: any) => {
				// 수정할 값 구성
				const item = res.data[0];

				if (item?.contracttype === 'TEMPORARY') {
					showAlert('', '해당 차량은 실비차 입니다.');
					return;
				}

				const updatedRow = {
					// ...rowItem,
					courier: item?.courier,
					couriername: item?.couriername,
					carcapacity: item?.carcapacity,
					carno: item?.carno,
					contracttype: item?.contracttype,
					caragentkey: item?.caragentkey,
					caragentname: item?.caragentname,
					masterAmount: isEmpty(value.sttlItemCd) ? '' : item?.amount,
					other03: item?.other03,
					sttlitemcd: '',
				};

				// 해당 행에 값 업데이트
				ref.gridRef.current.updateRow(updatedRow, selectRow);
				// if (currentCourier !== item?.courier) {
				// getSttlItemList();
				// }
				// 팝업 닫기
				refModal.current?.handlerClose();
			})
			.catch(error => {
				// 에러가 발생해도 팝업은 닫기
				refModal.current?.handlerClose();
			});
	};
	// 그리드 컬럼 정의
	const gridCol = [
		{
			dataField: 'dccode',
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			headerText: '물류센터',
			editable: false,
			visible: true,
			dataType: 'code',
			notBeginEventNewRowsOnPaste: true,
			labelFunction: getCustomCommonCodeList,
		},

		{
			dataField: 'courier',
			headerText: '운송사',
			editable: false,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			visible: true,
			required: true,
			dataType: 'text',
			notBeginEventNewRowsOnPaste: true,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return ref.gridRef.current.getCellValue(rowIndex, 'couriername') || '';
			},
		},
		{
			dataField: 'carno',
			headerText: '차량번호',
			editable: true,
			required: true,
			minWidth: 160,
			notBeginEventNewRowsOnPaste: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			commRenderer: {
				type: 'search',
				popupType: 'car',
				searchDropdownProps: {
					dataFieldMap: {
						sku: 'code',
						skuName: 'name',
						defDccode: dccode,
					},
					callbackBeforeUpdateRow: (e: any) => {
						const selectedIndex = ref.gridRef?.current?.getSelectedIndex();
						const rowItem = ref.gridRef?.current?.getGridData()[selectedIndex[0]];
						// 차량 상세
						setCarInfo({
							carno: e.code,
							sttlItemCd: rowItem.sttlItemCd,
							rowIndex: selectedIndex[0],
							courier: rowItem.courier,
						});
					},
				},
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					const rowItem = e.item;
					if (e.item.rowStatus !== 'I') return; // 신규행이 아닐 경우 팝업 열지 않음
					refModal.current.open({
						gridRef: ref.gridRef,
						rowIndex,
						dataFieldMap: {
							carno: 'code',
							carname: 'name',
							defDccode: dccode,
						},
						customDccode: e.item.dccode,
						popupType: 'car',
						onConfirm: (selectedRows: any[]) => {
							if (!selectedRows || selectedRows.length === 0) return;

							const selectedData = selectedRows[0];

							// 차량 상세
							setCarInfo({
								carno: selectedData.code,
								sttlItemCd: rowItem.sttlItemCd,
								rowIndex: rowIndex,
								courier: rowItem.courier,
							});
						},
					});
				},
			},
		},

		// {
		// 	dataField: 'courier',
		// 	headerText: '운송사',
		// 	editable: false,
		// 	visible: true,
		// 	required: true,
		// 	dataType: 'text',
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 		return ref.gridRef.current.getCellValue(rowIndex, 'couriername') || '';
		// 	},
		// },
		// {
		// 	dataField: 'caragentkey',
		// 	headerText: '소속사코드',
		// 	dataType: 'text',
		// 	editable: false,
		// 	width: 100,
		// 	// labelFunction: carcapacityLabelFunc,
		// },
		{
			dataField: 'caragentname',
			headerText: '2차운송사',
			dataType: 'text',
			editable: false,
			width: 100,
			notBeginEventNewRowsOnPaste: true,
			// labelFunction: carcapacityLabelFunc,
		},
		{
			dataField: 'contracttype',
			headerText: '계약유형',
			dataType: 'code',
			editable: false,
			width: 100,
			notBeginEventNewRowsOnPaste: true,
			labelFunction: contracttypeLabelFunc,
		},
		{
			dataField: 'carcapacity',
			headerText: '톤급',
			dataType: 'code',
			editable: false,
			width: 100,
			notBeginEventNewRowsOnPaste: true,
			labelFunction: carcapacityLabelFunc,
		},
		{
			dataField: 'other03',
			headerText: '마감유형',
			dataType: 'code',
			editable: false,
			width: 100,
			notBeginEventNewRowsOnPaste: true,
			labelFunction: carOrderLabelFunc,
		},

		{
			dataField: 'sttlItemCd',
			headerText: '정산항목',
			dataType: 'code',
			editable: true,
			required: true,
			notBeginEventNewRowsOnPaste: true,
			labelFunction: getTmcaclItmeCommonCode,
			// renderer: {
			// 	// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
			// 	type: 'DropDownListRenderer',
			// 	// list: sttlItemCdFunc(),
			// 	listFunction: function (rowIndex, columnIndex, item, dataField) {
			// 		return refSttlItemList.current;
			// 	},
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex, columnIndex, value, item) {
					// if (item.rowStatus === 'I') {
					// 	return {
					// 		type: 'DropDownListRenderer',
					// 		keyField: 'sttlItemCd', // key 에 해당되는 필드명
					// 		valueField: 'sttlItemName',
					// 		listFunction: function (rowIndex, columnIndex, item, dataField) {
					// 			// const list = refSttlItemList.current.filter(
					// 			// 	val => val.courier === item.courier && val.sttlItemCd === item?.sttlItemCd,
					// 			// )[0];
					// 			// const ynToComCdMap = {
					// 			// 	entrustedCarYn: 'DELIVERY', // 지입
					// 			// 	mmContractYn: 'MONTHLY', // 월대
					// 			// 	fixCarYn: 'FIX', // 고정
					// 			// 	tmpCarYn: 'FIXTEMPORARY', // 임시
					// 			// 	actualCostCarYn: 'TEMPORARY', // 실비
					// 			// };
					// 			// if (isEmpty(item.sttlItemCd) || isEmpty(item?.sttlItemCd)) {
					// 			// 	return [];
					// 			// }
					// 			// const isY = v =>
					// 			// 	String(v ?? '')
					// 			// 		.trim()
					// 			// 		.toUpperCase() === 'Y';

					// 			// const allowedComCds = Object.keys(ynToComCdMap)
					// 			// 	.filter(k => isY(list[k]))
					// 			// 	.map(k => ynToComCdMap[k]);
					// 			// return refSttlItemList.current.filter(val => val.courier === item.courier);.
					// 			const comCdToYnKeyMap: Record<string, keyof (typeof refSttlItemList.current)[number]> = {
					// 				DELIVERY: 'entrustedCarYn', // 지입
					// 				MONTHLY: 'mmContractYn', // 월대
					// 				FIX: 'fixCarYn', // 고정
					// 				FIXTEMPORARY: 'tmpCarYn', // 임시
					// 				TEMPORARY: 'actualCostCarYn', // 실비
					// 			};

					// 			const isY = (v: unknown) =>
					// 				String(v ?? '')
					// 					.trim()
					// 					.toUpperCase() === 'Y';

					// 			const ynKey = comCdToYnKeyMap[item.contracttype]; // ex) FIXTEMPORARY -> "tmpCarYn"

					// 			return refSttlItemList.current.filter(val => {
					// 				if (val.courier !== item.courier) return false; // 같은 COURIER
					// 				if (!ynKey) return false; // 매핑 없는 계약유형은 불허
					// 				return isY(val[ynKey]); // 계약유형이 Y인 항목만
					// 			});
					// 		},
					// 	};
					return {
						type: 'DropDownListRenderer',
						keyField: 'comCd', // key 에 해당되는 필드명
						valueField: 'cdNm',
						listFunction: function (rowIndex, columnIndex, item, dataField) {
							const list = (refSttlItemList.current ?? []).filter(
								val =>
									val.courier === item.courier &&
									(val.ton === item.carcapacity || isEmpty(val.ton)) &&
									val.contractType === item.contracttype &&
									(val.closeType === item.other03 || val.closeType === '10'),
							);

							// comCd와 sttlItemCd 매칭
							const result = sttlItemCdFunc().filter(code => list.some(f => f.sttlItemCd === code.comCd));
							const comCdToYnFieldMap = {
								DELIVERY: 'entrustedCarYn',
								MONTHLY: 'mmContractYn',
								FIX: 'fixCarYn',
								FIXTEMPORARY: 'tmpCarYn',
								TEMPORARY: 'actualCostCarYn',
							};

							const ynField = comCdToYnFieldMap[item.contracttype];
							if (!ynField) return [];
							const isY = v =>
								String(v ?? '')
									.trim()
									.toUpperCase() === 'Y';
							// 1️⃣ 운송사 + 계약유형으로 허용된 정산항목코드 추출
							const allowedSttlItemCds = (refSttlItemList1.current || [])
								.filter(val => val.courier === item.courier && isY(val[ynField]))
								.map(val => val.sttlItemCd);
							if (!isEmpty(allowedSttlItemCds)) {
								const addList = sttlItemCdFunc().filter(code => allowedSttlItemCds.includes(code.comCd));
								return [...result, ...addList];
							}
							return result;
						},
					};
				},
			},
		},

		{
			dataField: 'masterAmount',
			headerText: '마스터금액',
			dataType: 'numeric',
			notBeginEventNewRowsOnPaste: true,
			editable: false,
			width: 100,
			// required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowNegative: true,
				formatString: '#,##0.##', // 표시 포맷
			},
		},
		{
			dataField: 'amount',
			headerText: '수정금액',
			dataType: 'numeric',
			notBeginEventNewRowsOnPaste: true,
			editable: true,
			width: 100,
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowNegative: true,
				formatString: '#,##0.##', // 표시 포맷
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'confirmAmount',
			headerText: '반영금액',
			notBeginEventNewRowsOnPaste: true,
			dataType: 'numeric',
			editable: false,
			width: 100,
			// required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowNegative: true,
				formatString: '#,##0.##', // 표시 포맷
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				const result = Number(item.masterAmount) + Number(item.amount);
				return result.toLocaleString(); // 콤마 포함
			},
		},
		{
			dataField: 'caclTypeData',
			headerText: '적용주기',
			dataType: 'code',
			notBeginEventNewRowsOnPaste: true,
			labelFunction: (
				rowIndex: number,
				colIndex: number,
				value: any,
				headerText: string,
				item: { sttlItemCd?: string },
			) => {
				const sttlItemCd = item?.sttlItemCd;
				return getCommonCodebyCd('TM_CALC_ITEM', sttlItemCd)?.data2;
			},
			editable: false,
		},
		{
			dataField: 'fromdate',
			headerText: '시작일자',
			notBeginEventNewRowsOnPaste: true,
			dataType: 'date',
			width: 100,
			require: true,
			editable: true,
			formatString: 'yyyy-mm-dd',
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (item.rowStatus !== 'I') {
			// 		// 편집 가능 class 삭제
			// 		ref.gridRef.current.removeEditClass(columnIndex);
			// 	} else {
			// 		// 편집 가능 class 추가
			// 		return 'isEdit';
			// 	}
			// },
		},
		{
			dataField: 'todate',
			headerText: '종료일자',
			notBeginEventNewRowsOnPaste: true,
			dataType: 'date',
			width: 100,
			editable: true,
			formatString: 'yyyy-mm-dd',
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.expiredYn !== 'Y') {
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
				onClick: (event: any) => {
					onClickFileUploader(event);
				},
			},
			disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
				// 행이 저장된 상태라면 버튼 활성화 처리
				return !commUtil.isEmpty(item.serialkey);
			},
		},
		{
			dataField: 'rmk',
			headerText: '비고',
			notBeginEventNewRowsOnPaste: true,
			editable: true,
			width: 250,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'addwhoName',
			notBeginEventNewRowsOnPaste: true,
			headerText: t('lbl.ADDWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'addwho',
		},
		{
			dataField: 'adddate',
			notBeginEventNewRowsOnPaste: true,
			headerText: t('lbl.REGDATTM'),
			dataType: 'date',
			editable: false,
			width: 150,
		},
		{
			dataField: 'editwhoName',
			notBeginEventNewRowsOnPaste: true,
			headerText: t('lbl.EDITWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'editwho',
		},
		{
			dataField: 'editdate',
			notBeginEventNewRowsOnPaste: true,
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
			editable: false,
			width: 150,
		},
		{
			dataField: 'couriername',
			// cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			headerText: '운송사',
			editable: false,
			visible: false,
			notBeginEventNewRowsOnPaste: true,
		},
		{
			dataField: 'serialkey',
			headerText: '시리얼키',
			editable: false,
			visible: false,
		},
		{
			dataField: 'expiredYn',
			headerText: 'expiredYn',
			editable: false,
			visible: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// isLegacyRemove: true,
		// showRowNumColumn: true,
		enableFilter: true,
		enableCellMerge: true,
		cellMergeRowSpan: false,
		rowSelectionWithMerge: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		ref.gridRef?.current.bind('cellEditBegin', (e: any) => {
			const data = e.item;
			const name = e.dataField;

			if (name === 'fromdate' && data.rowStatus === 'I') {
				return true;
			}
			if (name === 'fromdate') {
				return true;
			}
			if (data.expiredYn !== 'Y' && name === 'todate') {
				return false;
			}
			if (data.rowStatus !== 'I') {
				if (data.expiredYn === 'Y' && name === 'todate') {
					return true;
				}
				return false;
			}
		});

		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			if (props.data && props.data.length > 0) {
				ref.gridRef?.current.setSelectionByIndex(0);
			}
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('cellEditEnd', (event: any) => {
			const rowIndex = event.rowIndex;
			const rowItem = event.item;

			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			const row = event.item; // 또는 event.row depending on your grid version
			let fromDt = row.fromdate;
			let toDt = row.todate;
			if (event.dataField === 'fromdate' || event.dataField === 'todate') {
				if (event.dataField === 'fromdate') {
					fromDt = event.value; // 새로 입력된 from값
					if (fromDt < dateUtils.getToDay('YYYYMMDD')) {
						// showAlert('날짜 오류', '시작일(from)은 오늘 이전 날짜로 설정할 수 없습니다.');
						// const dataField = event.dataField;
						// ref.gridRef?.current.setCellValue(event.rowIndex, dataField, event.oldValue);
						// return false;
					}
				} else if (event.dataField === 'todate') {
					toDt = event.value; // 새로 입력된 to값
				}

				// dayjs 등 날짜 객체로 변환하여 비교
				if (fromDt && toDt) {
					const fromDay = dayjs(fromDt);
					const toDay = dayjs(toDt);

					if (fromDay.isAfter(toDay)) {
						showAlert('날짜 오류', '시작일(from)이 종료일(to)보다 늦을 수 없습니다.');
						const dataField = event.dataField;
						ref.gridRef?.current.setCellValue(event.rowIndex, dataField, event.oldValue);
						return false;
					}
				}
			}
			if (event.dataField == 'amount' || event.dataField == 'sttlItemCd') {
				const master = Number(rowItem.masterAmount);
				const amount = Number(rowItem.amount);
				const confirmAmount = Number(rowItem.confirmAmount);
				const updateRow = {
					confirmAmount: master + amount,
				};
				ref.gridRef?.current.updateRow(updateRow, event.rowIndex);
			}
			if (event.dataField === 'courier' || event.dataField === 'carno') {
				ref.gridRef?.current.setCellValue(event.rowIndex, 'sttlItemCd', '');
			}
			if (event.dataField == 'sttlItemCd' || event.dataField === 'courier') {
				if (isEmpty(event.item.sttlItemCd) || isEmpty(event.item.courier)) return;
				setCarInfo({ carno: event.item.carno, sttlItemCd: event.item.sttlItemCd, courier: event.item.courier });
			}
			if (event.dataField == 'sttlItemCd') {
				if (isEmpty(event.item.sttlItemCd)) return;
				const item = event.item;
				const list = (refSttlItemList.current ?? []).filter(
					val =>
						val.courier === item.courier &&
						(val.ton === item.carcapacity || isEmpty(val.ton)) &&
						val.contractType === item.contracttype &&
						(val.closeType === item.other03 || val.closeType === '10') &&
						item.sttlItemCd === val.sttlItemCd,
				);
				// console.log(refSttlItemList.current);
				// comCd와 sttlItemCd 매칭
				let result = sttlItemCdFunc().filter(code => list.some(f => f.sttlItemCd === code.comCd));
				const comCdToYnFieldMap = {
					DELIVERY: 'entrustedCarYn',
					MONTHLY: 'mmContractYn',
					FIX: 'fixCarYn',
					FIXTEMPORARY: 'tmpCarYn',
					TEMPORARY: 'actualCostCarYn',
				};
				const ynField = comCdToYnFieldMap[item.contracttype];
				if (!ynField) return [];
				const isY = v =>
					String(v ?? '')
						.trim()
						.toUpperCase() === 'Y';
				// 1️⃣ 운송사 + 계약유형으로 허용된 정산항목코드 추출
				const allowedSttlItemCds = (refSttlItemList1.current || [])
					.filter(val => val.courier === item.courier && isY(val[ynField]))
					.map(val => val.sttlItemCd);
				if (!isEmpty(allowedSttlItemCds)) {
					let addList = sttlItemCdFunc().filter(code => allowedSttlItemCds.includes(code.comCd));
					addList = addList.filter(val => val.comCd === item.sttlItemCd);
					result = [...result, ...addList];
					// console.log(addList.filter(val => val.comCd === item.sttlItemCd));
				}
				if (isEmpty(result)) {
					ref.gridRef?.current.setCellValue(event.rowIndex, 'sttlItemCd', event.oldValue);
					showAlert('', '해당 운송사에 등록되지 않은 정산 항목입니다.');
				}
			}
		});
	};

	/**
	 * 시작일 종료일 유효성 검증
	 * @param fromDate1
	 * @param toDate1
	 * @param fromDate2
	 * @param toDate2
	 */
	function isDateRangeOverlap(fromDate1: string, toDate1: string, fromDate2: string, toDate2: string): boolean {
		const start1 = Number(fromDate1);
		const end1 = Number(toDate1 || fromDate1); // 종료일 없으면 시작일로 간주
		const start2 = Number(fromDate2);
		const end2 = Number(toDate2 || fromDate2);

		// 두 날짜 범위가 겹치는지 여부 반환
		return start1 <= end2 && start2 <= end1;
	}

	/**
	 * 물류센터 + 차량번호 + 운송사 + 정산항목 그룹별로 묶기
	 * @param rows
	 */
	function groupRowsByKey(
		rows: any[],
	): { result: true; grouped: Record<string, any[]> } | { result: false; message: string } {
		const format = 'YYYYMMDD'; // 날짜 형식

		// 그룹핑
		const tempGroups: Record<string, any[]> = {};
		for (const row of rows) {
			if (!dateUtil.isValid(row.fromdate, format)) {
				return { result: false, message: `시작일자(${row.fromdate})의 날짜 형식이 잘못되었습니다.` };
			}
			if (!dateUtil.isValid(row.todate, format)) {
				return { result: false, message: `종료일자(${row.todate})의 날짜 형식이 잘못되었습니다.` };
			}
			const key = `${row.dccode}__${row.carno}__${row.courier}__${row.sttlItemCd}`;
			if (!tempGroups[key]) tempGroups[key] = [];
			tempGroups[key].push(row);
		}

		// 2개이상인 그룹만 필터링
		const result: Record<string, any[]> = {};
		for (const key in tempGroups) {
			const group = tempGroups[key];
			if (group.length > 1) {
				// 배열 초기화 후 push
				if (!result[key]) {
					result[key] = [];
				}
				result[key].push(...group);
			}
		}

		return { result: true, grouped: result };
	}

	/**
	 * 그룹 내 날짜 중복 검증 함수 (입력값 기준)
	 * @param groupData 그룹 기간 데이터
	 * @param allData 전체 데이터셋
	 */
	function validateGroupedDateRanges(allData: any[]): { result: boolean; message: string } {
		const temp = groupRowsByKey(allData);
		if (!temp.result && 'message' in temp) {
			return { result: false, message: temp.message };
		}
		const grouped = temp.grouped;
		const format = 'YYYYMMDD'; // 날짜 형식
		for (const [key, groupRows] of Object.entries(grouped)) {
			// 2개 이상인 그룹만 검사
			if (groupRows.length < 2) continue;

			for (let i = 0; i < groupRows.length; i++) {
				const row1 = groupRows[i];
				if (!dateUtil.isValid(row1.fromdate, format)) {
					return { result: false, message: `시작일자(${row1.fromdate})의 날짜 형식이 잘못되었습니다.` };
				}
				if (!dateUtil.isValid(row1.todate, format)) {
					return { result: false, message: `종료일자(${row1.todate})의 날짜 형식이 잘못되었습니다.` };
				}
				for (let j = i + 1; j < groupRows.length; j++) {
					const row2 = groupRows[j];

					// 날짜 형식 검증
					if (!dateUtil.isValid(row2.fromdate, format) || !dateUtil.isValid(row2.todate, format)) continue;

					// 자기 자신 비교 방지 (객체 참조 또는 serialkey가 있을 경우 구분)
					if (row1 === row2) continue;
					if (isDateRangeOverlap(row1.fromdate, row1.todate, row2.fromdate, row2.todate)) {
						return {
							result: false,
							message:
								`물류센터(${row1.dccode}), 차량번호(${row1.carno}), 운송사(${row1.courier}), 정산항목(${row1.sttlItemCd})의 날짜 범위가 ` +
								`중복됩니다.`,
						};
					}
				}
			}
		}

		return { result: true, message: 'success' };
	}

	/**
	 * 저장	 *
	 */
	const saveMasterList = () => {
		const codeDtl = ref.gridRef.current.getChangedData({ validationYn: false });
		const allRows = ref.gridRef.current.getGridData();

		if (!codeDtl || codeDtl.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
				return;
			});
			return;
		}
		if (codeDtl.length > 0 && !ref.gridRef.current.validateRequiredGridData()) {
			return;
		}
		apiGetTrspCloseChk({ saveList: codeDtl }).then(res => {
			const list = res.data ?? [];

			// "2025-11-05" -> "2025-11"
			const toMonth = (d?: string | null) => {
				if (!d) return null;
				// 혹시 "2025-11-05 12:34:56" 같은 경우도 대비
				const s = String(d).trim();
				if (s.length >= 7) return s.slice(0, 7);
				return null;
			};

			const map = new Map<string, { courier: string; couriername: string | null; months: Set<string> }>();

			list
				.filter((item: any) => item?.valChk === 'Y' && item?.courier)
				.forEach((item: any) => {
					const key = String(item.courier);
					const month = toMonth(item.fromdate);

					if (!map.has(key)) {
						map.set(key, {
							courier: key,
							couriername: item.couriername ?? null,
							months: new Set<string>(),
						});
					}

					if (month) map.get(key)!.months.add(month);
				});

			const courierInfos = Array.from(map.values()).map(x => ({
				...x,
				months: Array.from(x.months).sort((a, b) => String(a).localeCompare(String(b))),
			}));

			// if (courierInfos.length > 0) {
			// 	const msg = courierInfos
			// 		.map(x => {
			// 			const name = `${x.courier}${x.couriername ? `(${x.couriername})` : ''}`;
			// 			const months = x.months.length ? ` - ${x.months.join(', ')}` : '';
			// 			return `${name}${months}`;
			// 		})
			// 		.join('\n');

			// 	showAlert('', `해당 월의 마감이 완료된 운송사입니다.\n${msg}`);
			// 	return;
			// }
			// ─────────────────────────────────────────────────────────
			// 헬퍼
			// ─────────────────────────────────────────────────────────
			const yester = dayjs().subtract(1, 'day').format('YYYYMMDD');

			// 같은 행 판별용 UID
			const getUid = (r: any) =>
				r._$uid ??
				r.uid ??
				r.serialKey ??
				`${r.uid}|${r.serialKey}|${r.sttlItemCd}|${r.dcCode}|${r.area}|${r.contractType}|${r.courier}|${r.ton}|${r.closeType}|${r.areaNm}|${r.fromDate}|${r.toDate}`;

			// 동일 항목(관리키) 비교
			const sameKey = (x: any, y: any) =>
				String(x.sttlItemCd ?? '').trim() === String(y.sttlItemCd ?? '').trim() &&
				String(x.dcCode ?? '').trim() === String(y.dcCode ?? '').trim() &&
				String(x.contractType ?? '').trim() === String(y.contractType ?? '').trim() &&
				String(x.courier ?? '').trim() === String(y.courier ?? '').trim() &&
				String(x.ton ?? '').trim() === String(y.ton ?? '').trim() &&
				String(x.closeType ?? '').trim() === String(y.closeType ?? '').trim() &&
				String(x.carno ?? '').trim() === String(y.carno ?? '').trim() &&
				String(x.areaNm ?? '').trim() === String(y.areaNm ?? '').trim();

			// 기간 겹침 여부
			const isOverlap = (s1: string, e1: string, s2: string, e2: string) => {
				const start1 = dayjs(s1),
					end1 = dayjs(e1);
				const start2 = dayjs(s2),
					end2 = dayjs(e2);
				return !(end1.isBefore(start2) || end2.isBefore(start1));
			};

			// 키 문자열(신규끼리 중복 검사용)
			const keyOf = (r: any) =>
				`${String(r.sttlItemCd ?? '').trim()}|${String(r.dcCode ?? '').trim()}|${String(
					r.contractType ?? '',
				).trim()}|${String(r.courierNm ?? '').trim()}|${String(r.ton ?? '').trim()}|${String(
					r.closeType ?? '',
				).trim()}|${String(r.areaNm ?? '').trim()}|${String(r.carno ?? '').trim()}`;

			// 기존/신규 분리
			const existingRows = allRows.filter((r: any) => r.rowStatus !== 'I');
			const newRows = codeDtl.filter((r: any) => r.rowStatus === 'I');

			// ─────────────────────────────────────────────────────────
			// 1) 신규행끼리 동일 항목 & 기간 겹침 → 저장 중단
			// ─────────────────────────────────────────────────────────
			{
				const seen = new Map<string, any[]>();
				for (const n of newRows) {
					const k = keyOf(n);
					if (!seen.has(k)) seen.set(k, []);
					const arr = seen.get(k)!;
					if (arr.some(x => isOverlap(x.fromdate, x.todate, n.fromdate, n.todate))) {
						showAlert('중복 오류', '신규행끼리 동일 항목이 날짜 구간 내에서 중복됩니다.');
						return;
					}
					arr.push(n);
				}
			}

			// ─────────────────────────────────────────────────────────
			// 2) 신규 vs 기존 동일 항목 & 기간 겹침 → 기존행 종료일을 "어제"로 자동 조정
			//    (조정된 행은 체크 처리 + 안내)
			// ─────────────────────────────────────────────────────────
			{
				const updatedSerialKeys: any[] = [];

				for (const n of newRows) {
					const targets = existingRows.filter(
						(e: any) => sameKey(n, e) && isOverlap(n.fromdate, n.todate, e.fromdate, e.todate),
					);

					for (const e of targets) {
						const item = {
							_$uid: e._$uid ?? e.uid ?? e.serialKey, // 그리드 식별자
							serialKey: e.serialKey,
							// todate: dayjs(n.fromdate, 'YYYYMMDD').subtract(1, 'day').format('YYYYMMDD'), // 종료일을 어제로 설정
							rowStatus: 'U',
						};
						// ref.gridRef.current.updateRowsById(item);
						// ref.gridRef.current.addCheckedRowsByValue('_$uid', e._$uid);
						updatedSerialKeys.push(e.serialKey);
					}
				}

				const validChkList = ref.gridRef.current.getChangedData({ validationYn: false });
				const today = dayjs().format('YYYYMMDD');
				const arr: any = [];

				if (updatedSerialKeys.length > 0) {
					showAlert(
						'기간 조정 안내',
						'동일한 조건의 데이터가 있어 기간을 자동으로 조정했습니다. 변경된 내용을 확인 후 다시 저장해주세요.',
						() => {
							// ─────────────────────────────────────────────────────────
							// 3) 저장 확인 및 호출
							// ─────────────────────────────────────────────────────────
							ref.gridRef.current.showConfirmSave(() => {
								const saveList = { saveList: validChkList };

								apiSaveMasterList(saveList)
									.then(res => {
										if (res.statusCode === 0) {
											ref.gridRef.current.clearGridData();
											props.callBackFn?.();
											showAlert('', t('msg.MSG_COM_SUC_003'));
										} else {
											return false;
										}
									})
									.catch(() => false);
							});
						},
					);
				} else {
					ref.gridRef.current.showConfirmSave(() => {
						const saveList = { saveList: validChkList };

						apiSaveMasterList(saveList)
							.then(res => {
								if (res.statusCode === 0) {
									ref.gridRef.current.clearGridData();
									props.callBackFn?.();
									showAlert('', t('msg.MSG_COM_SUC_003'));
								} else {
									return false;
								}
							})
							.catch(() => false);
					});
				}
			}
		});
	};

	/**
	 * 증빙파일 업로드 팝업 열기
	 * @param {object} item 파일 정보
	 * @returns {void}
	 */
	const onClickFileUploader = (item: any) => {
		if (commUtil.isNotEmpty(item.item.serialkey)) {
			setSerialkeyH(item.item.serialkey);
			refAttchFileModal.current.handlerOpen();
		} else {
			showAlert(null, t('msg.MSG_COM_CFM_027'));
		}
	};

	/**
	 * 증빙파일 업로드 팝업 닫기
	 */
	const closeFileUploader = () => {
		refAttchFileModal.current.handlerClose();
	};

	/**
	 * 파일 업로드 팝업 처리 후 콜백
	 * @param {any} param 파일 첨부 결과
	 * @param {number} fileCnt 첨부파일 갯수
	 */
	const callBackFileUploadPopup = (param: any, fileCnt: number) => {
		// 파일 컬럼에 첨부파일 갯수 업데이트
		const rowIndex = ref.gridRef.current.getSelectedIndex()[0];
		// ref.gridRef.current?.setCellValue(rowIndex, 'attachment', fileCnt);
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [
			{
				btnType: 'copy', // 행복사
				initValues: {
					serialkey: '',
					adddate: '',
					addwho: '',
					editdate: '',
					editwho: '',
					fromdate: today,
					rowStatus: 'I',
					expiredYn: 'N',
				},
			},
			{
				btnType: 'curPlus', // 행삽입
				initValues: commUtil.gfnCreateInitValue(gridCol, {
					dccode: dccode,
					// applyType: 'AD',
					fromdate: today,
					todate: '29991231',
					// sttlItemCd: 'M08',
					rowStatus: 'I',
					serialkey: '', // 신규행은 시리얼키 비워둠
					expiredYn: 'N',
				}),
			},
			{
				btnType: 'plus', // 행추가
				initValues: commUtil.gfnCreateInitValue(gridCol, {
					dccode: dccode,
					// applyType: 'AD',
					fromdate: today,
					todate: '29991231',
					// sttlItemCd: 'M08',
					rowStatus: 'I',
					serialkey: '',
					expiredYn: 'N',
				}),
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'btn1', // 신규행삭제
				callBackFn: () => {
					const gridRef = ref.gridRef;
					gridRef.current.getCheckedRowItems().map((item: any) => {
						gridRef.current.setCellValue(item.rowIndex, 'expiredYn', 'Y');
					});
				},
			},
			{
				btnType: 'save',
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * 엑셀 업로드 버튼 클릭 이벤트
	 */
	const excelUpload = () => {
		// if (props.user !== '2170') return;
		if (ref.gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			showConfirm(
				null,
				t('msg.MSG_COM_CFM_009'),
				() => {
					excelInputRef.current.handlerOpen();
					setIsModalOpen(true);
				},
				() => {
					return false;
				},
			);
		} else {
			excelInputRef.current.handlerOpen();
			setIsModalOpen(true);
		}
	};

	const closeEvent = () => {
		excelInputRef.current.handlerClose();
		setIsModalOpen(false);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (isEmpty(searchDate)) return;
		apiGetMasterList({
			dcCode: dccode,
			contractYn: true,
			fromdt: dayjs(searchDate[0]).format('YYYYMMDD'),
			todt: dayjs(searchDate[1]).format('YYYYMMDD'),
		}).then(res => {
			const D = getCommonCodeListByData('TM_CALC_ITEM', 'D', null, null, null);
			const P = getCommonCodeListByData('TM_CALC_ITEM', 'P', null, null, null);
			const list = getCommonCodeList('TM_CALC_ITEM');
			const matched = res.data.filter(item2 => sttlItemCdFunc().some(item1 => item1.sttlItemCd === item2.comCd));
			const result = [];
			for (const a of matched) {
				if (a.sttlItemCd !== 'P09' && a.sttlItemCd !== 'P15') {
					result.push(a);
				} else if (a.sttlItemCd === 'P09') {
					// P09 삭제하고, P10/P11로 교체(복사 기반)
					result.push(
						{
							...a,
							sttlItemCd: 'P10',
							oldSttlItemCd: 'P10',
							sttlItemName: list.filter(item => item.comCd === 'P10')[0].cdNm,
						},
						{
							...a,
							sttlItemCd: 'P11',
							oldSttlItemCd: 'P11',
							sttlItemName: list.filter(item => item.comCd === 'P11')[0].cdNm,
						},
					);
				} else if (a.sttlItemCd === 'P15') {
					result.push(
						{
							...a,
							sttlItemCd: 'P16',
							oldSttlItemCd: 'P16',
							sttlItemName: list.filter(item => item.comCd === 'P16')[0].cdNm,
						},
						{
							...a,
							sttlItemCd: 'P17',
							oldSttlItemCd: 'P17',
							sttlItemName: list.filter(item => item.comCd === 'P17')[0].cdNm,
						},
						{
							...a,
							sttlItemCd: 'P18',
							oldSttlItemCd: 'P18',
							sttlItemName: list.filter(item => item.comCd === 'P18')[0].cdNm,
						},
					);
				}
			}
			// result.push(
			// 	{
			// 		...a,
			// 		sttlItemCd: 'P12',
			// 		oldSttlItemCd: 'P12',
			// 		sttlItemName: list.filter(item => item.comCd === 'P12')[0].cdNm,
			// 	},
			// 	{
			// 		...a,
			// 		sttlItemCd: 'P25',
			// 		oldSttlItemCd: 'P25',
			// 		sttlItemName: list.filter(item => item.comCd === 'P25')[0].cdNm,
			// 	},
			// );

			setCodeLiist(result);
			refSttlItemList.current = result;
			// }
		});

		apiGetMasterMngList({ dcCode: dccode }).then(res => {
			refSttlItemList1.current = res.data.filter(item => item.sttlItemCd === 'P12' || item.sttlItemCd === 'P25');
		});
	}, [dccode]);

	useEffect(() => {
		if (ref.gridRef.current.getChangedData({ validationYn: false })?.length > 0) {
			showConfirmAsync(null, t('msg.MSG_COM_CFM_009'), () => {
				ref.gridRef.current.clearGridData();
				setTotalCnt(0);
			});
		}
	}, [dccode]);

	// useEffect(() => {
	// 	if (isEmpty(courier)) {
	// 		refSttlItemList.current = sttlItemCdFunc();
	// 		return;
	// 	}
	// }, [courier]);

	/**
	 * 그리드 데이터 초기화
	 */
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			const newData = (Array.isArray(props.data) ? props.data : [props.data]).map(item => ({
				...item,
				customRowCheckYn: 'N',
			}));
			// gridRefCur?.setGridData(props.data);
			gridRefCur?.setGridData(newData);
			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
				gridRefCur.setColumnPropByDataField('courier', { width: 185 });
				gridRefCur.setColumnPropByDataField('carno', { width: 160 });
				gridRefCur.setColumnPropByDataField('sttlItemCd', { width: 180 });
				gridRefCur.setColumnPropByDataField('carcapacity', { width: 65 });
				gridRefCur.setColumnPropByDataField('todate', { width: 110 });
				gridRefCur.setColumnPropByDataField('adddate', { width: 180 });
				gridRefCur.setColumnPropByDataField('editdate', { width: 180 });
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={'차량별 수당관리 목록'} gridBtn={gridBtn} totalCnt={totalCnt}>
					<Button onClick={excelUpload}>{t('lbl.EXCELUPLOAD')}</Button>
					{/* <Button onClick={test}>{'test'}</Button> */}
				</GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			{/* 공통 검색 팝업 래퍼 */}
			<CmSearchWrapper ref={refModal} />
			{/* 엑셀 업로드 영역 정의 */}
			<CmSearchCarrierWrapper ref={refModal1} />
			<CustomModal ref={excelInputRef} width="1000px">
				<TmAmountByCarExcelPopup
					// gridCol={gridCol}
					close={closeEvent}
					// save={saveMasterList}
					dcCode={dccode}
					// gridProps={gridProps}
					fnCallBack={props.callBackFn}
					codeList={codeList}
					// callBack={props.fnCallBack?.()}
					// setSepecCodeDetail={setSepecCodeDetail}
				/>
			</CustomModal>
			{/* 파일 팝업 영역 정의 */}
			<CustomModal ref={refAttchFileModal} width="1000px">
				<TmAmountByCarFileUploadPopup
					callBack={callBackFileUploadPopup}
					close={closeFileUploader}
					serialkey={serialkeyH} // 선택한 행의 serialkey를 전달
				/>
			</CustomModal>
		</>
	);
});

export default TmAmountByCarDetail;
