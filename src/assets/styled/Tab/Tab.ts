import styled from 'styled-components';

const Tab = styled.div`
	position: relative;
	display: flex;
	height: 28px;
	/* margin: 30px 0 0 40px; */
	/* width: calc(100% - 40px); */
	width: 100%;
	border-bottom: 1px #dbdbdb solid;

	/* &:after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1px;
		background-color: #e6e6e6;
		z-index: -1;
	} */

	[data-rbd-droppable-id] {
		position: relative;
		left: 32px;
		width: calc(100% - 170px);
		overflow: auto;
		overflow-y: hidden;
		overflow-x: auto;
		&::-webkit-scrollbar {
			display: none;
		}
		[data-rbd-draggable-id='HOME'] {
			display: flex;
			background-color: transparent;
			border-color: transparent;
			a {
				width: 32px;
				height: 28px;
				display: flex;
				background-color: #fff !important;
				border-right: 1px #dbdbdb solid;
				padding: 0 !important;
				justify-content: center;
				align-items: center;
				svg {
					width: 16px;
					height: 16px;
				}
			}
		}
		.tab_home {
			position: fixed !important;
			left: 0;
			top: 56px;
			width: 32px;
			border-bottom: 1px solid #dbdbdb !important;
		}
		[data-rbd-draggable-context-id] {
			position: relative;
			height: 28px;
			line-height: 28px;
			background-color: #fff !important;

			a {
				cursor: pointer;
				position: relative;
				margin: 0;
				display: flex;
				align-items: center;
				padding: 0 0 0 8px;
				height: 28px;
				font-size: 12px;
				letter-spacing: -0.5px;
				color: #666;
				text-decoration: none;
				/* border: solid 1px #d6d6d6; */
				border-bottom: 0;
				white-space: nowrap;
				border-right: 1px #dbdbdb solid;
				background-color: #f2f2f2;

				.ant-btn {
					border: 0;
					position: relative;
					border-radius: 0;
					.ico-svg {
						width: 12px;
						height: 12px;
					}
					&.ant-btn-default {
						background-color: transparent;
					}
					&:hover {
						background-color: transparent !important;
					}
				}

				&.on {
					background-color: #fff;
					font-weight: 500;
					color: #333;
					a {
						position: relative;
					}
				}
			}

			> div {
				/* display: flex; */
				position: absolute;
				bottom: -2px;
				margin: 0;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: clip;
				left: 0;
				> div {
					&:last-child {
						a {
							border-right: 1px solid #d6d6d6;
						}
					}
				}
			}
		}
	}

	.tab-icon-wrap {
		border-left: 1px #dbdbdb solid;
		background: #fff;
		& {
			position: absolute;
			top: 0;
			right: 0;
			display: flex;
			z-index: 1;

			.ant-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 32px;
				height: 27px;
				border: none;
				border-right: 1px solid #dbdbdb;
				background: #fff;
				/* background-color: #f2f2f2; */
				border-bottom-color: #e6e6e6;
				border-radius: 0;
				min-width: 32px;
			}
		}
	}
`;

export default Tab;
