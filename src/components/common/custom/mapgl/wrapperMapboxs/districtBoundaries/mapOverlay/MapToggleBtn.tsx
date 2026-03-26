import React from 'react';
import styled from 'styled-components';

export interface IMapToggleBtn {
	isOn: boolean;
	onToggle: () => void;
	label?: string;
	width?: string;
	marginTop?: string;
}

const MapToggleBtn: React.FC<{ addToggleButtonObjectList: IMapToggleBtn[] }> = ({ addToggleButtonObjectList }) => {
	return (
		<ToggleContainer>
			{addToggleButtonObjectList.map((item, index) => (
				<ToggleBox
					key={item.label}
					onClick={item.onToggle}
					$width={item.width}
					$marginTop={item.marginTop}
					$index={index}
				>
					<ToggleLabel>
						<h3>{item.label}</h3>
					</ToggleLabel>
					<ToggleSwitch $isOn={item.isOn}>
						<ToggleCircle $isOn={item.isOn} />
					</ToggleSwitch>
				</ToggleBox>
			))}
		</ToggleContainer>
	);
};

export default MapToggleBtn;

const ToggleContainer = styled.div`
	display: flex;
	gap: 10px;
	position: absolute;
	top: 10px;
	right: 10px;
`;

// Styled Components
const ToggleBox = styled.div<{ $width?: string; $marginTop?: string; $index?: number }>`
	display: flex;
	align-items: center;
	gap: 4px;
	background: white;
	border-radius: 20px;
	padding: 6px 10px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
	font-size: 14px;
	cursor: pointer;
	user-select: none;
	transition: box-shadow 0.2s ease;
	margin-top: ${({ $marginTop }) => $marginTop || '0'};

	&:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}
`;

const ToggleLabel = styled.span`
	width: auto;
	min-width: fit-content;
	white-space: nowrap;
	display: flex;
	align-items: center;

	h3 {
		margin: 0; /* h3의 기본 margin 제거 */
		color: #333;
		font-weight: 500;
		font-size: 14px; /* 폰트 사이즈 추가 */
	}
`;

const ToggleSwitch = styled.div<{ $isOn: boolean }>`
	width: 36px;
	height: 20px;
	background: ${({ $isOn }) => ($isOn ? '#4cafef' : '#ccc')};
	border-radius: 20px;
	position: relative;
	transition: background 0.3s ease;
`;

const ToggleCircle = styled.div<{ $isOn: boolean }>`
	width: 16px;
	height: 16px;
	background: white;
	border-radius: 50%;
	position: absolute;
	top: 2px;
	left: 2px;
	transform: ${({ $isOn }) => ($isOn ? 'translateX(16px)' : 'translateX(0)')};
	transition: transform 0.3s ease;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;
