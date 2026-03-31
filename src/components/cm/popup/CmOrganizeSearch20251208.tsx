/*
 ############################################################################
 # FiledataField	: CmCustSearch.tsx
 # Description		: 창고조회 팝업
 # Author			: jh.jang
 # Since			: 25.05.09
 ############################################################################
*/
// lib
import { CloseCircleFilled } from '@ant-design/icons';
import { Dropdown, Form } from 'antd';
// utils

// component
import CmOrganizePopup from '@/components/cm/popup/CmOrganizePopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';

// API Call Function
import { apiGetOrganizePopupList } from '@/api/cm/apiCmSearch';

import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { usePopupPasteTransform } from '@/hooks/cm/usePopupPasteTransform';
import { usePopupSearchValue } from '@/hooks/cm/usePopupSearchValue';
import { useThrottle } from '@/hooks/useThrottle';
import { useSelector } from 'react-redux';

interface SearchCustProps {
	form: any;
	label?: string;
	required?: boolean;
	selectionMode?: string;
	name: string;
	code: string;
	returnValueFormat?: string;
	dccode?: any;
	value?: string;
	disabled?: boolean;
	className?: any;
	dccodeDisabled?: boolean;
}

const CmOrganizeSearch20251208 = (props: SearchCustProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, label, required, selectionMode, name, code, returnValueFormat, dccode, value, dccodeDisabled } = props;
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

	const { t } = useTranslation();

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropdownData, setDropdownData] = useState<any[]>([]);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const handleOpenPopup = () => {
		setPopupList([]);
		setTotalCount(0);
		popupForm.setFieldValue('dccode', dccode ? dccode : gDccode);
		refModal.current?.handlerOpen();
	};

	/**
	 * API 조회
	 * @param {boolean} isPopup 팝업여부
	 * @param {string} value 검색할 이름
	 * @returns {void}
	 */
	const getSearchApi = (isPopup: boolean, value: string) => {
		if (value === '') {
			handleOpenPopup();
			return;
		}
		const tt = currentPageScr - 1;
		const params = {
			name: value,
			multiSelect: '',
			dccode: dccode ? dccode : gDccode,
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			// skipCount: currentPageScr === 1 ? false : true,
		};

		if (value.split(',').length > 1) {
			params.name = '';
			params.multiSelect = value;
		}

		apiGetOrganizePopupList(params).then(res => {
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
	 * @param {string} value 검색할 이름
	 * @returns {void}
	 */
	const searchScroll = throttle((isPopup: boolean, value1: string, value2: string) => {
		const tt = currentPageScr - 1;
		const params = {
			name: value1,
			multiSelect: value2,
			dccode: popupForm.getFieldValue('dccode') ? popupForm.getFieldValue('dccode') : dccode,
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			skipCount: currentPageScr === 1 ? false : true,
		};

		apiGetOrganizePopupList(params).then(res => {
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
		const params = {
			name: value,
			multiSelect: '',
			dccode: popupForm.getFieldValue('dccode') ? popupForm.getFieldValue('dccode') : dccode,
			startRow: 0,
			listCount: 500,
			skipCount: true,
		};

		setDropdownData([]);
		apiGetOrganizePopupList(params).then(res => {
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
	 * 버튼 클릭 검색
	 * @param {object} param 조회 param
	 * @param  {any} event 이벤트
	 * @param  {any} source clear, input
	 * @returns {void}
	 */
	const onClickSearchButton = (param: string, event: any, source: any) => {
		if (source.source === 'clear') {
			return;
		}
		setPopupList([]);
		if (event.key === 'Enter') {
			if (param.split(',').length > 1) {
				getSearchApi(false, param);
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
	 * @param {object} val 조회 결과 객체
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
			// readOnly 안되는 이슈 임시 해결
			form.setFieldsValue({ [name]: `${searchCode} `, [code]: searchCode });
			setTimeout(() => {
				form.setFieldsValue({ [name]: searchCode });
			});
		} else if (val.length > 1) {
			form.setFieldsValue({ [name]: `${val.length}건 선택`, [code]: searchCode });
		} else {
			form.setFieldsValue({ [name]: searchName, [code]: searchCode });
		}
	};

	/**
	 * 팝업 취소 버튼
	 */
	const closeEvent = () => {
		// 의미없는 값 삭제
		if (commUtil.isEmpty(form.getFieldValue(code))) {
			form.setFieldsValue({ [name]: '' });
		}
		setCurrentPageScr(1);
		popupForm.resetFields();
		setTotalCount(0);
		refModal.current?.handlerClose();
	};

	/**
	 * 팝업 확인 버튼
	 * @param {object} params Params
	 */
	const confirmEvent = (params: any) => {
		setCurrentPageScr(1);
		refModal.current?.handlerClose();
		settingSelectData(params);
	};

	/**
	 * 검색창 Focus out 이벤트
	 * @param {any} params Params
	 */
	// const onBlurEvent = (params: any) => {
	// 	if (form.getFieldValue(params.currentTarget.getAttribute('code')) === '' && !refModal.current.getIsOpen()) {
	// 		form.setFieldValue(params.currentTarget.getAttribute('name'), '');
	// 	}
	// };

	/**
	 *  검색결과 클릭
	 * @param {any} val 클릭한로우
	 */
	const handleDropdownClick = (val: any) => {
		if (returnValueFormat === 'code') {
			form.setFieldsValue({ [name]: val.code, [code]: val.code });
		} else {
			form.setFieldsValue({ [name]: commUtil.convertCodeWithName(val.code, val.name), [code]: val.code });
		}
		setDropdownOpen(false);
	};

	/**
	 * 검색결과 INPUT 하단 커스텀 그리드
	 * @returns {object} HTML
	 */
	const dropdownRenderFormat = () => {
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
			searchScroll(true, param);
		}
	}, [currentPageScr]);

	/**
	 * 외부 클릭 감지하여 드롭다운 닫기
	 * @param event
	 */
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

	return (
		<>
			<Dropdown
				placement="bottom"
				open={dropdownOpen}
				trigger={[]} // hover, click 방지 => 명시적으로 상태로만 열림
				popupRender={dropdownRenderFormat}
			>
				<InputSearch
					label={label ?? '창고'}
					placeholder={t('msg.placeholder1', [label ?? '창고' + '코드 또는 이름'])}
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
					allowClear={!props.disabled && commUtil.isEmpty(form.getFieldValue(name))} // suffix가 노출 안될때 CSS 틀어져서 임시적으로 사용
					// onBlur={onBlurEvent}
					className={props.className ?? props.className}
					required={required}
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
								}}
							/>
						) : null
					}
					autoComplete="off"
				/>
			</Dropdown>
			{/* 팝업 */}
			<CustomModal ref={refModal} width="1280px">
				<CmOrganizePopup
					callBack={confirmEvent}
					close={closeEvent}
					// searchName={form.getFieldValue(code) !== '' ? form.getFieldValue(code) : form.getFieldValue(name)}
					searchName={form.getFieldValue(code)?.includes(',') ? form.getFieldValue(code) : form.getFieldValue(name)}
					gridData={popupList}
					search={searchScroll}
					selectionMode={selectionMode ? selectionMode : 'singleRow'}
					setCurrentPage={setCurrentPageScr}
					totalCount={totalCount}
					gridRef={gridRef}
					form={popupForm}
					name={name}
					dccodeDisabled={dccodeDisabled}
				></CmOrganizePopup>
			</CustomModal>
		</>
	);
};

export default CmOrganizeSearch20251208;
