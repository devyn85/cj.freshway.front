// src/components/Button.tsx
import { Button as AntButton } from 'antd';
import classNames from 'classnames';

interface Props {
	size?: 'small' | 'large' | 'middle' | 'xlarge';
	className?: string;
	[key: string]: any; // 나머지 props (htmlType, type, disabled 등)
}

const Button = ({ size, className, ...props }: Props) => {
	// xlarge는 custom class로 처리, 나머지는 그대로 antd에 전달
	const isXlarge = size === 'xlarge';
	const restSize = isXlarge ? undefined : size;
	const customClass = isXlarge ? 'ant-btn-xl' : '';

	return (
		<AntButton
			{...props}
			size={restSize} // default, large, small 전달
			className={classNames(className, customClass)}
		/>
	);
};

export default Button;
