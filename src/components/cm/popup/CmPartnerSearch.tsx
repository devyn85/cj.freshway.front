/*
 ############################################################################
 # FiledataField	: CmPartnerSearch.tsx
 # Description		: 협력사조회 팝업
 # Author			: YeoSeungCheol
 # Since			: 25.05.14
 ############################################################################
*/
// lib
import { CloseCircleFilled } from '@ant-design/icons';
import { Dropdown, Form } from 'antd';

// utils
import Constants from '@/util/constants';

// component
import CmPartnerPopup from '@/components/cm/popup/CmPartnerPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';

// API Call Function
import { apiGetPartnerList } from '@/api/cm/apiCmSearch';

import DropdownRenderer from '@/components/common/custom/DropdownRenderer';
import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { usePopupPasteTransform } from '@/hooks/cm/usePopupPasteTransform';
import { usePopupSearchValue } from '@/hooks/cm/usePopupSearchValue';
import { useThrottle } from '@/hooks/useThrottle';

interface SearchPartnerProps {
	form: any;
	selectionMode?: string;
	name: string;
	code: string;
	returnValueFormat?: string;
	label?: string;
	required?: any;
	value?: string;
	disabled?: boolean;
	className?: any;
	onConfirm?: (selected: any[]) => void; // 선택 후 콜백
}

const CmPartnerSearch = (props: SearchPartnerProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, selectionMode, name, code, returnValueFormat, label, required, value, onConfirm } = props;
	const [popupForm] = Form.useForm();

	const throttle = useThrottle();
	const pasteTransform = usePopupPasteTransform();

	const refModal = useRef(null);
	const gridRef = useRef(null);
	const [popupList, setPopupList] = useState([]);
	const dropdownBodyRef = useRef<HTMLTableSectionElement | null>(null);

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
	 *	02. 함수
	 * =====================================================================
	 */

	const handleOpenPopup = () => {
		setPopupList([]);
		setTotalCount(0);
		refModal.current?.handlerOpen();
	};

	/**
	 * 협력사 조회 API 호출
	 * @param {boolean} isPopup 팝업여부
	 * @param {string} value 검색할 이름
	 * @param isMultiSelect 다중 선택 여부
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
			// skipCount: currentPageScr === 1 ? false : true,
		};

		if (isMultiSelect) {
			params.multiSelect = value;
		} else {
			params.name = value;
		}

		apiGetPartnerList(params).then(res => {
			if (!isPopup) {
				if (res.data.list.length == value.split(',').map(v => v.trim()).length) {
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
	 * @param {string} value 협력사 코드명
	 * @param {string} value2 다중 선택값
	 * @returns {void}
	 */
	const searchScroll = throttle((isPopup: boolean, value1: string, value2: string, pageScr?: number): void => {
		const tt = (pageScr || currentPageScr) - 1;
		const params = {
			name: value1,
			multiSelect: value2,
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			// skipCount: currentPageScr === 1 ? false : true,
		};

		apiGetPartnerList(params).then(res => {
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
			startRow: 0,
			listCount: 500,
			skipCount: true,
		};

		setDropdownData([]);
		apiGetPartnerList(params).then(res => {
			if (res.data.list.length === 1) {
				settingSelectData(res.data.list);
			} else if (res.data.list.length > 0) {
				const tempList = [];
				for (const item of res.data.list) {
					tempList.push(item);
				}
				setDropdownData(tempList);
				setDropdownOpen(true);
			} else if (res.data.list.length === 0) {
				refModal.current.handlerOpen();
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

		// 선택 후 콜백 실행
		if (onConfirm) {
			onConfirm(val);
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
	};

	/**
	 * 드롭다운에서 항목 선택 시
	 * @param val
	 */
	const handleDropdownClick = (val: any) => {
		if (returnValueFormat === 'code') {
			form.setFieldsValue({ [name]: val.code, [code]: val.code });
		} else {
			form.setFieldsValue({ [name]: commUtil.convertCodeWithName(val.code, val.name), [code]: val.code });
		}
		setDropdownOpen(false);

		// 드롭다운 선택 후 콜백 실행
		if (onConfirm) {
			onConfirm([val]);
		}
	};

	/**
	 * 검색결과 INPUT 하단 커스텀 그리드
	 * @returns {object} HTML
	 */
	const dropdownRenderFormat = (): JSX.Element => {
		return (
			<div className="dropdown-content">
				<table className="data-table">
					<thead>
						<tr>
							{/* 협력사 코드 */}
							<th>{t('lbl.CUSTKEY_KP')}</th>
							{/* 협력사명 */}
							<th>{t('lbl.CUSTNAME_KP')}</th>
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
			const multiSelectParam = popupForm.getFieldValue('multiSelect');
			searchScroll(true, param, multiSelectParam);
		}
	}, [currentPageScr]);

	useEffect(() => {
		const handleClickOutside = (e: any) => {
			if (e.target?.id !== 'dropdownTable' && e.target?.className !== 'dropdown-content') {
				// form.resetFields();
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
			<Dropdown
				placement="bottom"
				open={dropdownOpen}
				trigger={[]}
				popupRender={() =>
					DropdownRenderer(
						[
							{ key: 'code', title: t('lbl.CUSTKEY_KP') },
							{ key: 'name', title: t('lbl.CUSTNAME_KP') },
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
					label={label ?? t('lbl.VENDORCODENAME')}
					placeholder={t('msg.placeholder1', ['협력사코드 또는 이름'])}
					form={form}
					name={name}
					code={code}
					// defaultValue={value}
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
					allowClear={!props.disabled && commUtil.isEmpty(form.getFieldValue(name))} // suffix가 노출 안될때 CSS 틀어져서 임시적으로 사용
					required={props.required ?? props.required}
					rules={[{ required: props.required, validateTrigger: 'none' }]}
					disabled={props.disabled ?? props.disabled}
					className={props.className ?? props.className}
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
					autoComplete="off"
				/>
			</Dropdown>
			<CustomModal ref={refModal} width="1280px">
				<CmPartnerPopup
					callBack={confirmEvent}
					close={closeEvent}
					searchName={form.getFieldValue(code)?.includes(',') ? form.getFieldValue(code) : form.getFieldValue(name)}
					gridData={popupList}
					search={searchScroll}
					selectionMode={selectionMode || 'singleRow'}
					setCurrentPage={setCurrentPageScr}
					totalCount={totalCount}
					gridRef={gridRef}
					form={popupForm}
					name={name}
					currentPage={currentPageScr}
				/>
			</CustomModal>
		</>
	);
};

export default CmPartnerSearch;
