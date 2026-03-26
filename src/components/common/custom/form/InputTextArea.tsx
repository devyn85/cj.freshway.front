/*
 ############################################################################
 # FiledataField	: InputTextArea.tsx
 # Description		: Custom Textarea 
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Types
import { FormProps, InputTextProps } from '@/types/input';

// Libs
import { useFormConfig } from '@/hooks/cm/useFormConfig';
import { Col, Form, Input } from 'antd';

const InputTextArea = (props: InputTextProps) => {
	const {
		refs,
		required = false,
		disabled,
		showCount = false,
		size = 'middle',
		label,
		name,
		rules,
		rows,
		allowClear = true,
	} = props;

	const { formDisabled } = useFormConfig();

	const formProps: FormProps = {
		label: label,
		name: name,
		required: required,
		rules: rules,
		colon: props.colon ?? true,
	};
	return (
		<Col span={props.span}>
			<Form.Item {...formProps}>
				<Input.TextArea
					{...props}
					ref={refs}
					id={props.id}
					name={props.name}
					title={props.title}
					disabled={disabled ?? formDisabled}
					autoSize={props.autoSize}
					maxLength={props.maxLength}
					placeholder={props.placeholder}
					showCount={showCount}
					size={size}
					value={props.value}
					onChange={props.onChange}
					allowClear={allowClear}
					required={required}
					rows={rows}
				/>
			</Form.Item>
		</Col>
	);
};

export default InputTextArea;
