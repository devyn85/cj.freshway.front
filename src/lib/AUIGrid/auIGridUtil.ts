/*
 ############################################################################
 # FiledataField	: SingleGridSample.tsx
 # Description		: 단일 그리드 샘플 
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Libs
import '@/lib/AUIGrid/AUIGrid';
import '@/lib/AUIGrid/AUIGridLicense';
import i18n, { t } from 'i18next';

// Store
import { getTranslationList } from '@/store/core/translationStore';

// Util
import dateUtils from '@/util/dateUtil';
import { getSearchPopupApiFunction, getSearchPopupDropdownConfig } from '@/util/searchPopupConfigUtil';

//그리드 기본속성
const defProps = {
	headerHeight: 22, // 헤더높이
	rowHeight: 22, // 행높이
	footerHeight: 22, // 푸터높이
	selectionMode: 'multipleCells', // 셀/행 선택모드 (셀선택모드)
	// editBeginMode: 'click', // 편집모드 진입 방법 (doubleClick, click)
	noDataMessage: i18n.t('msg.MSG_COM_ERR_053'),
	blankToNullOnEditing: true, // 수정할 때 사용자가 입력한 빈 값("")을 명시적인 null 로 처리할지 여부를 지정
	enableMovingColumn: true, // 칼럼 헤더를 드래그앤드랍으로 자리를 옮기는 기능 활성화 여부를 지정합니다.
	enableSelectionAll: true, // 모든 셀 선택 기능 활성화 여부를 지정합니다.
	keepEditing: true, // 다음 셀이 바로 수정 가능한 상태로 입력 창이 열리게 됩니다.
	onlyEnterKeyEditEnd: false, // 엔터 키로만 편집 종료 여부
	nullsLastOnSorting: false, // 정렬(sorting) 할 때 빈값(undefined, null, "")에 해당되는 값은 오름차순, 내림차순과 관계 없이 항상 아래에 위치시킬지 여부를 지정합니다.
	rowNumColumnWidth: 54, // row 번호 칼럼 넓이
	// 그리드 컨텍스트 메뉴 관련 속성
	enableFilter: true,
	useContextMenu: true,
	// enableRightDownFocus: false, // 오른쪽 클릭 시 포커스 적용 여부 ( 기본값 : false )
	searchByFormatValue: true, // 그리드 검색 기능을 실행 할 때 포매팅된 값을 대상으로 검색을 실행할지 여부를 지정합니다.
	// liveVScrolling: false,
	// liveHScrolling: false,

	//////////////////// 커스텀 ////////////////////
	useCtrlF: true, // Ctrl + F 가능 여부
	useF2: true, // F2 가능 여부
	useF7: true, // F7 가능 여부
	useF8: true, // F8 가능 여부
	useF9: true, // F9 가능 여부
	useF10: true, // F10 가능 여부
	useCtrlA: true, // Ctrl + A 가능 여부
	useCtrlZ: true, // Ctrl + Z 가능 여부
	useCtrlP: true, // Ctrl + P 가능 여부
	useCtrlC: true, // Ctrl + C 가능 여부
	useCtrlV: true, // Ctrl + V 가능 여부

	isLegacyRemove: false, // 기존 조회된 DATA 삭제 유무
	multiSortingKey: 'ctrlKey', // 다중 정렬 키 (기본값 : shiftKey ), AS-IS가 ctrl로 되어있어서 변경
	isRestore: true, // "restoreEditedRows" 행 복구 사용 여부
	showCustomRowCheckColumn: false, // 커스텀 엑스트라 행 체크박스 출력 여부
	customRowCheckColumnDataField: 'customRowCheckYn',
	customRowCheckColumnCheckValue: 'Y',
	customRowCheckColumnUnCheckValue: 'N',
};

type gridStateItem = {
	fixedColumnCount: number;
	fixedRowCount: number;
	sortingInfo: Array<{ dataField: string; sortType: number }>; // 정렬 정보 추가
	columnOrderList: string[]; // 칼럼 순서 정보 추가
	hiddenColumnList: string[]; // 숨겨진 컬럼 정보 추가
};

type filterStateItem = {
	originHasFilterList: any[];
	showFilterType: 'all' | 'origin' | 'none';
};

/**
 * 그리드 상태 관리 - 메모리에만 저장되지만, 로컬스토리지에 save & load 될 수 있음
 */
const gridStateInMemory = new Map<string, gridStateItem>();

const initGridStateItem: gridStateItem = {
	fixedColumnCount: 0,
	fixedRowCount: 0,
	sortingInfo: [],
	columnOrderList: [],
	hiddenColumnList: [],
};

/**
 * 필터 상태 관리 - 로컬스토리지에 저장 x ( 메모리에만 저장 )
 * @param originHasFilterList: 기준 항목 필터 아이콘 표시
 * @param showFilterType: 'all' | 'origin' | 'none'
 * - all: 모든 컬럼에 필터 아이콘 표시
 * - origin: 기준 항목 필터 아이콘 표시
 * - none: 필터 아이콘 숨기기
 */
const filterStateInMemory = new Map<string, filterStateItem>();

const initFilterStateItem: filterStateItem = {
	originHasFilterList: [],
	showFilterType: 'none',
};

let lastClickTime = 0; // 마지막 클릭 시간 저장
const doubleClickDelay = 300; // 300ms 이내 두 번 클릭 시 더블클릭으로 간주

/**
 * 그리드 별 필터 상태 조회
 * @param grid 그리드
 * @returns 그리드 별 필터 상태
 */
const getFilterStateInMemoryByGridKey = (grid: any) => {
	return filterStateInMemory.get(getGridKey(grid)) || initFilterStateItem;
};

/**
 * 기준 항목 필터 아이콘 표시
 * @param grid
 */
const showFilterOriginHasFilterList = (grid: any) => {
	const filterStateInMemoryByGridKey = getFilterStateInMemoryByGridKey(grid);

	filterStateInMemory.set(getGridKey(grid), {
		...filterStateInMemoryByGridKey,
		showFilterType: 'origin',
	});

	const originHasFilterList = filterStateInMemoryByGridKey.originHasFilterList;
	originHasFilterList.forEach((column: any) => {
		grid.setColumnPropByDataField(column.dataField, {
			...column,
			filter: {
				showIcon: true,
			},
		});
	});
};

/**
 * 모든 컬럼에 필터 아이콘 숨기기
 * @param grid
 */
const hideFilterAllColumn = (grid: any) => {
	const filterStateInMemoryByGridKey = getFilterStateInMemoryByGridKey(grid);

	filterStateInMemory.set(getGridKey(grid), {
		...filterStateInMemoryByGridKey,
		showFilterType: 'none',
	});

	const columnInfoList = grid.getColumnInfoList();

	columnInfoList.forEach((column: any) => {
		grid.setColumnPropByDataField(column.dataField, {
			...column,
			filter: undefined,
		});
	});
};

/**
 * 모든 컬럼에 필터 아이콘 표시
 * @param grid
 */
const showFilterAllColumn = (grid: any) => {
	const filterStateInMemoryByGridKey = getFilterStateInMemoryByGridKey(grid);

	filterStateInMemory.set(getGridKey(grid), {
		...filterStateInMemoryByGridKey,
		showFilterType: 'all',
	});

	// 모든 컬럼에 필터 아이콘 표시
	const columnInfoList = grid.getColumnInfoList();
	columnInfoList.forEach((column: any) => {
		// 필터가 가능한 컬럼만 필터 아이콘 표시
		if (column.enableFilter !== false) {
			/**
			 * 필터 설정
			 * @param column
			 * @returns
			 */
			const initFilterSetting = (column: any) => {
				return {
					showIcon: true,
					enableFilter: true,
					displayFormatValues: true,
				};
			};
			// 컬럼 설정에 filter 속성 추가
			grid.setColumnPropByDataField(column.dataField, {
				...column,
				filter: initFilterSetting(column),
			});
		}
	});
};

/**
 * 모든 그리드 요소 조회
 * @returns
 */
export function getAllGridElement() {
	const allGrids = document.querySelectorAll('.aui-grid-wrap');
	return allGrids;
}

/**
 * 그리드 식별자를 포함하여 그리드 키 가져오기
 * @description 같은 URL 내에서 그리드 식별자를 가져옴
 * @param grid
 * @returns
 */
function getGridKey(grid: any) {
	const getGridIdentifier = (grid: any): string => {
		// grid나 grid.state가 없는 경우 기본값 반환
		if (!grid || !grid.state || !grid.state.id) {
			return 'grid_0';
		}

		// 1. DOM 요소의 위치로 구분 (페이지 내 몇 번째 그리드인지)
		const gridElement = document.querySelector(`#${grid.state.id}`);

		if (gridElement) {
			const allGrids = getAllGridElement();
			const gridIndex = Array.from(allGrids).indexOf(gridElement);
			return `grid_${gridIndex}`;
		}

		// 2. 기본값
		return 'grid_0';
	};

	const currentURL = window.location.pathname;
	const gridIdentifier = getGridIdentifier(grid);
	return `${currentURL}_${gridIdentifier}`;
}

/**
 * 그리드 상태 관리 - 로컬스토리지에 그리드 상태 저장
 * @param newGridState
 */
const saveGridStateInLocalStorage = (newGridState: any) => {
	localStorage.setItem('gridState', JSON.stringify(newGridState));
};

/**
 * 그리드 상태 관리 - 로컬스토리지에서 그리드 상태 조회
 */
const getGridStateInLocalStorage = () => {
	const originGridState = localStorage.getItem('gridState');
	return JSON.parse(originGridState) || {};
};

/**
 * 그리드 상태 관리 - 메모리에 저장된 그리드 상태 조회
 * @param gridKey
 * @param grid
 * @returns
 */
const getGridKeyItemByGridStateInMemory = (gridKey: string, grid: any) => {
	const initGridStateItemTmp = {
		...initGridStateItem,
		fixedColumnCount: grid?.getProp('fixedColumnCount') || 0,
		fixedRowCount: grid?.getProp('fixedRowCount') || 0,
	};

	// 커스텀 엑스트라 체크박스일 경우 fixedColumnCount + 1 처리
	// if (grid?.props?.gridProps?.['showCustomRowCheckColumn']) {
	// 	initGridStateItemTmp['fixedColumnCount'] = initGridStateItemTmp['fixedColumnCount'] + 1;
	// 	initGridStateItemTmp['fixedRowCount'] = initGridStateItemTmp['fixedRowCount'] + 1;
	// }

	const gridStateInMemoryByGridKey = gridStateInMemory.get(gridKey) || initGridStateItemTmp;

	const { fixedColumnCount, fixedRowCount, sortingInfo, columnOrderList, hiddenColumnList } =
		gridStateInMemoryByGridKey;

	return {
		fixedColumnCount,
		fixedRowCount,
		sortingInfo,
		columnOrderList,
		hiddenColumnList,
	};
};

/**
 * 그리드 상태 관리 - 로컬스토리지에 그리드 상태 저장
 * @param grid
 */
function saveGridState(grid: any) {
	const gridKey = getGridKey(grid);

	const { fixedColumnCount, fixedRowCount, sortingInfo, columnOrderList, hiddenColumnList } =
		getGridKeyItemByGridStateInMemory(gridKey, grid);

	// 다른 페이지에도 저장된 그리드 상태를 가져옴, 왜냐하면 저장 시, 현재 페이지에 저장된 그리드 상태를 덮어쓰기 하기 때문
	const otherPageGridState = getGridStateInLocalStorage();

	const newGridState = {
		...(otherPageGridState || {}),
		[gridKey]: {
			fixedColumnCount,
			fixedRowCount,
			// sortingInfo,
			columnOrderList,
			hiddenColumnList,
		},
	};

	saveGridStateInLocalStorage(newGridState);
}

/**
 * 그리드 상태 초기화 - 메모리와 로컬스토리지 모두 초기화
 * @param grid
 */
function resetGridState(grid: any) {
	const gridKey = getGridKey(grid);
	const originGridState = getGridStateInLocalStorage();

	const newGridState = { ...originGridState };

	delete newGridState[gridKey];

	if (Object.keys(newGridState).length > 0) {
		saveGridStateInLocalStorage(newGridState);
	} else {
		localStorage.removeItem('gridState');
	}

	gridStateInMemory.set(getGridKey(grid), initGridStateItem);

	resetGridStateInMemory(grid);
	// resizeColumnGrid(grid);
}

const resetGridStateInMemory = (grid: any) => {
	// const originColumnOrderList = grid.props.columnLayout?.map((col: any) => col.dataField);
	const originColumnOrderList = grid.getColumnLayout().map((col: any) => col.dataField);

	// 커스텀 엑스트라 체크박스 있을 경우
	// if (grid.props.gridProps?.['showCustomRowCheckColumn']) {
	// 	originColumnOrderList.unshift(grid.getProp('customRowCheckColumnDataField'));
	// }

	const visibleFalseColumnList: string[] = [];
	const collectVisibleColumns = (columns: any[]) => {
		for (const item of columns) {
			// 숨김 칼럼 추가
			if (item.visible === false) {
				visibleFalseColumnList.push(item.dataField);
			}

			// 자식 칼럼도 체크
			if (item.children && item.children.length > 0) {
				collectVisibleColumns(item.children);
			}
		}
	};
	collectVisibleColumns(grid.props.columnLayout);

	grid.setFixedColumnCount(0);
	grid.setFixedRowCount(0);
	grid.showAllColumns();
	grid.hideColumnByDataField(visibleFalseColumnList);
	grid.clearSortingAll();
	grid.setColumnOrder(originColumnOrderList);
	grid.clearFilterAll();
	grid.clearSelection();

	hideFilterAllColumn(grid);
};

/**
 * 각 페이지별로 칼럼 너비를 지정하는 경우가 있어, [ 숨긴 컬럼 해제 ] 하더라도 보이지 않는 문제가 발생함.
 *
 * 해당 함수를 사용하여 칼럼 너비를 재지정한다.
 * @param grid
 */
