import { useCallback, useState } from 'react';

/**
 * 토글 상태 관리 훅
 * @param initialValue - 초기 상태
 * @returns {object} - 토글 상태 관리 함수
 * @returns {boolean} value - 토글 상태
 * @returns {Function} setValue - 토글 상태 설정 함수
 * @returns {Function} open - 토글 상태 열기 함수
 * @returns {Function} close - 토글 상태 닫기 함수
 * @returns {Function} toggle - 토글 상태 토글 함수
 */
export function useToggle(initialValue = false) {
	const [value, setValue] = useState<boolean>(initialValue);

	const toggle = useCallback(() => {
		setValue(prev => !prev);
	}, []);

	const close = useCallback(() => {
		setValue(false);
	}, []);

	const open = useCallback(() => {
		setValue(true);
	}, []);

	return { value, toggle, close, open, setValue };
}
