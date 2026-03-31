import styled from 'styled-components';

export const ResizableContainer = styled.div`
	width: calc(100% + 24px);
	padding: 0;
	margin: -12px;
	position: relative;
`;

export const ResizeHandle = styled.div`
	position: absolute;
	bottom: -10;
	left: 0;
	width: 100%;
	height: 13px;
	cursor: row-resize;
	z-index: 3;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const HandleBar = styled.div`
	width: 60px;
	height: 4px;
	background-color: #d9d9d9;
	border-radius: 2px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;
