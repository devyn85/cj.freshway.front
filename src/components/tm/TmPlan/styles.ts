import styled from 'styled-components';

export const MapContainer = styled.div<{ $isExpanded: boolean; $isMapExpanded?: boolean }>`
	flex: ${props => (props.$isMapExpanded ? '1 1 auto' : '1 1 auto')};
	display: ${props => (props.$isExpanded ? 'none' : 'inherit')};
	position: relative;
`;

export const ExpandableContainer = styled.div<{ $isExpanded: boolean; $isMapExpanded?: boolean }>`
	overflow-y: auto;
	flex: ${props => {
		if (props.$isMapExpanded) return '0 0 0px';
		if (props.$isExpanded) return '1 1 auto';
		return '1';
	}};
	display: ${props => (props.$isMapExpanded ? 'none' : 'block')};
	&::-webkit-scrollbar {
		display: none;
	}

	min-width: 530px;
`;

export const PanelContainer = styled.div`
	display: flex;
	gap: 16px;
	margin-top: 16px;
	height: calc(100vh - 225px);
`;

export const MapExpandButton = styled.button`
	position: absolute;
	top: 50%;
	left: -10px;
	transform: translateY(-50%);
	z-index: 1;
	width: 28px;
	height: 48px;
	border-radius: 4px;
	background: rgba(255, 255, 255);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: end;
	padding-right: 3px;
	font-size: 14px;
	color: #666;
	transition: all 0.2s;

	&:hover {
		background: #fff;
		border-color: #1890ff;
		color: #1890ff;
	}
`;
