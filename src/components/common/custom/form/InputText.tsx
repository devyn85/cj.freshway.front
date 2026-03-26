/*
 ############################################################################
 # FiledataField	: InputText.tsx
 # Description		: Custom InputText 
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Libs
import { Col, Form, Input } from 'antd';

// Types
import { useInput } from '@/hooks/cm/useInput';
import { FormProps, InputTextProps } from '@/types/input';

const InputText = (props: InputTextProps) => {
	const {
		refs,
		span = 24,
		label,
		name,
		required = false,
		maxLength,
		disabled = false,
		showCount = false,
		size = 'middle',
		placeholder,
		value,
		onChange,
		onPressEnter,
		allowClear = true,
		rules,
		readOnly,
		hidden,
	} = props;

	const formProps: FormProps = {
		label: label,
		span: span,
		name: name,
		required: required,
		rules: rules,
		colon: props.colon ?? true,
		hidden: hidden,
	};

	const { handleInputPressEnter } = useInput();

	return (
		<Col span={span}>
			<Form.Item {...formProps}>
				<Input
					{...props}
					ref={refs}
					// disabled={disabled}
					maxLength={maxLength}
					placeholder={placeholder}
					showCount={showCount}
					size={size}
					value={value}
					onChange={onChange}
					onPressEnter={onPressEnter || handleInputPressEnter}
					required={required}
					allowClear={allowClear}
					readOnly={readOnly}
					hidden={hidden}
				/>
				{/* {props.children} */}
			</Form.Item>
		</Col>
	);
};

export default InputText;
