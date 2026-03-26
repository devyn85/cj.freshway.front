/*
 ############################################################################
 # FiledataField	: CmGMultiDccodeSelectBox.tsx
 # Description		: 권한에 따른 물류센터 SelectBox
 # Author			: JangGwangSeok
 # Since			: 25.06.09
                25.09.03 sss 전체 기능 추가
 ############################################################################
*/

// Components
import { SelectBox } from '@/components/common/custom/form';
import { Form } from 'antd';
import _ from 'lodash';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppDispatch, useAppSelector } from '@/store/core/coreHook';
import { setGlobalVariable } from '@/store/core/globalStore';
import {
	dccodeIncludePriorityCenterList,
	getUserAreaList,
	getUserDccodeList,
	getUserOrganizeList,
	getUserStorerkeyList,
} from '@/store/core/userStore';
// 상수 정의
const DC_CODES = {
	ALL_CENTER: '0000',
	FW_CENTER: '0001',
	FO_CENTER: '0002',
} as const;

/**
 * 권한에 따른 물류센터 SelectBox
 * @description 권한에 따른 물류센터 SelectBox 로 Multiple & Single 모두 사용 가능
 * @param props
 * @param {string} props.mode 모드 (multiple, single) // default: single
 * @param {string} props.dataType DATA 타입 (ALL, USER, ADMIN) // default: ALL
 * @param {string} props.name 필드명 // default: gMultiDccode
 * @returns
 */
