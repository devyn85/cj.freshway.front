import { useEffect } from 'react';

type KeyCombo = {
	key: string;
	ctrlKey?: boolean;
	altKey?: boolean;
	shiftKey?: boolean;
};

/**
 * 키보드 단축키를 처리하는 커스텀 훅
 * @param keyCombo - 감지할 키 조합 설정
 * Windows: Ctrl + key (예: { key: 'b', ctrlKey: true })
 * Mac: Command(⌘) + key로 자동 변환
 * @param callback - 키 입력시 실행할 콜백 함수
 * @param targetRef - 옵셔널: 특정 요소에서만 단축키를 적용하고 싶을 때 사용할 ref (AUIGrid 객체)
 */
export function useKeydown(
	keyCombo: KeyCombo,
	callback: (event?: KeyboardEvent) => void,
	targetRef?: React.RefObject<any>, // AUIGrid 객체이므로 any 타입으로 변경
) {
	useEffect(() => {
		const handleKeyDown = (event: Event) => {
			if (!(event instanceof KeyboardEvent)) return;

			if (isCheckKeyMatch(event, keyCombo)) {
				// targetRef가 있으면 범위 체크
				if (targetRef?.current) {
					// targetRef에 해당하는 AUI그리드 영역이 있는지 체크
					const gridElement = document.querySelector(targetRef.current?.state?.pid);
					if (gridElement) {
						callback(event);
					} else {
						return;
					}

					// 아래 내용 쓰는곳이 없어 주석 처리
					// const isInTarget = targetRef.current.contains(document.activeElement);
					// if (!isInTarget) {
					// 	// 범위 밖이면 브라우저 기본 동작만 실행
					// 	return;
					// }
				} else {
					// 조건에 맞으면 브라우저 기본 동작 막고 콜백 실행
					event.preventDefault();
					event.stopPropagation();
					callback(event);
				}
			}
		};

		// 키보드 이벤트 리스너
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [keyCombo, targetRef]);
}

/**
 * 키 조합 유효한지 확인
 * @param event - 키보드 이벤트
 * @param keyCombo - 키 조합
 * @returns 키 조합이 맞으면 true, 아니면 false
 */
export const isCheckKeyMatch = (event: KeyboardEvent, keyCombo: KeyCombo) => {
	const isMac = /Mac/i.test(navigator.userAgent);
	const isKeyMatch = event.key.toLowerCase() === keyCombo.key.toLowerCase();
	const isCtrlMatch = keyCombo.ctrlKey
		? isMac
			? event.metaKey
			: event.ctrlKey
		: !(isMac ? event.metaKey : event.ctrlKey);
	const isAltMatch = keyCombo.altKey ? event.altKey : !event.altKey;
	const isShiftMatch = keyCombo.shiftKey ? event.shiftKey : !event.shiftKey;

	return isKeyMatch && isCtrlMatch && isAltMatch && isShiftMatch;
};
