import styled from 'styled-components';

const UiFilterGroup = styled.ul`
	border: 1px #dbdbdb solid;
	border-right: none;
	border-bottom: none;
	position: relative;
	background-color: #fff;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	overflow: hidden;
	transition: max-height 0.3s ease;
	&.hide {
		max-height: calc((33px * 3) + 1px); /* li 줄당 33px × 3줄 */
		overflow: hidden;
	}
	/* &.show {
		position: absolute;
		width: 100%;
		z-index: 98;
	} */
	&.grid-column-1 {
		grid-template-columns: 1fr;
	}
	&.grid-column-2 {
		grid-template-columns: 1fr 1fr;
	}
	&.grid-column-3 {
		grid-template-columns: 1fr 1fr 1fr;
	}
	&.grid-column-4 {
		grid-template-columns: 1fr 1fr 1fr 1fr;
	}
	&::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		height: 100%;
		border-left: 1px #dbdbdb solid;
		z-index: 99;
	}
	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		border-top: 1px #dbdbdb solid;
	}
	li {
		position: relative;
		margin-top: -1px;
		margin-left: -1px;
		border: 1px #dbdbdb solid;
		.ant-row.ant-form-item-row {
			display: flex;
			align-items: center;
			flex-flow: inherit;
			/* min-height: 32px; */
			.ant-form-item-label {
				color: #333;
				background-color: #f2f2f2;
				border-right: 1px #dbdbdb solid;
				min-width: 130px;
				max-width: 130px;
				word-break: break-all;
				min-height: 24px;
				display: flex;
				align-items: center;
				padding-left: 8px;
				&[data-required] {
					&::after {
						content: '*';
						color: #ef151e;
						font-weight: 500;
					}
				}
			}
			.ant-form-item-control {
				width: 100%;
				height: 100%;
				padding: 2px 8px;
				background-color: #fff;
				display: flex;
				align-items: flex-start;
				justify-content: flex-start;
				gap: 5px;
				font-size: 12px;
				.ant-form-item-control-input {
					width: 100%;
				}
				.ant-form-item {
					margin-bottom: 0;
					flex: 1;
					.ant-picker {
						width: 100%;
					}
				}
			}
		}
		& > span {
			display: flex;
			align-items: center;
			flex-flow: inherit;
			background-color: #fff;
			padding-right: 4px;
			height: 100%;
			.ant-col.ant-col-24 {
				flex: none;
				max-width: auto;
			}
			& > .ant-col:first-of-type {
				.ant-col.ant-form-item-control {
					width: auto;
				}
			}
		}
	}
	.ant-input {
		line-height: 1.2;
		/* height: 24px !important; */
		.ant-input-affix-wrapper {
			height: 24px;
			padding: 0 !important;
		}
	}
	.ant-form-item-control-input {
		min-height: 28px !important;
		// height: 24px; // height를 주석처리하여, 자식요소의 height를 적용하도록 함
	}
	.ant-select-single {
		height: 26px;
	}
	.ant-select-in-form-item {
		width: 100% !important;
	}
`;

export default UiFilterGroup;
