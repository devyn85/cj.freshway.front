import dateUtil from '@/util/dateUtil';
import React from 'react';

class dataTransform extends React.Component {
	static makeMenuUrl(menuUrl: string) {
		return menuUrl.slice(0, -5);
	}

	static makeTreeMenuData(dataSet: any, upperKey = 'upperMenuId', upperValue: any = null, compareKey = 'menuId') {
		// 최상위 메뉴를 필터링
		const rootMenuList = dataSet.filter((data: any) => !dataSet.some((d: any) => data[upperKey] === d[compareKey]));

		const createMenuTree = (dataSet: any, upperKey = 'upperMenuId', upperValue: any = null, compareKey = 'menuId') => {
			const currentList = dataSet.filter((data: any) => data[upperKey] === upperValue);
			return currentList.map((data: any) => {
				// 자식 데이터를 재귀적으로 탐색하여 트리 구조 생성
				const currentChildren = createMenuTree(dataSet, upperKey, data[compareKey], compareKey);
				if (currentChildren.length > 0) {
					return {
						...data,
						// AUI 사용 시
						children: currentChildren,
						// TUI 사용 시
						// _attributes: { expanded: true },
						// _children: currentChildren,
					};
				} else {
					return {
						...data,
					};
				}
			});
		};

		// 최상위 메뉴에 대해 createMenuTree 함수 호출
		return rootMenuList.map((rm: any) => {
			const children = createMenuTree(dataSet, upperKey, rm[compareKey], compareKey);
			return {
				...rm,
				// AUI 사용 시
				children,
				// TUI 사용 시
				_attributes: { expanded: true },
				_children: children,
			};
		});
	}

	/**
	 * TUI list Item format으로 변환
	 * @param {Array} data 변환 대상 list
	 * @param {string} textKey text key
	 * @param {string} valueKey value key
	 * @returns {Array} TUI list item format으로 변환
	 */
	static convert2Tui = (data: Array<any>, textKey = 'cdNm', valueKey = 'comCd') => {
		return data.map(m => {
			return {
				text: m[textKey],
				value: m[valueKey],
			};
		});
	};

	/**
	 * Antd list Item format으로 변환
	 * @param {Array} data 변환 대상 list
	 * @param {string} textKey text key
	 * @param {string} valueKey value key
	 * @returns {Array} Antd list item format으로 변환
	 */
	static convert2Antd = (data: Array<any>, textKey = 'cdNm', valueKey = 'comCd') => {
		return data?.map(m => {
			return {
				label: m[textKey],
				value: m[valueKey],
			};
		});
	};

	/**
	 * 검색 데이터 날짜값 변경
	 * @param {Array<any>} data 검색조건 data
	 * @returns {Array<any>} Dayjs format data를 문자열로 변환한 검색조건 data
	 */
	static convertSearchData(data: any) {
		const cloneData: any = {};
		Object.keys(data).forEach((key: any) => {
			if (dateUtil.isDayjs(data[key])) {
				return (cloneData[key] = dateUtil.setDate(data[key], 'YYYY-MM-DD'));
			} else {
				return (cloneData[key] = data[key]);
			}
		});
		return cloneData;
	}

	/**
	 * 사용자지정 format으로 data를 변환
	 * @param {Array} data 			변경 대상 data
	 * @param {string} oldKey 		변경 대상 key
	 * @param {string} oldValue 	변경 대상 value
	 * @param {string}newKey 		변경할 key
	 * @param {string}newValue 	변경할 value
	 * @returns {Array}	변환된 data
	 */
	static convertDataForm = (data: Array<any>, oldKey: any, oldValue: any, newKey: any, newValue: any) => {
		return data.map(m => {
			const obj: any = { ...m };
			obj[newKey] = m[oldKey];
			obj[newValue] = m[oldValue];
			return obj;
		});
	};
}

export default dataTransform;
