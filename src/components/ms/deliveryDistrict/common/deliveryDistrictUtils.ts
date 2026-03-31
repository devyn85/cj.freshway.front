/*
 ############################################################################
 # FiledataField	: deliveryDistrictUtils.ts
 # Description		: 기준정보 > 센터기준정보 > 배송권역 공통 유틸리티 함수
 # Author			: insung son
 # Since			: 25.03.23
 ############################################################################
*/

import dayjs from 'dayjs';

// 배송권역 > 대표 POP - 대표POP 번호, 대표POP 명 리스트 합성 함수
export const RedefinePopList = (popList: any[]) => {
	// 같은 popNo 데이터 그룹화
	const popNoGroups = new Map<string, any[]>();

	for (const pop of popList) {
		if (!popNoGroups.has(pop.popNo)) {
			popNoGroups.set(pop.popNo, []);
		}
		popNoGroups.get(pop.popNo)?.push(pop);
	}

	// 같은 popNo 데이터 그룹화 결과를 기준으로 대표POP 번호, 대표POP 명 리스트 합성
	const result = [];

	for (const [, groupItems] of popNoGroups) {
		// baseYn = 'Y'인 항목 찾기 (parent)
		const parentPop = groupItems.find(pop => pop.baseYn === 'Y');
		// baseYn = 'N'인 항목들 찾기 (children)
		const tempChildrenPopsList = groupItems.filter(pop => pop.baseYn === 'N');
		// fromDate, toDate 최소값, 최대값으로 병합 처리
		const childrenPops = tempChildrenPopsList.reduce((acc, cur) => {
			if (Object.keys(acc).length === 0) {
				return { ...cur };
			}
			const fromDate = dayjs(cur.fromDate).isBefore(dayjs(acc.fromDate)) ? cur.fromDate : acc.fromDate;
			const toDate = dayjs(cur.toDate).isAfter(dayjs(acc.toDate)) ? cur.toDate : acc.toDate;
			return { ...acc, fromDate, toDate };
		}, {} as any);

		let mergedPop: any = {};

		const isExistChildrenPops = Object.keys(childrenPops).length > 0;

		// parentPop 만 존재시
		if (parentPop && !isExistChildrenPops) {
			mergedPop = {
				...parentPop,
				parentFromDate: parentPop.fromDate,
				parentToDate: parentPop.toDate,
				childrenFromDate: '',
				childrenToDate: '',
			};
		}
		// childrenPop 만 존재시
		else if (!parentPop && isExistChildrenPops) {
			mergedPop = {
				...childrenPops,
				parentFromDate: '',
				parentToDate: '',
				childrenFromDate: childrenPops.fromDate,
				childrenToDate: childrenPops.toDate,
			};
		}
		// parentPop, childrenPop 모두 존재 시
		else if (parentPop && isExistChildrenPops) {
			const toDate = dayjs(childrenPops.toDate).isAfter(dayjs(parentPop.toDate))
				? childrenPops.toDate
				: parentPop.toDate;
			mergedPop = {
				...parentPop,
				parentFromDate: parentPop.fromDate,
				parentToDate: parentPop.toDate,
				childrenFromDate: childrenPops.fromDate,
				childrenToDate: childrenPops.toDate,
				toDate: toDate,
			};
		}

		result.push(mergedPop);
	}

	return result;
};

type PopItem = {
	popNo: string;
	popName?: string;
	fromDate?: string; // “YYYYMMDD”
	toDate?: string; // “YYYYMMDD”
	[k: string]: any;
};

// 두 날짜 중 더 이른 날짜 반환
/**
 *
 * @param prevDate
 * @param curDate
 */
function pickEarlierDate(prevDate?: string, curDate?: string): string | undefined {
	const prev = prevDate ? dayjs(prevDate, 'YYYYMMDD') : null;
	const cur = curDate ? dayjs(curDate, 'YYYYMMDD') : null;
	if (!prev?.isValid()) return curDate;
	if (!cur?.isValid()) return prevDate;
	return cur.isBefore(prev) ? curDate : prevDate;
}

// 두 날짜 중 더 늦은 날짜 반환
/**
 *
 * @param prevDate
 * @param curDate
 */
function pickLaterDate(prevDate?: string, curDate?: string): string | undefined {
	const prev = prevDate ? dayjs(prevDate, 'YYYYMMDD') : null;
	const cur = curDate ? dayjs(curDate, 'YYYYMMDD') : null;
	if (!prev?.isValid()) return curDate;
	if (!cur?.isValid()) return prevDate;
	return cur.isAfter(prev) ? curDate : prevDate;
}

export const mergeGroupPopListByPopNo = (list: PopItem[]) => {
	const map = new Map<string, PopItem>();

	for (const cur of list ?? []) {
		if (!cur?.popNo) continue;

		const prev = map.get(cur.popNo);
		if (!prev) {
			map.set(cur.popNo, { ...cur });
			continue;
		}

		map.set(cur.popNo, {
			...prev,
			fromDate: pickEarlierDate(prev.fromDate, cur.fromDate),
			toDate: pickLaterDate(prev.toDate, cur.toDate),
		});
	}

	return Array.from(map.values());
};
