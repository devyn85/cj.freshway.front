import { getAllGridElement } from '@/lib/AUIGrid/auIGridUtil';

/**
 * 드롭다운 위치 조정 유틸리티
 * Grid 영역을 벗어나는 드롭다운을 Grid 내부에 표시되도록 위치를 조정
 */

interface CellElementRect {
	top: number;
	height: number;
	left: number;
	width: number;
}

interface DropdownPosition {
	top: string;
	left: string;
	transform: string;
}

/**
 * cellElementRect를 기반으로 소속된 Grid Element를 찾는 함수
 * @param {CellElementRect} cellElementRect 셀 위치 정보
 * @returns {HTMLElement | null} Grid DOM Element 또는 null
 */
export function findGridElement(cellElementRect: CellElementRect): HTMLElement | null {
	if (!cellElementRect) return null;

	// cellElementRect 위치에서 실제 DOM 요소 찾기
	const cellElement = document.elementFromPoint(
		cellElementRect.left + cellElementRect.width / 2,
		cellElementRect.top + cellElementRect.height / 2,
	);

	if (!cellElement) return null;

	// AUIGrid 컨테이너를 찾기 위해 상위 요소들을 탐색
	let currentElement = cellElement as HTMLElement;

	// 최대 10단계까지 상위 요소 탐색 (무한루프 방지)
	let maxDepth = 10;

	while (currentElement && maxDepth > 0) {
		// AUIGrid의 일반적인 클래스명이나 ID 패턴 확인
		if (
			currentElement.id &&
			(currentElement.id.startsWith('AUIGrid') ||
				currentElement.classList.contains('aui-grid') ||
				currentElement.classList.contains('aui-grid-container'))
		) {
			return currentElement;
		}

		// 다음 상위 요소로 이동
		currentElement = currentElement.parentElement as HTMLElement;
		maxDepth--;
	}

	const allGrids = getAllGridElement();

	const foundGridElement = getFoundGridElementInCellElementRect(cellElementRect, allGrids);

	return (foundGridElement as HTMLElement) || null;
}

/**
 * Grid를 찾지 못한 경우, 모든 Grid 요소 중에서 cellElementRect와 겹치는 것 찾기
 * @param cellElementRect
 * @param allGrids
 */
function getFoundGridElementInCellElementRect(cellElementRect: CellElementRect, allGrids: NodeListOf<Element> | null) {
	if (!allGrids) return null;

	return Array.from(allGrids).find(grid => {
		const gridElement = grid as HTMLElement;
		const gridRect = gridElement.getBoundingClientRect();

		// cellElementRect가 grid 영역 내에 있는지 확인
		return (
			cellElementRect.left >= gridRect.left &&
			cellElementRect.left <= gridRect.right &&
			cellElementRect.top >= gridRect.top &&
			cellElementRect.top <= gridRect.bottom
		);
	});
}

/**
 * 구형 브라우저 호환성을 위한 getBoundingClientRect 폴백
 * @param {HTMLElement} element DOM 요소
 * @returns {DOMRect} 요소의 위치 정보
 */
function getBoundingClientRectCompat(element: HTMLElement) {
	// 모던 브라우저
	if (element.getBoundingClientRect) {
		return element.getBoundingClientRect();
	}

	// 구형 브라우저 폴백 (IE8 이하)
	const rect = {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: 0,
		height: 0,
	};

	try {
		// offsetTop, offsetLeft 사용
		let offsetElement = element;
		while (offsetElement) {
			rect.top += offsetElement.offsetTop || 0;
			rect.left += offsetElement.offsetLeft || 0;
			offsetElement = offsetElement.offsetParent as HTMLElement;
		}

		rect.width = element.offsetWidth || 0;
		rect.height = element.offsetHeight || 0;
		rect.right = rect.left + rect.width;
		rect.bottom = rect.top + rect.height;
	} catch (e) {
		console.warn('getBoundingClientRect 폴백 실행 중 오류:', e);
	}

	return rect;
}

/**
 * 드롭다운이 Grid 영역을 벗어나는지 확인하고 위치를 조정
 * @param {CellElementRect} cellElementRect 셀 위치 정보
 * @param {HTMLElement | null} dropdownElement 드롭다운 DOM 요소
 * @returns {DropdownPosition} 조정된 위치 정보
 */