const CmGMultiDccodeSelectBoxNew = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// props 선언 및 초기화
	const { name = 'gMultiDccode', dataType = 'ALL', mode = 'single', allLabel = '', customOptions = [] } = props;
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const location = useLocation();

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);
	const form = Form.useFormInstance?.();
	const initValRef = useRef(''); // 물류센터 초기값

	const isSingleMode = mode === 'single';

	// Arrow 버튼과 Clear 버튼 노출여부
	const [showArrowState, setShowArrowState] = useState(true);
	const [isInit, setIsInit] = useState(false);

	/**
	 * 물류센터 코드 리스트
	 */
	const allCommonCodeList = getCommonCodeList('WMS_MNG_DC') ?? [];

	/**
	 * 사용자 권한에 따른 물류센터 코드 리스트
	 */
	const userDccodeList = getUserDccodeList(isSingleMode ? '' : dataType);

	/**
	 * 사용자 권한에 해당하는 물류센터 코드들로 필터링 처리
	 */
	const filteredCommonCodeList = allCommonCodeList.filter(v =>
		userDccodeList.some(userDccode => userDccode.dccode === v.comCd),
	);

	const filteredCommonCodeListComCdExcludeParentCode = filteredCommonCodeList?.map(v => v.comCd);

	/**
	 * 우선순위 센터 제외 센터 코드 리스트
	 * @description filter 처리한 dccodeIncludePriorityCenterList 함수 참고
	 */
	const filteredCommonCodeListExcludeChildPriorityCenter = filteredCommonCodeList?.filter(
		v => !dccodeIncludePriorityCenterList.includes(v.comCd),
	);
	const filteredCommonCodeListFW00 = filteredCommonCodeListExcludeChildPriorityCenter
		?.filter(v => v['convcode'] === '0')
		.map(v => v.comCd);
	const filteredCommonCodeListFO00 = filteredCommonCodeListExcludeChildPriorityCenter
		?.filter(v => v['convcode'] === '1')
		.map(v => v.comCd);

	/**
	 * 이전 선택된 물류센터 코드 리스트
	 * @description 이전 선택된 물류센터 코드 리스트를 저장하여 멀티 선택 처리 시 신규 선택, 제거된 옵션을 확인하기 위함
	 */
	const [preSelectedValueList, setPreSelectedValueList] = useState<string[]>([]);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 센터 타입별 하위 코드 매핑
	 * @param parentCenterCode 상위 센터 코드
	 * @returns 하위 코드 리스트
	 */
	const getChildrenCodeListByParentCenter = (parentCenterCode: string) => {
		switch (parentCenterCode) {
			case DC_CODES.ALL_CENTER:
				return filteredCommonCodeListComCdExcludeParentCode;
			case DC_CODES.FW_CENTER:
				return filteredCommonCodeListFW00;
			case DC_CODES.FO_CENTER:
				return filteredCommonCodeListFO00;
			default:
				return [];
		}
	};

	/**
	 * 상위 센터가 모두 선택되었는지 확인
	 * @param parentCenterCode 상위 센터 코드
	 * @param formValueList 폼 값 리스트
	 * @returns 상위 센터가 모두 선택되었는지 여부
	 */
	const isSelectedAllChildrenCodeList = (parentCenterCode: string, formValueList: string[]) => {
		const childrenCodeList = getChildrenCodeListByParentCenter(parentCenterCode);
		return (
			childrenCodeList.length > 0 && _.intersection(formValueList, childrenCodeList).length === childrenCodeList.length
		);
	};

	/**
	 * 상위 센터 추가/제거 처리
	 * @param parentCenterCode 상위 센터 코드
	 * @param formValueList 폼 값 리스트
	 * @returns 상위 센터 추가/제거 처리 후 폼 값 리스트
	 */
	const applyParentCenterByChildrenCenter = (parentCenterCode: string, formValueList: string[]) => {
		if (isSelectedAllChildrenCodeList(parentCenterCode, formValueList)) {
			return [...formValueList, parentCenterCode];
		} else {
			return formValueList.filter(code => code !== parentCenterCode);
		}
	};

	/**
	 * 모든 상위 센터 제거
	 * @param formValueList 폼 값 리스트
	 * @description 모든 상위 센터 제거, API 요청 시 상위 센터 코드 전송 방지를 위함, 단지 UI 처리를 위함
	 */
	const removeAllParentCenter = (formValueList: string[]) => {
		return formValueList.filter(
			code => code !== DC_CODES.ALL_CENTER && code !== DC_CODES.FW_CENTER && code !== DC_CODES.FO_CENTER,
		);
	};

	/**
	 * 모든 상위 센터 제거 2
	 * @param {any[]} formValueList 폼 값 리스트
	 * @description 모든 상위 센터 제거, API 요청 시 상위 센터 코드 전송 방지를 위함, 단지 UI 처리를 위함
	 * @returns {any} 상위 센터 제거된 목록
	 */
	const removeAllParentCenter2 = (formValueList: any[]): any => {
		return formValueList.filter(
			(list: any) =>
				list.value !== DC_CODES.ALL_CENTER && list.value !== DC_CODES.FW_CENTER && list.value !== DC_CODES.FO_CENTER,
		);
	};

	/**
	 * 멀티 선택 처리
	 * @param selectedValueList 선택된 물류센터 코드 리스트
	 * @returns 처리된 물류센터 코드 리스트
	 */
	const handleMultiSelection = (selectedValueList: string[]) => {
		const addedDccode: string[] = selectedValueList?.filter((v: string) => !preSelectedValueList?.includes(v));
		const removedDccode: string[] = preSelectedValueList?.filter((v: string) => !selectedValueList.includes(v));

		let formSetValue: string[] = [];

		if (addedDccode.length > 0) {
			// 추가
			if (addedDccode.includes(DC_CODES.ALL_CENTER)) {
				// 전체센터 추가
				formSetValue = [...selectedValueList, ...filteredCommonCodeListComCdExcludeParentCode];
			} else if (addedDccode.includes(DC_CODES.FW_CENTER)) {
				// FW 센터 추가
				formSetValue = [...selectedValueList, ...filteredCommonCodeListFW00];
			} else if (addedDccode.includes(DC_CODES.FO_CENTER)) {
				// FO 센터 추가
				formSetValue = [...selectedValueList, ...filteredCommonCodeListFO00];
			} else {
				// 하위 코드 추가
				formSetValue = [...selectedValueList];
			}
		} else if (removedDccode.length > 0) {
			// 제거
			if (removedDccode.includes(DC_CODES.ALL_CENTER)) {
				// 전체센터 제거
				formSetValue = [];
			} else if (removedDccode.includes(DC_CODES.FW_CENTER)) {
				// FW 센터 제거
				formSetValue = selectedValueList.filter((v: string) => !filteredCommonCodeListFW00.includes(v));
			} else if (removedDccode.includes(DC_CODES.FO_CENTER)) {
				// FO 센터 제거
				formSetValue = selectedValueList.filter((v: string) => !filteredCommonCodeListFO00.includes(v));
			} else {
				// 하위 코드 제거
				formSetValue = selectedValueList;
			}
		} else {
			// 변경 없음
		}

		// 중복 제거
		const uniqueFormSetValue = [...new Set(formSetValue)];

		let formSetValueAppliedParentCenter = [...uniqueFormSetValue];

		// 각 센터 타입별로 상위 센터 추가/제거 처리
		Object.values(DC_CODES).forEach((parentCenterCode: string) => {
			formSetValueAppliedParentCenter = applyParentCenterByChildrenCenter(
				parentCenterCode,
				formSetValueAppliedParentCenter,
			);
		});

		// 중복 제거
		const finalFormSetValue = [...new Set(formSetValueAppliedParentCenter)];

		setPreSelectedValueList(finalFormSetValue);
		form.setFieldValue(name, finalFormSetValue);

		return finalFormSetValue;
	};

	useEffect(() => {
		if (commUtil.isNotEmpty(globalVariable.gDccode)) {
			setPreSelectedValueList([globalVariable.gDccode]);
		} else {
			setPreSelectedValueList(null);
			form.setFieldValue(name, null);
		}
	}, [globalVariable.gDccode]);

	// Form validateFields() 오류 보완
	useEffect(() => {
		if (props?.mode === 'multiple' && props?.rules && props?.rules?.length > 0) {
			if (commUtil.isNotEmpty(props.rules[0]['validateTrigger'])) {
				props.rules[0]['type'] = 'array';
			}
		}
	}, [props]);

	useEffect(() => {
		// 초기값 설정
		if (commUtil.isNotEmpty(props.initval)) {
			preOnChange(props.initval);
		}
		setTimeout(() => {
			setIsInit(true);
		}, 100);
	}, []);

	useEffect(() => {
		// 업무화면 변환시 업무화면에 선택된 "물류센터" 값으로 초기화
		// 다른 업무화면에서 "물류센터" 다른 값 선택하면 기존 화면들도 마지막에 선택된 "물류센터" 값으로 변경되는 이슈 해결
		if (isInit) {
			// 최초 업무화면 진입시 "물류센터" 빈값 설정 방지 위해 isInit 변수 추가
			const value = form.getFieldValue(name);
			if (Array.isArray(value)) {
				// 상위 센터 제거
				const filteredMultiSelectedValueList = removeAllParentCenter(value);

				// 글로벌 멀티 센터코드 값 설정
				dispatch(setGlobalVariable({ gMultiDccode: filteredMultiSelectedValueList?.join() }));
			} else {
				preOnChange(value);
			}
		}
	}, [location]);

	// onChange 이벤트 선 처리
	const preOnChange = (value: any) => {
		// Arrow 버튼과 Clear 버튼 노출여부 설정
		setShowArrowState(commUtil.isEmpty(value));

		const globalVar: any = {
			gMultiDccode: value,
		};

		// 멀티 선택일 경우
		if (value instanceof Array) {
			// 멀티 선택 처리
			const multiSelectedValueList = handleMultiSelection(value);

			// 상위 센터 제거
			const filteredMultiSelectedValueList = removeAllParentCenter(multiSelectedValueList);

			value = filteredMultiSelectedValueList?.join();
			// globalVar['gDccode'] = value;
			globalVar['gMultiDccode'] = value;
		} else {
			let storerkeyTmp = 'FW00';
			let organizeTmp = '';
			let areaTmp = '1000';

			// 선택된 센터에 따른 회사 목록
			const storerkeyList = getUserStorerkeyList('', value);
			if (storerkeyList && storerkeyList.length > 0) {
				storerkeyTmp = storerkeyList[0].storerkey;
			}

			// 선택된 센터에 따른 조직 목록
			const organizeList = getUserOrganizeList('', value, storerkeyTmp);
			if (organizeList && organizeList.length > 0) {
				organizeTmp = organizeList[0].organize;
			}

			// 선택된 센터에 따른 구역 목록
			const areaList = getUserAreaList('', value, storerkeyTmp);
			if (areaList && areaList.length > 0) {
				areaTmp = areaList[0].area;
			}

			// globalVar['gDccode'] = value;
			globalVar['gStorerkey'] = storerkeyTmp;
			globalVar['gOrganize'] = organizeTmp;
			globalVar['gArea'] = areaTmp;
			globalVar['gMultiDccode'] = value;
			globalVar['gMultiStorerkey'] = storerkeyTmp;
			globalVar['gMultiOrganize'] = organizeTmp;
			globalVar['gMultiArea'] = areaTmp;
		}

		// 글로벌 멀티 센터코드 값 설정
		dispatch(setGlobalVariable(globalVar));

		// 콜백 처리
		if (props.onChange && props.onChange instanceof Function) {
			props.onChange(value);
		}
	};

	// Backspace 완전 차단
	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Backspace' && !isSingleMode) {
			e.preventDefault();
			e.stopPropagation(); // 이벤트 전파 방지
		}
	};

	// 비활성화 조건에 따라 처리
	const setDisabled = (): boolean => {
		if (props.disabled) {
			// 비활성화 일 경우 초기값 유지
			if (commUtil.isNotEmpty(form.getFieldValue(props.name))) {
				initValRef.current = form.getFieldValue(props.name);
			}
			setTimeout(() => {
				form.setFieldValue(props.name, initValRef.current);
			});
			return true;
		} else {
			// gDccode 값 null 일 경우 비활성화 해제
			return commUtil.isEmpty(globalVariable.gDccode) ? false : props.disabled;
		}
	};

	return (
		<SelectBox
			{...props}
			name={name}
			options={[
				...(allLabel ? [{ dcname: allLabel, dccode: '' }] : []),
				...customOptions,
				...(getUserDccodeList(isSingleMode ? '' : dataType) ?? []),
			]}
			fieldNames={{ label: 'dcname', value: 'dccode' }}
			initval={props.initval || globalVariable.gDccode}
			label={props.label ?? t('lbl.DCCODE')}
			onChange={preOnChange}
			showSearch={true} // 개발환경에서만 검색 기능 활성화
			filterOption={(input: string, option: any) => {
				const label = option?.label ?? option?.dcname ?? '';
				return label.toString().toLowerCase().includes(input.toLowerCase());
			}}
			allowClear={true}
			maxTagCount={0}
			maxTagPlaceholder={(omittedValues: any) =>
				removeAllParentCenter2(omittedValues).length > 1
					? `${removeAllParentCenter2(omittedValues)[0]?.['label']} 외 ${
							removeAllParentCenter2(omittedValues).length - 1
					  }개`
					: removeAllParentCenter2(omittedValues)[0]?.['label']
			}
			onInputKeyDown={handleInputKeyDown}
			mode={isSingleMode ? '' : mode} // props.mode === 'single' 일 경우 "--- 선택 ---" 문구 노출 안되는 부분 수정			mode={isSingleMode ? '' : mode} // props.mode === 'single' 일 경우 "--- 선택 ---" 문구 노출 안되는 부분 수정
			disabled={setDisabled()}
		/>
	);
};

export default CmGMultiDccodeSelectBoxNew;
