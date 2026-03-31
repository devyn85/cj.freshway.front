/*
 ############################################################################
 # FiledataField	: DataRange.tsx
 # Description		: Date Picker + Date Picker Component
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Types
import { DateRangeProps } from '@/types/input';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadProps } from 'antd';
// Libs
import { Col, Form, message, Upload } from 'antd';

interface Props extends DateRangeProps {
	fromRefs?: any;
	toRefs?: any;
	disabledFields?: any;
	onChange?: any;
	[key: string]: any;
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const props: UploadProps = {
	action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
	onChange({ file, fileList }) {
		if (file.status !== 'uploading') {
		}
	},
	defaultFileList: [
		{
			uid: '1',
			name: 'xxx.png',
			status: 'uploading',
			url: 'http://www.baidu.com/xxx.png',
			percent: 33,
		},
		{
			uid: '2',
			name: 'yyy.png',
			status: 'done',
			url: 'http://www.baidu.com/yyy.png',
		},
		{
			uid: '3',
			name: 'zzz.png',
			status: 'error',
			response: 'Server Error 500', // custom error message to show
			url: 'http://www.baidu.com/zzz.png',
		},
	],
};

const getBase64 = (img: FileType, callback: (url: string) => void) => {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result as string));
	reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		message.error('You can only upload JPG/PNG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error('Image must smaller than 2MB!');
	}
	return isJpgOrPng && isLt2M;
};
const FileUpload = (props: Props) => {
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

	const formProps = {
		label: props.label,
		name: props.name,
		required: props.required ? true : false,
		rules: props.required ? [{ required: true }] : null,
	};

	const [loading, setLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState<string>();

	const handleChange: UploadProps['onChange'] = info => {
		if (info.file.status === 'uploading') {
			setLoading(true);
			return;
		}
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			getBase64(info.file.originFileObj as FileType, url => {
				setLoading(false);
				setImageUrl(url);
			});
		}
	};

	const uploadButton = (
		<button style={{ border: 0, background: 'none' }} type="button">
			{loading ? <LoadingOutlined /> : <PlusOutlined />}
			{/*<div style={{ marginTop: 8 }}>Upload</div>*/}
		</button>
	);

	return (
		<>
			<Col span={span}>
				<Form.Item {...formProps}>
					<div>
						<Upload
							{...props}
							name="avatar"
							listType="text"
							className="avatar-uploader"
							showUploadList={true}
							action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
							// beforeUpload={beforeUpload}
							// onChange={handleChange}
						>
							{imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
						</Upload>
						{/*<div className="text-gray-300 ant-upload-info">
							권장이미지 크기 526 x 176 픽셀 <br />
							제한 이미지 용량 3MB(png, jpg, jpeg)
						</div>*/}
					</div>
				</Form.Item>
				{/*<div className="ant-form-item">
					<div className="ant-row ant-form-item-row">
						<div className="ant-col ant-form-item-label">
							<label className="ant-form-item-required" title="코너명">{label}</label>
						</div>
						<div className="ant-col ant-form-item-control">
							<div className="flex-just-start">
								<Upload
									{...props}
									name="avatar"
									listType="picture-card"
									className="avatar-uploader"
									showUploadList={false}
									action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
									// beforeUpload={beforeUpload}
									// onChange={handleChange}

								>
									{imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}

								</Upload>
								<div className='sp-ml-2  text-gray-300'>
								권장이미지 크기 526 x 176 픽셀 <br/>
								제한 이미지 용량	3MB(png, jpg, jpeg)
								</div>
							</div>

						</div>
					</div>
				</div>*/}
			</Col>
		</>
	);
};

export default FileUpload;
