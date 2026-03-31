import { useEffect } from 'react';

type KeyCombo = {
	key: string;
	ctrlKey?: boolean;
	altKey?: boolean;
	shiftKey?: boolean;
};

type KeyHandlers = {
	handleF2?: (event: CustomEvent) => void;
	handleF7?: (event: CustomEvent) => void;
	handleF8?: (event: CustomEvent) => void;
	handleF9?: (event: CustomEvent) => void;
	handleF10?: (event: CustomEvent) => void;
	handleCtrlF?: (event: CustomEvent) => void;
	handleEnter?: (event: CustomEvent) => void;
	handleCtrlP?: (event: CustomEvent) => void;
};

/**
 * window 객체 에 이벤트 리스너를 등록하여 키보드 단축키 입력 시
 *
 * targetRef가 있다면 해당 그리드에서 콜백함수를 실행하고
 *
 * targetRef가 없다면 모든 그리드에서 콜백함수를 실행하는 커스텀 훅
 * @param keyCombo - 감지할 키 조합 설정
 * @param callback - 키 입력시 실행할 콜백 함수
 * @param targetRef - 옵셔널: 특정 요소에서만 단축키를 적용하고 싶을 때 사용할 ref (AUIGrid 객체)
 */
export function useKeydownAUIGrid(
	keyCombo: KeyCombo,
	callback: (event?: KeyboardEvent) => void,
	targetRef?: React.RefObject<any>,
): KeyHandlers {
	// 필요한 핸들러만 생성
	const handlers: KeyHandlers = {};

	const createHandler = () => {
		return (event: CustomEvent) => {
			callbackBySameGrid(event, callback, targetRef);
		};
	};

	// 요청된 키에 대해서만 핸들러 생성
	switch (keyCombo.key.toLowerCase()) {
		case 'f2':
			handlers.handleF2 = createHandler();
			break;
		case 'f7':
			handlers.handleF7 = createHandler();
			break;
		case 'f8':
			handlers.handleF8 = createHandler();
			break;
		case 'f9':
			handlers.handleF9 = createHandler();
			break;
		case 'f10':
			handlers.handleF10 = createHandler();
			break;
		case 'f':
			if (keyCombo.ctrlKey) {
				handlers.handleCtrlF = createHandler();
			}
			break;
		case 'enter':
			handlers.handleEnter = createHandler();
			break;
		case 'p':
			if (keyCombo.ctrlKey) {
				handlers.handleCtrlP = createHandler();
			}
			break;
	}

	useEffect(() => {
		// 생성된 핸들러만 등록
		if (handlers.handleF2) {
			window.addEventListener('gridF2KeyDown', handlers.handleF2 as EventListener);
		}
		if (handlers.handleF7) {
			window.addEventListener('gridF7KeyDown', handlers.handleF7 as EventListener);
		}
		if (handlers.handleF8) {
			window.addEventListener('gridF8KeyDown', handlers.handleF8 as EventListener);
		}
		if (handlers.handleF9) {
			window.addEventListener('gridF9KeyDown', handlers.handleF9 as EventListener);
		}
		if (handlers.handleF10) {
			window.addEventListener('gridF10KeyDown', handlers.handleF10 as EventListener);
		}
		if (handlers.handleCtrlF) {
			window.addEventListener('gridCtrlFKeyDown', handlers.handleCtrlF as EventListener);
		}
		if (handlers.handleEnter) {
			window.addEventListener('gridEnterKeyDown', handlers.handleEnter as EventListener);
		}
		if (handlers.handleCtrlP) {
			window.addEventListener('gridCtrlPKeyDown', handlers.handleCtrlP as EventListener);
		}

		return () => {
			if (handlers.handleF2) {
				window.removeEventListener('gridF2KeyDown', handlers.handleF2 as EventListener);
			}
			if (handlers.handleF7) {
				window.removeEventListener('gridF7KeyDown', handlers.handleF7 as EventListener);
			}
			if (handlers.handleF8) {
				window.removeEventListener('gridF8KeyDown', handlers.handleF8 as EventListener);
			}
			if (handlers.handleF9) {
				window.removeEventListener('gridF9KeyDown', handlers.handleF9 as EventListener);
			}
			if (handlers.handleF10) {
				window.removeEventListener('gridF10KeyDown', handlers.handleF10 as EventListener);
			}
			if (handlers.handleCtrlF) {
				window.removeEventListener('gridCtrlFKeyDown', handlers.handleCtrlF as EventListener);
			}
			if (handlers.handleEnter) {
				window.removeEventListener('gridEnterKeyDown', handlers.handleEnter as EventListener);
			}
			if (handlers.handleCtrlP) {
				window.removeEventListener('gridCtrlPKeyDown', handlers.handleCtrlP as EventListener);
			}
		};
	}, [keyCombo, targetRef]);

	return handlers;
}

/**
 * 그리드 DOM 요소 가져오기
 * @param auiGridRef - AUIGrid 객체
 * @param gridRef
 * @returns 그리드 DOM 요소
 */
const getGridDOMElement = (gridRef: any) => {
	if (!gridRef?.current) {
		return null;
	}

	// AUIGrid 객체에서 실제 DOM 요소 가져오기
	const gridId = gridRef.current.state?.id;

	if (gridId) {
		return document.querySelector(`#${gridId}`);
	}

	return null;
};

/**
 * 같은 그리드인지 확인
 * @param event - 그리드 이벤트
 * @param targetRef - AUIGrid 객체
 * @returns 같은 그리드인지 확인
 */
const isCheckSameGrid = (event: CustomEvent, targetRef: React.RefObject<any>) => {
	if (targetRef?.current) {
		const gridDOMElement = getGridDOMElement(targetRef);
		const eventGridElement = event.detail.gridElement;
		return gridDOMElement === eventGridElement;
	}
};

/**
 * ref가 있다면 이벤트와 해당 그리드가 연관된지 확인 후 콜백 실행
 * ref가 없다면 모든 그리드에서 콜백 실행
 * @param event
 * @param targetRef
 * @param callback
 */
const callbackBySameGrid = (
	event: CustomEvent,
	callback: (event?: KeyboardEvent) => void,
	targetRef: React.RefObject<any>,
) => {
	if (targetRef?.current) {
		if (isCheckSameGrid(event, targetRef)) {
			callback();
		}
	} else {
		callback();
	}
};
