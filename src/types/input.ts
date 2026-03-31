/**
 * 타입 : 타입 > input
 * @module types/input
 * @author canalFrame <canalframe@cj.net>
 * @since 1.0.0
 */
import { Rule } from 'antd/lib/form';
import { ReactNode } from 'react';

/**
 * Form 인터페이스
 * @property {string} name name
 * @property {string} label label
 * @property {boolean} required required
 * @property {Rule[]} rules rules
 * @property {boolean} colon colon
 */
interface FormProps {
	refs?: any;
	name?: string;
	label?: string;
	required?: boolean;
	rules?: Rule[];
	colon?: boolean;
	[key: string]: any;
}

/**
 * common/input 하위 DOM의 인터페이스 정의
 * @property {number} span span
 * @property {string} id id
 * @property {string} title title
 * @property {boolean} disabled disabled
 * @property {string} placeholder placeholder
 * @property {boolean} allowClear allowClear
 * @property {string} size size
 * @property {string | number} width width
 * @property {any} value value
 * @property {any} children children
 * @property {any} onChange onChange
 * @property {any} onPressEnter onPressEnter
 */
interface InputProps extends FormProps {
	span?: any | number;
	id?: string;
	title?: string;
	disabled?: boolean;
	placeholder?: string;
	allowClear?: boolean;
	size?: 'large' | 'middle' | 'small';
	width?: string | number;
	value?: any;
	children?: any;
	onChange?: any;
	onPressEnter?: any;
}

/**
 * <InputText>, <InputTextArea> Props 타입 정의
 * @property {boolean | object} autoSize autoSize
 * @property {number} maxLength maxLength
 * @property {boolean} showCount showCount
 * @property {any} onPressEnter onPressEnter
 * @property {boolean} readOnly readOnly
 * @property {number} rows rows
 */
type InputTextProps = InputProps & {
	autoSize?: boolean | object;
	maxLength?: number;
	showCount?: boolean;
	onPressEnter?: any;
	readOnly?: boolean;
	rows?: number;
	hidden?: boolean;
};

/**
 * inputNumberProps
 * @property {number} min min
 * @property {number} max max
 * @property {number} step step
 * @property {boolean} showCount showCount
 * @property {any} formatter formatter
 * @property {any} parser parser
 */
type inputNumberProps = InputProps & {
	min?: number;
	max?: number;
	step?: number;
	showCount?: boolean;
	formatter?: any;
	parser?: any;
};

/**
 * <InputRange> Props 타입 정의
 * @property {boolean | object} autoSize autoSize
 * @property {number} maxLength maxLength
 * @property {boolean} showCount showCount
 * @property {any} onPressEnter onPressEnter
 * @property {boolean} readOnly readOnly
 * @property {number} rows rows
 */
type InputRangeProps = InputProps & {
	autoSize?: boolean | object;
	maxLength?: number;
	showCount?: boolean;
	onPressEnter?: any;
	readOnly?: boolean;
	rows?: number;
	fromName?: string;
	toName?: string;
	label?: string;
	span?: number;
};

/**
 * <InputPassword> Props 타입 정의
 * @property {number} maxLength maxLength
 * @property {boolean} showCount showCount
 * @property {boolean} visibilityToggle visibilityToggle
 */
type InputPasswordProps = InputProps & {
	maxLength?: number;
	showCount?: boolean;
	visibilityToggle?: boolean;
};

/**
 * <InputSearch> Props 타입 정의
 * @property {boolean | ReactNode} enterButton enterButton
 * @property {number} maxLength maxLength
 * @property {boolean} showCount showCount
 * @property {any} onSearch onSearch
 * @property {any} onPressEnter onPressEnter
 * @property {string} nameSearch nameSearch
 * @property {number} spanSearch spanSearch
 * @property {boolean} hidden hidden
 */
type InputSearchProps = InputProps & {
	enterButton?: boolean | ReactNode;
	maxLength?: number;
	showCount?: boolean;
	onSearch?: any;
	onPressEnter?: any;
	nameSearch?: string;
	spanSearch?: number;
	hidden?: boolean;
};

/**
 * <MultiInputText> Props 타입 정의
 * @property {boolean | ReactNode} enterButton enterButton
 * @property {number} maxLength maxLength
 * @property {boolean} showCount showCount
 * @property {any} onSearch onSearch
 * @property {any} onPressEnter onPressEnter
 * @property {string} nameSearch nameSearch
 * @property {number} spanSearch spanSearch
 * @property {boolean} hidden hidden
 */
type MultiInputTextProps = InputProps & {
	enterButton?: boolean | ReactNode;
	maxLength?: number;
	showCount?: boolean;
	onSearch?: any;
	onPressEnter?: any;
	nameSearch?: string;
	spanSearch?: number;
	hidden?: boolean;
};

/**
 * <Selectbox> Props 타입 정의
 * @property {string} mode mode
 * @property {object[]} options options
 * @property {string} optionLabel optionLabel
 * @property {string} optionValue optionValue
 * @property {boolean} showSearch showSearch
 * @property {object} fieldNames fieldNames
 * @property {any} defaultValue defaultValue
 * @property {any} notFoundContent notFoundContent
 * @property {boolean} allowClear allowClear
 * @property {any} filterOption filterOption
 * @property {any} onChange onChange
 * @property {any} onSelect onSelect
 * @property {any} onSearch onSearch
 * @property {any} onBlur onBlur
 */
