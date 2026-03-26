import { IFeature } from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/types/feature';
import React from 'react';
import styled from 'styled-components';

interface MapToolTipProps {
	hoveredObject: IFeature;
	position: { x: number; y: number };
	currentLevel: 'sido' | 'sgg' | 'dem';
}

const MapToolTip: React.FC<MapToolTipProps> = ({ hoveredObject, position, currentLevel }) => {
	// 현재 줌 레벨에 따라 표시할 텍스트 결정
	const getDisplayText = () => {
		const props = hoveredObject.properties;

		if (currentLevel === 'dem') {
			// 행정동 레벨
			// eslint-disable-next-line react/prop-types
			return props.hjdongNm || props.ctpKorNm || '정보 없음';
		} else if (currentLevel === 'sgg') {
			// 시군구 레벨
			// eslint-disable-next-line react/prop-types
			return props.sigKorNm || props.ctpKorNm || '정보 없음';
		} else if (currentLevel === 'sido') {
			// 시도 레벨
			// eslint-disable-next-line react/prop-types
			return props.ctpKorNm || '정보 없음';
		}

		// eslint-disable-next-line react/prop-types
		return props.ctpKorNm || '정보 없음';
	};

	return (
		<OverlayToolTip style={{ transform: `translate(${position.x + 15}px, ${position.y - 6}px)` }}>
			<TooltipText>{getDisplayText()}</TooltipText>
		</OverlayToolTip>
	);
};

export default MapToolTip;

const OverlayToolTip = styled.div`
	position: relative;
	width: max-content;
	top: 0;
	left: 0;
	z-index: 4;
	padding: 6px 12px;
	background: white;
	border: 1px solid #ddd;
	border-radius: 12px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
`;

const TooltipText = styled.div`
	display: inline-block;
	font-size: 14px;
	color: #333;
	white-space: nowrap;
	font-weight: 500;
`;
