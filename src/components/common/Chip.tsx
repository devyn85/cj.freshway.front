import React, { CSSProperties, ReactNode } from 'react';

export type ChipProps = {
	label: string;
	variant?: 'filled' | 'outlined';
	onClick?: () => void;
	onDelete?: () => void;
	deleteIcon?: ReactNode;
	size?: 'small' | 'medium' | 'large';
	icon?: ReactNode;
	textColor?: string;
	bgColor?: string;
	className?: string;
	style?: CSSProperties;
};

const sizeMap = {
	small: {
		height: 24,
		fontSize: 12,
		padding: '0 8px',
		iconSize: 14,
	},
	medium: {
		height: 32,
		fontSize: 14,
		padding: '0 12px',
		iconSize: 18,
	},
	large: {
		height: 40,
		fontSize: 16,
		padding: '0 16px',
		iconSize: 20,
	},
};

const Chip: React.FC<ChipProps> = ({
	label,
	variant = 'filled',
	onClick,
	onDelete,
	deleteIcon,
	size = 'medium',
	icon,
	textColor,
	bgColor,
	className,
	style,
}) => {
	const sizeStyle = sizeMap[size];

	const baseStyle: CSSProperties = {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 6,
		height: sizeStyle.height,
		fontSize: sizeStyle.fontSize,
		padding: sizeStyle.padding,
		borderRadius: 999,
		cursor: onClick ? 'pointer' : 'default',
		userSelect: 'none',
		transition: 'all 0.2s ease',
		backgroundColor: variant === 'filled' ? bgColor ?? '#e0e0e0' : 'transparent',
		color: textColor ?? '#333',
		border: variant === 'outlined' ? `1px solid ${bgColor ?? '#bdbdbd'}` : 'none',
	};

	const iconStyle: CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		fontSize: sizeStyle.iconSize,
	};

	const deleteStyle: CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
	};

	return (
		<div className={className} style={{ ...baseStyle, ...style }} onClick={onClick}>
			{icon && <span style={iconStyle}>{icon}</span>}

			<span>{label}</span>

			{onDelete && (
				<span
					style={deleteStyle}
					onClick={e => {
						e.stopPropagation();
						onDelete();
					}}
				>
					{deleteIcon ?? '✕'}
				</span>
			)}
		</div>
	);
};

export default Chip;
