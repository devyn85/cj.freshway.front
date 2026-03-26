import styled from 'styled-components';

type AGridProps = {
	dataProps?: string;
	pullheight?: boolean;
};

const AGridWrap = styled.div<AGridProps>`
	& {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
		& > .flexWrap {
			flex: 1;
		}
		& > .ant-row {
			flex: 1;
			height: 100%;
			& > .ant-col {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: stretch;
			}
		}
		.ant-tabs {
			//flex: 1;
			//display: flex;
			//flex-direction: column;
			//justify-content: flex-start;
			//align-items: stretch;
			/* height: 100%; */
			.ant-tabs-nav {
				height: 36px;
			}
			.ant-tabs-content-holder {
				flex: 1;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: stretch;
				.ant-tabs-content {
					margin-bottom: 0;
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					align-items: stretch;
					.ant-tabs-tabpane {
						display: flex;
						flex-direction: column;
						justify-content: flex-start;
						align-items: stretch;
						flex: 1;
						.flexWarp {
							flex: 1;
						}
					}
				}
			}
		}
	}
`;

export default AGridWrap;
