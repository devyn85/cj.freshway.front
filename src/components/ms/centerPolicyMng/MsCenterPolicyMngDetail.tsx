/*
 ############################################################################
 # FiledataField	: MsCenterPolicyMngDetail.tsx
 # Description		: 기준정보 > 센터기준정보 > 센터정책관리
 # Author			: JeongHyeongCheol
 # Since			: 25.08.06
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, DatePicker, Form, Input, Switch } from 'antd';
// Util

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import { InputText, SelectBox } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';

// store

// API Call Function
import {
	apiGetDetailList,
	apiGetLocationList,
	apiPostSaveMasterList,
	apiPostSaveMasterList2,
	apiPostSaveMasterList3,
} from '@/api/ms/apiMsCenterPolicyMng';
import CustomModal from '@/components/common/custom/CustomModal';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import ScrollBox from '@/components/common/ScrollBox';
import Splitter from '@/components/common/Splitter';
import MsCenterPolicyMngCodePopup from '@/components/ms/centerPolicyMng/MsCenterPolicyMngCodePopup';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import dayjs from 'dayjs';
import React from 'react';
import styled from 'styled-components';

interface MsCenterPolicyMngDetailProps {
	gridData?: Array<object>;
	totalCnt?: number;
	dccode?: string;
	search?: any;
}
const MsCenterPolicyMngDetail = forwardRef((props: MsCenterPolicyMngDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	//Antd Form 사용
	const { gridData, totalCnt, dccode, search } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const tableRef = useRef(null);
	const gridRef2 = useRef(null);
	const gridRef3 = useRef(null);
	const refModal = useRef(null);
	const [totalCnt2, setTotalCnt2] = useState(0);
	// 화면 set
	const [items, setItems] = useState([]);
	// 기타설정
	const [isSet, setIsSet] = useState(true);

	// 정책코드리스트
	const [plcycodeList, setPlcycodeList] = useState([]);
	const [selectedCode, setSelectedCode] = useState('');
	// 사용자 권한확인
	const userAuthInfo = useAppSelector(state => state.user.userInfo);

	// 멀티여부
	const [isSlctYn, setIsSlctYn] = useState(false);
	// 멀티여부개수
	const [filteredCount, setFilteredCount] = useState(0);

	// 일반 설명란
	const [plcyDesc, setPlcyDesc] = useState('');

	// 적용여부
	const [applyYn, setApplyYn] = useState(false);
	const [dynamicSwitches, setDynamicSwitches] = useState<{ [key: string]: boolean }>({});
	const [groupSwitches, setGroupSwitches] = useState<{ [key: string]: boolean }>({});

	const commDtlCdLabelFunc = (rowIndex: any, columnIndex: any, value: any, headerText: string, item: any) => {
		if (value == null || String(value) === '0') return '';
	};
	// 유형 옵션
	const useTypeOptions = [
		{ comCd: '', cdNm: '미지정' },
		{ comCd: 'Time', cdNm: 'Time' },
		{ comCd: 'Combo', cdNm: 'Combo' },
	];
	// 그리드 초기화
	const gridCol1 = [
		{
			headerText: '정책',
			dataField: 'plcycode',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('CENTER_PLCY_CD'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return item.rowStatus !== 'I';
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			labelFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				const codeList = getCommonCodeList('CENTER_PLCY_CD') || [];
				const found = codeList.find((codeItem: any) => codeItem.comCd === value);
				if (found) {
					return found.cdNm; // 리스트에 존재하는 코드면 해당 코드명(cdNm)을 표시
				}
				return item.plcyNm || value; // 리스트에 없으면 plcyNm을 표시하고, 둘 다 없으면 기본 value(plcycode) 표시
			},
			required: true,
		},
		// {
		// 	headerText: '정책명',
		// 	dataField: 'plcyNm',
		// 	commRenderer: {
		// 		type: 'dropDown',
		// 		list: getCommonCodeList('CENTER_PLCY_CD'),
		// 		disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
		// 			return item.rowStatus !== 'I';
		// 		},
		// 	},

		// 	styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
		// 		if (item.rowStatus !== 'I') {
		// 			// 편집 가능 class 삭제
		// 			gridRef.current.removeEditClass(columnIndex);
		// 		} else {
		// 			// 편집 가능 class 추가
		// 			return 'isEdit';
		// 		}
		// 	},
		// 	required: true,
		// },
		{
			headerText: '적용여부',
			dataField: 'applyYn',
			dataType: 'code',
			editable: false,
		},
	];
	const gridCol2 = [
		{
			dataField: 'centerType',
			headerText: '센터유형',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'dccode',
			headerText: '물류센터코드',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'dcname',
			headerText: '물류센터명',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'loc',
			headerText: '로케이션',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'whareafloor',
			headerText: '창고층',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'multiLocYn',
			headerText: '멀티적용',
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: 'Y',
				unCheckValue: 'N',
				editable: true,
			},
		},
	];
	const gridCol3 = [
		{
			headerText: '코드',
			dataField: 'commCd',
			required: true,
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				listFunction: function (rowIndex: any, columnIndex: any, item: any, dataField: any) {
					// 마스터 그리드에서 현재 선택된 정책 코드를 가져옵니다. (신규행이거나 없을 경우 item.plcycode 참조)
					const selectedRows = gridRef.current?.getSelectedRows() || [];
					const plcycode = selectedRows.length > 0 ? selectedRows[0].plcycode : item.plcycode;
					const codeList = getCommonCodeList('CENTER_PLCY_CONFIG_CD') || [];
					return codeList.filter((codeItem: any) => codeItem.data4 === plcycode);
				},
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return item.rowStatus !== 'I';
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef3.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			headerText: t('lbl.DETAIL_CODE'), // 상세코드
			dataField: 'commDtlCd',
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				keyField: 'comCd',
				valueField: 'cdNm',
				listFunction: function (rowIndex: any, columnIndex: any, item: any, dataField: any) {
					if (item.commCd) {
						const codeList = getCommonCodeList(item.commCd) || [];
						// 맨 앞에 값이 '0'이고 이름이 빈 문자열인 항목 추가 (공백을 넣어 드롭다운에서 선택 가능하게 처리)
						return [{ comCd: '0', cdNm: '없음' }, ...codeList];
					}
					return [{ comCd: '0', cdNm: '없음' }];
				},
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return item.rowStatus !== 'I';
				},
			},
			// labelFunction: commDtlCdLabelFunc,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef3.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		// {
		// 	headerText: t('lbl.DETAIL_CODE_NAME'), // 상세코드명
		// 	dataField: 'commDtlDescr',
		// 	dataType: 'string',
		// 	styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
		// 		if (item.rowStatus !== 'I') {
		// 			// 편집 가능 class 삭제
		// 			gridRef3.current.removeEditClass(columnIndex);
		// 		} else {
		// 			// 편집 가능 class 추가
		// 			return 'isEdit';
		// 		}
		// 	},
		// },
		{
			headerText: '연관코드',
			dataField: 'refCommCd',
			dataType: 'code',
		},
		{
			headerText: '연관코드명',
			dataField: 'refCommDescr',
			dataType: 'string',
		},
		{
			headerText: '멀티선택여부',
			dataField: 'slctYn',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('YN2'),
			},
		},
		{
			headerText: '유형',
			dataField: 'refCdType',
			commRenderer: {
				type: 'dropDown',
				list: useTypeOptions,
			},
		},
	];
	// 그리드 속성
	const gridProps = {
		editable: true,
		fillColumnSizeMode: true,
		enableFilter: true,
		enableColumnResize: true,
	};
	// 그리드 속성
	const gridProps3 = {
		editable: true,
		fillColumnSizeMode: false,
		enableFilter: true,
		enableColumnResize: true,
		showRowCheckColumn: false, // 기본 체크박스 비활성화 (커스텀 사용 시 권장)
		showCustomRowCheckColumn: true, // 커스텀 체크박스 활성화
	};
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 조회 화면 세팅
	 * @param data	세팅데이터
	 * @param isPop 기타설정추가 팝업여부
	 */
	const setFormData = (data: any, isPop: boolean) => {
		let formData: any[] = [];
		// 화면 set
		setItems(prevItems => {
			// 1. 기존 items를 commCd를 키로 하는 Map으로 변환
			const existingItemsMap = new Map();
			prevItems.forEach(item => {
				existingItemsMap.set(item.commCd + item.commDtlCd, item);
			});
			// 2. 팝업 데이터를 순회하며 Map 업데이트 (덮어쓰기 또는 추가)
			data.forEach((newItem: any) => {
				// commCd가 동일하면 기존 데이터를 newItem으로 '업데이트(덮어쓰기)'
				// 동일하지 않으면 '새 항목으로 추가'
				// 기타설정여부
				if (isPop) {
					// 기존 항목 존재 여부 확인
					const isExisting = existingItemsMap.has(newItem.commCd + newItem.commDtlCd);

					if (isExisting) {
						// 덮어쓰기/업데이트: 기존에 있던 항목이므로 'U' 설정
						newItem.rowStatus = 'U';
					} else {
						// 새 항목 추가: 기존에 없던 항목이므로 'I' 설정
						newItem.rowStatus = 'I';
					}
				}
				existingItemsMap.set(newItem.commCd + newItem.commDtlCd, newItem);
			});
			// 3. Map의 값(Value)만 추출하여 새로운 items State로 반환 (중복 제거 및 업데이트 완료)
			formData = Array.from(existingItemsMap.values());
			return formData;
		});

		// form data set
		// setFieldsValue를 위한 객체 생성
		const fieldsToSet: Record<string, any> = {};

		formData.forEach((item: any, index: number) => {
			fieldsToSet['plcycode' + index] = item.plcycode ?? '';
			fieldsToSet['applyYn' + index] = item.applyYn ?? '';
			fieldsToSet['commCd' + index] = item.commCd ?? '';
			fieldsToSet['commDtlCd' + index] = item.commDtlCd ?? '';
			fieldsToSet['refCommCd' + index] = item.refCommCd ?? '';
			fieldsToSet['refCdType' + index] = item.refCdType ?? '';
			fieldsToSet['slctYn' + index] = item.slctYn ?? '';
			fieldsToSet['rowStatus' + index] = item.rowStatus ?? '';
			fieldsToSet['codedescr' + index] = item.codedescr ?? '';
			// refCnf (Combo/Time) 값 세팅
			const refCnfName = 'refCnf' + index;
			if (item.refCdType === 'Time') {
				const refCnfValue = item.refCnf;
				const isValidTimeFormat =
					item.refCnf && typeof item.refCnf === 'string' && /^\d+$/.test(item.refCnf) && item.refCnf.length <= 4;
				fieldsToSet[refCnfName] = isValidTimeFormat ? dayjs(refCnfValue.padStart(4, '0'), 'HHmm').local() : null;
			} else {
				fieldsToSet[refCnfName] = item.refCnf;
			}
		});
		form.setFieldsValue(fieldsToSet);
		// 멀티여부
		const isSlctYn = formData.some((item: any) => item.slctYn === 'N');
		// 옵션 동시선택 여부 안내 문구 옵션 개수(멀티여부) - 그룹(commCd) 단위로 개수 산정
		const uniqueGroups = new Set(formData.filter((item: any) => item.slctYn === 'N').map((item: any) => item.commCd));
		const filteredCount = uniqueGroups.size;
		// Switch 상태 동기화
		const initialSwitches: Record<string, boolean> = {};
		formData.forEach((item: any, index: number) => {
			initialSwitches['applyYn' + index] = item.applyYn === 'Y';
		});

		setDynamicSwitches(initialSwitches);
		setIsSlctYn(isSlctYn);
		setFilteredCount(filteredCount);
	};

	/**
	 * 기타설정 데이터 조회
	 * @param params 센터정책항목 데이터
	 */
	const searchDetail = (params: any) => {
		//센터정책 항목 선택시 (목록 클릭)
		// 선택행 변경시 초기화(popup에서 데이터 변경시 items 유지)
		setItems([]);
		setApplyYn(params.applyYn === 'Y');
		gridRef3.current?.clearGridData();
		form.resetFields();
		form.setFieldsValue({ applyYn: params.applyYn, plcyDesc: params.plcyDesc }); // 우측 form 일반 항목 데이터 채우는곳
		setPlcyDesc(params.plcyDesc);
		// 멀티로케이션
		if (params.plcycode === 'P01') {
			apiGetLocationList(params).then(res => {
				gridRef2.current.setGridData(res.data);
			});
		}
		apiGetDetailList(params).then(res => {
			if (res.data.length === 0) {
				setIsSet(false);
			} else {
				setIsSet(true);
				setFormData(res.data, false);
				// 왼쪽하단 그리드 데이터 세팅
				gridRef3.current?.setGridData(res.data);
				setTotalCnt2(res.data.length);
				if (res.data.length > 0) {
					// 칼럼 사이즈 자동 조절
					const colSizeList = gridRef3.current?.getFitColumnSizeList(true);
					gridRef3.current?.setColumnSizeList(colSizeList);
				}
			}
		});
	};

	/**
	 * 저장시 form데이터 정제(배열로)
	 * @returns {savedItems} 저장데이터
	 */
	const getSaveFormData = () => {
		const params = gridRef.current.getSelectedRows()[0];
		const formData = form.getFieldsValue(true);
		const savedItems: any[] = [];
		let index = 0;
		// formData에 commCd0, commCd1, ... 이 있는 동안 반복
		while (formData['commCd' + index] !== undefined) {
			const isRowStatus = form.getFieldValue('rowStatus' + index);
			const refCnfValue = formData['refCnf' + index];
			const formItems: any = {
				dccode: params.dccode,
				plcycode: params.plcycode,

				commCd: formData['commCd' + index],
				commDtlCd: formData['commDtlCd' + index],
				refCommCd: formData['refCommCd' + index],
				applyYn: formData['applyYn' + index],
				refCdType: formData['refCdType' + index],
				slctYn: formData['slctYn' + index],
				codedescr: formData['codedescr' + index],
				// Time Picker (dayjs 객체)일 경우 문자열로 변환
				refCnf: dayjs.isDayjs(refCnfValue) ? refCnfValue.format('HHmm') : refCnfValue,
			};
			if (isRowStatus) {
				formItems.rowStatus = formData['plcycode' + index] === params.plcycode ? 'U' : 'I';
			}
			savedItems.push(formItems);
			index++;
		}
		return savedItems;
	};

	/**
	 * 저장시 수정여부 확인
	 * @returns {isCheck} 수정여부
	 */
	const isChangedCheck = () => {
		const params = gridRef.current.getSelectedRows()[0];
		const isRowStatus = form.getFieldValue('rowStatus');
		let isCheck;

		if (gridRef2.current) {
			const locationParams = gridRef2.current.getChangedData({ validationYn: false });
			isCheck = !params.rowStatus && !isRowStatus && locationParams.length === 0;
		} else {
			isCheck = !params.rowStatus && !isRowStatus;
		}
		if (gridRef3.current) {
			const detailParams = gridRef3.current.getChangedData({ validationYn: false });
			if (detailParams.length > 0) isCheck = false;
		}
		return isCheck;
	};

	/**
	 * 저장 - 왼쪽그리드
	 */
	const saveData = () => {
		const params = gridRef.current.getChangedData();
		// 변경 데이터 확인
		if (params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// 필수값(정책) 누락 확인
		const isInvalid = params.some((item: any) => !item.plcycode || String(item.plcycode).trim() === '');
		if (isInvalid) {
			showAlert(null, '정책은 필수 입력입니다.');
			return;
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			apiPostSaveMasterList(params).then(res => {
				if (res?.data.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
					search();
				}
			});
		});
	};
	/** 저장3 -> 왼쪽하단그리드*/
	const saveData3 = () => {
		// 상단 마스터 그리드에서 선택된 행 가져오기
		const selectedMasterRow = gridRef.current?.getSelectedRows()[0];
		const params = gridRef3.current.getChangedData({ validationYn: false });

		// 변경 데이터 확인
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (!gridRef3.current.validateRequiredGridData()) return;

		// 정합성 체크: 동일한 commCd 그룹 내에서는 slctYn 값이 모두 같아야 함
		const allGridData = gridRef3.current.getGridData();
		const slctYnMap = new Map<string, string>();
		const dtlCdMap = new Map<string, { hasValue: boolean; hasZero: boolean }>();
		const configCodeList = getCommonCodeList('CENTER_PLCY_CONFIG_CD') || [];

		for (const item of allGridData) {
			if (!item.commCd) continue;

			if (slctYnMap.has(item.commCd)) {
				if (slctYnMap.get(item.commCd) !== item.slctYn) {
					// 공통코드 목록에서 코드명(cdNm) 찾기 (없으면 원래 코드값 표시)
					const foundCode = configCodeList.find((c: any) => String(c.comCd) === String(item.commCd));
					const codeLabel = foundCode ? foundCode.cdNm : item.commCd;

					showMessage({
						content: `코드 [${codeLabel}] 그룹 내의 멀티선택여부가 동일해야 합니다.`,
						modalType: 'info',
					});
					return;
				}
			} else {
				slctYnMap.set(item.commCd, item.slctYn);
			}

			// 상세코드 정합성 체크: 동일 commCd 내에서 값이 있는 상세코드와 '0'이 혼재하는지 확인
			let dtlState = dtlCdMap.get(item.commCd);
			if (!dtlState) {
				dtlState = { hasValue: false, hasZero: false };
				dtlCdMap.set(item.commCd, dtlState);
			}

			const dtlCd = String(item.commDtlCd || '').trim();
			if (dtlCd === '0') {
				dtlState.hasZero = true;
			} else if (dtlCd !== '') {
				dtlState.hasValue = true;
			}

			if (dtlState.hasValue && dtlState.hasZero) {
				const foundCode = configCodeList.find((c: any) => String(c.comCd) === String(item.commCd));
				const codeLabel = foundCode ? foundCode.cdNm : item.commCd;
				showMessage({
					content: `코드 [${codeLabel}] 그룹은 상세코드 값이 있는 항목과 '없음' 항목이 함께 존재할 수 없습니다.`,
					modalType: 'info',
				});
				return;
			}
		}

		// 변경된 하단 그리드 데이터에 상단의 plcycode 일괄 주입
		const finalParams = params.map((item: any) => ({
			...item,
			plcycode: selectedMasterRow.plcycode,
			dccode: selectedMasterRow.dccode || dccode, // 물류센터 코드도 함께 주입
			commDtlCd: item.commDtlCd && String(item.commDtlCd).trim() !== '' ? item.commDtlCd : '0', // 상세코드 notnull 제외될 예정이라 추후 삭제
		}));

		// 서버에서 요구하는 형태(detailList)로 파라미터 구성
		const requestParams = {
			...selectedMasterRow,
			detailList: finalParams,
		};

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			apiPostSaveMasterList3(requestParams).then(res => {
				if (res?.data.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
					searchDetail(selectedMasterRow);
				}
			});
		});
	};
	/**
	 * 저장
	 */
	const saveData2 = () => {
		// ----------센터정책항목 MAIN 그리드----------
		const params = gridRef.current.getSelectedRows()[0];
		const isFormStatus = form.getFieldValue('rowStatus');
		const isChanged = isChangedCheck();
		// 변경 데이터 확인
		if (isChanged) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// validation
		if (!params.plcyNm) {
			showAlert(null, '정책명은(는) 필수값입니다.');
			return;
		}
		params.plcyDesc = form.getFieldValue('plcyDesc') || '정책에 대한 설명을 입력하세요.';
		params.applyYn = form.getFieldValue('applyYn') || 'N';

		if (isFormStatus) {
			// ----------기타 설정----------
			const savedItems = getSaveFormData();

			// 단일 선택(slctYn === 'N')이 걸린 고유 그룹(commCd) 개수 파악
			const restrictedGroups = new Set(savedItems.filter(item => item.slctYn === 'N').map(item => item.commCd));
			const totalRestrictedGroupCount = restrictedGroups.size;

			// 단일 선택 제한 대상 중 실제로 켜져 있는(applyYn === 'Y') 고유 그룹 개수 파악
			const activeRestrictedGroups = new Set(
				savedItems.filter(item => item.slctYn === 'N' && item.applyYn === 'Y').map(item => item.commCd),
			);
			const activeRestrictedGroupCount = activeRestrictedGroups.size;

			// 오류 처리: 단일 선택 조건의 대상 그룹이 2개 이상이면서, 실제로 켜진 제한 그룹도 2개 이상일 때
			if (totalRestrictedGroupCount > 1 && activeRestrictedGroupCount > 1) {
				showMessage({
					content: totalRestrictedGroupCount + '가지 옵션은 동시 선택을 할 수 없으며 택 1 입니다.',
					modalType: 'info',
				});
				return;
			}

			if (savedItems && savedItems.length > 0) {
				// 1. refCnf 값들만 뽑아서 배열 생성
				const refCnfList = savedItems
					.map(item => item?.refCnf)
					.filter(val => val !== undefined && val !== null && val !== ''); // 유효한 값만 필터링

				// 2. 유효한 값이 있을 때만 중복 체크 실행
				if (refCnfList.length > 0) {
					const hasDuplicate = new Set(refCnfList).size !== refCnfList.length;

					if (hasDuplicate) {
						showMessage({
							content: '중복된 우선순위 입니다.',
							modalType: 'info',
						});
						return;
					}
				}
			}

			// ----------저장 PARAMS SET----------
			params.detailList = savedItems;
		}
		// ----------멀티로케이션----------
		if (gridRef2.current) {
			params.locationList = gridRef2.current.getChangedData();
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			apiPostSaveMasterList2(params).then(res => {
				// showMessage({
				// 	content: t('msg.MSG_COM_SUC_003'),
				// 	modalType: 'info',
				// });
				// search();
				if (res?.data.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
					search();
				}
			});
		});
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				isActionEvent: false,
				callBackFn: () => {
					if (gridRef.current?.getAddedRowItems()?.length > 0) {
						showAlert(null, t('msg.MSG_COM_ERR_054')); // 이미 신규 입력 중입니다.
					} else {
						const initVal = {
							rowStatus: 'I',
							applyYn: 'N',
							plcycode: '',
						};
						gridRef.current.addRow(initVal, 'last');
					}
				},
			},
			{
				btnType: 'delete', // 행삭제
				isActionEvent: false,
				callBackFn: () => {
					const selectedRow = gridRef.current.getSelectedRows()[0];
					if (selectedRow.rowStatus === 'I') {
						gridRef.current.removeRow('selectedIndex');
					} else {
						showMessage({
							content: t('msg.MSG_COM_VAL_045'),
							modalType: 'info',
						});
					}
				},
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveData,
			},
		],
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn3: GridBtnPropsType = {
		tGridRef: gridRef3, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					rowStatus: 'I',
					applyslctYn: 'N',
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveData3,
			},
		],
	};

	// 표 버튼 설정
	const tableBtn: TableBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveData2,
			},
		],
	};

	let prevRowIndex: any = null;
	const initEvent = () => {
		// 에디팅 시작 이벤트 바인딩
		gridRef.current.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRef.current.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField === 'plcyNm') {
				return gridRef.current.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});

		/**
		 * 그리드 셀 선택전에 실행
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionConstraint', function (event: any) {
			const { toRowIndex } = event;
			const isChanged = isChangedCheck();
			if (!isChanged) {
				// selectionConstraint에서는 즉시 false를 반환하여 선택을 일단 막음
				// 그 후 별도의 함수에서 confirm을 띄우고 수동으로 선택 처리
				handleBlockedSelection(toRowIndex);
				return false;
			}
		});

		// selectionConstraint에서 호출될 함수
		const handleBlockedSelection = (rowIndex: any) => {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				gridRef?.current.setSelectionByIndex(rowIndex);
			});
		};

		// 행변경시
		gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell.item?._$uid;

			const params = event.primeCell.item;
			searchDetail(params);
		});

		// gridRef3 (세부항목 그리드) 에디팅 종료 이벤트 바인딩
		gridRef3.current?.bind('cellEditEnd', function (event: any) {
			if (event.dataField === 'commCd') {
				if (event.oldValue !== event.value) {
					gridRef3.current?.updateRow({ commDtlCd: '' }, event.rowIndex);
				}
			}
		});
	};

	/**
	 * 항목 추가 및 일반 설정 수정
	 */
	const setMainRowStatus = () => {
		const params = gridRef.current.getSelectedRows()[0];
		if (params.plcycode) {
			params.rowStatus = 'U';
		} else {
			params.rowStatus = 'I';
		}
		gridRef.current.updateRow(params, 'selectedIndex');
	};

	/**
	 * 기타 설정 수정
	 */
	const setFormRowStatus = () => {
		const params = gridRef.current.getSelectedRows()[0];
		if (params.plcycode) {
			form.setFieldValue('rowStatus', 'U');
		} else {
			form.setFieldValue('rowStatus', 'I');
		}
	};

	/**
	 * 데이터 변경 체크
	 * @param changedValues
	 * @param values
	 */
	const onValuesChange = (changedValues: any, values: any) => {
		const value = Object.keys(changedValues)[0];
		if (value === 'plcyDesc') {
			setMainRowStatus();
		} else {
			let index;
			// 'refCnf'+index index 추출
			if (value.startsWith('refCnf')) {
				index = value.slice(6);
			} else if (value.startsWith('codedescr')) {
				index = value.slice(9);
			}
			form.setFieldValue('rowStatus' + index, 'U');
			setFormRowStatus();
		}
	};

	/**
	 * 센터정책설정 일반 적용여부 스위치 // 우측 적용여부 스위치 -> 왼쪽 그리드 적용여부 값을 바꿔줌
	 * @param checked
	 * @param name
	 */
	const handleSwitchChange = (checked: any, name: string) => {
		setMainRowStatus();
		form.setFieldValue(name, checked ? 'Y' : 'N');
		const params = gridRef.current.getSelectedRows()[0];
		params.applyYn = checked ? 'Y' : 'N';
		gridRef.current.updateRow(params, 'selectedIndex');
		setApplyYn(checked);
	};

	/**
	 * 센터정책설정 기타설정 적용여부 스위치
	 * @param checked
	 * @param itemKey
	 * @param index
	 */
	const handleDynamicSwitchChange = (checked: boolean, itemKey: string, index: number) => {
		setFormRowStatus();
		// 하위 스위치는 멀티선택여부(slctYn)와 무관하게 개별적으로 끄고 켤 수 있음
		form.setFieldValue(itemKey, checked ? 'Y' : 'N');
		form.setFieldValue('rowStatus' + index, 'U');
		setDynamicSwitches(prevStates => ({
			...prevStates,
			[itemKey]: checked,
		}));
	};

	/**
	 * 센터정책설정 그룹 적용여부 스위치 (헤더 스위치)
	 * @param checked
	 * @param commCd
	 */
	const handleGroupSwitchChange = (checked: boolean, commCd: string) => {
		setFormRowStatus();

		const formData = form.getFieldsValue();
		const targetGroupItems = items.filter((item: any) => item.commCd === commCd);
		// 해당 그룹의 멀티선택여부(slctYn) 파악 (그룹 내 요소들의 slctYn은 동일함)
		const targetSlctYn = targetGroupItems.length > 0 ? targetGroupItems[0].slctYn : 'Y';

		const updatedGroupSwitches = { ...groupSwitches, [commCd]: checked };
		const updatedDynamicSwitches = { ...dynamicSwitches };

		if (checked) {
			// 그룹 스위치를 켤 때, 이 그룹이 'N'(단일 선택) 조건이라면
			if (targetSlctYn === 'N') {
				// 다른 'N' 조건의 그룹들을 찾아서 모두 끎
				const otherSingleGroups = new Set<string>();
				items.forEach((item: any) => {
					if (item.commCd !== commCd && item.slctYn === 'N') {
						otherSingleGroups.add(item.commCd);
					}
				});

				otherSingleGroups.forEach(otherCd => {
					if (updatedGroupSwitches[otherCd]) {
						updatedGroupSwitches[otherCd] = false;
						// 다른 그룹이 꺼지므로, 그 하위 아이템들도 모두 N(OFF) 처리
						items.forEach((item: any, idx: number) => {
							if (item.commCd === otherCd) {
								const currentItemKey = 'applyYn' + idx;
								form.setFieldValue(currentItemKey, 'N');
								form.setFieldValue('rowStatus' + idx, 'U');
								updatedDynamicSwitches[currentItemKey] = false;
							}
						});
					}
				});
			}

			// 그룹 스위치가 켜질 때, 하위 항목 중 스위치 버튼이 없는 'Time' 타입이거나 하위 항목이 1개뿐인 경우 자동으로 'Y' 처리
			targetGroupItems.forEach((item: any) => {
				if (item.refCdType === 'Time' || targetGroupItems.length === 1) {
					const idx = items.indexOf(item);
					const itemKey = 'applyYn' + idx;
					form.setFieldValue(itemKey, 'Y');
					form.setFieldValue('rowStatus' + idx, 'U');
					updatedDynamicSwitches[itemKey] = true;
				}
			});
		} else {
			// 그룹 스위치가 꺼지면 해당 그룹의 하위 항목들도 모두 N으로 변경
			targetGroupItems.forEach((item: any) => {
				const idx = items.indexOf(item);
				const itemKey = 'applyYn' + idx;
				if (formData[itemKey] === 'Y' || updatedDynamicSwitches[itemKey]) {
					form.setFieldValue(itemKey, 'N');
					form.setFieldValue('rowStatus' + idx, 'U');
					updatedDynamicSwitches[itemKey] = false;
				}
			});
		}

		setGroupSwitches(updatedGroupSwitches);
		setDynamicSwitches(updatedDynamicSwitches);
	};

	/**
	 * 화면 렌더링
	 * @param item
	 * @param index
	 * @returns 렌더링 될 화면
	 */
	const renderOptionInputs = (item: any, index: number) => {
		if (item.refCdType === 'Combo') {
			return (
				<SelectBox
					name={'refCnf' + index}
					initval={item.refCnf}
					span={24}
					options={getCommonCodeList(item.refCommCd)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					style={{ minWidth: '80px' }}
				/>
			);
		} else if (item.refCdType === 'Time') {
			return (
				<Form.Item name={'refCnf' + index}>
					<DatePicker
						format="HH:mm"
						picker="time"
						placeholder={'시간 선택'}
						allowClear
						showNow={false}
						onChange={onValuesChange}
					/>
				</Form.Item>
			);
		}

		// 'Combo'나 'Time'이 아니면 null 반환
		return null;
	};

	/**
	 * 화면 렌더링
	 * @param items
	 * @returns 화면
	 */
	const renderOptionItems = (items: any) => {
		if (!items || items.length === 0) {
			return null; // 데이터가 없으면 아무것도 렌더링하지 않음
		}
		// commCd의 횟수를 세고, 고유 개수 확인
		const commCdCounts = new Map<string, number>();
		for (const item of items) {
			commCdCounts.set(item.commCd, (commCdCounts.get(item.commCd) || 0) + 1);
		}

		// map 루프 시작
		return items.map((item: any, index: number, array: any) => {
			// 이전 항목의 commCd를 가져옴
			const prevItemCommCd = index > 0 ? array[index - 1].commCd : undefined;
			// commCd가 변경되었는지 확인하여 헤더 렌더링 여부 결정
			const shouldRenderHeader = item.commCd !== prevItemCommCd;
			const itemKey = 'applyYn' + index;
			return (
				<React.Fragment key={`${item.commCd}` + `${item.commDtlCd}` + index}>
					<div>
						{/* 조건 충족 시에만 섹션 헤더 출력 */}
						{shouldRenderHeader && (
							<>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										marginBottom: '8px',
									}}
								>
									<p className="txt" style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
										{item.commDescr}
									</p>
									<Switch
										checked={groupSwitches[item.commCd] || false}
										onChange={checked => handleGroupSwitchChange(checked, item.commCd)}
									/>
								</div>
								{/* <p className="txt fc-blue">{item.codedescr || '정의 및 영향도 BPO 작성'}</p> */}
								<Form.Item name={'codedescr' + index} initialValue={item.codedescr ?? ''}>
									<InputText
										maxLength={200}
										placeholder="정의 및 영향도 BPO 작성 (200자내)"
										style={{ border: item.codedescr?.length > 0 ? 'none' : '1px solid #ccc' }}
										readOnly={!userAuthInfo.roles?.includes('00') && !userAuthInfo.roles?.includes('000')}
									/>
								</Form.Item>
							</>
						)}
						{String(item.commDtlCd) !== '0' && (
							<dl>
								<dt>{item.commDtlDescr}</dt>
								<dd>
									{renderOptionInputs(item, index)}
									{item.commCd !== 'MLTILCTN_APLY' &&
										item.refCdType !== 'Time' &&
										commCdCounts.get(item.commCd) !== 1 && (
											<Switch
												checked={dynamicSwitches[itemKey] || false}
												onChange={checked => handleDynamicSwitchChange(checked, itemKey, index)}
												disabled={!groupSwitches[item.commCd]}
											/>
										)}
								</dd>
							</dl>
						)}
						{item.commCd === 'MLTILCTN_APLY' && (
							<div className="mt20">
								<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps} />
							</div>
						)}
					</div>
					<Form.Item name={'plcycode' + index} initialValue={item.plcycode ?? ''} hidden>
						<Input />
					</Form.Item>
					<Form.Item name={'applyYn' + index} initialValue={item.applyYn ?? ''} hidden>
						<Input />
					</Form.Item>
					<Form.Item name={'commCd' + index} initialValue={item.commCd ?? ''} hidden>
						<Input />
					</Form.Item>
					<Form.Item name={'commDtlCd' + index} initialValue={item.commDtlCd ?? ''} hidden>
						<Input />
					</Form.Item>
					<Form.Item name={'refCdType' + index} initialValue={item.refCdType ?? ''} hidden>
						<Input />
					</Form.Item>
					<Form.Item name={'slctYn' + index} initialValue={item.slctYn ?? ''} hidden>
						<Input />
					</Form.Item>
					<Form.Item name={'refCommCd' + index} initialValue={item.refCommCd ?? ''} hidden>
						<Input />
					</Form.Item>
					<Form.Item name={'rowStatus' + index} hidden>
						<Input />
					</Form.Item>
				</React.Fragment>
			);
		});
	};

	/**
	 * 기타설정추가 팝업 호출
	 */
	const openPopup = () => {
		const selectedCode = gridRef.current.getSelectedRows()[0].plcycode;
		setSelectedCode(selectedCode);
		refModal.current?.handlerOpen();
	};

	/**
	 * 기타설정추가 콜백 (저장 후 부모 화면 조회 시뮬레이션)
	 * @param popData 팝업에서 조회해온 데이터
	 */
	const handleUserCodeCallback = (popData: any) => {
		if (popData) {
			setIsSet(true);
			setFormData(popData, true);
			setFormRowStatus();
		}
		handleClosePopup();
	};

	/**
	 * 팝업 종료
	 */
	const handleClosePopup = () => {
		refModal.current?.handlerClose();
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 에디팅 시작 이벤트
	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridData.length > 0) {
			const plcycodeList = gridData.map((item: any) => {
				return { plcycode: item.plcycode };
			});
			setPlcycodeList(plcycodeList);
			gridRef.current?.setGridData(gridData);
			gridRef.current?.setSelectionByIndex(0, 0);
			if (gridData.length > 0) {
				const colSizeList = gridRef.current.getFitColumnSizeList(true);
				gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	// 멀티선택여부에 따른 버튼동작
	useEffect(() => {
		const initialSwitches: Record<string, boolean> = {};
		const initialGroupSwitches: Record<string, boolean> = {};
		items.forEach((item: any, index: number) => {
			initialSwitches['applyYn' + index] = item.applyYn === 'Y';
			if (item.applyYn === 'Y') {
				initialGroupSwitches[item.commCd] = true; // 그룹 내 하나라도 켜져 있으면 그룹 스위치도 활성화 상태로 렌더링
			}
		});
		items.forEach((item: any) => {
			if (initialGroupSwitches[item.commCd] === undefined) {
				initialGroupSwitches[item.commCd] = false;
			}
		});
		setDynamicSwitches(initialSwitches);
		setGroupSwitches(initialGroupSwitches);
	}, [items]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		tableRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<Splitter
						key="msCenterPolicyMng-right-splitter"
						direction="vertical"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<>
								<AGrid>
									<GridTopBtn gridTitle={'센터정책 항목'} gridBtn={gridBtn} totalCnt={totalCnt} />
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={gridRef} columnLayout={gridCol1} gridProps={gridProps} />
								</GridAutoHeight>
							</>,
							<>
								<AGrid>
									<GridTopBtn gridTitle={'센터정책 세부항목'} gridBtn={gridBtn3} totalCnt={totalCnt2} />
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={gridRef3} columnLayout={gridCol3} gridProps={gridProps3} />
								</GridAutoHeight>
							</>,
						]}
					/>,
					<AGrid key="msCenterPolicyMng-form" className="form-inner">
						<CustomForm form={form} ref={tableRef} onValuesChange={onValuesChange}>
							<TableTopBtn tableTitle={'센터정책 설정'} tableBtn={tableBtn} className="fix-title">
								<Button onClick={openPopup}>기타설정추가-제거예정</Button>
							</TableTopBtn>
							<Form.Item name="rowStatus" hidden>
								<Input />
							</Form.Item>
							<Form.Item name="applyYn" hidden>
								<Input />
							</Form.Item>
							<ScrollBox>
								<div>
									{/* 일반 */}
									<div className="opt-setting-wrap">
										<h4>일반</h4>
										<div className="cell">
											<dl>
												<dt>적용여부</dt>
												<dd>
													<Switch checked={applyYn} onChange={checked => handleSwitchChange(checked, 'applyYn')} />
												</dd>
											</dl>

											<InputText
												name="plcyDesc"
												maxLength={200}
												placeholder="정의 및 영향도 BPO 작성 (200자내)"
												style={{ border: plcyDesc?.length > 0 ? 'none' : '1px solid #ccc' }}
												readOnly={!userAuthInfo.roles?.includes('00') && !userAuthInfo.roles?.includes('000')}
											/>
										</div>
									</div>

									{/* 설정 */}
									{isSet && (
										<div className="opt-setting-wrap">
											<h4>기타 설정</h4>
											<div className="cell">
												{isSlctYn && filteredCount > 1 && (
													<p className="fc-red">
														{/* items의 개수를 동적으로 표시 */}
														{filteredCount}가지 옵션은 동시 선택을 할 수 없으며 택 1 입니다.
													</p>
												)}
												{renderOptionItems(items)}
											</div>
										</div>
									)}
								</div>
							</ScrollBox>
						</CustomForm>
					</AGrid>,
				]}
			/>

			<CustomModal ref={refModal} width="1280px">
				<MsCenterPolicyMngCodePopup
					dccode={dccode}
					plcycodeList={plcycodeList}
					selectedCode={selectedCode}
					callBack={handleUserCodeCallback}
					close={handleClosePopup}
				/>
			</CustomModal>
		</>
	);
});

export default MsCenterPolicyMngDetail;

const CustomForm = styled(Form)`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
`;
