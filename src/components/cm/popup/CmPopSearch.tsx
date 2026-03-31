/*
 ############################################################################
 # FiledataField	: CmPopSearch.tsx
 # Description		: POP 조회 팝업
 # Author			: Assistant
 # Since			: 25.11.17
 ############################################################################
*/
// lib
import { CloseCircleFilled } from '@ant-design/icons';
import { Dropdown, Form } from 'antd';

// utils
import Constants from '@/util/constants';

// component
import CmPopPopup from '@/components/cm/popup/CmPopPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';

// API Call Function
import { apiGetPopList } from '@/api/cm/apiCmPop';

import DropdownRenderer from '@/components/common/custom/DropdownRenderer';
import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { usePopupPasteTransform } from '@/hooks/cm/usePopupPasteTransform';
import { usePopupSearchValue } from '@/hooks/cm/usePopupSearchValue';
import { useThrottle } from '@/hooks/useThrottle';
import { useAppSelector } from '@/store/core/coreHook';

interface SearchPopProps {
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
	customDccode?: string; // 커스텀 물류센터 코드
	onConfirm?: (selected: any[]) => void; // 선택 후 콜백
}

const CmPopSearch = (props: SearchPopProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, selectionMode, name, code, returnValueFormat, label, required, value, customDccode, onConfirm } = props;
	const [popupForm] = Form.useForm();

	const throttle = useThrottle();
	const pasteTransform = usePopupPasteTransform();
	const user = useAppSelector(state => state.user.userInfo); // 사용자 정보

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
		popupForm.setFieldsValue({ dcCodeSelect: customDccode || user?.defDccode }); // 물류센터 기본값 설정
		refModal.current?.handlerOpen();
	};

	/**
	 * POP 조회 API 호출
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
			dcCode: customDccode || user?.defDccode,
			popCode: value,
			multiSelect: '',
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
		};

		if (isMultiSelect) {
			params.multiSelect = value;
			params.popCode = '';
		} else {
			params.popCode = value;
		}

		apiGetPopList(params).then((res: any) => {
			// [페이징 로직 제거] 기존: res.data.list 변경: res.data (배열 직접 반환)
			const dataList = res.data || [];

			if (!isPopup) {
				// if (res.data.list.length == value.split(',').map(v => v.trim()).length) {
				if (dataList.length == value.split(',').map(v => v.trim()).length) {
					// settingSelectData(res.data.list);
					settingSelectData(dataList);
				} else {
					refModal.current?.handlerOpen();
				}
			} else {
				gridRef.current?.clearGridData();
			}
			// 팝업 발생 후 데이터 적용
			// setPopupList(res.data.list);
			setPopupList(dataList);
			// [페이징 로직 제거] 기존: res.data.totalCount 변경: res.data.length
			// if (res.data.totalCount > -1) {
			// 	setTotalCount(res.data.totalCount);
			// }
			setTotalCount(dataList.length);
		});
	};

	/**
	 * API 조회 - 그리드 스크롤
	 * @param {boolean} isPopup 팝업여부
	 * @param {string} value1 POP 코드
	 * @param {string} value2 다중 선택값
	 * @returns {void}
	 */
	const searchScroll = throttle((isPopup: boolean, value1: string, value2: string): void => {
		const tt = currentPageScr - 1;
		const params = {
			dcCode: popupForm.getFieldValue('dcCodeSelect') || customDccode || user?.defDccode,
			popCode: value1,
			multiSelect: value2,
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
		};

		apiGetPopList(params).then((res: any) => {
			// [페이징 로직 제거] 기존: res.data.list 변경: res.data (배열 직접 반환)
			const dataList = res.data || [];
			// setPopupList(res.data.list);
			setPopupList(dataList);
			// [페이징 로직 제거] 기존: res.data.totalCount 변경: res.data.length
			// if (res.data.totalCount > -1) {
			// 	setTotalCount(res.data.totalCount);
			// }
			setTotalCount(dataList.length);
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
			dcCode: customDccode || user?.defDccode,
			popCode: value,
			multiSelect: '',
			startRow: 0,
			listCount: 500,
		};

		setDropdownData([]);
		apiGetPopList(params).then((res: any) => {
			// [페이징 로직 제거] 기존: res.data.list 변경: res.data (배열 직접 반환)
			const dataList = res.data || [];

			if (dataList.length === 1) {
				settingSelectData(dataList);
			} else if (dataList.length > 0) {
				const tempList = [];
				for (const item of dataList) {
					tempList.push(item);
				}
				setDropdownData(tempList);
				setDropdownOpen(true);
			} else if (dataList.length === 0) {
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
		let searchName = `[${val[0].popCode}]${val[0].districtName || ''}`;
		let searchCode = val[0].popCode;

		for (let i = 1; i < val.length; i++) {
			searchName += `,[${val[i].popCode}]${val[i].districtName || ''}`;
			searchCode += ',' + val[i].popCode;
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
			form.setFieldsValue({ [name]: val.popCode, [code]: val.popCode });
		} else {
			form.setFieldsValue({ [name]: `[${val.popCode}]${val.districtName || ''}`, [code]: val.popCode });
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
							{/* POP */}
							<th>{t('lbl.LBL_DELIVERYGROUP')}</th>
							{/* 권역명 */}
							<th>{t('lbl.DISTRICTNAME')}</th>
						</tr>
					</thead>
					<tbody>
						{dropdownData.map((item, index) => (
							<tr key={index} onClick={() => handleDropdownClick(item)}>
								<td id="dropdownTable">{item.popCode}</td>
								<td id="dropdownTable">{item.districtName}</td>
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
			const param = popupForm.getFieldValue('popCode');
			const multiSelectParam = popupForm.getFieldValue('multiSelect');
			searchScroll(true, param, multiSelectParam);
		}
	}, [currentPageScr]);

	useEffect(() => {
		const handleClickOutside = (e: any) => {
			if (e.target?.id !== 'dropdownTable' && e.target?.className !== 'dropdown-content') {
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
							{ key: 'popCode', title: t('lbl.LBL_DELIVERYGROUP') },
							{ key: 'districtName', title: t('lbl.DISTRICTNAME') },
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
					label={label ?? t('lbl.LBL_DELIVERYGROUP')}
					placeholder={t('msg.placeholder1', ['POP코드 또는 권역명'])}
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
					allowClear={!props.disabled && commUtil.isEmpty(form.getFieldValue(name))}
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
				<CmPopPopup
					callBack={confirmEvent}
					close={closeEvent}
					searchName={form.getFieldValue(code)?.includes(',') ? form.getFieldValue(code) : form.getFieldValue(name)}
					selectionMode={selectionMode || 'singleRow'}
					customDccode={customDccode}
				/>
			</CustomModal>
		</>
	);
};

export default CmPopSearch;
