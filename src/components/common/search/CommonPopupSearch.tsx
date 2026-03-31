/*
 ############################################################################
 # FiledataField	: CommonPopupSearch.tsx
 # Description		: 팝업을 공통으로 처리하기 위한 확정 컴포넌트
 # Author			: sss
 # Since			: 25.12.05
 ############################################################################
*/
// lib
import { CloseCircleFilled } from '@ant-design/icons';
import { Dropdown, Form } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

// component
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';

// API Call Function
import { createDropdownConfig, onClickSearchButton, searchEnter, settingSelectData } from '@/api/cm/apiCmSearch';
import commUtil from '@/util/commUtil';
import constants from '@/util/constants';

// hooks
import DropdownRenderer from '@/components/common/custom/DropdownRenderer';
import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { usePopupPasteTransform } from '@/hooks/cm/usePopupPasteTransform';
import { usePopupSearchValue } from '@/hooks/cm/usePopupSearchValue';
import useSearchDropdownInSearch from '@/hooks/cm/useSearchDropdownInSearch';
import { useThrottle } from '@/hooks/useThrottle';

interface CommonPopupSearchProps {
	form: any;
	label?: string;
	placeholder?: string;
	selectionMode?: string;
	name: string;
	code: string;
	returnValueFormat?: string;
	required?: boolean;
	value?: string;
	disabled?: boolean;
	className?: string;
	callBack?: (rows: any[]) => void;
	// API 관련
	apiFunction: (params: any) => Promise<any>;
	// 팝업 컴포넌트
	PopupComponent: any;
	// 추가 파라미터
	extraParams?: any;
	// 팝업 설정
	modalWidth?: string;
	// 드롭다운 컬럼 설정 (기본값 제공)
	dropdownColumns?: Array<{ key: string; title: string; className?: string }>;
	// 외부에서 모달 제어
	controlRef?: any;
}

