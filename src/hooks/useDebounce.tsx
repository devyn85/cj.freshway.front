import { useCallback, useRef } from 'react';

export const useDebounce = () => {
	//timeout을 clear 해주기 위해 ref에 Timer를 저장
	const schedule = useRef<any>(null);

	//함수를 받아 새로운 함수를 반환해주는 currying 구조의 함수를 반환하고 있다.
	return useCallback(
		(callback: (...arg: any) => void, delay: number /*ms*/) =>
			(...arg: any) => {
				//함수가 호출되면 기존 timeout을 초기화하고 새로운 timeout을 생성한다.
				clearTimeout(schedule.current);
				schedule.current = setTimeout(() => callback(...arg), delay);
			},
		[],
	);
};