const resizeColumnGrid = (grid: any) => {
	const colSizeList = grid.getFitColumnSizeList(true);
	grid.setColumnSizeList(colSizeList);
};

/**
 * 그리드 상태 관리 - 로컬스토리지에서 페이지별(Static URL) 그리드 상태 조회
 * @param grid
 */
export function loadGridStateByStaticUrl(grid: any) {
	const gridKey = getGridKey(grid);

	const originGridStateItemByGridKey = getGridStateInLocalStorage()[gridKey];

	// 로컬스토리지에서 가져온 데이터가 있을 때만 메모리에 저장
	if (originGridStateItemByGridKey) {
		gridStateInMemory.set(gridKey, originGridStateItemByGridKey);
	}

	const { fixedColumnCount, fixedRowCount, columnOrderList, hiddenColumnList, sortingInfo } =
		getGridKeyItemByGridStateInMemory(gridKey, grid);

	grid.setFixedColumnCount(fixedColumnCount);
	grid.setFixedRowCount(fixedRowCount);
	grid.setColumnOrder(columnOrderList);

	grid.hideColumnByDataField(hiddenColumnList);

	// if (commUtil.isNotEmpty(sortingInfo)) {
	// 	grid.setSorting(sortingInfo);
	// }
}

/**
 * 동적 ContextMenu 아이템 생성 함수
 * @param {any} grid AUIGrid 인스턴스
 * @param {any} event contextMenu 이벤트 (null일 수 있음)
 * @returns {Array} 동적으로 생성된 contextMenuItems
 */
function createDynamicContextMenuItems(grid: any, event: any) {
	/**
	 * 선택된 셀 리스트 ( 선택된 셀이 없을 수 있음 )
	 */
	const selectedCells = grid.getSelectedItems() || [];

	/**
	 * 선택된 셀 개수
	 */
	const selectedCellCount = selectedCells.length;

	/**
	 * 선택된 셀의 컬럼 데이터 필드 리스트 ( 중복 제거 )
	 */
	const selectedColumnDataFieldList = [...new Set(selectedCells.map((cell: any) => cell.dataField))] as string[];

	/**
	 * 컨텍스트 메뉴 셀의 정보
	 */
	const contextMenuCell = event
		? {
				rowIndex: event.rowIndex,
				columnIndex: event.columnIndex,
				dataField: event.dataField,
				value: event.value,
				item: event.item,
		  }
		: null;

	const gridKey = getGridKey(grid);
	const gridStateInMemoryByGridKey = gridStateInMemory.get(gridKey) || initGridStateItem;

	/**
	 * 모든 컬럼 정보 리스트
	 */
	const gridColumnInfoList = grid.getColumnInfoList();

	/**
	 * 컨텍스트 메뉴 셀의 컬럼 정보
	 */
	const gridColumnItemByContextMenuCell = grid.getColumnItemByDataField(contextMenuCell?.dataField);

	/**
	 * 숨긴 컬럼 데이터 필드 명 리스트
	 */
	const hiddenColumnKeyList: string[] = grid.getHiddenColumnDataFields();

	/**
	 * 복사 버튼 클릭 시 텍스트 또는 값 복사
	 * @param copyType 복사 타입 (text: 텍스트 복사, value: 값 복사)
	 * @example 숫자형식의 셀에 1,000으로 표시되면 Text 복사 시 1,000, Value 복사 시 1000 으로 복사됨
	 */
	const copyTextOrValue = (copyType: string) => {
		// 원본 복사 타입 저장
		const originalCopyDisplayValue = grid.getProp('copyDisplayValue');

		if (selectedCellCount === 1) {
			grid?.setSelectionByIndex(contextMenuCell?.rowIndex, contextMenuCell?.columnIndex);
		}

		// 복사 타입 설정
		grid.setProp('copyDisplayValue', copyType === 'text' ? true : false);

		const selectedTextOrValue = grid?.getSelectedText();

		// 선택된 텍스트 또는 값 가져오기

		// 클립보드에 복사
		navigator.clipboard.writeText(selectedTextOrValue);

		// 원본 복사 타입 복구
		grid.setProp('copyDisplayValue', originalCopyDisplayValue);
	};

	// 기본 아이템
	const baseItems: any[] = [
		{
			label: '복사(Text)',
			callback: (event: any) => {
				copyTextOrValue('text');
			},
		},
		{
			label: '복사(Value)',
			callback: (event: any) => {
				copyTextOrValue('value');
			},
		},
		{
			label: '_$line',
		},
		{
			label: '행 추가',
			callback: () => {
				// GridTopBtn의 행추가 버튼 클릭 이벤트 발생
				const customEvent = new CustomEvent('gridContextMenuAction', {
					detail: {
						action: 'plus',
						gridId: grid.state.id,
					},
				});
				window.dispatchEvent(customEvent);
			},
		},
		{
			label: '행 삭제',
			callback: () => {
				// GridTopBtn의 행삭제 버튼 클릭 이벤트 발생
				const customEvent = new CustomEvent('gridContextMenuAction', {
					detail: {
						action: 'delete',
						gridId: grid.state.id,
					},
				});
				window.dispatchEvent(customEvent);
			},
		},
		{
			label: '_$line',
		},
		{
			label: '찾기',
			callback: () => {
				grid.openFindPopup();
			},
		},
	];

	const filterStateInMemoryByGridKey = getFilterStateInMemoryByGridKey(grid);

	baseItems.push({
		label: '필터',
		children: [
			{
				label: '필터 초기화',
				callback: () => {
					if (filterStateInMemoryByGridKey?.showFilterType === 'none') {
						return;
					}
					hideFilterAllColumn(grid);
					grid.clearFilterAll();
				},
			},
			...(filterStateInMemoryByGridKey?.originHasFilterList?.length > 0
				? [
						{
							label: `기준 항목 필터 ${filterStateInMemoryByGridKey?.showFilterType === 'origin' ? '(취소)' : ''}`,

							callback: () => {
								switch (filterStateInMemoryByGridKey?.showFilterType) {
									case 'origin':
										hideFilterAllColumn(grid);
										break;
									case 'all':
										hideFilterAllColumn(grid);
										showFilterOriginHasFilterList(grid);

										break;
									case 'none':
										showFilterOriginHasFilterList(grid);
										break;
								}

								grid.refresh();
							},
						},
				  ]
				: []),
			{
				label: `전체 항목 필터 ${filterStateInMemoryByGridKey?.showFilterType === 'all' ? '(취소)' : ''}`,
				callback: () => {
					switch (filterStateInMemoryByGridKey?.showFilterType) {
						case 'origin':
							showFilterAllColumn(grid);
							break;
						case 'all':
							hideFilterAllColumn(grid);
							break;
						case 'none':
							showFilterAllColumn(grid);
							break;
					}

					grid.refresh();
				},
			},
		],
	});

	// event가 있을 때만 숫자 계산 결과 추가 (실제 ContextMenu 클릭 시)
	if (!selectedCellCount || !event?.dataField) {
		return baseItems;
	}

	const { numericCount, sum, avg } = calculateNumericValues(selectedCells);

	// 모든 선택된 항목이 숫자인 경우에만 Sum/Avg 추가 & 선택된 셀이 1개가 아니면 Sum/Avg 추가
	if (numericCount === selectedCellCount && selectedCellCount !== 1) {
		baseItems.unshift(
			{ label: `Count : ${numericCount.toLocaleString()}` },
			{ label: `Sum : ${sum.toLocaleString()}` },
			{ label: `Avg : ${avg.toLocaleString()}` },
		);
	} else {
		baseItems.unshift({ label: `Count : ${selectedCellCount.toLocaleString()}` });
	}

	if (storeUtil.getMenuInfo()?.printYn === '1') {
		baseItems.push({
			label: '엑셀 저장',
			callback: () => {
				if (commUtil.isNotEmpty(grid?.getProp('exportToXlsxGridCustom'))) {
					grid?.getProp('exportToXlsxGridCustom')();
				} else {
					grid.exportToXlsxGrid({
						fileName: `${storeUtil.getMenuInfo().progNm}_${dateUtils.getToDay('YYYYMMDD')}`,
					});
				}
			},
		});
	}

	const hasFixedColumn = gridStateInMemoryByGridKey.fixedColumnCount > 0;
	const hasFixedRow = gridStateInMemoryByGridKey.fixedRowCount > 0;
	const hasFixedColumnAndRow = hasFixedColumn && hasFixedRow;

	baseItems.push({
		label: '틀 고정',
		children: [
			{
				label: `컬럼 고정 ${hasFixedColumn ? '(취소)' : ''}`,
				callback: () => {
					const fixedColumnCount = hasFixedColumn ? 0 : contextMenuCell?.columnIndex;

					grid.setFixedColumnCount(fixedColumnCount);
					gridStateInMemory.set(gridKey, {
						...gridStateInMemoryByGridKey,
						fixedColumnCount: fixedColumnCount,
					});
				},
			},
			{
				label: `행 고정 ${hasFixedRow ? '(취소)' : ''}`,
				callback: () => {
					const fixedRowCount = hasFixedRow ? 0 : contextMenuCell?.rowIndex;

					grid.setFixedRowCount(fixedRowCount);
					gridStateInMemory.set(gridKey, {
						...gridStateInMemoryByGridKey,
						fixedRowCount: fixedRowCount,
					});
				},
			},
			{
				// 컬럼 & 행 - 둘다 고정 or 둘다 해제 처리
				label: `컬럼 & 행 고정 ${hasFixedColumnAndRow ? '(취소)' : ''}`,
				callback: () => {
					const fixedColumnCount = hasFixedColumnAndRow ? 0 : contextMenuCell?.columnIndex;
					const fixedRowCount = hasFixedColumnAndRow ? 0 : contextMenuCell?.rowIndex;

					grid.setFixedColumnCount(fixedColumnCount);
					grid.setFixedRowCount(fixedRowCount);

					gridStateInMemory.set(gridKey, {
						...gridStateInMemoryByGridKey,
						fixedColumnCount: fixedColumnCount,
						fixedRowCount: fixedRowCount,
					});
				},
			},
		],
	});

	baseItems.push({
		label: '_$line', // label 에 _$line 을 설정하면 라인을 긋는 아이템으로 인식합니다.
	});

	/**
	 * 숨김 컬럼 조회 new Set().has() 로 조회
	 */
	const hiddenColumnKeyListToSet = new Set(hiddenColumnKeyList);

	/**
	 * 숨긴 컬럼들 중 헤더 텍스트가 있는 유효한 컬럼들만 조회
	 */
	const validHiddenColumnDataFields = gridColumnInfoList.filter((columnInfo: any) => {
		return hiddenColumnKeyListToSet.has(columnInfo.dataField) ? columnInfo.headerText : null;
	});

	baseItems.push({
		label: '컬럼 설정',
		children: [
			{
				label: '컬럼 숨김',
				callback: () => {
					/**
					 * 컬럼 숨김 처리
					 * @param {string[]} columnDataFieldList 숨김 처리할 컬럼 데이터 필드 리스트
					 */
					const hideColumn = (columnDataFieldList: string[]) => {
						grid.hideColumnByDataField(columnDataFieldList);
						gridStateInMemory.set(gridKey, {
							...gridStateInMemoryByGridKey,
							hiddenColumnList: [...hiddenColumnKeyList, ...columnDataFieldList],
						});
					};

					// 선택된 셀의 컬럼이 2개 이상이면 선택된 컬럼들 모두 숨김
					if (selectedColumnDataFieldList.length > 1) {
						hideColumn(selectedColumnDataFieldList);
						return;
					}

					// 선택된 셀의 컬럼이 1개이면 context menu가 발생한 셀의 컬럼 숨김
					if (contextMenuCell?.dataField) {
						hideColumn([contextMenuCell?.dataField]);
					}
				},
			},
			{
				label: '모든 컬럼 숨김 해제',
				callback: () => {
					grid.showAllColumns();

					gridStateInMemory.set(gridKey, {
						...gridStateInMemoryByGridKey,
						hiddenColumnList: [],
					});

					// 조회된 결과에 맞게 칼럼 넓이를 구한다.
					resizeColumnGrid(grid);
				},
			},
			...(validHiddenColumnDataFields.length > 0
				? [
						{
							label: '_$line',
						},
						...validHiddenColumnDataFields.map((validHiddenColumnDataField: any) => {
							return {
								label: `[${validHiddenColumnDataField.headerText}] 숨김 해제`,
								callback: () => {
									// 컬럼 숨김 해제
									grid.showColumnByDataField(validHiddenColumnDataField.dataField);

									// 메모리 상태 업데이트
									const updatedHiddenList = hiddenColumnKeyList.filter(
										(hiddenColumnKey: string) => hiddenColumnKey !== validHiddenColumnDataField.dataField,
									);

									gridStateInMemory.set(gridKey, {
										...gridStateInMemoryByGridKey,
										hiddenColumnList: updatedHiddenList,
									});

									// 조회된 결과에 맞게 칼럼 넓이를 구한다.
									resizeColumnGrid(grid);
								},
							};
						}),
				  ]
				: []),
		],
	});

	baseItems.push(
		...[
			{
				label: '포맷 저장',
				callback: () => {
					saveGridState(grid);
				},
			},
			{
				label: '포맷 초기화',
				callback: () => {
					resetGridState(grid);
				},
			},
		],
	);

	if (gridColumnItemByContextMenuCell?.dataType === 'manager') {
		if (commUtil.isNotEmpty(contextMenuCell?.item[contextMenuCell?.dataField])) {
			baseItems.push(
				...[
					{
						label: '_$line',
					},
					{
						label: '담당자 - 전화(핸드폰)',
						callback: () => {
							grid.openDialPopup(
								contextMenuCell?.item ? contextMenuCell?.item[gridColumnItemByContextMenuCell?.managerDataField] : '',
								'phone',
							);
						},
					},
					{
						label: '담당자 - 전화(사무실)',
						callback: () => {
							grid.openDialPopup(
								contextMenuCell?.item ? contextMenuCell?.item[gridColumnItemByContextMenuCell?.managerDataField] : '',
								'cotel',
							);
						},
					},
					{
						label: '담당자 - 이메일',
						callback: () => {
							grid.openSendEmailPopup({
								rcvrId: contextMenuCell?.item
									? contextMenuCell?.item[gridColumnItemByContextMenuCell?.managerDataField]
									: '',
								titleName: '이메일 발송',
							});
						},
					},
					{
						label: '담당자 - 문자',
						callback: () => {
							grid.openSendSmsPopup({
								rcvrId: contextMenuCell?.item
									? contextMenuCell?.item[gridColumnItemByContextMenuCell?.managerDataField]
									: '',
								titleName: 'SMS 발송',
							});
						},
					},
					{
						label: '담당자 - Teams대화',
						callback: () => {
							grid.openTeamsPopup({
								rcvrId: contextMenuCell?.item
									? contextMenuCell?.item[gridColumnItemByContextMenuCell?.managerDataField]
									: '',
							});
						},
					},
				],
			);
		}
	}

	return baseItems;
}

