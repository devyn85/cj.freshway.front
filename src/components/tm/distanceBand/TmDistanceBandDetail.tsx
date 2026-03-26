/*
############################################################################
 # FiledataField	: TmDistanceBandDetail.tsx
 # Description		: 센터별구간설정
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 2025.09.12
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
import { showAlert } from '@/util/MessageUtil';
// API Call Function
import { apiSaveList, apiSaveMasterList as apiSaveMasterList1 } from '@/api/tm/apiTmDistanceBand';
import { apiGetMasterList, apiGetTrspCloseChk } from '@/api/tm/apiTmEntityRule';
//types
import { apiGetMasterList as apiGetMasterMngList } from '@/api/tm/apiTmManageEntity';
import TmSearchHjDong from '@/components/tm/distanceBand/TmSearchHjDong';
import { GridBtnPropsType } from '@/types/common';

//store
import CmSearchCarrierWrapper from '@/components/cm/popup/CmSearchCarrierWrapper';
import CustomModal from '@/components/common/custom/CustomModal';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import TmDistanceBandExcelPopup from '@/components/tm/distanceBand/TmDistanceBandExcelPopup';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { isEmpty } from 'lodash';
const TmDistanceBandDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef1 = useRef();
	const { t } = useTranslation();
	const refSttlItemList = useRef([]);
	const gridId = uuidv4() + '_gridWrap';
	const gridId1 = uuidv4() + '_gridWrap';
	const initDcCode = Form.useWatch('dcCode', props.form);
	const initCourier = Form.useWatch('courier', props.form);
	const initCourierNm = Form.useWatch('courierName', props.form)?.replace(/^\[\s*\d+\s*\]\s*/, '');
	const refModal = useRef(null);
	const refModal1 = useRef(null);
	const refModal2 = useRef(null);
	const refModal3 = useRef(null);
	const uploadExcel = useRef(null);
	let prevRowIndex: any = null;
	let prevRowCou: any = null;
	const date = Form.useWatch('date', props.form);
	const [isModalOpen, setIsModalOpen] = useState(false);
	// const prevRowRange: any = null;
	//공통 코드 호출
	const getTmcaclItmeCommonCodeList = () => {
		const list = getCommonCodeList('TM_CALC_ITEM', '공통', 'P00');

		return list.filter(item => item.data1 === 'P');
		// return list;
	};
	const getCarCapCityTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CARCAPACITY', value)?.cdNm;
	};
	const getContractTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;
	};
	const getCustOrderCloseTypeCommonCodeList = () => {
		// //console.log((getCommonCodeList('CUSTORDERCLOSETYPE', ''));
		//추후 공통 코드 추가 후 변경 예정(data1)
		return getCommonCodeList('VIHICLE_TYPE_CD');
	};
	const getCarCapCityTypeCommonCodeList = () => {
		return getCommonCodeList('CARCAPACITY');
	};
	// const getContractTypeCommonCodeList = () => {
	// 	return getCommonCodeList('CONTRACTTYPE').filter(item => item.comCd == 'FIXTEMPORARY' || item.comCd === 'TEMPORARY');
	// };
	const getContractTypeCommonCodeList = () => {
		return getCommonCodeList('CONTRACTTYPE').filter(
			item => item.comCd == 'FIXTEMPORARY' || item.comCd === 'TEMPORARY' || item.comCd === 'FIX',
		);
	};
	/**
	 * //물류센터 공통코드 호출
	 * 공통 코드 호출([comCd]cdNm)
	 * @param owIndex
	 * @param columnIndex
	 * @param value
	 * @returns
	 */
	const getCustomCommonCodeList = (owIndex: any, columnIndex: any, value: any) => {
		const list = getCommonCodeList('WMS_MNG_DC');
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
	const closeEvent = () => {
		refModal2.current.handlerClose();

		setIsModalOpen(false);
	};
	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: '물류센터',
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			editable: false,
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
				popupType: 'carrierDrop',
				searchDropdownProps: {
					dataFieldMap: {
						courier: 'code',
						courierNm: 'name',
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
					refModal3.current.open({
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
		},
		{
			dataField: 'contractType',
			headerText: '계약유형',
			dataType: 'code',
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			required: true,
			mergePolicy: 'restrict',
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
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				//리스트 필터로직
				// list: getContractTypeCommonCodeList(),

				listFunction: function (rowIndex, columnIndex, item, dataField) {
					const list = refSttlItemList.current.filter(
						val => val.courier === item.courier && val.sttlItemCd === item?.sttlItemCd,
					)[0];
					const sttlItemCd = item?.sttlItemCd;
					const courier = item?.courier;
					// ✅ 필수값 없으면 드롭다운 비움
					const ynToComCdMap = {
						entrustedCarYn: 'DELIVERY', // 지입
						mmContractYn: 'MONTHLY', // 월대
						fixCarYn: 'FIX', // 고정
						tmpCarYn: 'FIXTEMPORARY', // 임시
						actualCostCarYn: 'TEMPORARY', // 실비
					};
					//console.log((item.sttlItemCd);
					if (isEmpty(item.sttlItemCd) || isEmpty(item?.sttlItemCd)) {
						return [];
					}
					if (isEmpty(list)) {
						return [];
					}
					const isY = v =>
						String(v ?? '')
							.trim()
							.toUpperCase() === 'Y';

					const allowedComCds = Object.keys(ynToComCdMap)
						.filter(k => isY(list[k]))
						.map(k => ynToComCdMap[k]);
					return getContractTypeCommonCodeList().filter(cc => allowedComCds.includes(cc.comCd));
				},
				//임시처리
				// list: getContractTypeCommonCodeList(),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			editable: true,
			labelFunction: getContractTypeCommonCode,
		},
		{
			dataField: 'base',
			headerText: '구간',
			dataType: 'code',
			required: true,
			editable: true,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			merge: true, // 머지금지(머지되면 편집막힘)
			mergePolicy: 'restrict',
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
				type: 'InputEditRenderer',
				// onlyNumeric: true,
				allowPoint: false, // 소수점 입력 불가
				allowNegative: false, // 음수 입력 불가
				maxlength: 2,
				regExp: '^(?:[1-9]\\d?)$',
			},
		},

		{
			dataField: 'ton',
			headerText: '톤수',
			dataType: 'code',
			editable: true,
			required: true,
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
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: getCarCapCityTypeCommonCodeList(),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: getCarCapCityTypeCommonCode,
		},

		{
			dataField: 'amount',
			headerText: '단가',
			dataType: 'numeric',
			editable: true,
			required: true,
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
				type: 'InputEditRenderer',
				onlyNumeric: true, // 0~9만 입력
				allowPoint: false, // 소수점 금지
				allowNegative: false, // 음수 금지
				formatString: '#,##0',
			},
		},
		// { dataField: 'rmk', headerText: '비고', dataType: 'string', editable: true },
		{
			dataField: 'fromDate',
			headerText: '시작일자',
			dataType: 'date',
			editable: true,
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (item.rowStatus !== 'I') {
			// 		// 편집 가능 class 삭제
			// 		ref.gridRef.current.removeEditClass(columnIndex);
			// 	} else {
			// 		// 편집 가능 class 추가
			// 		return 'isEdit';
			// 	}
			// },
			required: true,
			formatString: 'yyyy-mm-dd',
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
		},
		{
			dataField: 'toDate',
			// required: true,
			headerText: '종료일자',
			dataType: 'date',
			editable: false,
			formatString: 'yyyy-mm-dd',
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (item.rowStatus !== 'I') {
			// 		// 편집 가능 class 삭제
			// 		ref.gridRef.current.removeEditClass(columnIndex);
			// 	} else {
			// 		// 편집 가능 class 추가
			// 		return 'isEdit';
			// 	}
			// },
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			// labelFnction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
			// },
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

		// { dataField: 'rowStatus', headerText: '행 상태', dataType: 'string', editable: true },
	];
	const gridCol1 = [
		{ dataField: 'dcCode', headerText: 'dcCode', dataType: 'string', editable: true, visible: false },
		{ dataField: 'courierRange', headerText: 'courierRange', dataType: 'string', editable: true, visible: false },
		{ dataField: 'hjdongCd', headerText: 'hjdongCd', dataType: 'string', editable: true, visible: false },
		{ dataField: 'courier', headerText: 'courier', dataType: 'string', editable: true, visible: false },
		{ dataField: 'ctpKorNm', headerText: '시도명', dataType: 'string', editable: false },
		{
			dataField: 'sigKorNm',
			headerText: '시군구명',
			// editable: false,
			// required: true,
			editable: false,
			// editable: false
			dataType: 'text',
			// commRenderer: {
			// 	type: 'search',
			// 	onClick: function (e: any) {
			// 		const rowIndex = e.rowIndex;
			// 		const data = ref.gridRef.current.getSelectedRows();
			// 		//console.log((data);
			// 		if (data.length === 0 || e.item.rowStatus !== 'I') return;
			// 		// 예: custcd 컬럼에서 팝업 열기
			// 		refModal1.current.open({
			// 			gridRef: ref.gridRef1,
			// 			selectData: data[0],
			// 			rowIndex,
			// 			dataFieldMap: {
			// 				hjdongCd: 'hjdongCd',
			// 				hjdongNm: 'hjdongNm',
			// 				sigKorNm: 'sigKorNm',
			// 				ctpKorNm: 'ctpKorNm',
			// 			},
			// 			// popupType: 'carrier',
			// 		});
			// 	},
			// },
		},
		{
			dataField: 'hjdongNm',
			headerText: '행정동',
			editable: false,
			required: true,
			dataType: 'code',
			commRenderer: {
				type: 'search',
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					const data = ref.gridRef.current.getSelectedRows();

					if (data.length === 0 || e.item.rowStatus !== 'I') return;
					// 예: custcd 컬럼에서 팝업 열기
					refModal1.current.open({
						gridRef: ref.gridRef1,
						selectData: data[0],
						rowIndex,
						dataFieldMap: {
							hjdongCd: 'hjdongCd',
							hjdongNm: 'hjdongNm',
							sigKorNm: 'sigKorNm',
							ctpKorNm: 'ctpKorNm',
						},
						// popupType: 'carrier',
					});
				},
			},
		},
		{
			dataField: 'courierRangeDtl',
			headerText: '권역이동구분',
			dataType: 'code',
			required: true,
			editable: true,
			// cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			// merge: true, // 머지금지(머지되면 편집막힘)
			// mergePolicy: 'restrict',
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (item.rowStatus !== 'I') {
			// 		// 편집 가능 class 삭제
			// 		ref.gridRef.current.removeEditClass(columnIndex);
			// 	} else {
			// 		// 편집 가능 class 추가
			// 		return 'isEdit';
			// 	}
			// },
			editRenderer: {
				type: 'InputEditRenderer',
				// onlyNumeric: true,
				allowPoint: false, // 소수점 입력 불가
				allowNegative: false, // 음수 입력 불가
				maxlength: 2,
				regExp: '^(?:[1-9]\\d?)$',
			},
		},
		{ dataField: 'rmk', headerText: '비고', dataType: 'string', editable: true },
		{
			dataField: 'fromDate',
			headerText: '시작일자',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			// dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			required: true,
			// width: 120,

			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (item.rowStatus !== 'I') {
			// 		// 편집 가능 class 삭제
			// 		ref.gridRef1.current.removeEditClass(columnIndex);
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
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			// labelFnction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
			// },
		},
		{
			dataField: 'addWhoName',
			headerText: '등록자',
			width: 90,
			dataType: 'manager',
			managerDataField: 'addWho',
			editable: false,
		},
		{ dataField: 'addDate', headerText: '등록일시', dataType: 'date', editable: false },
		{
			dataField: 'editWhoName',
			headerText: '수정자',
			width: 90,
			dataType: 'manager',
			managerDataField: 'editWho',
			editable: false,
		},
		{ dataField: 'editDate', headerText: '수정일시', dataType: 'date', editable: false },
		{
			dataField: 'courier',
			headerText: '운송사',
			// required: true,
			editable: false,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			visible: false,
			dataType: 'code',
		},

		// { dataField: 'rowStatus', headerText: '행 상태', dataType: 'string', editable: true },
	];
	const gridProps = {
		editable: true,
		enableCellMerge: true,
		cellMergeRowSpan: false,
		rowSelectionWithMerge: true,
		// 브랜치에 해당되는 행을 출력 여부
		showBranchOnGrouping: false,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// groupingFields: ['dcCode', 'courierNm', 'contractType'],
		// isLegacyRemove: true,
	};
	const gridProps1 = {
		editable: true,

		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// isLegacyRemove: true,
	};
	const footerLayout = [{}];

	const footerLayout1 = [{}];
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
		refModal3.current.open({
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
				refModal3.current.handlerClose();
				const selectedData = selectedRows[0];
				////console.log((selectedData);
				if (selectedData.code === fromCourier) {
					showAlert('', '동일한 운송사를 선택하였습니다');
					return;
				}
				apiGetMasterList({
					importCarrier: selectedData.code,
					importCarrierNm: selectedData.name,
					dcCode: rowData.dcCode,
					courier: fromCourier,
					standardFromDate: date[0].format('YYYYMMDD'),
					standardToDate: date[1].format('YYYYMMDD'),
					contractYn: false,
				}).then(res => {
					////console.log((res.data);
					res.data.forEach(row => {
						gridRef.addRow({ ...row, rowStatus: 'I' });
					});
				});
			},
		});
	};
	const onExcelUploadPopupClick = () => {
		// if (props.user !== '2170') return;
		if (ref.gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			showConfirm(
				null,
				t('msg.MSG_COM_CFM_009'),
				() => {
					refModal2.current.handlerOpen();

					setIsModalOpen(true);
				},
				() => {
					return false;
				},
			);
		} else {
			// if (isEmpty(custkey) || isEmpty(tplBcnrId) || isEmpty(organize)) {
			// 	showAlert('', '창고와 화주를 입력해주세요');
			// 	return;
			// }

			refModal2.current.handlerOpen();
			setIsModalOpen(true);
		}
	};

	/**
	 *
	 * @param v
	 * @returns
	 */
	// 숫자만 남기기
	const onlyDigits = (v: any) =>
		String(v ?? '')
			.trim()
			.replace(/\D/g, '');
	const isSameHjdongScope = (a: any, b: any) => {
		const A = onlyDigits(a);
		const B = onlyDigits(b);
		// 빈 값은 '전체'로 간주 → 모두와 겹침
		if (!A || !B) return true;

		// 짧은 쪽이 2/5/10 자리 중 하나면 prefix로 비교 (계층 일치)
		const short = A.length <= B.length ? A : B;
		const long = A.length > B.length ? A : B;

		const validLevel = short.length === 2 || short.length === 5 || short.length === 10;
		if (validLevel) return long.startsWith(short);

		// 그 외 길이는 안전하게 '완전일치'만 인정
		return A === B;
	};

	// 기간 겹침 여부
	const isOverlap = (s1: string, e1: string, s2: string, e2: string) => {
		const start1 = dayjs(s1),
			end1 = dayjs(e1);
		const start2 = dayjs(s2),
			end2 = dayjs(e2);
		return !(end1.isBefore(start2) || end2.isBefore(start1));
	};
	const validChk = (codeDtl: any[], allRows: any[], chk: any) => {
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
			const yester = dayjs().subtract(1, 'day').format('YYYYMMDD');
			// ── 공통(와일드카드) 판정: null/undefined/빈문자열/ "공통" 만 인정 ──
			const isCommon = (v: any) => {
				if (v == null) return true; // null, undefined
				const s = String(v).trim();
				return s === '' || s === '공통'; // 빈문자열 또는 "공통"
			};

			// 엄격 동등: 둘 다 값이 있어야 하고, 트림 후 동일해야 함
			const strictEq = (a: any, b: any) => a != null && b != null && String(a).trim() === String(b).trim();

			// 공통 허용 동등: 한쪽이라도 공통이면 true, 아니면 값이 같아야 true

			if (chk) {
				// 동일 항목(관리키) 비교
				const sameKey = (x: any, y: any) =>
					// String(x.sttlItemCd ?? '').trim() === String(y.sttlItemCd ?? '').trim() &&
					String(x.dcCode ?? '').trim() === String(y.dcCode ?? '').trim() &&
					String(x.contractType ?? '').trim() === String(y.contractType ?? '').trim() &&
					String(x.courier ?? '').trim() === String(y.courier ?? '').trim() &&
					String(x.ton ?? '').trim() === String(y.ton ?? '').trim() &&
					// String(x.closeType ?? '').trim() === String(y.closeType ?? '').trim() &&
					String(x.base ?? '').trim() === String(y.base ?? '').trim();
				// String(x.areaNm ?? '').trim() === String(y.areaNm ?? '').trim();

				// 키 문자열(신규끼리 중복 검사용)
				const keyOf = (r: any) =>
					`${String(r.dcCode ?? '').trim()}|${String(r.contractType ?? '').trim()}|${String(
						r.courier ?? '',
					).trim()}|${String(r.ton ?? '').trim()}|${String(r.base ?? '').trim()}}`;

				// 기존/신규 분리
				const existingRows = allRows.filter((r: any) => r.rowStatus !== 'I');
				const newRows = codeDtl.filter((r: any) => r.rowStatus === 'I');
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
								// serialKey: e.serialKey,
								toDate: dayjs(n.fromDate, 'YYYYMMDD').subtract(1, 'day').format('YYYYMMDD'), // 종료일을 어제로 설정
								rowStatus: 'U',
							};

							// ref.gridRef.current.updateRowsById(item);
							// ref.gridRef.current.addCheckedRowsByValue('_$uid', e._$uid);
							// ref.gridRef.current.setCheckedRowsByValue('serialKey', e.serialKey);
							updatedSerialKeys.push(e.serialKey);
						}
					}
					const validChkList = ref.gridRef.current.getChangedData({ validationYn: false });
					const today = dayjs().format('YYYYMMDD');
					const arr: any = [];
					// (validChkList ?? []).forEach((row: any) => {
					// 	ref.gridRef.current.addCheckedRowsByValue('_$uid', row._$uid);

					// 	if ((row.rowStatus ?? '').toUpperCase() === 'I') {
					// 		if ('fromdate' in row) row.fromdate = today; // fromDt 필드 사용하는 경우
					// 		else row.fromDate = today; // fromDate 필드 사용하는 경우
					// 	}
					// });

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
									apiSaveList(saveList)
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
							apiSaveList(saveList)
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
			} else if (!chk) {
				// // 같은 행 판별용 UID 생성기 (우선순위: _$uid > uid > PK > 합성키)
				// const getUid = (r: any) =>
				// 	r._$uid ??
				// 	r.uid ??
				// 	r.serialKey ??
				// 	`${r.dcCode}|${r.courier}|${r.hjdongCd}|${r.courierRange}|${r.fromDate}|${r.toDate}`;

				// for (const a of codeDtl) {
				// 	const aUid = getUid(a);

				// 	for (const b of allRows) {
				// 		// 자기 자신은 건너뜀
				// 		if (aUid === getUid(b)) continue;
				// 		if (
				// 			a.dcCode === b.dcCode &&
				// 			// a.areaNm === b.area &&
				// 			a.courier === b.courier &&
				// 			a.hjdongCd === b.hjdongCd &&
				// 			a.courierRange === b.courierRange &&
				// 			// a.base === b.base &&
				// 			!isDisjoint(a.fromDate, a.toDate, b.fromDate, b.toDate)
				// 		) {
				// 			showAlert('중복 오류', '날짜 구간 내에 중복이 존재합니다.');
				// 			return false;
				// 		}
				// 	}
				// }
				const sameKey = (x: any, y: any) =>
					String(x.dcCode ?? '').trim() === String(y.dcCode ?? '').trim() &&
					String(x.courier ?? '').trim() === String(y.courier ?? '').trim() &&
					String(x.courierRange ?? '').trim() === String(y.courierRange ?? '').trim() &&
					isSameHjdongScope(x.hjdongCd, y.hjdongCd); // ★ 계층 포함 비교

				// 키 문자열(신규끼리 중복 검사용)
				// const keyOf = (r: any) =>
				// 	`${String(r.dcCode ?? '').trim()}|${String(r.courier ?? '').trim()}|${String(
				// 		r.courierRange ?? '',
				// 	).trim()}|${String(r.hjdongCd ?? '').trim()}`;
				const keyOf = (r: any) =>
					`${String(r.dcCode ?? '').trim()}|${String(r.courier ?? '').trim()}|${String(r.courierRange ?? '').trim()}`;

				// 기존/신규 분리
				const existingRows = allRows.filter((r: any) => r.rowStatus !== 'I');
				const newRows = codeDtl.filter((r: any) => r.rowStatus === 'I');
				{
					const seen = new Map<string, any[]>();
					for (const n of newRows) {
						const k = keyOf(n);
						if (!seen.has(k)) seen.set(k, []);
						const arr = seen.get(k)!;

						// 같은 버킷의 기존 신규들과 '행정동계층 겹침' + '기간 겹침' 체크
						const dup = arr.some(
							x => isSameHjdongScope(x.hjdongCd, n.hjdongCd) && isOverlap(x.fromDate, x.toDate, n.fromDate, n.toDate),
						);
						if (dup) {
							showAlert('중복 오류', '신규행끼리 동일 항목(행정동 계층 포함)이 날짜 구간 내에서 중복됩니다.');
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
					const del = false;
					const delArr: any[] = [];
					for (const n of newRows) {
						const targets = existingRows.filter(
							(e: any) => sameKey(n, e) && isOverlap(n.fromDate, n.toDate, e.fromDate, e.toDate),
						);

						for (const e of targets) {
							// 시작일자가 같으면 삭제(D), 아니면 종료일만 어제로 변경(U)
							if (n.fromDate === e.fromDate) {
								const item = {
									_$uid: e._$uid ?? e.uid ?? e.serialKey,
									// toDate: '20230909',
									// rowStatus: 'D', // 삭제 처리
								};
								// ref.gridRef1.current.addCheckedRowsByValue('_$uid', e._$uid);
								// ref.gridRef1.current.updateRowsById(item);
								// del = true;
								// ref.gridRef1.current.removeRowByRowId(e._$uid);
								// ref.gridRef1.current.addCheckedRowsByValue('_$uid', e._$uid);
								delArr.push(e._$uid);
							} else {
								const item = {
									_$uid: e._$uid ?? e.uid ?? e.serialKey,
									toDate: dayjs(n.fromDate, 'YYYYMMDD').subtract(1, 'day').format('YYYYMMDD'), // 종료일을 어제로 설정
									rowStatus: 'U', // 종료일만 변경
								};
								// ref.gridRef1.current.addCheckedRowsByValue('_$uid', e._$uid);
								// ref.gridRef1.current.updateRowsById(item);
							}
							updatedSerialKeys.push(e.serialKey);
						}
					}
					const validChkList = ref.gridRef1.current.getChangedData({ validationYn: false });

					const today = dayjs().format('YYYYMMDD');
					const arr: any = [];
					// (validChkList ?? []).forEach((row: any) => {
					// 	if ((row.rowStatus ?? '').toUpperCase() === 'I') {
					// 		if ('fromdate' in row) row.fromdate = today; // fromDt 필드 사용하는 경우
					// 		else row.fromDate = today; // fromDate 필드 사용하는 경우
					// 	}
					// });

					// ref.gridRef1.current.addCheckedRowsByIds(delArr);

					let msg = null;

					if (del) {
						msg = `동일 항목의 기존 ${
							validChkList.filter(item => item.rowStatus === 'D').length
						}건을 삭제 처리하고 동일한 조건의 데이터가 있어 기간을 자동으로 조정했습니다. 변경된 내용을 확인 후 다시 저장해주세요.`;
					} else {
						msg = '동일한 조건의 데이터가 있어 기간을 자동으로 조정했습니다. 변경된 내용을 확인 후 다시 저장해주세요.';
					}
					if (updatedSerialKeys.length > 0) {
						showAlert('안내', msg, () => {
							// ─────────────────────────────────────────────────────────
							// 3) 저장 확인 및 호출
							// ─────────────────────────────────────────────────────────
							ref.gridRef1.current.showConfirmSave(async () => {
								const data = ref.gridRef.current.getSelectedRows();
								// const mergedCodeDtl = [...validChkList, ...data];
								const mergedCodeDtl = [...validChkList];
								const saveList = {
									saveList: mergedCodeDtl,
								};

								await apiSaveMasterList1(saveList)
									.then(async res => {
										if (res.statusCode === 0) {
											ref.gridRef1.current.clearGridData();
											// prevRowIndex = null;
											showAlert('저장', '저장되었습니다.');
											await props.fnCallBack(); // 저장 성공 후에만 호출
											// const data = ref.gridRef.current.getSelectedRows();
											// //console.log((data[0]);
										} else {
											return false;
										}
									})
									.catch(e => {
										return false;
									});
							});
						});
					} else {
						ref.gridRef1.current.showConfirmSave(async () => {
							const data = ref.gridRef.current.getSelectedRows();
							// const mergedCodeDtl = [...validChkList, ...data];
							const mergedCodeDtl = [...validChkList];
							const saveList = {
								saveList: mergedCodeDtl,
							};

							await apiSaveMasterList1(saveList)
								.then(async res => {
									if (res.statusCode === 0) {
										ref.gridRef1.current.clearGridData();
										// prevRowIndex = null;
										showAlert('저장', '저장되었습니다.');
										await props.fnCallBack(); // 저장 성공 후에만 호출
										// const data = ref.gridRef.current.getSelectedRows();
										// //console.log((data[0]);
									} else {
										return false;
									}
								})
								.catch(e => {
									return false;
								});
						});
					}
				}
			}
			return true;
		});
	};
	/**
	 * 저장로직
	 * @returns
	 */
	const saveMaster = () => {
		const codeDtl = ref.gridRef.current.getChangedData({ validationYn: false });

		const allRows = ref.gridRef.current.getGridData();
		validChk(codeDtl, allRows, true);
	};
	const saveMaster1 = async () => {
		const codeDtl = ref.gridRef1.current.getChangedData({ validationYn: false });
		const allRows = ref.gridRef1.current.getGridData();
		if (!codeDtl || codeDtl.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
				return;
			});
		} else if (codeDtl.length > 0 && !ref.gridRef.current.validateRequiredGridData()) {
			return;
		} else {
			// data의 각 row를 codeDtl에 추가
			validChk(codeDtl, allRows, false);
		}
	};

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 행추가
				callBackFn: importCarrier,
			},
			{
				btnType: 'copy', // 행추가
				initValues: {
					fromDate: dayjs().format('YYYYMMDD'), // 내일,
					rowStatus: 'I',
					sttlItemCd: 'P01',
				},
				callBackFn: () => {
					// ref.gridRef1.current.clearGridData();
				},
			},
			{
				btnType: 'plus', // 행추가
				initValues: {
					fromDate: dayjs().format('YYYYMMDD'), // 내일,
					toDate: '29991231',
					dcCode: initDcCode,
					courier: initCourier,
					courierNm: initCourierNm,
					rowStatus: 'I',
					sttlItemCd: 'P01',
				},
				// callBackFn: () => {
				// 	//console.log((initDcCode, initCourier, initCourierNm);
				// 	if (
				// 		initDcCode === '' ||
				// 		initCourier === '' ||
				// 		initDcCode == null ||
				// 		initCourier == null ||
				// 		initDcCode === undefined ||
				// 		initCourier === undefined ||
				// 		initCourierNm === undefined ||
				// 		initCourierNm === '' ||
				// 		initCourierNm == null
				// 	) {
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
	// 마스터 그리드 버튼 설정
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'copy', // 행추가
				initValues: {
					rowStatus: 'I',
					fromDate: dayjs().format('YYYYMMDD'), // 내일,
				},
			},
			{
				btnType: 'plus', // 행추가
				initValues: {
					fromDate: dayjs().format('YYYYMMDD'), // 내일,
					toDate: '29991231',
					dcCode: initDcCode,
					courier: initCourier,
					// courierRange: ref.gridRef?.current?.getSelectedRows()[0].base,
					rowStatus: 'I',
				},
				callBackFn: () => {
					if (ref.gridRef.current.getGridData().length === 0) {
						const rowindex = ref.gridRef1.current.getSelectedIndex()[0];
						ref.gridRef1.current.removeRow(rowindex);
						showAlert('', '구간 내역의 데이터가 없습니다.');
					}
					// //console.log((ref.gridRef.current.getSelectedRows());
					if (ref.gridRef?.current?.getSelectedRows()[0].rowStatus === 'I') {
						const rowindex = ref.gridRef1.current.getSelectedIndex()[0];
						ref.gridRef1.current.removeRow(rowindex);
						showAlert('', '구간내역의 데이터가 없습니다.');
					}
				},
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
				callBackFn: saveMaster1,
			},
		],
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useEffect(() => {
		// console.log(initDcCode);
		apiGetMasterMngList({ dcCode: initDcCode }).then(res => {
			// if (res.data.length > 0) {
			// //console.log(((1);
			// const D = getCommonCodeListByData('TM_CALC_ITEM', 'D', null, null, null);
			// const P = getCommonCodeListByData('TM_CALC_ITEM', 'P', null, null, null);
			// const list = getCommonCodeList('TM_CALC_ITEM');
			const matched = res.data.filter(item2 =>
				getContractTypeCommonCodeList().some(item1 => item1.sttlItemCd === item2.comCd),
			);
			//console.log(matched);
			// setCodeLiist(matched);
			refSttlItemList.current = matched;
			// }
		});
	}, [initDcCode]);
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		const gridRefCur1 = ref.gridRef1.current;
		ref.gridRef.current.bind('cellDoubleClick', (e: any) => {
			if (e.dataField === 'courierNm') {
				// 상품코드 셀 더블클릭하면 상품상세팝업 표시
				const rowIndex = e.rowIndex;
				////console.log((e);
				if (e.item.rowStatus !== 'I') return;
				// 예: custcd 컬럼에서 팝업 열기
				// refModal.current.open({
				// 	gridRef: ref.gridRef,
				// 	rowIndex,
				// 	dataFieldMap: {
				// 		courier: 'code',
				// 		courierNm: 'name',
				// 	},
				// 	popupType: 'carrier',
				// });
			}
		});
		gridRefCur1.bind('cellEditBegin', function (event: any) {
			// '회사', '코드리스트' 신규행만 수정 가능

			if (event.item.rowStatus !== 'I') {
				if (event.dataField === 'fromDate' || event.dataField === 'rmk' || event.dataField === 'courierRangeDtl') {
					return true;
				} else {
					return false;
				}
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});
		gridRefCur.bind('cellEditBegin', function (event: any) {
			// '회사', '코드리스트' 신규행만 수정 가능

			if (event.item.rowStatus !== 'I') {
				if (event.dataField === 'toDate' || event.dataField === 'fromDate') {
					return true;
				} else {
					return false;
				}
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});
		gridRefCur.bind('cellEditEnd', (event: any) => {
			// 해당 행 전체 데이터
			const row = event.item; // 또는 event.row depending on your grid version
			let fromDt = row.fromDate;
			let toDt = row.toDate;

			// 현재 셀 편집 중 변경된 값 반영
			if (event.dataField === 'fromDate') {
				fromDt = event.value; // 새로 입력된 from값
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
			if (event.dataField === 'courierNm') {
				gridRefCur.setCellValue(event.rowIndex, 'contractType', '');
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
				//console.log((comCdToYnFieldMap[event.item.contractType]);
				if (!ynField) return [];
				const isY = v =>
					String(v ?? '')
						.trim()
						.toUpperCase() === 'Y';
				// 1️⃣ 운송사 + 계약유형으로 허용된 정산항목코드 추출
				const allowedSttlItemCds = (refSttlItemList.current || [])
					.filter(val => val.courier === event.item.courier && isY(val[ynField]))
					.map(val => val.sttlItemCd)
					.filter(Boolean);
				//console.log((allowedSttlItemCds);
				if (allowedSttlItemCds.includes(event.item.sttlItemCd)) {
					return true;
				} else {
					ref.gridRef?.current.setCellValue(event.rowIndex, 'contractType', event.oldValue);
					showAlert('', '해당 운송사에 등록되지 않은 정산 항목입니다.');
				}
			}
		});
		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */

		gridRefCur.bind('selectionChange', (event: any) => {
			if (event.primeCell.item.rowStatus === 'I') {
				ref.gridRef1.current.clearGridData();
				prevRowIndex = null;
				prevRowCou = null;

				return;
			}
			if (event.primeCell.item.base === prevRowIndex && event.primeCell.item.courier === prevRowCou) {
				return;
			}

			prevRowIndex = event.primeCell.item.base;
			prevRowCou = event.primeCell.item.courier;

			// //console.log((prevRowIndex);
			const selectRow = event.primeCell.item;
			props.searchDtl(selectRow);
		});
	}, []);

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			// gridRefCur?.setGridData(props.data);
			const newData = (Array.isArray(props.data) ? props.data : [props.data]).map(item => ({
				...item,
				customRowCheckYn: 'N',
			}));
			// gridRefCur?.setGridData(props.data);
			gridRefCur?.setGridData(newData);

			gridRefCur?.setSelectionByIndex(0, 0);
			const selectRow = ref.gridRef.current.getItemByRowIndex(0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);

				gridRefCur.setColumnPropByDataField('courierNm', { width: colSizeList[3] + 20 });
				gridRefCur.setColumnPropByDataField('amount', { width: 91 });
				gridRefCur.setColumnPropByDataField('ton', { width: 68 });
				gridRefCur.setColumnPropByDataField('toDate', { width: 108 });
				gridRefCur.setColumnPropByDataField('addDate', { width: 180 });
				gridRefCur.setColumnPropByDataField('editDate', { width: 180 });
				gridRefCur.setColumnPropByDataField('fromDate', { width: 108 });

				props.searchDtl(selectRow);
			}
		}
	}, [props.data]);
	useEffect(() => {
		const gridRefCur = ref.gridRef1.current;
		if (gridRefCur) {
			const newData = (Array.isArray(props.dataDtl) ? props.dataDtl : [props.dataDtl]).map(item => ({
				...item,
				customRowCheckYn: 'N',
			}));
			// gridRefCur?.setGridData(props.dataDtl);
			gridRefCur?.setGridData(newData);

			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.dataDtl.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				gridRefCur.setColumnSizeList(colSizeList);
				gridRefCur.setColumnPropByDataField('rmk', { width: 110 });
				gridRefCur.setColumnPropByDataField('sigKorNm', { width: colSizeList[5] + 20 });
				gridRefCur.setColumnPropByDataField('hjdongNm', { width: colSizeList[6] + 15 });
				gridRefCur.setColumnPropByDataField('fromDate', { width: 108 });
				gridRefCur.setColumnPropByDataField('toDate', { width: 108 });
				gridRefCur.setColumnPropByDataField('addDate', { width: 180 });
				gridRefCur.setColumnPropByDataField('editDate', { width: 180 });
			}
		}
	}, [props.dataDtl]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridTitle="구간내역" totalCnt={props.totalCnt} gridBtn={gridBtn}>
								<Button onClick={onExcelUploadPopupClick}>{t('lbl.EXCELUPLOAD')}</Button>
								<input ref={uploadExcel} id="uploadInput" type="file" style={{ display: 'none' }} />
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid
								ref={ref.gridRef}
								name={gridId}
								columnLayout={gridCol}
								gridProps={gridProps}
								footerLayout={footerLayout}
							/>
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridTitle="구간상세내역" totalCnt={props.totalCntDtl} gridBtn={gridBtn1} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid
								ref={ref.gridRef1}
								name={gridId1}
								columnLayout={gridCol1}
								gridProps={gridProps1}
								footerLayout={footerLayout1}
							/>
						</GridAutoHeight>
					</>,
				]}
			/>

			<CmSearchWrapper ref={refModal} />
			<TmSearchHjDong ref={refModal1} />
			<CmSearchCarrierWrapper ref={refModal3} />
			<CustomModal ref={refModal2} width="1000px">
				<TmDistanceBandExcelPopup
					ref={refModal2}
					close={closeEvent}
					dcCode={initDcCode}
					fnCallBack={props.fnCallBack}
				/>
			</CustomModal>
		</>
	);
});
export default TmDistanceBandDetail;
