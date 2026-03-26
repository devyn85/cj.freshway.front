/*
 ############################################################################
 # FiledataField	: CheckboxGrouop.tsx
 # Description		: custom checkbox  
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// types
import { CheckboxGrpProps } from '@/types/input';

// Utils
import dataTransform from '@/util/dataTransform';

// Libs
import { Checkbox, Col, Form, Row } from 'antd';

const CheckboxGroup = (props: CheckboxGrpProps) => {
	const {
		span = 24,
		label,
		required,
		format,
		fromName,
		toName,
		disabled = false,
		placeholder,
		onChange,
		allowClear,
		fromDisabledDate,
		toDisabledDate,
		inputReadOnly,
		open,
		picker,
	} = props;
	// Form Item Props
	const formProps = {
		label: props.label,
		name: props.name,
		required: props.required ? true : false,
		rules: props.required
			? [{ required: true, type: 'array' as const, validateTrigger: 'none' }, ...(props.rules || [])]
			: props.rules,
		colon: props.colon ?? true,
	};

	// optionKey → label, optionValue → value로 변환
	const checkList = dataTransform.convert2Antd(
		props.options,
		props.optionLabel ?? 'label',
		props.optionValue ?? 'value',
	);

	return (
		<>
			{/*<Col span={props.span ?? 12}>
			<Form.Item {...formProps}>

				<Checkbox.Group ref={props.refs} onChange={props.onChange} disabled={props.disabled} value={props.value}>
					<Row>
						{checkList.map(checkbox => {
							return (
								<Col span={props.optionSpan} key={checkbox.value}>
									<Checkbox {...props} value={checkbox.value}>
										{checkbox.label}
									</Checkbox>
								</Col>
							);
						})}
					</Row>
				</Checkbox.Group>
			</Form.Item>
		</Col>*/}

			<Col span={props.span ?? 24}>
				<Form.Item {...formProps}>
					<Checkbox.Group ref={props.refs} onChange={props.onChange} disabled={props.disabled} value={props.value}>
						<Row>
							{checkList.map(checkbox => {
								return (
									<Col span={props.optionSpan} key={checkbox.value}>
										<Checkbox {...props} value={checkbox.value}>
											{checkbox.label}
										</Checkbox>
									</Col>
								);
							})}
						</Row>
					</Checkbox.Group>
				</Form.Item>
			</Col>
		</>
	);
};

export default CheckboxGroup;
