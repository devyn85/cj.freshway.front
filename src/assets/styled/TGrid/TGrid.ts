import styled from 'styled-components';

const TGrid = styled('div')`
	& {
		margin-bottom: 20px;
		&:last-child {
			margin-bottom: 0;
		}
		.flex-wrap {
			display: flex;
			> div:first-child {
				width: ${(props: any) =>
					(props['data-props'] === 'file-upload' && 'calc(100% - 392px)') || 'calc(100% - 392px)'};
				margin-right: 20px;
				.tui-grid-body-area {
					height: 343px !important;
				}
			}
		}
		> div {
			&:nth-child(1) {
				display: flex;
				align-items: flex-end;
				justify-content: space-between;
				margin-bottom: 10px;
				h3 {
					font-size: 14px;
					height: 28px;
					line-height: 38px;
					font-weight: bold;
					margin: 0;
				}
				> div {
					&:last-child {
						display: flex;
					}
				}
				span {
					margin: 0 6px;
				}
				.ant-btn {
					font-size: 12px;
					height: 28px;
					margin-right: 6px;
					display: inline-flex;
					align-items: center;
					padding: 4px 10px;
					&:last-child {
						margin-right: 0;
					}
					svg {
						fill: #1a1a1a;
						margin-right: 4px;
					}
					&:hover {
						svg {
							fill: #605cff;
						}
					}
				}
				> .grid-flex-wrap {
					display: flex;
					align-items: center;
					height: 28px;
					span {
						white-space: nowrap;
						font-size: 12px;
					}
					.ant-input {
						font-size: 12px;
						height: 28px;
						line-height: 28px;
					}
					.ant-btn:last-child {
						margin-left: 6px;
					}
				}
			}
			&:nth-child(2) {
				& {
					.tui-grid-body-area {
						height: 300px;
					}
				}
				&[data-props='row-single'] {
					.tui-grid-body-area {
						height: calc(100vh - 408px);
					}
				}
				&[data-props='tab-row-single'] {
					height: calc(100vh - 471px);
					margin-bottom: 0;
					.tui-grid-body-area {
						height: calc(100vh - 471px);
						margin-bottom: 0;
					}
				}
			}
		}
		.preview {
			width: 372px;
			height: 376px;
			border: 1px solid #c4c4c4;
			display: flex;
			justify-content: center;
			align-items: center;
			span {
			}
			img {
				width: 100%;
				height: 100%;
				object-fit: fill;
			}
		}
	}
`;

export default TGrid;
