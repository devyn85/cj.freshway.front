/*
 ############################################################################
 # FiledataField	: InputNumber.tsx
 # Description		: Custom InputNumber
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Types
import { useInput } from '@/hooks/cm/useInput';
import { inputNumberProps } from '@/types/input';

// Libs
import { Col, Form, InputNumber as Number } from 'antd';

const InputNumber = (props: inputNumberProps) => {
	const formProps = {
		label: props.label,
		name: props.name,
		required: props.required ? true : false,
		rules: props.required ? [{ required: true }] : null,
		colon: props.colon ?? true,
		help: props.help ?? false,
		validateStatus: props.validateStatus ?? '',
	};

	const { handleInputPressEnter } = useInput();

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (props.onBlur) {
			props.onBlur(e);
		}
	};

	return (
		<Col span={props.span}>
			<Form.Item {...formProps}>
				<Number
					{...props}
					// type="number"
					ref={props.refs}
					placeholder={props.placeholder ?? ''}
					onPressEnter={handleInputPressEnter}
					onChange={props.onChange}
					onBlur={handleBlur}
					min={props.min}
					max={props.max}
					step={props.step}
					disabled={props.disabled}
					style={{ width: props.width ?? '100%' }}
					formatter={props.formatter} // number format
					parser={props.parser} // value parsing ex) parser={(value: string) => value?.replace('%', '')}
					required={props.required}
				/>
			</Form.Item>
		</Col>
	);
};

export default InputNumber;
