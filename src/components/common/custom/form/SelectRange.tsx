/*
 ############################################################################
 # FiledataField	: SelectRange.tsx
 # Description		: Custom SelectRange 
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

import { SelectRangeProps } from '@/types/input';
import { Col, Form, Row, Select } from 'antd';

interface Props extends SelectRangeProps {
	fieldNames?: { label: string; value: string };
}

const SelectRange = (props: Props) => {
	const {
		refs,
		fromName,
		toName,
		span,
		label,
		required,
		options,
		placeholder,
		fieldNames,
		showSearch,
		defaultValue,
		disabled,
		mode,
		notFoundContent,
		allowClear,
		filterOption,
		onSelect,
		onChange,
		onSearch,
		onBlur,
		rules,
	} = props;


	return (
		<Col span={span}>
			<Row className="flex-align-just">
				<Col span={12}>
					<Form.Item name={fromName}>
						<Select
							{...props}
							ref={refs}
							placeholder={placeholder}
							fieldNames={fieldNames}
							options={options}
							showSearch={showSearch}
							defaultValue={defaultValue}
							disabled={disabled}
							mode={mode}
							notFoundContent={notFoundContent}
							allowClear={allowClear}
							onSelect={onSelect}
							onChange={onChange}
							onSearch={onSearch}
							onBlur={onBlur}
						/>
					</Form.Item>
				</Col>
				<span>~</span>
				<Col span={12}>
					<Form.Item name={toName}>
						<Select
							{...props}
							ref={refs}
							placeholder={placeholder}
							fieldNames={fieldNames}
							options={options}
							showSearch={showSearch}
							defaultValue={defaultValue}
							disabled={disabled}
							mode={mode}
							notFoundContent={notFoundContent}
							allowClear={allowClear}
							onSelect={onSelect}
							onChange={onChange}
							onSearch={onSearch}
							onBlur={onBlur}
						/>
					</Form.Item>
				</Col>
			</Row>
		</Col >
	);
};

export default SelectRange;
