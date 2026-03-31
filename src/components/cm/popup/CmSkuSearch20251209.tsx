/*
 ############################################################################
 # FiledataField	: CmSkuPopup.tsx
 # Description		: 상품조회팝업
 # Author			: JeongHyeongCheol
 # Since			: 25.05.09
 ############################################################################
*/
// lib
import { CloseCircleFilled } from '@ant-design/icons';
import { Dropdown, Form } from 'antd';

// utils

// component
import CmSkuPopup from '@/components/cm/popup/CmSkuPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';

// API Call Function
import { apiGetSkuList } from '@/api/cm/apiCmSearch';
import commUtil from '@/util/commUtil';

// hooks
import DropdownRenderer from '@/components/common/custom/DropdownRenderer';
import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { usePopupPasteTransform } from '@/hooks/cm/usePopupPasteTransform';
import { usePopupSearchValue } from '@/hooks/cm/usePopupSearchValue';
import useSearchDropdownInSearch from '@/hooks/cm/useSearchDropdownInSearch';
import { useThrottle } from '@/hooks/useThrottle';

interface SearchSkuProps {
	form: any;
	label?: any;
	selectionMode?: string;
	name: string;
	code: string;
	returnValueFormat?: string;
	required?: any;
	value?: string;
	disabled?: any;
	className?: string;
	kit?: boolean;
}

