/*
 ############################################################################
 # FiledataField	: CmPurchaseBuyerHstSearch.tsx
 # Description		: 수급담당 변경이력 조회 팝업
 # Author			: 
 # Since			: 25.05.14
 ############################################################################
*/

// lib
import { CloseCircleFilled } from '@ant-design/icons';
import { Dropdown, Form } from 'antd';

// component
import CmPurchaseBuyerHstPopup from '@/components/cm/popup/CmPurchaseBuyerHstPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';

// utils
import Constants from '@/util/constants';

// API Call Function
import { apiGetPurchaseBuyerHstList } from '@/api/cm/apiCmPurchaseBuyerHstPopup';

import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { usePopupSearchValue } from '@/hooks/cm/usePopupSearchValue';
import { useThrottle } from '@/hooks/useThrottle';
import { useSelector } from 'react-redux';

interface SearchPurchaseBuyerHstProps {
	form: any;
	selectionMode?: string;
	name: string;
	code: string;
	returnValueFormat?: string;
	sku?: string;
}

const CmPurchaseBuyerHstSearch = (props: SearchPurchaseBuyerHstProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, selectionMode, name, code, returnValueFormat, sku } = props;
	const [popupForm] = Form.useForm();

	const throttle = useThrottle();
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const refModal = useRef(null);
	const gridRef = useRef(null);

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
	 * @param isMultiSelect 다중 선택 여부
	 * @returns {void}
	 */
	const getSearchApi = (isPopup: boolean, value: string) => {
		// if (value === '') {
		// 	refModal.current.handlerOpen();
		// 	return;
		// }
		const tt = currentPageScr - 1;
		const params = {
			sku: value,
			dcCode: gDccode,
			multiSelect: '',
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			// skipCount: currentPageScr === 1 ? false : true,
		};

		apiGetPurchaseBuyerHstList(params).then(res => {
			if (!isPopup) {
				if (res.data.list.length === 1) {
					settingSelectData(res.data.list[0]);
				} else {
					refModal.current?.handlerOpen();
				}
			}
			gridRef.current?.clearGridData();

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
	 * @returns {void}
	 */
	const searchScroll = throttle((isPopup: boolean, value1: string) => {
		const tt = currentPageScr - 1;
		const params = {
			sku: value1,
			dcCode: gDccode,
			// dcCode: 1000, // 테스트용 (dcCode: 1000, sku: 100073)
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			// skipCount: currentPageScr === 1 ? false : true,
		};

		apiGetPurchaseBuyerHstList(params).then(res => {
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
			sku: value,
			dcCode: gDccode,
			multiSelect: '',
			startRow: 0,
			listCount: 500,
			skipCount: true,
		};

		apiGetPurchaseBuyerHstList(params).then(res => {
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
	 * @param {object} param 조회 param
	 * @param  {any} event 이벤트
	 * @param  {any} source clear, input
	 * @returns {void}
	 */
	const onClickSearchButton = (param: string, event: any, source: any) => {
		if (source.source === 'clear') return;
		setPopupList([]);

		if (event.key === 'Enter') {
			searchEnter(param);
		} else {
			handleOpenPopup();
		}
	};

	/**
	 * 조회 결과 저장
	 * @param {object} val
	 * @returns {void}
	 */
	const settingSelectData = (val: any): void => {
		let searchName = `[${val[0].sku}]${val[0].hstTxt}`;
		let searchCode = val[0].sku;

		for (let i = 1; i < val.length; i++) {
			searchName += `,[${val[i].sku}]${val[i].hstTxt}`;
			searchCode += ',' + val[i].sku;
		}

		if (returnValueFormat === 'code') {
			form.setFieldsValue({ [name]: searchCode, [code]: searchCode });
		} else if (val.length > 1) {
			form.setFieldsValue({ [name]: `${val.length}건 선택`, [code]: searchCode });
		} else {
			form.setFieldsValue({ [name]: searchName, [code]: searchCode });
		}
	};

	usePopupSearchValue({ form, name, code, value: sku });
	useCloseOnExternalScroll({
		open: dropdownOpen,
		onClose: () => setDropdownOpen(false),
		allowScrollRefs: [refModal],
	});
	/**
	 * 팝업 닫기 버튼
	 */
	const closeEvent = () => {
		// 의미없는 값 삭제
		if (commUtil.isEmpty(form.getFieldValue(code))) {
			form.setFieldsValue({ [name]: '' });
		}
		setCurrentPageScr(1);
		// form.setFieldValue(name, '');
		// form.setFieldValue(code, '');
		form.resetFields();
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
	 * 드롭다운 렌더링 포맷
	 */
	const dropdownRenderFormat = (): JSX.Element => {
		return (
			<div className="dropdown-content">
				<table className="data-table">
					<thead>
						<tr>
							<th>{t('lbl.DCCODE')}</th>
							<th>{t('lbl.CUSTTYPE_PO')}</th>
							<th>{t('lbl.SKUCD')}</th>
							<th>{t('lbl.MODIFYDATE')}</th>
							<th>{t('lbl.LOG_DT')}</th>
							<th>{t('lbl.LOGWHO')}</th>
						</tr>
					</thead>
					<tbody>
						{dropdownData.map((item, index) => (
							<tr key={index} onClick={() => handleDropdownClick(item)}>
								<td id="dropdownTable">{item.dccode}</td>
								<td id="dropdownTable">{item.custtype}</td>
								<td id="dropdownTable">{item.sku}</td>
								<td id="dropdownTable">{item.hstTxt}</td>
								<td id="dropdownTable">{item.logdate}</td>
								<td id="dropdownTable">{item.logwho}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	/**
	 * 드롭다운에서 항목 선택 시
	 * @param val
	 */
	const handleDropdownClick = (val: any): void => {
		form.setFieldsValue({ [name]: `[${val.dccode}]${val.hstTxt}`, [code]: val.dccode });
		setDropdownOpen(false);
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

	return (
		<>
			<Dropdown placement="bottom" open={dropdownOpen} trigger={[]} popupRender={dropdownRenderFormat}>
				<div>
					{/* 팝업 */}
					<InputSearch
						label={t('lbl.SKUCD')}
						placeholder={t('msg.placeholder2', ['상품코드'])}
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
				<CmPurchaseBuyerHstPopup
					callBack={confirmEvent}
					close={closeEvent}
					searchName={form.getFieldValue(code)?.includes(',') ? form.getFieldValue(code) : form.getFieldValue(name)}
					gridData={popupList}
					search={searchScroll}
					selectionMode={selectionMode ? selectionMode : 'singleRow'}
					setCurrentPage={setCurrentPageScr}
					totalCount={totalCount}
					gridRef={gridRef}
					form={popupForm}
					name={name}
					sku={sku}
				></CmPurchaseBuyerHstPopup>
			</CustomModal>
		</>
	);
};

export default CmPurchaseBuyerHstSearch;
