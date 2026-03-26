import styled from 'styled-components';

const Container = styled.div`
	padding: 0 40px 0 20px;
	margin: 0 0 14px 20px;
	height: calc(100vh - 220px);
	overflow-y: auto;
	overflow-x: hidden;
	&::-webkit-scrollbar {
		width: 6px;
		margin-right: 4px;
	}
	&::-webkit-scrollbar-thumb {
		height: 17%;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 10px;
	}
	&::-webkit-scrollbar-track {
		background-color: rgba(0, 0, 0, 0.05);
	}
`;

export default Container;
