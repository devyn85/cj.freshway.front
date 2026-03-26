import { Tooltip } from 'antd';
import { forwardRef } from 'react';

const CustomTooltip = forwardRef((props: any) => {
	const [open, setOpen] = useState(false);

	return (
		<Tooltip
			{...props}
			title={
				props.title && (
					<div
						onMouseEnter={() => {
							if (props.onOpenChange) {
								props.onOpenChange(false);
							} else {
								setOpen(false);
							}
						}} // 툴팁 영역에 들어오면 닫기
					>
						{props.title}
					</div>
				)
			}
			open={props.open || open}
			onOpenChange={props.onOpenChange || setOpen}
		>
			{props.children}
		</Tooltip>
	);
});

export default CustomTooltip;
