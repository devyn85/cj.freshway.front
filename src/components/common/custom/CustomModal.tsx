/*
############################################################################
# FiledataField	: CustomModal.tsx
# Description		: 커스텀 모달 (드래그 기능 포함)
# Author			: Canal Frame
# Since			: 22.11.02
# Modified		: 20251203@ESC키 처리 기능 추가(팝업에 팝업에서 esc 키 누를 때 모두 닫히는 버그 수정) by sss
                20260207@드래드 가능한 모달 팝업 시 사이즈 작아지는 현상 수정) by sss   
############################################################################
*/
// lib
import Draggable from '@/components/common/custom/Draggable';
import { useModal } from '@/hooks/useModal';
import { ConfigProvider, Modal } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';

interface CustomModalProps {
	width?: string;
	title?: any;
	children?: any;
	draggable?: boolean; // 드래그 기능 활성화 여부
	onKeyDown?: (e: KeyboardEvent) => void; // ESC키 처리를 위한 이벤트 핸들러
}

const CustomModal = forwardRef((props: CustomModalProps, ref: any) => {
	const { title, width, children, draggable = false, onKeyDown } = props;

	const { isOpen, isView, handlerOpen, handlerClose, getIsOpen } = useModal();

	useImperativeHandle(ref, () => ({ handlerOpen, handlerClose, getIsOpen }));

	// ESC키 처리
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && onKeyDown && isOpen) {
				e.stopPropagation();
				e.preventDefault();
				onKeyDown(e);
			}
		};

		if (onKeyDown && isOpen) {
			document.addEventListener('keydown', handleKeyDown, true); // capture phase에서 처리
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown, true);
		};
	}, [onKeyDown, isOpen]);

	// 드래그 가능한 모달 설정
	//const modalRender = draggable ? (modal: React.ReactNode) => <Draggable>{modal}</Draggable> : undefined;
	// 20260207@드래드 가능한 모달 팝업 시 사이즈 작아지는 현상 수정) by sss
	const modalRender = draggable ? (modal: React.ReactNode) => <Draggable width={width}>{modal}</Draggable> : undefined;

	return (
		<>
			{isOpen && (
				<ConfigProvider theme={{ token: { motion: false } }}>
					<Modal
						title={title}
						open={isOpen}
						onCancel={() => {
							handlerClose();
							isView && children?.props?.close && children?.props?.close();
						}}
						keyboard={false} // ESC키는 직접 처리하므로 기본 동작 비활성화
						maskClosable={false}
						centered={!draggable} // 드래그 가능할 때는 중앙 정렬 해제
						mask={true}
						width={width}
						footer=""
						modalRender={modalRender}
					>
						{isView && children}
					</Modal>
				</ConfigProvider>
			)}
		</>
	);
});

export default CustomModal;
