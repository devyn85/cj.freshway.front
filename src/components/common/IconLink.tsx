import Icon from '@/components/common/Icon';

interface IconLinkProps {
	icon: string;
	url?: string;
	text?: string;
	color?: string;
	onClick?: any; // 함수
	suffix?: boolean;
	data?: string;
}

const IconLink = ({ icon, url, text, color, onClick, suffix, data }: IconLinkProps) => {
	if (url) {
		// URL이 있는 경우
		return (
			<a
				href={url}
				style={{
					color: `${color}`,
				}}
				onClick={onClick ? () => onClick() : undefined}
			>
				<Icon icon={icon} />
				<span>{text}</span>
				{suffix ? (
					<>
						<div>{data}</div>
						<Icon icon="icon-mobile-14-px-delete" />
					</>
				) : null}
			</a>
		);
	} else {
		// URL이 없는 경우
		return (
			<div
				style={{
					color: `${color}`,
				}}
				onClick={onClick ? () => onClick() : undefined}
			>
				<Icon icon={icon} />
				<span>{text}</span>
			</div>
		);
	}
};

export default IconLink;
