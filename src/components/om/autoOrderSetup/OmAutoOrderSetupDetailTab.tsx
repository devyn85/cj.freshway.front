// Component
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import CustomModal from '@/components/common/custom/CustomModal';
import {
	CheckBox,
	InputSearch,
	InputText,
	InputTextArea,
	LabelText,
	RadioBox,
	Rangepicker,
	SelectBox,
} from '@/components/common/custom/form';
import CheckboxGroup from '@/components/common/custom/form/CheckboxGroup';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';
import TableTopBtn from '@/components/common/TableTopBtn';
import OmAutoOrderSetupPopup from '@/components/om/autoOrderSetup/OmAutoOrderSetupPopup';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// API Call Function
import { apiSaveMasterInfo } from '@/api/om/apiOmAutoOrderSetup';

// type
import { TableBtnPropsType } from '@/types/common';

// lib
import ScrollBox from '@/components/common/ScrollBox';
import { Button, Form, Row } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';

interface OmAutoOrderSetupDetailTabProps {
	form?: any;
	masterInfo?: any;
	gridRowData?: Array<any>;
	setChangeMasterInfo?: any;
	activeKey?: string;
}
const OmAutoOrderSetupDetailTab = forwardRef((props: OmAutoOrderSetupDetailTabProps, tabRef: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, masterInfo, gridRowData, activeKey } = props;
	const refModal1 = useRef(null);
	const refModal2 = useRef(null);
	const [popupType, setPopupType] = useState('');
	const [searchType, setSearchType] = useState('');
	const [organizeCode, setOrganizeCode] = useState('');

	// 필드값 변경시 edit 여부
	/* ==============================
       최소 watch만 유지
    ============================== */

	const rowStatus = Form.useWatch('rowStatus', form);
	const ordQtyDivCd = Form.useWatch('ordQtyDivCd', form);
	const runDivCd = Form.useWatch('runDivCd', form);

	const isFormDisabled = rowStatus === 'R';
	const isOrderEdit = isFormDisabled || rowStatus !== 'I';
	const isOrderDetailEdit = isFormDisabled || ordQtyDivCd === '2';
	const isOrderTimeEdit = isFormDisabled || runDivCd === '2';
	const isOrderDayEdit = isFormDisabled || runDivCd === '1';

	const radioOpt1 = [
		{
			label: 'D-1일 생성',
			value: '-1',
		},
		{
			label: '휴일무시',
			value: '0',
		},
		{
			label: 'D+1일 생성',
			value: '1',
		},
	];
	const radioOpt2 = [
		{
			label: t('lbl.ORDERQTY_2'), // 주문량
			value: '1',
		},
		{
			label: t('lbl.TARGETPOQTY'), // 목표재고량
			value: '2',
		},
	];
	const radioOpt3 = [
		{
			label: t('lbl.CURRENT_STOCK'), // 현재고
			value: '1',
		},
		{
			label: '기용재고',
			value: '2',
		},
	];
	const radioOpt4 = [
		{
			label: '일자주기',
			value: '1',
		},
		{
			label: '요일주기',
			value: '2',
		},
	];

	const cbxGrpopts = [
		{ label: '자동발주수행결과', value: 'procChkYn' },
		{
			label: '출고실적상태',
			value: 'resultChkYn',
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 창고코드 팝업조회
	 * @returns {void}
	 */
	const searchOrganize = () => {
		setPopupType('allOrganize');
		setOrganizeCode(form.getFieldValue('organize') ? form.getFieldValue('organize') : form.getFieldValue('fromDccode'));
		refModal1.current.handlerOpen();
	};

	/**
	 * 창고코드 팝업조회
	 * @param selectedRow
	 * @returns {void}
	 */
	const confirmPopup = (selectedRow: any) => {
		form.setFieldValue('organize', selectedRow[0].code);
		refModal1.current.handlerClose();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refModal1.current.handlerClose();
		refModal2.current.handlerClose();
	};

	/**
	 * 상세설정 저장
	 * @returns {void}
	 */
	const saveMasterInfo = async () => {
		// ==================입력 값 검증==================
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		const params = form.getFieldsValue();
		if ((params.fromDccode === '1000' || params.fromDccode === '2170') && !params.organize) {
			showMessage({
				content: params.fromDccode + '센터의 경우 저장위치가 필수 입력사항 입니다.',
				modalType: 'info',
			});
			return;
		}

		if (params.fromDccode === params.toDccode) {
			showMessage({
				content: '공급센터 와 공급받는센터는 동일센터로 지정할 수 없습니다.',
				modalType: 'info',
			});
			return;
		}

		if (Number(params.ordDay) < 0 || Number(params.ordDay) >= 99) {
			showMessage({
				content: '산정기준일의 입력가능범위는 0~99사이 입니다.',
				modalType: 'info',
			});
			return;
		}

		if (Number(params.purchaseDay) <= -99 || Number(params.purchaseDay) >= 99) {
			showMessage({
				content: '입고일의 입력가능범위는 -99~99사이 입니다.',
				modalType: 'info',
			});
			return;
		}

		if (params.ordQtyDivCd === '2' && Number(params.runHh) < 9) {
			showMessage({
				content: '목표재고량 기준 발주인 경우 통계데이터와의 연계로 인해 9시 부터 등록가능합니다.',
				modalType: 'info',
			});
			return;
		}
		// ==================입력 값 검증 완==================
		// ==================params 값 정제(checkbox group, 날짜)==================
		const cbxGrpArray = ['procChkYn', 'resultChkYn'];
		const updatedParams = cbxGrpArray.reduce(
			(item: any, key: any) => {
				item[key] = (params.cbxGrp || []).includes(key) ? '1' : '0';
				return item;
			},
			{ ...params },
		);

		const [fromdate, todate] = updatedParams.expiryDate || [null, null];

		if (fromdate && todate) {
			updatedParams.fromdate = dayjs(fromdate).format('YYYYMMDD');
			updatedParams.todate = dayjs(todate).format('YYYYMMDD');
		}

		delete updatedParams.cbxGrp;
		delete updatedParams.expiryDate;
		// ==================params 값 정제(checkbox group, 날짜) 완==================
		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			apiSaveMasterInfo(updatedParams).then((res: any) => {
				const changeMasterInfo = {
					purchaseCd: updatedParams.purchaseCd,
					purchaseName: updatedParams.purchaseName,
					purchaseInfo: '유효기간:' + updatedParams.fromdate + '~' + updatedParams.todate,
					delYn: updatedParams.delYn,
					status: form.getFieldValue('rowStatus'),
				};
				props.setChangeMasterInfo(changeMasterInfo);
				showMessage({
					content: t('msg.' + res.data.data.resultMessage),
					modalType: 'info',
				});
				form.setFieldValue('rowStatus', 'U');
			});
		});
	};

	// 발주개요 버튼 설정
	const tableBtn: TableBtnPropsType = {
		tGridRef: tabRef,
		btnArr: [
			{
				btnType: 'save',
				callBackFn: saveMasterInfo,
			},
		],
	};
	const tableBtn2: TableBtnPropsType = {
		tGridRef: tabRef,
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		const rowStatus = form.getFieldValue('rowStatus');
		if (Object.keys(changedValues).length > 0 && rowStatus !== 'I') {
			// 변경된 값이 있을 때만 처리
			form.setFieldValue('rowStatus', 'U');
		}
	};

	/**
	 * 연도 설정
	 * @returns {Array<object>}
	 */
	const getRunYyyy = () => {
		const years = Array.from({ length: 2050 - 2017 + 1 }, (_, i) => {
			const year = 2017 + i;
			return { cdNm: year, comCd: year };
		});
		const yearOptions = [{ cdNm: '년', comCd: '' }, ...years];
		return yearOptions;
	};

	/**
	 * 월 설정
	 * @returns {Array<object>}
	 */
	const getRunMn = () => {
		const months = Array.from({ length: 12 }, (_, i) => {
			const month = i + 1;
			return { cdNm: month, comCd: month };
		});
		const monthOptions = [{ cdNm: '월', comCd: '' }, ...months];
		return monthOptions;
	};

	/**
	 * 일 설정
	 * @returns {Array<object>}
	 */
	const getRunDd = () => {
		const days = Array.from({ length: 31 }, (_, i) => {
			const day = i + 1;
			return { cdNm: day, comCd: day };
		});
		const dayOptions = [{ cdNm: '일', comCd: '' }, ...days];
		return dayOptions;
	};

	/**
	 * 시 설정
	 * @returns {Array<object>}
	 */
	const getRunHh = () => {
		const hours = Array.from({ length: 24 }, (_, i) => {
			const hour = i;
			const formattedHour = hour.toString().padStart(2, '0');
			return { cdNm: formattedHour, comCd: formattedHour };
		});
		const hourOptions = [{ cdNm: '시', comCd: '' }, ...hours];
		return hourOptions;
	};

	/**
	 * 분 설정
	 * @returns {Array<object>}
	 */
	const getRunMi = () => {
		const minutes = Array.from({ length: 6 }, (_, i) => {
			const minute = i * 10;
			const formattedMinute = minute.toString().padStart(2, '0');
			return { cdNm: formattedMinute, comCd: formattedMinute };
		});
		const minuteOptions = [{ cdNm: '분', comCd: '' }, ...minutes];
		return minuteOptions;
	};

	/**
	 * 점검시간 설정
	 * @returns {Array<object>}
	 */
	const getInspectionTime = () => {
		const InspectionTimes = Array.from({ length: 12 }, (_, i) => {
			const InspectionTime = i + 1;
			return { cdNm: InspectionTime + '시간 후', comCd: InspectionTime };
		});
		const InspectionTimeOptions = [{ cdNm: '선택', comCd: '' }, ...InspectionTimes];
		return InspectionTimeOptions;
	};

	/**
	 * 주문량산정상세(저장품자동발주관리 상세설정 팝업)
	 * @param value
	 * @returns {void}
	 */
	const searchIncCustkey = (value: string) => {
		if (rowStatus === 'I') {
			showMessage({
				content: '신규건의 경우 저장이후 설정 가능한 항목입니다. ( 최초 저장 진행한 이후 재조회하여 진행 바랍니다. )',
				modalType: 'info',
			});
		} else {
			setPopupType('detail');
			setSearchType(value);
			refModal2.current.handlerOpen();
		}
	};

	/**
	 * 수정이력 조회(팝업)
	 * @returns {void}
	 */
	const searchHistory = () => {
		if (rowStatus === 'I') {
			showMessage({
				content: '신규건의 경우 저장이후 확인 가능한 항목입니다. ( 최초 저장 진행한 이후 재조회하여 진행 바랍니다. )',
				modalType: 'info',
			});
			return;
		} else if (!gridRowData[0]?.purchaseCd) {
			showMessage({
				content: '대상 자동발주 코드가 누락되어 강제종료합니다. 팝업을 재호출하셔서 시도해주세요.',
				modalType: 'info',
			});
			return;
		} else {
			setPopupType('history');
			refModal2.current.handlerOpen();
		}
	};

	/**
	 * 공급센터 변경
	 * @returns {void}
	 */
	const changeFromDccode = () => {
		form.setFieldValue('organize', '');
	};

	/**
	 * SMS수신 checkbox event
	 * @returns {void}
	 */
	const changeSMSChecked = () => {
		form.setFieldValue('resultChkTerm', '');
	};

	/**
	 * SMS수신 점검시간 checkbox event
	 * @param value
	 * @returns {void}
	 */
	const changeResultChkTerm = (value: any) => {
		const current = form.getFieldValue('cbxGrp') || [];
		let updated = [...current];

		if (value) {
			if (!updated.includes('resultChkYn')) {
				updated.push('resultChkYn');
			}
		} else {
			updated = updated.filter(v => v !== 'resultChkYn');
		}

		form.setFieldValue('cbxGrp', updated);
	};
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 셀선택시 데이터 조회
	/* ==============================
      masterInfo 세팅 (setTimeout 제거)
    ============================== */

	useEffect(() => {
		if (!masterInfo) {
			if (!form.getFieldValue('rowStatus')) {
				form.setFieldValue('rowStatus', 'R');
			}
			return;
		}

		const newValues: any = {
			...masterInfo,
			expiryDate:
				masterInfo.fromdate && masterInfo.todate ? [dayjs(masterInfo.fromdate), dayjs(masterInfo.todate)] : undefined,
		};

		const cbxGrp: string[] = [];
		if (masterInfo.procChkYn === '1') cbxGrp.push('procChkYn');
		if (masterInfo.resultChkYn === '1') cbxGrp.push('resultChkYn');
		if (cbxGrp.length) newValues.cbxGrp = cbxGrp;

		form.resetFields();
		form.setFieldsValue(newValues);
	}, [masterInfo, activeKey]);

	return (
		<>
			<Form
				form={form}
				onValuesChange={onValuesChange}
				disabled={isFormDisabled}
				style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}
			>
				<Form.Item name="rowStatus" hidden />
				<Form.Item name="addwho" hidden />
				<Form.Item name="editwho" hidden />
				<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
					<TableTopBtn tableTitle={'발주개요'} tableBtn={tableBtn} className="fix-title" />
				</AGrid>
				<ScrollBox>
					<div>
						<UiDetailViewGroup className="grid-column-2">
							<li>
								<InputText
									label={'발주코드'}
									name="purchaseCd"
									disabled={isOrderEdit}
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li>
								<InputText label={'발주명'} name="purchaseName" />
							</li>
							<li className="col-2">
								<InputTextArea
									label={t('lbl.DESCRIPTION2')} // 설명
									name="purchaseConts"
									autoSize={{ minRows: 2, maxRows: 3 }}
									disabled={isFormDisabled}
								/>
							</li>
							<li>
								<InputText
									label={t('lbl.ADDWHO')} // 등록자
									name="regNm"
									disabled={true}
								/>
							</li>
							<li>
								<InputText
									label={t('lbl.ADDDATE')} // 등록일시
									name="adddate"
									disabled={true}
								/>
							</li>
							<li>
								<InputText
									label={t('lbl.EDITWHO')} // 수정자
									name="updNm"
									disabled={true}
								/>
							</li>
							<li>
								<InputText
									label={t('lbl.EDITDATE')} // 수정일시
									name="editdate"
									disabled={true}
								/>
							</li>
						</UiDetailViewGroup>
						<TableTopBtn tableTitle={'발주기준 상세설정'} tableBtn={tableBtn2} />
						<UiDetailViewGroup className="grid-column-2">
							<li className="col-2">
								<span>
									<CmGMultiDccodeSelectBox
										name="fromDccode"
										fieldNames={{ label: 'dcname', value: 'dccode' }}
										// mode="multiple"
										onChange={changeFromDccode}
										label={t('lbl.FROM_DCCODE')} // 공급센터
										span={12}
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
									/>
									*저장위치{' '}
									<Form.Item
										shouldUpdate={(prev, cur) => prev.fromDccode !== cur.fromDccode || prev.rowStatus !== cur.rowStatus}
									>
										{({ getFieldValue }) => {
											const rowStatus = getFieldValue('rowStatus');
											const fromDccode = getFieldValue('fromDccode');

											const isDisabled = rowStatus === 'R' || !(fromDccode === '1000' || fromDccode === '2170');

											return (
												<span className="flex-wrap align-center">
													<InputSearch name="organize" onSearch={searchOrganize} disabled={isDisabled} />
												</span>
											);
										}}
									</Form.Item>
								</span>
							</li>
							<li>
								<CmGMultiDccodeSelectBox
									name="toDccode"
									fieldNames={{ label: 'dcname', value: 'dccode' }}
									// mode="multiple"
									label={t('lbl.TO_DCCODE')} // 공급받는센터
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li>
								<SelectBox
									label="휴일관리코드"
									options={getCommonCodeList('CALENDAR_ID')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									name="calendarId"
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li className="col-2">
								<span>
									<InputText
										label={'산정기준일'}
										placeholder={'설명을 입력해주세요.'}
										name="ordDay"
										span={12}
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
									/>
									<span>(자동발주 수행일 기준 마길일, ex&gt;D+2일 주문일 경우 '2')</span>
								</span>
							</li>
							<li className="col-2">
								<span>
									<InputText
										label={'입고일'}
										placeholder={'입고일을 입력해주세요.'}
										name="purchaseDay"
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
									/>
									<span>(주문일 기준 센터입고일, ex&gt;하루전 입고일 경우 '-1')</span>
								</span>
							</li>
							<li className="col-2">
								<RadioBox label="입고일휴일처리" options={radioOpt1} name="purchaseHoliydayCd" />
							</li>
							<li className="col-2">
								<RadioBox label="발주량산정기준" options={radioOpt2} name="ordQtyDivCd" />
							</li>
							<li className="col-2 flex-wrap">
								<span className="pd0">
									<LabelText label="주문량산정상세" />
								</span>
								<Row className="flex1 fd-column align-unset">
									<li>
										<CheckBox name="chdDcYn" trueValue={'1'} falseValue={'0'} disabled={isOrderDetailEdit}>
											자센터포함
										</CheckBox>
									</li>
									<Form.Item shouldUpdate={(prev, cur) => prev.stYn !== cur.stYn || prev.stDivCd !== cur.stDivCd}>
										{({ getFieldValue, setFieldsValue }) => {
											const stYn = getFieldValue('stYn'); // '1' 또는 '0'
											const stDivCd = getFieldValue('stDivCd'); // '1', '2', ''

											// 체크박스와 라디오 상호연동
											const isStDivCdChecked = stDivCd === '1' || stDivCd === '2';
											const checked = stYn === '1' || isStDivCdChecked;

											// stYn 체크박스 클릭 시 라디오 초기화
											const handleStYnChange = (value: any) => {
												if (!value.target.checked) {
													setFieldsValue({ stDivCd: '' });
												}
												setFieldsValue({ stYn: value.target.checked ? '1' : '0' });
											};

											return (
												<li className="flex-wrap">
													<span>
														<CheckBox
															name="stYn"
															checked={checked}
															trueValue={'1'}
															falseValue={'0'}
															disabled={isOrderDetailEdit}
															onChange={handleStYnChange}
														>
															재고감안
														</CheckBox>
													</span>
													<span>
														(
														<RadioBox
															name="stDivCd"
															options={radioOpt3}
															disabled={isOrderDetailEdit}
															value={stDivCd}
															onChange={(value: any) => {
																setFieldsValue({ stDivCd: value.target.value, stYn: '1', stYn_checkbox: true });
															}}
														/>
														)
													</span>
												</li>
											);
										}}
									</Form.Item>

									<Form.Item
										shouldUpdate={(prev, cur) =>
											prev.dpYn !== cur.dpYn ||
											prev.dpPoYn !== cur.dpPoYn ||
											prev.dpFwstoYn !== cur.dpFwstoYn ||
											prev.dpKxstoYn !== cur.dpKxstoYn
										}
									>
										{({ getFieldValue, setFieldsValue }) => {
											const dpYn = getFieldValue('dpYn'); // '1' 또는 '0'
											const dpPoYn = getFieldValue('dpPoYn'); // '1' or '0'
											const dpFwstoYn = getFieldValue('dpFwstoYn');
											const dpKxstoYn = getFieldValue('dpKxstoYn');

											const isAnyChildChecked = dpPoYn === '1' || dpFwstoYn === '1' || dpKxstoYn === '1';

											const handleDpYnChange = (value: any) => {
												if (!value.target.checked) {
													setFieldsValue({
														dpPoYn: '0',
														dpFwstoYn: '0',
														dpKxstoYn: '0',
														dpPoYn_checkbox: false,
														dpFwstoYn_checkbox: false,
														dpKxstoYn_checkbox: false,
													});
												}
											};

											const handleChildChange = (name: string, value: any) => {
												setFieldsValue({ [name]: value.target.checked ? '1' : '0' });
												// 하위 체크박스 중 하나라도 선택되면 dpYn 체크
												const childValues: Record<string, string> = {
													dpPoYn: dpPoYn,
													dpFwstoYn: dpFwstoYn,
													dpKxstoYn: dpKxstoYn,
												};
												// 현재 변경된 체크박스 값 적용
												if (name === 'dpPoYn') {
													childValues.dpPoYn = value.target.checked ? '1' : '0';
												} else if (name === 'dpFwstoYn') {
													childValues.dpFwstoYn = value.target.checked ? '1' : '0';
												} else if (name === 'dpKxstoYn') {
													childValues.dpKxstoYn = value.target.checked ? '1' : '0';
												}
												const anyChecked =
													childValues.dpPoYn === '1' || childValues.dpFwstoYn === '1' || childValues.dpKxstoYn === '1';
												setFieldsValue({ dpYn: anyChecked ? '1' : '0', dpYn_checkbox: true });
											};

											return (
												<li className="flex-wrap">
													<span>
														<CheckBox
															name="dpYn"
															trueValue={'1'}
															falseValue={'0'}
															checked={dpYn === '1' || isAnyChildChecked}
															disabled={isOrderDetailEdit}
															onChange={handleDpYnChange}
														>
															입고예정감안
														</CheckBox>
													</span>
													<span>
														(
														<CheckBox
															name="dpPoYn"
															trueValue={'1'}
															falseValue={'0'}
															disabled={isOrderDetailEdit}
															onChange={(checked: any) => handleChildChange('dpPoYn', checked)}
														>
															PO
														</CheckBox>
														<CheckBox
															name="dpFwstoYn"
															trueValue={'1'}
															falseValue={'0'}
															disabled={isOrderDetailEdit}
															onChange={(checked: any) => handleChildChange('dpFwstoYn', checked)}
														>
															FW STO
														</CheckBox>
														<CheckBox
															name="dpKxstoYn"
															trueValue={'1'}
															falseValue={'0'}
															disabled={isOrderDetailEdit}
															onChange={(checked: any) => handleChildChange('dpKxstoYn', checked)}
														>
															KX STO
														</CheckBox>
														)
													</span>
												</li>
											);
										}}
									</Form.Item>

									<li className="flex-wrap">
										<span>
											<CheckBox name="incCustkeyYn" trueValue={'1'} falseValue={'0'} disabled={isOrderDetailEdit}>
												대상고객지정
											</CheckBox>
										</span>
										<span>
											<Button
												name="incCustkey"
												icon={<IcoSvg data={icoSvgData.icoSearch} label={'검색'} />}
												onClick={() => searchIncCustkey('INC_CUSTKEY')}
												disabled={isOrderDetailEdit}
											/>
										</span>
									</li>
									<li className="flex-wrap">
										<span>
											<CheckBox name="incClosetypeYn" trueValue={'1'} falseValue={'0'} disabled={isOrderDetailEdit}>
												대상마감유형지정
											</CheckBox>
										</span>
										<span>
											<Button
												name="incClosetype"
												icon={<IcoSvg data={icoSvgData.icoSearch} label={'검색'} />}
												onClick={() => searchIncCustkey('INC_CLOSETYPE')}
												disabled={isOrderDetailEdit}
											/>
										</span>
									</li>
									<li className="flex-wrap">
										<span>
											<CheckBox name="incDistancetypeYn" trueValue={'1'} falseValue={'0'} disabled={isOrderDetailEdit}>
												대상원거리유형지정
											</CheckBox>
										</span>
										<span>
											<Button
												name="incDistancetype"
												icon={<IcoSvg data={icoSvgData.icoSearch} label={'검색'} />}
												onClick={() => searchIncCustkey('INC_DISTANCETYPE')}
												disabled={isOrderDetailEdit}
											/>
										</span>
									</li>
									<li>
										<CheckBox name="exSerialYn" trueValue={'1'} falseValue={'0'} disabled={isOrderDetailEdit}>
											이력상품제외
										</CheckBox>
									</li>
								</Row>
							</li>
						</UiDetailViewGroup>
						<TableTopBtn tableTitle={'수행시간'} tableBtn={tableBtn2} />
						<UiDetailViewGroup className="grid-column-2">
							<li className="col-2">
								<RadioBox label="수행구분" options={radioOpt4} name="runDivCd" />
							</li>
							<li className="col-2 flex-wrap">
								<span>
									<SelectBox
										label="주기설정(일자)"
										placeholder={'년'}
										name="runYyyy"
										options={getRunYyyy()}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										disabled={isOrderTimeEdit}
										required
										rules={[{ required: false, validateTrigger: 'none' }]}
									/>
									<SelectBox
										placeholder={'월'}
										name="runMm"
										options={getRunMn()}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										disabled={isOrderTimeEdit}
									/>
									<SelectBox
										placeholder={'일'}
										name="runDd"
										options={getRunDd()}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										disabled={isOrderTimeEdit}
									/>
									<SelectBox
										placeholder={'시'}
										name="runHh"
										options={getRunHh()}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										required
										rules={[
											{ required: true, validateTrigger: 'none', message: '주기설정(일자) 시 값을 입력해 주세요' },
										]}
									/>
									<SelectBox
										placeholder={'분'}
										name="runMi"
										options={getRunMi()}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										required
										rules={[
											{ required: true, validateTrigger: 'none', message: '주기설정(일자) 분 값을 입력해 주세요' },
										]}
									/>
								</span>
							</li>
							<li className="col-2 flex-wrap">
								<span>
									<CheckBox
										label="주기설정(요일)"
										name="runMonYn"
										trueValue={'1'}
										falseValue={'0'}
										disabled={isOrderDayEdit}
									>
										월
									</CheckBox>
									<CheckBox name="runTueYn" trueValue={'1'} falseValue={'0'} disabled={isOrderDayEdit}>
										화
									</CheckBox>
									<CheckBox name="runWedYn" trueValue={'1'} falseValue={'0'} disabled={isOrderDayEdit}>
										수
									</CheckBox>
									<CheckBox name="runThuYn" trueValue={'1'} falseValue={'0'} disabled={isOrderDayEdit}>
										목
									</CheckBox>
									<CheckBox name="runFriYn" trueValue={'1'} falseValue={'0'} disabled={isOrderDayEdit}>
										금
									</CheckBox>
									<CheckBox name="runSatYn" trueValue={'1'} falseValue={'0'} disabled={isOrderDayEdit}>
										토
									</CheckBox>
									<CheckBox name="runSunYn" trueValue={'1'} falseValue={'0'} disabled={isOrderDayEdit}>
										일
									</CheckBox>
								</span>
							</li>
							<li className="col-2 flex-wrap">
								<span>
									<Rangepicker
										label="유효기간"
										name="expiryDate"
										// defaultValue={dates} // 초기값 설정
										format="YYYY-MM-DD" // 화면에 표시될 형식
										span={24}
										allowClear
										showNow={false}
										//nChange={handleDateChange}
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
									/>
								</span>
								<span>
									<CheckBox name="runHolidaychkYn" trueValue={'1'} falseValue={'0'}>
										휴일관리 적용
									</CheckBox>
								</span>
							</li>
						</UiDetailViewGroup>
						<TableTopBtn tableTitle={'모니터링'} tableBtn={tableBtn2} />
						<UiDetailViewGroup className="grid-column-2">
							<li className="flex-wrap align-center" style={{ gridColumn: 'span 2' }}>
								<CheckboxGroup
									label="SMS수신"
									name="cbxGrp"
									options={cbxGrpopts}
									onChange={changeSMSChecked}
									// rules={[{ required: true, validateTrigger: 'none' }]}
								/>
								( 점검시간:
								<SelectBox
									name="resultChkTerm"
									span={6}
									options={getInspectionTime()}
									onChange={(e: any) => changeResultChkTerm(e)}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
								/>
								)
							</li>
							<li>
								<InputText label="수신대상자1 이름" placeholder={'수신대상자1 이름'} name="recvName1" />
							</li>
							<li>
								<InputText label="수신대상자1 연락처" placeholder={'수신대상자1 연락처'} name="recvTel1" />
							</li>
							<li>
								<InputText label="수신대상자2 이름" placeholder={'수신대상자2 이름'} name="recvName2" />
							</li>
							<li>
								<InputText label="수신대상자2 연락처" placeholder={'수신대상자2 연락처'} name="recvTel2" />
							</li>
							<li>
								<InputText label="수신대상자3 이름" placeholder={'수신대상자3 이름'} name="recvName3" />
							</li>
							<li>
								<InputText label="수신대상자3 연락처" placeholder={'수신대상자3 연락처'} name="recvTel3" />
							</li>
						</UiDetailViewGroup>
						<TableTopBtn
							tableTitle={t('lbl.ETC')} // 기타
							tableBtn={tableBtn2}
						/>
						<UiDetailViewGroup className="grid-column-2">
							<li>
								<SelectBox
									label={t('lbl.DELETE_YN')} // 삭제여부
									placeholder={t('lbl.DELETE_YN')}
									name="delYn"
									options={getCommonCodeList('DEL_YN', t('lbl.ALL'), null).filter(item =>
										['Y', 'N', null].includes(item.comCd),
									)}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
								/>
							</li>
							<li className="flex-wrap">
								<span>
									<LabelText label="수정이력" />
								</span>
								<span>
									<Button
										name="editHistory"
										icon={<IcoSvg data={icoSvgData.icoSearch} label={'검색'} />}
										onClick={searchHistory}
									/>
								</span>
							</li>
						</UiDetailViewGroup>
					</div>
				</ScrollBox>

				<CustomModal ref={refModal2} width="1000px">
					<OmAutoOrderSetupPopup
						form={form}
						popupType={popupType}
						gridData={gridRowData}
						searchType={searchType}
						setSearchType={setSearchType}
						close={closeEvent}
					/>
				</CustomModal>
			</Form>
			<CustomModal ref={refModal1} width="1000px">
				<CmSearchPopup
					type={popupType}
					codeName={organizeCode}
					callBack={confirmPopup}
					close={closeEvent}
				></CmSearchPopup>
			</CustomModal>
		</>
	);
});

export default OmAutoOrderSetupDetailTab;
