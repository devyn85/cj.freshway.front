/*
 ############################################################################
 # FiledataField	: DatePickerSample.tsx
 # Description		: DatePicker 샘플 
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Components
import { CheckBox, DateRange } from '@/components/common/custom/form';
import DatePicker, { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { CardComponent } from '@/pages/sample/comfunc/sample/InputSample';

// Antd Items
import { Button, Col, Form, Row } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';

// Libs
import dayjs from 'dayjs';

// Utils
import { validateForm } from '@/util/FormUtil';
import { showAlert } from '@/util/MessageUtil';

const DatePickerSample = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// form instance
	const [form] = Form.useForm();

	// 시작 일자 datePicker disabled date 처리를 위한 State
	const [fromDt, setFromDt] = useState(dayjs());

	// form data 초기화
	const initFormData = {
		datePickerBasic: dayjs('2023-09-12'),
		date: dayjs('2023-09-23'),

		// 오늘 ~ 1달 후 날짜 초기화
		fromDt1: dayjs(),
		thruDt1: dayjs().add(1, 'month'),

		// 오늘 ~ 당월 마지막 일 날짜 초기화
		fromDt2: fromDt,
		thruDt2: dayjs().endOf('month'),
	};

	const [desc, setDesc] = useState(
		<>Antd DatePicker의 데이터는 dayjs format으로 구현되어있어 데이터를 dayjs로 전환하여 조작합니다.</>,
	);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// form data onChange Event Handler
	const onFormChange = (changedValues: any, allValues: any) => {
		setFromDt(allValues.fromDt2);
	};

	/**
	 * data onChange Event Handler
	 * @param  {string} value 변경 후 data
	 */
	const onChange = (value: string) => {};

	/**
	 * 오늘 포함 이전 날짜 || 한달 이후 비활성화
	 * @param  {object} current 현재 날짜 & 시간
	 * @returns {boolean} 비활성화 여부
	 */
	const disabledDate: RangePickerProps['disabledDate'] = (current: any) => {
		// return true인 경우 비활성화
		return current && (current < dayjs().endOf('day') || current > dayjs().add(1, 'month').endOf('day'));
	};

	/**
	 * 오늘 포함 이전 날짜 || 한달 이후 비활성화
	 * @param  {object} current 현재 날짜 & 시간
	 * @returns {boolean} 비활성화 여부
	 */
	const fromDisabledDate: RangePickerProps['disabledDate'] = (current: any) => {
		// return true인 경우 비활성화
		return current && (current < dayjs().endOf('day') || current > dayjs().add(1, 'month').endOf('day'));
	};

	/**
	 * fromDt 선택일자 이전 || fromDt 7일 이후 비활성화
	 * @param  {object} current 현재 날짜 & 시간
	 * @returns {boolean} 비활성화 여부
	 */
	const toDisabledDate: RangePickerProps['disabledDate'] = (current: any) => {
		// return true인 경우 비활성화
		return current && (current < fromDt || current > fromDt.add(7, 'day'));
	};

	/**
	 * Form 전체 데이터 Validate 처리 함수
	 * validation은 Form Item마다 rules prop에 지정된 규칙으로 검증한다.
	 * 실패 시 로직 catch block에 기술
	 */
	const onValidate = async () => {
		//rules에 지정된 validation 기준으로 검증
		const isValid = await validateForm(form);
		if (isValid) {
			showAlert('', 'Validation 통과');
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// Component Mounted
	useEffect(() => {
		setDesc(
			<>
				<h2>Antd DatePicker의 데이터는 dayjs format으로 구현되어있어 데이터를 dayjs로 전환하여 조작합니다.</h2>
				<br />
				{'예시)'}
				<br />
				{"form.setFieldValue('date', '2023-09-23') => X"}
				<br />
				<h2>{"form.setFieldValue('date', dayjs('2023-09-23')) => O"}</h2>
				{"form.getFieldValue('date') => X,  res="}
				{JSON.stringify(form?.getFieldValue('date'))}
				<h2>
					{' '}
					{"form.getFieldValue('date').format('YYYY-MM-DD') => O, res="}
					{JSON.stringify(form?.getFieldValue('date')?.format('YYYY-MM-DD'))}
				</h2>
			</>,
		);
	}, []);

	return (
		<>
			<Form form={form} onValuesChange={onFormChange} initialValues={initFormData}>
				<Row gutter={[16, 16]}>
					{/* Date Picker Sample Area Start*/}
					<CardComponent title="DatePicker" desc={desc} extra={<Button onClick={onValidate}>validate</Button>}>
						<Row>
							<DatePicker
								label="기본"
								name="datePickerBasic"
								span={12}
								onChange={onChange}
								required
								allowClear
								rules={[{ required: true, validateTrigger: 'none' }]}
								renderExtraFooter={() => (
									<CheckBox label={''} name="rangeBasic1" className="txt-r">
										사용
									</CheckBox>
								)}
							/>
							<DatePicker label="비활성화" name="date" format="YYYY-MM-DD" disabled onChange={onChange} />
						</Row>
						<Row>
							<DatePicker
								label="날짜 선택 비활성화"
								name="yyyyMmDd"
								format="YYYY-MM-DD HH:mm:ss"
								span={24}
								onChange={onChange}
								showTime
								required
								allowClear
								disabledDate={disabledDate}
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</Row>
						<Row>
							<DatePicker
								label="연도 선택"
								name="yyyy"
								format="YYYY"
								placeholder={'연도 선택'}
								picker="year"
								onChange={onChange}
								allowClear
							/>
						</Row>
						<Row>
							<DatePicker
								label="월 선택"
								name="yyyyMm"
								format="YYYY-MM"
								picker="month"
								placeholder={'월 선택'}
								onChange={onChange}
								allowClear
								renderExtraFooter={() => (
									<div className="flex-wrap jc-center pd5">
										<Button size="small" type="primary" onClick={() => alert('확인')}>
											오늘
										</Button>
									</div>
								)}
							/>
						</Row>
						<Row>
							<DatePicker label="주 선택" name="week" span={12} picker="week" onChange={onChange} allowClear />
						</Row>
						<Row>
							<DatePicker
								label="시분초"
								name="time1"
								span={12}
								picker="time"
								placeholder={'시간 선택'}
								onChange={onChange}
								allowClear
							/>
						</Row>

						<Row>
							<DatePicker
								label="시분"
								name="time2"
								format="HH:mm"
								picker="time"
								placeholder={'시분 선택'}
								showNow={false}
								onChange={onChange}
								allowClear
							/>
						</Row>
						<Row>
							<DatePicker
								label="시간"
								name="time3"
								span={12}
								format="hh"
								picker="time"
								placeholder={'시 선택'}
								showNow={false}
								onChange={onChange}
								allowClear
							/>
						</Row>
						<Row>
							<DatePicker
								label="시"
								name="hour"
								format="HH"
								span={8}
								picker="time"
								placeholder={'시간 선택'}
								onChange={onChange}
								allowClear
								showNow={false}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
							<DatePicker
								label="분"
								name="min"
								format="mm"
								span={8}
								picker="time"
								placeholder={'시간 선택'}
								onChange={onChange}
								allowClear
								showNow={false}
								required
							/>
							<DatePicker
								label="초"
								name="sec"
								format="ss"
								span={8}
								picker="time"
								placeholder={'시간 선택'}
								onChange={onChange}
								allowClear
								showNow={false}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</Row>
					</CardComponent>
					{/* Date Picker Sample Area Finish*/}
					<Col span={12}>
						{/* RangePicker Sample Area Start */}
						<CardComponent span={24} title="RangePicker">
							<Row>
								<Rangepicker
									label="기본"
									name="rangeBasic"
									span={24}
									onChange={onChange}
									allowClear
									showNow={false}
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
									renderExtraFooter={() => (
										<div className="flex-wrap jc-center pd5">
											<Button size="small" type="primary" onClick={() => alert('확인')}>
												오늘
											</Button>
										</div>
									)}
								/>
							</Row>
							<Row>
								<Rangepicker
									label="날짜 선택 비활성화"
									name="rangeDisabledDate"
									span={24}
									onChange={onChange}
									allowClear
									showNow={false}
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
									disabledDate={disabledDate}
								/>
							</Row>
						</CardComponent>
						{/* RangePicker Sample Area Finish */}
						{/* Date Range Sample Area Start*/}
						<CardComponent span={24} title="Date Range">
							<DateRange
								label="기본"
								name="rangeBasic1"
								span={24}
								format="YYYY-MM-DD"
								fromName="fromDt1"
								toName="thruDt1"
								onChange={onChange}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
							<DateRange
								label="날짜 선택 비활성화"
								name="rangeBasic2"
								span={24}
								format="YYYY-MM-DD"
								fromName="fromDt2"
								toName="thruDt2"
								fromDisabledDate={fromDisabledDate}
								toDisabledDate={toDisabledDate}
								onChange={onChange}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</CardComponent>
						{/* Date Range Sample Area Finish*/}
					</Col>
				</Row>
			</Form>
		</>
	);
};

export default DatePickerSample;
