import styled from 'styled-components';

const UiCeckboxGroup = styled.div`
	margin-top: -30px;
	padding-bottom: 30px;
	display: flex;
	align-items: center;

	.ant-checkbox-label {
		font-size: 12px;
	}
	.ant-checkbox + span {
		padding-inline-end: 0;
	}
	.ant-row {
		gap: 10px;
	}
`;

export default UiCeckboxGroup;
