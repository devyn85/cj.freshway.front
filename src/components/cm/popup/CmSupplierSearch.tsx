/*
 ############################################################################
 # FiledataField	: CmSupplierSearch.tsx
 # Description		: 협력사 조회 팝업
 # Author			: KimSunHo	
 # Since			: 25.08.09
 ############################################################################
*/
// lib
import { CloseCircleFilled } from '@ant-design/icons';
import { Dropdown, Form } from 'antd';
// utils
import Constants from '@/util/constants';
// component
import CmSupplierPopup from '@/components/cm/popup/CmSupplierPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';

// API Call Function

import { apiGetSupplierList } from '@/api/cm/apiCmSearch';
import DropdownRenderer from '@/components/common/custom/DropdownRenderer';
import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { usePopupPasteTransform } from '@/hooks/cm/usePopupPasteTransform';
import { usePopupSearchValue } from '@/hooks/cm/usePopupSearchValue';
import { useThrottle } from '@/hooks/useThrottle';

interface SearchProps {
	form: any;
	selectionMode?: string;
	name: string;
	code: string;
	paymentTerm: string;
	paymentTermName: string;
	paymentTermCdName: string;
	vatno: string;
	returnValueFormat?: string;
	value?: string;
	label?: string;
	isResetForm: boolean;
	required?: any;
	disabled?: any;
	draggable?: boolean;
}

