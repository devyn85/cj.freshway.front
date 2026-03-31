import styled from 'styled-components';

const Title = styled.div`
	display: flex;
	align-items: flex-end;
	margin-bottom: 25px;
	/* justify-content: space-between; */
	/* padding: ${(props: any) => (props.innersect ? '0' : '0 0 12px 0')}; */
	/* margin: ${(props: any) => (props.innersect ? '0' : '0 0px 0px 0')}; */
	//border: 1px solid red;
	h2 {
		font-size: 24px;
		/* height: 30px; */
		line-height: 0.8em;
		margin: 0;
		font-weight: 700;
		letter-spacing: -0.2px;
	}
	& > span {
		display: flex;
		margin-left: 10px;
		.ant-btn {
			width: 12px;
			height: 12px;
			margin: -20px 0 0 -10px;
			min-width: 20px;
			border: 0 !important;
			border-radius: 0;
			padding: 0;
			.ico-svg {
				display: block;
				width: 14px;
				height: 14px;
				color: #333;
			}
		}
	}
	.ant-breadcrumb {
		margin: 0 0 -5px 10px;
		ol {
			display: flex;
			flex-wrap: wrap;
			margin: 0;
			padding: 0;
			list-style: none;
			li {
				font-size: 12px;
				font-weight: 400;
				color: #999;
				display: flex;
				align-items: center;
				/* &:after {
					content: '>';
					background: url('/img/icon/icon-arrow-right-20.svg') no-repeat center center;
					width: 15px;
					height: 16px;
					display: inline-block;
					font-size: 15px;
					font-weight: 600;
					line-height: 15px;
					font-family: cursive;
					text-align: center;
				} */
				&:last-child {
					color: #333;
					font-weight: 500;
					&:after {
						display: none;
					}
				}
				em {
					font-size: 0px;
					text-indent: -9999;
				}
			}
		}
		.ant-breadcrumb-separator {
			margin-inline: 4px;
			font-size: 14px;
			font-family: cursive;
			line-height: 15px;
			font-weight: 600;
		}
	}
	h3 {
		font-size: 14px;
		height: 28px;
		line-height: 38px;
		font-weight: bold;
		margin: 0;
		& + div {
			.ant-btn {
				font-size: 12px;
				//height: 28px;
				padding: 4px 10px;
			}
		}
	}
	.btn-group {
		margin-left: auto;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-bottom: -17px !important;
		.ant-btn-variant-solid {
			background-color: #4d4d4d;
		}
	}
`;

export default Title;
