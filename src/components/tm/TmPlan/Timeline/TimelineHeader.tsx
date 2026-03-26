import { Typography } from 'antd';

interface TimelineHeaderProps {
	timeUnit: 60 | 30 | 10;
	pxPerMinute: number;
}

const TimelineHeader = ({ timeUnit, pxPerMinute }: TimelineHeaderProps) => {
	return (
		<div
			style={{
				display: 'flex',
				borderBottom: '1px solid #d9d9d9',
				backgroundColor: '#fafafa',
				height: '40px',
			}}
		>
			<div
				style={{
					width: '300px',
					padding: '8px',
					fontWeight: 600,
					position: 'sticky',
					left: 0,
					zIndex: 1,
					backgroundColor: '#fafafa',
					borderRight: '1px solid #d9d9d9',
				}}
			>
				차량 요약 정보
			</div>
			<div style={{ flex: 1, position: 'relative' }}>
				{Array.from({ length: 24 * (60 / timeUnit) }, (_, idx) => idx).map(idx => {
					const hour = Math.floor((idx * timeUnit) / 60);
					const minute = (idx * timeUnit) % 60;
					const hourLabel = `${String(hour).padStart(2, '0')}:00`;
					return (
						<div
							key={`${hour}-${minute}`}
							style={{
								position: 'absolute',
								left: `${(hour * 60 + minute) * pxPerMinute}px`,
								width: `${timeUnit * pxPerMinute}px`,
								height: '100%',
								borderLeft: '1px solid #e8e8e8',
								textAlign: 'center',
								paddingTop: '8px',
							}}
						>
							{minute === 0 && <Typography.Text type="secondary">{hourLabel}</Typography.Text>}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default TimelineHeader;
