/*
 ############################################################################
 # FiledataField	: CheckBox.tsx
 # Description		: Custom Checkbox
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Types
import { CheckboxProps } from '@/types/input';

// Utils
import commUtil from '@/util/commUtil';

// Libs
import { Checkbox, Col, Form, Input } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

const CheckBox = (props: CheckboxProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const form = Form.useFormInstance();

	const formProps = {
		label: props.label,
		name: props.name,
		required: props.required ? true : false,
		rules: props.required ? [{ required: true }] : null,
		colon: props.colon ?? true,
	};

	// true-false 값 대치
	const chkValue = {
		trueValue: props.trueValue ?? true,
		falseValue: props.falseValue ?? false,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * Checkbox 값 변경 시 원천 데이터 필드에 true/false의 value 값을 매핑하여 넣어준다.
	 * @param {object} e 변경 이벤트
	 */
	const onChangeCheckBox = (e: CheckboxChangeEvent) => {
		form.setFieldValue(
			e.target.id.replace('_checkbox', ''),
			e.target.checked ? e.target.value?.trueValue : e.target.value?.falseValue,
		);
		if (props.onChange) {
			props.onChange(e);
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// Component Mounted
	useEffect(() => {
		// mount 시 원천 데이터의 default 값을 checkbox와 연동한다.
		if (commUtil.isNotEmpty(props.trueValue) && commUtil.isNotEmpty(formProps.name)) {
			form.setFieldValue(formProps.name + '_checkbox', form.getFieldValue(props.name) === chkValue.trueValue);
		}
	}, []);

	return (
		<Col span={props.span ?? 24}>
			{/*Checkbox area */}
			{typeof props.trueValue === 'boolean' || typeof props.trueValue === 'undefined' ? (
				<Form.Item label={formProps.label} name={formProps.name} valuePropName="checked">
					<Checkbox
						{...props}
						ref={props.refs}
						onChange={props.onChange}
						disabled={props.disabled}
						indeterminate={props.indeterminate} // 중간 상태 표시 여부
						checked={props.checked}
					>
						{props.children}
					</Checkbox>
				</Form.Item>
			) : (
				<>
					<Form.Item label={formProps.label} name={formProps.name + '_checkbox'} valuePropName="checked">
						<Checkbox
							{...props}
							ref={props.refs}
							onChange={onChangeCheckBox}
							disabled={props.disabled}
							indeterminate={props.indeterminate} // 중간 상태 표시 여부
							checked={props.checked}
							defaultChecked={form.getFieldValue(formProps.name + '_checkbox') === chkValue.trueValue}
							value={chkValue}
						>
							{props.children}
						</Checkbox>
					</Form.Item>
					{/*Input area */}
					<Form.Item {...formProps} hidden>
						<Input></Input>
					</Form.Item>
				</>
			)}
		</Col>
	);
};

export default CheckBox;