const CmSkuSearch = (props: SearchSkuProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, label, selectionMode, name, code, returnValueFormat, value, className, kit } = props;
	const [popupForm] = Form.useForm();

	const throttle = useThrottle();
	const pasteTransform = usePopupPasteTransform();
	const refModal = useRef(null);
	const gridRef = useRef(null);

	const [popupList, setPopupList] = useState([]);

	// scroll Paging
	const [currentPageScr, setCurrentPageScr] = useState(1);
	const [pageSizeScr] = useState(constants.PAGE_INFO.PAGE_SIZE);
	const [totalCount, setTotalCount] = useState(0);

	// input disable처리
	const [isDisabled, setIsDisabled] = useState(false);

	const { t } = useTranslation();

	// 드롭다운 검색 Hook 설정
	const dropdownConfig = {
		columns: [
			{ key: 'code' as const, title: '코드' },
			{ key: 'name' as const, title: '명', className: 'txt-l' },
		],
		form,
		name,
		code,
		returnValueFormat,
	};

	const { dropdownOpen, setDropdownOpen, setDropdownData, dropdownData, handleDropdownClick } =
		useSearchDropdownInSearch(dropdownConfig);

	usePopupSearchValue({ form, name, code, value });

	useCloseOnExternalScroll({
		open: dropdownOpen,
		onClose: () => setDropdownOpen(false),
		allowScrollRefs: [refModal],
	});

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const handleOpenPopup = () => {
		setPopupList([]);
		setTotalCount(0);
		refModal.current?.handlerOpen();
	};

	/**
	 * API 조회
	 * @param {boolean} isPopup 팝업여부
	 * @param {string} value 검색할 이름
	 * @param {boolean} isMultiSelect 다중선택 여부
	 * @returns {void}
	 */
	const getSearchApi = (isPopup: boolean, value: string, isMultiSelect: boolean) => {
		if (value === '') {
			handleOpenPopup();
			return;
		}

		const tt = currentPageScr - 1;
		const params = {
			name: value,
			multiSelect: '',
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			skipCount: currentPageScr !== 1,
			//
			isEnter: 'Y', // Enter키로 검색 여부
			kitYn: kit ? 'Y' : 'N',
		};

		if (isMultiSelect) {
			params.multiSelect = value;
		} else {
			params.name = value;
		}

		apiGetSkuList(params).then((res: any) => {
			if (!isPopup) {
				if (res.data.list.length === 1) {
					settingSelectData(res.data.list);
				} else {
					refModal.current?.handlerOpen();
				}
			} else {
				gridRef.current?.clearGridData();
			}

			// 팝업 발생 후 데이터 적용
			setPopupList(res.data.list);
			if (res.data.totalCount > -1) {
				setTotalCount(res.data.totalCount);
			}
		});
	};

	/**
	 * API 조회 - 그리드 스크롤
	 * @param {boolean} isPopup 팝업여부
	 * @param {string} value1 검색할 이름
	 * @param {string} value2 검색할 이름(멀티)
	 * @returns {void}
	 */
	const searchScroll = throttle((isPopup: boolean, value1: string, value2: string) => {
		const tt = currentPageScr - 1;

		const params = {
			name: value1,
			multiSelect: value2,
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			skipCount: currentPageScr !== 1,
			kitYn: kit ? 'Y' : 'N',
		};
		apiGetSkuList(params).then((res: any) => {
			setPopupList(res.data.list);
			if (res.data.totalCount > -1) {
				setTotalCount(res.data.totalCount);
			}
		});
	}, 500);

	/**
	 * API 조회 - INPUT 하단 그리드
	 * @param {string} value 검색할 이름
	 * @param {boolean} isForceSearch 강제 검색 여부
	 * @returns {void}
	 */
	const searchEnter = (value: string, isForceSearch?: boolean) => {
		if (value === '' || (!isForceSearch && commUtil.isNotEmpty(form.getFieldValue(code)))) {
			return;
		}
		setDropdownOpen(false);
		const params = {
			name: value,
			multiSelect: '',
			startRow: 0,
			listCount: 5000,
			skipCount: true,
			kitYn: kit ? 'Y' : 'N',
			// isEnter: 'Y',
		};

		apiGetSkuList(params).then((res: any) => {
			if (res.data.list.length === 1) {
				confirmEvent(res.data.list);
			} else if (res.data.list.length > 0) {
				setDropdownData(res.data.list);
				setDropdownOpen(true);
			} else {
				refModal.current?.handlerOpen();
			}
		});
	};

	/**
	 * 버튼 클릭 검색
	 * @param {object} param 조회 param
	 * @param  {any} event 이벤트
	 * @param  {any} source clear, input
	 * @returns {void}
	 */
	const onClickSearchButton = (param: string, event: any, source: any) => {
		if (source.source === 'clear') return;
		setPopupList([]);

		const isMultiSelect = param.split(',').length > 1;
		if (event.key === 'Enter') {
			if (isMultiSelect) {
				getSearchApi(false, param, isMultiSelect);
			} else {
				searchEnter(param);
			}
		} else {
			handleOpenPopup();
		}
	};

	/**
	 * 조회 결과 저장
	 * @param {object} val 선택된 임직원 객체
	 * @returns {void}
	 */
	const settingSelectData = (val: any) => {
		let searchName = commUtil.convertCodeWithName(val[0].code, val[0].name);
		let searchCode = val[0].code;

		for (let i = 1; i < val.length; i++) {
			searchName += `,${commUtil.convertCodeWithName(val[i].code, val[i].name)}`;
			searchCode += ',' + val[i].code;
		}

		if (returnValueFormat === 'code') {
			form.setFieldsValue({ [name]: searchCode, [code]: searchCode });
		} else if (val.length > 1) {
			form.setFieldsValue({ [name]: `${val.length}건 선택`, [code]: searchCode });
		} else {
			form.setFieldsValue({ [name]: searchName, [code]: searchCode });
		}
		setIsDisabled(true);
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		// 의미없는 값 삭제
		if (commUtil.isEmpty(form.getFieldValue(code))) {
			form.setFieldsValue({ [name]: '' });
		}
		// 의미없는 값 삭제
		if (commUtil.isEmpty(form.getFieldValue(code))) {
			form.setFieldsValue({ [name]: '' });
		}
		setCurrentPageScr(1);
		setTotalCount(0);
		refModal.current?.handlerClose();
	};

	/**
	 * 팝업 확인
	 * @param {object} params Request Params
	 */
	const confirmEvent = (params: any) => {
		setCurrentPageScr(1);
		refModal.current?.handlerClose();
		settingSelectData(params);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 스크롤하여 페이지 이동되면 데이터 조회
	 */
	useEffect(() => {
		if (currentPageScr > 1) {
			const param = popupForm.getFieldValue(name);
			const multiSelectParam = popupForm.getFieldValue('multiSelect');
			searchScroll(true, param, multiSelectParam);
		}
	}, [currentPageScr]);

	return (
		<>
			<Dropdown
				placement="bottom"
				open={dropdownOpen}
				trigger={[]} // hover, click 방지 => 명시적으로 상태로만 열림
				popupRender={() => DropdownRenderer(dropdownConfig.columns, dropdownData, handleDropdownClick)}
			>
				<InputSearch
					// label="상품코드/명"
					placeholder={t('msg.placeholder1', ['상품코드 또는 이름'])}
					form={form}
					name={name}
					code={code}
					hidden={true}
					onSearch={onClickSearchButton}
					onPaste={(e: any) => {
						pasteTransform(form, name, true, code)(e);
						if (!String(form.getFieldValue(code) || '').includes(',')) searchEnter(form.getFieldValue(code), true);
					}}
					onBlur={() => {
						// 의미 없는 값 입력시 삭제
						if (!dropdownOpen && commUtil.isEmpty(form.getFieldValue(code)) && !refModal.current?.getIsOpen()) {
							form.setFieldValue(name, '');
						}
					}}
					onChange={() => {
						if (isDisabled) {
							form.setFieldValue(name, '');
						}
						setIsDisabled(false);
					}}
					allowClear={!props.disabled && commUtil.isEmpty(form.getFieldValue(name))} // suffix가 노출 안될때 CSS 틀어져서 임시적으로 사용
					//onBlur={onBlurEvent}
					label={label ?? '상품코드/명'}
					required={props.required ?? props.required}
					rules={[{ required: props.required, validateTrigger: 'none' }]}
					disabled={props.disabled ?? props.disabled}
					readOnly={commUtil.isNotEmpty(form.getFieldValue(code))}
					suffix={
						!props.disabled && commUtil.isNotEmpty(form.getFieldValue(name)) ? (
							<CloseCircleFilled
								style={{ cursor: 'pointer', color: 'rgba(0,0,0,0.25)' }}
								onClick={() => {
									form.setFieldValue(name, '');
									form.setFieldValue(code, '');
								}}
							/>
						) : null
					}
					// disabled={isDisabled ?? isDisabled}
					className={`${className} `}
					autoComplete="off"
				/>
			</Dropdown>
			{/* 팝업 */}
			<CustomModal ref={refModal} width="1280px">
				<CmSkuPopup
					callBack={confirmEvent}
					close={closeEvent}
					searchName={form.getFieldValue(code)?.includes(',') ? form.getFieldValue(code) : form.getFieldValue(name)}
					preResult={isDisabled}
					gridData={popupList}
					search={searchScroll}
					selectionMode={selectionMode || 'singleRow'}
					setCurrentPage={setCurrentPageScr}
					totalCount={totalCount}
					gridRef={gridRef}
					form={popupForm}
					name={name}
					kit={kit ? 'Y' : 'N'}
				></CmSkuPopup>
			</CustomModal>
		</>
	);
};

export default CmSkuSearch;
