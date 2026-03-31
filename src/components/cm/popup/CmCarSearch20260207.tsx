/*
 ############################################################################
 # FiledataField	: CmCarSearch.tsx
 # Description		: 차량 조회 팝업
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.19
 ############################################################################
*/
// lib
import { CloseCircleFilled } from '@ant-design/icons';
import { Dropdown, Form } from 'antd';

// utils
import Constants from '@/util/constants';

// component
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';
import CmCarPopup from './CmCarPopup';

// hook
import DropdownRenderer from '@/components/common/custom/DropdownRenderer';

// API Call Function
import { apiGetCmCarList } from '@/api/cm/apiCmSearch';

import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { usePopupPasteTransform } from '@/hooks/cm/usePopupPasteTransform';
import { usePopupSearchValue } from '@/hooks/cm/usePopupSearchValue';
import { useThrottle } from '@/hooks/useThrottle';
interface CmCarSearch {
	form: any;
	selectionMode?: string;
	name: string;
	code: string;
	returnValueFormat?: string;
	label?: string;
	required?: any;
	value?: string;
	customDccode?: string; // 커스텀 물류센터 코드
	controlRef?: any; // 외부에서 모달 제어
	onConfirm?: (selected: any[]) => void; // 선택 후 콜백
	disabled?: any;
	renderInline?: boolean; // 페이지 내 입력 필드 렌더링 여부
}