const CmSupplierSearch = (props: SearchProps) => {
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
		paymentTerm,
		paymentTermName,
		paymentTermCdName,
		vatno,
		returnValueFormat,
		value,
		label,
		isResetForm,
		required,
		disabled,
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
	const [pageSizeScr] = useState(Constants.PAGE_INFO.PAGE_SIZE);
	const [totalCount, setTotalCount] = useState(0);

	const { t } = useTranslation();

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropdownData] = useState([]);

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
	 * @returns {void}
	 */
	const getSearchApi = (isPopup: boolean, value: string) => {
		if (value === '') {
			// 검색어가 없을 경우 팝업 호출
			handleOpenPopup();
			return;
		}

		const tt = currentPageScr - 1;
		const params = {
			name: value,
			multiSelect: '',
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			skipCount: currentPageScr === 1 ? false : true,
		};

		if (value.split(',').length > 1) {
			params.name = '';
			params.multiSelect = form.getFieldValue(code) ? form.getFieldValue(code) : value;
		}

		apiGetSupplierList(params).then(res => {
			if (!isPopup) {
				if (res.data.length === 1) {
					settingSelectData(res.data[0]);
				} else {
					refModal.current?.handlerOpen();
				}
			}
			gridRef.current?.clearGridData();

			// 팝업 발생 후 데이터 적용
			setPopupList(res.data);

			//if (res.data.totalCount > -1) {
			//	setTotalCount(res.data.totalCount);
			//}
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
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			skipCount: currentPageScr === 1 ? false : true,
		};

		apiGetSupplierList(params).then(res => {
			setPopupList(res.data);

			//if (res.data.totalCount > -1) {
			//setTotalCount(res.data.totalCount);
			//}
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
			startRow: 0,
			listCount: 500,
			skipCount: true,
		};

		dropdownData.length = 0;
		apiGetSupplierList(params).then(res => {
			if (res.data.length === 1) {
				settingSelectData(res.data);
			} else if (res.data.length > 0) {
				for (const item of res.data) {
					dropdownData.push(item);
				}
				setDropdownOpen(true);
			}
		});
	};

	/**
	 * 버튼 클릭 검색
	 * @param {object} param 조회 param
	 * @param {any} event 이벤트
	 * @param {any} source
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

	/**
	 * 조회 결과 저장
	 * @param {object} val 선택된 객체
	 * @returns {void}
	 */
	const settingSelectData = (val: any) => {
		let searchName = commUtil.convertCodeWithName(val[0].code, val[0].name);
		let searchCode = val[0].code;
		let searchPaymentTerm = val[0].paymentTerm ?? '';
		let searchPaymentTermName = val[0].paymentTermName ?? '';
		let searchVato = val[0].vatno ?? '';
		let searchPaymentTermCdName = '';
		if (!commUtil.isEmpty(searchPaymentTerm)) {
			searchPaymentTermCdName = `[${val[0].paymentTerm}]${val[0].paymentTermName}`;
		}

		for (let i = 1; i < val.length; i++) {
			searchName += `,${commUtil.convertCodeWithName(val[i].code, val[i].name)}`;
			searchCode += ',' + val[i].code;
			searchPaymentTerm += ',' + val[i].paymentTerm;
			searchPaymentTermName += ',' + val[i].paymentTermName;
			searchPaymentTermCdName += `,[${val[i].paymentTerm}]${val[i].paymentTermName}`;
			searchVato += ',' + val[i].vatno;
		}

		if (returnValueFormat === 'code') {
			form.setFieldsValue({
				[name]: searchCode,
				[code]: searchCode,
				[paymentTerm]: searchPaymentTerm,
				[paymentTermName]: searchPaymentTermName,
				[paymentTermCdName]: searchPaymentTermCdName,
				[vatno]: searchVato,
			});
		} else if (val.length > 1) {
			form.setFieldsValue({
				[name]: `${val.length}건 선택`,
				[code]: searchCode,
				[paymentTerm]: searchPaymentTerm,
				[paymentTermName]: searchPaymentTermName,
				[paymentTermCdName]: searchPaymentTermCdName,
				[vatno]: searchVato,
			});
		} else {
			form.setFieldsValue({
				[name]: searchName,
				[code]: searchCode,
				[paymentTerm]: searchPaymentTerm,
				[paymentTermName]: searchPaymentTermName,
				[paymentTermCdName]: searchPaymentTermCdName,
				[vatno]: searchVato,
			});
		}

		// 팝업에서 선택된 값 표시
		// //console.log('settingSelectData >> ', searchCode);
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
		if (isResetForm) {
			form.resetFields();
		}
		setTotalCount(0);
		refModal.current?.handlerClose();
	};

	/**
	 * 팝업 확인 버튼
	 * @param {object} params Request Params
	 */
	const confirmEvent = (params: any) => {
		setCurrentPageScr(1);
		refModal.current?.handlerClose();
		settingSelectData(params);
	};

	usePopupSearchValue({ form, name, code, value });
	useCloseOnExternalScroll({
		open: dropdownOpen,
		onClose: () => setDropdownOpen(false),
		allowScrollRefs: [refModal],
	});

	/**
	 *  검색결과 클릭
	 * @param {any} val 클릭한 로우
	 */
	const handleDropdownClick = (val: any) => {
		const searchName = commUtil.convertCodeWithName(val.code, val.name);
		const searchCode = val.code;
		const searchPaymentTerm = val.paymentTerm ?? '';
		const searchPaymentTermName = val.paymentTermName ?? '';
		const searchVato = val.vatno ?? '';
		let searchPaymentTermCdName = '';
		if (!commUtil.isEmpty(searchPaymentTerm)) {
			searchPaymentTermCdName = `[${val.paymentTerm}]${val.paymentTermName}`;
		}

		form.setFieldsValue({
			[name]: searchName,
			[code]: searchCode,
			[paymentTerm]: searchPaymentTerm,
			[paymentTermName]: searchPaymentTermName,
			[paymentTermCdName]: searchPaymentTermCdName,
			[vatno]: searchVato,
		});
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
									<th>{t('lbl.CUSTKEY_KP')}</th>
									<th>{t('lbl.CUSTNAME_KP')}</th>
									<th>{t('lbl.VATNO_1')}</th>
								</tr>
							</thead>
							<tbody>
								{dropdownData.map((item, index) => (
									<tr key={index} onClick={() => handleDropdownClick(item)}>
										<td id="dropdownTable">{item.code}</td>
										<td id="dropdownTable">{item.name}</td>
										<td id="dropdownTable">{item.vatno}</td>
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
			if (e.target?.id !== 'dropdownTable') {
				if (isResetForm) {
					form.resetFields();
				}
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
			{/* 팝업 */}
			<Dropdown
				placement="bottom"
				open={dropdownOpen}
				trigger={[]} // hover, click 방지 => 명시적으로 상태로만 열림
				popupRender={() =>
					DropdownRenderer(
						[
							{ key: 'code', title: t('lbl.CUSTKEY_KP') },
							{ key: 'name', title: t('lbl.CUSTNAME_KP') },
							{ key: 'vatno', title: t('lbl.VATNO_1') },
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
					allowClear={!props.disabled && commUtil.isEmpty(form.getFieldValue(name))} // suffix가 노출 안될때 CSS 틀어져서 임시적으로 사용
					label={label ?? t('Supplier')}
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
					autoComplete="off"
				/>
			</Dropdown>
			<CustomModal ref={refModal} width="1280px" draggable={props.draggable}>
				<CmSupplierPopup
					callBack={confirmEvent}
					close={closeEvent}
					searchName={form.getFieldValue(code)?.includes(',') ? form.getFieldValue(code) : form.getFieldValue(code)}
					gridData={popupList}
					search={searchScroll}
					selectionMode={selectionMode || 'singleRow'} //multipleRows
					setCurrentPage={setCurrentPageScr}
					totalCount={totalCount}
					gridRef={gridRef}
					form={popupForm}
					name={name}
				></CmSupplierPopup>
			</CustomModal>
		</>
	);
};

export default CmSupplierSearch;