interface SelectboxProps extends InputProps {
	mode?: 'multiple' | 'tags';
	options?: object[];
	optionLabel?: string;
	optionValue?: string;
	showSearch?: boolean;
	fieldNames?: object;
	defaultValue?: any;
	notFoundContent?: any;
	allowClear?: boolean;
	filterOption?: any;
	onChange?: any;
	onSelect?: any;
	onSearch?: any;
	onBlur?: any;
	validateValueInOptions?: boolean; // value가 options에 없으면 빈값으로 표기
}

/**
 * <Checkbox> Props 타입 정의
 * @property {boolean} trueValue trueValue
 * @property {boolean} falseValue falseValue
 * @property {boolean} checked checked
 * @property {boolean} indeterminate indeterminate
 */
type CheckboxProps = InputProps & {
	trueValue?: boolean | string;
	falseValue?: boolean | string;
	checked?: boolean;
	indeterminate?: boolean;
};

/**
 * <CheckboxGroup> Props 타입 정의
 * @property {object[]} options options
 * @property {string} optionDisabled optionDisabled
 * @property {string} optionLabel optionLabel
 * @property {string} optionValue optionValue
 * @property {number} optionSpan optionSpan
 */
type CheckboxGrpProps = InputProps & {
	options?: object[];
	optionDisabled?: string;
	optionLabel?: string;
	optionValue?: string;
	optionSpan?: number;
	label?: string;
};

/**
 * <Radiobox> Props 타입 정의
 * @property {object[]} options options
 * @property {string} optionDisabled optionDisabled
 * @property {string} optionLabel optionLabel
 * @property {string} optionValue optionValue
 * @property {string} optionType optionType
 * @property {string} buttonStyle buttonStyle
 */
type RadioboxProps = InputProps & {
	options?: object[];
	optionDisabled?: string;
	optionLabel?: string;
	optionValue?: string;
	optionType?: 'default' | 'button';
	buttonStyle?: 'outline' | 'solid';
};

/**
 * <Date> Props 타입 정의
 * @property {boolean} allowClear allowClear
 * @property {string} format format
 * @property {string} picker picker
 * @property {any} placement placement
 * @property {boolean} showTime showTime
 * @property {boolean} showNow showNow
 * @property {any} disabledTime disabledTime
 * @property {any} disabledDate disabledDate
 */
type DateProps = InputProps & {
	allowClear?: boolean;
	format?: string;
	picker?: 'date' | 'year' | 'quarter' | 'month' | 'week' | 'time';
	placement?: any;
	showTime?: boolean;
	showNow?: boolean;
	disabledTime?: any;
	disabledDate?: any;
	onCalendarChange?: any;
	onOpenChange?: any;
	changeOnBlur?: any;
	label?: string;
};

/**
 * <DateRange> Props 타입 정의
 * @property {boolean} allowClear allowClear
 * @property {string} direction direction
 * @property {string} format format
 * @property {string} fromName fromName
 * @property {string} toName toName
 * @property {any} fromDisabledDate fromDisabledDate
 * @property {any} toDisabledDate toDisabledDate
 */
type DateRangeProps = InputProps & {
	allowClear?: boolean;
	direction?: 'horizontal' | 'vertical';
	format?: string;
	fromName?: string;
	toName?: string;
	fromDisabledDate?: any;
	toDisabledDate?: any;
	inputReadOnly?: boolean;
	open?: boolean;
	picker?: any;
	label?: string;
	required?: boolean;
};

/**
 * SearchFormProps
 * @property {any} data data
 * @property {any} setData setData
 * @property {any} children children
 */
interface SearchFormProps {
	data: any;
	setData: any;
	children?: any;
}

/**
 * <SelectRange> Props 타입 정의
 * @property {string} mode mode
 * @property {object[]} options options
 * @property {string} optionLabel optionLabel
 * @property {string} optionValue optionValue
 * @property {boolean} showSearch showSearch
 * @property {object} fieldNames fieldNames
 * @property {any} defaultValue defaultValue
 * @property {any} notFoundContent notFoundContent
 * @property {boolean} allowClear allowClear
 * @property {any} filterOption filterOption
 * @property {any} onChange onChange
 * @property {any} onSelect onSelect
 * @property {any} onSearch onSearch
 * @property {any} onBlur onBlur
 */
interface SelectRangeProps extends InputProps {
	mode?: 'multiple' | 'tags';
	options?: object[];
	optionLabel?: string;
	optionValue?: string;
	showSearch?: boolean;
	fieldNames?: object;
	defaultValue?: any;
	notFoundContent?: any;
	allowClear?: boolean;
	filterOption?: any;
	onChange?: any;
	onSelect?: any;
	onSearch?: any;
	onBlur?: any;
}

export type {
	CheckboxGrpProps,
	CheckboxProps,
	DateProps,
	DateRangeProps,
	FormProps,
	inputNumberProps,
	InputPasswordProps,
	InputProps,
	InputRangeProps,
	InputSearchProps,
	InputTextProps,
	MultiInputTextProps,
	RadioboxProps,
	SearchFormProps,
	SelectboxProps,
	SelectRangeProps,
};
