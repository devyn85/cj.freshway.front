import styled from 'styled-components';

const UiDetailViewArea = styled.div`
	margin-bottom: 20px;
	h4 {
		display: flex;
		align-items: center;
		margin-bottom: 12px;
		> span {
			font-size: 16px;
			margin-right: auto;
		}
	}
	&:last-child {
		margin-bottom: 0;
	}
`;

export default UiDetailViewArea;