/**
 * 숫자 값 유효성 검사
 * @param {any} value 검사할 값
 * @returns {boolean} 유효한 숫자인지 여부
 */
function isValidNumericValue(value: any): boolean {
	return value !== null && value !== undefined && value !== '' && !isNaN(Number(value));
}

/**
 * 선택된 아이템들의 숫자 값 계산
 * @param {Array} selectedItems 선택된 아이템 배열
 * @param selectedCells
 * @returns {object} { numericCount: 숫자 항목 개수, sum: 합계, avg: 평균 }
 */
function calculateNumericValues(selectedCells: any[]) {
	const initValue = {
		numericCount: 0,
		sum: 0,
		avg: 0,
	};

	const selectedCellValues = selectedCells.map(selectedCell => selectedCell?.item[selectedCell?.dataField]);

	if (!selectedCellValues || selectedCellValues.length === 0) {
		return initValue;
	}

	// 선택된 셀들 중 숫자 값만 모아서 배열로 만들고, 해당 배열들을 꺼내서 계산

	const numericValues = selectedCellValues.filter(value => isValidNumericValue(value));

	const numericCount = numericValues.length;

	const sum = numericValues.reduce((acc, value) => acc + Number(value), 0);

	const avg = Number((sum / numericCount).toFixed(2));

	return {
		numericCount,
		sum,
		avg,
	};
}

/**
 * merge props
 * @function adjustProps
 * @param {object} props AUIGrid Props
 * @returns {object} merged props
 */
export function adjustProps(props: object) {
	return { ...defProps, ...props };
}

/**
 * rowStyleFunction 스타일 merge
 * @param {any} _tGrid 타켓 그리드
 * @param {any} _tProps 타켓 그리드 props
 * @param {...any[]} funcs rowStyleFunction function 목록
 * @returns {Function} 스타일이 merge 된 function
 */
function combineRowStyleFunctions(_tGrid: any, _tProps: any, funcs: any[]) {
	return function (rowIndex: any, rowItem: any) {
		let resultClass = '';
		funcs.forEach(fn => {
			const result = fn && fn(rowIndex, rowItem);
			if (commUtil.isNotEmpty(result)) {
				if (commUtil.isNotEmpty(resultClass)) {
					// 적용될 class가 'color-danger' 일 경우 'bg-keyword_color-danger' class로 대체
					// AUI그리드 [ rowStyleFunction ]에서 'bg-keyword color-danger'와 같이 스페이스로 여러개 class 병합하면 해당 class가 중복으로 적용되는 이슈가 있음
					if (result === 'color-danger' || result === 'color-info' || result === 'bg-lavender') {
						resultClass = `${resultClass}-${result}`;
					} else {
						resultClass = `${resultClass} ${result}`; // 스타일 병합
					}
				} else {
					resultClass = result;
				}
			}
		});
		return resultClass;
	};
}

/**
 * merge props
 * @function adjustProps
 * @param {any} props AUIGrid Props
 * @param {any} _tGrid AUIGrid Ref
 * @returns {object} merged props
 */
export function adjustProps2(props: any, _tGrid: any) {
	// 추가/수정 시 Row 배경색 변경
	if (props) {
		props['rowStyleFunction'] = combineRowStyleFunctions(_tGrid, props, [
			// props.rowStyleFunction,
			function (rowIndex: number, item: any) {
				// 커스텀 엑스트라 체크여부에 따라  [ tr ] 태그에 'aui-grid-extra-checked-row' 클래스 추가/삭제
				if (props?.['showCustomRowCheckColumn']) {
					const fixedColumnCount = _tGrid.getProp('fixedColumnCount') || 0;
					const td = _tGrid.getCellElementByIndex(rowIndex, 0);
					const tr = td?.closest('tr');
					let td2: any, tr2: any;
					if (fixedColumnCount > 0) {
						td2 = _tGrid.getCellElementByIndex(rowIndex, fixedColumnCount + 1);
						tr2 = td2?.closest('tr');
					}

					if (
						item[_tGrid.getProp('customRowCheckColumnDataField')] === _tGrid.getProp('customRowCheckColumnCheckValue')
					) {
						// setTimeout(() => {
						tr?.classList?.add('aui-grid-extra-checked-row');
						if (fixedColumnCount > 0) {
							tr2?.classList?.add('aui-grid-extra-checked-row');
						}
						// });
					} else {
						// setTimeout(() => {
						tr?.classList?.remove('aui-grid-extra-checked-row');
						if (fixedColumnCount > 0) {
							tr2?.classList?.remove('aui-grid-extra-checked-row');
						}
						// });
					}
				}

				// // ROW PK 칼럼
				// const rowIdField = props['rowIdField'] ?? '_$uid';

				// // 그리드 내 체크된 ROW 목록
				// const checkedItems = _tGrid.getCheckedRowItems()?.map((row: any) => row.item);

				// // 그리드 내 변경된 ROW 중 삭제된 목록
				// const deleteItems = _tGrid.getChangedData({ validationYn: false })?.filter((chageItem: any) => {
				// 	return chageItem.rowStatus === 'D';
				// });

				// // 체크 목록에서 삭제된 ROW 제외한 목록
				// const filterItems = checkedItems?.filter(
				// 	(item: any) => !deleteItems?.some((del: any) => del[rowIdField] === item[rowIdField]),
				// );

				// // 삭제된 ROW 제외 목록중 현재 ROW가 있는지 체크
				// const filterArr = filterItems?.filter((chageItem: any) => {
				// 	return chageItem[rowIdField] === item[rowIdField];
				// });

				// // Row 체크 상태에 따라 배경색 변경 (삭제는 제외)
				// if (filterArr.length > 0) {
				// 	return 'bg-keyword';
				// } else {
				// 	return '';
				// }
			},
			props.rowStyleFunction,
		]);
	}

	// 기본 ContextMenu 아이템 설정 (한 곳에서 관리)
	// showStateColumn 강제로 false 처리
	const mergedProps = { ...defProps, ...props, ...{ showStateColumn: false } };
	mergedProps.contextMenuItems = createDynamicContextMenuItems(_tGrid, null);

	// 커스텀 엑스트라 체크박스 노출시 기존 엑스트라 체크박스 비노출
	if (mergedProps?.['showCustomRowCheckColumn']) mergedProps['showRowCheckColumn'] = false;

	return mergedProps;
}

/**
 * merge column conf.
 * @param {any} grid AUIGrid Ref
 * @param {Array} colModel column conf.
 * @param {any} opts 그리드 옵션
 * @param {boolean} isSub 자식 헤더
 * @returns {Array} merged column conf.
 */
export function adjustColModel(colModel: any, grid?: any, opts?: any, isSub?: boolean) {
	// 커스텀 체크박스 칼럼 추가
	if (opts?.['showCustomRowCheckColumn'] && !isSub) {
		// 이미 칼럼이 있을 경우 추가 방지
		const exists = colModel.some(
			(col: any) =>
				col['dataField'] ===
				(opts?.['customRowCheckColumnDataField'] || grid?.getProp('customRowCheckColumnDataField')),
		);
		if (!exists) {
			colModel.unshift({
				editable: true,
				dataField: opts?.['customRowCheckColumnDataField'] || grid?.getProp('customRowCheckColumnDataField'),
				headerText: '',
				width: '30',
				style: 'custom-extra-checkbox',
				commRenderer: {
					type: 'checkBox',
					checkValue: opts?.['customRowCheckColumnCheckValue'] || grid?.getProp('customRowCheckColumnCheckValue'),
					unCheckValue: opts?.['customRowCheckColumnUnCheckValue'] || grid?.getProp('customRowCheckColumnUnCheckValue'),
					disabledFunction: (rowIndex: number, columnIndex: number, value: any, isChecked: boolean, item: any) => {
						if (opts?.['rowCheckDisabledFunction']) {
							return !opts?.['rowCheckDisabledFunction'](rowIndex, isChecked, item);
						} else {
							return false;
						}
					},
					// visibleFunction: (rowIndex: number, columnIndex: number, value: any, isChecked: boolean, item: any) => {
					// 	if (opts?.['rowCheckVisibleFunction']) {
					// 		return opts?.['rowCheckVisibleFunction'](rowIndex, isChecked, item);
					// 	} else {
					// 		return true;
					// 	}
					// },
				},
				headerRenderer: {
					type: 'CheckBoxHeaderRenderer',
					dependentMode: true,
					onClick: (event: any) => {
						// "rowAllCheckClick" 이벤트 강제로 호출
						grid?.bindCall('rowAllCheckClick', event.checked);

						// 커스텀 전체 체크박스 해제일 경우
						if (!event.checked) {
							uncheckedAllRowAction(grid, opts);
						}

						// "rowCheckDisabledFunction" 대응
						if (opts?.['rowCheckDisabledFunction']) {
							const allData = grid?.getOrgGridData();
							const ret = [];
							const rowIdField = grid?.getProp('rowIdField') || '_$uid';
							for (const i in allData) {
								const rowCheckDisabled = !opts?.['rowCheckDisabledFunction'](Number(i), true, allData[i]);
								if (rowCheckDisabled) {
									ret.push(allData[i][rowIdField]);
								}
							}
							grid?.addUncheckedRowsByIdsBefore(ret);
						}
					},
				},
			});
		}
	}

	for (const i in colModel) {
		if (commUtil.isNotEmpty(colModel[i]?.children)) {
			// children 존재하는 칼럼 dataField 값을 headerText 값으로 설정
			// Context Menu 포맷 저장시 그리드.setColumnOrder() 메소드 이슈 해결 하기 위해 추가 (dataField 값 있어야 정상 작동)
			if (commUtil.isEmpty(colModel[i]?.dataField)) {
				colModel[i].dataField = colModel[i]?.headerText;
			}

			// sub 헤더가 있는 경우
			colModel[i].children = adjustColModel(colModel[i].children, grid, opts, true);
		} else {
			colModel[i] = setColModel(colModel[i], grid, opts);
		}
	}

	return colModel;
}

/**
 * convert renderer conf.
 * @function setColModel
 * @param {object} colInfo columns conf.
 * @param {any} grid AUIGrid Ref
 * @param {any} opts 그리드 옵션
 * @returns {object} converted renderer conf.
 */
