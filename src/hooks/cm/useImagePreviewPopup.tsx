/*
 ############################################################################
 # File			: useImagePreviewPopup.tsx
 # Description	: 이미지 미리보기 확대/드래그 기능 Custom Hook
 # Author		: YeoSeungCheol
 # Since		: 25.12.12
 ############################################################################
*/
import { useEffect, useState } from 'react';

interface Position {
	x: number;
	y: number;
}

interface UseImagePreviewPopupReturn {
	isZoomed: boolean;
	isDragging: boolean;
	position: Position;
	containerStyle: React.CSSProperties;
	imageStyle: React.CSSProperties;
	containerHandlers: {
		onMouseMove: (e: React.MouseEvent) => void;
		onMouseUp: () => void;
		onMouseLeave: () => void;
	};
	imageHandlers: {
		onClick: () => void;
		onMouseDown: (e: React.MouseEvent) => void;
		draggable: boolean;
	};
	reset: () => void;
}

/**
 * 이미지 미리보기 확대/드래그 기능 Custom Hook
 * @param imageSrc 현재 미리보기 이미지 src (변경 시 자동 초기화)
 * @param scale 확대 배율 (기본값: 2)
 * @returns 스타일 및 핸들러 객체
 */
const useImagePreviewPopup = (imageSrc: string, scale = 2): UseImagePreviewPopupReturn => {
	const [isZoomed, setIsZoomed] = useState(false);
	const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });

	/**
	 * 이미지 확대/축소 토글 (클릭 시)
	 */
	const handleImageClick = () => {
		// 드래그 중이면 클릭으로 처리하지 않음
		if (isDragging) return;

		if (isZoomed) {
			// 축소 시 위치 초기화
			setIsZoomed(false);
			setPosition({ x: 0, y: 0 });
		} else {
			setIsZoomed(true);
		}
	};

	/**
	 * 이미지 드래그 시작
	 * @param e
	 */
	const handleMouseDown = (e: React.MouseEvent) => {
		if (!isZoomed) return;
		e.preventDefault();
		setIsDragging(true);
		setDragStart({
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		});
	};

	/**
	 * 이미지 드래그 중
	 * @param e
	 */
	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging || !isZoomed) return;
		e.preventDefault();
		setPosition({
			x: e.clientX - dragStart.x,
			y: e.clientY - dragStart.y,
		});
	};

	/**
	 * 이미지 드래그 종료
	 */
	const handleMouseUp = () => {
		setIsDragging(false);
	};

	/**
	 * 수동 초기화 함수
	 */
	const reset = () => {
		setIsZoomed(false);
		setPosition({ x: 0, y: 0 });
		setIsDragging(false);
	};

	/**
	 * 이미지 변경 시 확대/위치 초기화
	 */
	useEffect(() => {
		setIsZoomed(false);
		setPosition({ x: 0, y: 0 });
	}, [imageSrc]);

	// 컨테이너에 적용할 스타일
	const containerStyle: React.CSSProperties = {
		overflow: isZoomed ? 'visible' : 'hidden',
		position: 'relative',
	};

	// 이미지에 적용할 스타일
	const imageStyle: React.CSSProperties = {
		position: isZoomed ? 'absolute' : 'relative',
		zIndex: isZoomed ? 1000 : 'auto',
		top: isZoomed ? position.y : 0,
		left: isZoomed ? position.x : 0,
		transform: isZoomed ? `scale(${scale})` : 'scale(1)',
		transformOrigin: 'center center',
		cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
		transition: isDragging ? 'none' : 'transform 0.3s ease, top 0.3s ease, left 0.3s ease',
		userSelect: 'none',
		boxShadow: isZoomed ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
	};

	// 컨테이너 핸들러
	const containerHandlers = {
		onMouseMove: handleMouseMove,
		onMouseUp: handleMouseUp,
		onMouseLeave: handleMouseUp,
	};

	// 이미지 핸들러
	const imageHandlers = {
		onClick: handleImageClick,
		onMouseDown: handleMouseDown,
		draggable: false,
	};

	return {
		isZoomed,
		isDragging,
		position,
		containerStyle,
		imageStyle,
		containerHandlers,
		imageHandlers,
		reset,
	};
};

export default useImagePreviewPopup;
