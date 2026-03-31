import React, { createContext, useCallback, useContext, useState } from 'react';

interface OrderSelectionContextType {
	// 미배차 목록 선택 상태
	unassignedSelectedIds: Set<string>;
	setUnassignedSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
	unassignedLastClickedIndex: number | null;
	setUnassignedLastClickedIndex: React.Dispatch<React.SetStateAction<number | null>>;

	// 반품 목록 선택 상태
	returnSelectedIds: Set<string>;
	setReturnSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
	returnLastClickedIndex: number | null;
	setReturnLastClickedIndex: React.Dispatch<React.SetStateAction<number | null>>;

	// 선택 초기화
	clearAllSelections: () => void;
	clearUnassignedSelections: () => void;
	clearReturnSelections: () => void;
}

const OrderSelectionContext = createContext<OrderSelectionContextType | null>(null);

export const OrderSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [unassignedSelectedIds, setUnassignedSelectedIds] = useState<Set<string>>(new Set());
	const [unassignedLastClickedIndex, setUnassignedLastClickedIndex] = useState<number | null>(null);

	const [returnSelectedIds, setReturnSelectedIds] = useState<Set<string>>(new Set());
	const [returnLastClickedIndex, setReturnLastClickedIndex] = useState<number | null>(null);

	const clearAllSelections = useCallback(() => {
		setUnassignedSelectedIds(new Set());
		setReturnSelectedIds(new Set());
		setUnassignedLastClickedIndex(null);
		setReturnLastClickedIndex(null);
	}, []);

	const clearUnassignedSelections = useCallback(() => {
		setUnassignedSelectedIds(new Set());
		setUnassignedLastClickedIndex(null);
	}, []);

	const clearReturnSelections = useCallback(() => {
		setReturnSelectedIds(new Set());
		setReturnLastClickedIndex(null);
	}, []);

	return (
		<OrderSelectionContext.Provider
			value={{
				unassignedSelectedIds,
				setUnassignedSelectedIds,
				unassignedLastClickedIndex,
				setUnassignedLastClickedIndex,
				returnSelectedIds,
				setReturnSelectedIds,
				returnLastClickedIndex,
				setReturnLastClickedIndex,
				clearAllSelections,
				clearUnassignedSelections,
				clearReturnSelections,
			}}
		>
			{children}
		</OrderSelectionContext.Provider>
	);
};

export const useOrderSelection = () => {
	const context = useContext(OrderSelectionContext);
	if (!context) {
		throw new Error('useOrderSelection must be used within OrderSelectionProvider');
	}
	return context;
};

export const useOrderSelectionOptional = () => {
	return useContext(OrderSelectionContext);
};
