/*
 ############################################################################
 # FiledataField	: CmCustSearch.tsx
 # Description		: 거래처조회 팝업
 # Author			: jh.jang
 # Since			: 25.05.09
 ############################################################################
*/
// lib
import { CloseCircleFilled } from '@ant-design/icons';
import { Dropdown, Form } from 'antd';

// component
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';

// Util

// API Call Function

// Hooks
import { apiGetCustPopupList } from '@/api/ms/apiMSCustRedzone';
import CmCustRedZonePopup from '@/components/cm/popup/CmCustRedZonePopup';
import DropdownRenderer from '@/components/common/custom/DropdownRenderer';
import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { usePopupPasteTransform } from '@/hooks/cm/usePopupPasteTransform';
import { usePopupSearchValue } from '@/hooks/cm/usePopupSearchValue';
import { useThrottle } from '@/hooks/useThrottle';

interface SearchCustProps {
	form: any;
	selectionMode?: string;
	name: string;
	code: string;
	returnValueFormat?: string;
	label?: string;
	disabled?: any;
	required?: any;
	value?: string;
	className?: any;
	expandedColumns?: string;
	// labelChange?: string;
	owner?: string;
	selectedCode?: string;
	customDccode?: string | string[];
}

const CmCustRedZoneSearch = (props: SearchCustProps) => {
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
		disabled,
		value,
		expandedColumns = 'Y',
		// labelChange,
		owner,
		selectedCode,
		customDccode,
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

	const { t } = useTranslation();

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropdownData] = useState([]);

	const apiCustPopup = apiGetCustPopupList;

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * API 조회
	 * @param {boolean} isPopup 팝업여부
	 * @param {string|object} value 검색할 이름 또는 검색 파라미터 객체
	 * @returns {void}
	 */
	const getSearchApi = (isPopup: boolean, value: any) => {
		// value가 객체인 경우 (확장 모드)
		if (typeof value === 'object' && value !== null) {
			if (!value.name && !value.childCustSearchVal) {
				refModal.current?.handlerOpen();
				return;
			}
		} else if (value === '' || commUtil.isNotEmpty(form.getFieldValue(code))) {
			// commUtil.isNotEmpty(form.getFieldValue(code)) : 확정된 코드값이 있을 경우 2중 API 호출 방지
			refModal.current?.handlerOpen();
			return;
		}

		const tt = currentPageScr - 1;
		const params: any = {
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			// skipCount: currentPageScr === 1 ? false : true,
		};

		if (expandedColumns === 'Y') {
			params.expandedColumns = 'Y';

			// 확장 모드일 때 추가 검색 조건들 처리
			if (typeof value === 'object') {
				params.name = value.name || '';
				params.multiSelect = value.multiSelect || '';
				params.childCustSearchVal = value.childCustSearchVal || '';
			} else {
				params.name = value;
				//params.multiSelect = '';
				params.multiSelect = value;
			}
		} else {
			// 기본 모드
			const searchValue = typeof value === 'object' ? value.name : value;
			params.name = searchValue;
			params.multiSelect = '';

			if (searchValue && searchValue.split(',').length > 1) {
				params.name = '';
				params.multiSelect = form.getFieldValue(code) ? form.getFieldValue(code) : searchValue;
			}
		}

		apiCustPopup(params).then(res => {
			if (!isPopup) {
				if (res.data?.list?.length === 1) {
					settingSelectData(res.data);
				} else {
					refModal.current?.handlerOpen();
				}
			} else {
				gridRef.current?.clearGridData();
				refModal.current?.handlerOpen();
			}

			// 팝업 발생 후 데이터 적용 (확장 컬럼일 때 본점코드 숫자 변환)
			let processedList = res.data?.list;
			if (expandedColumns === 'Y' && processedList?.length > 0) {
				processedList = processedList.map((item: any) => ({
					...item,
					// dlvCustKey: item.dlvCustKey && !isNaN(Number(item.dlvCustKey)) ? Number(item.dlvCustKey) : -1,
				}));
			}
			setPopupList(processedList);
			if (res.data?.list?.length >= 0) {
				setTotalCount(res.data?.totalCount);
			}
		});
	};

	/**
	 * API 조회 - 그리드 스크롤
	 * @param {boolean} isPopup 팝업여부
	 * @param {string|object} value1 검색할 이름 또는 검색 파라미터 객체
	 * @param {string} value2 다중선택값 (기본 모드에서만 사용)
	 * @returns {void}
	 */
	const searchScroll = throttle((isPopup: boolean, value1: string | any, value2?: string) => {
		const tt = currentPageScr - 1;
		const params: any = {
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			skipCount: currentPageScr === 1 ? false : true,
		};

		params.expandedColumns = 'Y';

		params.name = value1.name || '';
		params.multiSelect = value1.multiSelect || '';
		params.childCustSearchVal = value1.childCustSearchVal || '';

		gridRef.current?.showColumnByDataField('saleCustKey');
		gridRef.current?.showColumnByDataField('saleName');
		gridRef.current?.showColumnByDataField('mngCustkey');
		gridRef.current?.showColumnByDataField('mngName');

		if (params.multiSelect === '') {
			gridRef.current?.showColumnByDataField('saleCustKey');
			gridRef.current?.showColumnByDataField('saleName');
			gridRef.current?.showColumnByDataField('mngCustkey');
			gridRef.current?.showColumnByDataField('mngName');
		}

		apiCustPopup(params).then(res => {
			// 확장 컬럼일 때 본점코드 숫자 변환 (스크롤 페이징)
			let processedList = res.data?.list;
			if (expandedColumns === 'Y' && processedList?.length > 0) {
				processedList = processedList.map((item: any) => ({
					...item,
					// dlvCustKey: item.dlvCustKey && !isNaN(Number(item.dlvCustKey)) ? Number(item.dlvCustKey) : -1,
				}));
			}
			setPopupList(processedList);
			if (res.data?.totalCount >= 0) {
				setTotalCount(res.data?.totalCount);
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

		const params: any = {
			name: value,
			multiSelect: '',
			startRow: 0,
			listCount: 500,
			skipCount: true,
		};

		// if (expandedColumns === 'Y') {
		// 	params.expandedColumns = 'Y';
		// }

		dropdownData.length = 0;
		apiCustPopup(params).then(res => {
			if (res.data?.list?.length === 0) {
				refModal.current?.handlerOpen();
			} else if (res.data?.list?.length === 1) {
				confirmEvent(res.data.list);
			} else if (res.data?.list?.length > 0) {
				for (const item of res.data?.list) {
					dropdownData.push(item);
				}
				setDropdownOpen(true);
			}
		});
	};

	usePopupSearchValue({ form, name, code, value });
	useCloseOnExternalScroll({
		open: dropdownOpen,
		onClose: () => setDropdownOpen(false),
		allowScrollRefs: [refModal],
	});

	/**
	 * 버튼 클릭 검색
	 * @param {string} param 조회 param
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
			getSearchApi(true, param);
		}
	};

	/**
	 * 조회 결과 저장
	 * @param {object} val 조회 결과 객체
	 * @param codeObject
	 * @returns {void}
	 */
	const settingSelectData = (val: any, codeObject?: any) => {
		if (codeObject) {
			val = [codeObject];
		}

		let searchName = commUtil.convertCodeWithName(val[0].code, val[0].name);
		let searchCode = val[0].code;
		const ownerTmp = val[0].owner;

		for (let i = 1; i < val.length; i++) {
			searchName += `,${commUtil.convertCodeWithName(val[i].code, val[i].name)}`;
			searchCode += ',' + val[i].code;
		}

		if (returnValueFormat === 'code') {
			form.setFieldsValue({ [name]: searchCode, [code]: searchCode });
		} else if (val.length > 1) {
			form.setFieldsValue({ [name]: `${val.length}건 선택`, [code]: searchCode });
		} else {
			form.setFieldsValue({ [name]: searchName, [code]: searchCode, [owner]: ownerTmp });
		}
	};

	/**
	 * 팝업 닫기 이벤트
	 */
	const closeEvent = () => {
		// 의미없는 값 삭제
		if (commUtil.isEmpty(form.getFieldValue(code))) {
			form.setFieldsValue({ [name]: '' });
		}
		setCurrentPageScr(1);
		popupForm.resetFields(); // 팝업 폼 초기화
		setTotalCount(0);
		refModal.current?.handlerClose();
	};

	/**
	 * 팝업 확인 버튼
	 * @param {object} params Params
	 * @param codeObject
	 */
	const confirmEvent = (params: any, codeObject?: any) => {
		setCurrentPageScr(1);
		refModal.current?.handlerClose();
		settingSelectData(params, codeObject);
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
			form.setFieldsValue({
				[name]: commUtil.convertCodeWithName(val.code, val.name),
				[code]: val.code,
				[owner]: val.owner,
			});
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
			if (expandedColumns === 'Y') {
				// 확장 모드일 때 모든 검색 조건을 객체로 전달
				const searchParams = {
					name: popupForm.getFieldValue(name),
					multiSelect: popupForm.getFieldValue('multiSelect'),
					childCustSearchVal: popupForm.getFieldValue('childCustSearchVal'),
				};
				searchScroll(true, searchParams);
			} else {
				// 기본 모드
				const param = popupForm.getFieldValue(name);
				const multiSelectParam = popupForm.getFieldValue('multiSelect');
				searchScroll(true, param, multiSelectParam);
			}
		}
	}, [currentPageScr, expandedColumns]);

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

	/**
	 * selectedCode, customDccode가 있을 때 초기 선택 상태로 설정
	 */
	useEffect(() => {
		if (selectedCode && commUtil.isEmpty(form.getFieldValue(code))) {
			const params: any = {
				gMultiDccode: customDccode ? (Array.isArray(customDccode) ? customDccode.join(',') : customDccode) : '',
				multiSelect: selectedCode,
				startRow: 0,
				listCount: 1,
			};

			if (expandedColumns === 'Y') {
				params.expandedColumns = 'Y';
			}

			apiCustPopup(params).then(res => {
				if (res.data?.list?.length > 0) {
					settingSelectData(res.data.list);
				}
			});
		}
	}, [selectedCode]);

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
				trigger={[]} // hover, click 방지 => 명시적으로 상태로만 열림
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
				<InputSearch
					placeholder={t('msg.placeholder1', [`${label ? label : '고객코드'} 또는 이름`])}
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
					label={label ?? t('lbl.CUSTCODENAME')}
					required={required ?? required}
					disabled={disabled}
					className={props.className ?? props.className}
					rules={[{ required: props.required, validateTrigger: 'none' }]}
					// className="bg-white"
					// onBlur={onBlurEvent}
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
				<CmCustRedZonePopup
					callBack={confirmEvent}
					close={closeEvent}
					searchName={
						String(form.getFieldValue(code) || '').includes(',') ? form.getFieldValue(code) : form.getFieldValue(name)
					}
					gridData={popupList}
					search={searchScroll}
					selectionMode={selectionMode || 'multipleRows'}
					setCurrentPage={setCurrentPageScr}
					totalCount={totalCount}
					gridRef={gridRef}
					form={popupForm}
					name={name}
					expandedColumns={expandedColumns}
					// labelChange={labelChange}
					setTotalCount={setTotalCount}
				/>
			</CustomModal>
		</>
	);
};

export default CmCustRedZoneSearch;
