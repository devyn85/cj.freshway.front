import { useEffect, useState } from 'react';

export const usePersistedTabStateOnPage = <T extends string>(
	storageKey: string,
	defaultValue: T,
	validValues: T[],
): [T, (value: T) => void] => {
	const getInitialValue = (): T => {
		try {
			const savedValue = localStorage.getItem(storageKey);
			if (savedValue && validValues.includes(savedValue as T)) {
				return savedValue as T;
			}
		} catch (error) {
			console.warn(`localStorage에서 ${storageKey} 정보를 가져오는데 실패했습니다:`, error);
		}
		return defaultValue;
	};

	const [value, setValue] = useState<T>(getInitialValue);

	const setPersistedValue = (newValue: T) => {
		setValue(newValue);
		try {
			localStorage.setItem(storageKey, newValue);
		} catch (error) {
			console.warn(`localStorage에 ${storageKey} 정보를 저장하는데 실패했습니다:`, error);
		}
	};

	useEffect(() => {
		const savedValue = getInitialValue();
		setValue(savedValue);
	}, []);

	return [value, setPersistedValue];
};
