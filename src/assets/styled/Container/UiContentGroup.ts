import styled from 'styled-components';

const UiContentGroup = styled.div`
	padding: 20px 32px;
	/* width: calc(100% - 220px); */
	height: calc(100% - 114px);

	display: flex;
	flex-direction: column;

	> .ant-tabs.ant-tabs-top {
		height: 100%;

		.ant-tabs-content {
			height: 100%;
			overflow-y: hidden;

			.ant-tabs-tabpane {
				height: 100%;

				display: flex;
				flex-direction: column;

				&.ant-tabs-tabpane-hidden {
					display: none !important;
				}

				> .rows-bottom-area {
					background-color: #83ada5;
				}
			}
		}
	}

	.ant-input-search {
		.ant-input-search-button {
			//height: 30px;
		}
	}

	.ant-form-item {
		margin-bottom: 0;
		.ant-form-item-control-input {
			min-height: 26px;
			.ant-input {
				padding: 3px 8px;
			}
		}
	}

	.ant-select-single {
		height: 30px;
	}
`;

export default UiContentGroup;
