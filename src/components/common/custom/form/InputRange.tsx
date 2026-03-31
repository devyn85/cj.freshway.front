/*
 ############################################################################
 # FiledataField	: InputRange.tsx
 # Description		: Custom InputRange 
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Types
import { InputRangeProps } from '@/types/input';

// Libs
import { Col, Form, Input, Space } from 'antd';

const InputRange = (props: InputRangeProps) => {
	const {
		refs,
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
		readOnly,
		fromName,
		toName,
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

	const onPasteDigitsOnly = (e: React.ClipboardEvent<HTMLInputElement>, name: string) => {
		e.preventDefault();
		const digits = e.clipboardData.getData('text').replace(/\D/g, '');
		if (!digits) return;
	};

	const formItemProps = { label: props.label, required, colon: false as const, style: { marginBottom: 0 } };

	return (
		<Col span={props.span}>
			<Form.Item {...formItemProps}>
				<Space align="center" size={8} style={{ display: 'flex' }}>
					<Form.Item name={fromName} noStyle>
						<Input
							{...props}
							id={fromName}
							ref={refs}
							disabled={disabled}
							maxLength={maxLength}
							placeholder={placeholder}
							showCount={showCount}
							size={size}
							value={value}
							onChange={onChange}
							onPressEnter={onPressEnter}
							required={required}
							allowClear={allowClear}
							readOnly={readOnly}
						/>
					</Form.Item>
					<span className="sep" style={{ flex: '0 0 auto' }}>
						~
					</span>
					<Form.Item name={toName} noStyle>
						<Input
							{...props}
							id={toName}
							ref={refs}
							disabled={disabled}
							maxLength={maxLength}
							placeholder={placeholder}
							showCount={showCount}
							size={size}
							value={value}
							onChange={onChange}
							onPressEnter={onPressEnter}
							required={required}
							allowClear={allowClear}
							readOnly={readOnly}
						/>
					</Form.Item>
				</Space>
			</Form.Item>
		</Col>
	);
};

export default InputRange;
