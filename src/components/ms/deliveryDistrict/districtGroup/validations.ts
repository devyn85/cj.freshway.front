/*
 ############################################################################
 # FiledataField	: validations.ts
 # Description		: 기준정보 > 센터기준정보 > 배송권역 권역그룹 대표POP 유효성 검사
 # Author			: insung son
 # Since			: 25.03.23
 ############################################################################
*/

import dayjs, { Dayjs } from 'dayjs';

// 배송권역 > 권역그룹 -> 대표POP 유효성 검사 함수
// pop 리스트 유효성 검사 처리
// 체크 사항
// 1. 1개이상 반드시 존재해야함
// 2. 마스터 그리드(권역그룹) 의 fromDate ~ toDate 까지의 연속성이 있어야 함
//    (fromDate가 오늘 이전일 경우 오늘 ~ 2999/12/31 까지의 연속성이 있어야 함)
type DateGap = { start: Dayjs; end: Dayjs };

/**
 * alert 표시 후 false 반환
 * @param isShowAlert
 * @param message
 */
const alertAndFail = (isShowAlert: boolean, message: string): false => {
	if (isShowAlert) showAlert(null, message);
	return false;
};

/**
 * 빈 구간 수집 (순수 함수)
 * @param segments
 * @param minFromDate
 * @param mainToDate
 */
const collectDateGaps = (segments: { from: Dayjs; to: Dayjs }[], minFromDate: Dayjs, mainToDate: Dayjs): DateGap[] => {
	const gaps: DateGap[] = [];
	let cursor = minFromDate.clone();

	for (const seg of segments) {
		const segStart = seg.from;
		const segEnd = seg.to;

		// 마스터 구간보다 완전히 앞이면 스킵
		if (segEnd.isBefore(minFromDate, 'day')) continue;
		// 마스터 구간보다 완전히 뒤이면 루프 종료
		if (segStart.isAfter(mainToDate, 'day')) break;

		// segStart 가 cursor 이후라면 cursor ~ segStart-1 이 빈 구간
		if (segStart.isAfter(cursor, 'day')) {
			gaps.push({ start: cursor.clone(), end: segStart.subtract(1, 'day') });
		}

		// 현재 세그먼트로 cursor 밀어주기 (마스터 종료일 넘지 않게)
		if (segEnd.isSameOrAfter(cursor, 'day')) {
			cursor = segEnd.add(1, 'day');
		}

		if (cursor.isAfter(mainToDate, 'day')) break;
	}

	// 마지막 세그먼트 이후 ~ mainToDate 까지 빈 구간이 남았는지 체크
	if (cursor.isSameOrBefore(mainToDate, 'day')) {
		gaps.push({ start: cursor.clone(), end: mainToDate.clone() });
	}

	return gaps;
};

export const validateDistrictGroupPop = (
	popList: any[],
	mainFromDate: Dayjs,
	mainToDate: Dayjs,
	isShowAlert = true,
): boolean => {
	// true: 유효성 검사 통과, false: 유효성 검사 실패
	// 1) baseYn === 'Y' 인 대표POP 기준으로 from/to 정렬
	const basePopList = popList
		.map((item: any) => ({
			from: dayjs(item.fromDate, 'YYYYMMDD'),
			to: dayjs(item.toDate, 'YYYYMMDD'),
		}))
		.sort((a, b) => a.from.diff(b.from, 'day'));

	if (basePopList.length === 0) {
		return alertAndFail(isShowAlert, '대표POP를 1개 이상 설정해 주세요.');
	}

	// 2) 빈 구간(start~end) 전부 수집
	let minFromDate = mainFromDate.clone();
	if (minFromDate.isBefore(dayjs().add(3, 'day'))) {
		minFromDate = dayjs().add(3, 'day');
	}

	const gaps = collectDateGaps(basePopList, minFromDate, mainToDate);

	// 3) 빈 구간이 하나라도 있으면, 날짜를 포함해서 알림
	if (gaps.length > 0) {
		const msgLines = gaps.map(g => `${g.start.format('YYYY-MM-DD')} ~ ${g.end.format('YYYY-MM-DD')}`);
		return alertAndFail(isShowAlert, `대표POP의 적용일자에 빈 구간이 존재합니다.\n${msgLines.join('\n')}`);
	}

	return true;
};
