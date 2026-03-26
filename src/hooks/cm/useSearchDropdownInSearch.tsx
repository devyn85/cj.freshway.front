/*
 ############################################################################
 # File			: useSearchDropdown.ts
 # Description	: 드롭다운 검색 공통 Hook
 # Author		: 
 # Since			: 2025.01.xx
 ############################################################################
*/

import { useEffect, useState } from 'react';

interface DropdownColumn<T> {
	key: keyof T;
	title: string;
	className?: string;
}

interface FieldMapping {
	targetField: string;
	sourceField: string;
	format?: 'code' | 'name' | 'codeName' | 'custom';
	customFormat?: (item: any) => string;
}

interface UseSearchDropdownConfig<T> {
	columns: Array<DropdownColumn<T>>;
	form: any;
	name: string;
	code: string;
	returnValueFormat?: string;
	callBack?: any;
}

interface UseSearchDropdownReturn<T> {
	dropdownOpen: boolean;
	setDropdownOpen: (open: boolean) => void;
	dropdownData: T[];
	setDropdownData: (data: T[]) => void;
	handleDropdownClick: (item: T) => void;
}

const useSearchDropdownInSearch = <T extends Record<string, any>>(
	config: UseSearchDropdownConfig<T>,
): UseSearchDropdownReturn<T> => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropdownData, setDropdownData] = useState<T[]>([]);

	/**
	 * 드롭다운 항목 클릭 핸들러
	 * @param {object} item 클릭한 드롭다운 항목
	 */
	const handleDropdownClick = (item: T) => {
		const { form, name, code, returnValueFormat, callBack } = config;

		// 기본 필드 설정
		const fieldsToSet: Record<string, any> = {};

		if (returnValueFormat === 'code') {
			fieldsToSet[name] = item.code;
			fieldsToSet[code] = item.code;
		} else {
			fieldsToSet[name] = commUtil.convertCodeWithName(item.code, item.name);
			fieldsToSet[code] = item.code;
		}

		form.setFieldsValue(fieldsToSet);
		setDropdownOpen(false);

		if (typeof callBack === 'function') {
			callBack([item]);
		}
	};

	/**
	 * 외부 클릭 감지하여 드롭다운 닫기
	 */
	useEffect(() => {
		const handleClickOutside = (e: any) => {
			if (e.target?.id !== 'dropdownTable' && e.target?.className !== 'dropdown-content') {
				if (config.form) {
					// config.form.resetFields();
				}
				setDropdownOpen(false);
			}
		};

		if (dropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [dropdownOpen, config.form]);

	return {
		dropdownOpen,
		setDropdownOpen,
		dropdownData,
		setDropdownData,
		handleDropdownClick,
	};
};

export default useSearchDropdownInSearch;
export type { DropdownColumn, FieldMapping, UseSearchDropdownConfig };
