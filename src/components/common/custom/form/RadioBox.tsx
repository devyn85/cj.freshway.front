/*
 ############################################################################
 # FiledataField	: RadioBox.tsx
 # Description		: Custom Radiobox
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */
import { RadioboxProps } from '@/types/input';
import dataTransform from '@/util/dataTransform';
import { Col, Form, Radio } from 'antd';

const RadioBox = (props: RadioboxProps) => {
	// Form Item Props
	const formProps = {
		label: props.label,
		name: props.name,
		required: props.required ? true : false,
		rules: props.required ? [{ required: true }] : null,
		colon: props.colon ?? true,
	};

	// optionKey → label, optionValue → value로 변환
	const radioList = dataTransform.convert2Antd(
		props.options,
		props.optionLabel ?? 'label',
		props.optionValue ?? 'value',
	);
	return (
		<Col span={props.span ?? 24}>
			<Form.Item {...formProps}>
				<Radio.Group
					{...props}
					ref={props.refs}
					options={radioList}
					onChange={props.onChange}
					disabled={props.disabled}
					optionType={props.optionType} // 'default' | 'button'
					buttonStyle={props.buttonStyle ?? 'outline'} // 'outline' | 'solid'
				/>
			</Form.Item>
		</Col>
	);
};

export default RadioBox;
