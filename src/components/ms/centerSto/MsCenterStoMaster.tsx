/*
 ############################################################################
 # FiledataField	: MsCenterStoSearch.tsx
 # Description		: 기준정보 > 센터기준정보 > 센터이체마스터
 # Author			: JeongHyeongCheol
 # Since			: 25.08.06
 ############################################################################
*/
// component
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';

// type
import { GridBtnPropsType } from '@/types/common';

// API Call Function
import { apiPostSaveMasterList } from '@/api/ms/apiMsCenterSto';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';

// lib
import GridAutoHeight from '@/components/common/GridAutoHeight';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
interface MsCenterStoMasterProps {
	changeMasterGrid?: any;
	priorityData?: any;
	gridData?: any;
	totalCnt?: any;
	search?: any;
}
const MsCenterStoMaster = forwardRef((props: MsCenterStoMasterProps, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const gridRef = ref;
	const { gridData, totalCnt, search } = props;
	const [popupType, setPopupType] = useState('dc');

	const refModalPop = useRef(null);
	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================
	const dailyDeadlineStoLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('DAILY_DEADLINE_STO', value)?.cdNm;
	};

	const setFromDccodeDropDown = () => {
		const selectedRow = gridRef.current.getSelectedItems()[0];

		if (!selectedRow.item.dcClosetype) {
			showMessage({
				content: '마감유형을 먼저 선택해주세요',
				modalType: 'info',
			});
			return false;
		}
		return true;
	};

	const setFromDccode = (e: any) => {
		if (!e.item.dcClosetype) {
			showMessage({
				content: '마감유형을 먼저 선택해주세요',
				modalType: 'info',
			});
			return;
		}
		refModalPop.current.handlerOpen();
	};

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'dcClosetype',
			headerText: '마감유형',
			cellMerge: true,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					if (item.status === 'new') {
						return {
							type: 'DropDownListRenderer',
							list: getCommonCodeList('DAILY_DEADLINE_STO'),
							keyField: 'comCd',
							valueField: 'cdNm',
						};
					}
				},
			},
			labelFunction: dailyDeadlineStoLabelFunc,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (commUtil.isNotEmpty(item.dcClosetype)) {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			required: true,
		},
		{
			dataField: 'fromPriority',
			headerText: '선순위',
			dataType: 'numeric',
			editable: false,
		},
		{
			headerText: '수급센터',
			children: [
				{
					dataField: 'fromDccode2600Nm',
					headerText: '이천',
					commRenderer: {
						type: 'search',
						align: 'left',
						iconPosition: 'right',
						popupType: 'dc',
						searchDropdownProps: {
							dataFieldMap: {
								fromDccode2600: 'code',
								fromDccode2600Nm: 'name',
							},
							isSearch: (values: any) => {
								const isDcClosetype = setFromDccodeDropDown();
								if (!isDcClosetype) return true;

								const isOk = confirmPopup(values);
								if (isOk) {
									refModalPop.current.handlerOpen();
									return true;
								}
								return false;
							},
						},
						onClick: function (e: any) {
							setFromDccode(e);
						},
					},
				},
				{
					dataField: 'fromDccode2620Nm',
					headerText: '수원',
					commRenderer: {
						type: 'search',
						align: 'left',
						iconPosition: 'right',
						popupType: 'dc',
						searchDropdownProps: {
							dataFieldMap: {
								fromDccode2620: 'code',
								fromDccode2620Nm: 'name',
							},
							isSearch: (values: any) => {
								const isDcClosetype = setFromDccodeDropDown();
								if (!isDcClosetype) return true;

								const isOk = confirmPopup(values);
								if (isOk) {
									refModalPop.current.handlerOpen();
									return true;
								}
								return false;
							},
						},
						onClick: function (e: any) {
							setFromDccode(e);
						},
					},
				},
				{
					dataField: 'fromDccode2630Nm',
					headerText: '수원2',
					commRenderer: {
						type: 'search',
						align: 'left',
						iconPosition: 'right',
						popupType: 'dc',
						searchDropdownProps: {
							dataFieldMap: {
								fromDccode2630: 'code',
								fromDccode2630Nm: 'name',
							},
							isSearch: (values: any) => {
								const isDcClosetype = setFromDccodeDropDown();
								if (!isDcClosetype) return true;

								const isOk = confirmPopup(values);
								if (isOk) {
									refModalPop.current.handlerOpen();
									return true;
								}
								return false;
							},
						},
						onClick: function (e: any) {
							setFromDccode(e);
						},
					},
				},
				{
					dataField: 'fromDccode2650Nm',
					headerText: '동탄',
					commRenderer: {
						type: 'search',
						align: 'left',
						iconPosition: 'right',
						popupType: 'dc',
						searchDropdownProps: {
							dataFieldMap: {
								fromDccode2650: 'code',
								fromDccode2650Nm: 'name',
							},
							isSearch: (values: any) => {
								const isDcClosetype = setFromDccodeDropDown();
								if (!isDcClosetype) return true;

								const isOk = confirmPopup(values);
								if (isOk) {
									refModalPop.current.handlerOpen();
									return true;
								}
								return false;
							},
						},
						onClick: function (e: any) {
							setFromDccode(e);
						},
					},
				},
				{
					dataField: 'fromDccode2660Nm',
					headerText: '동탄2',
					commRenderer: {
						type: 'search',
						align: 'left',
						iconPosition: 'right',
						popupType: 'dc',
						searchDropdownProps: {
							dataFieldMap: {
								fromDccode2660: 'code',
								fromDccode2660Nm: 'name',
							},
							isSearch: (values: any) => {
								const isDcClosetype = setFromDccodeDropDown();
								if (!isDcClosetype) return true;

								const isOk = confirmPopup(values);
								if (isOk) {
									refModalPop.current.handlerOpen();
									return true;
								}
								return false;
							},
						},
						onClick: function (e: any) {
							setFromDccode(e);
						},
					},
				},
				{
					dataField: 'fromDccode2230Nm',
					headerText: '장성',
					commRenderer: {
						type: 'search',
						align: 'left',
						iconPosition: 'right',
						popupType: 'dc',
						searchDropdownProps: {
							dataFieldMap: {
								fromDccode2230: 'code',
								fromDccode2230Nm: 'name',
							},
							isSearch: (values: any) => {
								const isDcClosetype = setFromDccodeDropDown();
								if (!isDcClosetype) return true;

								const isOk = confirmPopup(values);
								if (isOk) {
									refModalPop.current.handlerOpen();
									return true;
								}
								return false;
							},
						},
						onClick: function (e: any) {
							setFromDccode(e);
						},
					},
				},
				{
					dataField: 'fromDccode2260Nm',
					headerText: '양산',
					commRenderer: {
						type: 'search',
						align: 'left',
						iconPosition: 'right',
						popupType: 'dc',
						searchDropdownProps: {
							dataFieldMap: {
								fromDccode2260: 'code',
								fromDccode2260Nm: 'name',
							},
							isSearch: (values: any) => {
								const isDcClosetype = setFromDccodeDropDown();
								if (!isDcClosetype) return true;

								const isOk = confirmPopup(values);
								if (isOk) {
									refModalPop.current.handlerOpen();
									return true;
								}
								return false;
							},
						},
						onClick: function (e: any) {
							setFromDccode(e);
						},
					},
				},
			],
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		// groupingFields: ['dcClosetype', 'fromPriority'],
		editableOnGroupFields: true,
		enableCellMerge: true,
		cellMergeRowSpan: false,
		showBranchOnGrouping: false,
		enableRestore: true,
		isLegacyRemove: false,
		fillColumnSizeMode: false,
		keepColumnOrderOnGrouping: true,
		// softRemovePolicy: 'exceptNew',
		// useGroupingPanel: true,
		// softRemoveRowMode: false,
		isRestore: false,
	};

	const saveMasterList = () => {
		const params = gridRef.current.getChangedData({ validationYn: false });

		// 변경 데이터 확인
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		// validation
		if (!gridRef.current.validateRequiredGridData()) {
			return;
		}

		// 데이터 정제
		const editData: any = [];
		const isStop = params.some((item: any) => {
			let itemHasAnyValidFromDccode = false;

			for (const key in item) {
				// fromDccode 패턴의 키인지 확인
				if (key.startsWith('fromDccode') && key.length === 14) {
					const toDccode = key.slice(-4);

					const fromDccode = item[key]; // 수급센터 값

					// 값이 존재하는 경우 (유효성 통과)
					if (fromDccode) {
						// 이 item에서 유효한 fromDccode 값을 찾았음을 표시
						itemHasAnyValidFromDccode = true;

						// editData에 추가
						editData.push({
							toDccode: toDccode,
							fromDccode: item[key + 'Nm'] ? fromDccode : null,
							serialkey: item[key + 'Sk'] || null,
							dcClosetype: item.dcClosetype,
							fromPriority: item.fromPriority,
						});
					}
				} else if (key.startsWith('fromDccode')) {
					if (!item[key.slice(0, -2)] && item[key]) return true;
				}
			}

			// 이 item에 유효한 fromDccode가 하나도 없었다면 (오류 상황)
			if (!itemHasAnyValidFromDccode) {
				return true;
			}

			return false;
		});

		if (isStop) {
			showMessage({
				content: '수급센터를 확인해주세요',
				modalType: 'info',
			});
			return;
		}
		// 선순위 기준으로 소팅
		editData.sort((a: any, b: any) => a.fromPriority - b.fromPriority);

		// 저장하시겠습니까?
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(editData).then(() => {
				props.changeMasterGrid(params);
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: search,
				});
			});
		});
	};

	/**
	 * 행삽입
	 * @returns {void}
	 */
	const insertRow = () => {
		const selectedRowCur = gridRef.current.getSelectedRows();
		const selectedRowCurTmp = gridRef.current.getCheckedRowItems();
		const selectedRow = selectedRowCurTmp[0].item; // 체크된 첫 번째 행 가져오기

		if (!selectedRow) return; // 선택된 행이 없을 경우 처리
		let fromPriority = 0;
		let status = 'new';
		if (selectedRow.fromPriority) {
			fromPriority = Number(selectedRow.fromPriority);
			status = 'I';
		}
		const initValue = {
			dcClosetype: selectedRow.dcClosetype,
			fromPriority: fromPriority === 0 ? null : fromPriority + 1,
			status: status,
		};

		if (selectedRowCur && selectedRowCur.length > 0) {
			const addedRowIndex = selectedRowCurTmp[0]['rowIndex'] + 1;
			gridRef.current.addRow(initValue, addedRowIndex);
		} // 신규행 추가
		// gridRef.current.addRow(initValue, 'selectionDown');

		const allData = gridRef.current.getGridData();
		const rowsToUpdate = allData.filter(
			(row: any) => row.dcClosetype === initValue.dcClosetype && Number(row.fromPriority) >= initValue.fromPriority,
		);

		const rowIndexes = gridRef.current.getRowIndexesByValue('dcClosetype', [selectedRow.dcClosetype]);
		const updateData: any[] = [];
		const updateIndex: any[] = [];
		rowsToUpdate.forEach((row: any, index: any) => {
			const newPriority = initValue.fromPriority + index;
			const rowIndex = rowIndexes.find((rIndex: any) => allData[rIndex] === row);
			if (rowIndex !== undefined) {
				updateData.push({
					...row,
					fromPriority: newPriority,
				});
				updateIndex.push(rowIndex);
			}
		});
		gridRef.current.updateRows(updateData, updateIndex);
	};

	/**
	 * 행삭제
	 * @returns {void}
	 */
	const deleteRow = () => {
		// 1. 전체 그리드 데이터 가져오기
		const allData = gridRef.current.getGridData();

		// 2. 고유한 dcClosetype 목록 추출 (중복 제거)
		const uniqueCloseTypes = Array.from(new Set(allData.map((row: any) => row.dcClosetype)));

		const updateData: any[] = [];
		const updateIndexes: any[] = [];

		// 3. 각 타입별로 순회하며 Priority 재할당
		uniqueCloseTypes.forEach(type => {
			// 동일한 dcClosetype을 가진 행들만 필터링 후, 기존 priority 기준으로 정렬
			const sameTypeRows = allData
				.map((row: any, index: number) => ({ row, index })) // 원본 인덱스 유지
				.filter((item: any) => item.row.dcClosetype === type)
				.sort((a: any, b: any) => Number(a.row.fromPriority) - Number(b.row.fromPriority));

			// 4. 정렬된 순서대로 1번부터 다시 부여
			sameTypeRows.forEach((item: any, idx: number) => {
				const newPriority = idx + 1; // 1부터 시작

				// 값이 변해야 하는 경우에만 업데이트 목록에 추가
				if (item.row.fromPriority !== newPriority) {
					updateData.push({
						...item.row,
						fromPriority: newPriority,
					});
					updateIndexes.push(item.index);
				}
			});
		});

		// 5. 그리드 반영
		if (updateData.length > 0) {
			gridRef.current.updateRows(updateData, updateIndexes);
		}
	};

	// gridBtn set
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{ btnType: 'curPlus', isActionEvent: false, callBackFn: insertRow },
			{
				btnType: 'plus', // 행추가
				initValues: {
					status: 'new',
				},
			},
			{
				btnType: 'delete', // 행삭제
				callBackFn: deleteRow,
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * 창고팝업조회
	 * @param selectedRow
	 * @returns {void}
	 */
	const confirmPopup = useCallback(
		(selectedRow: any) => {
			const gridData = gridRef.current.getGridData();
			const getRowData = gridRef.current.getSelectedItems()[0];

			const dcClosetype = getRowData.item.dcClosetype;
			const dataField = getRowData.dataField;

			if (selectedRow.length === 0) {
				return true;
			}
			if (selectedRow.length > 1) {
				return false;
			}
			const isDuplicate = gridData.some((row: any) => {
				if (row.dcClosetype === dcClosetype && row[dataField.slice(0, -2)] === selectedRow[0].code) {
					return true;
				}
			});
			if (isDuplicate) {
				showMessage({
					content: '중복되지 않은 센터를 선택해주세요',
					modalType: 'info',
				});
				return true;
			} else {
				gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], dataField, selectedRow[0].name);
				gridRef.current.setCellValue(
					gridRef.current.getSelectedIndex()[0],
					dataField.slice(0, -2),
					selectedRow[0].code,
				);
			}
			refModalPop.current.handlerClose();
			return false;
		},
		[gridRef, refModalPop, showMessage],
	);

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refModalPop.current.handlerClose();
	};

	/**
	 * 선순위 자동 세팅
	 * @param event
	 * @returns {void}
	 */
	const setFromPriority = (event: any) => {
		const type = event.item.dcClosetype;
		const gridData = gridRef.current.getGridData();
		const rowsToUpdate = gridData.filter((row: any) => row.dcClosetype === type);
		const rowIndexes = gridRef.current.getRowIndexesByValue('dcClosetype', [type]);
		let fromPriority = 0;
		let rowIndex = 0;
		let updateData = {};
		rowsToUpdate.forEach((row: any, index: any) => {
			fromPriority += 1;
			rowIndex = rowIndexes.find((rIndex: any) => gridData[rIndex] === row);
			updateData = {
				...row,
				fromPriority: fromPriority,
			};
		});
		gridRef.current.updateRow(updateData, rowIndex);
	};

	const initEvent = () => {
		// 에디팅 시작 이벤트 바인딩
		gridRef.current.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRef.current.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField == 'dcClosetype') {
				if (event.item.status === 'I') {
					return false;
				}
				return gridRef.current.isAddedById(event.item[rowIdField]);
				// } else if (event.dataField !== 'fromPriority') {
				// 	refModalPop.current.handlerOpen();
				// 	return false;
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});

		// 마감유형에 따라 선순위 세팅
		gridRef.current.bind('cellEditEnd', function (event: any) {
			// 마감유형에 따른 선순위
			if (event.dataField === 'dcClosetype') {
				setFromPriority(event);
			}
		});
	};
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef.current) {
			gridRef.current?.setGridData(gridData);
			gridRef.current?.setSelectionByIndex(0, 0);
			if (gridData.length > 0) {
				const colSizeList = gridRef.current.getFitColumnSizeList(true);
				gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid style={{ marginTop: '15px' }}>
				<GridTopBtn gridBtn={gridBtn} gridTitle={'목록'} totalCnt={totalCnt} />
			</AGrid>
			<GridAutoHeight id="senter-sto-grid">
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</GridAutoHeight>
			<CustomModal ref={refModalPop} width="1000px">
				<CmSearchPopup type={popupType} callBack={confirmPopup} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default MsCenterStoMaster;
