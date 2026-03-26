/*
 ############################################################################
 # FiledataField	: TmEntityRuleDetail.tsx
 # Description		: 통합수당관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.12
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
// Utils
import dateUtils from '@/util/dateUtil';
// API Call Function
import { apiGetMasterList, apiGetTrspCloseChk, apiSaveTmEntityExcel } from '@/api/tm/apiTmEntityRule';
import { apiGetMasterList as apiGetMasterMngList } from '@/api/tm/apiTmManageEntity';
//types
import CmSearchCarrierWrapper from '@/components/cm/popup/CmSearchCarrierWrapper';
import CustomModal from '@/components/common/custom/CustomModal';
import TmentityRuleExcelUpload from '@/components/tm/entityRule/TmentityRuleExcelUpload';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import { isEmpty } from 'lodash';
//store
const TmEntityRuleDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const refSttlItemList = useRef([]);
	const { t } = useTranslation();
	const gridId = uuidv4() + '_gridWrap';
	const dcCode = Form.useWatch('dcCode', props.form);
	const courier = Form.useWatch('courier', props.form);
	const courierNm = Form.useWatch('courierName', props.form);
	const date = Form.useWatch('date', props.form);
	// const courierNm = Form.useWatch('courierName', props.form);
	const uploadFile = useRef(null);
	const refModal = useRef(null);
	const refModal2 = useRef(null);
	const [saveResult, setSaveResult] = useState([]);
	// const [codeList, setCodeList] = useState([]);
	const [codeList, setCodeLiist] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const modalRef1 = useRef(null);

	//공통 코드 호출
	const getTmcaclItmeCommonCodeList = () => {
		const list = getCommonCodeList('TM_CALC_ITEM');

		return list.filter(item => (item.data1 === 'P' || item.data1 === 'M') && item.data3 === 'Y');
		// return list;
	};
	const getTmcaclItmeCommonCode = (rowIndex: any, columnIndex: any, value: any, item: any) => {
		return getCommonCodebyCd('TM_CALC_ITEM', value)?.cdNm;

		// return list;
	};
	const getCustOrderCloseTypeCommonCodeList = () => {
		// ////console.log((getCommonCodeList('CUSTORDERCLOSETYPE', ''));
		//추후 공통 코드 추가 후 변경 예정(data1)
		return getCommonCodeList('VIHICLE_TYPE_CD');
	};
	const getCustOrderCloseTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('VIHICLE_TYPE_CD', value)?.cdNm;

		// return list;
	};
	const getCarCapCityTypeCommonCodeList = () => {
		return getCommonCodeList('CARCAPACITY', '공통', '');
	};
	const getCarCapCityTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		// return getCommonCodebyCd('CARCAPACITY', value)?.cdNm;
		const list = getCommonCodeList('CARCAPACITY', '공통', null);
		const convert = list.map(item => ({
			...item,
			// display: item.comCd && item.comCd !== 'STD' ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
		}));
		////console.log((convert);
		let result = null;
		if (!commUtil.isEmpty(convert)) {
			result = convert.find((el: any) => {
				if (el.comCd === value) {
					return el;
				}
			});
		}
		return result ? result.cdNm : null;

		// return list;
	};
	const getContractTypeCommonCodeList = () => {
		return getCommonCodeList('CONTRACTTYPE');
	};
	const getContractTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;

		// return list;
	};
	/**
	 * 공통 코드 호출([comCd]cdNm)
	 * @param owIndex
	 * @param columnIndex
	 * @param rowIndex
	 * @param colIndex
	 * @param value
	 * @param headerText
	 * @param item
	 * @returns
	 */
	const getCustomCommonCodeList = (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
		const list = getCommonCodeList('WMS_MNG_DC');
		// //console.log((item);
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
	const type = (e: any) => {
		if (e.carrierType === '2차 운송사') {
			const gridRef = ref.gridRef.current;
			gridRef.setCellValue(e.rowIndex, 'courier', '');
			gridRef.setCellValue(e.rowIndex, 'courierNm', '');
		}
	};
	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: '물류센터',
			required: true,
			editable: false,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			dataType: 'code',
			labelFunction: getCustomCommonCodeList,
		},
		{
			dataField: 'courierNm',
			headerText: '운송사',
			editable: true,
			required: true,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			dataType: 'code',
			commRenderer: {
				type: 'search',
				popupType: 'carrierDrop',
				searchDropdownProps: {
					dataFieldMap: {
						courier: 'code',
						courierNm: 'name',
						carrierType: '1',
					},
					callbackBeforeUpdateRow: (e: any) => {
						type(e);
					},
				},
				params: {
					carrierType: 'LOCAL',
				},
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					////console.log((e);
					if (e.item.rowStatus !== 'I') return;
					// 예: custcd 컬럼에서 팝업 열기
					refModal2.current.open({
						gridRef: ref.gridRef,
						rowIndex,
						dataFieldMap: {
							courier: 'code',
							courierNm: 'name',
						},
						carrierType: 'LOCAL',
						popupType: 'carrier',
					});
				},
			},
			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
				// ////console.log((item);
				return item.courierNm ?? value;
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				// //console.log((item.rowStatus);
				if (item.rowStatus === 'I') {
					// 편집 가능 class 삭제
					return 'isEdit';
				} else {
					// 편집 가능 class 추가
					// //console.log((item);
					ref.gridRef.current.removeEditClass(columnIndex);
				}
			},
			// },
		},
		{
			dataField: 'sttlItemCd',
			headerText: '관리항목',
			dataType: 'code',
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			labelFunction: getTmcaclItmeCommonCode,
			editable: true,
			required: true,
			mergePolicy: 'restrict',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			// editRenderer: {
			// 	type: 'DropDownListRenderer',
			// 	list: getTmcaclItmeCommonCodeList(),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex, columnIndex, value, item) {
					if (item.rowStatus === 'I') {
						return {
							// type: 'DropDownListRenderer',
							// list: getTmcaclItmeCommonCodeList(),
							// keyField: 'comCd', // key 에 해당되는 필드명
							// valueField: 'cdNm',
							type: 'DropDownListRenderer',
							keyField: 'sttlItemCd', // key 에 해당되는 필드명
							valueField: 'sttlItemName',
							listFunction: function (rowIndex, columnIndex, item, dataField) {
								////console.log((codeList);
								// 리스트 필터
								return refSttlItemList.current.filter(val => val.courier === item.courier);
							},
						};
						// return {
						// 	type: 'DropDownListRenderer',
						// 	list: getTmcaclItmeCommonCodeList(),
						// 	keyField: 'comCd', // key 에 해당되는 필드명
						// 	valueField: 'cdNm',
						// };
					}
					return { type: 'InputEditRenderer' };
				},
			},
		},

		{
			dataField: 'contractType',
			headerText: '계약유형',
			dataType: 'code',
			required: true,
			editable: true,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			mergePolicy: 'restrict',
			labelFunction: getContractTypeCommonCode,
			// editRenderer: {
			// 	// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
			// 	type: 'DropDownListRenderer',
			// 	list: getContractTypeCommonCodeList(),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex, columnIndex, value, item) {
					if (item.rowStatus === 'I') {
						return {
							type: 'DropDownListRenderer',
							// list: getContractTypeCommonCodeList(),
							listFunction: function (rowIndex, columnIndex, item, dataField) {
								const list = refSttlItemList.current.filter(
									val => val.courier === item.courier && val.sttlItemCd === item?.sttlItemCd,
								)[0];
								//console.log((list);
								const ynToComCdMap = {
									entrustedCarYn: 'DELIVERY', // 지입
									mmContractYn: 'MONTHLY', // 월대
									fixCarYn: 'FIX', // 고정
									tmpCarYn: 'FIXTEMPORARY', // 임시
									actualCostCarYn: 'TEMPORARY', // 실비
								};
								if (isEmpty(item.sttlItemCd) || isEmpty(item?.sttlItemCd)) {
									return [];
								}
								const isY = v =>
									String(v ?? '')
										.trim()
										.toUpperCase() === 'Y';

								const allowedComCds = Object.keys(ynToComCdMap)
									.filter(k => isY(list[k]))
									.map(k => ynToComCdMap[k]);
								//console.log((allowedComCds);
								if (item.sttlItemCd === 'P01') {
									return getContractTypeCommonCodeList().filter(
										cc => allowedComCds.includes(cc.comCd) && (cc.comCd == 'DELIVERY' || cc.comCd == 'MONTHLY'),
									);
								}
								// myGroupLevel1 은 미리 정의된 배열임
								// 상위 단계(부모)의 값이 2라면....
								else {
									return getContractTypeCommonCodeList().filter(cc => allowedComCds.includes(cc.comCd));
								} // myGroupLevel1 은 미리 정의된 배열임
								// return ['1', '2', '3']; // 기본 리스트
								// if (item.sttlItemCd === 'P01')
								// 	// 상위 단계(부모)의 값이 1이라면....

								// 	return getContractTypeCommonCodeList().filter(
								// 		item => item.comCd == 'DELIVERY' || item.comCd == 'MONTHLY',
								// 	);
								// // myGroupLevel1 은 미리 정의된 배열임
								// // 상위 단계(부모)의 값이 2라면....
								// else return getContractTypeCommonCodeList();
							},
							keyField: 'comCd', // key 에 해당되는 필드명
							valueField: 'cdNm',
						};
					}
					return { type: 'InputEditRenderer' };
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		// { dataField: 'courier', headerText: '운송사코드', dataType: 'string', editable: true },

		{
			dataField: 'ton',
			headerText: '톤수',
			dataType: 'code',
			editable: true,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			mergePolicy: 'restrict',
			// required: true,
			labelFunction: getCarCapCityTypeCommonCode,
			// editRenderer: {
			// 	type: 'DropDownListRenderer',
			// 	list: getCarCapCityTypeCommonCodeList(),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex, columnIndex, value, item) {
					if (item.rowStatus === 'I') {
						return {
							type: 'DropDownListRenderer',
							list: getCarCapCityTypeCommonCodeList(),
							keyField: 'comCd', // key 에 해당되는 필드명
							valueField: 'cdNm',
						};
					}
					return { type: 'InputEditRenderer' };
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
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
			dataField: 'closeType',
			headerText: '마감유형',
			required: true,
			dataType: 'code',
			editable: true,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			mergePolicy: 'restrict',
			labelFunction: getCustOrderCloseTypeCommonCode,
			// editRenderer: {
			// 	// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
			// 	type: 'DropDownListRenderer',
			// 	list: getCustOrderCloseTypeCommonCodeList(),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex, columnIndex, value, item) {
					// //console.log(('---', item);
					if (item.rowStatus === 'I') {
						return {
							type: 'DropDownListRenderer',
							list: getCustOrderCloseTypeCommonCodeList(),
							keyField: 'comCd', // key 에 해당되는 필드명
							valueField: 'cdNm',
						};
					}
					return { type: 'InputEditRenderer' };
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
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
			dataField: 'base',
			headerText: '기준',
			dataType: 'string',
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				// onlyNumeric: true,
				allowPoint: false, // 소수점 입력 불가
				allowNegative: false, // 음수 입력 불가
				// maxlength: 2,
				//2자리 제약
				// regExp: '^(?:[1-9]\\d?)$',
				//자릿수 제약은 없으
				regExp: '^[1-9]\\d*$',
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				// //console.log((item.rowStatus);
				if (item.rowStatus === 'I') {
					// 편집 가능 class 삭제
					return 'isEdit';
				} else {
					// 편집 가능 class 추가
					// //console.log((item);
					ref.gridRef.current.removeEditClass(columnIndex);
				}
			},
		},
		{
			dataField: 'amount',
			headerText: '금액',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: true,
			required: true,
			// editRenderer: {
			// type: 'InputEditRenderer',
			// onlyNumeric: true, // 0~9만 입력
			// allowPoint: false, // 소수점 금지
			// allowNegative: false, // 음수 금지
			// formatString: '#,##0',
			// },
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex, columnIndex, value, item) {
					if (item.sttlItemCd !== 'P02') {
						return {
							type: 'InputEditRenderer',
							onlyNumeric: true, // 0~9만 입력
							allowPoint: false, // 소수점 금지
							allowNegative: false, // 음수 금지
							formatString: '#,##0',
						};
					}
					return {
						type: 'InputEditRenderer',
						// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
						// onlyNumeric: true, // 0~9만 입력가능
						onlyNumeric: false,
						allowPoint: true, // 소수점( . ) 도 허용할지 여부
						allowNegative: true, // 마이너스 부호(-) 허용 여부
						textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
						maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
						autoThousandSeparator: true, // 천단위 구분자 삽입 여부
						// decimalPrecision: 2, // 소숫점 2자리까지 허용
						regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
					};
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
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
			dataField: 'caclTypeData',
			headerText: '적용주기',
			dataType: 'code',
			labelFunction: (
				rowIndex: number,
				colIndex: number,
				value: any,
				headerText: string,
				item: { sttlItemCd?: string },
			) => {
				const sttlItemCd = item?.sttlItemCd;
				////console.log(();
				return getCommonCodebyCd('TM_CALC_ITEM', sttlItemCd)?.data2;
			},
			editable: false,
		},
		{
			dataField: 'fromDate',
			headerText: '시작일자',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			// dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			required: true,
			editable: true,
			// width: 120,
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	////console.log((item.rowStatus);
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
			dataField: 'toDate',
			// required: true,
			headerText: '종료일자',
			dataType: 'date',
			editable: false,
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			// width: 200,
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			// labelFnction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2`-`$3');
			// },
		},
		{
			dataField: 'rmk',
			headerText: '비고',
			dataType: 'string',
			editable: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
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
			dataField: 'addWho',
			headerText: '등록자',
			width: 90,
			dataType: 'manager',
			managerDataField: 'addWhoId',
			editable: false,
		},
		{ dataField: 'addDate', headerText: '등록일시', dataType: 'code', editable: false },
		{
			dataField: 'editWho',
			headerText: '수정자',
			width: 90,
			dataType: 'manager',
			managerDataField: 'editWhoId',
			editable: false,
		},
		{ dataField: 'editDate', headerText: '수정일시', dataType: 'code', editable: false },

		{
			dataField: 'code',
			headerText: 'code',
			visible: false,
		},
		{
			dataField: 'courier',
			headerText: 'courier',
			visible: false,
		},

		// { dataField: 'rowStatus', headerText: '행 상태', dataType: 'string', editable: true },
	];

	const gridProps = {
		editable: true,
		enableCellMerge: true,
		cellMergeRowSpan: false,
		rowSelectionWithMerge: true,
		showRowCheckColumn: true,
		// rowIdField: '_$uid',
		// isLegacyRemove: true,
		// 커스텀
		// showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};
	const footerLayout = [{}];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	const importCarrier = () => {
		const gridRef = ref.gridRef.current;
		const selectRow = gridRef.getSelectedIndex()[0];

		const gridDataWithState = gridRef.getGridData();
		const rowData = gridDataWithState[selectRow];
		const fromCourier = rowData.courier;
		if (isEmpty(fromCourier)) {
			showAlert('', '운송사가 없습니다.');
			return;
		}
		refModal2.current.open({
			gridRef: ref.gridRef,
			selectRow,
			dataFieldMap: {
				carno: 'code',
				carname: 'name',
			},
			carrierType: 'LOCAL',
			popupType: 'carrier',
			onConfirm: (selectedRows: any[]) => {
				if (!selectedRows) return;
				refModal2.current.handlerClose();
				const selectedData = selectedRows[0];
				////console.log((selectedData);
				if (selectedData.code === fromCourier) {
					showAlert('', '동일한 운송사를 선택하였습니다');
					return;
				}
				apiGetMasterList({
					importCarrier: selectedData.code,
					importCarrierNm: selectedData.name,
					dcCode: dcCode,
					courier: fromCourier,
					standardFromDate: date[0].format('YYYYMMDD'),
					standardToDate: date[1].format('YYYYMMDD'),
					contractYn: true,
				}).then(res => {
					////console.log((res.data);
					res.data.forEach(row => {
						gridRef.addRow({ ...row, rowStatus: 'I' });
					});
				});
			},
		});
	};

	const saveMaster = () => {
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

			// valChk=Y 인 (courier, couriername) 목록 (courier 기준 중복 제거)
			// const list = res.data ?? [];

			// "2025-11-05" -> "2025-11"
			const toMonth = (d?: string | null) => {
				if (!d) return null;
				// 혹시 "2025-11-05 12:34:56" 같은 경우도 대비
				const s = String(d).trim();
				if (s.length >= 7) return s.slice(0, 7);
				return null;
			};

			const map = new Map<string, { courier: string; courierNm: string | null; months: Set<string> }>();

			list
				.filter((item: any) => item?.valFlag === 'Y' && item?.courier)
				.forEach((item: any) => {
					const key = String(item.courier);
					const month = toMonth(item.fromDate);

					if (!map.has(key)) {
						map.set(key, {
							courier: key,
							courierNm: item.courierNm ?? null,
							months: new Set<string>(),
						});
					}

					if (month) map.get(key)!.months.add(month);
				});

			const courierInfos = Array.from(map.values()).map(x => ({
				...x,
				months: Array.from(x.months).sort((a, b) => String(a).localeCompare(String(b))),
			}));

			if (courierInfos.length > 0) {
				const msg = courierInfos
					.map(x => {
						const name = `${x.courier}${x.courierNm ? `(${x.courierNm})` : ''}`;
						const months = x.months.length ? ` - ${x.months.join(', ')}` : '';
						return `${name}${months}`;
					})
					.join('\n');

				showAlert('', `해당 월의 마감이 완료된 운송사입니다.\n${msg}`);
				return;
			}
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
			const sameKey = (x: any, y: any) => {
				if (String(x.sttlItemCd ?? '').trim() === 'P24' || String(x.sttlItemCd ?? '').trim() === 'P34') {
					return (
						String(x.sttlItemCd ?? '').trim() === String(y.sttlItemCd ?? '').trim() &&
						String(x.dcCode ?? '').trim() === String(y.dcCode ?? '').trim() &&
						String(x.contractType ?? '').trim() === String(y.contractType ?? '').trim() &&
						String(x.courier ?? '').trim() === String(y.courier ?? '').trim() &&
						String(x.ton ?? '').trim() === String(y.ton ?? '').trim() &&
						String(x.closeType ?? '').trim() === String(y.closeType ?? '').trim() &&
						String(x.base ?? '').trim() === String(y.base ?? '').trim()
					);
				} else {
					return (
						String(x.sttlItemCd ?? '').trim() === String(y.sttlItemCd ?? '').trim() &&
						String(x.dcCode ?? '').trim() === String(y.dcCode ?? '').trim() &&
						String(x.contractType ?? '').trim() === String(y.contractType ?? '').trim() &&
						String(x.courier ?? '').trim() === String(y.courier ?? '').trim() &&
						String(x.ton ?? '').trim() === String(y.ton ?? '').trim() &&
						String(x.closeType ?? '').trim() === String(y.closeType ?? '').trim()
					);
				}
			};

			// 기간 겹침 여부
			const isOverlap = (s1: string, e1: string, s2: string, e2: string) => {
				const start1 = dayjs(s1),
					end1 = dayjs(e1);
				const start2 = dayjs(s2),
					end2 = dayjs(e2);
				return !(end1.isBefore(start2) || end2.isBefore(start1));
			};

			// 키 문자열(신규끼리 중복 검사용)
			const keyOf = (r: any) => {
				if (String(r.sttlItemCd ?? '').trim() === 'P24' || String(r.sttlItemCd ?? '').trim() === 'P34') {
					return `${String(r.sttlItemCd ?? '').trim()}|${String(r.dcCode ?? '').trim()}|${String(
						r.contractType ?? '',
					).trim()}|${String(r.courierNm ?? '').trim()}|${String(r.ton ?? '').trim()}|${String(
						r.closeType ?? '',
					).trim()}|${String(r.base ?? '').trim()}|${String(r.areaNm ?? '')}`;
				} else {
					return `${String(r.sttlItemCd ?? '').trim()}|${String(r.dcCode ?? '').trim()}|${String(
						r.contractType ?? '',
					).trim()}|${String(r.courierNm ?? '').trim()}|${String(r.ton ?? '').trim()}|${String(
						r.closeType ?? '',
					).trim()}|${String(r.areaNm ?? '')}`;
				}
			};

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
					if (arr.some(x => isOverlap(x.fromDate, x.toDate, n.fromDate, n.toDate))) {
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
						(e: any) => sameKey(n, e) && isOverlap(n.fromDate, n.toDate, e.fromDate, e.toDate),
					);

					for (const e of targets) {
						const item = {
							_$uid: e._$uid ?? e.uid ?? e.serialKey, // 그리드 식별자
							serialKey: e.serialKey,
							toDate: dayjs(n.fromDate, 'YYYYMMDD').subtract(1, 'day').format('YYYYMMDD'), // 종료일을 어제로 설정
							rowStatus: 'U',
						};
						// ref.gridRef.current.updateRowsById(item);
						// // ref.gridRef.current.setCheckedRowsByValue('serialKey', e.serialKey);
						// ref.gridRef.current.addCheckedRowsByValue('_$uid', e._$uid);
						updatedSerialKeys.push(e.serialKey);
					}
				}

				const validChkList = ref.gridRef.current.getChangedData({ validationYn: false });

				const today = dayjs().format('YYYYMMDD');
				const arr: any = [];
				// (validChkList ?? []).forEach((row: any) => {
				// 	ref.gridRef.current.addCheckedRowsByValue('_$uid', row._$uid);

				// 	if ((row.rowStatus ?? '').toUpperCase() === 'I') {
				// 		if ('fromDt' in row) row.fromDt = today; // fromDt 필드 사용하는 경우
				// 		else row.fromDate = today; // fromDate 필드 사용하는 경우
				// 	}
				// });
				////console.log((arr);
				// setCheckedRowsByValue(arr);
				// ////console.log((validChkList);

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
								////console.log((saveList);
								apiSaveTmEntityExcel(saveList)
									.then(res => {
										if (res.statusCode === 0) {
											ref.gridRef.current.clearGridData();
											props.fnCallBack?.();
											showAlert('저장', '저장되었습니다.');
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
						////console.log((saveList);
						apiSaveTmEntityExcel(saveList)
							.then(res => {
								if (res.statusCode === 0) {
									ref.gridRef.current.clearGridData();
									props.fnCallBack?.();
									showAlert('저장', '저장되었습니다.');
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
	const onExcelDownLoad = () => {
		// 그리드 데이터 체크
		ref.gridRef.current.setColumnPropByDataField('dcCode', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('sttlItemCd', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('contractType', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('ton', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('closeType', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('courierNm', { cellMerge: false });
		ref.gridRef.current.setColumnPropByDataField('addWho', { visible: false });
		ref.gridRef.current.setColumnPropByDataField('addDate', { visible: false });
		ref.gridRef.current.setColumnPropByDataField('editWho', { visible: false });
		ref.gridRef.current.setColumnPropByDataField('editDate', { visible: false });

		const gridData = gridBtn.tGridRef.current.getGridData();

		if (!gridData || gridData.length === 0) {
			showAlert(null, '다운로드할 데이터가 없습니다.');
			return;
		}

		const params = {
			fileName: `${storeUtil.getMenuInfo().progNm}_${dateUtils.getToDay('YYYYMMDD')}`,
		};
		gridBtn.tGridRef.current.exportToXlsxGrid(params);
		setTimeout(() => {
			ref.gridRef.current.setColumnPropByDataField('dcCode', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('sttlItemCd', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('contractType', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('ton', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('closeType', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('courierNm', { cellMerge: true });
			ref.gridRef.current.setColumnPropByDataField('addWho', { visible: true });
			ref.gridRef.current.setColumnPropByDataField('addDate', { visible: true });
			ref.gridRef.current.setColumnPropByDataField('editWho', { visible: true });
			ref.gridRef.current.setColumnPropByDataField('editDate', { visible: true });
		}, 500);
	};
	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelDownload', // 엑셀다운로드
				isActionEvent: false,
				callBackFn: () => {
					onExcelDownLoad();
				},
			},
			{
				btnType: 'btn1', // 행추가
				callBackFn: importCarrier,
			},
			{
				btnType: 'copy', // 행추가
				initValues: {
					serialKey: '',
					fromDate: dayjs().format('YYYYMMDD'), // 내일,
					rowStatus: 'I',
				},
			},
			{
				btnType: 'plus', // 행추가
				initValues: {
					fromDate: dayjs().format('YYYYMMDD'), // 내일,
					toDate: '29991231',
					dcCode: dcCode,
					courier: courier,
					courierNm: courierNm?.replace(/\[\d+\]/g, ''),
					rowStatus: 'I',
				},
				// callBackFn: () => {
				// 	if (isEmpty(courier) || isEmpty(courierNm)) {
				// 		const rowindex = ref.gridRef.current.getSelectedIndex()[0];
				// 		ref.gridRef.current.removeRow(rowindex);
				// 		showAlert('', '검색 조건의 운송사 코드/명을 입력해주세요');
				// 	}
				// },
			},
			{
				btnType: 'delete', // 행삭제
			},
			// {
			// 	btnType: 'btn1', // 행삭제
			// 	callBackFn: deleteMaster,
			// },

			{
				btnType: 'save', // 저장
				callBackFn: saveMaster,
			},
		],
	};
	const closeEvent = () => {
		modalRef1.current.handlerClose();
		setIsModalOpen(false);
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
					modalRef1.current.handlerOpen();
					setIsModalOpen(true);
				},
				() => {
					return false;
				},
			);
		} else {
			modalRef1.current.handlerOpen();
			setIsModalOpen(true);
		}
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	const sttlItemCdFunc = () => {
		// data1이 'D' 또는 'P'인 항목만 필터링
		const list = getCommonCodeList('TM_CALC_ITEM');

		return list.filter(item => (item.data1 === 'P' || item.data1 === 'M') && item.data3 === 'Y');
	};
	useEffect(() => {
		apiGetMasterMngList({ dcCode: dcCode }).then(res => {
			// if (res.data.length > 0) {
			// //console.log(((1);
			// const D = getCommonCodeListByData('TM_CALC_ITEM', 'D', null, null, null);
			// const P = getCommonCodeListByData('TM_CALC_ITEM', 'P', null, null, null);
			// const list = getCommonCodeList('TM_CALC_ITEM');
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
			// console.log(result);
			setCodeLiist(result);
			refSttlItemList.current = result;
			// }
		});
	}, [dcCode]);

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		ref.gridRef.current.bind('cellDoubleClick', (e: any) => {
			// if (e.dataField === 'courierNm') {
			// 	// 상품코드 셀 더블클릭하면 상품상세팝업 표시
			// 	const rowIndex = e.rowIndex;
			// 	////console.log((e);
			// 	if (e.item.rowStatus !== 'I') return;
			// 	// 예: custcd 컬럼에서 팝업 열기
			// 	refModal.current.open({
			// 		gridRef: ref.gridRef,
			// 		rowIndex,
			// 		dataFieldMap: {
			// 			courier: 'code',
			// 			courierNm: 'name',
			// 		},
			// 		popupType: 'carrier',
			// 	});
			// }
		});
		gridRefCur.bind('cellEditBegin', (e: any) => {
			////console.log((e);
			const data = e.item;
			const name = e.dataField;

			// if (name === 'fromDate') {
			// 	if (data.fromDate && data.rowStatus !== 'I') {
			// 		return false;
			// 	}
			// 	return true;
			// } else {
			// 	if (name === 'todate') {
			// 		return true;
			// 	}
			// 	if (data.rowStatus !== 'I') {
			// 		return false;
			// 	}
			// }
			if (name === 'fromDate') {
				if (data.fromDate && data.rowStatus !== 'I') {
					// return false;
				}
				return true;
			}

			if (name === 'toDate') {
				return true;
			}

			if (data.rowStatus !== 'I') {
				return false;
			}
		});
		gridRefCur.bind('cellEditEnd', (event: any) => {
			// 해당 행 전체 데이터
			const row = event.item; // 또는 event.row depending on your grid version
			let fromDt = row.fromDate;
			let toDt = row.toDate;
			// //console.log((event);
			// 현재 셀 편집 중 변경된 값 반영
			if (event.dataField === 'fromDate' || event.dataField === 'toDate') {
				if (event.dataField === 'fromDate') {
					fromDt = event.value; // 새로 입력된 from값
					// if (fromDt < dateUtils.getToDay('YYYYMMDD')) {
					// 	showAlert('날짜 오류', '시작일(from)은 오늘 이전 날짜로 설정할 수 없습니다.');
					// 	const dataField = event.dataField;
					// 	gridRefCur.setCellValue(event.rowIndex, dataField, event.oldValue);
					// 	return false;
					// }
				} else if (event.dataField === 'toDate') {
					toDt = event.value; // 새로 입력된 to값
				}

				// dayjs 등 날짜 객체로 변환하여 비교
				if (fromDt && toDt) {
					const fromDay = dayjs(fromDt);
					const toDay = dayjs(toDt);

					if (fromDay.isAfter(toDay)) {
						showAlert('날짜 오류', '시작일(from)이 종료일(to)보다 늦을 수 없습니다.');
						const dataField = event.dataField;
						gridRefCur.setCellValue(event.rowIndex, dataField, event.oldValue);
						return false;
					}
				}
			}
			if (event.dataField === 'sttlItemCd') {
				gridRefCur.setCellValue(event.rowIndex, 'contractType', '');
				if (isEmpty(event.value)) {
					return;
				}
				if (
					!refSttlItemList.current.some(
						val => val.courier === event.item.courier && val.sttlItemCd === event.item.sttlItemCd,
					)
				) {
					gridRefCur.setCellValue(event.rowIndex, 'sttlItemCd', event.oldValue);
					showAlert('', '해당 운송사에 등록되지 않은 정산 항목입니다.');
				}
			}
			if (event.dataField === 'contractType') {
				if (isEmpty(event.value)) {
					return;
				}
				const comCdToYnFieldMap = {
					DELIVERY: 'entrustedCarYn',
					MONTHLY: 'mmContractYn',
					FIX: 'fixCarYn',
					FIXTEMPORARY: 'tmpCarYn',
					TEMPORARY: 'actualCostCarYn',
				};

				const ynField = comCdToYnFieldMap[event.item.contractType];
				if (!ynField) return [];
				const isY = v =>
					String(v ?? '')
						.trim()
						.toUpperCase() === 'Y';
				// 1️⃣ 운송사 + 계약유형으로 허용된 정산항목코드 추출
				const allowedSttlItemCds = (refSttlItemList.current || [])
					.filter(val => val.courier === event.item.courier && isY(val[ynField]))
					.map(val => val.sttlItemCd);

				if (allowedSttlItemCds.includes(event.item.sttlItemCd)) {
					return true;
				} else {
					ref.gridRef?.current.setCellValue(event.rowIndex, 'contractType', event.oldValue);
					showAlert('', '해당 운송사에 등록되지 않은 정산 항목입니다.');
				}
			}
			if (event.dataField === 'courierNm') {
				gridRefCur.setCellValue(event.rowIndex, 'sttlItemCd', '');
				gridRefCur.setCellValue(event.rowIndex, 'contractType', '');
			}

			if (event.dataField === 'sttlItemCd' || event.dataField === 'contractType') {
				if (row.sttlItemCd === 'P01') {
					if (row.contractType === 'FIXTEMPORARY' || row.contractType === 'TEMPORARY' || row.contractType === 'SELF') {
						showAlert(
							'계약유형 오류',
							'관리항목이 운송료인 경우 계약유형은 "임시용차/실비용차/고객자차"를 선택할 수 없습니다.',
						);
						const dataField = event.dataField;
						gridRefCur.setCellValue(event.rowIndex, dataField, event.oldValue);
						return false;
					}
				}
			}
		});
	}, []);

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			// gridRefCur?.setGridData(props.data);
			const newData = (Array.isArray(props.data) ? props.data : [props.data]).map(item => ({
				...item,
				// customRowCheckYn: 'N',
			}));

			// gridRefCur1?.setGridData(props.data);
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				////console.log((ref.gridRef.current.getGridData());
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
				gridRefCur.setColumnPropByDataField('sttlItemCd', { width: 150 });
				gridRefCur.setColumnPropByDataField('rmk', { width: 220 });
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} gridBtn={gridBtn}>
					<Button onClick={onExcelUploadPopupClick}>{t('lbl.EXCELUPLOAD')}</Button>
					<input ref={uploadFile} id="uploadInput" type="file" style={{ display: 'none' }} />
				</GridTopBtn>
				<AUIGrid
					ref={ref.gridRef}
					name={gridId}
					columnLayout={gridCol}
					gridProps={gridProps}
					footerLayout={footerLayout}
				/>
			</AGrid>
			<CmSearchCarrierWrapper ref={refModal2} />
			<CustomModal ref={modalRef1} width="1000px">
				<TmentityRuleExcelUpload
					gridCol={gridCol}
					close={closeEvent}
					save={saveMaster}
					gridProps={gridProps}
					callBack={props.fnCallBack}
					// callBack={props.fnCallBack?.()}
					// setSepecCodeDetail={setSepecCodeDetail}
				/>
			</CustomModal>
			<CmSearchWrapper ref={refModal} />
		</>
	);
});
export default TmEntityRuleDetail;
