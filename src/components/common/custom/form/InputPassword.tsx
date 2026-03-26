/*
 ############################################################################
 # FiledataField	: InputSearch.tsx
 # Description		: Custom InputSearch
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Libs
import { Col, Form, Input } from 'antd';

// Types
import { InputPasswordProps } from '@/types/input';

const InputPassword = (props: InputPasswordProps) => {
	const {
		refs,
		required = false,
		disabled = false,
		showCount = false,
		width = 'auto',
		size = 'middle',
		allowClear = true,
	} = props;
	const formProps = {
		label: props.label,
		name: props.name,
		required: required ? true : false,
		rules: props.rules,
		colon: props.colon ?? true,
	};
	return (
		<Col span={props.span ?? 24}>
			<Form.Item {...formProps}>
				<Input.Password
					{...props}
					ref={refs}
					id={props.id}
					title={props.title}
					disabled={disabled}
					maxLength={props.maxLength}
					placeholder={props.placeholder}
					showCount={showCount}
					size={size}
					visibilityToggle={props.visibilityToggle} // 비밀번호 보이기 여부
					value={props.value}
					onChange={props.onChange}
					style={{ width: width }}
					allowClear={allowClear}
					required={required}
				/>
			</Form.Item>
		</Col>
	);
};

export default InputPassword;
