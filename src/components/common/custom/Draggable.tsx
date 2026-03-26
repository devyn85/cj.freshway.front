import React, { useCallback, useEffect, useRef } from 'react';

// 드래그 가능한 모달을 위한 컴포넌트
const Draggable = ({ children, ...props }: any) => {
	const dragRef = useRef<HTMLDivElement>(null);
	const { width: propWidth } = props;
	const dragState = useRef({
		isDragging: false,
		startX: 0,
		startY: 0,
		initialX: 0,
		initialY: 0,
		originalWidth: 0,
		originalHeight: 0,
	});

	// 모달을 화면 중앙에 위치시키는 함수
	const centerModal = useCallback(() => {
		if (!dragRef.current) return;

		const modalWidth = dragRef.current.offsetWidth;
		const modalHeight = dragRef.current.offsetHeight;
		const centerX = (window.innerWidth - modalWidth) / 2;
		const centerY = (window.innerHeight - modalHeight) / 2;

		dragRef.current.style.left = `${centerX}px`;
		dragRef.current.style.top = `${centerY}px`;
		dragRef.current.style.transform = 'none';
	}, []);

	// 컴포넌트가 마운트되면 중앙에 위치
	useEffect(() => {
		if (dragRef.current) {
			// DOM이 완전히 렌더링된 후에 중앙 정렬 실행
			const timer = setTimeout(() => {
				centerModal();
			}, 0);
			return () => clearTimeout(timer);
		}
	}, [centerModal]);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		if (!dragRef.current) return;

		const rect = dragRef.current.getBoundingClientRect();
		dragState.current = {
			isDragging: true,
			startX: e.clientX,
			startY: e.clientY,
			initialX: rect.left,
			initialY: rect.top,
			originalWidth: dragRef.current.offsetWidth,
			originalHeight: dragRef.current.offsetHeight,
		};

		// 드래그 시작할 때 크기 고정
		if (dragRef.current) {
			dragRef.current.style.width = `${dragState.current.originalWidth}px`;
			dragRef.current.style.height = `${dragState.current.originalHeight}px`;
			dragRef.current.style.minWidth = `${dragState.current.originalWidth}px`;
			dragRef.current.style.maxWidth = `${dragState.current.originalWidth}px`;
			dragRef.current.style.minHeight = `${dragState.current.originalHeight}px`;
			dragRef.current.style.maxHeight = `${dragState.current.originalHeight}px`;
		}

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		e.preventDefault();
	}, []);

	const handleMouseMove = useCallback((e: any) => {
		if (!dragState.current.isDragging || !dragRef.current) return;

		// AUI그리드 헤더 영역 클릭시 'mouseup' 이벤트 호출이 되지 않음
		// AUI그리드 내부적으로 이벤트 컨트롤 하는거 같음
		if (
			e.target.closest('.aui-grid-header-renderer') ||
			e.target.closest('.aui-grid-header-panel') ||
			e.target.closest('.aui-grid-default-header')
		) {
			dragState.current.isDragging = false;
			return;
		}

		const deltaX = e.clientX - dragState.current.startX;
		const deltaY = e.clientY - dragState.current.startY;

		const newX = dragState.current.initialX + deltaX;
		const newY = dragState.current.initialY + deltaY;

		// 모달의 절반 이상이 화면에 보이도록 경계 체크
		const modalWidth = dragRef.current.offsetWidth;
		const modalHeight = dragRef.current.offsetHeight;

		// 모달의 절반까지는 화면 밖으로 나갈 수 있도록 허용
		const minX = -modalWidth / 2;
		const maxX = window.innerWidth - modalWidth / 2;
		const minY = -modalHeight / 2;
		const maxY = window.innerHeight - modalHeight / 2;

		const boundedX = Math.max(minX, Math.min(newX, maxX));
		const boundedY = Math.max(minY, Math.min(newY, maxY));

		dragRef.current.style.left = `${boundedX}px`;
		dragRef.current.style.top = `${boundedY}px`;
		dragRef.current.style.transform = 'none';
	}, []);

	const handleMouseUp = useCallback(() => {
		dragState.current.isDragging = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	}, []);

	return (
		<div
			ref={dragRef}
			style={{
				...props.style,
				position: 'fixed',
				cursor: dragState.current.isDragging ? 'move' : 'default',
				width: propWidth || 'auto',
				height: 'auto', // 자동 크기 조정 방지
				resize: 'none', // 리사이즈 방지
				overflow: 'visible', // 내용이 잘리지 않도록
			}}
		>
			<div
				onMouseDown={handleMouseDown}
				style={{
					cursor: 'move',
					userSelect: 'none',
					width: '100%', // 부모 컨테이너 크기 유지
					height: '100%', // 부모 컨테이너 크기 유지
					pointerEvents: 'auto', // 마우스 이벤트 활성화
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default Draggable;
