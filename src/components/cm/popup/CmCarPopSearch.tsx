// ############################################################################
// # File        : CmCarPopSearch.tsx
// # Description : 차량 정보 선택 공통 컴포넌트 (검색 조건 + 셀 팝업 통합)
// # Author      : ParkJinWoo
// # Since       : 2025.05.14
// ############################################################################

// lib
import { CloseCircleFilled } from '@ant-design/icons';
import { Dropdown, Form } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// utils
import commUtil from '@/util/commUtil';
import Constants from '@/util/constants';
import { showAlert } from '@/util/MessageUtil';

// component
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';

// API Call Function
import { apiGetCarPopList } from '@/api/cm/apiCmSearch';

// hook
import DropdownRenderer from '@/components/common/custom/DropdownRenderer';
import { usePopupSearchValue } from '@/hooks/cm/usePopupSearchValue';
import { useThrottle } from '@/hooks/useThrottle';

import CmCarPopPopup from '@/components/cm/popup/CmCarPopPopup';
import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { usePopupPasteTransform } from '@/hooks/cm/usePopupPasteTransform';

interface SearchCarPopProps {
	form: any;
	selectionMode?: string;
	name: string;
	code: string;
	returnValueFormat?: string;
	label?: string;
	required?: any;
	value?: string;
}