function setColModel(colInfo: any, grid: any, opts?: any) {
	if (commUtil.isEmpty(colInfo?.dataField)) {
		colInfo.dataField = colInfo?.headerText;
	}

	// 필수값 헤더 CSS 적용
	if (colInfo.required === true) {
		if (commUtil.isEmpty(colInfo.headerStyle)) {
			colInfo.headerStyle = 'required';
		} else {
			colInfo.headerStyle = colInfo.headerStyle + ' required';
		}
	}

	// 수정가능 셀 CSS 적용
	if (opts?.editable && colInfo?.editable !== false) {
		if (commUtil.isEmpty(colInfo.style)) {
			colInfo.style = 'isEdit';
		} else {
			colInfo.style = colInfo.style + ' isEdit';
		}
	}

	// 항목 유형별 셀 설정
	let retStyle = 'ta-l';
	switch (colInfo.dataType) {
		// 코드, 코드명
		case 'code':
			retStyle = 'ta-c';
			break;

		case 'user':
			retStyle = 'ta-c';
			break;

		case 'manager': {
			retStyle = 'ta-c';

			// 담당자 칼럼 "labelFunction" 설정
			colInfo.labelFunction = (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				if (commUtil.isEmpty(value)) {
					return item[colInfo.managerDataField];
				}
				return value;
			};
			break;
		}

		// 날짜
		case 'date': {
			retStyle = 'ta-c';

			// 기본 날짜포맷 설정
			colInfo.labelFunction = (_rowIndex: any, columnIndex: any, value: any) => {
				if (commUtil.isEmpty(value)) return '';
				if (dateUtil.isValid(value, 'YYYY-MM-DD')) return value;
				return value?.length > 8
					? dateUtil.setDate(value, 'YYYY-MM-DD HH:mm:ss')
					: dateUtil.setDate(value, 'YYYY-MM-DD');
			};
			// colInfo.formatString = colInfo.formatString ? colInfo.formatString : 'yyyy-mm-dd HH:nn:ss';
			break;
		}

		// 숫자(중량), 숫자(금액)
		case 'numeric': {
			retStyle = 'ta-r';

			// onlyNumeric 옵션 적용
			colInfo.editRenderer = {
				// ...{ type: 'InputEditRenderer', onlyNumeric: true, allowPoint: true, allowNegative: true },
				...{ type: 'InputEditRenderer', onlyNumeric: true }, // allowPoint, allowNegative 옵션 뺌 (2026-01-16)
				...colInfo.editRenderer,
			};

			// 엑셀 저장시 "," 표시될 수 있게 추가
			if (commUtil.isEmpty(colInfo?.formatString)) {
				if (colInfo?.editRenderer?.allowPoint === true) {
					colInfo.formatString = '#,##0.##';
				} else {
					colInfo.formatString = '#,##0';
				}
			}

			// 엑셀 다운로드시 정수에 "." 붙는 이슈 해결
			// if (colInfo?.formatString === '#,##0.##') {
			// 	colInfo['xlsxTextConversion'] = true;
			// }
			break;
		}

		// 비정형 문자
		default:
			if (!commUtil.isEmpty(colInfo.commRenderer)) {
				retStyle = 'ta-c';
			} else {
				retStyle = 'ta-l';
			}
			break;
	}

	// 기본값 다국어 정렬 세팅 (FRAMEONE_LABEL.LABEL_NM === colInfo.headerText) (동일한 라벨명 존재시 문제됨)
	const alignTypeList = getTranslationList()?.flatMap((item: any) =>
		item.labelNm === colInfo.headerText && item.alignType ? [item.alignType] : [],
	);
	if (alignTypeList?.length > 0) {
		retStyle = `ta-${alignTypeList[0].toLowerCase()}`;
	}

	if (commUtil.isEmpty(colInfo.style)) {
		colInfo.style = retStyle;
	} else {
		colInfo.style = colInfo.style + ` ${retStyle}`;
	}

	// ConditionRenderer 이슈 조치
	// https://www.auisoft.net/board/bbs/board.php?bo_table=support&wr_id=6034
	if (!commUtil.isEmpty(colInfo.editRenderer) && colInfo.editRenderer?.type === 'ConditionRenderer') {
		colInfo.editRenderer.showEditorBtn = false; // 마우스 오버 시 에디터버턴 출력 여부
	}

	// commRender 설정
	if (!commUtil.isEmpty(colInfo.commRenderer)) {
		const commRenderer = colInfo.commRenderer;
		let defRenderer = {};
		switch (commRenderer.type) {
			// 체크박스
			case 'checkBox':
				defRenderer = {
					type: 'CheckBoxEditRenderer',
					editable: true,
					checkValue: '1',
					unCheckValue: '0',
				};
				colInfo.renderer = {
					...defRenderer,
					...colInfo.renderer,
					...colInfo.commRenderer,
					type: 'CheckBoxEditRenderer',
				};
				break;
			case 'dropDown':
				defRenderer = {
					type: 'DropDownListRenderer',
					keyField: 'comCd',
					valueField: 'cdNm',
				};

				colInfo.renderer = {
					...defRenderer,
					...colInfo.renderer,
					...colInfo.commRenderer,
					type: 'DropDownListRenderer',
				};
				break;

			case 'calender':
				colInfo.dataType = 'date';
				colInfo.dateInputFormat = colInfo.dateInputFormat ? colInfo.dateInputFormat : 'yyyymmdd'; // 실제 데이터의 형식 지정
				colInfo.formatString = colInfo.formatString ? colInfo.formatString : 'yyyy-mm-dd'; //기본 날짜포맷 설정
				defRenderer = {
					type: 'CalendarRenderer',
					defaultFormat: 'yyyymmdd', // 달력 선택 시 데이터에 적용되는 날짜 형식
					firstDay: 0, // 요일 시작 날짜 지정 (일요일인 경우 0, 월요일인 경우 1 등)
					showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 출력 여부
					onlyCalendar: true, // 사용자 입력 불가, 즉 달력으로만 날짜입력 (기본값 : true)
					showExtraDays: true, // 지난 달, 다음 달 여분의 날짜(days) 출력
					showTodayBtn: true,
					todayText: i18n.t('msg.todayText'),
					validator: function (oldValue: any, newValue: any) {
						// YYYYMMDD 숫자 8자리 체크
						if (commUtil.isEmpty(newValue) && colInfo?.editRenderer?.nullable === true) {
							return { validate: true };
						}

						const isValid = /^\d{8}$/.test(newValue);
						if (!isValid && newValue !== 'STD') {
							// "STD" 문자 검증 제외
							return {
								validate: false,
								message: '날짜는 YYYYMMDD 형식으로 입력하세요.',
							};
						}

						// "20259999" 입력시 "20330607" 으로 계산되는 로직 방지
						const newDate = commUtil.gfnIsDateYmd(newValue);
						if (!newDate && newValue !== 'STD') {
							// "STD" 문자 검증 제외
							return {
								validate: false,
								message: '날짜 형식에 맞게 입력하세요.',
							};
						}
					},
				};

				colInfo.editRenderer = {
					...defRenderer,
					...colInfo.renderer,
					...colInfo.commRenderer,
					type: 'CalendarRenderer',
				};

				break;
			case 'calenderYM':
				colInfo.dataType = 'date';
				colInfo.dateInputFormat = colInfo.dateInputFormat ? colInfo.dateInputFormat : 'yyyymm'; // 실제 데이터의 형식 지정
				colInfo.formatString = colInfo.formatString ? colInfo.formatString : 'yyyy-mm'; //기본 날짜포맷 설정
				defRenderer = {
					type: 'CalendarRenderer',
					formatMonthString: 'yyyy-mm',
					onlyMonthMode: true,
					defaultFormat: 'yyyymmdd', // 달력 선택 시 데이터에 적용되는 날짜 형식
					firstDay: 1, // 요일 시작 날짜 지정 (일요일인 경우 0, 월요일인 경우 1 등)
					showEditorBtnOver: false, // 마우스 오버 시 에디터버턴 출력 여부
					onlyCalendar: true, // 사용자 입력 불가, 즉 달력으로만 날짜입력 (기본값 : true)
					showExtraDays: true, // 지난 달, 다음 달 여분의 날짜(days) 출력
					showTodayBtn: true,
					todayText: i18n.t('msg.todayText'),
					validator: function (oldValue: any, newValue: any) {
						// YYYYMMDD 숫자 8자리 체크
						const isValid = /^\d{6}$/.test(newValue);
						if (!isValid) {
							return {
								validate: false,
								message: '날짜는 YYYYMM 형식으로 입력하세요.',
							};
						}
						return { validate: true };
					},
				};

				colInfo.editRenderer = {
					...defRenderer,
					...colInfo.renderer,
					...colInfo.commRenderer,
					type: 'CalendarRenderer',
				};

				break;

			case 'calenderY':
				colInfo.dataType = 'numeric';
				defRenderer = {
					type: 'InputEditRenderer',
					maxlength: 4,
					textAlign: 'center',
					onlyNumeric: true, // 0~9 까지만 허용
					allowPoint: false, // onlyNumeric 인 경우 소수점(.) 도 허용
				};

				colInfo.editRenderer = {
					...defRenderer,
					...colInfo.renderer,
					...colInfo.commRenderer,
					type: 'InputEditRenderer',
				};

				break;
			case 'search':
				defRenderer = {
					type: 'IconRenderer',
					iconPosition: 'right', // 아이콘 위치
					iconTableRef: {
						// icon 값 참조할 테이블 레퍼런스
						default: '/img/icon/icon-pc-search-20-px.svg', //'../lib/AUIGrid/images/search_ico.png', // default
					},
					iconHeight: 14,
					iconWidth: 14,
				};
				colInfo.style = colInfo.style + ' aui_comm_search';
				colInfo.renderer = {
					...defRenderer,
					...colInfo.renderer,
					...colInfo.commRenderer,
					type: 'IconRenderer',
				};
				break;
			case 'icon':
				defRenderer = {
					type: 'IconRenderer',
					iconTableRef: {
						default: colInfo.commRenderer.icon,
					},
					iconHeight: 20,
					iconWidth: 24,
				};
				colInfo.renderer = {
					...defRenderer,
					...colInfo.renderer,
					...colInfo.commRenderer,
					type: 'IconRenderer',
				};
				break;
			case 'popup':
				colInfo.renderer = {
					...colInfo.renderer,
					...colInfo.commRenderer,
					type: 'ButtonRenderer',
					visibleFunction: function (
						rowIndex: any,
						columnIndex: any,
						value: any,
						headerText: any,
						item: any,
						dataField: any,
					) {
						if (typeof value === 'number') {
							return true;
						}
						if (!value) {
							return false;
						}
						return true;
					},
					onClick: function (e: any) {
						const now = new Date().getTime();

						// 마지막 클릭 시간과 비교 → 300ms 이내면 더블클릭으로 처리
						if (now - lastClickTime < doubleClickDelay) {
							if (commRenderer && commRenderer.onClick) {
								// 업무 화면에서 설정한 "onClick" 메소드 호출
								commRenderer.onClick(e);
							}
						}

						// 마지막 클릭 시간 갱신
						lastClickTime = now;
					},
				};
				colInfo.style = colInfo.style + ' gird-button-none';
				break;
			case 'map':
				colInfo.renderer = {
					...colInfo.renderer,
					...colInfo.commRenderer,
					type: 'ButtonRenderer',
				};
				colInfo.style = colInfo.style + ' gird-button-default';
				break;
			case 'confirm':
				colInfo.renderer = {
					...colInfo.renderer,
					...colInfo.commRenderer,
					type: 'ButtonRenderer',
				};
				colInfo.style = colInfo.style + ' gird-button-default';
				break;
			case 'businessNumber': //사업자번호
				defRenderer = {
					maxlength: 10,
					textAlign: 'center',
					overWrite: true,
				};

				colInfo = {
					...colInfo,
					...defRenderer,
					...colInfo.renderer,
					...colInfo.commRenderer,
					labelFunction: function (
						rowIndex: any,
						columnIndex: any,
						value: any,
						headerText: any,
						item: any,
						dataField: any,
					) {
						// 출력 텍스트 사용자 정의
						value = value + ''; // 완전한 문자로 다시 확인
						if (value.length == 10) {
							const v1 = value.substr(0, 3);
							const v2 = value.substr(3, 2);
							const v3 = value.substr(6, 5);
							return v1 + '-' + v2 + '-' + v3; // 3자리 끊어서 대쉬 넣음
						}
						return value; // 원래대로 출력시킴
					},
					editRenderer: {
						onlyNumeric: true, // Input 에서 숫자만 가능케 설정
						// 에디팅 유효성 검사
						validator: function (oldValue: any, newValue: string | any[], item: any) {
							let isValid = false;
							if (newValue && newValue.length == 10) {
								isValid = true;
							}
							// 리턴값은 Object 이며 validate 의 값이 true 라면 패스, false 라면 message 를 띄움
							return { validate: isValid, message: '정확한 사업자번호 10자리를 입력해 주세요.' };
						},
					},
				};
				break;

			case 'phoneNumber': //전화번호
				defRenderer = {
					maxlength: 11,
					textAlign: 'center',
				};
				colInfo = {
					...colInfo,
					...defRenderer,
					...colInfo.renderer,
					...colInfo.commRenderer,
					labelFunction: function (
						rowIndex: any,
						columnIndex: any,
						value: any,
						headerText: any,
						item: any,
						dataField: any,
					) {
						// 출력 텍스트 사용자 정의
						value = value + ''; // 완전한 문자로 다시 확인
						if (value.length == 11) {
							const v1 = value.substr(0, 3);
							const v2 = value.substr(3, 4);
							const v3 = value.substr(7, 4);
							return v1 + '-' + v2 + '-' + v3; // 3자리 끊어서 대쉬 넣음
						}
						return value; // 원래대로 출력시킴
					},
					editRenderer: {
						onlyNumeric: true, // Input 에서 숫자만 가능케 설정
						//에디팅 유효성 검사
						validator: function (oldValue: any, newValue: any, item: any) {
							let isValid = false;
							if (newValue && newValue.length >= 11 && newValue.substr(0, 3) == '010') {
								isValid = true;
							}
							// 리턴값은 Object 이며 validate 의 값이 true 라면 패스, false 라면 message 를 띄움
							return { validate: isValid, message: '010 휴대전화 번호를 정확히 입력해 주세요.' };
						},
					},
				};
				break;

			case 'phoneNumberMasking': //전화번호 가운데 마스킹
				defRenderer = {
					maxlength: 11,
					textAlign: 'center',
				};
				colInfo = {
					...colInfo,
					...defRenderer,
					...colInfo.editRenderer,
					...colInfo.renderer,
					...colInfo.commRenderer,
					labelFunction: function (
						rowIndex: any,
						columnIndex: any,
						value: any,
						headerText: any,
						item: any,
						dataField: any,
					) {
						// 출력 텍스트 사용자 정의
						value = value + ''; // 완전한 문자로 다시 확인
						if (value.length == 11) {
							const v1 = value.substr(0, 3);
							const v3 = value.substr(7, 4);
							return v1 + '-xxxx-' + v3; // 3자리 끊어서 대쉬 넣음
						}
						return value; // 원래대로 출력시킴
					},
					editRenderer: {
						...defRenderer,
						...colInfo.editRenderer,
						autoEnter: true, // 유효한 자릿수 모두 입력하면 엔터로 입력 완료된 것으로 간주
						onlyNumeric: true, // Input 에서 숫자만 가능케 설정
						// 에디팅 유효성 검사
						validator: function (oldValue: any, newValue: any, item: any) {
							let isValid = false;
							if (newValue && newValue.length >= 10 && newValue.substr(0, 3) == '010') {
								isValid = true;
							}
							// 리턴값은 Object 이며 validate 의 값이 true 라면 패스, false 라면 message 를 띄움
							return { validate: isValid, message: '010 휴대전화 번호를 정확히 입력해 주세요.' };
						},
					},
				};
				break;

			case 'inlineSelectSearch':
				// 중복 가공 방지
				if (colInfo.renderer && colInfo.renderer.type === 'TemplateRenderer') break;

				const valueField = commRenderer.valueField || 'value';
				const labelField = commRenderer.labelField || 'label';
				const placeholder = commRenderer.placeholder || '';

				// 편집 모드 진입 금지
				colInfo.editable = false;

				// template 속성 제거 (충돌 방지) → templateFunction 단독 사용
				colInfo.renderer = {
					type: 'TemplateRenderer',
					templateFunction: (
						rowIndex: number,
						colIndex: number,
						value: any,
						headerText: string,
						item: any,
						dataField: string,
					) => {
						const safe = (v: any) => (v ?? '').toString().replace(/</g, '&lt;').replace(/>/g, '&gt;');
						const label = safe(value);
						const ph = safe(placeholder);
						return `
              <div class="inline-select-search-cell"
                   data-role="inline-select-search"
                   data-field="${dataField}"
                   data-row-index="${rowIndex}">
                <span class="iss-text ${label ? '' : 'iss-placeholder'}">${label || ph}</span>
                <span class="iss-caret">▾</span>
              </div>
            `;
					},
				};
				colInfo.style = (colInfo.style ? colInfo.style + ' ' : '') + 'inline-select-search-col ta-l';
				colInfo._inlineSelectSearchMeta = {
					list: commRenderer.list || [],
					valueField,
					labelField,
					placeholder,
				};
				break;

			case 'time': // 시간 HH:MM 입력 처리 관련
				retStyle = 'ta-c';

				// 기본 시간 포맷 설정 (표시용)
				colInfo.labelFunction = (_rowIndex: any, columnIndex: any, value: any) => {
					if (commUtil.isEmpty(value)) return '';
					return dateUtils.formatTimeInput(String(value));
				};

				defRenderer = {
					type: 'InputEditRenderer',
					maxlength: 5,
					textAlign: 'center',
					placeholder: '(예: 1200, 12:00)',

					validator: function (oldValue: any, newValue: any, item: any) {
						if (!newValue || newValue.trim() === '') {
							return { validate: true };
						}

						// 자동 포맷팅 적용
						const formattedValue = dateUtils.formatTimeInput(newValue);

						// 포맷팅 실패 시
						if (formattedValue === newValue && !/^\d{1,2}:\d{2}$/.test(formattedValue)) {
							return {
								validate: false,
								message: '올바른 시간을 입력해주세요. (예: 1200, 12:00, 930)',
							};
						}

						// HH:MM 형식 유효성 검사
						const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
						if (!timeRegex.test(formattedValue)) {
							return {
								validate: false,
								message: '올바른 시간 형식을 입력해주세요. (00:00~23:59)',
							};
						}

						return {
							validate: true,
							// 포맷팅된 값으로 저장
							message: formattedValue !== newValue ? `자동 변환: ${formattedValue}` : '',
						};
					},
				};

				colInfo.editRenderer = {
					...defRenderer,
					...colInfo.editRenderer,
					type: 'InputEditRenderer',
				};

				break;
		}

		// commRenderer나 editRenderer 등 추가된 속성에 align 있으면
		if (colInfo.renderer?.align) {
			// renderer.align 있으면 colInfo.style에서 ta-r, ta-c, ta-l 클래스 제거 ( 왜냐하면, 하단코드의 renderer-ta-r 클래스가 추가되기 때문에 혼동 방지 )
			if (colInfo.style) {
				colInfo.style = colInfo.style
					.replace(/\bta-r\b/g, '')
					.replace(/\bta-c\b/g, '')
					.replace(/\bta-l\b/g, '')
					.replace(/\s+/g, ' ')
					.trim();
			}

			// renderer.align에 따라 새로운 클래스 추가
			if (colInfo.renderer.align.includes('right')) {
				colInfo.style = (colInfo.style || '') + ' renderer-ta-r';
			} else if (colInfo.renderer.align.includes('center')) {
				colInfo.style = (colInfo.style || '') + ' renderer-ta-c';
			} else if (colInfo.renderer.align.includes('left')) {
				colInfo.style = (colInfo.style || '') + ' renderer-ta-l';
			}
		}

		colInfo.commRenderer = null;
	}
	//maxLength 설정
	if (!commUtil.isEmpty(colInfo.maxlength)) {
		colInfo.editRenderer = {
			...colInfo.editRenderer,
			maxlength: colInfo.maxlength,
		};
	}

	if (colInfo?.filter) {
		const filterStateInMemoryByGridKey = getFilterStateInMemoryByGridKey(grid);

		// 그리드 별 기준 항목 필터 상태 저장
		filterStateInMemory.set(getGridKey(grid), {
			...filterStateInMemoryByGridKey,
			originHasFilterList: [...filterStateInMemoryByGridKey.originHasFilterList, colInfo],
		});

		// 기준 항목 필터는 처음에 보이지 않게하고, 컨텍스트메뉴에서 기준항목필터 클릭 시에 보이게 처리
		colInfo.filter = {
			...colInfo.filter,
			showIcon: false,
		};
	}

	return colInfo;
}

