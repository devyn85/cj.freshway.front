/**
 * PopGrid 저장 로직 헬퍼 함수 모음
 * saveMngList의 Cognitive Complexity를 낮추기 위해 분리
 */
import dayjs, { Dayjs } from 'dayjs';

const DEFAULT_END_DATE = '29991231';
const FORMAT = 'YYYYMMDD';

// ── 공통 유틸 ──

export const normYmd = (v: any): string =>
	String(v ?? '')
		.replaceAll('-', '')
		.replaceAll('/', '');

export const ymd = (v: any): Dayjs => dayjs(normYmd(v), FORMAT, true);

/**
 * 두 기간이 겹치는지 판별
 * @param aFrom
 * @param aTo
 * @param bFrom
 * @param bTo
 */
export const hasDateOverlap = (aFrom: Dayjs, aTo: Dayjs, bFrom: Dayjs, bTo: Dayjs): boolean => {
	return !(aTo.isBefore(bFrom, 'day') || bTo.isBefore(aFrom, 'day'));
};

/**
 * 자동조정 시 기존행의 조정된 종료일 계산
 * @param newStart
 * @param existingFromDate
 * @param todayPlus2
 * @param todayPlus3
 */
export const calcAdjustedEndDate = (
	newStart: Dayjs,
	existingFromDate: string,
	todayPlus2: Dayjs,
	todayPlus3: Dayjs,
): string => {
	let adjustedEndDate: string;
	if (newStart.isSameOrAfter(todayPlus3)) {
		adjustedEndDate = newStart.subtract(1, 'day').format(FORMAT);
	} else {
		adjustedEndDate = todayPlus2.format(FORMAT);
	}

	// toDate는 최소한 fromDate 이상이 되도록 보정
	const existingStart = dayjs(existingFromDate, FORMAT);
	const adjustedEnd = dayjs(adjustedEndDate, FORMAT);
	if (existingStart.isValid() && adjustedEnd.isValid() && adjustedEnd.isBefore(existingStart)) {
		adjustedEndDate = existingFromDate;
	}

	return adjustedEndDate;
};

// ── 저장 컨텍스트 ──

export interface SaveContext {
	grid: any;
	gridRef: React.RefObject<any>;
	checkedItems: any[];
	allItems: any[];
	today: Dayjs;
	todayPlus2: Dayjs;
	todayPlus3: Dayjs;
	endOfTime: Dayjs;
	existingItems: any[];
	iuItems: any[];
	newUpdatedNotDeleteTargetItems: any[];
	isDeleteTarget: (item: any) => boolean;
	t: (key: string) => string;
}

// ── 1단계: 사전 유효성 검사 ──

/**
 * 1-1: 필수값 검사
 * @param ctx
 */
const validateRequiredFields = (ctx: SaveContext): boolean => {
	const { checkedItems, grid, allItems, t } = ctx;

	if (!checkedItems || checkedItems.length < 1) {
		showAlert(null, t('msg.MSG_COM_VAL_020'));
		return false;
	}

	if (!grid.validateRequiredGridData()) {
		return false;
	}

	const hasAtLeastOneBasePop = allItems.some((item: any) => item.baseYn === 'Y');
	if (!hasAtLeastOneBasePop) {
		showAlert(null, '기본 대표 POP는 최소 1개 이상 Y로 설정되어야 합니다.');
		return false;
	}

	return true;
};

/**
 * 1-2-1: baseYn='Y' 신규/수정행끼리 기간 겹침 검사
 * @param ctx
 */
const checkBaseYnDateOverlap = (ctx: SaveContext): boolean => {
	const items = ctx.newUpdatedNotDeleteTargetItems.filter((item: any) => item.baseYn === 'Y');

	for (let i = 0; i < items.length; i++) {
		for (let j = i + 1; j < items.length; j++) {
			const aStart = dayjs(items[i].fromDate, FORMAT);
			const aEnd = dayjs(items[i].toDate, FORMAT);
			const bStart = dayjs(items[j].fromDate, FORMAT);
			const bEnd = dayjs(items[j].toDate, FORMAT);

			if (hasDateOverlap(aStart, aEnd, bStart, bEnd)) {
				showAlert(null, '신규 및 수정된 기본 대표 POP의 적용일자가 겹칠 수 없습니다.');
				return false;
			}
		}
	}
	return true;
};