const CmCarSearch = (props: CmCarSearch) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const {
		form,
		selectionMode,
		name,
		code,
		returnValueFormat,
		label,
		required,
		value,
		customDccode,
		controlRef,
		onConfirm,
		disabled,
		renderInline = true,
	} = props;
	const [popupForm] = Form.useForm();

	const throttle = useThrottle();
	const pasteTransform = usePopupPasteTransform();
	const refModal = useRef(null);
	const gridRef = useRef(null);
	const dropdownBodyRef = useRef<HTMLTableSectionElement | null>(null);

	const [popupList, setPopupList] = useState([]);

	// dropdown
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropdownData, setDropdownData] = useState<any[]>([]);

	// scroll Paging
	const [currentPageScr, setCurrentPageScr] = useState(1);
	const [pageSizeScr] = useState(Constants.PAGE_INFO.PAGE_SIZE);
	const [totalCount, setTotalCount] = useState(0);

	const { t } = useTranslation();
	/**
	 * =====================================================================
	 *	01. 함수
	 * =====================================================================
	 */

	const handleOpenPopup = () => {
		setPopupList([]);
		setTotalCount(0);
		refModal.current?.handlerOpen();
	};

	/**
	 * 차량 조회 API 호출
	 * @param {boolean} isPopup 팝업여부
	 * @param {string} value 검색할 이름
	 * @param {string} contracttype 계약유형
	 * @param {boolean} isMultiSelect 다중 선택 여부
	 * @returns {void}
	 */
	const getSearchApi = (isPopup: boolean, value: string, isMultiSelect: boolean, contracttype?: string) => {
		if (value === '') {
			handleOpenPopup();
			return;
		}

		const params = {
			name: value,
			multiSelect: '',
			contracttype: contracttype,
			customDccode: customDccode,
		};

		if (isMultiSelect) {
			params.multiSelect = value;
		} else {
			params.name = value;
		}

		apiGetCmCarList(params).then(res => {
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
	 * @param {string} value2 다중 선택값
	 * @param {string} contracttype 계약유형
	 * @returns {void}
	 */
	const searchScroll = throttle((isPopup: boolean, value1: string, value2: string, contracttype?: string): void => {
		const tt = currentPageScr - 1;
		const params = {
			name: value1,
			multiSelect: value2,
			contracttype: contracttype,
			customDccode: customDccode,
		};

		apiGetCmCarList(params).then(res => {
			setPopupList(res.data.list);
			if (res.data.totalCount > -1) {
				setTotalCount(res.data.totalCount);
			}
		});
	}, 500);

	/**
	 * 엔터 입력 시 조회
	 * @param {string} value 검색어
	 * @param {boolean} isForceSearch 강제 검색 여부
	 */
	const searchEnter = (value: string, isForceSearch?: boolean): void => {
		if (value === '' || (!isForceSearch && commUtil.isNotEmpty(form.getFieldValue(code)))) return;

		dropdownData.length = 0;
		const params = {
			name: value,
			multiSelect: '',
			customDccode: customDccode,
			startRow: 0,
			listCount: pageSizeScr,
			skipCount: true,
		};

		apiGetCmCarList(params).then(res => {
			if (res.data.list.length === 1) {
				confirmEvent(res.data.list);
			} else if (res.data.list.length > 0) {
				for (const item of res.data.list) {
					dropdownData.push(item);
				}
				setDropdownOpen(true);
			}
		});
	};

	/**
	 * 검색 버튼 클릭 시
	 * @param {object} param 조회 param
	 * @param  {any} event 이벤트
	 * @param  {any} source clear, input
	 * @returns {void}
	 */
	const onClickSearchButton = (param: string, event: any, source: any) => {
		if (source.source === 'clear') return;
		setPopupList([]);
		const contracttype = form.getFieldValue('contracttype');
		const isMultiSelect = param.split(',').length > 1;
		if (event.key === 'Enter') {
			if (isMultiSelect) {
				getSearchApi(false, param, isMultiSelect, contracttype);
			} else {
				searchEnter(param);
			}
		} else {
			handleOpenPopup();
		}
	};

	usePopupSearchValue({ form, name, code, value });
	useCloseOnExternalScroll({
		open: dropdownOpen,
		onClose: () => setDropdownOpen(false),
		allowScrollRefs: [refModal],
	});

	/**
	 * 조회 결과 저장
	 * @param {object} val
	 * @returns {void}
	 */
	const settingSelectData = (val: any): void => {
		let rstCode = commUtil.convertCodeWithName(val[0].code, val[0].name);
		let rstName = val[0].code;

		for (let i = 1; i < val.length; i++) {
			rstCode += `,${commUtil.convertCodeWithName(val[i].code, val[i].name)}`;
			rstName += ',' + val[i].code;
		}
		if (returnValueFormat === 'code') {
			form.setFieldsValue({ [name]: rstName, [code]: rstName });
		} else if (val.length > 1) {
			form.setFieldsValue({ [name]: `${val.length}건 선택`, [code]: rstName });
		} else {
			form.setFieldsValue({ [name]: rstCode, [code]: rstName });
		}
	};

	/**
	 * 팝업 닫기 이벤트
	 */
	const closeEvent = (): void => {
		// 의미없는 값 삭제
		if (commUtil.isEmpty(form.getFieldValue(code))) {
			form.setFieldsValue({ [name]: '' });
		}
		setCurrentPageScr(1);
		// form.resetFields();
		setTotalCount(0);
		refModal.current?.handlerClose();
	};

	/**
	 * 팝업 확인 버튼
	 * @param {object} params
	 */
	const confirmEvent = (params: any): void => {
		setCurrentPageScr(1);
		refModal.current?.handlerClose();
		settingSelectData(params);
		if (onConfirm) {
			onConfirm(params);
		}
	};

	/**
	 * 검색창 Focus out 이벤트
	 * @param {object} params Request Params
	 */
	// const onBlurEvent = (params: any) => {
	// 	if (
	// 		commUtil.isNull(form.getFieldValue(params.currentTarget.getAttribute('code'))) &&
	// 		!refModal.current.getIsOpen()
	// 	) {
	// 		form.setFieldValue(params.currentTarget.getAttribute('name'), '');
	// 		form.setFieldValue(name, '');
	// 	}
	// };
	/**
	 * 드롭다운에서 항목 선택 시
	 * @param val
	 */
	const handleDropdownClick = (val: any): void => {
		if (returnValueFormat === 'code') {
			form.setFieldsValue({ [name]: val.code, [code]: val.code });
		} else {
			form.setFieldsValue({ [name]: commUtil.convertCodeWithName(val.code, val.name), [code]: val.code });
		}
		setDropdownOpen(false);
	};

	/**
	 * 드롭다운 렌더링 포맷
	 */
	const dropdownRenderFormat = (): JSX.Element => {
		return (
			<>
				{
					<div className={'dropdown-content'}>
						<table className="data-table">
							<thead>
								<tr>
									<th>코드</th>
									<th>명</th>
								</tr>
							</thead>
							<tbody>
								{dropdownData.map((item, index) => (
									<tr key={index} onClick={() => handleDropdownClick(item)}>
										<td id="dropdownTable">{item.code}</td>
										<td id="dropdownTable">{item.name}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				}
			</>
		);
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
			const multiSelect = popupForm.getFieldValue('multiSelect');
			const contracttype = popupForm.getFieldValue('contracttype');
			searchScroll(true, param, multiSelect, contracttype);
		}
	}, [currentPageScr]);

	useEffect(() => {
		const handleClickOutside = (e: any): void => {
			if (e.target?.id !== 'dropdownTable') {
				form.resetFields();
				setDropdownOpen(false);
			}
		};
		if (dropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [dropdownOpen]);

	// 외부 제어용 open 메서드 노출
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

	/**
	 * Drop Down 노출시 포커스 이동
	 */
	useEffect(() => {
		if (!dropdownOpen) return;
		requestAnimationFrame(() => {
			dropdownBodyRef.current?.querySelector('tr')?.focus();
		});
	}, [dropdownOpen]);

	return (
		<>
			{renderInline && (
				<Dropdown
					placement="bottom"
					open={dropdownOpen}
					trigger={[]}
					popupRender={() =>
						DropdownRenderer(
							[
								{ key: 'code', title: '코드' },
								{ key: 'name', title: '명' },
							],
							dropdownData,
							handleDropdownClick,
							null,
							{
								bodyRef: dropdownBodyRef,
								setDropdownOpen,
								form,
								name,
							},
						)
					}
				>
					{/* 팝업 */}
					<InputSearch
						label={label || '차량번호 또는 기사명'}
						placeholder={t('msg.placeholder1', ['차량번호 또는 기사명'])}
						form={form}
						name={name}
						code={code}
						value={value}
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
						allowClear={commUtil.isEmpty(form.getFieldValue(name))} // suffix가 노출 안될때 CSS 틀어져서 임시적으로 사용
						required={required ?? required}
						rules={[{ required: required, validateTrigger: 'none' }]}
						disabled={disabled}
						readOnly={commUtil.isNotEmpty(form.getFieldValue(code))}
						suffix={
							commUtil.isNotEmpty(form.getFieldValue(name)) ? (
								<CloseCircleFilled
									style={{ cursor: 'pointer', color: 'rgba(0,0,0,0.25)' }}
									onClick={() => {
										form.setFieldValue(name, '');
										form.setFieldValue(code, '');
									}}
								/>
							) : null
						}
						autoComplete="off"
					/>
				</Dropdown>
			)}
			<CustomModal ref={refModal} width="1280px">
				<CmCarPopup
					callBack={confirmEvent}
					close={closeEvent}
					searchName={form.getFieldValue(code)?.includes(',') ? form.getFieldValue(code) : form.getFieldValue(name)}
					// gridData={popupList}
					// search={searchScroll}
					selectionMode={selectionMode || 'singleRow'}
					// setCurrentPage={setCurrentPageScr}
					// totalCount={totalCount}
					// gridRef={gridRef}
					// form={popupForm}
					// name={name}
					customDccode={customDccode}
				/>
			</CustomModal>
		</>
	);
};

export default CmCarSearch;
