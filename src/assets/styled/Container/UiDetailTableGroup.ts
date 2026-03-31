import styled from 'styled-components';

const UiDetailTableGroup = styled.table`
	width: 100%;
	border-top: 1px #333 solid;
	margin-bottom: 20px;

	tr {
		border-bottom: 1px #dbdbdb solid;
		th {
			background-color: #f7f7f7;
			text-align: left;
			padding-left: 8px;
			vertical-align: middle;
			text-align: center;

			label {
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 12px;
				min-height: 40px;
				&[data-required] {
					&::after {
						content: '*';
						color: #ef151e;
						font-weight: 500;
					}
				}
			}
		}

		td {
			font-size: 12px;
			padding: 4px 8px;
			min-height: 41px;
			vertical-align: middle;
			.ant-form-item {
				margin-bottom: 0;
			}
		}
	}
`;

export default UiDetailTableGroup;
