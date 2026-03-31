import dayjs from 'dayjs';
import { useState } from 'react';

/**
 * 기간 연장 체크 여부에 따라 최소 날짜를 반환
 * @param {boolean} isPeriodExtension 기간 연장 체크 여부
 * @param {number} limitYear 제한 년도
 * @returns {dayjs.Dayjs | null} 최소 날짜
 */
const getMinDateByLimitYear = ({
	isPeriodExtension,
	limitYear,
}: {
	isPeriodExtension: boolean;
	limitYear: number;
}): dayjs.Dayjs | null => {
	return isPeriodExtension ? null : dayjs().subtract(limitYear, 'year');
};

/**
 * 날짜 선택기의 기간 연장 기능을 관리하는 커스텀 훅
 * @param {object} params - 훅 파라미터
 * @param {boolean} params.hasCheckboxForPeriodExtension - 기간 연장 체크박스 표시 여부
 * @param {number} [params.limitYear] - 기간 연장이 비활성화될 때 제한할 년도 수
 * @param {string} [params.textInCheckbox] - 체크박스에 표시될 텍스트
 * @returns {object} 훅 반환값
 * @returns {boolean} returns.isFromPeriodExtension - 시작일 기간 연장 활성화 여부
 * @returns {Function} returns.toggleFromPeriodExtension - 시작일 기간 연장 토글 함수
 * @returns {dayjs.Dayjs | null} returns.minFromDate - 시작일 최소 날짜 (기간 연장 비활성화 시 limitYear만큼 이전 날짜)
 * @returns {boolean} returns.isToPeriodExtension - 종료일 기간 연장 활성화 여부
 * @returns {Function} returns.toggleToPeriodExtension - 종료일 기간 연장 토글 함수
 * @returns {dayjs.Dayjs | null} returns.minToDate - 종료일 최소 날짜 (기간 연장 비활성화 시 limitYear만큼 이전 날짜)
 * @returns {string} returns.textInCheckbox - 체크박스 텍스트
 * @example
 * ```tsx
 * const {
 *   isFromPeriodExtension,
 *   toggleFromPeriodExtension,
 *   minFromDate,
 *   isToPeriodExtension,
 *   toggleToPeriodExtension,
 *   minToDate,
 *   textInCheckbox
 * } = useDatepickerPeriodExtension({
 *   hasCheckboxForPeriodExtension: true,
 *   limitYear: 2,
 *   textInCheckbox: '기간 연장'
 * });
 * ```
 */
export const useDatepickerPeriodExtension = ({
	hasCheckboxForPeriodExtension,
	limitYear = 2,
	textInCheckbox = '기간 연장',
}: {
	hasCheckboxForPeriodExtension: boolean;
	limitYear?: number;
	textInCheckbox?: string;
}) => {
	// hasCheckboxForPeriodExtension이 false인 경우 기본값 반환
	if (!hasCheckboxForPeriodExtension) {
		return {
			isFromPeriodExtension: false,
			toggleFromPeriodExtension: () => {
				return;
			},
			minFromDate: null,
			isToPeriodExtension: false,
			toggleToPeriodExtension: () => {
				return;
			},
			minToDate: null,
			textInCheckbox,
		};
	}

	// hasCheckboxForPeriodExtension이 true인 경우에만 상태 관리
	const [isFromPeriodExtension, setIsFromPeriodExtension] = useState(false);
	const [isToPeriodExtension, setIsToPeriodExtension] = useState(false);

	const toggleFromPeriodExtension = () => {
		setIsFromPeriodExtension(prev => !prev);
	};
	const toggleToPeriodExtension = () => {
		setIsToPeriodExtension(prev => !prev);
	};

	const minFromDate = getMinDateByLimitYear({
		isPeriodExtension: isFromPeriodExtension,
		limitYear,
	});
	const minToDate = getMinDateByLimitYear({
		isPeriodExtension: isToPeriodExtension,
		limitYear,
	});

	return {
		isFromPeriodExtension,
		toggleFromPeriodExtension,
		minFromDate,
		isToPeriodExtension,
		toggleToPeriodExtension,
		minToDate,
		textInCheckbox,
	};
};
