import styled from 'styled-components';

type AGridProps = {
	dataProps?: string;
	pullheight?: boolean;
};

const AGrid = styled.div.attrs<AGridProps>(props => ({
	className: `agrid ${props.className || ''}`,
}))<AGridProps>`
	& {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
		gap: 6px;
		height: 100%;
		margin-bottom: 12px;
		&:last-of-type {
			margin-bottom: 0;
		}
		&.h-auto {
			height: auto !important;
		}
		&.h50 {
			height: 50%;
		}
		&.h90 {
			height: 90%;
		}
		&.h100 {
			height: 100%;
		}
		.clear {
			gap: 0px;
			margin-bottom: 0;
		}
		.bg-red {
			.aui-grid-drop-list-content {
				color: #ef151e;
			}
		}
		.bg-blue {
			.aui-grid-drop-list-content {
				color: #006ecd;
			}
		}
		.bg-green {
			.aui-grid-drop-list-content {
				color: #22ac38;
			}
		}
		& + & {
			margin-bottom: 12px;
			&:last-of-type {
				margin-bottom: 0;
			}
		}
		& > div {
			/* flex: 1; */
		}
		& > div:last-child {
			margin-bottom: 0px;
			gap: 0;
		}
		.title-area {
			display: flex;
			align-items: center !important;
			justify-content: space-between;
			//margin-bottom: 8px !important;
			height: 26px !important;
			flex: none;
			.title {
				display: flex;
				align-items: center;
				h3 {
					flex: none;
					font-size: 16px;
					margin-right: 8px;
					display: flex;
					align-items: center;
					line-height: 24px;
				}
				em {
					font-style: normal;
					font-weight: 400;
					font-size: 12px;
					color: #666;
					margin-left: 4px;
					display: flex;
					align-items: center;
					&::before {
						content: '';
						display: inline-block;
						height: 15px;
						border-left: 1px #c9c9c9 solid;
						margin-right: 8px;
					}
				}
				em.dot {
					display: flex;
					align-items: center;
					&::before {
						content: ' ';
						display: inline-block;
						width: 4px;
						height: 4px;
						border-radius: 50%;
						background-color: #e6e6e6;
						margin-right: 4px;
					}
				}
				span.msg {
					margin-left: 10px;
					font-size: 12px;
					letter-spacing: -1px;
					font-weight: 400;
					font-family: initial;
					color: #ef151e;
				}
			}
			& > div {
				&:last-child {
					display: flex;
				}
			}
			.aui-grid-drop-list-content,
			.aui-grid-drop-list-wrapper {
				margin: 0;
			}
			.ant-btn {
				min-width: 24px;
				height: 24px;
				&:last-child {
					margin-right: 0;
				}
				svg {
					fill: #333;
					font-size: 12px;
				}
				.ico-svg {
					width: 16px;
					height: 16px;
				}
				&:hover {
					svg {
						fill: #605cff;
					}
				}
				&.full-area {
					padding: 0;
				}
			}
			& + .aui-grid-wrap {
				//margin-bottom: 12px;
				&:last-of-type {
					margin-bottom: 0;
				}
				/* &.row-single {
					height: calc(100vh - 419px);
					border: 1px solid green;
				}
				&.row-pull {
					height: calc(100vh - 272px);
					border: 1px solid pink;
				}
				// 기본값 또는 다른 케이스
				&:not(.row-single):not(.row-pull) {
					height: 226px;
				} */
			}
			& > .grid-flex-wrap {
				display: flex;
				align-items: center;
				justify-content: end;
				gap: 4px;
				flex: 1;
				&:has(.gap8) {
					.ant-form {
						gap: 8px;
					}
				}
				.ant-form {
					.ant-col {
						flex: auto;
					}
				}
				.ant-form-inline {
					.ant-form-item {
						margin-inline-end: 0 !important;
					}
				}
				span {
					white-space: nowrap;
					font-size: 12px;
				}
				.ant-input {
					padding-right: 5px;
					padding-left: 5px;
					font-size: 12px;
					//height: 28px;
					//line-height: 28px;
				}
				.ant-select-single:not(.ant-select-customize-input) {
					padding-right: 5px;
					padding-left: 5px;
					.ant-select-selector {
						min-height: 26px;
					}
				}
				.msg {
					margin-right: auto;
					color: red;
				}
				.label-text {
					border-right: 1px solid #d3d3d3;
					margin-right: 10px !important;
					.ant-form-item {
						padding-left: 10px;
					}
				}
			}
		}
		.aui-grid-wrap {
			flex: 1;
			// margin-bottom: 30px;
			&:last-of-type {
				//	border: 1px solid #000;
				margin-bottom: 0;
			}
			&.row-single {
				// height: calc(100vh - 419px);
				border: 1px solid green;
			}
			&.row-pull {
				//height: calc(100vh - 272px);
				border: 1px solid pink;
			}
			// 기본값 또는 다른 케이스
			&:not(.row-single):not(.row-pull) {
				//height: 226px;
			}
		}
		> .ant-row {
			flex: 1;
			gap: 0;
			margin-bottom: 0;
			&:last-child {
				margin-bottom: 0;
			}
		}
		.flex-wrap {
			display: flex;
			> div:first-child {
				width: ${(props: any) => (props.dataProps === 'file-upload' && 'calc(100% - 352px)') || 'calc(100% - 352px)'};
				/* margin-right: 22px; */
			}
			.aui-grid {
				/* height: 373px !important; */
			}
		}
		.preview {
			min-width: 372px;
			width: 100%;
			min-height: 300px;
			height: 100%;
			border: 1px solid #c4c4c4;
			display: flex;
			justify-content: center;
			align-items: center;
			&.full {
				height: calc(100vh - 160px);
				img {
					max-height: unset;
				}
			}
			img {
				width: 100%;
				height: 100%;
				max-height: 300px;
				object-fit: contain;
			}
		}
	}
	@media (max-width: 1600px) {
		.grid-flex-wrap {
			zoom: 0.9;
		}
		.ant-btn-sm {
			padding: 0px 4px;
		}
	}
	@media (max-width: 1400px) {
		.grid-flex-wrap {
			zoom: 0.8;
		}
	}
`;

export default AGrid;
