import styled from 'styled-components';

const UiListTitleGroup = styled.div`
	padding-bottom: 12px;
	display: flex;
	align-items: center;

	h3 {
		font-size: 16px;
		margin-right: 8px;
	}

	> em {
		font-size: 12px;
		font-style: normal;
		color: #666;
		margin-right: 12px;

		&::before {
			content: '';
			border-left: 1px #c9c9c9 solid;
			height: 16px;
			padding-left: 8px;
		}
	}

	> span.msg {
		font-size: 12px;
		color: #ef151e;
	}

	.flex-end {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 4px;
		> em {
			font-size: 12px;
			font-style: normal;
			color: #666;
			margin-right: 8px;
		}
	}
`;

export default UiListTitleGroup;