/**
 * 1-2-2: 같은 popNo끼리 기간 겹침 검사
 * @param ctx
 */
const checkPopNoDateOverlap = (ctx: SaveContext): boolean => {
	const items = ctx.newUpdatedNotDeleteTargetItems;
	const popNoGroups = new Map<string, any[]>();

	for (const item of items) {
		if (!popNoGroups.has(item.popNo)) {
			popNoGroups.set(item.popNo, []);
		}
		popNoGroups.get(item.popNo)!.push(item);
	}

	for (const [popNo, group] of popNoGroups) {
		if (group.length <= 1) continue;
		for (let i = 0; i < group.length; i++) {
			for (let j = i + 1; j < group.length; j++) {
				const aStart = dayjs(group[i].fromDate, FORMAT);
				const aEnd = dayjs(group[i].toDate, FORMAT);
				const bStart = dayjs(group[j].fromDate, FORMAT);
				const bEnd = dayjs(group[j].toDate, FORMAT);

				if (hasDateOverlap(aStart, aEnd, bStart, bEnd)) {
					showAlert(null, `신규 및 수정된 대표 POP 번호 \n '${popNo}'의 적용일자가 겹칠 수 없습니다.`);
					return false;
				}
			}
		}
	}
	return true;
};

/**
 * 1-2-3: 신규/수정 행이 기존 행 기간에 완전 포함되는지 검사
 * @param ctx
 */
const checkFullyContained = (ctx: SaveContext): boolean => {
	const { newUpdatedNotDeleteTargetItems, existingItems } = ctx;

	for (const newItem of newUpdatedNotDeleteTargetItems) {
		for (const existingItem of existingItems) {
			if (newItem.popNo !== existingItem.popNo) continue;
			if (newItem._$uid && existingItem._$uid && newItem._$uid === existingItem._$uid) continue;

			const newStart = dayjs(newItem.fromDate, FORMAT);
			const newEnd = dayjs(newItem.toDate, FORMAT);
			const exStart = dayjs(existingItem.fromDate, FORMAT);
			const exEnd = dayjs(existingItem.toDate, FORMAT);

			const isFullyContained = exStart.isSameOrBefore(newStart, 'day') && exEnd.isSameOrAfter(newEnd, 'day');
			if (isFullyContained) {
				showAlert(null, `대표 POP 번호 '${newItem.popNo}'의 \n 적용기간이 기존 적용기간에 완전히 포함됩니다.`);
				return false;
			}
		}
	}
	return true;
};

/**
 * 1-2-4: 기존 baseYn='Y' fromDate≥오늘+3 존재 시 신규 baseYn='Y' 추가 차단
 * @param ctx
 */
const checkExistingBaseYnBlock = (ctx: SaveContext): boolean => {
	const { allItems, checkedItems, todayPlus3, isDeleteTarget } = ctx;

	const uExistingBaseYnYItems = allItems
		.filter((item: any) => item.rowStatus === 'R' || item.rowStatus === 'U')
		.filter((item: any) => !isDeleteTarget(item))
		.filter((item: any) => item.baseYn === 'Y')
		.filter((item: any) => dayjs(item.fromDate, FORMAT).isSameOrAfter(todayPlus3, 'day'));

	const iBaseYnItems = checkedItems.filter((item: any) => item.baseYn === 'Y' && item.rowStatus === 'I');

	if (uExistingBaseYnYItems.length > 0 && iBaseYnItems.length > 0) {
		const textObj = uExistingBaseYnYItems[0];
		showAlert(
			null,
			`기본 대표 POP (Y)가 오늘+3 부터 등록된 \n 기본 대표 POP가 존재합니다.\n 해당 기본 대표 POP 삭제 후 등록 가능 합니다. \n\n ${textObj?.popName}(${textObj?.popNo})`,
		);
		return false;
	}
	return true;
};

/**
 * 1-2-5: 같은 popNo가 오늘+3부터 기존 데이터 존재 시 차단
 * @param ctx
 */
