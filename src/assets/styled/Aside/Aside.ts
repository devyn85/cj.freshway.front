import styled from 'styled-components';

const Aside = styled.aside`
	position: relative;
	flex: 0 0 auto;
	background-color: #fff;
	border-right: 1px #dbdbdb solid;
	/* padding: 16px 14px; */
	/* transition: all ease 0.3s; */
	// aside
	.logo-icon {
		margin-left: 10px;
		cursor: pointer;
	}

	//2023.08.08 content Size조정을 위해 임의 변경
	// height: calc(100vh - 32px);
	/* background-color: #605cff; */
	&::-webkit-scrollbar {
		width: 6px;
	}
	&::-webkit-scrollbar-thumb {
		height: 17%;
		background-color: #e6e6e6;
		border-radius: 10px;
	}
	&::-webkit-scrollbar-track {
		background-color: #f2f2f2;
	}
	menu {
		height: calc(100vh - 146px);
		overflow: hidden;
		overflow-y: auto;
		scroll-behavior: smooth;
		ul {
			margin-bottom: 6px;
			&:first-child {
				margin-top: 8px;
			}
		}
		li {
			position: relative;
			display: flex;
			align-items: center;
			color: #333;
			width: 100%;
			height: 24px;
			line-height: 40px;
			font-size: 14px;
			letter-spacing: -0.2px;
			font-weight: 700;
			padding-left: 26px;
			cursor: pointer;
			svg {
				display: inline-flex;
				align-items: center;
				/* margin-left: 6px; */
			}

			&.close,
			&.open {
				svg {
					position: absolute;
					left: 6px;
					transform: rotate(90deg);
					/* transition: all ease 0.3s; */
				}

				& + dl {
					transform: scaleY(1);
					dd {
						visibility: visible;
						/* transition: all 0.3s ease-in-out; */
					}
				}
			}

			&.close {
				svg {
					transform: rotate(180deg);
				}
				& + dl {
					transform: scaleY(0);
					transform-origin: top;
					/* transition: transform 0.3s ease; */
					dd {
						visibility: hidden;
						opacity: 0;
						/* transition: all 0.3s ease; */
						height: 0;
					}
				}
			}

			& + dl {
				dd {
					&.active {
						color: #007651;
						background-color: #f7f7f7;
						font-weight: 500;
					}
				}
			}
		}

		dl {
			margin: 0;
			ul {
				padding-left: 17px;
			}
			dd {
				position: relative;
				display: flex;
				align-items: center;
				color: #333;
				width: 100%;
				height: 24px;
				line-height: 38px;
				margin: 0;
				/* padding: 0 14px; */
				padding-left: 26px;
				font-size: 13px;
				letter-spacing: -0.2px;
				/* opacity: 0.6; */
				cursor: pointer;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
				svg {
					fill: #fff;
					display: inline-flex;
					align-items: center;
					overflow: visible;
					&:nth-child(2) {
						position: absolute;
						right: 8px;
					}
				}
				&.active {
					color: #007651;
					background-color: #f7f7f7;
					font-weight: 500;
				}
			}
		}
	}

	&.on {
		width: 220px;
	}

	&.off {
		width: 80px;
		ul {
			li {
				visibility: hidden;
				svg {
					display: none;
				}
			}
		}
		dl {
			dd {
				width: 44px;
				overflow: hidden;
				svg {
					&:nth-child(2) {
						display: none;
					}
				}
			}
		}
		.logo-icon {
			g {
				&:first-child {
					opacity: 0;
				}
			}
		}
		button {
			span {
				display: none;
			}
		}
	}

	.menu-area {
		display: flex;
		position: sticky;
		top: 0;
		background-color: #fff;
		border-bottom: 1px solid rgb(219, 219, 219);
		z-index: 9;
		.ant-btn {
			width: 32px;
			height: 32px;
			border: none;
			border-radius: 0;
			background-color: #f2f2f2;
			padding: 0;

			&.active {
				background-color: #fff;
			}

			&.btn-menu {
				border-right: 1px #dbdbdb solid;
			}
		}
		.ant-input-search-button {
			height: 32px !important;
			border-left: 1px solid rgb(219, 219, 219);
			&:hover {
				border-color: rgb(219, 219, 219);
			}
		}

		.ant-input-group .ant-input {
			&::placeholder {
				color: #c6c6c6;
				font-size: 12px;
			}
		}

		.ant-select-auto-complete {
			width: 156px;
			height: 32px !important;

			.ant-input-outlined,
			.ant-input-outlined:hover,
			.ant-input-outlined:focus,
			.ant-input-outlined:focus-within {
				box-shadow: none;
				/* border: none; */
				border-color: transparent;
				height: 32px !important;
			}

			.ant-btn-variant-solid {
				background-color: #4d4d4d;

				.ant-btn-icon {
				}

				.anticon.anticon-search {
					svg {
						display: none;
					}

					background-image: url('data:image/svg+xml,<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_749_62987)"><path d="M17.9501 17.067L13.4168 12.5337C13.4168 12.5337 13.4001 12.5253 13.3918 12.517C14.3418 11.367 14.9168 9.90033 14.9168 8.29199C14.9168 4.63366 11.9501 1.66699 8.29178 1.66699C4.63345 1.66699 1.65845 4.62533 1.65845 8.28366C1.65845 11.942 4.62511 14.9087 8.28345 14.9087C9.89178 14.9087 11.3668 14.3337 12.5084 13.3837C12.5084 13.3837 12.5168 13.4003 12.5251 13.4087L17.0584 17.942C17.1834 18.067 17.3418 18.1253 17.5001 18.1253C17.6584 18.1253 17.8168 18.067 17.9418 17.942C18.1834 17.7003 18.1834 17.3003 17.9418 17.0587L17.9501 17.067ZM8.28345 13.667C5.31678 13.667 2.90845 11.2587 2.90845 8.29199C2.90845 5.32533 5.31678 2.91699 8.28345 2.91699C11.2501 2.91699 13.6584 5.32533 13.6584 8.29199C13.6584 11.2587 11.2501 13.667 8.28345 13.667Z" fill="white"/></g><defs><clipPath id="clip0_749_62987"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>');

					width: 20px;
					height: 20px;
				}
			}
		}
	}
`;

export default Aside;
