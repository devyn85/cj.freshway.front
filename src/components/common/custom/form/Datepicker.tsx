/*
 ############################################################################
 # FiledataField	: Datepicker.tsx
 # Description		: Custom Date Picker & Range Picker
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Types
import CheckBox from '@/components/common/custom/form/CheckBox';
import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { useDatepickerInputToDayjs } from '@/hooks/cm/useDatepickerInputToDayjs';
import { useDatepickerPeriodExtension } from '@/hooks/cm/useDatepickerPeriodExtension';
import { useToggle } from '@/hooks/useToggle';
import { DateProps } from '@/types/input';

// Libs
import { useFormConfig } from '@/hooks/cm/useFormConfig';
import { Button, Col, DatePicker as Datepicker, Form } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';

const DatePicker = (props: DateProps) => {
	const form = Form.useFormInstance();
	const { formDisabled } = useFormConfig();
	const datePickerRef = useRef<any>(null);

	const {
		span = 24,
		format,
		disabled,
		readOnly = false,
		placeholder,
		onChange,
		picker,
		allowClear,
		showNow,
		placement,
		showTime,
		disabledDate,
		hasCheckboxForPeriodExtension = false,
	} = props;

	const formProps = {
		label: props.label,
		name: props.name,
		required: props.required ? true : false,
		rules: props.required ? [{ required: true }] : null,
		colon: props.colon ?? true,
		help: props.help ?? false,
		validateStatus: props.validateStatus ?? '',
	};

	const { isFromPeriodExtension, toggleFromPeriodExtension, minFromDate, textInCheckbox } =
		useDatepickerPeriodExtension({
			hasCheckboxForPeriodExtension,
		});

	const computedClassName = `${props.className ?? ''} ${readOnly ? 'ant-picker-readonly' : ''}`.trim();

	const { value: isOpen, toggle, close: closePanel } = useToggle(false);

	// 외부 스크롤 시 DatePicker 패널 닫기
	useCloseOnExternalScroll({
		open: isOpen,
		onClose: closePanel,
		allowScrollRefs: [datePickerRef],
		allowScrollSelectors: ['.ant-picker-panel-container', '.ant-picker-time-panel-column'],
	});

	const { onKeydownDatePicker, onBlurDatePicker, convertDatePickerInputToDayjs } = useDatepickerInputToDayjs();

	const handleBlur = (e: React.FocusEvent<HTMLElement>, fieldName: string) => {
		const inputValue = (e.target as HTMLInputElement).value;

		// DatePicker 내부 요소(캘린더 패널 등)에서 발생하는 blur는 처리하지 않음
		if (!canApplyOnChangeByDatePickerInnerElement(e)) {
			return;
		}

		// 20251118@ 날짜를 지운 경우(빈 값) form에 null 설정하여 자동 재설정 방지 by sss
		if (!inputValue || inputValue.trim() === '') {
			form.setFieldValue(fieldName, null);
			onChange?.(null, '');
			return;
		}

		if (commUtil.isNotEmpty(inputValue)) {
			onBlurDatePicker(() => convertAndUpdateForm(fieldName, inputValue));
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, fieldName: string) => {
		if (!validateInputValue(e, format)) {
			return;
		}

		onKeydownDatePicker(
			e,
			() => convertAndUpdateForm(fieldName, (e.target as HTMLInputElement).value, e),
			'DatePicker',
			true, // DatePicker는 하나이니까 첫 번째 인풋이라고 가정
		);

		// 날짜 선택 영역 표출 방지
		if ((e.key === 'Enter' || e.key === 'Tab') && !e.shiftKey) {
			e.preventDefault();
			e.stopPropagation();
		}
	};

	const convertAndUpdateForm = (fieldName: string, inputValue: string, e?: any) => {
		const { dayjsDate, formattedDate } = convertDatePickerInputToDayjs(inputValue, picker, e);

		form.setFieldValue(fieldName, dayjsDate);

		onChange?.(dayjsDate, formattedDate);
	};

	useEffect(
		/**
		 * defaultValue가 있으면 form에도 초기값 설정
		 */
		function initSetDatePickerByDefaultValue() {
			if (props.defaultValue) {
				form.setFieldValue(props.name, props.defaultValue);
			}
		},
		[props.defaultValue],
	);

	return (
		<Col span={span}>
			<Form.Item {...formProps}>
				<Datepicker
					{...props}
					ref={props.refs || datePickerRef}
					format={format} // 날짜 포맷 지정
					disabled={disabled ?? formDisabled} // 비활성화 여부
					placeholder={placeholder}
					placement={placement} // datepicker 위치 조정: bottomLeft | bottomRight | topLeft | topRight
					picker={picker} // type 지정: date | week | month | quarter | year | time
					showTime={showTime} // 시간 선택 영역 활성화 여부
					showNow={showNow} // 현재 시각 노출 여부
					allowClear={allowClear ?? true} // 입력 삭제 가능 여부
					onChange={onChange}
					disabledDate={disabledDate} // 선택 불가 시간 지정
					readOnly={readOnly} //  실제 readOnly prop 적용
					className={computedClassName}
					onKeyDown={e => handleKeyDown(e, props.name)}
					onFocus={e => handleFocus(e as React.FocusEvent<HTMLInputElement>)}
					onBlur={e => handleBlur(e, props.name)}
					onOpenChange={() => toggle()}
					open={isOpen}
					minDate={minFromDate}
					{...((hasCheckboxForPeriodExtension || picker === 'month') && {
						renderExtraFooter: () => (
							<div className="flex-wrap jc-center pd5 pos-asr">
								{hasCheckboxForPeriodExtension && (
									<CheckBox
										label={''}
										name="periodExtension"
										className="bg-white"
										value={isFromPeriodExtension}
										onChange={toggleFromPeriodExtension}
									>
										{textInCheckbox}
									</CheckBox>
								)}
								{picker === 'month' && (
									<Button
										size="small"
										type="primary"
										onClick={() => {
											form.setFieldValue(props.name, dayjs());
											setTimeout(() => {
												toggle();
											});
										}}
									>
										이번달
									</Button>
								)}
							</div>
						),
					})}
				/>
			</Form.Item>
		</Col>
	);
};

