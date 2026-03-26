// lib
import { Button, Checkbox, Flex, Radio, RadioChangeEvent, Select } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-js-cron/dist/styles.css';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import quartzToNaturalLanguage from '@/components/batch/batchPopup/BatchScheduleFunction';
import { SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { CheckboxChangeEvent, CheckboxGroupProps } from 'antd/es/checkbox';

export interface selectItems {
	cronExpression: string;
	cronText: string;
	rowIndex: number;
}

interface propsTypes {
	close: () => void;
	param: any;
	onSelect: (selected: any) => void;
}

interface ParamTypes {
	jobSchedule?: string;
	jobScheduleDesc?: string;
	rowIndex: number;
}

const BatchScheduleSetPop = (props: propsTypes) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, onSelect } = props;
	const param: ParamTypes = props.param;
	const { t } = useTranslation();

	/****** 요일, 시, 분, 초 값 셋팅. START *********************/
	const second = Array.from({ length: 60 }, (_, i) => i);
	const minute = Array.from({ length: 60 }, (_, i) => i);
	const hours = Array.from({ length: 24 }, (_, i) => i);
	const monthDay = Array.from({ length: 31 }, (_, i) => i + 1 + '일');

	const optionsWeek = [
		{ label: '*', value: '?' },
		{ label: '일요일', value: 'SUN' },
		{ label: '월요일', value: 'MON' },
		{ label: '화요일', value: 'TUE' },
		{ label: '수요일', value: 'WED' },
		{ label: '목요일', value: 'THU' },
		{ label: '금요일', value: 'FRI' },
		{ label: '토요일', value: 'SAT' },
	];
	/****** 요일, 시, 분, 초 값 셋팅. END *********************/

	const [secondVal, setSecondVal] = useState<string[]>([]);
	const [minuteVal, setMinuteVal] = useState<string[]>([]);
	const [hourVal, setHourVal] = useState<string[]>([]);
	const [monthDayVal, setMonthDayVal] = useState<string[]>([]);

	const [showMinuteSecondDiv, setShowMinuteSecondDiv] = useState(true);
	const [showHourMinuteDiv, setShowHourMinuteDiv] = useState(true);
	const [showDayHourDiv, setShowDayHourDiv] = useState(true);
	const [showWeekDiv, setShowWeekDiv] = useState(true);
	const [showMonthDayDiv, setShowMonthDayDiv] = useState(true);

	const [secondTermChk, setSecondTermChk] = useState(false);
	const [minuteTermChk, setMinuteTermChk] = useState(false);
	const [hourTermChk, setHourTermChk] = useState(false);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	useEffect(() => {
		if (param?.jobSchedule) {
			setCronExpression(param.jobSchedule);
			setCronText(quartzToNaturalLanguage(param.jobSchedule));
		} else {
			resetAllValues();
		}

		setShowMinuteSecondDiv(true);
		setShowHourMinuteDiv(false);
		setShowDayHourDiv(false);
		setShowWeekDiv(false);
		setShowMonthDayDiv(false);
	}, [param.jobSchedule]);

	/**
	 * 초기화
	 * /src/layout/Tab/MainTabs.tsx >>> onClickRefreshTab function 그대로 가져옴
	 * @returns {void}
	 */
	const refreshFn = (): void => {
		//resetAllValues();
		setCronExp();

		setShowMinuteSecondDiv(true);
		setShowHourMinuteDiv(false);
		setShowDayHourDiv(false);
		setShowWeekDiv(false);
		setShowMonthDayDiv(false);
	};

	/**
	 * 설정한 스케쥴 선택 - 그리드 목록으로 보내기
	 * /src/layout/Tab/MainTabs.tsx >>> onClickRefreshTab function 그대로 가져옴
	 * @returns {void}
	 */
	const onSelectFn = (): void => {
		const selectValue: selectItems = {
			cronExpression,
			cronText: cronText,
			rowIndex: param.rowIndex,
		};

		if (onSelect) onSelect(selectValue); // 부모로 전달
		close(); // 팝업 닫기
	};

	const onChangeSecondTermChk = (e: CheckboxChangeEvent) => {
		setSecondTermChk(e.target.checked);
	};

	const onChangeMinuteTermChk = (e: CheckboxChangeEvent) => {
		setMinuteTermChk(e.target.checked);
	};

	const onChangeHourTermChk = (e: CheckboxChangeEvent) => {
		setHourTermChk(e.target.checked);
	};

	/**
	 * 데이터 조회 (API 호출)
	 * @param {boolean} isSearchButtonClicked - 검색 버튼 클릭 여부 (true: 클릭, false: 스크롤)
	 */

	const options: CheckboxGroupProps<string>['options'] = [
		{ label: '초', value: 'MI' },
		{ label: '분', value: 'HH' },
		{ label: '시', value: 'DD' },
		{ label: '주', value: 'WW' },
		{ label: '일', value: 'MM' },
	];

	const isInitialRender = useRef(true);
	const [cronSecond, setCronSecond] = useState('0');
	const [cronMinute, setCronMinute] = useState('*');
	const [cronHour, setCronHour] = useState('*');
	const [cronDayOfMonth, setCronDayOfMonth] = useState('*');
	const [cronMonth, setCronMonth] = useState('*');
	const [cronDayOfWeek, setCronDayOfWeek] = useState('?');
	const [cronExpression, setCronExpression] = useState<string>('');
	const [cronText, setCronText] = useState<string | null>(null);

	useEffect(() => {
		if (isInitialRender.current) {
			isInitialRender.current = false; // 첫 렌더링에서만 true → 이후 false
			return; // 바로 빠져나가서 실행 안함
		}

		setCronExp();
	}, [cronSecond, cronMinute, cronHour, cronDayOfMonth, cronMonth, cronDayOfWeek]);

	const setCronExp = () => {
		if (cronSecond.length == 0) {
			setCronSecond('0');
		} else if (cronMinute.length == 0) {
			setCronMinute('*');
		} else if (cronHour.length == 0) {
			setCronHour('*');
		} else if (cronDayOfMonth.length == 0) {
			setCronDayOfMonth('*');
		} else if (cronMonth.length == 0) {
			setCronMonth('*');
		}

		if (cronDayOfWeek.length > 0 && cronDayOfWeek != '?') {
			if (cronDayOfMonth.length == 0 || cronDayOfMonth == '*') {
				setCronDayOfMonth('?');
			}
		} else {
			if (cronDayOfMonth.length == 0 || cronDayOfMonth == '?' || cronDayOfMonth == '*') {
				setCronDayOfMonth('*');
			}
			setCronDayOfWeek('?');
		}

		const cron = `${cronSecond} ${cronMinute} ${cronHour} ${cronDayOfMonth} ${cronMonth} ${cronDayOfWeek}`;
		setCronExpression(cron);
		setCronText(quartzToNaturalLanguage(cron));
	};

	/**
	 * 모든 값 초기화
	 */
	const resetAllValues = () => {
		setCronSecond('0');
		setCronMinute('*');
		setCronHour('*');
		setCronDayOfMonth('*');
		setCronMonth('*');
		setCronDayOfWeek('?');

		setSecondVal([]);
		setMinuteVal([]);
		setHourVal([]);
		setMonthDayVal([]);
	};

	// 스케쥴 선택 이벤트
	const scheduleSelectFn = (value: string) => {
		if (value == 'MI') {
			setCronMinute('*');
			setCronHour('*');
			setCronDayOfMonth('*');
			setCronMonth('*');
			setCronDayOfWeek('?');

			setMinuteVal([]);
			setHourVal([]);
			setMonthDayVal([]);

			setShowMinuteSecondDiv(true);
			setShowHourMinuteDiv(false);
			setShowDayHourDiv(false);
			setShowWeekDiv(false);
			setShowMonthDayDiv(false);
		} else if (value == 'HH') {
			setCronHour('*');
			setCronDayOfMonth('*');
			setCronMonth('*');
			setCronDayOfWeek('?');

			setHourVal([]);
			setMonthDayVal([]);

			setShowHourMinuteDiv(true);
			setShowMinuteSecondDiv(true);
			setShowDayHourDiv(false);
			setShowWeekDiv(false);
			setShowMonthDayDiv(false);
		} else if (value == 'DD') {
			setCronDayOfMonth('*');
			setCronMonth('*');
			setCronDayOfWeek('?');

			setMonthDayVal([]);

			setShowDayHourDiv(true);
			setShowHourMinuteDiv(true);
			setShowMinuteSecondDiv(true);
			setShowWeekDiv(false);
			setShowMonthDayDiv(false);
		} else if (value == 'WW') {
			setCronDayOfMonth('*');
			setCronMonth('*');

			setShowWeekDiv(true);
			setShowDayHourDiv(true);
			setShowHourMinuteDiv(true);
			setShowMinuteSecondDiv(true);
			setShowMonthDayDiv(false);
		} else if (value == 'MM') {
			setCronMonth('*');

			setShowMonthDayDiv(true);
			setShowWeekDiv(true);
			setShowDayHourDiv(true);
			setShowHourMinuteDiv(true);
			setShowMinuteSecondDiv(true);
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="스케줄러 설정" showButtons={false} />
			<div className="btn-group flex-just-end flex-align-cen">
				<Button onClick={refreshFn} size={'small'}>
					{' '}
					{t('lbl.RESET')}{' '}
				</Button>
				<Button onClick={onSelectFn} size={'small'}>
					{' '}
					선택{' '}
				</Button>
			</div>
			<div className="schedule-set">
				<dl>
					<dt>크론식</dt>
					<dd>
						<div className="batch-msg">
							<p>{cronExpression}</p>
						</div>
					</dd>
				</dl>
				<dl>
					<dt>자연어</dt>
					<dd>
						<div className="batch-msg">
							<p>{cronText}</p>
						</div>
					</dd>
				</dl>
				<dl>
					<dt>스케쥴 선택</dt>
					<dd>
						<div>
							<Flex vertical gap="middle" style={{ width: '95%', height: 60 }}>
								<Radio.Group
									block
									options={options}
									defaultValue="MI"
									optionType="button"
									buttonStyle="solid"
									size={'large'}
									onChange={(e: RadioChangeEvent) => {
										const selectedValue = e.target.value;
										scheduleSelectFn(selectedValue);
									}}
								/>
							</Flex>
						</div>

						{/*월단위 - 일,주,시,분,초 - monthDayVal*/}
						{showMonthDayDiv && (
							<div>
								<Select
									style={{ width: 100 }}
									dropdownStyle={{ width: 300 }}
									mode="multiple"
									placement="topLeft"
									value={monthDayVal}
									placeholder="0"
									onChange={v => setMonthDayVal(v)}
									tagRender={({ label }) => (
										<span
											style={{
												display: 'inline-block',
												padding: '2px 8px',
												background: '#f5f5f5',
												borderRadius: '6px',
												marginRight: 4,
											}}
										>
											{label}
										</span>
									)}
									dropdownRender={() => (
										<div className="grid-hour-dropdown">
											{monthDay.map(monthDay => (
												<div
													key={monthDay}
													className="grid-cell"
													onClick={() => {
														if (!monthDayVal.includes(monthDay)) {
															setMonthDayVal([...monthDayVal, monthDay]);

															const cleanedList = [...monthDayVal, monthDay].map(v => v.replace(/일$/, ''));
															setCronDayOfMonth(cleanedList.join(','));
														} else {
															// 이미 선택되어 있으면 제거 (토글 방식)
															setMonthDayVal(monthDayVal.filter(v => v !== monthDay));

															const cleanedList = monthDayVal
																.filter(v => v !== monthDay)
																.map(v => v.replace(/일$/, ''));
															setCronDayOfMonth(cleanedList.join(','));
														}
													}}
												>
													{monthDay}
												</div>
											))}
										</div>
									)}
								/>
							</div>
						)}

						{/*주단위 - 주,시,분,초 - */}
						{showWeekDiv && (
							<div>
								<SelectBox
									style={{ width: 100 }}
									dropdownStyle={{ backgroundColor: '#ffffff' }}
									name="week"
									placeholder="*"
									mode="multiple"
									options={optionsWeek}
									fieldNames={{ label: 'label', value: 'value' }}
									onChange={(value: string) => {
										setCronDayOfWeek(value);
									}}
								/>
							</div>
						)}

						{/*일단위 - 시, 분,초 - hourVal*/}
						{showDayHourDiv && (
							<div>
								<Select
									style={{ width: 100 }}
									dropdownStyle={{ width: 300 }}
									mode="multiple"
									value={hourVal}
									placeholder="0"
									onChange={v => setHourVal(v)}
									tagRender={({ label }) => (
										<span
											style={{
												display: 'inline-block',
												padding: '2px 8px',
												background: '#f5f5f5',
												borderRadius: '6px',
												marginRight: 4,
											}}
										>
											{label}
										</span>
									)}
									dropdownRender={() => (
										<div className="grid-hour-dropdown">
											{hours.map(hour => (
												<div
													key={hour}
													className="grid-cell"
													onClick={() => {
														if (hourTermChk == false) {
															if (!hourVal.includes(hour.toString())) {
																setHourVal([...hourVal, hour.toString()]);
																setCronHour([...hourVal, hour.toString()].join(','));
															} else {
																// 이미 선택되어 있으면 제거 (토글 방식)
																setHourVal(hourVal.filter(v => v !== hour.toString()));
																setCronHour(hourVal.filter(v => v !== hour.toString()).join(','));
															}
														} else {
															// 간격 체크 시: 마지막 값 + '/' + 클릭 값
															if (hourVal.length > 0) {
																const lastHourVal = hourVal[hourVal.length - 1];
																setHourVal([lastHourVal, hour.toString()]);
																setCronHour(`${lastHourVal}/${hour}`);
															} else {
																// 아직 아무 값도 없을 때는 현재 값만 저장
																setHourVal([hour.toString()]);
																setCronHour(hour.toString());
															}
														}
													}}
												>
													{hour}
												</div>
											))}
										</div>
									)}
								/>
								<li>hour</li>
								<li>
									<Checkbox name={'hourTerm'} value={hourTermChk} onChange={onChangeHourTermChk}>
										간격
									</Checkbox>
								</li>
							</div>
						)}

						{/*시단위 - 분, 초 - minuteSecondVal */}
						{showHourMinuteDiv && (
							<div>
								<Select
									style={{ width: 100 }}
									dropdownStyle={{ width: 300 }}
									mode="multiple"
									value={minuteVal}
									placeholder="0"
									onChange={v => setMinuteVal(v)}
									tagRender={({ label }) => (
										<span
											style={{
												display: 'inline-block',
												padding: '2px 8px',
												background: '#f5f5f5',
												borderRadius: '6px',
												marginRight: 4,
											}}
										>
											{label}
										</span>
									)}
									dropdownRender={() => (
										<div className="grid-minute-dropdown">
											{minute.map(minute => (
												<div
													key={minute}
													className="grid-cell"
													onClick={() => {
														if (minuteTermChk == false) {
															if (!minuteVal.includes(minute.toString())) {
																setMinuteVal([...minuteVal, minute.toString()]);
																setCronMinute([...minuteVal, minute].join(','));
															} else {
																// 이미 선택되어 있으면 제거 (토글 방식)
																setMinuteVal(minuteVal.filter(v => v !== minute.toString()));
																setCronMinute(minuteVal.filter(v => v !== minute.toString()).join(','));
															}
														} else {
															// 간격 체크 시: 마지막 값 + '/' + 클릭 값
															if (minuteVal.length > 0) {
																const lastMinuteVal = minuteVal[minuteVal.length - 1];
																setMinuteVal([lastMinuteVal, minute.toString()]);
																setCronMinute(`${lastMinuteVal}/${minute}`);
															} else {
																// 아직 아무 값도 없을 때는 현재 값만 저장
																setMinuteVal([minute.toString()]);
																setCronMinute(minute.toString());
															}
														}
													}}
												>
													{minute}
												</div>
											))}
										</div>
									)}
								/>
								<li>minute</li>
								<li>
									<Checkbox name={'minuteTerm'} value={minuteTermChk} onChange={onChangeMinuteTermChk}>
										간격
									</Checkbox>
								</li>
							</div>
						)}

						{/*분단위 - 초 - secondVal */}
						{showMinuteSecondDiv && (
							<div>
								<Select
									style={{ width: 100 }}
									dropdownStyle={{ width: 300 }}
									mode="multiple"
									value={secondVal}
									placeholder="0"
									onChange={v => setSecondVal(v)}
									tagRender={({ label }) => (
										<span
											style={{
												display: 'inline-block',
												padding: '2px 8px',
												background: '#f5f5f5',
												borderRadius: '6px',
												marginRight: 4,
											}}
										>
											{label}
										</span>
									)}
									dropdownRender={() => (
										<div className="grid-minute-dropdown">
											{second.map(second => (
												<div
													key={second}
													className="grid-cell"
													onClick={() => {
														if (secondTermChk == false) {
															if (!secondVal.includes(second.toString())) {
																setSecondVal([...secondVal, second.toString()]);
																setCronSecond([...secondVal, second].join(','));
															} else {
																// 이미 선택되어 있으면 제거 (토글 방식)
																setSecondVal(secondVal.filter(v => v !== second.toString()));
																setCronSecond(secondVal.filter(v => v !== second.toString()).join(','));
															}
														} else {
															// 간격 체크 시: 마지막 값 + '/' + 클릭 값
															if (secondVal.length > 0) {
																const lastSecondVal = secondVal[secondVal.length - 1];
																setSecondVal([lastSecondVal, second.toString()]);
																setCronSecond(`${lastSecondVal}/${second}`);
															} else {
																// 아직 아무 값도 없을 때는 현재 값만 저장
																setSecondVal([second.toString()]);
																setCronSecond(second.toString());
															}
														}
													}}
												>
													{second}
												</div>
											))}
										</div>
									)}
								/>
								<li>second</li>
								<li>
									<Checkbox name={'secondTerm'} value={secondTermChk} onChange={onChangeSecondTermChk}>
										간격
									</Checkbox>
								</li>
							</div>
						)}
					</dd>
				</dl>
			</div>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{t('lbl.BTN_CANCEL')}
				</Button>
				{/*<Button size={'middle'} type="primary" onClick={checkRowData}>
					{t('lbl.BTN_CONFIRM')}
				</Button>*/}
			</ButtonWrap>
		</>
	);
};

export default BatchScheduleSetPop;
