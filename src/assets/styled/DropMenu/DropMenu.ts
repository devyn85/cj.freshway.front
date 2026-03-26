import styled from 'styled-components';

const DropMenu = styled.div`
	width: 100%;
	background-color: #fff;
	background-color: #fff;
	position: relative;
	z-index: 9999;
	&:has(.reverse) {
		nav {
			background-color: #6a67ff;
		}
		.header-inner {
			a {
				color: #fff;
				opacity: 0.4;
				&:hover,
				&.active {
					opacity: 1;
					color: #fff;
				}
			}
		}
		.header-right {
			> div {
				.ant-form-item {
					margin: 0;
				}

				p {
					color: #fff;
				}
			}
			.ant-select {
				width: 180px;
				.ant-select-selector {
					background-color: #5e5af5;
					border-color: #5e5af5;
					color: #fff;
					.ant-select-selection-placeholder {
						color: #fff;
						opacity: 0.4;
					}
				}
				&.ant-select-focused {
					.ant-select-selector {
						border-color: #5e5af5;
						box-shadow: none;
						.ant-select-selection-placeholder {
							color: #fff;
						}
					}
					.ant-select-arrow {
						svg {
							fill: #fff;
						}
					}
				}
			}
		}
	}
	// 상단메뉴
	nav {
		width: 100%;
		height: 65px;
		display: flex;
		align-items: center;

		position: relative;
		background-color: #fff;
		border-bottom: 1px solid #d8d8d8;

		padding: 0 20px;

		// 대분류
		.header-inner {
			width: calc(100% - 510px);
			display: flex;
			overflow-x: hidden;
			height: 31px;
			a {
				min-width: 120px;
				text-align: center;
				position: relative;
				margin: 0 20px;

				text-decoration: none;
				font-family: Pretendard;
				font-size: 18px;
				font-weight: 500;

				letter-spacing: -0.2px;
				color: #1a1a1a;
				line-height: 31px;
				&:hover,
				&.active {
					color: #6965ff;
					text-decoration: underline;
					text-underline-offset: 6px;
					text-decoration-thickness: 3px;
					font-weight: bold;
				}
			}
		}
		.header-right {
			margin-left: auto;
			display: flex;
			align-items: center;
			gap: 20px;
			> div {
				position: relative;
				> p {
					color: #1a1a1a;
					font-size: 14px;
					font-weight: bold;
					cursor: pointer;
					margin: 0;
					padding: 0;
				}
				.ant-btn {
					svg + span {
						margin-left: 5px;
					}
					span {
						line-height: 20px;
						vertical-align: top;
					}
				}
				// 사용자 정보
				.header-user {
					background-color: #f7f7f7;
					padding: 20px;
					position: absolute;
					top: 30px;
					right: 0;
					z-index: 3;
					border-radius: 3px;
					display: grid;
					margin: 0;
					row-gap: 8px;
					box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12),
						0 9px 28px 8px rgba(0, 0, 0, 0.05);
					.ant-btn {
						align-items: center;
						display: flex;
						&:hover {
							svg {
								path,
								rect {
									fill: #605cff;
								}
							}
						}
					}
				}
				.ant-select-arrow {
					.anticon-down {
						display: none;
					}
				}
			}
		}
	}

	// 드롭다운
	.dropdown {
		width: 100%;
		display: flex;
		flex-flow: wrap;
		flex-grow: 1;

		padding: 32px 50px;

		background-color: #fff;
		box-shadow: 0px 50px 50px 0 rgba(0, 0, 0, 0.15);

		position: absolute;
		z-index: 2;

		a,
		h2 {
			display: block;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		// 중분류
		.middle-item {
			width: 220px;
			margin: 0;
			h2 {
				font-size: 16px;
				margin: 0 0 16px 0;
			}
			li {
				> a {
					font-size: 15px;
					color: #808080;
					margin: 0 0 16px 0;
					&:hover {
						color: #6965ff;
						text-decoration: underline;
						text-underline-offset: 3px;
						text-decoration-thickness: 1px;
					}
				}
				// 소분류 - dropdown
				> div:has(.sub-item) {
					a {
						font-size: 15px;
						color: #808080;
						margin: 0 0 16px 0;
						&:hover {
							color: #6965ff;
							text-decoration: underline;
							text-underline-offset: 3px;
							text-decoration-thickness: 1px;
						}
					}
					.sub-item {
						li {
							padding-left: 10px;
							display: flex;
							&:before {
								content: '·';
								margin-right: 5px;
							}
						}
						a {
							display: block;
							font-size: 14px;
							&:hover {
								color: #6965ff;
							}
						}
					}
				}
			}
		}
	}
`;

export default DropMenu;
