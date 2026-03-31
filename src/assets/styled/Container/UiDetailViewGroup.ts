import styled from 'styled-components';

const UiDetailViewGroup = styled.ul`
	border-top: 1px solid #333;
	border-right: none;
	border-bottom: none;
	position: relative;
	background-color: #fff;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	overflow: hidden;
	transition: max-height 0.3s ease;
	/* &.hide {
		max-height: calc(33px * 3 + 1);
		border: 2px solid red !important;
		overflow: hidden;
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
	&.grid-column-5 {
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
	}
	&::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		height: 100%;
		//border-left: 1px #dbdbdb solid;
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
		border-right: 1px solid transparent;
		border-bottom: 1px #dbdbdb solid;
		min-height: 26px;
		//min-height: 100%;
		//display: flex;
		//align-items: stretch;
		//flex-flow: inherit;
		&.col-1 {
			grid-column: auto / span 4;
		}
		&.col-2 {
			grid-column: auto / span 2;
		}
		& > .ant-col:first-of-type {
			padding-left: 0 !important;
			height: 100%;
			.ant-form-item {
				height: 100%;
			}
		}
		&.lab-txt {
			.label-text {
				width: auto !important;
				flex: none;
			}
		}
		.ant-row.ant-form-item-row {
			display: flex;
			align-items: center;
			flex-flow: inherit;
			min-height: 26px;
			align-items: stretch;
			height: 100%;
			.ant-form-item-label {
				color: #333;
				background-color: #f2f2f2;
				min-width: 130px;
				max-width: 130px;
				word-break: break-all;
				//min-height: 32px;
				padding-left: 8px;
				label {
					display: flex;
					align-items: center;
					height: 100% !important;
				}
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
				padding: 2px;
				background-color: #fff;
				display: flex;
				align-items: flex-start;
				justify-content: center;
				gap: 5px;
				font-size: 12px;
				border-right: none;
				.ant-form-item-control-input {
					width: 100%;
					min-height: auto;
					height: auto;
				}
				.ant-col {
					//width: 100%;
					//flex: 1px;
					padding: 0;
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
			///align-items: stretch;
			flex-flow: inherit;
			background-color: #fff;
			padding-right: 4px;
			height: 100%;
			min-height: 100%;
			//2단일때 첫번째
			& > .ant-col:first-of-type {
				height: 100%;
				padding-left: 0 !important;
				.ant-col.ant-form-item-control {
					height: auto;
				}
			}
			.ant-form-item {
				height: 100%;
			}
			//체크박스 그룹일때
			.ant-col.ant-col-24 {
				flex: none;
				max-width: auto;
				.ant-form-item {
					height: 100%;
				}
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
		min-height: 26px;
		height: 26px;
	}
	.ant-select-single {
		height: 26px;
	}
	.ant-select {
		&.ant-select-in-form-item {
			width: 100% !important;
		}
	}
`;

export default UiDetailViewGroup;