const checkExistingPopNoBlock = (ctx: SaveContext): boolean => {
	const { allItems, checkedItems, todayPlus3, isDeleteTarget } = ctx;

	const newPopNoSet = new Set(
		checkedItems
			.filter((item: any) => item.rowStatus === 'I')
			.map((item: any) => item.popNo)
			.filter(Boolean),
	);

	if (newPopNoSet.size === 0) return true;

	const blocked = allItems
		.filter((item: any) => item.rowStatus === 'R' || item.rowStatus === 'U')
		.filter((item: any) => !isDeleteTarget(item))
		.filter((item: any) => dayjs(item.fromDate, FORMAT).isSameOrAfter(todayPlus3, 'day'))
		.filter((item: any) => item.popNo && newPopNoSet.has(item.popNo));

	if (blocked.length > 0) {
		const textObj = blocked[0];
		showAlert(
			null,
			`같은 POP 번호가 오늘+3 부터 등록된 데이터가 존재합니다.\n` +
				`해당 POP 삭제 후 등록가능 합니다.\n\n` +
				`${textObj?.popName ?? ''}(${textObj?.popNo})`,
		);
		return false;
	}
	return true;
};

/**
 * 1단계 전체: 자동조정 전 유효성 검사
 * @param ctx
 */
export const validateBeforeAutoAdjust = (ctx: SaveContext): boolean => {
	if (!validateRequiredFields(ctx)) return false;
	if (!checkBaseYnDateOverlap(ctx)) return false;
	if (!checkPopNoDateOverlap(ctx)) return false;
	if (!checkFullyContained(ctx)) return false;
	if (!checkExistingBaseYnBlock(ctx)) return false;
	if (!checkExistingPopNoBlock(ctx)) return false;
	return true;
};

// ── 2단계: 자동 기간 조정 ──

/**
 * 2-1: 기본 대표 POP(baseYn='Y') 중복 처리
 * @param ctx
 * @param processedItems
 */
const adjustBaseYnDuplicates = (ctx: SaveContext, processedItems: Set<string>): boolean => {
	const { gridRef, newUpdatedNotDeleteTargetItems, existingItems, todayPlus2, todayPlus3 } = ctx;
	const grid = gridRef.current;
	let hasAdjustment = false;

	const baseYItems = newUpdatedNotDeleteTargetItems.filter((item: any) => item.baseYn === 'Y');

	for (const newItem of baseYItems) {
		const newStart = dayjs(newItem.fromDate, FORMAT);

		const existingBaseYnYItems = existingItems.filter(
			(item: any) => item.baseYn === 'Y' && item.dccode === newItem.dccode && !processedItems.has(item._$uid),
		);

		for (const existingItem of existingBaseYnYItems) {
			const existingStart = dayjs(existingItem.fromDate, FORMAT);
			const existingEnd = dayjs(existingItem.toDate, FORMAT);

			if (!(newStart.isSameOrAfter(existingStart) && newStart.isSameOrBefore(existingEnd))) {
				continue;
			}

			const adjustedEndDate = calcAdjustedEndDate(newStart, existingItem.fromDate, todayPlus2, todayPlus3);

			grid.updateRowsById({
				_$uid: existingItem._$uid,
				toDate: adjustedEndDate,
				rowStatus: 'U',
				delYn: 'Y',
			});
			grid.addCheckedRowsByValue('_$uid', existingItem._$uid);

			const newAdjustedStartDate = dayjs(adjustedEndDate, FORMAT).add(1, 'day').format(FORMAT);
			grid.updateRowsById({
				_$uid: newItem._$uid,
				fromDate: newAdjustedStartDate,
			});

			if (newItem?.dccode === existingItem?.dccode && newItem?.popNo !== existingItem?.popNo) {
				grid.addRow({
					dccode: existingItem.dccode,
					popNo: existingItem.popNo,
					popName: existingItem.popName,
					fromDate: newAdjustedStartDate,
					toDate: existingItem?.toDate ?? DEFAULT_END_DATE,
					description: existingItem.description,
					baseYn: 'N',
					rowStatus: 'I',
					delYn: 'N',
					refSerialkey: existingItem?.serialkey,
				});
			} else if (newItem?.dccode === existingItem?.dccode && newItem?.popNo === existingItem?.popNo) {
				grid.updateRowsById({
					_$uid: newItem._$uid,
					baseYn: 'Y',
				});
			}

			processedItems.add(existingItem._$uid);
			hasAdjustment = true;
		}
	}

	return hasAdjustment;
};