//export const MyDatePicker = generatePicker<Moment>(momentGenerateConfig);

export default DatePicker;

/**
 * Range Picker return => [dayjs(fromDt),dayjs(thruDt)]
 */
const { RangePicker } = Datepicker;
// interface RangeProps extends DateProps {
// 	[key: string]: any;
// }

export const Rangepicker = (props: any) => {
	const form = Form.useFormInstance();
	const { formDisabled } = useFormConfig();
	const rangePickerRef = useRef<any>(null);

	const {
		refs,
		span = 24,
		format,
		disabled,
		readOnly = false,
		onChange,
		picker,
		allowClear,
		showNow,
		placement,
		showTime,
		disabledDate,
		onCalendarChange,
		onOpenChange,
		hasCheckboxForPeriodExtension = false,
		order = true,
	} = props;

	const { value: isOpen, toggle, close: closePicker } = useToggle(false);

	// 외부 스크롤 시 RangePicker 패널 닫기
	useCloseOnExternalScroll({
		open: isOpen,
		onClose: closePicker,
		allowScrollRefs: [rangePickerRef],
		allowScrollSelectors: ['.ant-picker-panel-container'],
	});

	const formProps = {
		label: props.label,
		name: props.name,
		required: props.required ? true : false,
		rules: props.required
			? [
					{
						// Rangepicker 컴포넌트 Form.validateFields() 함수 rules 커스텀
						// 기본 rules 옵션은 validate가 안되는 이슈
						validator: (_: any, value: any) => {
							if ((Array.isArray(value) && value.includes(null)) || commUtil.isEmpty(value)) {
								return Promise.reject(new Error(`${props.label}를 선택해주세요.`));
							}
							return Promise.resolve();
						},
					},
			  ]
			: null,
	};

	const { isFromPeriodExtension, toggleFromPeriodExtension, minFromDate, textInCheckbox } =
		useDatepickerPeriodExtension({
			hasCheckboxForPeriodExtension,
		});

	const { onKeydownDatePicker, onBlurDatePicker, convertDatePickerInputToDayjs } = useDatepickerInputToDayjs();

	const computedClassName = `${props.className ?? ''} ${readOnly ? 'ant-picker-readonly' : ''}`.trim();

	const handleChangeRangePickerInput = (
		e: React.KeyboardEvent<HTMLElement> | React.FocusEvent<HTMLElement>,
		fieldName: string,
	) => {
		// input 요소가 RangePicker의 첫 번째인지 두 번째인지 확인

		const isFirstInput = getIsFirstInput(e);

		convertAndUpdateForm(fieldName, (e.target as HTMLInputElement).value, isFirstInput, e);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, fieldName: string, format: string) => {
		if (!validateInputValue(e, format)) {
			return;
		}

		const isFirstInput = getIsFirstInput(e);
		onKeydownDatePicker(e, () => handleChangeRangePickerInput(e, fieldName), 'RangePicker', isFirstInput, showTime);
	};

	const handleBlur = (e: React.FocusEvent<HTMLElement>, fieldName: string) => {
		const inputValue = (e.target as HTMLInputElement).value;

		// DatePicker 내부 요소(캘린더 패널 등)에서 발생하는 blur는 처리하지 않음
		if (!canApplyOnChangeByDatePickerInnerElement(e)) {
			return;
		}

		// 날짜를 지운 경우(빈 값) 처리
		if (!inputValue || inputValue.trim() === '') {
			const isFirstInput = getIsFirstInput(e);
			const currentValue = form.getFieldValue(fieldName);
			const newValue = Array.isArray(currentValue) ? [...currentValue] : [null, null];

			if (isFirstInput) {
				newValue[0] = null;
			} else {
				newValue[1] = null;
			}

			form.setFieldValue(fieldName, newValue);
			onChange?.(newValue, [newValue[0]?.format?.('YYYYMMDD') || '', newValue[1]?.format?.('YYYYMMDD') || '']);
			return;
		}

		onBlurDatePicker(() => handleChangeRangePickerInput(e, fieldName), showTime);
	};

	const convertAndUpdateForm = (fieldName: string, inputValue: string, isFirstInput: boolean, e?: any) => {
		const { dayjsDate, formattedDate } = convertDatePickerInputToDayjs(inputValue, picker, e, showTime);

		// 현재 필드 값 가져오기
		const currentValue = form.getFieldValue(fieldName);
		const newValue = Array.isArray(currentValue) ? [...currentValue] : [null, null];

		// 키보드로 to날짜 입력시 "종료일이 시작일보다 빠를 수 없습니다." 경고창 제대로 노출시키기 위해 onChange 다음으로 위치 변경
		// form.setFieldValue(fieldName, newValue);

		if (isFirstInput) {
			newValue[0] = dayjsDate;
			onChange?.(newValue, [formattedDate, newValue[1]?.format('YYYYMMDD') || '']);
		} else {
			newValue[1] = dayjsDate;
			onChange?.(newValue, [currentValue?.[0]?.format('YYYYMMDD') || '', formattedDate]);
		}

		form.setFieldValue(fieldName, newValue);
	};

	/**
	 * onChange 콜백 전 처리
	 * @param {any} values 날짜 값
	 * @returns {void}
	 */
	const preOnChange = (values: any) => {
		if (values && values[0] && values[1]) {
			// 시작일이 종료일보다 뒤라면 순서를 바꿔서 저장
			const [start, end] = values;
			if (start.isAfter(end, 'day')) {
				values = [end, start];
				form.setFieldValue(formProps.name, [end, start]);
			}
		} else {
			form.setFieldValue(formProps.name, values);
		}

		// onChange 콜백
		if (props?.onChange && typeof props.onChange === 'function') {
			props?.onChange(values);
		}
	};

	const prevFormValue = useRef<any>(null);

	const formValue = Form.useWatch(props.name, form);

	useEffect(() => {
		if (formValue?.length > 1) {
			let prevStartDate = null;
			let prevEndDate = null;
			let startDate = null;
			let endDate = null;

			// 이전값이 있었다면, 이전값을 가져옴
			if (prevFormValue?.current) {
				const [prevStartDateByDayjs, prevEndDateByDayjs] = prevFormValue?.current;
				prevStartDate = dayjs(prevStartDateByDayjs).format('YYYYMMDD');
				prevEndDate = dayjs(prevEndDateByDayjs).format('YYYYMMDD');
			}

			// 현재값을 이전값에 저장 ( 날짜 변경 확인을 위한 )
			if (prevFormValue) {
				prevFormValue.current = formValue;
			}

			const [startDateByDayjs, endDateByDayjs] = formValue;

			startDate = dayjs(startDateByDayjs).format('YYYYMMDD');
			endDate = dayjs(endDateByDayjs).format('YYYYMMDD');
			if (!dayjs(startDate).isValid() || !dayjs(endDate).isValid()) {
				return;
			}

			if (startDate && endDate && prevStartDate && prevEndDate && order) {
				// 날짜 변경을 위해 시작일 변경 시 종료일보다 늦는 경우가 있음, 물론 종료일도 수정해주겠지만, 에러팝업이 계속 발생해서 불편하기에, 종료일 변경할때만 체크하도록함
				if (document.activeElement.getAttribute('date-range') === 'start') {
					return;
				}
				// 종료일은 시작일보다 빠를수없음

				//if (endDateByDayjs.isBefore(startDateByDayjs)) {
				if (startDate > endDate) {
					// 202260126@당일(26일 입력하면 연산오류로 날짜계산오류로 아래 메세지가 자꾸뜸 수정 by sss
					showAlert('', '종료일이 시작일보다 빠를 수 없습니다.');
					form.setFieldValue(props.name, [startDateByDayjs, null]);
					return;
				}
			}

			// 최초에 이전값이 없으면 현재값을 이전값에 저장 ( 날짜 변경 확인을 위한 )
			// 위에서 return이 발생하는 경우에는 이전값을 저장 안하기 위해 해당 로직을 최하단에 배치
			if (!prevStartDate || !prevEndDate) {
				prevFormValue.current = formValue;
			}
		}
		// date-range가 end인 의존성배열을 추가한 이유는,
		// formValue를 의존성배열에 추가하였으나, 종료일을 변경하지 않는 경우 formValue는 변경되지 않으므로,
		// 종료일자 blur 이벤트 발생 감지하여, 추가적으로 체크하도록함
	}, [formValue, document.activeElement.getAttribute('date-range') === 'end']);

	return (
		<Col span={span}>
			<Form.Item {...formProps}>
				<RangePicker
					{...props}
					ref={refs || rangePickerRef}
					format={format}
					disabled={disabled ?? formDisabled}
					placement={placement}
					picker={picker}
					showTime={showTime}
					showNow={showNow}
					allowClear={allowClear ?? true} // 클리어 'x' 버튼
					onChange={onChange}
					// order={false} // 자동 순서 교정 기능을 끔
					// onChange={preOnChange}
					onKeyDown={e => handleKeyDown(e, formProps.name, format)}
					onFocus={e => handleFocus(e as React.FocusEvent<HTMLInputElement>)}
					onBlur={e => handleBlur(e, formProps.name)}
					disabledDate={disabledDate}
					onCalendarChange={onCalendarChange}
					onOpenChange={open => {
						if (open !== undefined) {
							if (open) {
								toggle();
							} else {
								closePicker();
							}
						}
						onOpenChange?.(open);
					}}
					open={isOpen}
					readOnly={readOnly} //  실제 readOnly prop 적용
					className={computedClassName}
					minDate={minFromDate}
					{...((hasCheckboxForPeriodExtension || picker !== 'time') && {
						renderExtraFooter: () => (
							<div className="flex-wrap jc-center pd5 pos-asr">
								{hasCheckboxForPeriodExtension && (
									<CheckBox
										label={''}
										name="periodExtension"
										className="bg-white"
										value={isFromPeriodExtension}
										onChange={toggleFromPeriodExtension}
									>
										{textInCheckbox}
									</CheckBox>
								)}
								{picker !== 'time' && (
									<Button
										size="small"
										type="primary"
										onClick={() => {
											form.setFieldValue(formProps.name, [dayjs(), dayjs()]);
											setTimeout(() => {
												closePicker();
											});
										}}
									>
										오늘
									</Button>
								)}
							</div>
						),
					})}
				/>
			</Form.Item>
		</Col>
	);
};

