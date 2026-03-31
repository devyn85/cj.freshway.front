import { useKeydown } from '@/hooks/useKeydown';
import { useEffect, useState } from 'react';

interface UseModalReturn {
	isOpen: boolean;
	isView: boolean;
	handlerOpen: () => void;
	handlerClose: () => void;
	getIsOpen: () => boolean;
}

export const useModal = (): UseModalReturn => {
	const [isOpen, setIsOpen] = useState(false);
	const [isView, setView] = useState(false);

	const handlerOpen = () => {
		setIsOpen(true);
	};

	const handlerClose = () => {
		setIsOpen(false);
	};

	const getIsOpen = () => {
		return isOpen;
	};

	useKeydown({ key: 'Escape' }, handlerClose);

	useEffect(() => {
		setView(isOpen);
	}, [isOpen]);

	return {
		isOpen,
		isView,
		handlerOpen,
		handlerClose,
		getIsOpen,
	};
};
