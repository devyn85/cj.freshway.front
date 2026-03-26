/*
 ############################################################################
 # FiledataField	: TmMonitoringCustomerGroupSearch.tsx
 # Description		: 모니터링 그룹관리 조회 component
 # Author			: JiHoPark	
 # Since			: 25.11.25
 ############################################################################
*/
// lib
import { CloseCircleFilled } from '@ant-design/icons';
import { Dropdown, Form } from 'antd';
// utils
import Constants from '@/util/constants';
// component
// import CmCarrierPopup from '@/components/cm/popup/CmCarrierPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';
import TmMonitoringCustomerGroupPopup from '@/components/tm/monitoringCustomer/TmMonitoringCustomerGroupPopup';

// API Call Function

import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { usePopupPasteTransform } from '@/hooks/cm/usePopupPasteTransform';
import { usePopupSearchValue } from '@/hooks/cm/usePopupSearchValue';
import { useThrottle } from '@/hooks/useThrottle';

// API
import {
	apiGetMonitoringCustomerGroupDetailList,
	apiGetMonitoringCustomerGroupList,
} from '@/api/tm/apiTmMonitoringCustomer';

interface TmMonitoringCustomerGroupSearchProps {
	form: any;
	name: string;
	code: string;
	returnValueFormat?: string;
	selectionMode?: string;
	value?: string;
	required?: any;
	disabled?: any;
	className?: any;
}