const getIsFirstInput = (e: React.KeyboardEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
	const target = e.target as HTMLInputElement;
	const pickerContainer = target.closest('.ant-picker-range');
	const inputs = pickerContainer?.querySelectorAll('input');

	return target === inputs?.[0];
};

const validateInputValue = (e: React.KeyboardEvent<HTMLElement>, format: string) => {
	const target = e.target as HTMLInputElement;

	// 특수 키들은 허용 (탭, 백스페이스, 화살표 키 등)
	const allowedKeys = [
		'Tab',
		'Backspace',
		'Delete',
		'ArrowLeft',
		'ArrowRight',
		'ArrowUp',
		'ArrowDown',
		'Home',
		'End',
		'Enter',
		'Escape',
	];

	// 특수 키인 경우 허용
	if (allowedKeys.includes(e.key)) {
		return true;
	}

	// Ctrl, Alt, Shift와 함께 사용되는 키 조합 허용 (복사, 붙여넣기 등)
	if (e.ctrlKey || e.altKey || e.metaKey) {
		return true;
	}

	// 한글입력 차단이 안되서, 한글 입력되면 replace 처리하도록함
	if (e.key === 'Process' || e.nativeEvent.isComposing || /[ㄱ-ㅎ가-힣]/.test(e.key)) {
		e.preventDefault();
		e.stopPropagation();

		// 입력 후 필터링 적용
		setTimeout(() => {
			if (target?.value) {
				const filteredValue = target.value.replace(/[^0-9:-]/g, '');
				if (target.value !== filteredValue) {
					target.value = filteredValue;
				}
			}
		}, 0);

		return false;
	}

	const formatToValidate = format || 'YYYY-MM-DD';
	const maxLength = formatToValidate?.length;

	// 텍스트가 선택된 상태인지 확인
	const isTextSelected = target.selectionStart !== target.selectionEnd;

	// 최대 길이 체크 - 텍스트가 선택된 상태가 아닐 때만 체크
	if (!isTextSelected && target.value.length >= maxLength) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	// 숫자, 콜론(:), 하이픈(-) 이외의 문자 입력 차단
	if (!/^[0-9:-]$/.test(e.key)) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	return true;
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
	const isInputElement = e?.target?.matches?.('input');

	if (isInputElement) {
		e?.target?.select();
	}
};

