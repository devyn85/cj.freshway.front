/*
 ############################################################################
 # FiledataField	: LabelText.tsx
 # Description		: Custom LabelText
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Libs
import { Col, Form } from 'antd';

const LabelText = (props: any) => {
	const { label, name, value, span } = props;

	return (
		<Col span={span} className="label-text">
			<Form.Item label={label} shouldUpdate>
				{({ getFieldValue }) => {
					return <span>{value || getFieldValue(name || '')}</span>;
				}}
			</Form.Item>
		</Col>
	);
};

export default LabelText;
