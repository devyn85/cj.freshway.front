import Konva from 'konva';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface ScrollDirection {
	left: boolean;
	right: boolean;
	top: boolean;
	bottom: boolean;
}

interface GrabScrollProps {
	stageRef: React.RefObject<Konva.Stage | null>;
	onScroll?: (x: number, y: number, node: Konva.Node) => void;
	bounds?: {
		minX: number;
		minY: number;
		maxX: number;
		maxY: number;
	};
}

export const useGrabScroll = ({ stageRef, onScroll, bounds }: GrabScrollProps) => {
	const rafIdRef = useRef<number | null>(null);
	const draggedNodeRef = useRef<Konva.Node | null>(null);
	const lastTimeRef = useRef<number>(0);
	const edgeEnterTimeRef = useRef<{ left: number; right: number; top: number; bottom: number }>({
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
	});
	const activeScrollRef = useRef<ScrollDirection>({
		left: false,
		right: false,
		top: false,
		bottom: false,
	});
	const isScrollActivatedRef = useRef<boolean>(false);
	const [scrollDirection, setScrollDirection] = useState<ScrollDirection>({
		left: false,
		right: false,
		top: false,
		bottom: false,
	});

	const handleDragStart = useCallback(
		(e: Konva.KonvaEventObject<DragEvent>) => {
			draggedNodeRef.current = e.target;
			const scrollSpeed = 600; // pixels per second
			const edgeOffset = 50;

			const animate = (currentTime: number) => {
				if (!draggedNodeRef.current) return;

				const stage = stageRef.current;
				if (!stage) {
					rafIdRef.current = requestAnimationFrame(animate);
					return;
				}

				// delta time 계산 (초 단위)
				const deltaTime = lastTimeRef.current ? (currentTime - lastTimeRef.current) / 1000 : 0;
				lastTimeRef.current = currentTime;

				const pos = stage.getPointerPosition();
				const isInsideCanvas = pos && pos.x >= 0 && pos.x <= stage.width() && pos.y >= 0 && pos.y <= stage.height();
				const delayMs = 100; // 모서리 체류 시간 (ms)

				if (isScrollActivatedRef.current) {
					// 한 번 활성화되면 커서 위치에 따라 방향만 업데이트 (드래그 끝날 때까지 유지)
					if (pos) {
						activeScrollRef.current = {
							left: pos.x < edgeOffset || pos.x < 0,
							right: pos.x > stage.width() - edgeOffset || pos.x > stage.width(),
							top: pos.y < edgeOffset || pos.y < 0,
							bottom: pos.y > stage.height() - edgeOffset || pos.y > stage.height(),
						};
					}
				} else if (isInsideCanvas) {
					// 아직 스크롤 미활성화: 100ms 체류 체크
					const inEdge = {
						left: pos.x < edgeOffset,
						right: pos.x > stage.width() - edgeOffset,
						top: pos.y < edgeOffset,
						bottom: pos.y > stage.height() - edgeOffset,
					};

					(['left', 'right', 'top', 'bottom'] as const).forEach(dir => {
						if (inEdge[dir]) {
							if (edgeEnterTimeRef.current[dir] === 0) {
								edgeEnterTimeRef.current[dir] = currentTime;
							}
							// 체류 시간이 지나면 활성화
							if (currentTime - edgeEnterTimeRef.current[dir] >= delayMs) {
								activeScrollRef.current[dir] = true;
								isScrollActivatedRef.current = true;
							}
						} else {
							edgeEnterTimeRef.current[dir] = 0;
						}
					});
				}

				// 현재 활성화된 스크롤 방향 (UI 표시용)
				const newDirection: ScrollDirection = { ...activeScrollRef.current };
				setScrollDirection(newDirection);

				// 실제 스크롤 가능 여부 (bounds 체크)
				const canScroll = { ...newDirection };
				if (bounds) {
					if (stage.x() >= bounds.maxX) canScroll.left = false;
					if (stage.x() <= bounds.minX) canScroll.right = false;
					if (stage.y() >= bounds.maxY) canScroll.top = false;
					if (stage.y() <= bounds.minY) canScroll.bottom = false;
				}

				let deltaX = 0;
				let deltaY = 0;

				if (canScroll.left) deltaX = scrollSpeed * deltaTime;
				else if (canScroll.right) deltaX = -scrollSpeed * deltaTime;

				if (canScroll.top) deltaY = scrollSpeed * deltaTime;
				else if (canScroll.bottom) deltaY = -scrollSpeed * deltaTime;

				if (deltaX !== 0 || deltaY !== 0) {
					let newStageX = stage.x() + deltaX;
					let newStageY = stage.y() + deltaY;

					if (bounds) {
						newStageX = Math.max(bounds.minX, Math.min(bounds.maxX, newStageX));
						newStageY = Math.max(bounds.minY, Math.min(bounds.maxY, newStageY));
					}

					if (onScroll) onScroll(newStageX, newStageY, draggedNodeRef.current);
				}

				rafIdRef.current = requestAnimationFrame(animate);
			};

			lastTimeRef.current = 0;
			rafIdRef.current = requestAnimationFrame(animate);
		},
		[stageRef, onScroll, bounds],
	);

	const handleDragEnd = useCallback(() => {
		draggedNodeRef.current = null;
		if (rafIdRef.current) {
			cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		}
		lastTimeRef.current = 0;
		edgeEnterTimeRef.current = { left: 0, right: 0, top: 0, bottom: 0 };
		activeScrollRef.current = { left: false, right: false, top: false, bottom: false };
		isScrollActivatedRef.current = false;
		setScrollDirection({ left: false, right: false, top: false, bottom: false });
	}, []);

	useEffect(() => {
		return () => {
			if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
		};
	}, []);

	return { handleDragStart, handleDragEnd, scrollDirection };
};
