import styled from 'styled-components';

interface SearchWrapProps {
	bgwhite?: boolean;
	edit?: boolean;
	fullWidth?: boolean;
	wide?: boolean;
}

const SearchWrap = styled.div<SearchWrapProps>`
	& {
		/* border-radius: 6px; */
		/* background-color: ${props => (props.bgwhite ? '#ffffff' : '#f5f5f7')}; */
		/* border: ${props => (props.bgwhite ? '1px solid rgb(214, 214, 214)' : '')}; */
		/* margin-top: 10px; */
		/* margin-bottom: 20px; */
		/* padding: ${props => (props.bgwhite ? '14px' : '')}; */

		.ant-form {
			/* padding: 16px; */
			.ant-row {
				flex-flow: nowrap;
				&:last-child {
					.ant-col {
						> .ant-form-item {
							margin-bottom: 0;
							& .ant-form-item {
								margin-bottom: 0;
							}
						}
					}
				}
				// react only start
				& {
					.ant-col:first-child {
						> .ant-form-item {
							.ant-form-item-label {
								label {
									padding-left: 0;
								}
							}
						}
					}
				}
				// react only end
				.ant-col {
					> .ant-form-item {
						//margin-bottom: 6px;
						.ant-form-item-label {
							//height: 32px;
							//line-height: 32px;
							label {
								text-align: left;
								display: inline-block;
								width: 120px;
								padding: 0 10px 0 10px;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
								//font-size: var(--fp-font-xxsmall);
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
							min-width: 170px;
							//padding-right: 20px;
							.ant-form-item-control-input {
								align-items: unset;
							}
							.ant-form-item-control-input-content {
								display: flex;
								align-items: center;
								> .ant-input,
								.ant-select {
									/* width: 260px; */
								}
								.ant-input-number {
									width: 80px;
									font-size: 12px !important;
									& + span {
										display: flex;
										align-items: center;
										padding: 0 5px;
									}
									& .ant-input-number-input {
										padding: 0 22px 0 4px;
									}
								}
								.ant-input-group-wrapper {
									width: 260px;
									.ant-input {
										width: 228px;
									}
									& + .ant-input {
										max-width: 260px;
										margin-left: 8px;
									}
								}
								.ant-input {
									& + .ant-btn {
										margin-left: 8px;
										font-size: 12px;
									}
								}
							}
							.ant-radio-group {
								.ant-radio-wrapper {
									font-size: 12px;
								}
							}
							.ant-input-group {
								& {
									/* max-width: 100%; */
									.ant-select {
										width: 128px;
										& + .ant-input {
											width: calc(100% - 133px);
											max-width: calc(100% - 133px);
										}
									}
									.ant-input {
										/* width: calc(100% - 266px) !important; */
										/* min-width: 270px; */
									}
								}
							}

							.ant-input {
								//height: 32px;
							}
							textarea.ant-input {
								height: auto;
								width: 260px;
							}
							.ant-select,
							.ant-input,
							.ant-picker-input > input {
								font-size: 12px;
								max-width: 260px;
							}
							.ant-picker {
								//width: 128px;
								///height: 32px;
							}
							// form item 안의 form item
							.ant-form-item {
								.ant-form-item-control {
									padding-right: 8px;
								}
								& + .ant-form-item {
									.ant-form-item-control {
										padding-right: 0;
										width: 270px;
									}
								}
							}
						}
					}
					& .ant-form-item {
						//margin-bottom: 6px;
					}
					&:first-child {
						.ant-row {
							&.ant-form-item {
								.ant-form-item-label {
									label {
										padding-left: 0;
									}
								}
							}
						}
					}
					&.ant-col-24 {
						.ant-form-item {
							.ant-form-item-label {
								label {
									width: 100%;
								}
							}
						}
					}
				}
			}
			.ant-btn {
				&.ant-btn-variant-outlined {
					height: 26px;
				}
			}
		}
	}
`;

export default SearchWrap;
