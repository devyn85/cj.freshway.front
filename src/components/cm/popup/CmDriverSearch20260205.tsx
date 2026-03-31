/*
 ############################################################################
 # FiledataField : CmDriverSearch.tsx
 # Description   : 기사정보 조회 검색 컴포넌트
 # Author        : ParkJinWoo
 # Since         : 25.05.21
 ############################################################################
*/

// lib
import { CloseCircleFilled } from '@ant-design/icons';
import { Dropdown, Form } from 'antd';

// component
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';
import CmDriverPopup from './CmDriverPopup';

// api
import { apiGetCmDriverList } from '@/api/cm/apiCmSearch';

// hooks
import DropdownRenderer from '@/components/common/custom/DropdownRenderer';
import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { usePopupPasteTransform } from '@/hooks/cm/usePopupPasteTransform';
import { usePopupSearchValue } from '@/hooks/cm/usePopupSearchValue';
import { useThrottle } from '@/hooks/useThrottle';

/**
 * =====================================================================
 * 01. 변수 선언부
 * =====================================================================
 */
interface CmDriverSearch {
	form: any;
	selectionMode?: string;
	name: string;
	code: string;
	returnValueFormat?: string;
	value?: string;
	label?: string;
	required?: any;
	nameOnly?: boolean;
	disabled?: any;
}

const CmDriverSearch = (props: CmDriverSearch) => {
	const { form, selectionMode, name, code, returnValueFormat, label, value, nameOnly, disabled } = props;
	const [popupForm] = Form.useForm();

	const throttle = useThrottle();
	const pasteTransform = usePopupPasteTransform();
	const refModal = useRef(null);
	const gridRef = useRef(null);
	const dropdownBodyRef = useRef<HTMLTableSectionElement | null>(null);

	const [popupList, setPopupList] = useState([]);

	const [currentPageScr, setCurrentPageScr] = useState(1);
	const [pageSizeScr] = useState(constants.PAGE_INFO.PAGE_SIZE);
	const [totalCnt, setTotalCnt] = useState(0);

	const { t } = useTranslation();

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropdownData, setDropdownData] = useState<any[]>([]);

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
	 * 기사 데이터 조회 API 호출
	 * @param {boolean} isPopup 팝업 여부
	 * @param {string} value 검색어
	 * @param {boolean} isMultiSelect 다중 선택 여부
	 */
	const getSearchApi = (isPopup: boolean, value: string, isMultiSelect: boolean): void => {
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
		};

		if (isMultiSelect) {
			params.multiSelect = value;
		} else {
			params.name = value;
		}

		apiGetCmDriverList(params).then(res => {
			if (!isPopup) {
				if (res.data.list.length == value.split(',').map(v => v.trim()).length) {
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
	 * @param {boolean} isPopup 팝업 여부
	 * @param {string} value1 검색어
	 * @param {string} value2 다중 선택값
	 */
	const searchScroll = throttle((isPopup: boolean, value1: string, value2: string): void => {
		const tt = currentPageScr - 1;
		const params = {
			name: value1,
			multiSelect: value2,
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
		};

		apiGetCmDriverList(params).then(res => {
			setPopupList(res.data.list);
			if (res.data.totalCount > -1) {
				setTotalCnt(res.data.totalCount);
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

		const params = {
			name: value,
			multiSelect: '',
			startRow: 0,
			listCount: 500,
			skipCount: true,
		};

		setDropdownData([]);
		apiGetCmDriverList(params).then(res => {
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
				refModal.current?.handlerOpen();
			}
		});
	};

	/**
	 * 검색 버튼 클릭 시
	 * @param {string} param 검색 파라미터
	 * @param {any} event 이벤트 객체
	 * @param {any} source 소스 객체
	 */
	const onClickSearchButton = (param: string, event: any, source: any): void => {
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

	/**
	 * 조회 결과 저장
	 * @param {any} val 조회 결과 배열
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
		} else if (returnValueFormat === 'name') {
			form.setFieldsValue({ [name]: val[0].name, [code]: val[0].code, driver1: val[0].code });
		} else if (val.length > 1) {
			form.setFieldsValue({ [name]: `${val.length}건 선택`, [code]: searchCode });
		} else {
			form.setFieldsValue({ [name]: searchName, [code]: searchCode });
		}
	};

	usePopupSearchValue({ form, name, code, value });
	useCloseOnExternalScroll({
		open: dropdownOpen,
		onClose: () => setDropdownOpen(false),
		allowScrollRefs: [refModal],
	});

	/**
	 * 팝업 닫기 이벤트
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
	 * @param {any} params 확인된 데이터
	 */
	const confirmEvent = (params: any): void => {
		setCurrentPageScr(1);
		refModal.current?.handlerClose();
		settingSelectData(params);
	};

	/**
	 * 드롭다운 렌더링 포맷
	 * @returns 드롭다운 컴포넌트
	 */
	const dropdownRenderFormat = () => {
		return (
			<div className="dropdown-content">
				<table className="data-table">
					<thead>
						<tr>
							<th>기사ID</th>
							<th>기사명</th>
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
	 * 드롭다운에서 항목 선택 시
	 * @param {any} val 선택된 항목 데이터
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
	 * =====================================================================
	 * 03. react hook event
	 * 예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		if (currentPageScr > 1) {
			const param = popupForm.getFieldValue(name);
			searchScroll(true, param, '');
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
							{ key: 'code', title: '기사ID' },
							{ key: 'name', title: '기사명' },
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
					label={label ?? '기사 ID/명'}
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
						if (
							!nameOnly &&
							!dropdownOpen &&
							commUtil.isEmpty(form.getFieldValue(code)) &&
							!refModal.current?.getIsOpen()
						) {
							form.setFieldValue(name, '');
						}
					}}
					allowClear={!disabled && commUtil.isEmpty(form.getFieldValue(name))} // suffix가 노출 안될때 CSS 틀어져서 임시적으로 사용
					readOnly={commUtil.isNotEmpty(form.getFieldValue(code))}
					suffix={
						!disabled && commUtil.isNotEmpty(form.getFieldValue(name)) ? (
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
					required={props.required}
					// disabled={disabled}
				/>
			</Dropdown>
			<CustomModal ref={refModal} width="1280px">
				<CmDriverPopup
					callBack={confirmEvent}
					close={closeEvent}
					searchName={form.getFieldValue(code)?.includes(',') ? form.getFieldValue(code) : form.getFieldValue(name)}
					gridData={popupList}
					search={searchScroll}
					selectionMode={selectionMode ? selectionMode : 'singleRow'}
					setCurrentPage={setCurrentPageScr}
					gridRef={gridRef}
					form={popupForm}
					name={name}
					totalCnt={totalCnt}
				/>
			</CustomModal>
		</>
	);
};

export default CmDriverSearch;
