import styled from 'styled-components';

const TableWrap = styled.div`
	& {
		.ant-table-wrapper {
			.ant-table-thead > tr > th,
			.ant-table-tbody > tr > td,
			.ant-table tfoot > tr > th,
			.ant-table tfoot > tr > td {
				padding: 0px 8px;
				font-size: 12px;
				height: 28px;
				line-height: 28px;
			}
			.ant-table-thead > tr > th {
				font-weight: 500;
				height: 32px;
				line-height: 32px;
				background-color: #f5f5f7;
			}
		}
		&[data-props='center'] {
			.ant-table-thead > tr > th,
			.ant-table-tbody > tr > td,
			.ant-table tfoot > tr > th,
			.ant-table tfoot > tr > td {
				text-align: center;
			}
		}
	}
`;

export default TableWrap;