/**
 * 2-2: 대표 POP 번호 중복 처리 (popNo 동일, baseYn 무관)
 * @param ctx
 * @param processedItems
 */
const adjustPopNoDuplicates = (ctx: SaveContext, processedItems: Set<string>): boolean => {
	const { gridRef, newUpdatedNotDeleteTargetItems, existingItems, todayPlus2, todayPlus3 } = ctx;
	const grid = gridRef.current;
	let hasAdjustment = false;

	for (const newItem of newUpdatedNotDeleteTargetItems) {
		const newStart = dayjs(newItem.fromDate, FORMAT);
		const newEnd = dayjs(newItem.toDate, FORMAT);

		const existingSamePopItems = existingItems.filter(
			(item: any) => item.popNo === newItem.popNo && !processedItems.has(item._$uid),
		);

		for (const existingItem of existingSamePopItems) {
			const existingStart = dayjs(existingItem.fromDate, FORMAT);
			const existingEnd = dayjs(existingItem.toDate, FORMAT);

			if (!hasDateOverlap(newStart, newEnd, existingStart, existingEnd)) continue;

			const adjustedEndDate = calcAdjustedEndDate(newStart, existingItem.fromDate, todayPlus2, todayPlus3);

			grid.updateRowsById({
				_$uid: existingItem._$uid,
				toDate: adjustedEndDate,
				rowStatus: 'U',
				delYn: 'Y',
			});
			grid.addCheckedRowsByValue('_$uid', existingItem._$uid);

			const newAdjustedStartDate = dayjs(adjustedEndDate, FORMAT).add(1, 'day').format(FORMAT);
			grid.updateRowsById({
				_$uid: newItem._$uid,
				fromDate: newAdjustedStartDate,
			});

			processedItems.add(existingItem._$uid);
			hasAdjustment = true;
		}
	}

	return hasAdjustment;
};

/**
 * 2-3: baseYn='Y' 삭제 시 직전 baseYn='Y' 복구
 * @param ctx
 */
const restoreDeletedBaseYn = (ctx: SaveContext): boolean => {
	const { gridRef, checkedItems, allItems, todayPlus2, todayPlus3, endOfTime } = ctx;
	const grid = gridRef.current;
	let hasAdjustment = false;

	const baseYDeleteTargets = (checkedItems || [])
		.filter((it: any) => it?.baseYn === 'Y' && it?.rowStatus === 'U')
		.filter((it: any) => {
			const f = ymd(it.fromDate);
			const t = ymd(it.toDate);
			return (
				f.isValid() &&
				t.isValid() &&
				f.isSameOrAfter(todayPlus3, 'day') &&
				!t.isSame(endOfTime, 'day') &&
				it?.delYn === 'Y'
			);
		});

	if (baseYDeleteTargets.length === 0) return false;

	const targetsSorted = [...baseYDeleteTargets].sort((a: any, b: any) => ymd(a.fromDate).diff(ymd(b.fromDate)));

	for (const target of targetsSorted) {
		const targetUid = target._$uid;
		if (!targetUid) continue;

		const baseYSorted = allItems
			.filter((r: any) => r.baseYn === 'Y')
			.sort((a: any, b: any) => ymd(a.fromDate).diff(ymd(b.fromDate)));

		const idx = baseYSorted.findIndex(r => r._$uid === targetUid);
		if (idx <= 0) continue;

		const prevBaseY = baseYSorted[idx - 1];

		if (normYmd(prevBaseY.toDate) !== DEFAULT_END_DATE) {
			grid.updateRowsById({
				_$uid: prevBaseY._$uid,
				toDate: DEFAULT_END_DATE,
				rowStatus: 'U',
				delYn: 'N',
			});
			grid.addCheckedRowsByValue?.('_$uid', prevBaseY._$uid);
			hasAdjustment = true;
		}

		const cloneItems = allItems
			.filter(r => r.rowStatus === 'I' || r.rowStatus === 'R')
			.filter(r => r.baseYn === 'N')
			.filter(r => r.popNo === prevBaseY.popNo);

		if (cloneItems.length > 0) {
			for (const cloneItem of cloneItems) {
				const cloneFromDate = dayjs(normYmd(cloneItem.fromDate), FORMAT);
				const cloneToDate = todayPlus2.isBefore(cloneFromDate)
					? cloneFromDate.format(FORMAT)
					: todayPlus2.format(FORMAT);
				grid.updateRowsById({
					_$uid: cloneItem._$uid,
					toDate: cloneToDate,
					rowStatus: 'U',
					delYn: 'Y',
				});
				grid.addCheckedRowsByValue?.('_$uid', cloneItem._$uid);
			}
			hasAdjustment = true;
		}
	}

	return hasAdjustment;
};

