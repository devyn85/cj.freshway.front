import styled from 'styled-components';

const ButtonWrap = styled.div`
	margin: 16px 0 0 0;
	display: flex;
	align-items: center;
	gap: 4px;

	&[data-props='single'] {
		justify-content: center;
	}
	&[data-props='message'] {
		justify-content: space-between;
	}
	&[data-props='end'] {
		justify-content: end;
	}
	&[data-props='calendar-btn'] {
		margin-bottom: 0;
		.ant-btn {
			&.ant-btn-icon-only {
				min-width: unset;
				width: 32px;
				height: 32px;
				display: flex;
				justify-content: center;
				align-items: center;
				& + .ant-btn {
					height: 32px;
				}
			}
		}
	}
	&[data-props='right'] {
		justify-content: end;
	}

	& > div {
		display: flex;
		gap: 4px;
	}

	.ant-btn {
		font-size: 12px;
	}
`;

export default ButtonWrap;
