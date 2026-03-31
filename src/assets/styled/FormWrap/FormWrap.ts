import { Form } from 'antd';
import styled from 'styled-components';

const FormWrap = styled(Form)`
	& {
		padding: 16px;
		margin-bottom: 38px;
		&[data-props='page'] {
			padding: 0;
			margin-bottom: 0;
			.ant-form-item {
				.ant-form-item-label {
					label {
						min-width: 180px;
						width: 100px;
					}
				}
				.ant-btn {
					& + .ant-btn {
						margin-left: 6px;
					}
				}
			}
		}
		> .ant-row {
			&:first-child {
				border-top: 1px solid #e6e6e6;
			}
		}
		.ant-form-item {
			margin-bottom: 0;
			border-bottom: 1px solid #e6e6e6;
			.ant-form-item-label {
				min-height: 48px;
				max-height: 100%;
				background-color: #f5f5f7;
				display: flex;
				align-items: center;
				label {
					padding: 0 10px;
					display: block;
					width: 100px;
					line-height: 28px;
					///font-size: var(--fp-font-xxsmall);
					font-weight: 500;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					text-align: left;
					&::after {
						content: '';
					}
				}
				/* > label.ant-form-item-required:not(.ant-form-item-required-mark-optional) {
					&::before {
						display: none;
					}
					&::after {
						content: '⦁';
						color: #f72626;
						top: -4px;
						font-size: 14px;
						font-weight: bold;
					}
				} */
			}
			.ant-form-item-control {
				padding: 8px;
				.ant-form-item-control-input {
					align-items: unset;
				}
				.ant-form-item-control-input-content {
					display: flex;
					padding-right: 10px;
					align-items: center;
					> .ant-input,
					.ant-select {
					}
					.ant-input-number {
						& + span {
							display: flex;
							align-items: center;
							padding: 0 5px;
						}
					}
					.ant-input-search {
						.ant-input-group {
							min-width: 270px;
						}
						& + .ant-input {
							margin-left: 8px;
						}
					}
					.ant-input {
						& + .ant-btn {
							margin-left: 8px;
							font-size: 12px;
							padding: 4px 8px;
						}
					}
					&:last-child {
						padding: 0;
					}
				}
				.ant-radio-group {
					.ant-radio-wrapper {
						font-size: 12px;
					}
				}
				.ant-input-group {
					& {
						max-width: 100%;
						.ant-select {
							width: 155px;
						}
					}
				}
				.ant-input {
					line-height: 22px;
					&:read-only {
						border: 0;
					}
					&:disabled {
						border: 1px solid #d9d9d9;
					}
				}
				.ant-select,
				.ant-input,
				.ant-picker-input > input {
					font-size: 12px;
				}
			}
			&.flex-wrap {
				.ant-form-item-control-input-content {
					display: block;
					> div {
						display: flex;
						input {
							flex: 1;
							width: calc(100% - 93px);
							& + .ant-btn {
								min-width: 85px;
							}
						}
					}
					.time {
						cursor: unset;
						font-size: 12px;
						margin-top: 4px;
					}
				}
			}
			& [data-props='time-select'] {
				.ant-select-selector {
					border-radius: 0;
				}
				.ant-select {
					width: 70px;
					& + span {
						margin: 0 6px;
					}
					& + .ant-select {
						margin-left: 6px;
					}
				}
			}
			.ant-input-number {
				.ant-input-number-handler-wrap {
					opacity: 1;
				}
			}
		}
	}
`;

export default FormWrap;
