export const CARNO_RESTORE_FIELDS = [
	'carno',
	'pop',
	'contractType',
	'courier',
	'couriername',
	'caragentkey',
	'caragentname',
] as const;

type CarnoRestoreField = (typeof CARNO_RESTORE_FIELDS)[number];

type ApplyPopAndCarnoSelectionParams = {
	target?: any;
	selected: any;
};

type GetCarnoUpdateIndexesParams = {
	pastedOriCarno: any;
	pastedPriority?: any;
	allRows: any[];
	grid: any;
	rowIndex: number;
};

type ApplyCarnoSelectionWithChecksParams = {
	grid: any;
	selected: any;
	rowIndex: number;
	updateObj?: any;
	pastedOriCarno?: any;
	carnoRestoreFields?: readonly string[];
	onDuplicate?: () => void;
};

/**
 * 차량 변경 시 업데이트 대상 행 인덱스를 계산한다.
 * - 기본: 같은 (oriCarno + priority) 조합 행
 * - 대체: oriCarno가 없으면 체크된 행 기준
 * - 결과가 없으면 현재 행(rowIndex) 반환
 */
export const getCarnoUpdateIndexes = ({
	pastedOriCarno,
	pastedPriority,
	allRows,
	grid,
	rowIndex,
}: GetCarnoUpdateIndexesParams) => {
	const updateIndexes =
		pastedOriCarno != null
			? allRows.reduce((acc: number[], row: any, index: number) => {
					if (row?.oriCarno === pastedOriCarno && row?.priority === pastedPriority) {
						acc.push(index);
					}
					return acc;
			  }, [])
			: grid.getCheckedRowItems().map((item: any) => item.rowIndex);

	return updateIndexes.length ? updateIndexes : [rowIndex];
};

/**
 * 선택된 차량 정보를 연관 필드에 반영한다.
 * - 대상 필드: carno, pop, contractType, courier, couriername, caragentkey, caragentname
 * - target 객체(updateObj)에 값만 채운다.
 */
export const applyPopAndCarnoSelection = ({ target, selected }: ApplyPopAndCarnoSelectionParams) => {
	if (!selected) return;

	const valueByField: Record<CarnoRestoreField, any> = {
		carno: selected.code,
		pop: selected.name,
		contractType: selected.contractType,
		courier: selected.courier,
		couriername: selected.couriername,
		caragentkey: selected.caragentkey,
		caragentname: selected.caragentname,
	};

	if (target) {
		CARNO_RESTORE_FIELDS.forEach(field => {
			target[field] = valueByField[field];
		});
	}
};

/**
 * 차량 선택 반영의 메인 로직.
 * 1) (carno + priority) 기준 중복 검증
 * 2) 중복이면 onDuplicate 호출 후, 편집 행과 같은 (oriCarno + priority) 그룹 전체 원복
 * 3) (oriCarno + priority) 기준으로 업데이트 대상 행 계산
 * 4) 관련 필드 값이 실제로 바뀌는 행만 필터링해 일괄 업데이트
 */
export const applyCarnoSelectionWithChecks = ({
	grid,
	selected,
	rowIndex,
	updateObj,
	pastedOriCarno,
	carnoRestoreFields = CARNO_RESTORE_FIELDS,
	onDuplicate,
}: ApplyCarnoSelectionWithChecksParams) => {
	if (!grid || !selected) return false;

	const allRows = grid.getGridData?.() || [];
	const pastedCarno = selected?.code ?? updateObj?.carno;
	const rowIdField = grid.getProp?.('rowIdField') || '_$uid';
	const getRowId = (item: any) => item?.[rowIdField] ?? item?._$uid;
	const currentRowOriCarno = allRows[rowIndex]?.oriCarno;
	const currentRowPriority = allRows[rowIndex]?.priority;

	const hasDup =
		!!pastedCarno &&
		currentRowOriCarno !== pastedCarno &&
		(allRows.some(
			(row: any, index: number) =>
				index !== rowIndex && row?.priority === currentRowPriority && row?.oriCarno === pastedCarno,
		) ||
			allRows.some(
				(row: any, index: number) => index !== rowIndex && row?.priority === currentRowPriority && row?.carno === pastedCarno,
			));

	if (hasDup) {
		onDuplicate?.();
		const restoreIndexes = getCarnoUpdateIndexes({
			pastedOriCarno: allRows[rowIndex]?.oriCarno ?? grid.getCellValue(rowIndex, 'oriCarno'),
			pastedPriority: allRows[rowIndex]?.priority ?? grid.getCellValue(rowIndex, 'priority'),
			allRows,
			grid,
			rowIndex,
		});
		const restoreRowIds = restoreIndexes
			.map((index: number) => getRowId(grid.getItemByRowIndex(index)))
			.filter((id: any) => id != null);
		const checkedRowIds = grid
			.getCheckedRowItems()
			.map((item: any) => getRowId(item.item))
			.filter((id: any) => id != null);

		setTimeout(() => {
			grid.restoreEditedCells(restoreIndexes);
			restoreIndexes.forEach((index: number) => {
				const targetRowId = getRowId(grid.getItemByRowIndex(index));
				if (targetRowId == null) return;
				carnoRestoreFields.forEach(field => {
					grid.setCellValue(index, field, grid.getInitCellValue(targetRowId, field), true);
				});
			});
			grid.setCheckedRowsByIds(checkedRowIds.filter((id: any) => !restoreRowIds.includes(id)));
		}, 0);
		return false;
	}

	const effectiveIndexes = getCarnoUpdateIndexes({
		pastedOriCarno: pastedOriCarno ?? grid.getCellValue(rowIndex, 'oriCarno'),
		pastedPriority: allRows[rowIndex]?.priority ?? grid.getCellValue(rowIndex, 'priority'),
		allRows,
		grid,
		rowIndex,
	});

	const nextValuesByField: Record<string, any> = {
		carno: selected?.code ?? updateObj?.carno,
		pop: selected?.name ?? updateObj?.pop,
		contractType: selected?.contractType ?? updateObj?.contractType,
		courier: selected?.courier ?? updateObj?.courier,
		couriername: selected?.couriername ?? updateObj?.couriername,
		caragentkey: selected?.caragentkey ?? updateObj?.caragentkey,
		caragentname: selected?.caragentname ?? updateObj?.caragentname,
	};

	const filteredIndexes = effectiveIndexes.filter((index: number) =>
		carnoRestoreFields.some(field => allRows[index]?.[field] !== nextValuesByField[field]),
	);

	if (filteredIndexes.length === 0) {
		return true;
	}

	const updateData = filteredIndexes.map(() => {
		const nextUpdateObj = { ...(updateObj || {}) };
		applyPopAndCarnoSelection({ target: nextUpdateObj, selected });
		return nextUpdateObj;
	});

	grid.restoreEditedCells(filteredIndexes);
	grid.updateRows(updateData, filteredIndexes);
	return true;
};