/**
 * 2단계 전체: 자동 기간 조정 (true = 조정 발생)
 * @param ctx
 */
export const applyAutoDateAdjust = (ctx: SaveContext): boolean => {
	const processedItems = new Set<string>();
	let hasAdjustment = false;

	if (adjustBaseYnDuplicates(ctx, processedItems)) hasAdjustment = true;
	if (adjustPopNoDuplicates(ctx, processedItems)) hasAdjustment = true;
	if (restoreDeletedBaseYn(ctx)) hasAdjustment = true;

	return hasAdjustment;
};

// ── 4단계: 사후 유효성 검사 ──

export const validateAfterAutoAdjust = (ctx: SaveContext): boolean => {
	const { allItems, todayPlus3, endOfTime, isDeleteTarget } = ctx;
	const allBaseYItems = allItems.filter((item: any) => item.baseYn === 'Y' && !isDeleteTarget(item));

	if (allBaseYItems.length === 0) return true;

	const sortedBaseYItems = [...allBaseYItems].sort((a: any, b: any) => {
		const aStart = dayjs(a.fromDate, FORMAT);
		const bStart = dayjs(b.fromDate, FORMAT);
		return aStart.isBefore(bStart) ? -1 : 1;
	});

	// 첫 번째 항목이 오늘+3 부터 시작하는지 확인
	const firstStart = dayjs(sortedBaseYItems[0].fromDate, FORMAT);
	if (firstStart.isSameOrAfter(todayPlus3)) {
		const gapStart = todayPlus3.format('YYYY-MM-DD');
		const gapEnd = firstStart.subtract(1, 'day').format('YYYY-MM-DD');
		showAlert(
			null,
			`기본 대표 POP가 설정되지 않은 기간이 있습니다. \n  ${gapStart} ~ ${gapEnd} \n (시작일자가 오늘+3부터 인 행의 종료일자는 2999/12/31 이전이면 삭제됩니다.)`,
		);
		return false;
	}

	// 연속된 항목들 사이의 간격 확인
	for (let i = 0; i < sortedBaseYItems.length - 1; i++) {
		const currentEnd = dayjs(sortedBaseYItems[i].toDate, FORMAT);
		const nextStart = dayjs(sortedBaseYItems[i + 1].fromDate, FORMAT);
		const expectedNextStart = currentEnd.add(1, 'day');

		if (!nextStart.isSame(expectedNextStart)) {
			const gapStart = expectedNextStart.format('YYYY-MM-DD');
			const gapEnd = nextStart.subtract(1, 'day').format('YYYY-MM-DD');
			if (dayjs(gapStart).isAfter(dayjs(gapEnd))) continue;

			showAlert(null, `기본 대표 POP (Y)가 설정되지 않은 기간이 있습니다.\n  ${gapStart} ~ ${gapEnd}`);
			return false;
		}
	}

	// 마지막 항목이 2999/12/31까지 커버하는지 확인
	const lastEnd = dayjs(sortedBaseYItems[sortedBaseYItems.length - 1].toDate, FORMAT);
	if (!lastEnd.isSame(endOfTime)) {
		const gapStart = lastEnd.add(1, 'day').format('YYYY-MM-DD');
		const gapEnd = endOfTime.format('YYYY-MM-DD');
		showAlert(null, `기본 대표 POP가 설정되지 않은 기간이 있습니다.\n  ${gapStart} ~ ${gapEnd}`);
		return false;
	}

	return true;
};