/**
 * 타겟 그리드 이벤트 bind
 * @param {any} _tGrid 타켓 그리드
 * @param {any} _tProps 타켓 그리드 props
 */
export function bindEvent(_tGrid: any, _tProps: any) {
	// 단축키 이벤트 설정
	bindKeyDown(_tGrid, _tProps);

	// Context Menu Item 동적 커스텀
	bindContextMenu(_tGrid, _tProps);

	// ROW 추가/수정/삭제 시 엑스트라 체크박스 컨트롤
	bindStateChange(_tGrid, _tProps);

	// 그리드 정렬 이벤트 발생 시 실행
	bindSortingEvent(_tGrid, _tProps);

	// 그리드 필터 이벤트 설정
	bindFilteringEvent(_tGrid, _tProps);

	// 그리드 준비 이벤트 설정
	bindReadyEvent(_tGrid, _tProps);

	// 그리드 칼럼 상태 변경 이벤트 설정
	bindColumnStateChange(_tGrid, _tProps);

	// 그리드 셀 클릭 이벤트 설정
	bindCellClick(_tGrid, _tProps);

	// 그리드 복사 이벤트 설정
	bindCopyBegin(_tGrid, _tProps);

	// 그리드 붙여넣기 이벤트 설정
	bindPasteBegin(_tGrid, _tProps);

	// 그리드 편집 시작 이벤트 설정
	bindCellEditBegin(_tGrid, _tProps);

	// 그리드 셀 편집 종료 직전 이벤트 설정
	bindCellEditEndBefore(_tGrid, _tProps);

	// 그리드 셀 편집 취소 이벤트 설정
	bindCellEditCancel(_tGrid, _tProps);

	//
	bindScroll(_tGrid, _tProps);
}

/**
 * 타겟 그리드 이벤트 unbind
 * @param {any} _tGrid 타켓 그리드
 */
export function unbindEvent(_tGrid: any) {
	_tGrid.unbind('keyDown');
	_tGrid.unbind('contextMenu');
	_tGrid.unbind(['addRow', 'removeRow', 'cellEditEnd', 'rowAllChkClick', 'rowCheckClick']);
	_tGrid.unbind(['vScrollChange', 'hScrollChange']);
}

/**
 * 그리드 단축키 이벤트 설정
 * @param {any} _tGrid 타켓 그리드
 * @param {any} _tProps 타켓 그리드 props
 * @description 단축키 이벤트 설정, event가 AUI Grid 내에서 커스텀한 이벤트이므로
 * 자바스크립트 오리지널 이벤트 객체인 event.orgEvent 로 체크
 */
function bindKeyDown(_tGrid: any, _tProps: any) {
	_tGrid.bind('keyDown', (event: any) => {
		// Insert 키
		if (event.orgEvent.keyCode === 45) {
			return false; // 기본 행위 안함.
		}

		// F2
		if (_tProps.useF2 && event.orgEvent.key === 'F2') {
			return handleGridKeyEvent(_tGrid, event, 'F2');
		}

		// F7
		if (_tProps.useF7 && event.orgEvent.key === 'F7') {
			return handleGridKeyEvent(_tGrid, event, 'F7');
		}

		// F8
		if (_tProps.useF8 && event.orgEvent.key === 'F8') {
			return handleGridKeyEvent(_tGrid, event, 'F8');
		}

		// F9
		if (_tProps.useF9 && event.orgEvent.key === 'F9') {
			return handleGridKeyEvent(_tGrid, event, 'F9');
		}

		// F10
		if (_tProps.useF10 && event.orgEvent.key === 'F10') {
			return handleGridKeyEvent(_tGrid, event, 'F10');
		}

		// Ctrl + F
		if (_tProps.useCtrlF && event.ctrlKey && event.orgEvent.key?.toLowerCase() == 'f') {
			return handleGridKeyEvent(_tGrid, event, 'CtrlF');
		}

		// Ctrl + A
		if (_tProps.useCtrlA && event.ctrlKey && event.orgEvent.key?.toLowerCase() == 'a') {
			_tGrid.setSelectionAll();
			return false; // 브라우저의 Ctrl+A 막기 ( 공식문서 참고 )
		}

		// Ctrl + P
		if (_tProps.useCtrlP && event.ctrlKey && event.orgEvent.key?.toLowerCase() == 'p') {
			return handleGridKeyEvent(_tGrid, event, 'CtrlP');
		}

		// Ctrl + Z
		if (_tProps.useCtrlZ && event.ctrlKey && event.orgEvent.key?.toLowerCase() == 'z') {
			setTimeout(() => {
				// 롤백 후 목록
				const changedDataListNew = _tGrid
					.getChangedData({ validationYn: false })
					.map((data: any) => data[_tProps['rowIdField']] || data['_$uid']);

				_tGrid.setCheckedRowsByIds(changedDataListNew);
			});
		}

		if (event.orgEvent.key === 'Enter') {
			// 마지막 행일 경우에만 커스텀 이벤트 발생
			if (isSelectedLastRow(_tGrid)) {
				return handleGridKeyEvent(_tGrid, event, 'Enter');
			}
		}

		// Ctrl + 스페이스
		if (event.ctrlKey && event.orgEvent.code === 'Space') {
			// 선택된 ROW의 체크박스 컨트롤
			const selectedItems = _tGrid.getSelectedItems();
			if (commUtil.isNotEmpty(selectedItems)) {
				const rowIdField = _tProps['rowIdField'] ?? '_$uid';
				const rowId = selectedItems[0].item[rowIdField];
				const isChecked = _tGrid.isCheckedRowById(rowId);
				if (isChecked) {
					_tGrid.addUncheckedRowsByIds(rowId);

					// 체크박스 해제시 컨트롤
					uncheckedRowAction(_tGrid, _tProps, selectedItems[0].item);
				} else {
					_tGrid.addCheckedRowsByIds(rowId);
				}
			}
		}

		// 커스텀 엑스트라 체크박스에서 스페이스 키보드 입력시
		if (
			event.orgEvent.code === 'Space' &&
			_tProps?.['showCustomRowCheckColumn'] &&
			commUtil.isNotEmpty(_tGrid.getSelectedItems())
		) {
			const selectedItem = _tGrid.getSelectedItems()[0];
			if (_tGrid.isRemovedByRowIndex(selectedItem['rowIndex'])) {
				// 삭제된 ROW일때
				setTimeout(() => {
					_tGrid.setCellValue(
						selectedItem['rowIndex'],
						_tGrid.getProp('customRowCheckColumnDataField'),
						_tGrid.getProp('customRowCheckColumnUnCheckValue'),
						true,
					);
				}, 100);
				uncheckedRowAction(_tGrid, _tProps, selectedItem['item']);
			} else if (
				selectedItem.dataField === _tGrid.getProp('customRowCheckColumnDataField') &&
				selectedItem.value === _tProps?.['customRowCheckColumnCheckValue']
			) {
				setTimeout(() => {
					_tGrid.setCellValue(
						selectedItem['rowIndex'],
						_tGrid.getProp('customRowCheckColumnDataField'),
						_tGrid.getProp('customRowCheckColumnUnCheckValue'),
						true,
					);
					uncheckedRowAction(_tGrid, _tProps, selectedItem['item']);

					// "rowCheckClick" 이벤트 강제로 호출
					_tGrid?.bindCall('rowCheckClick', { ...selectedItem, checked: false });
				}, 100);
			} else if (
				// AUI그리드 props의 "editable" 값이 false 일때
				selectedItem.dataField === _tGrid.getProp('customRowCheckColumnDataField') &&
				_tGrid.getProp('editable') === false
			) {
				_tGrid?.setProp('editable', true);
				if (selectedItem.value === _tProps?.['customRowCheckColumnCheckValue']) {
					uncheckedRowAction(_tGrid, _tProps, selectedItem['item']);
				} else if (selectedItem.value === _tProps?.['customRowCheckColumnUnCheckValue']) {
					// "rowCheckDisabledFunction" 상태 여부 체크
					let rowCheckDisabled = false;
					if (_tProps?.['rowCheckDisabledFunction']) {
						rowCheckDisabled = !_tProps?.['rowCheckDisabledFunction'](selectedItem.rowIndex, false, selectedItem.item);
					}

					if (!rowCheckDisabled) {
						setTimeout(() => {
							_tGrid.setCellValue(
								selectedItem['rowIndex'],
								_tGrid.getProp('customRowCheckColumnDataField'),
								_tGrid.getProp('customRowCheckColumnCheckValue'),
								true,
							);
						});
					}
				}
				setTimeout(() => {
					_tGrid?.setProp('editable', false);
				});
			} else if (selectedItem.value === _tProps?.['customRowCheckColumnUnCheckValue']) {
				// "rowCheckDisabledFunction" 상태 여부 체크
				let rowCheckDisabled = false;
				if (_tProps?.['rowCheckDisabledFunction']) {
					rowCheckDisabled = !_tProps?.['rowCheckDisabledFunction'](selectedItem.rowIndex, false, selectedItem.item);
				}

				// "rowCheckClick" 이벤트 강제로 호출
				_tGrid?.bindCall('rowCheckClick', { ...selectedItem, checked: true });

				// 커스텀 엑스트라 체크박스 스페이스 입력시 'cellEditEnd' 이벤트 캐치가 안되서 임시적으로 추가
				// 원인 확인 후 삭제 예정
				if (!rowCheckDisabled) {
					setTimeout(() => {
						_tGrid.setCellValue(
							selectedItem['rowIndex'],
							_tGrid.getProp('customRowCheckColumnDataField'),
							_tGrid.getProp('customRowCheckColumnCheckValue'),
							true,
						);
					});
				}
			}
		}
	});
}

