import { useCallback, useEffect, useState } from 'react';

interface UseArrowKeyNavigationOptions {
	focusableItemClassName: string; // 포커스 가능한 항목들의 className
	searchInputClassName?: string; // 검색 input의 className (선택사항)
	containerRef: React.RefObject<HTMLElement>; // 컨테이너 ref - 이 영역에서만 키보드 이벤트가 작동
	onEscapePress?: () => void; // Escape 키 눌렀을 때 실행할 콜백
	onFocusChange?: (focusedIndex: number, focusedElement: HTMLElement | null) => void; // 포커스가 변경될 때 실행할 콜백
}

interface UseArrowKeyNavigationReturn {
	resetFocus: () => void; // 포커스 초기화 (검색 input으로 이동)
}

/**
 * 화살표 키 네비게이션 훅
 * @description containRef 안에 searchInputClassName과 focusableItemClassName 요소가 있어야 함
 *
 * TODO: searchInputClassName없이 focusableItemClassName 요소로만 이동해야 확장성이 좋음
 * @param {UseArrowKeyNavigationOptions} options
 * @param {string} options.focusableItemClassName 포커스 가능한 항목들의 className
 * @param {string} options.searchInputClassName 검색 input의 className (선택사항)
 * @param {React.RefObject<HTMLElement>} options.containerRef 컨테이너 ref - 이 영역에서만 키보드 이벤트가 작동
 * @param {() => void} options.onEscapePress Escape 키 눌렀을 때 실행할 콜백
 * @param {() => void} options.onFocusChange 포커스가 변경될 때 실행할 콜백
 * @returns {UseArrowKeyNavigationReturn}
 * @returns {() => void} resetFocus 포커스 초기화 (검색 input으로 이동)
 * @returns {UseArrowKeyNavigationReturn}
 */
export const useArrowKeyNavigation = (options: UseArrowKeyNavigationOptions): UseArrowKeyNavigationReturn => {
	const { focusableItemClassName, searchInputClassName, containerRef, onEscapePress, onFocusChange } = options;

	const [focusedIndex, setFocusedIndex] = useState(-1);

	/**
	 * 현재 보이는 포커스 가능한 항목들을 가져오기
	 */
	const getFocusableItems = useCallback((): HTMLElement[] => {
		if (!containerRef.current) return [];

		const items = containerRef.current.querySelectorAll(`.${focusableItemClassName}`);
		return Array.from(items) as HTMLElement[];
	}, [containerRef, focusableItemClassName]);

	/**
	 * 검색 input 요소 가져오기
	 */
	const getSearchInput = useCallback((): HTMLElement | null => {
		if (!containerRef.current || !searchInputClassName) return null;

		const searchInput = (
			containerRef.current.querySelector(`.${searchInputClassName}`) as HTMLElement
		).getElementsByTagName('input')[0];

		return searchInput;
	}, [containerRef, searchInputClassName]);

	/**
	 * 특정 인덱스의 항목에 포커스
	 */
	const focusItem = useCallback(
		(index: number) => {
			const focusableItems = getFocusableItems();

			if (index === -1) {
				// 검색 input으로 포커스 이동
				const searchInput = getSearchInput();

				if (searchInput) {
					searchInput.focus();
					setFocusedIndex(-1);
					onFocusChange?.(-1, searchInput);
					return;
				}
			}

			if (index >= 0 && index < focusableItems.length) {
				const targetElement = focusableItems[index];
				targetElement.focus();
				setFocusedIndex(index);
				onFocusChange?.(index, targetElement);
			}
		},
		[getFocusableItems, getSearchInput, onFocusChange],
	);

	/**
	 * 포커스 초기화
	 */
	const resetFocus = useCallback(() => {
		focusItem(-1);
	}, [focusItem]);

	/**
	 * 키보드 이벤트 핸들러
	 */
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			// 컨테이너 영역에서만 작동
			if (!containerRef.current?.contains(event.target as Node)) {
				return;
			}

			const focusableItems = getFocusableItems();
			const maxIndex = focusableItems.length - 1;

			switch (event.key) {
				case 'ArrowDown':
					event.preventDefault();
					if (focusedIndex === -1) {
						// 검색 input에서 첫 번째 메뉴로 이동
						focusItem(0);
					} else if (focusedIndex < maxIndex) {
						// 메뉴 항목들 사이에서 아래로 이동
						focusItem(focusedIndex + 1);
					}
					break;

				case 'ArrowUp':
					event.preventDefault();
					if (focusedIndex === 0) {
						// 첫 번째 메뉴 항목에서 검색 input으로 이동
						focusItem(-1);
					} else if (focusedIndex > 0) {
						// 메뉴 항목들 사이에서 위로 이동
						focusItem(focusedIndex - 1);
					}
					break;

				case 'Enter':
					event.preventDefault();
					if (focusedIndex >= 0 && focusedIndex <= maxIndex) {
						const targetElement = focusableItems[focusedIndex];
						targetElement.click();
					}
					break;

				case 'Escape':
					event.preventDefault();
					resetFocus();
					onEscapePress?.();
					break;
			}
		},
		[focusedIndex, focusItem, resetFocus, getFocusableItems, onEscapePress],
	);

	/**
	 * 키보드 이벤트 리스너 등록
	 */
	useEffect(() => {
		containerRef.current?.addEventListener('keydown', handleKeyDown);
		return () => {
			containerRef.current?.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyDown]);

	return {
		resetFocus,
	};
};
