import Icon from '@/components/common/Icon';
import { useModal } from '@/hooks/useModal';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

interface CustomDraggableModalProps {
	width?: string;
	title?: any;
	children?: any;
}

const CustomDraggableModal = forwardRef((props: CustomDraggableModalProps, ref: any) => {
	const { title, width, children } = props;
	const { isOpen, handlerOpen, handlerClose, getIsOpen } = useModal();

	useImperativeHandle(ref, () => ({ handlerOpen, handlerClose, getIsOpen }));

	const modalRef = useRef<HTMLDivElement>(null);

	// 브라우저 viewport 기준 초기 중앙 위치 계산
	const getInitialPosition = useCallback(() => {
		const modalWidth = parseInt(width || '520');
		const modalHeight = 300;
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		return {
			x: (windowWidth - modalWidth) / 2,
			y: (windowHeight - modalHeight) / 2,
		};
	}, [width]);

	const [position, setPosition] = useState(getInitialPosition);
	const [isDragging, setIsDragging] = useState(false);
	const [disabled, setDisabled] = useState(true);

	// 드래그 관련 refs (성능 최적화)
	const positionRef = useRef({ x: 0, y: 0 });
	const dragOffsetRef = useRef({ x: 0, y: 0 });
	const modalBoundsRef = useRef<{
		width: number;
		height: number;
		windowWidth: number;
		windowHeight: number;
		maxX: number;
		maxY: number;
	}>({ width: 0, height: 0, windowWidth: 0, windowHeight: 0, maxX: 0, maxY: 0 });

	// 모달 경계 계산을 메모이제이션 (viewport 기준)
	const modalBounds = useMemo(() => {
		const modalWidth = parseInt(width || '520');
		const modalHeight = 300;
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		return {
			width: modalWidth,
			height: modalHeight,
			windowWidth,
			windowHeight,
			maxX: windowWidth - modalWidth,
			maxY: windowHeight - modalHeight,
		};
	}, [width]);

	// 경계 계산을 한 번만 수행하고 ref에 저장
	useEffect(() => {
		modalBoundsRef.current = modalBounds;
	}, [modalBounds]);

	// 컴포넌트 마운트 시 viewport 중앙 위치 설정
	useEffect(() => {
		const initialPos = getInitialPosition();
		setPosition(initialPos);
		positionRef.current = initialPos;
	}, [getInitialPosition]);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			if (modalRef.current) {
				// 현재 모달의 위치를 ref에 저장
				positionRef.current = position;

				// 드래그 시작 시점의 마우스 위치와 모달의 현재 위치 차이를 저장
				dragOffsetRef.current = {
					x: e.clientX - position.x,
					y: e.clientY - position.y,
				};
				setIsDragging(true);
			}
		},
		[position],
	);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (isDragging) {
				const { x: offsetX, y: offsetY } = dragOffsetRef.current;
				const bounds = modalBoundsRef.current;

				// viewport 기준 절대 좌표 계산
				const newX = e.clientX - offsetX;
				const newY = e.clientY - offsetY;

				// viewport 경계 체크 - 모달의 각 꼭지점들이 브라우저 안에서 제한되도록
				const boundedX = Math.max(0, Math.min(newX, bounds.maxX));
				const boundedY = Math.max(0, Math.min(newY, bounds.maxY));

				// 이전 위치와 같으면 상태 업데이트하지 않음
				setPosition(prevPosition => {
					if (prevPosition.x === boundedX && prevPosition.y === boundedY) {
						return prevPosition;
					}
					// ref도 함께 업데이트
					positionRef.current = { x: boundedX, y: boundedY };
					return { x: boundedX, y: boundedY };
				});
			}
		},
		[isDragging],
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
			return () => {
				document.removeEventListener('mousemove', handleMouseMove);
				document.removeEventListener('mouseup', handleMouseUp);
			};
		}
	}, [isDragging, handleMouseMove, handleMouseUp]);

	const draggableTitle = useMemo(
		() => (
			<StyledDraggableTitle
				$disabled={disabled}
				onMouseOver={() => {
					if (disabled) {
						setDisabled(false);
					}
				}}
				onMouseOut={() => {
					setDisabled(true);
				}}
				onFocus={() => undefined}
				onBlur={() => undefined}
			>
				<StyledTitleText>{title}</StyledTitleText>
			</StyledDraggableTitle>
		),
		[title, disabled],
	);

	// 모달이 보이지 않으면 렌더링하지 않음
	if (!isOpen) {
		return null;
	}

	return (
		<>
			<StyledModalContainer
				ref={modalRef}
				$position={position}
				$width={width || '520px'}
				$isDragging={isDragging}
				onMouseDown={!disabled ? handleMouseDown : undefined}
			>
				<StyledHeaderContainer>
					{draggableTitle}
					<StyledCloseButton type="button" aria-label="Close" onClick={handlerClose}>
						<StyledIconWrapper>
							<Icon icon="icon-pc-popup-close-20-px-bl" />
						</StyledIconWrapper>
					</StyledCloseButton>
				</StyledHeaderContainer>

				<StyledContentContainer className="h-auto">{children}</StyledContentContainer>
			</StyledModalContainer>
		</>
	);
});

const StyledModalContainer = styled.div<{ $position: { x: number; y: number }; $width: string; $isDragging: boolean }>`
	position: fixed;
	top: ${props => props.$position.y}px;
	left: ${props => props.$position.x}px;
	width: ${props => props.$width};
	background-color: #fff;
	border-radius: 4px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	transition: ${props => (props.$isDragging ? 'none' : 'top 0.1s ease-out, left 0.1s ease-out')};
	user-select: none;
	z-index: 1020;
`;

const StyledHeaderContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const StyledDraggableTitle = styled.div<{ $disabled: boolean }>`
	width: 100%;
	cursor: ${props => (props.$disabled ? 'default' : 'move')};
	padding: 12px 0 0 12px;
`;

const StyledCloseButton = styled.button`
	width: 32px;
	height: 32px;
	margin: 12px 12px 0 0;
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	background: transparent;
	cursor: pointer;
	border-radius: 4px;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: rgba(0, 0, 0, 0.06);
	}
`;

const StyledIconWrapper = styled.div`
	transform: scale(1.1);
	filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.3));
`;

const StyledContentContainer = styled.div`
	padding: 24px;
	max-height: 60vh;
	overflow: auto;
`;

const StyledTitleText = styled.h3`
	margin: 0;
	font-size: 18px;
	font-weight: 600;
	color: #333;
`;

export default CustomDraggableModal;