/**
 * 그리드 Context Menu 이벤트 설정
 * @param {any} _tGrid 타켓 그리드
 * @param {any} _tProps 타켓 그리드 props
 */
function bindContextMenu(_tGrid: any, _tProps: any) {
	if (_tProps.useContextMenu) {
		/**
		 * 컨텍스트 메뉴 이벤트 설정
		 * @param {any} event context menu 이벤트
		 */
		_tGrid.bind('contextMenu', (event: any) => {
			/**
			 * 기존에 열려있던 context menu 제거
			 */
			const removeOpenedContextMenu = () => {
				const contextMenuElements = document.querySelectorAll('.aui-grid-context-popup-layer');

				// 기존 context menu 제거
				contextMenuElements?.forEach((element: any) => {
					element.remove();
				});
			};

			/**
			 * 선택된 셀이 없으면 context menu 이벤트가 발생한 셀을 선택되도록 함
			 */
			const selectCellByContextMenuCellIfNoneSelected = () => {
				const selectedCells = _tGrid.getSelectedItems() || [];

				if (selectedCells.length === 0) {
					_tGrid.setSelectionByIndex(event.rowIndex, event.columnIndex);
				}
			};

			removeOpenedContextMenu();

			selectCellByContextMenuCellIfNoneSelected();

			// 동적 아이템 생성
			const dynamicItems = createDynamicContextMenuItems(_tGrid, event);

			// 기존 배열을 직접 수정 (참조 유지)
			_tProps.contextMenuItems.length = 0; // 기존 아이템 모두 제거
			dynamicItems.forEach(item => {
				_tProps.contextMenuItems.push(item);
			});
		});
	}
}

/**
 * ROW 추가/수정/삭제 시 엑스트라 체크박스 컨트롤
 * @param {any} _tGrid 타켓 그리드
 * @param {any} _tProps 타켓 그리드 props
 */
function bindStateChange(_tGrid: any, _tProps: any) {
	if (_tProps.showRowCheckColumn || _tProps?.['showCustomRowCheckColumn']) {
		// ROW 추가/수정/삭제 시
		const rowIdField = _tProps['rowIdField'] || '_$uid';
		let addCheckedRows: any = [];
		let addUncheckedRows: any = [];
		let editTimer: any = null;
		_tGrid.bind(['addRow', 'removeRow', 'cellEditEnd'], (row: any) => {
			// 커스텀 엑스트라 체크박스 변경시 아래 로직 제외
			if (row.type === 'cellEditEnd' && row.dataField === _tGrid.getProp('customRowCheckColumnDataField')) return true;

			// 커스텀 엑스트라 체크박스 비활성화 상태일때 아래 로직 제외
			if (row.type === 'cellEditEnd' && commUtil.isNotEmpty(_tGrid.getProp('rowCheckDisabledFunction'))) {
				if (!_tGrid.getProp('rowCheckDisabledFunction')(null, null, row.item)) {
					return true;
				}
			}

			let selItem = row.item || (row.items?.length > 0 ? row.items : {});

			// 커스텀 엑스트라 체크박스 해제 (변경 감지하지 않기 위해 강제로 미리 해제)
			if (
				_tProps?.['showCustomRowCheckColumn'] &&
				row.dataField !== _tProps?.['customRowCheckColumnDataField'] &&
				selItem[_tProps?.['customRowCheckColumnDataField']] === _tProps?.['customRowCheckColumnCheckValue'] &&
				!(row.type === 'cellEditEnd' && row.isClipboard) // 대량 Row 붙여넣기(Ctrl + v) 시 updateRowsById 속도 이슈가 있어 제외
			) {
				_tGrid.updateRowsById({
					[rowIdField]: selItem[rowIdField],
					[_tGrid.getProp('customRowCheckColumnDataField')]: _tGrid.getProp('customRowCheckColumnUnCheckValue'),
				});
			}

			// 행추가 ROW OR 수정된 ROW
			if (
				selItem[_tProps?.['customRowCheckColumnDataField']] === _tProps?.['customRowCheckColumnCheckValue'] &&
				row.type === 'cellEditEnd' &&
				row.isClipboard
			) {
				// 대량 Row 붙여넣기(Ctrl + v) 시 updateRowsById 속도 이슈가 있어 getEditedRowColumnItems 방식으로 대체
				const targetKeySet = new Set([
					_tGrid.getProp('rowIdField') || '_$uid',
					_tGrid.getProp('customRowCheckColumnDataField'),
				]);
				const result = _tGrid.getEditedRowColumnItems()?.filter((obj: any) => {
					const objKeys = Object.keys(obj);
					return !(objKeys.length === targetKeySet.size && objKeys.every(key => targetKeySet.has(key)));
				});
				const exists = result?.some((item: any) => item[rowIdField] === selItem[rowIdField]);
				if (exists) {
					addCheckedRows.push(selItem[rowIdField]);
				}
			} else if (
				row.type === 'addRow' ||
				row.type === 'removeRow' ||
				(row.type === 'cellEditEnd' && _tGrid.isEditedByRowIndex(row.rowIndex))
			) {
				if (Array.isArray(selItem)) {
					selItem.forEach((item: any) => {
						addCheckedRows.push(item[rowIdField]);
					});
				} else {
					addCheckedRows.push(selItem[rowIdField]);
				}
			}

			// 변경된 ROW && 체크된 ROW LIST
			if (_tGrid.getProp('showRowCheckColumn')) {
				const changedData = _tGrid.getChangedData({ validationYn: false });
				if (changedData && changedData.length > 0) {
					changedData?.map((item: any) => {
						addCheckedRows.push(item[rowIdField]);
					});
				}
			}

			// 중복된 ROW 제거
			const uniqueAddCheckedRows = [...new Set(addCheckedRows)];

			// 해제된 ROW
			if (row.type === 'removeRow' || row.type === 'cellEditEnd') {
				if (Array.isArray(selItem)) selItem = selItem[0];
				if (!uniqueAddCheckedRows?.includes(selItem[rowIdField])) {
					addUncheckedRows.push(selItem[rowIdField]);
				}
			}

			// 추가 편집 없으면 처리
			clearTimeout(editTimer);
			editTimer = setTimeout(function () {
				// 엑스트라 체크박스 체크 설정
				if (uniqueAddCheckedRows.length > 0) {
					_tGrid.addCheckedRowsByIdsBefore(uniqueAddCheckedRows, rowIdField);
				}
				// 변경 해제된 Row 체크박스 해제
				if (addUncheckedRows.length > 0) {
					_tGrid.addUncheckedRowsByIdsBefore(addUncheckedRows, rowIdField);
				}

				// 초기화
				addCheckedRows = [];
				addUncheckedRows = [];
			});
		});

		// 엑스트라 전체 체크박스 클릭 시
		if (_tProps.showRowCheckColumn) {
			_tGrid.bind('rowAllChkClick', (event: any) => {
				// 전체 체크박스 해제일 경우
				if (!event.checked) {
					uncheckedAllRowAction(_tGrid, _tProps);
				}
			});
		}

		// 엑스트라 체크박스 클릭 시
		if (_tProps.showRowCheckColumn) {
			_tGrid.bind('rowCheckClick', (event: any) => {
				// 체크박스 해제일 경우
				if (!event.checked) {
					uncheckedRowAction(_tGrid, _tProps, event['item']);
				}

				// 체크박스 클릭된 행 선택 ( 체크박스 true / false 상관없이 )
				// "행 복사"시 마지막 체크된 항목이 아닌 마지막 셀렉된 ROW를 기준으로 복사되는 이슈로 아래 로직 추가
				// _tGrid.setSelectionByIndex(event.rowIndex);
			});
		}
	}
}

/**
 * 엑스트라 전체 체크박스 해제시
 * @param {any} _tGrid 타켓 그리드
 * @param {any} _tProps 타켓 그리드 props
 */
function uncheckedAllRowAction(_tGrid: any, _tProps: any) {
	// 변경된 ROW
	const insertIndexes: any[] = []; // 추가된 ROW INDEX
	const editIndexes: any[] = []; // 수정된 ROW INDEX
	const editIds: any[] = []; // 수정된 ROW ID
	const removeIndexes: any[] = []; // 삭제된 ROW INDEX

	_tGrid.getChangedData({ validationYn: false, andCheckedYn: false })?.map((item: any) => {
		const rowIndex = _tGrid.rowIdToIndex(item[_tProps.rowIdField || '_$uid']);
		switch (item.rowStatus) {
			case 'I':
				insertIndexes.push(rowIndex);
				break;

			case 'U':
				editIndexes.push(rowIndex);
				editIds.push(item[_tProps.rowIdField] || item['_$uid']);
				break;

			case 'D':
				removeIndexes.push(rowIndex);
				break;
		}
	});

	// 수정 복구
	if (editIndexes.length > 0) {
		if (_tProps['isRestore']) {
			_tGrid.restoreEditedRows(editIndexes);
		}
		// setTimeout(() => {
		// 	_tGrid.addUncheckedRowsByIds(editIds);
		// });
	}
	// 추가된 ROW 삭제
	// _tGrid.removeRow(insertIndexes);
	// 삭제 복구
	_tGrid.restoreSoftRows(removeIndexes);
	if (removeIndexes.length > 0 && _tProps['showCustomRowCheckColumn']) {
		// 커스텀 엑스트라 체크박스 해제
		removeIndexes.forEach((index: any) => {
			_tGrid.setCellValue(
				index,
				_tGrid.getProp('customRowCheckColumnDataField'),
				_tGrid.getProp('customRowCheckColumnUnCheckValue'),
				true,
			);
		});
	}
}

/**
 * 체크박스 해제시 컨트롤
 * @param {any} _tGrid 타켓 그리드
 * @param {any} _tProps 타켓 그리드 props
 * @param {any} item 해제될 ROW의 item
 */
function uncheckedRowAction(_tGrid: any, _tProps: any, item: any) {
	// 선택된 ROW의 index
	const rowIndex = _tGrid.rowIdToIndex(item[_tProps.rowIdField || '_$uid']);

	if (commUtil.isNotEmpty(rowIndex)) {
		if (_tGrid.isAddedByRowIndex(rowIndex)) {
			// 추가된 ROW 삭제
			// _tGrid.removeRow(rowIndex);
		} else if (_tGrid.isEditedByRowIndex(rowIndex)) {
			// 수정 복구
			if (_tProps['isRestore']) {
				_tGrid.restoreEditedRows(rowIndex);
			}
		} else if (_tGrid.isRemovedByRowIndex(rowIndex)) {
			// 삭제 복구
			_tGrid.restoreSoftRows(rowIndex);
		}
	}
}

/**
 * 그리드 정렬 이벤트 발생 시 실행
 * @param {any} _tGrid 타켓 그리드
 * @param {any} _tProps 타켓 그리드 props
 */
function bindSortingEvent(_tGrid: any, _tProps: any) {
	_tGrid.bind('sorting', (event: any) => {
		// 정렬 정보를 메모리에 저장
		const gridKey = getGridKey(_tGrid);
		const currentSortingInfo = _tGrid.getSortingFields();
		const gridStateInMemoryByGridKey = gridStateInMemory.get(gridKey) || initGridStateItem;

		gridStateInMemory.set(gridKey, {
			...gridStateInMemoryByGridKey,
			// sortingInfo: currentSortingInfo,
		});
	});
}

/**
 * 그리드 필터 이벤트 설정
 * @param {any} _tGrid 타켓 그리드
 * @param {any} _tProps 타켓 그리드 props
 */
function bindFilteringEvent(_tGrid: any, _tProps: any) {
	_tGrid.bind('filtering', (event: any) => {
		_tGrid.setSelectionByIndex(0);
	});
}

/**
 * 그리드 데이터 로드 이벤트 설정
 * @description 컴포넌트에서 이미 ready 이벤트를 호출하고 있다면 해당 ready 이벤트는 실행되지 않음
 * @param {any} _tGrid 타켓 그리드
 * @param {any} _tProps 타켓 그리드 props
 */
function bindReadyEvent(_tGrid: any, _tProps: any) {
	_tGrid.bind('ready', (event: any) => {
		loadGridStateByStaticUrl(_tGrid);
	});
}

/**
 * 그리드 칼럼 상태 변경 이벤트 설정
 * @param {any} _tGrid 타켓 그리드
 * @param {any} _tProps 타켓 그리드 props
 */
function bindColumnStateChange(_tGrid: any, _tProps: any) {
	_tGrid.bind('columnStateChange', (event: any) => {
		const gridKey = getGridKey(_tGrid);
		const gridStateInMemoryByGridKey = gridStateInMemory.get(gridKey) || initGridStateItem;

		const newColumnOrderList = _tGrid.getColumnLayout().map((col: any) => col.dataField);

		gridStateInMemory.set(gridKey, {
			...gridStateInMemoryByGridKey,
			columnOrderList: newColumnOrderList,
		});
	});
}

/**
 * 그리드 셀 클릭 이벤트 설정
 * @param _tGrid
 * @param _tProps
 */
