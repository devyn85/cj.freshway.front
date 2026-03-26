import { PropsWithChildren } from 'react';

import styled from 'styled-components';
// import { ReactComponent as CloseIcon } from '@/assets/img/icon/icon-pc-popup-close-20-px-bl.svg';
import Icon from '@/components/common/Icon';

interface ModalProps {
	closeModal: () => void;
	width?: string;
	height?: string;
	style?: React.CSSProperties;
}

const Modal = (props: PropsWithChildren<ModalProps>) => {
	const closeModal = () => {
		props.closeModal();
	};

	return (
		<ModalWrapper width={props.width ?? '800px'} height={props.height ?? '500px'} style={props.style}>
			<div className="modal-body">
				<span onClick={() => closeModal()}>
					{/* <CloseIcon /> */}
					<Icon icon="icon-pc-popup-close-20-px-bl" />
				</span>
				<div className="modal-content">{props.children}</div>
			</div>
		</ModalWrapper>
	);
};

type ModalWrapperProps = {
	width?: string;
	height?: string;
};

const ModalWrapper = styled.div<ModalWrapperProps>`
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
	background-color: rgba(0, 0, 0, 0.3);
	width: 100%;
	height: 100%;

	.modal-body {
		border-radius: 8px;
		padding: 40px 48px 24px 24px;
		position: relative;
		background-color: white;
		> span {
			&:has(svg) {
				position: absolute;
				top: 12px;
				right: 12px;
				cursor: pointer;
			}
		}
		.modal-content {
			width: ${props => props.width};
			height: ${props => props.height};
			overflow-y: auto;
			&::-webkit-scrollbar {
				width: 6px;
				height: 6px;
			}
			&::-webkit-scrollbar-thumb {
				background: #c6c6c6;
				border-radius: 6px;
			}
			&::-webkit-scrollbar-thumb:hover {
				background: #c6c6c6;
			}
			&::-webkit-scrollbar-track {
				background: #ededed;
				border-radius: 6px;
			}
		}
	}
`;

export default Modal;
