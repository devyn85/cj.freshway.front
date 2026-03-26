import { useCallback, useReducer } from 'react';

// 간단한 reducer - setState처럼 동작
function stateReducer<T>(state: T, newState: Partial<T> | ((prevState: T) => Partial<T>)): T {
	if (typeof newState === 'function') {
		return { ...state, ...newState(state) };
	}
	return { ...state, ...newState };
}

// useState처럼 사용할 수 있는 useStateReducer
export function useStateReducer<T>(initialState: T) {
	const [state, dispatch] = useReducer(stateReducer<T>, initialState);

	const setState = useCallback((newState: Partial<T> | ((prevState: T) => Partial<T>)) => {
		dispatch(newState);
	}, []);

	return [state, setState] as const;
}
