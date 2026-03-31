import styled from 'styled-components';

const UiFilterGroup = styled.div`
	position: relative;
	/* padding-right: 27px; */
	margin-bottom: 20px;

	.btn-group {
		text-align: center;
		position: absolute;
		width: 100%;
		.ant-btn {
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			min-width: 24px;
			height: 16px;
			.ico-svg {
				color: #fff;
				width: 16px;
				height: 16px;
			}
		}
	}
`;

export default UiFilterGroup;
