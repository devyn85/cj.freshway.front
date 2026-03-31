import { useEffect, useRef } from 'react';

interface UseCloseOnExternalScrollProps {
	open: boolean; // 드롭다운/팝업이 열려있는지 여부
	onClose: () => void; // 드롭다운/팝업을 닫는 함수
	allowScrollRefs?: React.RefObject<HTMLElement>[]; // 스크롤을 허용할 영역들의 ref 배열
	allowScrollSelectors?: string[]; // 추가로 스크롤을 허용할 CSS 셀렉터들
}

/**
 * allowScrollRefs와 allowScrollSelectors를 제외한 외부 스크롤 감지 및 드롭다운 닫기
 * @param {boolean} open 드롭다운/팝업이 열려있는지 여부
 * @param {Function} onClose 드롭다운/팝업을 닫는 함수
 * @param {React.RefObject<HTMLElement>[]} allowScrollRefs 스크롤을 허용할 영역들의 ref 배열
 * @param {string[]} allowScrollSelectors 추가로 스크롤을 허용할 CSS 셀렉터들
 */
export const useCloseOnExternalScroll = ({
	open,
	onClose,
	allowScrollRefs = [],
	allowScrollSelectors = [],
}: UseCloseOnExternalScrollProps) => {
	const dynamicElementsRef = useRef<HTMLElement[]>([]);

	// 동적으로 생성되는 요소들 찾기 (예: ant-select-dropdown)
	useEffect(() => {
		if (open) {
			setTimeout(() => {
				const elements: HTMLElement[] = [];

				// 기본 Ant Design 드롭다운 및 DatePicker 셀렉터들
				const defaultSelectors = [
					'.ant-select-dropdown:not(.ant-select-dropdown-hidden)',
					'.ant-dropdown:not(.ant-dropdown-hidden)',
					'.ant-tooltip:not(.ant-tooltip-hidden)',
					'.ant-popover:not(.ant-popover-hidden)',
					'.ant-modal-content:not(.ant-modal-content-hidden)',
					// DatePicker 관련 셀렉터들 추가
					'.ant-picker-panel-container',
					'.ant-picker-panel',
					'.ant-picker-body',
					'.ant-picker-content',
					'.ant-picker-date-panel',
					'.ant-picker-time-panel',
					'.ant-picker-decade-panel',
					'.ant-picker-year-panel',
					'.ant-picker-month-panel',
					'.ant-picker-quarter-panel',
					'.ant-picker-week-panel',
					'.ant-picker-header',
					'.ant-picker-footer',
					'.ant-picker-cell',
					'.ant-picker-cell-inner',
					'.ant-picker-ranges',
					'.ant-picker-ok',
					'.ant-picker-now',
					'.ant-picker-today-btn',
					'.ant-picker-super-prev-icon',
					'.ant-picker-super-next-icon',
					'.ant-picker-prev-icon',
					'.ant-picker-next-icon',
					...allowScrollSelectors,
				];

				defaultSelectors.forEach(selector => {
					const foundElements = document.querySelectorAll(selector);
					foundElements.forEach(el => {
						if (el instanceof HTMLElement) {
							elements.push(el);
						}
					});
				});

				dynamicElementsRef.current = elements;
			}, 0);
		} else {
			dynamicElementsRef.current = [];
		}
	}, [open, allowScrollSelectors]);

	// 외부 스크롤 감지 및 드롭다운 닫기
	useEffect(() => {
		if (!open) return;

		const handleScroll = (event: Event) => {
			setTimeout(() => {
				const target = event.target as HTMLElement;

				// 스크롤 대상이 input일 경우 제외
				if (event.target instanceof HTMLInputElement) {
					return;
				}

				// 허용된 ref 영역들에서의 스크롤인지 확인
				const isAllowedRefScroll = allowScrollRefs.some(ref => {
					if (!ref.current) return false;

					const element = ref.current;
					const isInside = element === target || (element.contains && element.contains(target));
					return isInside;
				});

				if (isAllowedRefScroll) {
					return;
				}

				// 동적으로 생성된 요소들에서의 스크롤인지 확인
				const isDynamicElementScroll = dynamicElementsRef.current.some(element => {
					const isInside = element === target || element.contains(target);
					return isInside;
				});

				if (isDynamicElementScroll) {
					return;
				}

				onClose();
			}, 500);
		};

		// 캡처 단계에서 이벤트 리스너 등록
		setTimeout(() => {
			document.addEventListener('scroll', handleScroll, true);
			window.addEventListener('scroll', handleScroll, true);
		});

		return () => {
			document.removeEventListener('scroll', handleScroll, true);
			window.removeEventListener('scroll', handleScroll, true);
		};
	}, [open, onClose, allowScrollRefs]);
};