const CommonPopupSearch = (props: CommonPopupSearchProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const {
		form,
		label,
		placeholder,
		selectionMode,
		name,
		code,
		returnValueFormat = 'name',
		value,
		className,
		callBack,
		apiFunction,
		PopupComponent,
		extraParams,
		modalWidth = '1280px',
		dropdownColumns,
		controlRef,
	} = props;

	const [popupForm] = Form.useForm();

	const throttle = useThrottle();
	const pasteTransform = usePopupPasteTransform();
	const refModal = useRef(null);
	const gridRef = useRef(null);
	const dropdownBodyRef = useRef<HTMLTableSectionElement | null>(null);

	const [popupList, setPopupList] = useState([]);

	// scroll Paging
	const [currentPageScr, setCurrentPageScr] = useState(1);
	const [pageSizeScr] = useState(constants.PAGE_INFO.PAGE_SIZE);
	const [totalCount, setTotalCount] = useState(0);

	// input disable처리
	const [isDisabled, setIsDisabled] = useState(false);

	const { t } = useTranslation();
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 드롭다운 검색 Hook 설정
	const dropdownConfig = createDropdownConfig(form, name, code, returnValueFormat);

	// 사용자 정의 컬럼이 있으면 적용
	if (dropdownColumns) {
		dropdownConfig.columns = dropdownColumns.map(column => ({
			...column,
			className: column.className || '',
		}));
	}

	const { dropdownOpen, setDropdownOpen, setDropdownData, dropdownData, handleDropdownClick } =
		useSearchDropdownInSearch(dropdownConfig);

	const handleDropdownClickWithCallback = (item: any) => {
		handleDropdownClick(item);
		if (typeof callBack === 'function') {
			callBack([item]); // 콜백 호출
		}
	};

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

	const handleOpenPopup = (params = extraParams) => {
		setPopupList([]);
		setTotalCount(0);

		// extraParams의 모든 값들을 popupForm에 설정
		if (params) {
			Object.keys(params).forEach(key => {
				if (params[key] !== undefined) {
					popupForm.setFieldValue(key, params[key]);
				}
			});
		}

		// dccode는 기본값 처리
		if (params?.dccode !== undefined) {
			popupForm.setFieldValue('dccode', params.dccode || gDccode);
		} else if (gDccode) {
			popupForm.setFieldValue('dccode', gDccode);
		}

		refModal.current?.handlerOpen();
	};

	/**
	 * API 조회
	 * @param {boolean} isPopup 팝업여부
	 * @param {string | any} value 검색할 이름
	 * @param {boolean} isMultiSelect 다중선택 여부
	 * @returns {void}
	 */
	const getSearchApi = (isPopup: boolean, value: string | any, isMultiSelect: boolean) => {
		// value가 객체인 경우 (확장 모드)
		if (typeof value === 'object' && value !== null) {
			const keys = Object.keys(value);
			const allEmpty =
				keys.length === 0 ||
				keys.every(k => {
					const v = value[k];
					return v === undefined || v === null || String(v) === '';
				});

			if (allEmpty) {
				handleOpenPopup(extraParams);
				return;
			}
		}

		if (value === '' || commUtil.isNotEmpty(form.getFieldValue(code))) {
			handleOpenPopup(extraParams);
			return;
		}

		const tt = currentPageScr - 1;
		const params = {
			name: value,
			multiSelect: '',
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			skipCount: currentPageScr !== 1,
			// parameter
			isEnter: 'Y', // Enter키로 검색 여부
			...extraParams, // 추가 파라미터 병합
		};
		delete params.carnoList; // carnoList는 클라이언트 필터링용이므로 API 요청에서 제외
		if (isMultiSelect) {
			params.multiSelect = value;
		} else {
			params.name = value;
		}

		apiFunction(params).then((res: any) => {
			let resultList = res.data.list || [];
			if (extraParams?.carnoList && extraParams.carnoList.length > 0) {
				resultList = resultList.filter((item: any) => extraParams.carnoList.includes(item.code));
			}

			if (!isPopup) {
				if (resultList.length === 1) {
					settingSelectData(resultList, form, name, code, returnValueFormat, setIsDisabled);
				} else {
					refModal.current?.handlerOpen();
				}
			} else {
				gridRef.current?.clearGridData();
			}

			// 팝업 발생 후 데이터 적용
			setPopupList(resultList);
			if (res.data.totalCount > -1) {
				setTotalCount(extraParams?.carnoList ? resultList.length : res.data.totalCount);
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
	const searchScroll = throttle((isPopup: boolean, value1: string, value2: string, allFormValues?: any) => {
		const tt = currentPageScr - 1;

		const params = {
			name: value1,
			multiSelect: value2,
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			skipCount: currentPageScr !== 1,
			// parameter
			...extraParams, // 추가 파라미터 병합
		};
		delete params.carnoList; // carnoList는 클라이언트 필터링용이므로 API 요청에서 제외

		//console.log(('allFormValues2:', allFormValues);

		// If allFormValues is provided, merge it into params
		if (allFormValues && typeof allFormValues === 'object') {
			Object.assign(params, allFormValues);
		}

		// dccode 처리
		if (extraParams?.dccode !== undefined) {
			params.dccode = popupForm.getFieldValue('dccode') ? popupForm.getFieldValue('dccode') : extraParams.dccode;
		}

		if (extraParams?.carnoList && extraParams.carnoList.length > 0) {
			params.multiSelect = extraParams.carnoList.join(',');
		}

		apiFunction(params).then((res: any) => {
			let resultList = res.data.list || [];
			if (extraParams?.carnoList && extraParams.carnoList.length > 0) {
				if (allFormValues.name) {
					resultList = resultList.filter((item: any) => item.code.includes(allFormValues.name));
				}

				if (allFormValues.multiSelect) {
					resultList = resultList.filter((item: any) => allFormValues.multiSelect.split(',').includes(item.code));
				}
			}
			setPopupList(resultList);
			if (res.data.totalCount > -1) {
				setTotalCount(extraParams?.carnoList ? resultList.length : res.data.totalCount);
			}
		});
	}, 500);

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
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
		settingSelectData(params, form, name, code, returnValueFormat, setIsDisabled);
		if (typeof callBack === 'function') {
			callBack(params);
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
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

	/**
	 * Drop Down 노출시 포커스 이동
	 */
	useEffect(() => {
		if (!dropdownOpen) return;
		requestAnimationFrame(() => {
			dropdownBodyRef.current?.querySelector('tr')?.focus();
		});
	}, [dropdownOpen]);

	useEffect(() => {
		if (controlRef) {
			controlRef.current = {
				open: (initialValue?: string) => {
					if (initialValue) {
						form.setFieldValue(name, initialValue);
					}
					setPopupList([]);
					setTotalCount(0);
					refModal.current?.handlerOpen?.();
				},
			};
		}
	}, []);

	return (
		<>
			<Dropdown
				placement="bottom"
				open={dropdownOpen}
				trigger={[]} // hover, click 방지 => 명시적으로 상태로만 열림
				popupRender={() =>
					DropdownRenderer(dropdownConfig.columns, dropdownData, handleDropdownClickWithCallback, null, {
						bodyRef: dropdownBodyRef,
						setDropdownOpen,
						form,
						name,
					})
				}
			>
				<InputSearch
					placeholder={placeholder || t('msg.placeholder1', [label || '검색'])}
					form={form}
					name={name}
					code={code}
					hidden={true}
					onSearch={(param: string, event: any, source: any) =>
						onClickSearchButton(
							param,
							event,
							source,
							setPopupList,
							getSearchApi,
							handleOpenPopup,
							form,
							code,
							setDropdownOpen,
							setDropdownData,
							confirmEvent,
							refModal,
							popupForm,
							apiFunction,
							extraParams,
						)
					}
					onPaste={(e: any) => {
						pasteTransform(form, name, true, code)(e);
						if (!String(form.getFieldValue(code) || '').includes(',')) {
							searchEnter(
								form.getFieldValue(code),
								true,
								form,
								code,
								setDropdownOpen,
								setDropdownData,
								confirmEvent,
								apiFunction,
								refModal,
								form.getFieldValue(code),
								true,
								handleOpenPopup,
								extraParams || {},
							);
						}
					}}
					onBlur={() => {
						// 의미 없는 값 입력시 삭제
						if (
							!dropdownOpen &&
							commUtil.isEmpty(form.getFieldValue(code)) &&
							!refModal.current?.getIsOpen() &&
							!extraParams?.disableOnBlurClear
						) {
							form.setFieldValue(name, '');
						}
					}}
					onChange={() => {
						if (isDisabled) {
							form.setFieldValue(name, '');
						}
						setIsDisabled(false);
					}}
					allowClear={!props.disabled && commUtil.isEmpty(form.getFieldValue(name))}
					label={label}
					required={props.required}
					rules={[{ required: props.required, validateTrigger: 'none' }]}
					disabled={props.disabled}
					readOnly={commUtil.isNotEmpty(form.getFieldValue(code))}
					suffix={
						!props.disabled && commUtil.isNotEmpty(form.getFieldValue(name)) ? (
							<CloseCircleFilled
								style={{ cursor: 'pointer', color: 'rgba(0,0,0,0.25)' }}
								onClick={() => {
									form.setFieldValue(name, '');
									form.setFieldValue(code, '');
									setIsDisabled(false);

									// "x" 버튼 클릭시 빈값 콜백 처리
									if (typeof callBack === 'function') {
										callBack([{ name: '', code: '' }]);
									}
								}}
							/>
						) : null
					}
					className={`${className} `}
					autoComplete="off"
				/>
			</Dropdown>

			{/* 팝업 */}
			<CustomModal
				ref={refModal}
				width={modalWidth}
				onKeyDown={(e: KeyboardEvent) => {
					if (e.key === 'Escape') {
						e.stopPropagation();
						closeEvent();
					}
				}}
			>
				<PopupComponent
					callBack={confirmEvent}
					close={closeEvent}
					searchName={form.getFieldValue(code)?.includes(',') ? form.getFieldValue(code) : form.getFieldValue(name)}
					gridData={popupList}
					search={searchScroll}
					apiFunction={apiFunction}
					selectionMode={selectionMode || 'singleRow'}
					currentPage={currentPageScr}
					pageSizeScr={pageSizeScr}
					setCurrentPage={setCurrentPageScr}
					totalCount={totalCount}
					gridRef={gridRef}
					form={popupForm}
					name={name}
					{...extraParams} // 추가 props 전달
				/>
			</CustomModal>
		</>
	);
};

export default CommonPopupSearch;
