import styled from 'styled-components';

const Nav = styled('nav')`
	width: 100%;
	height: 56px;
	padding: 0 24px;
	display: flex;
	align-items: center;
	position: relative;
	background-color: #f2f2f2;
	border-bottom: 1px solid #c6c6c6;

	h1 {
		display: flex;
		align-items: center;
		height: 24px;
		font-weight: 700;
		font-family: 'CjOnlyOnetitleBold', sans-serif;
		letter-spacing: -2px;
		color: #007651;
		cursor: pointer;
		.part {
			padding-left: 6px;
			font-family: Pretendard;
			font-size: 20px;
			color: #ef151e;
		}
	}

	> .ant-btn {
		width: 24px;
		padding: 0;
		svg {
			margin: 0;
		}
	}

	> svg {
		margin-right: 10px;
		fill: #1a1a1a;
	}

	> div {
		position: relative;
		margin-right: 18px;

		ul {
			display: none;

			width: 240px;
			padding: 20px 0;
			border-radius: 4px;
			box-shadow: 0 0 50px 0 rgba(0, 0, 0, 0.15);
			background-color: #fff;
			position: absolute;
			z-index: -1;
			top: 40px;
			opacity: 0;
			visibility: hidden;
			overflow: visible;
			transition: all 0.1s ease;

			li {
				width: 100%;
				height: 46px;
				line-height: 46px;
				padding: 0 20px;
				position: relative;
				cursor: pointer;
				a {
					font-size: 14px;
					display: flex;
					align-items: center;
					svg {
						opacity: 0.4;
					}
				}
				&:hover {
					background-color: #f5f5f5;
					> a {
						color: #6965ff;
						font-weight: bold;
						svg {
							opacity: 1;
							fill: #6965ff;
						}
					}
				}

				&.sub {
					&:hover {
						> a {
							&::after {
								background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath stroke='%236965FF' stroke-linecap='round' stroke-linejoin='round' d='m6 3 4.993 5.003L6 13'/%3E%3Cpath d='M6.354 2.647a.5.5 0 0 0-.766.637l.058.07 4.641 4.648-4.64 4.645a.5.5 0 0 0-.058.637l.058.07a.5.5 0 0 0 .637.057l.07-.058 4.993-4.997a.5.5 0 0 0 .058-.637l-.058-.07-4.993-5.002z' fill='%236965FF' fill-rule='nonzero'/%3E%3C/g%3E%3C/svg%3E%0A");
							}
						}
					}
					> a {
						&::after {
							content: '';
							position: absolute;
							right: 15px;
							top: 15px;
							width: 16px;
							height: 16px;
							background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m6 3 4.993 5.003L6 13'/%3E%3Cpath d='M6.354 2.647a.5.5 0 0 0-.766.637l.058.07 4.641 4.648-4.64 4.645a.5.5 0 0 0-.058.637l.058.07a.5.5 0 0 0 .637.057l.07-.058 4.993-4.997a.5.5 0 0 0 .058-.637l-.058-.07-4.993-5.002z' fill='%231A1A1A' fill-rule='nonzero'/%3E%3C/g%3E%3C/svg%3E%0A");
						}
					}
					& {
						ul {
							position: absolute;
							left: 240px;
							top: 6px;
							li {
								background-color: #fff;
								height: 46px;
								line-height: 46px;
								&:hover {
									background-color: #f5f5f7;
									a {
										font-weight: bold;
									}
								}
								a {
									font-size: 13px;
									font-weight: normal;
								}
							}
						}
						&.on {
							ul {
								z-index: 9999;
								visibility: visible;
								transition: all 0.5s ease-in-out;
								opacity: 1;
								overflow: visible;
							}
						}
					}
				}
			}
		}

		a {
			font-weight: bold;
			color: #333333;
			height: 56px;
			font-size: 16px;
			white-space: nowrap;
			&.on {
				& + ul {
					z-index: 9999;
					visibility: visible;
					transition: all 0.5s ease-in-out;
					opacity: 1;
					overflow: visible;
				}
			}
			&.on {
				position: relative;
				color: #005b45;

				&::after {
					content: '';
					border-bottom: 2px solid #005b45;
					width: 100%;
					position: absolute;
					bottom: -16px;
					left: 0;
				}
			}
		}
	}

	#userMenu {
		position: absolute;
		right: 0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		color: #666;
		gap: 8px;

		> span {
			color: #666;
			font-weight: bold;
			cursor: pointer;
			padding-top: 2px;
		}

		> em {
			display: block;
			font-style: normal;
			color: #666;
			font-size: 14px;
			text-align: right;
		}

		button + em {
			color: #999;
			span {
				color: #666;
				font-weight: 500;
			}
		}

		.ant-form-item {
			margin-bottom: 0;

			.ant-select {
				height: 30px;

				.ant-select-selector {
					padding: 8px;
					border-radius: 0;
				}

				.ant-select-selection-item {
					color: #333;
					font-size: 14px;
				}

				.ant-select-arrow {
					.anticon {
						&::after {
							background-image: url('data:image/svg+xml,<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.99996 11.5C7.87329 11.5 7.74663 11.4533 7.64663 11.3533L2.97996 6.68663C2.78663 6.49329 2.78663 6.17329 2.97996 5.97996C3.17329 5.78663 3.49329 5.78663 3.68663 5.97996L7.99996 10.2933L12.3133 5.97996C12.5066 5.78663 12.8266 5.78663 13.02 5.97996C13.2133 6.17329 13.2133 6.49329 13.02 6.68663L8.35329 11.3533C8.25329 11.4533 8.12663 11.5 7.99996 11.5Z" fill="%23808080"/></svg>');
						}
					}
				}
			}
		}

		button {
			display: flex;
			align-items: center;
			svg {
				display: inline-flex;
			}

			&:hover {
				background-color: transparent !important;
			}
		}
	}

	.ant-select-single .ant-select-selector {
		background-color: #fff;
		border: none;
		color: #333;
		border: 1px solid #c6c6c6;
	}

	.ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):hover,
	.ant-btn-variant-dashed:not(:disabled):not(.ant-btn-disabled):hover {
		background-color: #4d4d4d;
	}

	.ant-btn {
		background: transparent;
		border: none;
		.ico-svg {
			width: 24px;
			height: 24px;
		}
	}

	.btn-alarm {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;

		em {
			position: absolute;
			left: 22px;
			top: 0;
			color: #fff;
			background-color: #ef151e;
			border-radius: 23px;
			padding: 1px 5px 2px;
			font-size: 10px;
			font-style: normal;
		}

		/* 흔들리는 애니메이션 */
		@keyframes shake {
			0% {
				transform: rotate(0deg);
			}
			20% {
				transform: rotate(-15deg);
			}
			40% {
				transform: rotate(10deg);
			}
			60% {
				transform: rotate(-10deg);
			}
			80% {
				transform: rotate(5deg);
			}
			100% {
				transform: rotate(0deg);
			}
		}

		&.shake {
			animation: shake 1s ease-in-out infinite;
			transform-origin: top center;
		}
	}

	.btn-my-setting {
	}

	.btn-logout {
	}
`;

export default Nav;