/**
 * DatePicker blur 이벤트에서 onChange 적용 여부를 판단하는 함수
 * DatePicker 내부 UI 요소 간 포커스 이동 시에는 onChange 이벤트 발생 방지

 *
 * DatePicker 내부 UI 요소(달력 패널, 버튼 등) 간 포커스 이동 시에는
 * onChange를 발생시키지 않고, 실제로 DatePicker 외부로 포커스가
 * 이동할 때만 onChange를 적용하도록 제어
 * @param e - blur 이벤트 객체
 * @returns {boolean} onChange 적용 가능 여부 (true: 적용, false: 적용 안함)
 */
const canApplyOnChangeByDatePickerInnerElement = (e: React.FocusEvent<HTMLElement>) => {
	const datePickerInnerElementList = [
		'div.ant-picker-panel',
		'button',
		'div.ant-picker-panel-container.ant-picker-date-panel-container',
	];

	// blur 되는 요소가 DatePicker 내부 UI일 때 onChange 이벤트 발생 방지
	if (datePickerInnerElementList?.some(element => e.target.matches(element))) {
		return false;
	}

	// focus되는 요소가 DatePicker 내부 UI일 때 onChange 이벤트 발생 방지
	// relatedTarget는 blur가 발생할 때 focus되는 요소
	if (datePickerInnerElementList?.some(element => e.relatedTarget?.matches?.(element))) {
		return false;
	}

	return true;
};