function bindCellClick(_tGrid: any, _tProps: any) {
	_tGrid.bind('cellClick', (event: any) => {
		if (event.orgEvent.altKey) {
			const isChecked = _tGrid.isCheckedRowById(event.rowIdValue);
			if (isChecked) {
				_tGrid.addUncheckedRowsByIds(event.rowIdValue);
			} else {
				_tGrid.addCheckedRowsByIds(event.rowIdValue);
			}
		} else if (event.dataField === _tProps?.['customRowCheckColumnDataField']) {
			if (
				event.value === _tProps?.['customRowCheckColumnUnCheckValue'] ||
				_tGrid.isRemovedByRowIndex(event['rowIndex'])
			) {
				setTimeout(() => {
					// 삭제 행인 경우 커스텀 엑스트라 체크박스 해제
					if (_tGrid.isRemovedByRowIndex(event['rowIndex'])) {
						setTimeout(() => {
							_tGrid.setCellValue(
								event['rowIndex'],
								_tGrid.getProp('customRowCheckColumnDataField'),
								_tGrid.getProp('customRowCheckColumnUnCheckValue'),
								true,
							);
						});
					}

					uncheckedRowAction(_tGrid, _tProps, event['item']);
				});
			}

			// "rowCheckClick" 이벤트 강제로 호출
			event['checked'] = event['value'] === _tGrid.getProp('customRowCheckColumnCheckValue');
			_tGrid?.bindCall('rowCheckClick', event);
		}
	});
}

/**
 *
 * @param _tGrid
 * @param _tProps
 */
function bindCopyBegin(_tGrid: any, _tProps: any) {
	_tGrid.bind('copyBegin', (event: any) => {
		if (!_tProps.useCtrlC) {
			return false;
		}

		// editableMergedCellsAll 또는 selectionMultiOnMerge 속성 true 일 경우 병합된 전체 ROW가 복사되는 이슈 해결
		if (_tProps?.['editableMergedCellsAll'] || _tProps?.['selectionMultiOnMerge']) {
			// 이슈 : 진짜 중복된 DATA 복사하고 싶을때 제거되는 이슈가 있음
			// 해결방안 : 병합된 Cell만 아래 로직 적용하는 방법 찾아야 함
			const rows = event.data.split('\r\n').filter((v: any) => v !== ''); // 공백 제외
			const uniqueRows: any = [...new Set(rows)]; // Set으로 중복 제거
			return uniqueRows.join('\r\n'); // 다시 줄바꿈(\r\n)으로 합쳐서 Return
		}
	});
}

/**
 *
 * @param _tGrid
 * @param _tProps
 */
function bindPasteBegin(_tGrid: any, _tProps: any) {
	_tGrid.bind('pasteBegin', (event: any) => {
		if (!_tProps.useCtrlV) {
			return false;
		}
	});
}

/**
 * 그리드 셀 편집 시작 이벤트 설정
 * @param _tGrid
 * @param _tProps
 */
function bindCellEditEndBefore(_tGrid: any, _tProps: any) {
	_tGrid.bind('cellEditEndBefore', (event: any) => {
		const collectChildColumns = (columns: any[], isHeader: boolean) => {
			for (const item of columns) {
				// 자식 칼럼도 컬럼레이아웃에 추가
				if (item.children && item.children.length > 0) {
					collectChildColumns(item.children, true);
				} else if (isHeader) {
					columnLayout.push(item);
				}
			}
		};

		const columnLayout = _tGrid.props.columnLayout;
		collectChildColumns(columnLayout, false);

		if (columnLayout?.find((col: any) => col.dataField === event.dataField)?.commRenderer?.type === 'search') {
			_tGrid.setProp('onlyEnterKeyEditEnd', true); // 엔터 키 입력 시 다음 행으로 넘어가지 않게하는 옵션을 설정

			// 검색 드롭다운 닫기 ( 검색 드롭다운 열림 상태일 경우 닫기 )
			if (_tGrid?.state?.searchDropdownState?.visible) {
				_tGrid?.closeSearchDropdownPopup();
			}

			const commRenderer = columnLayout?.find((col: any) => col.dataField === event.dataField)?.commRenderer;

			if (commRenderer && commRenderer.searchDropdownProps) {
				const {
					dataFieldMap,
					callbackBeforeUpdateRow,
					isSearch, // 센터이체마스터 사용조건, 조회 로직 실행전 실행여부 체크 true : 실행 중단
				}: {
					dataFieldMap: Record<string, string>;
					callbackBeforeUpdateRow?: (e: any) => void | boolean;
					isSearch?: (e: any) => boolean;
				} = commRenderer.searchDropdownProps;

				// Enter 키로 편집이 종료된 경우 or 붙여넣기로 넘어올때
				if (event.which === 13 || event.which === 'clipboard') {
					const params = {
						...commRenderer.params,
						name: event.value,
						multiSelect: '',
						startRow: 0,
						listCount: 500,
						// skipCount: true,
					};

					let dropdownData: any[] = [];

					const cellElement = _tGrid.getCellElementByIndex(event.rowIndex, event.columnIndex);
					const cellElementRect = cellElement.getBoundingClientRect();

					const apiGetDropdownData = getSearchPopupApiFunction(commRenderer.popupType);

					if (!apiGetDropdownData) {
						return;
					}

					// isSearch(선작업) 결과가 true로 넘어오면 데이터 원복
					const restoreData = () => {
						_tGrid?.restoreEditedCells('selectedIndex'); // 이전값으로 복구 ( 편집 셀 닫기 )

						// 2. 초기화할 객체 생성 (plant 필드를 ''로 설정)
						const updateObj: Record<string, any> = {};
						Object.entries(dataFieldMap).forEach(([gridField, dropdownField]) => {
							updateObj[gridField] = ''; // plant: ''
						});
						// 3. **데이터 원본 업데이트:** plant 필드를 빈 값으로 확실하게 덮어씁니다.
						_tGrid?.updateRow(updateObj, event.rowIndex);
						// 4. UI 정리 및 이벤트 중단
						_tGrid?.closeSearchDropdownPopup();
						_tGrid.setProp('onlyEnterKeyEditEnd', false);
					};

					const handleDropdownClick = async (e: any) => {
						// plt 변환값 물류센터코드와 창고 코드가 일치하지 않을경우 (1000센터, 2170센터 제외)
						// api 실행할 필요가 없지만 rowUpdate가 제대로 되지 않아 api호출 후 실행
						// isSearch(선작업) 결과가 true로 넘어오면 데이터 원복
						if (isSearch && isSearch([e])) {
							restoreData();
							return; // 이벤트 중단
						}

						if (event.which === 13) {
							_tGrid?.restoreEditedCells('selectedIndex'); // 이전값으로 복구 ( 편집 셀 닫기 )

							// dataFieldMap과 dropdownConfig.columns의 key를 이용하여 업데이트 객체 생성
							const updateObj: Record<string, any> = {};
							Object.entries(dataFieldMap).forEach(([gridField, dropdownField]) => {
								updateObj[gridField] = e[dropdownField];
							});

							callbackBeforeUpdateRow?.({ ...event, ...e }); // 행 업데이트 전 추가 작업

							_tGrid?.updateRow(updateObj, event.rowIndex); // 드롭다운에서 선택한 값으로 행 업데이트
							_tGrid?.closeSearchDropdownPopup(); // 드롭다운 닫기
						} else if (event.which === 'clipboard') {
							// dataFieldMap과 dropdownConfig.columns의 key를 이용하여 업데이트 객체 생성
							const updateObj: Record<string, any> = {};
							Object.entries(dataFieldMap).forEach(([gridField, dropdownField]) => {
								updateObj[gridField] = e[dropdownField];
							});

							e.which = event.which;
							e.updateObj = updateObj;
							const isUpdate = await callbackBeforeUpdateRow?.({ ...event, ...e }); // 화면에서 데이터 정제 후 update

							if (!isUpdate) {
								_tGrid?.updateRow(updateObj, event.rowIndex); // 드롭다운에서 선택한 값으로 행 업데이트
							}
							_tGrid?.closeSearchDropdownPopup(); // 드롭다운 닫기
						}
					};

					const dropdownConfig = getSearchPopupDropdownConfig(commRenderer.popupType);

					apiGetDropdownData(params).then((res: any) => {
						// api 조회 결과
						if (res.data.list.length === 1) {
							handleDropdownClick(res.data.list[0]); // 드롭다운 데이터가 1개일 경우 바로 행 업데이트
						} else if (res.data.list.length > 0) {
							dropdownData = [...res.data.list]; // 드롭다운 데이터 설정
							_tGrid.openSearchDropdownPopup({
								dropdownConfig,
								dropdownData,
								handleDropdownClick,
								cellElementRect,
							});
							_tGrid.openInputer(); // input 편집 열기
						} else {
							commRenderer.onClick(event); // 드롭다운 데이터가 없을 경우 기본 검색 팝업 처리
						}
						_tGrid.setProp('onlyEnterKeyEditEnd', false); // 엔터 키 입력 시 다음 행으로 넘어가지 않게하는 옵션을 해제
					});
				}
			}
		} else if (columnLayout?.find((col: any) => col.dataField === event.dataField)?.renderer?.searchDropdownProps) {
			_tGrid.setProp('onlyEnterKeyEditEnd', true); // 엔터 키 입력 시 다음 행으로 넘어가지 않게하는 옵션을 설정

			// 검색 드롭다운 닫기 ( 검색 드롭다운 열림 상태일 경우 닫기 )
			if (_tGrid?.state?.searchDropdownState?.visible) {
				_tGrid?.closeSearchDropdownPopup();
			}

			const renderer = columnLayout?.find((col: any) => col.dataField === event.dataField)?.renderer;

			const {
				dataFieldMap,
				callbackBeforeUpdateRow,
				isSearch,
			}: {
				dataFieldMap: Record<string, string>;
				callbackBeforeUpdateRow?: (e: any) => void;
				isSearch?: (e: any) => boolean;
			} = renderer.searchDropdownProps;

			// Enter 키로 편집이 종료된 경우 or 붙여넣기로 넘어올때
			if (event.which === 13 || event.which === 'clipboard') {
				const params = {
					name: event.value,
					multiSelect: '',
					startRow: 0,
					listCount: 500,
					// skipCount: true,
				};

				let dropdownData: any[] = [];

				const cellElement = _tGrid.getCellElementByIndex(event.rowIndex, event.columnIndex);
				const cellElementRect = cellElement.getBoundingClientRect();

				const apiGetDropdownData = getSearchPopupApiFunction(renderer.popupType);

				if (!apiGetDropdownData) {
					return;
				}

				const handleDropdownClick = (e: any) => {
					_tGrid?.restoreEditedCells('selectedIndex'); // 이전값으로 복구 ( 편집 셀 닫기 )

					// dataFieldMap과 dropdownConfig.columns의 key를 이용하여 업데이트 객체 생성
					const updateObj: Record<string, any> = {};
					Object.entries(dataFieldMap).forEach(([gridField, dropdownField]) => {
						updateObj[gridField] = e[dropdownField];
					});

					callbackBeforeUpdateRow?.({ ...event, ...e }); // 행 업데이트 전 추가 작업

					_tGrid?.updateRow(updateObj, event.rowIndex); // 드롭다운에서 선택한 값으로 행 업데이트
					_tGrid?.closeSearchDropdownPopup(); // 드롭다운 닫기
				};

				const dropdownConfig = getSearchPopupDropdownConfig(renderer.popupType);

				apiGetDropdownData(params).then((res: any) => {
					// plt 변환값 물류센터코드와 창고 코드가 일치하지 않을경우 (1000센터, 2170센터 제외)
					// api 실행할 필요가 없지만 rowUpdate가 제대로 되지 않아 api호출 후 실행
					if (isSearch && isSearch(res.data.list)) {
						_tGrid?.restoreEditedCells('selectedIndex'); // 이전값으로 복구 ( 편집 셀 닫기 )

						// 2. 초기화할 객체 생성 (plant 필드를 ''로 설정)
						const updateObj: Record<string, any> = {};
						Object.entries(dataFieldMap).forEach(([gridField, dropdownField]) => {
							updateObj[gridField] = ''; // plant: ''
						});
						// 3. **데이터 원본 업데이트:** plant 필드를 빈 값으로 확실하게 덮어씁니다.
						_tGrid?.updateRow(updateObj, event.rowIndex);
						// 4. UI 정리 및 이벤트 중단
						_tGrid?.closeSearchDropdownPopup();
						_tGrid.setProp('onlyEnterKeyEditEnd', false);
						return; // 이벤트 중단
					}

					// api 조회 결과
					if (res.data.list.length === 1) {
						handleDropdownClick(res.data.list[0]); // 드롭다운 데이터가 1개일 경우 바로 행 업데이트
					} else if (res.data.list.length > 0) {
						dropdownData = [...res.data.list]; // 드롭다운 데이터 설정
						_tGrid.openSearchDropdownPopup({
							dropdownConfig,
							dropdownData,
							handleDropdownClick,
							cellElementRect,
						});
						_tGrid.openInputer(); // input 편집 열기
					} else {
						renderer.onClick(event); // 드롭다운 데이터가 없을 경우 기본 검색 팝업 처리
					}
					_tGrid.setProp('onlyEnterKeyEditEnd', false); // 엔터 키 입력 시 다음 행으로 넘어가지 않게하는 옵션을 해제
				});
			}
		}
	});
}

/**
 *
 * @param _tGrid
 * @param _tProps
 */
export function bindCellEditBegin(_tGrid: any, _tProps: any) {
	_tGrid.bind('cellEditBegin', (event: any) => {
		bindCellEditBeginLogic(_tGrid, event);
	});
}

/**
 *
 * @param _tGrid
 * @param _tProps
 */
export function bindCellEditCancel(_tGrid: any, _tProps: any) {
	_tGrid.bind('cellEditCancel', (event: any) => {
		// 검색 드롭다운 닫기 ( 검색 드롭다운 열림 상태일 경우 닫기 )
		if (_tGrid?.state?.searchDropdownState?.visible) {
			_tGrid?.closeSearchDropdownPopup();
		}
	});
}