export function calculateDropdownPosition(
	cellElementRect: CellElementRect,
	dropdownElement: HTMLElement | null,
): DropdownPosition {
	// 기본 위치 (기존 로직)
	const defaultPosition: DropdownPosition = {
		top: `${cellElementRect.top + cellElementRect.height + 2}px`,
		left: `${cellElementRect.left + cellElementRect.width / 2}px`,
		transform: 'translateX(-50%)',
	};

	// Grid 요소를 찾을 수 없거나 드롭다운 요소가 없는 경우 기본 위치 반환
	const gridElement = findGridElement(cellElementRect);
	if (!gridElement || !dropdownElement) {
		return defaultPosition;
	}

	try {
		// Grid와 드롭다운의 경계 정보 가져오기
		const gridRect = getBoundingClientRectCompat(gridElement);
		const dropdownRect = getBoundingClientRectCompat(dropdownElement);

		// 조정된 위치 계산
		let adjustedTop = cellElementRect.top + cellElementRect.height + 2;
		let adjustedLeft = cellElementRect.left + cellElementRect.width / 2;
		let transform = 'translateX(-50%)';

		// 드롭다운 크기 (transform 고려)
		const dropdownWidth = dropdownRect.width;
		const dropdownHeight = dropdownRect.height;

		// 좌우 경계 확인 및 조정
		const dropdownLeftEdge = adjustedLeft - dropdownWidth / 2;
		const dropdownRightEdge = adjustedLeft + dropdownWidth / 2;

		if (dropdownLeftEdge < gridRect.left) {
			// 왼쪽으로 넘어가는 경우 - 왼쪽 정렬
			adjustedLeft = gridRect.left + 10; // 10px 여백
			transform = 'translateX(0)';
		} else if (dropdownRightEdge > gridRect.right) {
			// 오른쪽으로 넘어가는 경우 - 오른쪽 정렬
			adjustedLeft = gridRect.right - 10; // 10px 여백
			transform = 'translateX(-100%)';
		}

		// 상하 경계 확인 및 조정
		const dropdownBottomEdge = adjustedTop + dropdownHeight;

		if (dropdownBottomEdge > gridRect.bottom) {
			// 아래로 넘어가는 경우 - 셀 위쪽에 표시
			adjustedTop = cellElementRect.top - dropdownHeight - 2;

			// 위쪽에 표시해도 Grid 영역을 벗어나는 경우
			if (adjustedTop < gridRect.top) {
				// 셀 옆에 표시 (우선순위: 오른쪽 > 왼쪽)
				adjustedTop = cellElementRect.top;

				const cellRightEdge = cellElementRect.left + cellElementRect.width;
				const cellLeftEdge = cellElementRect.left;

				// 오른쪽에 공간이 있는지 확인
				if (cellRightEdge + dropdownWidth + 10 <= gridRect.right) {
					adjustedLeft = cellRightEdge + 10;
					transform = 'translateX(0)';
				} else if (cellLeftEdge - dropdownWidth - 10 >= gridRect.left) {
					// 왼쪽에 공간이 있는지 확인
					adjustedLeft = cellLeftEdge - 10;
					transform = 'translateX(-100%)';
				} else {
					// 양쪽 모두 공간이 부족한 경우 Grid 내부 중앙에 표시
					adjustedTop = gridRect.top + (gridRect.height - dropdownHeight) / 2;
					adjustedLeft = gridRect.left + gridRect.width / 2;
					transform = 'translateX(-50%)';
				}
			}
		} else if (adjustedTop < gridRect.top) {
			// 위로 넘어가는 경우 - 셀 아래쪽에 표시
			adjustedTop = cellElementRect.top + cellElementRect.height + 2;
		}

		return {
			top: `${adjustedTop}px`,
			left: `${adjustedLeft}px`,
			transform,
		};
	} catch (error) {
		console.warn('드롭다운 위치 계산 중 오류 발생:', error);
		return defaultPosition;
	}
}

/**
 * 드롭다운 요소에 계산된 위치를 적용
 * @param {HTMLElement} dropdownElement 드롭다운 DOM 요소
 * @param {DropdownPosition} position 위치 정보
 */
export function applyDropdownPosition(dropdownElement: HTMLElement, position: DropdownPosition): void {
	if (!dropdownElement) return;

	try {
		dropdownElement.style.position = 'fixed';
		dropdownElement.style.top = position.top;
		dropdownElement.style.left = position.left;
		dropdownElement.style.transform = position.transform;
		dropdownElement.style.zIndex = '9999';
	} catch (error) {
		console.warn('드롭다운 위치 적용 중 오류 발생:', error);
	}
}
