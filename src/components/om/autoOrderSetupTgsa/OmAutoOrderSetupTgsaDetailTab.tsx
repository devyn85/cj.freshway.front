import { forwardRef, useEffect, useRef, useState } from 'react';

// Component
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import {
	CheckBox,
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
import OmAutoOrderSetupTgsaPopup from '@/components/om/autoOrderSetupTgsa/OmAutoOrderSetupTgsaPopup';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// API Call Function
import { apiGetToDcList, apiSaveMasterInfo } from '@/api/om/apiOmAutoOrderSetupTgsa';

// type
import { TableBtnPropsType } from '@/types/common';

// lib
import ScrollBox from '@/components/common/ScrollBox';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import styled from 'styled-components';

interface OmAutoOrderSetupTgsaDetailTabProps {
	form?: any;
	masterInfo?: any;
	gridRowData?: Array<any>;
	setChangeMasterInfo?: any;
	activeKey?: string;
}

const OmAutoOrderSetupTgsaDetailTab = forwardRef((props: OmAutoOrderSetupTgsaDetailTabProps, tabRef: any) => {
	const { form, masterInfo, gridRowData = [], activeKey } = props;

	const refModal1 = useRef<any>(null);
	const refModal2 = useRef<any>(null);

	const [popupType, setPopupType] = useState('');
	const [searchType, setSearchType] = useState('');
	const [organizeCode, setOrganizeCode] = useState('');
	const [toDccode, setToDccode] = useState<any[]>([]);

	const safeGetFieldValue = (name: string) => form?.getFieldValue?.(name);
	const safeSetFieldValue = (name: string, value: any) => form?.setFieldValue?.(name, value);
	const safeSetFieldsValue = (values: Record<string, any>) => form?.setFieldsValue?.(values);
	const safeGetFieldsValue = () => form?.getFieldsValue?.() || {};

	const dailyDeadlineStoOptions = getCommonCodeList('DAILY_DEADLINE_STO') || [];
	const delYnOptions = (getCommonCodeList('DEL_YN', t('lbl.ALL'), null) || []).filter((item: any) =>
		['Y', 'N', null].includes(item?.comCd),
	);

	const rowStatus = Form.useWatch('rowStatus', form) ?? 'R';
	const ordQtyDivCd = Form.useWatch('ordQtyDivCd', form) ?? '';
	const runDivCd = Form.useWatch('runDivCd', form) ?? '';

	//const isFormDisabled = rowStatus === 'R';
	const isFormDisabled = false;
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
			label: t('lbl.ORDERQTY_2'),
			value: '1',
		},
		{
			label: t('lbl.TARGETPOQTY'),
			value: '2',
		},
	];
	const radioOpt3 = [
		{
			label: t('lbl.CURRENT_STOCK'),
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

	const searchOrganize = () => {
		setPopupType('allOrganize');
		setOrganizeCode(safeGetFieldValue('organize') || safeGetFieldValue('fromDccode') || '');
		refModal1.current?.handlerOpen?.();
	};

	const confirmPopup = (selectedRow: any) => {
		safeSetFieldValue('organize', selectedRow?.[0]?.code || '');
		refModal1.current?.handlerClose?.();
	};

	const closeEvent = () => {
		refModal1.current?.handlerClose?.();
		refModal2.current?.handlerClose?.();
	};

	const saveMasterInfo = async () => {
		if (!form) return;

		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		const params = safeGetFieldsValue();

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

		if (Number(params.ordDay) + Number(params.purchaseDay) < 0) {
			showMessage({
				content: '산정기준일과 입고일 합이 0보다 커야합니다.',
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

		const cbxGrpArray = ['procChkYn', 'resultChkYn'];
		const updatedParams = cbxGrpArray.reduce(
			(item: any, key: any) => {
				item[key] = (params.cbxGrp || []).includes(key) ? '1' : '0';
				return item;
			},
			{
				...params,
				poExceptYn: params.poExceptYn ? '1' : '0',
				stoExceptYn: params.stoExceptYn ? '1' : '0',
				kxstoExceptYn: params.kxstoExceptYn ? '1' : '0',
				stOrdYn: params.stOrdYn ? '1' : '0',
				stCalcCondYn: params.stCalcCondYn ? '1' : '0',
				livestExceptYn: params.livestExceptYn ? '1' : '0',
				ordqtyForceOrdYn: params.ordqtyForceOrdYn ? '1' : '0',
				stoStoragetype: params.stoStoragetype ? '1' : '0',
			},
		);

		const [fromdate, todate] = updatedParams.expiryDate || [null, null];

		if (fromdate && todate) {
			updatedParams.fromdate = dayjs(fromdate).format('YYYYMMDD');
			updatedParams.todate = dayjs(todate).format('YYYYMMDD');
		}

		safeSetFieldValue('calendarId', 'TGSA');

		delete updatedParams.cbxGrp;
		delete updatedParams.expiryDate;

		showConfirm(null, t('msg.confirmSave'), () => {
			apiSaveMasterInfo(updatedParams).then((res: any) => {
				const changeMasterInfo = {
					purchaseCd: res.data.data.purchaseCd,
					purchaseName: updatedParams.purchaseName,
					purchaseInfo: '유효기간:' + updatedParams.fromdate + '~' + updatedParams.todate,
					delYn: updatedParams.delYn,
					status: safeGetFieldValue('rowStatus'),
				};

				props.setChangeMasterInfo?.(changeMasterInfo);

				showMessage({
					content: t('msg.' + res.data.data.resultMessage),
					modalType: 'info',
				});
				form.setFieldValue('purchaseCd', res.data.data.purchaseCd); // 화면에 반영
				form.setFieldValue('rowStatus', 'U');
			});
		});
	};

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

	const onValuesChange = (changedValues: any) => {
		const currentRowStatus = safeGetFieldValue('rowStatus');

		if (Object.keys(changedValues).length > 0 && currentRowStatus !== 'I') {
			safeSetFieldValue('rowStatus', 'U');
		}

		if ('dcClosetype' in changedValues) {
			loadToDcList(changedValues.dcClosetype);
		}
	};

	const loadToDcList = async (dcClosetype: string) => {
		if (!dcClosetype) {
			setToDccode([]);
			safeSetFieldValue('toDccode', undefined);
			return;
		}

		try {
			const res = await apiGetToDcList({ dcClosetype });

			const list = res?.data?.data || [];

			setToDccode(list);

			const currentDc = safeGetFieldValue('toDccode');

			const exists = list.some((item: any) => item.toDccode === currentDc);

			if (!exists) {
				if (list.length > 0) {
					safeSetFieldValue('toDccode', list[0].toDccode);
				} else {
					safeSetFieldValue('toDccode', undefined);
				}
			}
		} catch (err) {
			setToDccode([]);
			safeSetFieldValue('toDccode', undefined);
		}
	};

	const getRunYyyy = () => {
		const years = Array.from({ length: 2050 - 2017 + 1 }, (_, i) => {
			const year = 2017 + i;
			return { cdNm: year, comCd: year };
		});
		const yearOptions = [{ cdNm: '년', comCd: '' }, ...years];
		return yearOptions;
	};

	const getRunMn = () => {
		const months = Array.from({ length: 12 }, (_, i) => {
			const month = i + 1;
			return { cdNm: month, comCd: month };
		});
		const monthOptions = [{ cdNm: '월', comCd: '' }, ...months];
		return monthOptions;
	};

	const getRunDd = () => {
		const days = Array.from({ length: 31 }, (_, i) => {
			const day = i + 1;
			return { cdNm: day, comCd: day };
		});
		const dayOptions = [{ cdNm: '일', comCd: '' }, ...days];
		return dayOptions;
	};

	const getRunHh = () => {
		const hours = Array.from({ length: 24 }, (_, i) => {
			const hour = i;
			const formattedHour = hour.toString().padStart(2, '0');
			return { cdNm: formattedHour, comCd: formattedHour };
		});
		const hourOptions = [{ cdNm: '시', comCd: '' }, ...hours];
		return hourOptions;
	};

	const getRunMi = () => {
		const minutes = Array.from({ length: 6 }, (_, i) => {
			const minute = i * 10;
			const formattedMinute = minute.toString().padStart(2, '0');
			return { cdNm: formattedMinute, comCd: formattedMinute };
		});
		const minuteOptions = [{ cdNm: '분', comCd: '' }, ...minutes];
		return minuteOptions;
	};

	const getInspectionTime = () => {
		const inspectionTimes = Array.from({ length: 12 }, (_, i) => {
			const inspectionTime = i + 1;
			return { cdNm: inspectionTime + '시간 후', comCd: inspectionTime };
		});
		const inspectionTimeOptions = [{ cdNm: '선택', comCd: '' }, ...inspectionTimes];
		return inspectionTimeOptions;
	};

	const searchIncCustkey = (value: string) => {
		if (rowStatus === 'I') {
			showMessage({
				content: '신규건의 경우 저장이후 설정 가능한 항목입니다. ( 최초 저장 진행한 이후 재조회하여 진행 바랍니다. )',
				modalType: 'info',
			});
		} else {
			setPopupType('detail');
			setSearchType(value);
			refModal2.current?.handlerOpen?.();
		}
	};

	const searchHistory = () => {
		if (rowStatus === 'I') {
			showMessage({
				content: '신규건의 경우 저장이후 확인 가능한 항목입니다. ( 최초 저장 진행한 이후 재조회하여 진행 바랍니다. )',
				modalType: 'info',
			});
			return;
		} else if (!gridRowData?.[0]?.purchaseCd) {
			showMessage({
				content: '대상 자동발주 코드가 누락되어 강제종료합니다. 팝업을 재호출하셔서 시도해주세요.',
				modalType: 'info',
			});
			return;
		} else {
			setPopupType('history');
			refModal2.current?.handlerOpen?.();
		}
	};

	const changeFromDccode = () => {
		safeSetFieldValue('organize', '');
	};

	const changeSMSChecked = () => {
		safeSetFieldValue('resultChkTerm', '');
	};

	const changeResultChkTerm = (value: any) => {
		const current = safeGetFieldValue('cbxGrp') || [];
		let updated = [...current];

		if (value) {
			if (!updated.includes('resultChkYn')) {
				updated.push('resultChkYn');
			}
		} else {
			updated = updated.filter((v: string) => v !== 'resultChkYn');
		}

		safeSetFieldValue('cbxGrp', updated);
	};

	useEffect(() => {
		if (!form) return;
		const currentStatus = safeGetFieldValue('rowStatus');

		// 1. 신규 상태면 외부 데이터로 덮어쓰기 금지
		if (currentStatus === 'I') return;

		// 2. masterInfo 없으면 조회 상태 유지
		if (!masterInfo) {
			if (!safeGetFieldValue('rowStatus')) {
				safeSetFieldValue('rowStatus', 'R');
			}
			return;
		}

		// 3. masterInfo 들어온 경우 → 상태 동기화
		const nextStatus = masterInfo.rowStatus || 'R';

		// 상태가 다를 때만 변경 (불필요 렌더 방지)
		if (currentStatus !== nextStatus) {
			safeSetFieldValue('rowStatus', nextStatus);
		}

		loadToDcList(masterInfo.dcClosetype);

		const newValues: any = {
			...masterInfo,
			expiryDate:
				masterInfo.fromdate && masterInfo.todate ? [dayjs(masterInfo.fromdate), dayjs(masterInfo.todate)] : undefined,
		};

		const cbxGrp: string[] = [];
		if (masterInfo.procChkYn === '1') cbxGrp.push('procChkYn');
		if (masterInfo.resultChkYn === '1') cbxGrp.push('resultChkYn');
		if (cbxGrp.length) newValues.cbxGrp = cbxGrp;

		safeSetFieldsValue({
			...newValues,
			poExceptYn: masterInfo.poExceptYn === '1',
			stoExceptYn: masterInfo.stoExceptYn === '1',
			kxstoExceptYn: masterInfo.kxstoExceptYn === '1',
			stOrdYn: masterInfo.stOrdYn === '1',
			stCalcCondYn: masterInfo.stCalcCondYn === '1',
			livestExceptYn: masterInfo.livestExceptYn === '1',
			ordqtyForceOrdYn: masterInfo.ordqtyForceOrdYn === '1',
			stoStoragetype: masterInfo.stoStoragetype === '1',
		});
		safeSetFieldValue('calendarId', 'TGSA');
	}, [form, masterInfo, activeKey]);

	return (
		<Wrap>
			<Form form={form} onValuesChange={onValuesChange} disabled={isFormDisabled}>
				<Form.Item name="rowStatus" hidden />
				<Form.Item name="addwho" hidden />
				<Form.Item name="editwho" hidden />
				<Form.Item name="toDcname" hidden />
				<AGrid style={{ padding: '10px 0', marginBottom: 0, height: 'auto' }}>
					<TableTopBtn tableTitle={'발주개요'} tableBtn={tableBtn} />
				</AGrid>
				<ScrollBox>
					<div>
						<UiDetailViewGroup className="grid-column-2">
							<li>
								<InputText label={'발주코드'} name="purchaseCd" disabled={true} />
							</li>
							<li>
								<InputText label={'발주명'} name="purchaseName" />
							</li>
							<li className="col-2">
								<InputTextArea
									label={t('lbl.DESCRIPTION2')}
									name="purchaseConts"
									autoSize={{ minRows: 2, maxRows: 3 }}
									disabled={isFormDisabled}
								/>
							</li>
							<li>
								<InputText label={t('lbl.ADDWHO')} name="regNm" disabled={true} />
							</li>
							<li>
								<InputText label={t('lbl.ADDDATE')} name="adddate" disabled={true} />
							</li>
							<li>
								<InputText label={t('lbl.EDITWHO')} name="updNm" disabled={true} />
							</li>
							<li>
								<InputText label={t('lbl.EDITDATE')} name="editdate" disabled={true} />
							</li>
						</UiDetailViewGroup>

						<TableTopBtn tableTitle={'발주기준 상세설정'} tableBtn={tableBtn2} />
						<UiDetailViewGroup className="grid-column-2">
							<li>
								<SelectBox
									label="마감유형"
									options={dailyDeadlineStoOptions}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									name="dcClosetype"
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li>
								<SelectBox
									label={t('lbl.TO_DCCODE')}
									options={toDccode}
									fieldNames={{ label: 'toDcname', value: 'toDccode' }}
									name="toDccode"
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li>
								<SelectBox
									label="휴일관리코드"
									options={[{ cdNm: '광역당일보충발주', comCd: 'TGSA' }]}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									name="calendarId"
									disabled
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
							<li>
								<CheckBox label="재고량" name="stOrdYn">
									재고량발주
								</CheckBox>
							</li>
							<li>
								<CheckBox name="stCalcCondYn">재고량산정조건</CheckBox>
							</li>
							<li className="col-2">
								<ConditionsQuantity>
									<CheckBox name="poExceptYn" label="입고량산정조건">
										PO제외
									</CheckBox>
									<CheckBox name="stoExceptYn">STO제외</CheckBox>
									<CheckBox name="kxstoExceptYn">KX STO제외</CheckBox>
								</ConditionsQuantity>
							</li>
							<li className="col-2">
								<SelectBox
									label="STO유형"
									name="stoStoragetype"
									options={[
										{ comCd: 'STO', cdNm: '일반STO' },
										{ comCd: 'OSTO', cdNm: '주문STO' },
									]}
									defaultValue="STO"
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									style={{ width: '100px' }}
								/>
							</li>
							<li>
								<CheckBox name="livestExceptYn">축육상품제외</CheckBox>
							</li>
							<li>
								<CheckBox name="ordqtyForceOrdYn">주문량강제발주</CheckBox>
							</li>
							{/* <li className="col-2 flex-wrap">
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
										const stYn = getFieldValue('stYn');
										const stDivCd = getFieldValue('stDivCd');

										const isStDivCdChecked = stDivCd === '1' || stDivCd === '2';
										const checked = stYn === '1' || isStDivCdChecked;

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
										const dpYn = getFieldValue('dpYn');
										const dpPoYn = getFieldValue('dpPoYn');
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
											const childValues: Record<string, string> = {
												dpPoYn: dpPoYn,
												dpFwstoYn: dpFwstoYn,
												dpKxstoYn: dpKxstoYn,
											};
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
						</li> */}
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
										format="YYYY-MM-DD"
										span={24}
										allowClear
										showNow={false}
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
								<CheckboxGroup label="SMS수신" name="cbxGrp" options={cbxGrpopts} onChange={changeSMSChecked} />
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

						<TableTopBtn tableTitle={t('lbl.ETC')} tableBtn={tableBtn2} />
						<UiDetailViewGroup className="grid-column-2">
							<li>
								<SelectBox
									label={t('lbl.DELETE_YN')}
									placeholder={t('lbl.DELETE_YN')}
									name="delYn"
									options={delYnOptions}
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
					<OmAutoOrderSetupTgsaPopup
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
		</Wrap>
	);
});

const ConditionsQuantity = styled.li`
	display: flex;
	grid-column: span 1;
	.ant-col {
		flex: auto;
		.ant-checkbox-label {
			white-space: nowrap;
		}
	}
`;
export default OmAutoOrderSetupTgsaDetailTab;

const Wrap = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	form {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
	.title {
		padding: 10px 0;
	}
`;