const TmMonitoringCustomerGroupSearch = (props: TmMonitoringCustomerGroupSearchProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, name, code, returnValueFormat, selectionMode, value } = props;
	const curDccode = form.getFieldsValue().gMultiDccode;
	const [popupForm] = Form.useForm();

	const throttle = useThrottle();
	const pasteTransform = usePopupPasteTransform();
	const refModal = useRef(null);

	// grid Ref
	const gridRefs1 = useRef(null);
	const gridRefs2 = useRef(null);

	// grid data
	const [gridData1, setGridData1] = useState([]);
	const [totalCnt1, setTotalCnt1] = useState(0);
	const [gridData2, setGridData2] = useState([]);
	const [totalCnt2, setTotalCnt2] = useState(0);

	const [popupList, setPopupList] = useState([]);

	// scroll Paging
	const [currentPageScr, setCurrentPageScr] = useState(1);
	const [pageSizeScr] = useState(Constants.PAGE_INFO.PAGE_SIZE);
	const [totalCount, setTotalCount] = useState(0);

	const { t } = useTranslation();

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropdownData, setDropdownData] = useState<any[]>([]);

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
			skipCount: currentPageScr !== 1,
			isEnter: 'Y', // Enter키로 검색 여부
		};

		if (value.split(',').length > 1) {
			params.name = '';
			params.multiSelect = value;
		}

		apiGetMonitoringCustomerGroupList(params).then(res => {
			if (!isPopup) {
				if (res.data.length === value.split(',').map(v => v.trim()).length) {
					settingSelectData(res.data);
				} else {
					refModal.current?.handlerOpen();
				}
			}
			gridRefs1.current?.clearGridData();

			// 팝업 발생 후 데이터 적용
			setPopupList(res.data);
			if (res.data.totalCount > -1) {
				setTotalCount(res.data.totalCount);
			}
		});
	};

	usePopupSearchValue({ form, name, code, value });

	/**
	 * API 조회 - 그리드 스크롤
	 * @param {boolean} isPopup 팝업여부
	 * @param {string} value 검색할 이름
	 * @returns {void}
	 */
	const searchScroll = throttle(
		(isPopup: boolean, value1: string, value2: string, value3?: string, value4?: boolean) => {
			const tt = currentPageScr - 1;
			const params = {
				name: value1,
				multiSelect: value2,
				startRow: 0 + tt * pageSizeScr,
				listCount: pageSizeScr,
				skipCount: currentPageScr !== 1,
			};

			apiGetMonitoringCustomerGroupList(params).then(res => {
				setPopupList(res.data || []);
				// 백엔드 응답에서 totalCount가 있으면 사용, 없으면 list 길이 사용
				let totalCnt = 0;
				if (res.data.totalCount !== undefined) {
					totalCnt = res.data.totalCount;
				} else if (res.data) {
					totalCnt = res.data.length;
				}
				setTotalCount(totalCnt);
			});
		},
		500,
	);

	/**
	 * API 조회 - INPUT 하단 그리드
	 * @param {string} value 검색할 이름
	 * @returns {void}
	 */
	const searchEnter = (value: string) => {
		if (value === '' || commUtil.isNotEmpty(form.getFieldValue(code))) {
			return;
		}
		setDropdownOpen(false);

		const params = {
			groupCdName: value,
			multiSelect: '',
			startRow: 0,
			listCount: 500,
			skipCount: true,
		};

		setDropdownData([]);
		apiGetMonitoringCustomerGroupList(params).then(res => {
			if (res.data.length === 1) {
				settingSelectData(res.data);
			} else if (res.data.length > 0) {
				const tempList = [];
				for (const item of res.data) {
					tempList.push(item);
				}
				setDropdownData(tempList);
				setDropdownOpen(true);
			} else if (res.data.length === 0) {
				refModal.current?.handlerOpen();
			}
		});
	};

	/**
	 * 버튼 클릭 검색
	 * @param {object} param 조회 param
	 * @param {any} event 이벤트
	 * @param {any} source 버튼 클릭 소스
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
		let searchName = commUtil.convertCodeWithName(val[0].groupCd, val[0].groupName);
		let searchCode = val[0].groupCd;

		for (let i = 1; i < val.length; i++) {
			searchName += `,${commUtil.convertCodeWithName(val[i].groupCd, val[i].groupName)}`;
			searchCode += ',' + val[i].groupCd;
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
	 * @param {object} params Request Params
	 */
	const confirmEvent = (params: any) => {
		setCurrentPageScr(1);
		refModal.current?.handlerClose();
		settingSelectData(params);
	};

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
		form.setFieldsValue({ [name]: commUtil.convertCodeWithName(val.groupCd, val.groupName), [code]: val.groupCd });
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
								{dropdownData.map(item => (
									<tr key={item.code} onClick={() => handleDropdownClick(item)}>
										<td id="dropdownTable">{item.groupCd}</td>
										<td id="dropdownTable">{item.groupName}</td>
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
	 * 모니터링 그룹 조회
	 * @param searchCond
	 */
	const searchMasterList = (searchCond: any) => {
		// 목록 초기화
		gridRefs1.current.clearGridData();
		gridRefs2.current.clearGridData();

		const params = {
			...searchCond,
		};

		apiGetMonitoringCustomerGroupList(params).then(res => {
			setGridData1(res.data);
			setTotalCnt1(res.data.length);
		});
	};

	/**
	 * 관리처목록 조회
	 * @param searchCond
	 * @param item
	 * @param flag
	 */
	const searchDetailList = (item: any, flag: boolean) => {
		const curUid = item._$uid;
		const curRowVal = popupForm.getFieldValue('rowIdVal');
		popupForm.setFieldValue('rowIdVal', curUid);

		if (!flag && curUid === curRowVal) {
			return;
		}

		// 목록 초기화
		gridRefs2.current.clearGridData();

		if (item['rowStatus'] !== 'I') {
			const params = {
				groupCd: item.groupCd,
			};

			apiGetMonitoringCustomerGroupDetailList(params).then(res => {
				setGridData2(res.data);
				setTotalCnt2(res.data.length);
			});
		}
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
			const multiParam = popupForm.getFieldValue('multiSelect');
			const carrierTypeParam = popupForm.getFieldValue('carrierType');
			searchScroll(true, param, multiParam, carrierTypeParam);
		}
	}, [currentPageScr]);

	/**
	 * 외부 클릭 감지하여 드롭다운 닫기
	 * @param event
	 */
	useEffect(() => {
		const handleClickOutside = (e: any) => {
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
			{/* 팝업 */}
			<Dropdown
				placement="bottom"
				open={dropdownOpen}
				trigger={[]} // hover, click 방지 => 명시적으로 상태로만 열림
				popupRender={dropdownRenderFormat}
			>
				<InputSearch
					label={t('lbl.MONITOR_GROUP')} // 모니터링 그룹
					form={form}
					name={name}
					code={code}
					hidden={true}
					placeholder={t('msg.placeholder1', ['모니터링 그룹 코드 또는 명'])}
					onSearch={onClickSearchButton}
					onPaste={pasteTransform(form, name, true, code)}
					onBlur={() => {
						// 의미 없는 값 입력시 삭제
						if (!dropdownOpen && commUtil.isEmpty(form.getFieldValue(code)) && !refModal.current?.getIsOpen()) {
							form.setFieldValue(name, '');
						}
					}}
					allowClear={!props.disabled && commUtil.isEmpty(form.getFieldValue(name))} // suffix가 노출 안될때 CSS 틀어져서 임시적으로 사용
					className={props.className ?? props.className}
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
			<CustomModal ref={refModal} width="1280px">
				<TmMonitoringCustomerGroupPopup
					form={popupForm}
					gridRef1={gridRefs1}
					data1={gridData1}
					totalCnt1={totalCnt1}
					gridRef2={gridRefs2}
					data2={gridData2}
					totalCnt2={totalCnt2}
					onCallbackHandler={confirmEvent}
					onCloseHandler={closeEvent}
					searchName={
						String(form.getFieldValue(code) || '').includes(',') ? form.getFieldValue(code) : form.getFieldValue(name)
					}
					selectionMode={selectionMode || 'singleRow'} //multipleRows
					dccode={curDccode}
					onSearchMasterHandler={searchMasterList}
					onSearchDetailHandler={searchDetailList}
				/>
			</CustomModal>
		</>
	);
};

export default TmMonitoringCustomerGroupSearch;
