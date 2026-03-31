/*
 ############################################################################
 # FiledataField	: StTplUserSearch.tsx
 # Description		: 화주조회 팝업
 # Author			: ys.park
 # Since			: 25.11.06
 ############################################################################
*/
// lib
import { CloseCircleFilled } from '@ant-design/icons';
import { Dropdown, Form } from 'antd';
// utils

// component
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';
import StTplUserPopup from '@/components/st/popup/StTplUserPopup';

// API Call Function

import { apiGetTplUserPopupList, apipostTplUser } from '@/api/st/apiStTplUser';
import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { usePopupPasteTransform } from '@/hooks/cm/usePopupPasteTransform';
import { usePopupSearchValue } from '@/hooks/cm/usePopupSearchValue';
import { useThrottle } from '@/hooks/useThrottle';
import { useAppSelector } from '@/store/core/coreHook';

// const user = useAppSelector(state => state.user.userInfo);
interface SearchCustProps {
	form: any;
	label?: string;
	required?: boolean;
	name: string;
	code: string;
	custkey?: string;
	vendor?: string;
	value?: string;
	disabled?: boolean;
	className?: any;
}

const StTplUserSearch = (props: SearchCustProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, label, required, name, code, custkey, vendor, value } = props;
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
	const user = useAppSelector(state => state.user.userInfo);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const handleOpenPopup = () => {
		setPopupList([]);
		setTotalCount(0);
		// popupForm.setFieldValue('dccode', dccode ? dccode : gDccode);
		refModal.current?.handlerOpen();
	};

	/**
	 * API 조회 - 그리드 스크롤
	 * @param {boolean} isPopup 팝업여부
	 * @param {string} value 검색할 이름
	 * @returns {void}
	 */
	const searchScroll = throttle((isPopup: boolean, value1: string, value2: any) => {
		const tt = currentPageScr - 1;
		const params = {
			name: value1,
			date: value2,
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			skipCount: currentPageScr === 1 ? false : true,
		};
		apiGetTplUserPopupList(params).then(res => {
			setPopupList(res.data.list);
			if (res.data.totalCount > -1) {
				setTotalCount(res.data.totalCount);
			}
		});
	}, 500);

	/**
	 * API 조회 - INPUT 하단 그리드
	 * @param {string} value 검색할 이름
	 * @returns {void}
	 */
	const searchEnter = (value: string) => {
		if (value === '') {
			return;
		}
		const today = new Date();
		const formattedDate = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today
			.getDate()
			.toString()
			.padStart(2, '0')}`;
		const params = {
			name: value,
			multiSelect: '',
			date: formattedDate,
			startRow: 0,
			listCount: 500,
			skipCount: true,
		};

		setDropdownData([]);
		apiGetTplUserPopupList(params).then(res => {
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
			searchEnter(param);
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
		const searchName = commUtil.convertCodeWithName(val[0].code, val[0].name);
		const searchCode = val[0].code;
		const searchCustKey = val[0].custkey;
		const searchVendor = val[0].vendor;

		form.setFieldsValue({ [name]: searchName, [code]: searchCode, [custkey]: searchCustKey, [vendor]: searchVendor });
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
	 *  검색결과 클릭
	 * @param {any} val 클릭한로우
	 */
	const handleDropdownClick = (val: any) => {
		form.setFieldsValue({
			[name]: commUtil.convertCodeWithName(val.code, val.name),
			[code]: val.code,
			[custkey]: val.custkey,
			[vendor]: val.vendor,
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
									<th>t('lbl.TPLUSER_ID')</th>
									<th>t('lbl.TPLUSER_NAME')</th>
									<th>t('lbl.CUSTNAME_WD')</th>
									<th>t('lbl.PARTNER_NAME')</th>
								</tr>
							</thead>
							<tbody>
								{dropdownData.map((item, index) => (
									<tr key={index} onClick={() => handleDropdownClick(item)}>
										<td id="dropdownTable">{item.code}</td>
										<td id="dropdownTable">{item.name}</td>
										<td id="dropdownTable">{item.custNm}</td>
										<td id="dropdownTable">{item.vendorNm}</td>
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
	useEffect(() => {
		if (user.emptype === 'A01') {
			apipostTplUser({}).then(res => {
				const searchName = commUtil.convertCodeWithName(res.data[0].code, res.data[0].name);
				form.setFieldsValue({
					[name]: searchName,
					[code]: res.data[0].code,
					[custkey]: res.data[0].custkey,
					[vendor]: res.data[0].vendor,
				});
			});
		}
	}, []);
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
			<Dropdown
				placement="bottom"
				open={dropdownOpen}
				trigger={[]} // hover, click 방지 => 명시적으로 상태로만 열림
				popupRender={dropdownRenderFormat}
			>
				<InputSearch
					label={t('lbl.TPLUSER')}
					placeholder={t('msg.placeholder1', ['화주ID 또는 화주명'])}
					form={form}
					name={name}
					code={code}
					hidden={true}
					onSearch={onClickSearchButton}
					onPaste={pasteTransform(form, name, true, code)}
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
				<StTplUserPopup
					callBack={confirmEvent}
					close={closeEvent}
					// searchName={form.getFieldValue(code) !== '' ? form.getFieldValue(code) : form.getFieldValue(name)}
					searchName={form.getFieldValue(code)?.includes(',') ? form.getFieldValue(code) : form.getFieldValue(name)}
					gridData={popupList}
					search={searchScroll}
					setCurrentPage={setCurrentPageScr}
					totalCount={totalCount}
					gridRef={gridRef}
					form={popupForm}
					name={name}
				></StTplUserPopup>
			</CustomModal>
		</>
	);
};

export default StTplUserSearch;