/**
 * 그리드 스크롤 이벤트 설정
 * @param _tGrid
 * @param _tProps
 */
function bindScroll(_tGrid: any, _tProps: any) {
	_tGrid.bind(['vScrollChange', 'hScrollChange'], (event: any) => {
		// 검색 드롭다운 닫기 처리
		if (_tGrid.state?.searchDropdownState?.visible) {
			if (event.target?.id !== 'dropdownTable' && event.target?.className !== 'aui-grid-dropdown-content') {
				_tGrid.closeSearchDropdownPopup();
			}
		}
	});
}

/**
 * 저장 전 데이터 검증
 * @param _tGrid
 * @returns {boolean} 데이터 검증 결과
 */
export function validateRequiredBeforeSave(_tGrid: any) {
	const changedData = _tGrid.getChangedData({ validationYn: false });

	if (!changedData || changedData.length < 1) {
		showAlert(null, t('msg.MSG_COM_VAL_020'));
		return false;
	}

	if (changedData.length > 0 && !_tGrid.validateRequiredGridData()) {
		return false;
	}

	return true;
}

/**
 * 그리드 데이터 추가 후 실행
 * @deprecated bind 메서드 중첩 가능하게 구현되어 사용하지 않음
 * @param _tGrid 타켓 그리드
 */
export function afterAppendData(_tGrid: any) {
	//loadGridStateByStaticUrl(_tGrid);
	//_tGrid.setSelectionByIndex(0); // 데이터 추가 후 첫번째 행 선택하나, 페이징 시 에도 첫번째 index를 누르고 있어 주석처리
}

/**
 * 그리드에서 특정 키 이벤트 처리 및 커스텀 이벤트 발생
 * @description 키 이벤트 처리는 useKeydown.tsx 에서 처리
 * @param {any} _tGrid 타켓 그리드
 * @param {any} event 키 이벤트
 * @param {string} key 키 이름 (F2, F8 등)
 * @returns {boolean} false
 */
function handleGridKeyEvent(_tGrid: any, event: any, key: string): boolean {
	// 기본 동작만 막고 커스텀 이벤트 발생
	event.orgEvent.preventDefault();

	const gridElement = document.querySelector(`#${_tGrid.state.id}`);
	const customEvent = new CustomEvent(`grid${key}KeyDown`, {
		detail: {
			gridId: _tGrid.state.id,
			gridElement: gridElement,
			orgEvent: event.orgEvent,
		},
	});
	window.dispatchEvent(customEvent);

	return false;
}

/**
 * 마지막 행 데이터 조회
 * @param _tGrid 타켓 그리드
 * @returns {any} 마지막 행 데이터
 */
export function getLastRowData(_tGrid: any) {
	const lastRowIndex = _tGrid.getRowCount() - 1;
	return _tGrid.getItemByRowIndex(lastRowIndex);
}

/**
 * 선택된 행이 마지막 행인지 체크
 * @param _tGrid 타켓 그리드
 * @returns {boolean} 선택된 행이 마지막 행인지 여부
 */
export function isSelectedLastRow(_tGrid: any) {
	const rowCount = _tGrid.getRowCount();
	const selectedRowIndex = _tGrid.getSelectedIndex()[0];

	return selectedRowIndex === rowCount - 1;
}

/**
 * 수정 ROW 체크박스 설정
 * @param {any} _tGrid 타겟 그리드
 * @param {any} rowIndex rowIndex
 * @param {boolean} noSetCellValue setCellValue 메소드 호출여부
 */
export function setCheckedRows(_tGrid: any, rowIndex?: number, noSetCellValue?: boolean) {
	const rowIdField =
		(_tGrid.getProp && _tGrid.getProp('rowIdField')) || _tGrid?.props?.gridProps?.['rowIdField'] || '_$uid';
	const addCheckedRows: any = [];

	if (commUtil.isNotEmpty(rowIndex)) {
		if (
			_tGrid.isAddedByRowIndex(rowIndex) ||
			_tGrid.isEditedByRowIndex(rowIndex) ||
			_tGrid.isRemovedByRowIndex(rowIndex)
		) {
			// 커스텀 체크박스 칼럼만 수정된 경우 변경된 DATA에서 제외
			const targetKeySet = new Set([
				_tGrid.getProp('rowIdField') || '_$uid',
				_tGrid.getProp('customRowCheckColumnDataField'),
			]);

			let result = [];
			if (_tGrid.isAddedByRowIndex(rowIndex)) {
				result = _tGrid.getAddedRowItems();
			} else {
				result = _tGrid.getEditedRowColumnItems();
			}
			result = result?.filter((obj: any) => {
				const objKeys = Object.keys(obj);
				return !(objKeys.length === targetKeySet.size && objKeys.every(key => targetKeySet.has(key)));
			});
			const exists = result?.some((item: any) => item[rowIdField] === _tGrid.indexToRowId(rowIndex));

			if (exists) {
				// 엑스트라 체크박스 비활성화 상태일때 아래 로직 제외
				if (commUtil.isNotEmpty(_tGrid.getProp('rowCheckDisabledFunction'))) {
					if (_tGrid.getProp('rowCheckDisabledFunction')(null, null, _tGrid.getItemByRowIndex(rowIndex))) {
						addCheckedRows.push(_tGrid.indexToRowId(rowIndex));
					}
				} else {
					addCheckedRows.push(_tGrid.indexToRowId(rowIndex));
				}
			}
		}
	} else {
		// 변경된 ROW
		_tGrid.getChangedData({ validationYn: false, andCheckedYn: !_tGrid.getProp('isRestore') })?.map((item: any) => {
			// 엑스트라 체크박스 비활성화 상태일때 아래 로직 제외
			if (commUtil.isNotEmpty(_tGrid.getProp('rowCheckDisabledFunction'))) {
				if (_tGrid.getProp('rowCheckDisabledFunction')(null, null, item)) {
					addCheckedRows.push(item[rowIdField]);
				}
			} else {
				addCheckedRows.push(item[rowIdField]);
			}
		});
	}

	// 엑스트라 체크박스 체크 설정
	if (addCheckedRows.length > 0) {
		_tGrid.addCheckedRowsByIdsBefore(addCheckedRows, rowIdField, noSetCellValue);
	}

	// 변경 해제된 Row 체크박스 해제
	if (rowIndex !== -1 && commUtil.isNotEmpty(rowIndex)) {
		const addUncheckedRows: any = [];
		const selItem = _tGrid.getItemByRowIndex(rowIndex);
		if (selItem && !addCheckedRows?.includes(selItem[rowIdField])) {
			addUncheckedRows.push(selItem[rowIdField]);
		}
		if (addUncheckedRows.length > 0) {
			_tGrid.addUncheckedRowsByIdsBefore(addUncheckedRows, rowIdField, noSetCellValue);
		}
	}
}

/**
 * 현재 선택된 셀 기준으로 컬럼 내 첫 번째 또는 마지막 셀로 이동
 * @param {any} _tGrid 타켓 그리드
 * @param type
 */
/**
 * 현재 선택된 셀 기준으로 컬럼 내 첫 번째 또는 마지막 셀로 이동
 * @param {any} _tGrid 타켓 그리드
 * @param {'first' | 'last'} type 이동할 위치 (first: 첫 번째 셀, last: 마지막 셀)
 */
export function moveToColumnCell(_tGrid: any, type: 'first' | 'last') {
	if (!_tGrid) return;

	const selectedIndex = _tGrid.getSelectedIndex();
	if (!selectedIndex || selectedIndex.length === 0) return;

	const [, columnIndex] = selectedIndex;

	if (type === 'first') {
		_tGrid.setSelectionByIndex(0, columnIndex);
	} else {
		const rowTotalCount = _tGrid.getRowCount();
		_tGrid.setSelectionByIndex(rowTotalCount - 1, columnIndex);
	}
}

/**
 * 현재 선택된 셀 기준으로 컬럼 내 첫 번째 또는 마지막 셀로 이동
 * @param {any} _tGrid 타켓 그리드
 * @param {'first' | 'last'} type 이동할 위치 (first: 첫 번째 셀, last: 마지막 셀)
 */
export function moveToColumnCellByPageUpDown(_tGrid: any, type: 'pageUp' | 'pageDown') {
	if (!_tGrid) return;

	const selectedIndex = _tGrid.getSelectedIndex();
	if (!selectedIndex || selectedIndex.length === 0) return;

	const [rowIndex, columnIndex] = selectedIndex;

	const rowTotalCount = _tGrid.getRowCount();

	const rowStep = 20; // 20개씩 이동 ( 임시 하드코딩 값  TODO: 제공하는 그리드 속성이 없기에 row개수 계산해서 이동하도록 )

	if (type === 'pageUp') {
		_tGrid.setSelectionByIndex(rowIndex - rowStep > 0 ? rowIndex - rowStep : 0, columnIndex);
	} else {
		_tGrid.setSelectionByIndex(
			rowIndex + rowStep < rowTotalCount ? rowIndex + rowStep : rowTotalCount - 1,
			columnIndex,
		);
	}
}

/**
 * 해당 index 의 rowStatus 상태값 조회
 * @param {any} _tGrid _tGrid 타겟 그리드
 * @param {number} rowIndex row index
 */
export function getRowStatusByIndex(_tGrid: any, rowIndex: number) {
	const rowIdField = _tGrid.props?.gridProps?.['rowIdField'] ?? '_$uid';
	const item = _tGrid.getItemByRowIndex(rowIndex);
	if (item) {
		const rowId = item[rowIdField]; // row 고유 id
		if (_tGrid.isAddedById(rowId)) return 'I'; // 신규
		if (_tGrid.isEditedById(rowId)) return 'U'; // 수정
		if (_tGrid.isRemovedById(rowId)) return 'D'; // 삭제(표시 중엔 보통 필요 없음)
	}
	return 'R'; // 원본(변경 없음)
}

/**
 *
 * @param _tGrid
 * @param type
 */
export function moveToRowByAllowUpDown(_tGrid: any, type: 'arrowUp' | 'arrowDown') {
	if (!_tGrid) return;

	const selectedIndex = _tGrid.getSelectedIndex();
	if (!selectedIndex || selectedIndex.length === 0) return;

	const [rowIndex, columnIndex] = selectedIndex;

	const rowTotalCount = _tGrid.getRowCount();

	const rowStep = 1; // 20개씩 이동 ( 임시 하드코딩 값  TODO: 제공하는 그리드 속성이 없기에 row개수 계산해서 이동하도록 )

	if (type === 'arrowUp') {
		_tGrid.setSelectionByIndex(rowIndex - rowStep > 0 ? rowIndex - rowStep : 0, columnIndex);
	} else {
		_tGrid.setSelectionByIndex(
			rowIndex + rowStep < rowTotalCount ? rowIndex + rowStep : rowTotalCount - 1,
			columnIndex,
		);
	}
}

/**
 * Function 병합
 * @param {any} funcs Function
 * @returns {any} 결과값
 */
function combineFunctions(funcs: any[]) {
	return function (event: any) {
		let result: any;
		funcs.forEach(fn => {
			result = fn && fn(event);
		});
		return result;
	};
}

/**
 * AUI그리드 bind 이벤트 선 처리
 * @param {any} _tGrid 대상 그리드
 * @param {string | string[]} name 이벤트명
 * @param {any} func FUNCTION
 * @returns {any} 결과값
 */
export function preBindFunc(_tGrid: any, name: string | string[], func: any) {
	// 콜백 처리
	if (func) {
		if (name === 'cellEditBegin') {
			return combineFunctions([
				function (event: any) {
					bindCellEditBeginLogic(_tGrid, event);
				},
				func,
			]);
		} else {
			return func;
		}
	}
}

/**
 * "bindCellEditBegin" 이벤트 선처리 로직
 * @param {any} _tGrid 타겟 그리드
 * @param {any} event 이벤트
 */
export function bindCellEditBeginLogic(_tGrid: any, event: any) {
	const collectChildColumns = (columns: any[], isHeader: boolean) => {
		for (const item of columns) {
			// 자식 칼럼도 컬럼레이아웃에 추가
			if (item.children && item.children.length > 0) {
				collectChildColumns(item.children, true);
			} else if (isHeader) {
				columnLayout.push(item);
			}
		}
	};

	const columnLayout = _tGrid.props.columnLayout;
	collectChildColumns(columnLayout, false);

	if (columnLayout?.find((col: any) => col.dataField === event.dataField)?.commRenderer?.type === 'search') {
		_tGrid.setProp('onlyEnterKeyEditEnd', true); // 엔터 키 입력 시 다음 행으로 넘어가지 않게하는 옵션을 설정 (검색 드롭다운을 위함 )
	} else if (columnLayout?.find((col: any) => col.dataField === event.dataField)?.renderer?.searchDropdownProps) {
		_tGrid.setProp('onlyEnterKeyEditEnd', true); // 엔터 키 입력 시 다음 행으로 넘어가지 않게하는 옵션을 설정 (검색 드롭다운을 위함 )
	}
}

/**
 * 동적 생성되는 칼럼 옵션 설정
 * @param {any} cItems 칼럼 목록
 * @returns {void} 결과값
 */
export function setColumnOption(cItems: any[]) {
	if (cItems && cItems?.length > 0) {
		for (const column of cItems) {
			// 라벨에 맞는 정렬 조건 설정
			let retStyle = 'ta-l';

			const alignTypeList = getTranslationList()?.flatMap((item: any) =>
				item.labelNm === column.headerText && item.alignType ? [item.alignType] : [],
			);

			if (alignTypeList?.length > 0) {
				retStyle = `ta-${alignTypeList[0].toLowerCase()}`;
			}

			if (commUtil.isEmpty(column.style)) {
				column.style = retStyle;
			} else {
				column.style = column.style + ` ${retStyle}`;
			}
		}
	}
}
