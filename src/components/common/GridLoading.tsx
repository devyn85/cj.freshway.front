import { Spin } from 'antd';
import React from 'react';

interface GridLoadingProps {
	isLoading: boolean;
	message?: string;
	opacity?: number;
	delay?: number;
}

/**
 * 그리드 영역에 사용할 로딩 오버레이 컴포넌트
 * @param isLoading 로딩 상태
 * @param message 표시할 메시지 (선택사항)
 * @param opacity 배경 불투명도 (기본값: 0.5)
 * @param delay 로딩 표시 지연시간 (ms) (기본값: 3)
 */
const GridLoading: React.FC<GridLoadingProps> = ({ isLoading, message, opacity = 0.5, delay = 3 }) => {
	if (!isLoading) return null;

	return (
		<div
			className="loading-overlay"
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: `rgba(255,255,255,${opacity})`,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				zIndex: 1000,
			}}
		>
			<Spin size="large" delay={delay} />
			{message && (
				<div
					style={{
						marginTop: '102px', // 상단 여백 줄임 (Spin과 더 가깝게)
						color: '#333', // 더 진한 색상으로 변경 (#666 → #333)
						fontSize: '14px',
						fontWeight: 500, // 폰트 두께 추가
						textShadow: '0 0 1px rgba(0,0,0,0.05)', // 미세한 텍스트 그림자로 선명도 향상
					}}
				>
					{message}
				</div>
			)}
		</div>
	);
};

export default GridLoading;
