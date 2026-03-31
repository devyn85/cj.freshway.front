import { WeatherInfoItem } from '@/types/tm/locationMonitor';
import { useMemo } from 'react';
import styled from 'styled-components';

interface WeatherTimeSelectorProps {
	weatherList: WeatherInfoItem[]; // API에서 받은 시간순 정렬된 날씨 목록
	hasWeatherData: boolean;
	selectedIndex: number;
	onIndexChange: (index: number) => void;
}

// 시간대 라벨 매핑
const TIMEZONE_LABELS: { [key: string]: string } = {
	'06': '0시 ~ 6시',
	'12': '6시 ~ 12시',
	'18': '12시 ~ 18시',
	'24': '18시 ~ 24시',
};

// 날짜 라벨 생성 (YYYYMMDD -> YYYY-MM-DD)
const getDateLabel = (fcstDate: string): string => {
	const year = fcstDate.slice(0, 4);
	const month = fcstDate.slice(4, 6);
	const day = fcstDate.slice(6, 8);
	return `${year}-${month}-${day}`;
};

// 현재 시간 기준으로 기본 인덱스 찾기
export const getDefaultWeatherIndex = (weatherList: WeatherInfoItem[]): number => {
	if (!weatherList || weatherList.length === 0) return 0;

	const now = new Date();
	const todayStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(
		2,
		'0',
	)}`;
	const currentHour = now.getHours();

	// 현재 시간에 해당하는 timezone
	let currentTimezone: string;
	if (currentHour >= 0 && currentHour < 6) currentTimezone = '06';
	else if (currentHour >= 6 && currentHour < 12) currentTimezone = '12';
	else if (currentHour >= 12 && currentHour < 18) currentTimezone = '18';
	else currentTimezone = '24';

	// 현재 날짜 + 현재 시간대와 일치하는 항목 찾기
	const exactIndex = weatherList.findIndex(w => w.fcstDate === todayStr && w.timezone === currentTimezone);
	if (exactIndex >= 0) return exactIndex;

	// 없으면 첫 번째 항목
	return 0;
};

export const WeatherTimeSelector = ({
	weatherList,
	hasWeatherData,
	selectedIndex,
	onIndexChange,
}: WeatherTimeSelectorProps) => {
	const currentWeather = weatherList[selectedIndex];

	const displayLabel = useMemo(() => {
		if (!currentWeather) return '날씨 정보 없음';
		const dateLabel = getDateLabel(currentWeather.fcstDate);
		const timeLabel = TIMEZONE_LABELS[currentWeather.timezone] || currentWeather.timezone;
		return `${dateLabel} (${timeLabel})`;
	}, [currentWeather]);

	const canGoPrev = selectedIndex > 0;
	const canGoNext = selectedIndex < weatherList.length - 1;

	const handlePrev = () => {
		if (canGoPrev) {
			onIndexChange(selectedIndex - 1);
		}
	};

	const handleNext = () => {
		if (canGoNext) {
			onIndexChange(selectedIndex + 1);
		}
	};

	return (
		<Container>
			{hasWeatherData ? (
				<>
					<ArrowButton onClick={handlePrev} disabled={!canGoPrev}>
						◀
					</ArrowButton>
					<TextArea>{displayLabel}</TextArea>
					<ArrowButton onClick={handleNext} disabled={!canGoNext}>
						▶
					</ArrowButton>
				</>
			) : (
				<TextArea>기상 데이터 없음</TextArea>
			)}
		</Container>
	);
};

const Container = styled.div`
	position: absolute;
	top: 50px;
	right: 10px;
	z-index: 10;
	display: flex;
	align-items: center;
	gap: 8px;
	background-color: #ffffff;
	padding: 8px 12px;
	border-radius: 6px;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
	user-select: none;
`;

const TextArea = styled.span`
	font-size: 14px;
	font-weight: 500;
	color: #333;
	white-space: nowrap;
	min-width: 175px;
	text-align: center;
`;

const ArrowButton = styled.button<{ disabled: boolean }>`
	background: none;
	border: none;
	cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
	color: ${({ disabled }) => (disabled ? '#ccc' : '#333')};
	font-size: 14px;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover:not(:disabled) {
		color: #0066cc;
	}
`;
