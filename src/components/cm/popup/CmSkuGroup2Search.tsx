/*
 ############################################################################
 # FiledataField : CmSkuGroup2Search.tsx
 # Description   : 상품그룹 2 조회 검색 컴포넌트
 # Author        : ParkJinWoo
 # Since         : 25.05.21
 ############################################################################
*/

// lib
import { CloseCircleFilled } from '@ant-design/icons';
import { Dropdown, Form } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// utils
import Constants from '@/util/constants';

// component
import CmSkuGroup2Popup from '@/components/cm/popup/CmSkuGroup2Popup';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';

// api
import { apiGetCmSkuGroup2List } from '@/api/cm/apiCmSearch';

// hooks
import DropdownRenderer from '@/components/common/custom/DropdownRenderer';
import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { usePopupSearchValue } from '@/hooks/cm/usePopupSearchValue';
import { useThrottle } from '@/hooks/useThrottle';

// utils
import { showAlert } from '@/util/MessageUtil';

/**
 * =====================================================================
 * 01. 변수 선언부
 * =====================================================================
 */
interface CmSkuGroup2Search {
	form: any;
	selectionMode?: string;
	name: string;
	code: string;
	returnValueFormat?: string;
	value?: string;
	label?: string;
	required?: any;
}

const CmSkuGroup2Search = forwardRef((props: CmSkuGroup2Search, ref: any) => {
	const { form, selectionMode, name, code, returnValueFormat, label, required, value } = props;
	const [popupForm] = Form.useForm();
	const throttle = useThrottle();
	const refModal = useRef(null);
	const gridRef = useRef(null);
	const [popupList, setPopupList] = useState([]);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropdownData, setDropdownData] = useState<any[]>([]);
	// scroll Paging
	const [currentPageScr, setCurrentPageScr] = useState(1);
	const [pageSizeScr] = useState(Constants.PAGE_INFO.PAGE_SIZE);
	const [totalCnt, setTotalCnt] = useState(0);
	const { t } = useTranslation();
	const dropdownBodyRef = useRef<HTMLTableSectionElement | null>(null);

	/**
	 * =====================================================================
	 * 02. 함수
	 * =====================================================================
	 */

	const handleOpenPopup = () => {
		setPopupList([]);
		setTotalCnt(0);
		refModal.current?.handlerOpen();
	};

	/**
	 * API 호출하여 데이터 조회
	 * @param {boolean} isPopup - 팝업 여부
	 * @param {string} value - 검색어
	 * @param {boolean} isMultiSelect - 다중선택 여부
	 * @returns {void}
	 */
	const getSearchApi = (isPopup: boolean, value: string, isMultiSelect: boolean): void => {
		const tt = currentPageScr - 1;
		const params: any = {
			searchVal: value,
			multiSelect: '',
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			specClass: 'MC',
			gStorerKey: 'FW00',
		};

		if (isMultiSelect) {
			params.multiSelect = value;
		} else {
			params.searchVal = value;
		}

		apiGetCmSkuGroup2List(params).then(res => {
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
				setTotalCnt(res.data.totalCount);
			}
		});
	};

	/**
	 * API 조회 - 그리드 스크롤
	 * @param {boolean} isPopup 팝업여부
	 * @param {string} value1 검색할 이름
	 * @param {string} value2 다중 선택 값
	 * @returns {void}
	 */
	const searchScroll = throttle((isPopup: boolean, value1: string, value2: string): void => {
		const tt = currentPageScr - 1;
		const params = {
			searchVal: value1,
			multiSelect: value2,
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			specClass: 'MC',
		};

		apiGetCmSkuGroup2List(params).then(res => {
			setPopupList(res.data.list);
			if (res.data.totalCount > -1) {
				setTotalCnt(res.data.totalCount);
			}
		});
	}, 500);

	/**
	 * 엔터 입력 시 조회
	 * @param {string} value - 검색어
	 * @param {boolean} isForceSearch 강제 검색 여부
	 * @returns {void}
	 */
	const searchEnter = (value: string, isForceSearch?: boolean): void => {
		if (value === '' || (!isForceSearch && commUtil.isNotEmpty(form.getFieldValue(code)))) return;

		const params = {
			searchVal: value,
			multiSelect: '',
			specClass: 'MC',
			startRow: 0,
			listCount: 500,
			skipCount: true,
		};

		dropdownData.length = 0;
		apiGetCmSkuGroup2List(params).then(res => {
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
	 * 버튼 클릭 검색
	 * @param {string} param - 검색 파라미터
	 * @param {any} event - 이벤트
	 * @param {any} source - source
	 * @returns {void}
	 */
	const onClickSearchButton = (param: string, event: any, source: any): void => {
		if (source.source === 'clear') return;
		setPopupList([]);
		const isMultiSelect = param.split(',').length > 1;

		// 다중선택 제한 체크
		if (isMultiSelect && param.split(',').length > 5000) {
			showAlert(null, t('msg.maxMultiSelect'));
			return;
		}

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
	 * @param {any[]} val - 선택된 값들
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
	};

	/**
	 * 팝업 닫기 이벤트
	 * @returns {void}
	 */
	const closeEvent = (): void => {
		// 의미없는 값 삭제
		if (commUtil.isEmpty(form.getFieldValue(code))) {
			form.setFieldsValue({ [name]: '' });
		}
		setCurrentPageScr(1);
		setTotalCnt(0);
		refModal.current?.handlerClose();
	};

	/**
	 * 팝업 확인 이벤트
	 * @param {any} params - 선택된 데이터
	 * @returns {void}
	 */
	const confirmEvent = (params: any): void => {
		setCurrentPageScr(1);
		refModal.current?.handlerClose();
		settingSelectData(params);
	};

	/**
	 * 검색결과 INPUT 하단 커스텀 그리드 렌더링
	 * @returns {JSX.Element}
	 */
	const dropdownRenderFormat = (): JSX.Element => {
		return (
			<div className="dropdown-content">
				<table className="data-table">
					<thead>
						<tr>
							<th></th>
							<th>상품분류(세)</th>
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
	 * 검색결과 클릭 이벤트
	 * @param {any} val - 선택된 값
	 * @returns {void}
	 */
	const handleDropdownClick = (val: any): void => {
		form.setFieldsValue({
			[name]: returnValueFormat === 'code' ? val.code : commUtil.convertCodeWithName(val.code, val.name),
			[code]: val.code,
		});
		setDropdownOpen(false);
	};

	/**
	 * =====================================================================
	 * 03. react hook event
	 * 예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	usePopupSearchValue({ form, name, code, value });
	useCloseOnExternalScroll({
		open: dropdownOpen,
		onClose: () => setDropdownOpen(false),
		allowScrollRefs: [refModal],
	});

	useEffect(() => {
		if (currentPageScr > 1) {
			const param = popupForm.getFieldValue(name);
			searchScroll(true, param, '');
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

	useImperativeHandle(ref, () => ({ searchEnter }));

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
							{ key: 'code', title: '' },
							{ key: 'name', title: '상품분류(세)' },
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
				<div>
					<InputSearch
						placeholder={t('msg.placeholder1', ['코드 또는 이름'])}
						form={form}
						name={name}
						code={code}
						hidden={true}
						onSearch={onClickSearchButton}
						onBlur={() => {
							// 의미 없는 값 입력시 삭제
							if (!dropdownOpen && commUtil.isEmpty(form.getFieldValue(code)) && !refModal.current?.getIsOpen()) {
								form.setFieldValue(name, '');
							}
						}}
						allowClear={commUtil.isEmpty(form.getFieldValue(name))} // suffix가 노출 안될때 CSS 틀어져서 임시적으로 사용
						label={label ?? '세분류코드'}
						required={props.required ?? props.required}
						rules={[{ required: props.required, validateTrigger: 'none' }]}
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
				</div>
			</Dropdown>
			<CustomModal ref={refModal} width="1280px">
				<CmSkuGroup2Popup
					callBack={confirmEvent}
					close={closeEvent}
					searchName={form.getFieldValue(code)?.includes(',') ? form.getFieldValue(code) : form.getFieldValue(name)}
					selectionMode={selectionMode ? selectionMode : 'singleRow'}
				/>
			</CustomModal>
		</>
	);
});

export default CmSkuGroup2Search;
