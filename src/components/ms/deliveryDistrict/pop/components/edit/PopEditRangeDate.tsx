/*
 ############################################################################
 # FiledataField	: DateRange.tsx
 # Description		: Date Picker + Date Picker Component
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Types
import CheckBox from '@/components/common/custom/form/CheckBox';
import { useDatepickerInputToDayjs } from '@/hooks/cm/useDatepickerInputToDayjs';
import { useDatepickerPeriodExtension } from '@/hooks/cm/useDatepickerPeriodExtension';
import { useFormConfig } from '@/hooks/cm/useFormConfig';
import { DateRangeProps } from '@/types/input';

// Libs
import { DatePicker, Form } from 'antd';

interface Props extends DateRangeProps {
	fromRefs?: any;
	toRefs?: any;
	disabledFields?: any;
	onChange?: any;
	[key: string]: any;
}

const DateRange = (props: Props) => {
	const form = Form.useFormInstance();
	const { formDisabled } = useFormConfig();

	const {
		span = 24,
		label,
		required,
		format,
		fromName,
		toName,
		disabled,
		placeholder,
		onChange,
		allowClear,
		fromDisabledDate,
		toDisabledDate,
		inputReadOnly,
		open,
		picker,
		hasCheckboxForPeriodExtension = false,
		fromDateDisabled = false,
	} = props;

	const {
		isFromPeriodExtension,
		isToPeriodExtension,
		toggleFromPeriodExtension,
		toggleToPeriodExtension,
		minFromDate,
		minToDate,
		textInCheckbox,
	} = useDatepickerPeriodExtension({
		hasCheckboxForPeriodExtension,
	});

	const { onKeydownDatePicker, convertDatePickerInputToDayjs } = useDatepickerInputToDayjs();

	const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, fieldName: string) => {
		onKeydownDatePicker(e, () => convertAndUpdateForm(fieldName, (e.target as HTMLInputElement).value), 'DateRange');

		if ((e.key === 'Enter' || e.key === 'Tab') && !e.shiftKey) {
			e.preventDefault();
			e.stopPropagation();
		}
	};

	const convertAndUpdateForm = (fieldName: string, inputValue: string) => {
		const { dayjsDate, formattedDate } = convertDatePickerInputToDayjs(inputValue, picker);

		form.setFieldValue(fieldName, dayjsDate);

		onChange?.(dayjsDate, formattedDate);
	};

	return (
		<Form.Item label={label} required={required} className="date-range">
			<Form.Item
				name={fromName}
				required={required}
				rules={props.required ? [{ required: true }] : null}
				colon={props.colon ?? false}
			>
				<DatePicker
					ref={props.fromRefs}
					format={format}
					disabled={disabled || formDisabled || fromDateDisabled}
					placeholder={placeholder}
					onKeyDown={e => handleKeyDown(e, fromName)}
					allowClear={false} // 클리어 'x' 버튼 노출 방지
					disabledDate={fromDisabledDate}
					inputReadOnly={inputReadOnly}
					open={open}
					picker={picker}
					minDate={minFromDate}
					{...(hasCheckboxForPeriodExtension && {
						renderExtraFooter: () => (
							<CheckBox
								label={''}
								name="fromPeriodExtension"
								className="bg-white txt-r"
								value={isFromPeriodExtension}
								onChange={toggleFromPeriodExtension}
							>
								{textInCheckbox}
							</CheckBox>
						),
					})}
				/>
			</Form.Item>
			<span>~</span>
			<Form.Item name={toName} required={required} rules={props.required ? [{ required: true }] : null}>
				<DatePicker
					ref={props.toRefs}
					format={format}
					disabled={disabled}
					placeholder={placeholder}
					onKeyDown={e => handleKeyDown(e, toName)}
					allowClear={false}
					disabledDate={toDisabledDate}
					inputReadOnly={inputReadOnly}
					open={open}
					picker={picker}
					minDate={minToDate}
					{...(hasCheckboxForPeriodExtension && {
						renderExtraFooter: () => (
							<CheckBox
								label={''}
								name="toPeriodExtension"
								className="bg-white txt-r"
								value={isToPeriodExtension}
								onChange={toggleToPeriodExtension}
							>
								{textInCheckbox}
							</CheckBox>
						),
					})}
				/>
			</Form.Item>
		</Form.Item>
	);
};

export default DateRange;
