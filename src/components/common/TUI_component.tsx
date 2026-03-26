/**
 * @module TUI_Component TUI Grid
 * @description TUI_Grid 공통 컴포넌트
 * @author Canal Frame <canalframe.cj.net>
 * @since 2023.10.31
 */

// Component

// CSS
import '@/lib/tui/tui-date-picker.scss';
import '@/lib/tui/tui-grid.scss';
// import 'tui-grid/dist/tui-grid.css';
import 'tui-time-picker/dist/tui-time-picker.css';

// Hook
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { MutableRefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

// Util
import { CheckboxRenderer } from '@/lib/tui/tui-renderer';
import commUtil from '@/util/commUtil';

// Lib
import { showAlert } from '@/util/MessageUtil';
import { t } from 'i18next';
import _ from 'lodash';
import Grid from 'tui-grid';

type TUIProps = {
	columns: Array<any> | any;
	options?: any;
	events?: Array<any>;
	autoFocus?: boolean;
	flexButton?: boolean;
	draggable?: boolean;
	bodyHeight?: string;
	columnKey?: string;
	onMounted?: any;
	selectedRow?: any;
	onSelect?: any;
};

const TUI = forwardRef((props: TUIProps, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const tuiGrid = useRef(null);

	const [instance, setInstance] = useState(null);
	const selectedRow: any = null;
	const { onMounted, autoFocus = true } = props;

	const defaultOption: any = {
		header: {
			height: 32,
		},
		usageStatistics: false,
		scrollX: true,
		scrollY: true,
		width: 'auto',
		rowHeight: 28,
		minRowHeight: 28,
		bodyHeight: 'inherit',
		minBodyHeight: 'inherit',
		heightResizable: false,
		shouldRefresh: false,
		editingEvent: 'dblclick', //'click' | 'dblclick'
		columnOptions: {
			resizable: true,
		},
		copyOptions: {
			useFormattedValue: true,
			useListItemText: true,
		},
		rowHeaders: [{ type: 'rowNum' }],
	};

	// const { t } = useTransition();

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const addRow = (row: Array<object> | object = {}, rowIndex = 'last') => {
		// for OCOM
		// rowIndex 행이 추가될 위치('first' 가장 위/'last' 가장 아래, 'selectionUp' 선택행 위/'selectionDown' 선택행 아래)
		let rowNum = 0; // 현재 선택행의 위치
		const focusRowNum = getFocusedRow()?._attributes?.rowNum ?? 0;
		if (focusRowNum === null || focusRowNum === undefined) {
			rowNum = getRowCount();
		} else {
			rowNum = focusRowNum - 1;
		}

		if (Array.isArray(row)) {
			row = row.map(r => {
				return { ...r, rowStatus: 'I' };
			});
		} else {
			row = { ...row, rowStatus: 'I' };
		}
		let insertOption: object = { focus: true && autoFocus };
		switch (rowIndex) {
			case 'first':
				// 가장 위에 추가
				insertOption = { ...insertOption, at: 0 };
				break;
			case 'selectionUp':
				// 선택한 행 위에 추가
				rowNum -= 1;
				insertOption = {
					...insertOption,
					at: rowNum,
				};
				break;
			case 'selectionDown':
				// 선택한 행 아래에 추가
				insertOption = {
					...insertOption,
					at: rowNum,
				};
				break;
			default:
				// 'last' 등 위에 기재된 옵션이 아닌 경우
				// insertOption = {
				// 	...insertOption,
				// 	at: getRowCount(),
				// };
				break;
		}

		if (Array.isArray(row)) {
			// 복수 행 추가
			instance?.appendRows(row, insertOption);
		} else {
			// 단일 행 추가
			instance?.appendRow(row, insertOption);
		}

		return instance?.getIndexOfRow(instance?.getFocusedCell().rowKey);
	};
	/**
	 * 트리형 그리드의 행 추가 시
	 * @param {object} row 추가할 행의 초기값
	 * @param {string} parentField 참고할 부모 행의 필드
	 * @param {string} rowIndex 행이 추가될 위치('first' 가장 위/'last' 가장 아래, 'selectionUp' 선택행 위/'selectionDown' 선택행 아래)
	 * @returns {number} rowkey
	 */
	const addTreeRow = (row = {}, parentField: string, rowIndex = 'last') => {
		const selectedItem = getFocusedRow() ?? null;

		if (selectedItem) {
			// 선택행이 있는 경우
			let parentItem = getAncestorRows(selectedItem.rowKey);
			parentItem = parentItem?.length ? parentItem[parentItem?.length - 1] : null;

			const setParentField = {
				...row,
				[parentField]: parentItem
					? parentItem[props.options.treeColumnOptions.name]
					: selectedItem[props.options.treeColumnOptions.name],
			};

			return addRow(setParentField, 'selectionDown');
		} else {
			// 선택행이 없는 경우(최상위)
			return addRow(row, rowIndex);
		}
	};

	const getAncestorRows = (rowKey: number) => {
		return instance?.getAncestorRows(rowKey);
	};
	const removeRow = (rowKey: number) => {
		instance?.removeRow(rowKey);
	};

	const bindEvent = (functionName: any, param: any) => {
		if (typeof instance?.value[functionName] === 'function') {
			// 그리드의 함수인 경우
			param ? instance?.value[functionName](...param) : instance?.value[functionName]();
		} else {
			functionName(param);
		}
	};

	const bindButtons = (buttonList: Array<any>) => {
		// for OCOM
		// 버튼정보가 없는 경우 반환
		if (!!!buttonList) {
			return;
		}
		// return Object.keys(buttonList).map((button: any) => {});
		return Object.keys(buttonList);
	};

	const focus = (rowKey: number, columnName: string, setScroll = true) => {
		instance?.focus(rowKey, columnName, setScroll);
	};

	const focusAt = (rowIndex = 0, columnIndex = 0) => {
		instance?.focusAt(rowIndex, columnIndex, true);
	};

	/**
	 * 초기 rowStatus 값을 위한 데이터 merge
	 * @returns {object} getData + getChangedData 데이터 값
	 */
	const getMergeData = () => {
		// 변경 없는 데이터 U 추가
		const mergeData = instance
			.getData()
			.filter((item: any) => {
				return (
					getChangedData().findIndex(el => {
						return item.rowKey === el.rowKey;
					}) === -1
				);
			})
			.map((el: any) => {
				el.rowStatus = 'U';
				return el;
			});
		return _.unionBy(mergeData, getChangedData());
	};

	const getChangedData = (gridRef: MutableRefObject<any> = null, addOpt?: object) => {
		const gridInstance = commUtil.isEmpty(gridRef) ? instance : gridRef.current.instance;

		const createData = gridInstance?.getModifiedRows().createdRows;
		const updateData = gridInstance?.getModifiedRows().updatedRows;
		const deleteData = gridInstance?.getModifiedRows().deletedRows;

		createData.map((data?: any) => {
			data.rowStatus = 'I';
		});

		updateData.map((data?: any) => {
			data.rowStatus = 'U';
		});

		deleteData.map((data?: any) => {
			data.rowStatus = 'D';
		});

		// return concat(createData, updateData, deleteData);
		return [...createData, ...updateData, ...deleteData];
	};

	const getChangedDataObject = () => {
		const insertData = instance?.getModifiedRows().createdRows;
		const updateData = instance?.getModifiedRows().updatedRows;
		const deleteData = instance?.getModifiedRows().deletedRows;

		insertData.map((data?: any) => {
			data.rowStatus = 'I';
		});

		updateData.map((data?: any) => {
			data.rowStatus = 'U';
		});

		deleteData.map((data?: any) => {
			data.rowStatus = 'D';
		});

		return {
			insertData: insertData,
			updateData: updateData,
			deleteData: deleteData,
		};
	};

	/**
	 * 컬럼의 validate 옵션을 기준으로 검증한다.
	 * @param {*} gridRef 검증할 그리드의 ref(optional)
	 * @returns {boolean} 검증 결과
	 */
	const validateRequiredGridData = (gridRef: MutableRefObject<any> = null) => {
		const gridInstance = commUtil.isEmpty(gridRef) ? instance : gridRef.current.instance;

		// AUI랑 sync..
		const validateResult = gridInstance?.validate();

		if (commUtil.nvl(validateResult.length, 0) > 0) {
			const columnName = validateResult[0].errors[0].columnName;
			const header = gridInstance?.store.column.allColumnMap[columnName].header;

			const errorCode = validateResult[0].errors[0].errorCode[0];

			switch (errorCode) {
				case 'REQUIRED':
					showAlert('', t('com.msg.requiredInput', [header]), false);
					gridInstance?.focus(validateResult[0].rowKey);
					break;
				case 'TYPE_NUMBER':
					showAlert('', t('com.msg.placeholder1', [t('com.tui.number')]), false);
					gridInstance?.focus(validateResult[0].rowKey);
					break;
				default:
					showAlert('', t('com.msg.placeholder1', [header]), false);
					gridInstance?.focus(validateResult[0].rowKey);
					break;
			}
			return false;
		}
		return true;
	};

	/**
	 * 추가된 데이터를 대상으로 중복 값 체크
	 * @param {Array} columnNames 중복 검사 대상 컬럼 list
	 * @param {*} gridRef 중복 검사 대상 Grid Ref
	 * @returns {boolean} 중복 검사 결과
	 */
	const checkDuplicateValue = (columnNames: string[], gridRef: MutableRefObject<any> = null) => {
		const gridInstance = commUtil.isEmpty(gridRef) ? instance : gridRef.current.instance;
		const changedData = getChangedData();
		if (commUtil.isEmpty(changedData)) {
			return true;
		}

		for (const columnName of columnNames) {
			const header = gridInstance?.store.column.allColumnMap[columnName].header;
			const allColumnValues = gridInstance?.getColumnValues(columnName);

			for (const row of changedData) {
				if (allColumnValues.filter((columnValue: string) => columnValue === row[columnName]).length > 1) {
					showAlert('', t('com.msg.duplication', [header]), false);
					gridInstance?.focus(row.rowKey);
					return false;
				}
			}
		}
		return true;
	};

	// Grid Export Excel
	const exportToXlsxGrid = (params: object = {}) => {
		const options = {
			includeHeader: true,
			fileName: 'myExport',
			...params,
		};
		instance?.export('xlsx', options);
	};

	const getCurrRowState = (rowKey: number) => {
		// rowNumber 행의 상태
		if (Number.isInteger(rowKey)) {
			const res = getChangedData().filter(data => data.rowKey === rowKey);
			if (res.length > 0) {
				return res[0].rowStatus;
			} else {
				return '';
			}
		} else {
			return '';
		}
	};

	const resetData = (data: Array<object>) => {
		instance?.resetData(data);
		if (data?.length > 0 && autoFocus) {
			focusAt(0, 0);
		}
	};

	/**
	 * event listener 영역
	 * @param {Function} listener onClick 이벤트 리스너
	 */
	const offClick = (listener: any) => {
		instance?.off('click', listener);
	};
	const onClick = (listener: any) => {
		instance?.on('click', listener);
	};
	const offDoubleClick = (listener: any) => {
		instance?.on('dblclick', listener);
	};
	const onDoubleClick = (listener: any) => {
		instance?.on('dblclick', listener);
	};
	// rowHeader checkbox 선택 시
	const onCheckAll = (listener: any) => {
		instance?.on('checkAll', listener);
	};
	const editingFinish = (listener: any) => {
		instance?.on('editingFinish', listener);
	};
	// rowHeader checkbox 해제 시
	const onUncheckAll = (listener: any) => {
		instance?.on('uncheckAll', listener);
	};
	const onScrollEnd = (listener: any) => {
		instance?.on('scrollEnd', listener);
	};
	const beforeChange = (listener: any) => {
		instance?.on('beforeChange', listener);
	};
	const afterChange = (listener: any) => {
		instance?.on('afterChange', listener);
	};
	const editingStart = (listener: any) => {
		instance?.on('editingStart', listener);
	};
	const focusChange = (listener: any) => {
		instance?.on('focusChange', listener);
	};
	const mouseout = (listener: any) => {
		instance?.on('mouseout', listener);
	};
	const onGridMounted = (listener: any) => {
		instance?.on('onGridMounted', listener);
	};
	const onGridUpdated = (listener: any) => {
		instance?.on('onGridUpdated', listener);
	};

	// 그리드 rowkey에 단일필드 값 지정
	const setValue = (rowKey: number, columnName: string, rowData: object) => {
		instance?.setValue(rowKey, columnName, rowData);
	};

	// 그리드 rowkey에 여러필드 값 지정
	const setRow = (rowKey: number, rowData: object) => {
		instance?.setRow(rowKey, rowData);
	};

	const blur = () => {
		instance?.blur();
	};

	const getData = () => {
		return instance?.getData();
	};
	const getValue = (rowKey: number, columnName: string) => {
		return instance?.getValue(rowKey, columnName);
	};
	const getFocusedCell = () => {
		return instance?.getFocusedCell();
	};

	const getFocusedRow = () => {
		const rowKey = instance?.getFocusedCell().rowKey;
		return { ...instance?.getRow(instance?.getFocusedCell().rowKey), rowKey };
	};

	const getCheckedRows = () => {
		return instance?.getCheckedRows();
	};

	const getCheckedRowKeys = () => {
		return instance?.getCheckedRowKeys();
	};

	const getInstance = () => {
		return instance;
	};

	const finishEditing = (rowKey: number, columnName: string, value: any) => {
		instance?.finishEditing(rowKey, columnName, value);
	};

	const checkAll = () => {
		instance?.checkAll();
	};

	const uncheckAll = () => {
		instance?.uncheckAll();
	};

	const getRowCount = () => {
		return instance?.getRowCount() ?? 0;
	};

	const isModified = () => {
		return instance?.isModified();
	};

	const disable = () => {
		instance?.disable();
	};

	const clearGridData = () => {
		if (instance) {
			instance?.setHeight('auto');
			instance?.refreshLayout();
		}
	};

	const setupRowHeaders = () => {
		// for OCOM. rowHeaders의 옵션 병합 및 헤더의 checkbox 렌더링
		const gridOption: any = Object.assign({}, defaultOption, props.options);

		if (!commUtil.isEmpty(props.options) && props.options.rowHeaders) {
			gridOption.rowHeaders = [...defaultOption.rowHeaders, ...props.options.rowHeaders];

			gridOption.rowHeaders = gridOption.rowHeaders.map((header: any) => {
				switch (header.type) {
					case 'checkbox':
						return {
							...header,
							header: `<label for="all-checkbox" class="grid-checkbox">
  							<input type="checkbox" id="all-checkbox" class="hidden-input" name="_checked" />
  						</label>`,
							width: 70,
							renderer: {
								type: CheckboxRenderer,
								options: {
									columnName: header.columnName,
								},
							},
						};
					default:
						return { ...header };
				}
			});
		}
		return gridOption;
	};

	// required column의 header * masking
	const maskRequiredColumnHeader = (columns: Array<any>) => {
		setTimeout(() => {
			/**
			 * TUI Grid에서 <th> 헤더들끼리 속성, Class를 공유하여
			 * masking이 지정된 컬럼 이외에 산발적으로 생성되는 이슈 발생
			 * (해결) mount 시 지정되어있는 isRequired Attribute를 모두 false로 세팅한 다음
			 *       required 컬럼만 true 전환하는 로직 수행
			 */
			Array.prototype.forEach.call(tuiGrid.current?.querySelectorAll(`th[isRequired='true']`) ?? [], node => {
				node.setAttribute('isRequired', false);
			});
			columns.map(el => {
				if (el.required || (el.validation && el.validation?.required)) {
					tuiGrid.current?.querySelector(`th[data-column-name=${el.name}]`).setAttribute('isRequired', true);
				}
			});
		}, 10);
	};

	/**
	 * blur 처리용 eventHandler
	 * @param {object} e blur event
	 * @returns {void}
	 */
	const clickHandler = (e: any) => {
		if (commUtil.isNotEmpty(instance)) {
			if (!e.target?.classList?.value.includes('tui')) {
				const { rowKey, columnName } = getFocusedCell();
				// 편집 중일 때, 값 저장 후 편집 종료
				instance?.finishEditing(rowKey, columnName);
				// instance?.blur();
			}
			if (e.target?.classList?.value.includes('ant-tabs-tab-btn')) {
				// clearGridData();
			}
		}
	};

	/**
	 * grid blur 처리
	 * @param {object} e blur event
	 * 	 			 e.realtedTarget: focus된 element
	 * 				 e.target: blur된 element
	 * isTuiTag: false일 때, tui grid에서 blur됨
	 */
	const onBlurEvent = (e: any) => {
		let isTuiTag = true;
		if (e.relatedTarget !== null) {
			// focus된 element가 tui grid의 element인지 판별
			isTuiTag = e.relatedTarget?.classList?.value?.includes('tui') ? true : false;
			if (
				e.target?.classList?.value.includes('tui-grid-datepicker-input') ||
				e.target?.classList?.value.includes('tui-timepicker-select')
			) {
				// tui grid datepicker 요소가 선택된 경우 blur 처리
				isTuiTag = true;
			}
		} else {
			// tui grid selectbox의 li가 선택된 경우 예외처리
			if (!e.target?.classList?.value.includes('tui-select-box-item')) {
				isTuiTag = false;
			}
			if (e.target?.classList?.value.includes('tui-grid-datepicker-input')) {
				// tui grid datepicker의 버튼 요소가 선택되었을 때, blur 처리하지 않음.
				isTuiTag = true;
			} else {
				isTuiTag = e.target?.classList?.value?.includes('tui') ? true : false;
			}
		}
		// isTuiTag = true;
		if (!isTuiTag) {
			const { rowKey, columnName } = getFocusedCell();
			// 편집 중일 때, 값 저장 후 편집 종료
			instance?.finishEditing(rowKey, columnName);
			// instance?.blur();
		}
	};

	/**
	 * grid onClick blur 처리
	 * @param {object} e blur event
	 * e.target: click된 element
	 * isTuiTag: false일 때, tui grid에서 blur됨
	 */
	const onClickEvent = (e: any) => {
		let isTuiTag = true;
		if (e.target?.classList?.value.includes('tui-select-box-item')) {
			isTuiTag = false;
		}
		if (
			e.target?.classList?.value.includes('tui-calendar-date') &&
			e.target?.classList?.value.includes('tui-is-selectable') &&
			e.target?.classList?.value.includes('tui-is-selected')
		) {
			isTuiTag = false;
		}

		if (e.target?.classList?.value.includes('tui-grid-cell-content')) {
			isTuiTag = true;
		}
		if (!isTuiTag) {
			// isTuiTag = true;
			const { rowKey, columnName } = getFocusedCell();
			// 편집 중일 때, 값 저장 후 편집 종료
			instance?.finishEditing(rowKey, columnName);
			// instance?.blur();
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		// Mount
		const options = {
			el: tuiGrid.current,
			columns: props.columns,
			draggable: props.draggable ?? false,
			editingEvent: 'click',
			rowHeaders: [
				{
					type: 'rowNum',
				},
			],
			bodyHeight: props.bodyHeight,
		};

		// option merge
		const assignedOptions: any = Object.assign({}, options, defaultOption, props.options);
		// row header에 checkbox가 포함되어있을 때, header,renderer 요소 추가
		const checkboxIndex = assignedOptions?.rowHeaders?.findIndex((h: any) => h.type === 'checkbox') ?? -1;

		if (checkboxIndex !== -1) {
			assignedOptions.rowHeaders[checkboxIndex] = {
				type: 'checkbox',
				header: `<label for="all-checkbox" class="grid-checkbox">
                    <input type="checkbox" id="all-checkbox" class="hidden-input" name="_checked" />
                  </label> `,
				renderer: {
					type: CheckboxRenderer,
					options: {
						columnName: 'checkStatus',
						...(assignedOptions?.rowHeaders?.options ?? {}),
					},
				},
			};
		}
		setInstance(new Grid(assignedOptions));
		// Get row header checkbox EL
		const rowHeaderCheckBox: HTMLInputElement = document.querySelector('#all-checkbox');

		// row header checkbox change event handler
		const handleCheckAll = () => {
			if (rowHeaderCheckBox.checked) {
				instance?.checkAll();
			} else {
				instance?.uncheckAll();
			}
		};

		//rowHeader에 checkbox가 존재하는 경우
		if (!commUtil.isEmpty(rowHeaderCheckBox)) {
			// add row header checkbox change event handler
			rowHeaderCheckBox.addEventListener('change', handleCheckAll);
		}

		// required column의 header * masking
		maskRequiredColumnHeader(assignedOptions.columns);

		// TO-DO
		// window.addEventListener('resize', clearGridData);

		return () => {
			// Unmount
			setInstance(null);

			if (!commUtil.isEmpty(rowHeaderCheckBox)) {
				// remove row header checkbox change event handler
				rowHeaderCheckBox.removeEventListener('change', handleCheckAll);
			}

			// window.removeEventListener('resize', clearGridData);

			// grid event listener 제거
			// const events = props.events;
			// if (commUtil.isNotEmpty(events)) {
			//   events.forEach((e) => {
			//     instance?.off(e.event, e.listener);
			//   });
			// }
		};
	}, []);

	/**
	 * 부모 컴포넌트로 ref를 통해 아래 함수들을 사용할 수 있도록 공개한다.
	 */
	useImperativeHandle(ref, () => ({
		instance,
		addRow,
		addTreeRow,
		removeRow,
		bindEvent,
		bindButtons,
		focusAt,
		exportToXlsxGrid,
		checkDuplicateValue,
		getChangedData,
		getChangedDataObject,
		getCurrRowState,
		validateRequiredGridData,
		resetData,
		offClick,
		onClick,
		offDoubleClick,
		onDoubleClick,
		onCheckAll,
		editingFinish,
		onUncheckAll,
		onScrollEnd,
		beforeChange,
		afterChange,
		editingStart,
		focusChange,
		mouseout,
		onGridMounted,
		onGridUpdated,
		setValue,
		setRow,
		blur,
		getData,
		getValue,
		getFocusedCell,
		getFocusedRow,
		getCheckedRowKeys,
		getCheckedRows,
		isModified,
		checkAll,
		uncheckAll,
		focus,
		disable,
		getInstance,
		finishEditing,
		getRowCount,
		clearGridData,
		setupRowHeaders,
		getMergeData,
	}));

	/**
	 * grid instance mount 시 상위 컴포넌트 콜백 함수 호출
	 */
	useEffect(() => {
		window.addEventListener('click', clickHandler);
		if (commUtil.isNotEmpty(instance)) {
			if (commUtil.isNotEmpty(onMounted)) {
				onMounted(instance);
			}
			// 행 추가 시, 수정불가 컬럼 수정가능하게 변경
			onDoubleClick((event: any) => {
				if (event.rowKey > -1 && instance?.getRow(event.rowKey).rowStatus === 'I') {
					const selectedField = instance?.getColumn(event.columnName);
					if (selectedField.disabled) {
						instance?.enableCell(event.rowKey, event.columnName);
					}
				}
			});
			focusChange(async (e: any) => {
				// selectedRow = instance?.getRow(e.rowKey);
				if (props.columnKey || props.onSelect) {
					if (e.rowKey > -1) {
						if (props.columnKey) {
							// 1-1. columnKey가 있는 경우 props.onSelect 함수 발생
							const columns = props.columnKey.replace(/'/g, '').split('|');
							const result = await Promise.all(
								columns.map(column => {
									return instance?.getValue(e.rowKey, column) ?? '';
								}),
							);
							// 1-2. columnKey가 하나인 경우 string으로 반환(...result)
							//      columnKey가 여러 개인 경우 array로 반환
							if (props.onSelect) {
								const res = result?.length > 1 ? await props.onSelect(result) : await props.onSelect(...result);
							}
						}
					}
				}
			});
		}
		return () => {
			window.removeEventListener('click', clickHandler);
		};
	}, [instance]);

	useDidMountEffect(() => {
		instance?.setColumns(props.columns);
	}, [props.columns]);

	return <div ref={tuiGrid} onBlur={e => onBlurEvent(e)} onClick={onClickEvent}></div>;
});

export default TUI;
// onBlur={e => onBlurEvent(e)}
