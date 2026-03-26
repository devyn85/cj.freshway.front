/*
 ############################################################################
 # FiledataField	: InputText.tsx
 # Description		: Custom InputText 
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Libs
import { Col, Form } from 'antd';

// Types
import QuillEditor from '@/components/common/custom/QuillEditor';
import { FormProps } from '@/types/input';

const InputQuillEditor = (props: any) => {
	const { label, span, required = false, name, height = '270px', theme = 'snow' } = props;

	const formProps: FormProps = {
		label: label,
		span: span,
		name: name,
		required: required,
	};

	return (
		<Col span={span}>
			<Form.Item {...formProps}>
				<QuillEditor {...props} height={height} theme={theme} />
			</Form.Item>
		</Col>
	);
};

export default InputQuillEditor;