const CmCarPopSearch = (props: SearchCarPopProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form, selectionMode, name, code, returnValueFormat, label, required, value } = props;
	const [popupForm] = Form.useForm();

	const throttle = useThrottle();
	const pasteTransform = usePopupPasteTransform();
	const refModal = useRef(null);
	const gridRef = useRef(null);
	const dropdownBodyRef = useRef<HTMLTableSectionElement | null>(null);

	const [popupList, setPopupList] = useState([]);

	// scroll Paging
	const [currentPageScr, setCurrentPageScr] = useState(1);
	const [pageSizeScr] = useState(Constants.PAGE_INFO.PAGE_SIZE);
	const [totalCount, setTotalCount] = useState(0);

	const { t } = useTranslation();

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropdownData] = useState([]);
	const [multiSelectCount, setMultiSelectCount] = useState(0);

	/**
	 * =====================================================================
	 *  02. 함수
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
	 * @param {string} contractType 계약유형
	 * @returns {void}
	 */
	const getSearchApi = (isPopup: boolean, value: string, isMultiSelect: boolean, contractType?: string) => {
		if (value === '') {
			handleOpenPopup();
			return;
		}

		const tt = currentPageScr - 1;
		const params: any = {
			name: value,
			multiSelect: '',
			contractType: contractType,
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
		};

		if (isMultiSelect) {
			params.multiSelect = value;
		} else {
			params.name = value;
		}

		apiGetCarPopList(params).then(res => {
			if (!isPopup) {
				if (res.data.list.length === 1) {
					settingSelectData(res.data.list);
				} else {
					refModal.current?.handlerOpen();
				}
			} else {
				gridRef.current?.clearGridData();
			}

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
	 * @param {string} contractType 계약유형
	 * @returns {void}
	 */
	const searchScroll = throttle((isPopup: boolean, value1: string, value2: string, contractType?: string): void => {
		const tt = currentPageScr - 1;
		const params = {
			name: value1,
			multiSelect: value2,
			contractType: contractType,
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			skipCount: currentPageScr === 1 ? false : true,
		};

		apiGetCarPopList(params).then(res => {
			setPopupList(res.data.list);
			if (res.data.totalCount > -1) {
				setTotalCount(res.data.totalCount);
			}
		});
	}, 500);

	/**
	 * API 조회 - INPUT 하단 그리드
	 * @param value
	 * @param contractType
	 * @param {boolean} isForceSearch 강제 검색 여부
	 */
	const searchEnter = (value: string, contractType?: string, isForceSearch?: boolean) => {
		if (value === '' || (!isForceSearch && commUtil.isNotEmpty(form.getFieldValue(code)))) return;

		const params = {
			name: value,
			multiSelect: '',
			contractType: contractType,
			startRow: 0,
			listCount: 500,
			skipCount: true,
		};

		dropdownData.length = 0;
		apiGetCarPopList(params).then(res => {
			if (res.data.list.length === 1) {
				settingSelectData(res.data.list);
			} else if (res.data.list.length > 0) {
				for (const item of res.data.list) {
					dropdownData.push(item);
				}
				setDropdownOpen(true);
			} else if (res.data.list.length === 0) {
				refModal.current?.handlerOpen();
			}
		});
	};

	/**
	 * 버튼 클릭 검색
	 * @param param
	 * @param event
	 * @param source
	 */
	const onClickSearchButton = (param: string, event: any, source: any) => {
		if (source.source === 'clear') return;

		setPopupList([]);
		const contractType = form.getFieldValue('contractType');
		const isMultiSelect = param.split(',').length > 1;

		// 다중선택 제한 체크
		if (isMultiSelect && param.split(',').length > 999) {
			showAlert(null, t('msg.MSG_COM_ERR_056'));
			return;
		}

		if (event.key === 'Enter') {
			if (isMultiSelect) {
				getSearchApi(false, param, isMultiSelect, contractType);
			} else {
				searchEnter(param, contractType);
			}
		} else {
			handleOpenPopup();
		}
	};

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
			form.setFieldsValue({ [name]: searchCode, [code]: searchCode });
			// form.setFieldValue('area', searchName); // 조회박스에서 차량번호 팝업 선택 시 권역이 자동셋팅 주석처리
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
		setTotalCount(0);
		refModal.current?.handlerClose();
	};

	/**
	 * 팝업 확인 버튼
	 * @param params
	 */
	const confirmEvent = (params: any) => {
		setCurrentPageScr(1);
		refModal.current?.handlerClose();
		settingSelectData(params);
	};

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
	 * 다중선택 붙여넣기
	 * @param  {any} event 이벤트
	 */
	const handlePaste = (event: any) => {
		event.preventDefault(); // 기본 붙여넣기 동작 방지

		const pastedText = event.clipboardData.getData('text/plain').trim();
		let transformedText = pastedText.replace(/(?:\r\n|\r|\n)/g, ',');

		// 각 항목의 앞뒤 공백 제거
		transformedText = transformedText
			.split(',')
			.map((item: string) => item.trim())
			.filter((item: string) => item !== '') // 빈 문자열 제거
			.join(',');

		//transformedText 제일 끝 문자가 ','로 끝나면 제거
		if (transformedText.endsWith(',')) {
			transformedText = transformedText.slice(0, -1);
		}

		// 중복 문자열 제거
		transformedText = [...new Set(transformedText.split(','))].join(',');

		const multiCnt = transformedText.split(',').length;

		if (multiCnt > 999) {
			showAlert(null, t('msg.MSG_COM_ERR_056'));
			return;
		}

		setMultiSelectCount(multiCnt);
		form.setFieldsValue({ [name]: transformedText });
	};

	/**
	 * 다중선택 입력 변경 시
	 * @param e
	 */
	const onChangeMultiSelect = (e: any) => {
		let value = e.target.value;
		if (value === '') {
			setMultiSelectCount(0);
			return;
		}

		//value 제일 끝 문자가 ','로 끝나면 제거하고 카운트
		if (value.endsWith(',')) {
			value = value.slice(0, -1);
		}

		const multiCnt = value.split(',').length;

		// 다중선택 개수 증가 예정
		if (multiCnt > 999) {
			showAlert(null, t('msg.MSG_COM_ERR_056'));
			return;
		}

		setMultiSelectCount(multiCnt);
	};

	/**
	 * 검색결과 INPUT 하단 커스텀 그리드
	 * @returns {object} HTML
	 */
	const dropdownRenderFormat = () => {
		return (
			<div className="dropdown-content">
				<table className="data-table">
					<thead>
						<tr>
							<th>POP번호</th>
							<th>차량번호</th>
							<th>운전자</th>
						</tr>
					</thead>
					<tbody>
						{dropdownData.map((item, index) => (
							<tr key={index} onClick={() => handleDropdownClick(item)}>
								<td id="dropdownTable">{item.name}</td>
								<td id="dropdownTable">{item.code}</td>
								<td id="dropdownTable">{item.driverName}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	usePopupSearchValue({ form, name, code, value });
	useCloseOnExternalScroll({
		open: dropdownOpen,
		onClose: () => setDropdownOpen(false),
		allowScrollRefs: [refModal],
	});

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/** 스크롤 이동 시 데이터 조회 */
	useEffect(() => {
		if (currentPageScr > 1) {
			const param = popupForm.getFieldValue(name);
			const multiSelect = popupForm.getFieldValue('multiSelect');
			const contractType = popupForm.getFieldValue('contractType');
			searchScroll(true, param, multiSelect, contractType);
		}
	}, [currentPageScr]);

	/** 외부 클릭 시 드롭다운 닫기 */
	useEffect(() => {
		const handleClickOutside = (e: any) => {
			if (e.target?.id !== 'dropdownTable' && e.target?.className !== 'dropdown-content') {
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
				// popupRender={dropdownRenderFormat}
				popupRender={() =>
					DropdownRenderer(
						[
							{ key: 'name', title: 'POP번호' },
							{ key: 'code', title: '차량번호' },
							{ key: 'driverName', title: '운전자' },
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
				<InputSearch
					label={label ?? '차량/POP 번호 조회'}
					placeholder={t('msg.placeholder1', ['코드 또는 이름'])}
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
					allowClear={commUtil.isEmpty(form.getFieldValue(name))} // suffix가 노출 안될때 CSS 틀어져서 임시적으로 사용
					required={required ?? required}
					rules={[{ required: required, validateTrigger: 'none' }]}
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

			{/* 팝업 */}
			<CustomModal ref={refModal} width="1280px">
				<CmCarPopPopup
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
					multiSelectCount={multiSelectCount}
					setMultiSelectCount={setMultiSelectCount}
					handlePaste={handlePaste}
					onChangeMultiSelect={onChangeMultiSelect}
				/>
			</CustomModal>
		</>
	);
};

export default CmCarPopSearch;
