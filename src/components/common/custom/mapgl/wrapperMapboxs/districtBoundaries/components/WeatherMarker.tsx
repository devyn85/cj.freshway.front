import { WeatherInfoItem } from '@/types/tm/locationMonitor';
import { useMemo } from 'react';
import styled from 'styled-components';

const WEATHER_FORECAST_API_URL = 'https://www.weather.go.kr/w/forecast/overall/short-term.do';

const openWeatherForecast = (hash: string) => window.open(`${WEATHER_FORECAST_API_URL}${hash}`, '_blank');

/**
 * 단기예보 dong 해시 경로 생성
 * @param {string} dongCode 행정동코드
 * @param {string | number} lat 위도 (latS100 또는 latitude)
 * @param {string | number} lon 경도 (lonS100 또는 longitude)
 * @returns {string} #dong/{행정동코드}/{lat}/{lon}/
 */
const buildWeatherDongHash = (dongCode: string, lat: string | number, lon: string | number) =>
	`#dong/${dongCode}/${lat}/${lon}/`;

// 날씨 아이콘 경로 (public 폴더 기준)
const WEATHER_ICONS = {
	sunny: '/img/icon/sunny.svg',
	cloud: '/img/icon/cloud.svg',
	rain: '/img/icon/rain.svg',
	snow: '/img/icon/snow.svg',
} as const;

interface WeatherMarkerProps {
	weather: WeatherInfoItem;
}

type WeatherIconType = keyof typeof WEATHER_ICONS;

/**
 * 날씨 아이콘 및 강수량/적설량 정보를 반환
 *
 * 정책:
 * - PTY(강수형태) 우선 적용
 * - PTY=0이면 SKY(하늘상태) 값 기준 (맑음/구름많음/흐림)
 * - PTY≠0이면 PTY 값 기준 (비/눈)
 * - 강수형태(PTY) 비(1), 소나기(4) → 강수량(PCP) mm
 * - 강수형태(PTY) 비/눈(2), 눈(3) → 적설량(SNO) cm
 * - 강수형태(PTY) 없음(0) → "-"
 * @param {WeatherInfoItem} weatherData - 날씨 정보 객체
 * @returns {{ iconType: WeatherIconType, amountText: string, unit: string }} 아이콘 타입, 강수량/적설량 텍스트, 단위
 */
const getWeatherDisplayInfo = (weatherData: WeatherInfoItem) => {
	const { pty, sky, pcp, sno } = weatherData;

	let iconType: WeatherIconType = 'sunny';
	let amountText = '-';

	if (pty === '0') {
		// 강수형태가 없는 경우 - SKY(하늘상태) 기준
		switch (sky) {
			case '3': // 구름많음
			case '4': // 흐림
				iconType = 'cloud';
				break;
			default:
				break;
		}
	} else {
		// 강수형태가 있는 경우
		switch (pty) {
			case '1': // 비
			case '4': // 소나기
				iconType = 'rain';
				if (pcp !== '강수없음') {
					amountText = pcp;
				}
				break;
			case '2': // 비/눈
			case '3': // 눈
				iconType = 'snow';
				if (sno !== '적설없음') {
					amountText = sno;
				}
				break;
			default:
				break;
		}
	}

	return { iconType, amountText };
};

// 아이콘 타입에 따른 이미지 경로 반환
const getIconSrc = (iconType: WeatherIconType): string => {
	return WEATHER_ICONS[iconType] || WEATHER_ICONS.sunny;
};

export const WeatherMarker = ({ weather }: WeatherMarkerProps) => {
	const { iconType, amountText } = useMemo(() => getWeatherDisplayInfo(weather), [weather]);

	const handleOpenWeather = () => {
		const hash = buildWeatherDongHash(weather.hjdongCd, weather.latS100, weather.lonS100);
		openWeatherForecast(hash);
	};

	return (
		<WeatherMarkerContainer onDoubleClick={handleOpenWeather}>
			<IconWrapper>
				<WeatherIcon src={getIconSrc(iconType)} alt={iconType} />
			</IconWrapper>
			<AmountInfo>{amountText}</AmountInfo>
		</WeatherMarkerContainer>
	);
};

const WeatherMarkerContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 4px 6px;
	background-color: #ffffff;
	border-radius: 4px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
`;

const IconWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const WeatherIcon = styled.img`
	width: 32px;
	height: 32px;
`;

const AmountInfo = styled.div`
	font-size: 10px;
	color: #666;
	margin-top: 2px;
`;
