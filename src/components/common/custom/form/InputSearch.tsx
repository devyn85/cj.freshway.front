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
import * as React from 'react';

// Types
import { FormProps, InputSearchProps } from '@/types/input';

const InputSearch = (props: InputSearchProps) => {
	const {
		refs,
		required = false,
		disabled,
		showCount = false,
		size = 'middle',
		label,
		name,
		rules,
		span,
		spanSearch = 24 - (props.span ?? 12),
		allowClear = true,
		form = props.form,
	} = props;

	const formProps: FormProps = {
		label: label,
		name: name,
		required: required,
		rules: rules,
		colon: props.colon ?? true,
	};

	/**
	 * clearIcon 클릭 시 onSearch 동작을 방지하는 핸들러
	 * @param value
	 * @param event
	 * @param {any} info
	 * @param {any} info.source
	 */
	const handleSearch = (
		value: string,
		event?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>,
		info?: { source?: 'clear' | 'input' },
	) => {
		if (info?.source === 'clear') {
			if (props.form && props.code) {
				form.setFieldsValue({ [props.code]: '' });
			}
			return;
		}

		// 원래 onSearch 함수가 있으면 호출
		if (props.onSearch) {
			props.onSearch(value, event, info);
		}
	};

	return (
		<>
			<Col span={span}>
				<Form.Item {...formProps}>
					<Input.Search
						{...props}
						ref={refs}
						id={props.id}
						title={props.title}
						disabled={disabled}
						enterButton={props.enterButton}
						maxLength={props.maxLength}
						placeholder={props.placeholder}
						showCount={showCount}
						size={size}
						value={props.value}
						onChange={props.onChange}
						onSearch={handleSearch}
						required={required}
						allowClear={allowClear}
					/>
				</Form.Item>
			</Col>
			{props.code && (
				<div className="hidden">
					<Col offset={1} span={spanSearch - 1}>
						<Form.Item required={props.required ? true : false} name={props.code} hidden={props.hidden}>
							<Input disabled />
						</Form.Item>
					</Col>
				</div>
			)}
		</>
	);
};

export default InputSearch;
