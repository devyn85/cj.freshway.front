import commUtil from '@/util/commUtil';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import locale_en from 'antd/es/date-picker/locale/en_US';
import locale_ko from 'antd/es/date-picker/locale/ko_KR';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(timezone);

import 'dayjs/locale/ko';

/**
 * i18n
 * default: es
 * https://day.js.org/docs/en/installation/installation
 */
dayjs.locale('ko');

class dateUtil {
	static toDayjs(value: string, format?: string) {
		if (commUtil.isEmpty(format)) format = 'YYYYMMDD';
		return dayjs(value, format);
	}
	static getSearchBoxLocale = (): any => {
		const lang = localStorage.getItem('language') || 'ko-KR';
		switch (lang) {
			case 'ko-KR':
				return locale_ko;
			case 'en-US':
				return locale_en;
			default:
				return locale_ko;
		}
	};

	/**
	 * 날짜 설정
	 * @param {string} date 날짜 값
	 * @param {string} format 날짜 형식 (YYYY-MM-DD HH:mm:ss)
	 * @returns {string} date를 format 형식으로 변환하여 반환
	 */
	static setDate(date: any, format: string) {
		return dayjs(date).format(format);
	}
	/**
	 * 현재 시간
	 * @param {string} format 날짜 형식 (YYYY-MM-DD HH:mm:ss)
	 * @returns {string} 현재 시간을 format 형식으로 변환하여 반환
	 */
	static getToDay(format: string) {
		if (format) {
			return dayjs().format(format);
		}
		return dayjs().format();
	}

	/**
	 * 날짜 더하기 (일)
	 * @param {string} date 날짜 값
	 * @param {number} num 변경 숫자
	 * @param {string} format 날짜 형식 (YYYY-MM-DD HH:mm:ss)
	 * @returns {string} num일 더한 날짜를 format 형식으로 변환하여 반환
	 */
	static addDays(date: string, num: number, format: string) {
		if (format) {
			return dayjs(date).add(num, 'day').format(format);
		}
		return dayjs(date).add(num, 'day').format();
	}

	/**
	 * 날짜 더하기 (월)
	 * @param {string} date 날짜 값
	 * @param {number} num 변경 숫자
	 * @param {string} format 날짜 형식 (YYYY-MM-DD HH:mm:ss)
	 * @returns {string} num월 더한 날짜를 format 형식으로 변환하여 반환
	 */
	static addMonths(date: string, num: number, format: string) {
		if (format) {
			return dayjs(date).add(num, 'month').format(format);
		}
		return dayjs(date).add(num, 'month').format();
	}

	/**
	 * 날짜 더하기 (년)
	 * @param {string} date 날짜 값
	 * @param {number} num 변경 숫자
	 * @param {string} format 날짜 형식 (YYYY-MM-DD HH:mm:ss)
	 * @returns {string} num년 더한 날짜를 format 형식으로 변환하여 반환
	 */
	static addYear(date: string, num: number, format: string) {
		if (format) {
			return dayjs(date).add(num, 'year').format(format);
		}
		return dayjs(date).add(num, 'year').format();
	}

	/**
	 * 날짜 빼기 (일)
	 * @param {string} date 날짜 값
	 * @param {number} num 변경 숫자
	 * @param {string} format 날짜 형식 (YYYY-MM-DD HH:mm:ss)
	 * @returns {string} num일 뺀 날짜를 format 형식으로 변환하여 반환
	 */
	static subtractDays(date: string, num: number, format: string) {
		if (format) {
			return dayjs(date).subtract(num, 'day').format(format);
		}
		return dayjs(date).subtract(num, 'day').format();
	}

	/**
	 * 날짜 빼기 (월)
	 * @param {string} date 날짜 값
	 * @param {number} num 변경 숫자
	 * @param {string} format 날짜 형식 (YYYY-MM-DD HH:mm:ss)
	 * @returns {string} num월 뺀 날짜를 format 형식으로 변환하여 반환
	 */
	static subtractMonths(date: string, num: number, format: string) {
		if (format) {
			return dayjs(date).subtract(num, 'month').format(format);
		}
		return dayjs(date).subtract(num, 'month').format();
	}

	/**
	 * 날짜 빼기 (년)
	 * @param {string} date 날짜 값
	 * @param {number} num 변경 숫자
	 * @param {string} format 날짜 형식 (YYYY-MM-DD HH:mm:ss)
	 * @returns {string} num년 뺀 날짜를 format 형식으로 변환하여 반환
	 */
	static subtractYear(date: string, num: number, format: string) {
		if (format) {
			return dayjs(date).subtract(num, 'year').format(format);
		}
		return dayjs(date).subtract(num, 'year').format();
	}

	/**
	 * date validation
	 * @param {string} date 날짜 값
	 * @param {string} type date format
	 * @returns {boolean} date format 일치 여부 확인 값
	 */
	static isValid(date: string, type: any) {
		return dayjs(date, type, true).isValid();
	}

	/**
	 * dayjs 객체 여부 확인
	 * @param {object} date 검사 대상
	 * @returns {boolean} dayjs 객체 여부
	 */
	static isDayjs(date: any) {
		return dayjs.isDayjs(date);
	}

	/**
	 * 이전 일자 여부
	 * @param {string} from 시작 날짜
	 * @param {string} to 종료 날짜
	 * @returns {boolean} true (시작 < 종료), false (시작 >= 종료)
	 */
	static isBefore(from: string, to: string) {
		return dayjs(from).isBefore(dayjs(to));
	}

	/**
	 * 이후 일자 여부
	 * @param {string} from 시작 날짜
	 * @param {string} to 종료 날짜
	 * @returns {boolean} true (시작 > 종료), false (시작 <= 종료)
	 */
	static isAfter(from: string, to: string) {
		return dayjs(from).isAfter(dayjs(to));
	}

	/**
	 * 이전 일자 여부 (동일 포함)
	 * @param {string} from 시작 날짜
	 * @param {string} to 종료 날짜
	 * @returns {boolean} true (시작 <= 종료), false (시작 > 종료)
	 */
	static isSameOrBefore(from: string, to: string) {
		return dayjs(from).isSameOrBefore(dayjs(to));
	}

	/**
	 * 이후 일자 여부 (동일 포함)
	 * @param {string} from 시작 날짜
	 * @param {string} to 종료 날짜
	 * @returns {boolean} true (시작 >= 종료), false (시작 < 종료)
	 */
	static isSameOrAfter(from: string, to: string) {
		return dayjs(from).isSameOrAfter(dayjs(to));
	}

	/**
	 * 타임존 변경(from 타임존 → to 타임존)
	 * @param {string} time 변경대상 일시
	 * @param {string} from 변경대상 타임존
	 * @param {string} to 변경목표 타임존
	 * @returns {string} 타임존이 변경된 날짜
	 */
	static changeTimeZone(time: string, from: string, to: string) {
		if (time == null || from == to) {
			return time;
		}

		return dayjs.tz(time, from).clone().tz(to).format('YYYY-MM-DD HH:mm:ss');
	}
	/**
	 * 두 날짜의 차이를 '일' 기준으로 계산합니다.
	 * @param {dayjs.Dayjs | string | Date} date1 첫 번째 날짜
	 * @param {dayjs.Dayjs | string | Date} date2 두 번째 날짜
	 * @returns {number} 두 날짜의 차이 (일)
	 */
	static getDaysDiff(date1: string, date2: string) {
		const d1 = dayjs(date1);
		const d2 = dayjs(date2);

		// .diff() 메소드를 사용하여 '일' 단위로 차이를 계산합니다.
		// 두 번째 인자로 'day'를 넘겨주면 일 단위 차이를 반환합니다.
		return d2.diff(d1, 'day');
	}

	/**
	 * 날짜에 일수를 더하거나 빼는 함수 - ASIS변환
	 * @param date
	 * @param days
	 * @param mydays
	 */
	static addDate(date: string | Date, mydays: any): string {
		let targetDate: Date;
		// 20251118@mydays가 문자열일경우 날짜계산 오류가 있어 타입체크 추가 By sss
		const days = typeof mydays === 'string' ? parseInt(mydays, 10) : mydays;

		if (typeof date === 'string') {
			if (date.length === 8) {
				const year = parseInt(date.substring(0, 4));
				const month = parseInt(date.substring(4, 6)) - 1;
				const day = parseInt(date.substring(6, 8));
				targetDate = new Date(year, month, day);
			} else {
				targetDate = new Date(date);
			}
		} else {
			targetDate = new Date(date);
		}

		if (isNaN(targetDate.getTime())) {
			throw new Error('Invalid date format');
		}

		targetDate.setDate(targetDate.getDate() + days);

		const year = targetDate.getFullYear();
		const month = String(targetDate.getMonth() + 1).padStart(2, '0');
		const day = String(targetDate.getDate()).padStart(2, '0');

		return `${year}${month}${day}`;
	}

	/**
	 * 오늘 날짜를 YYYYMMDD 형식으로 반환 - ASIS변환
	 */
	static today(): string {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		return `${year}${month}${day}`;
	}

	/**
	 * 시간분 -> 시간:분 포메팅 변환 함수
	 * 2130 -> 21:30
	 * @param timeString: string 2130
	 * @param defaultvalue: string 00:00;
	 * @param timeString
	 * @param defaultValue
	 * @returns {string} 21:30
	 */
	static formatTimeToDisplay(timeString: string, defaultValue = '00:00'): string {
		if (!timeString || timeString.length !== 4 || !/^\d{4}$/.test(timeString)) {
			return defaultValue;
		}

		const hours = parseInt(timeString.substring(0, 2), 10);
		const minutes = parseInt(timeString.substring(2, 4), 10);

		if (hours > 23 || minutes > 59) {
			return defaultValue;
		}

		return `${timeString.substring(0, 2)}:${timeString.substring(2, 4)}`;
	}

	/**
	 * 시간:분 -> 시간분 포메팅 변환 함수
	 * 21:30 -> 2130
	 * @param timeString: string 21:30
	 * @param defaultvalue: string 00:00;
	 * @param timeString
	 * @param defaultValue
	 * @returns {string} 2130
	 */
	static formatTimeToResponse(timeString: string, defaultValue = '00:00'): string {
		if (!timeString || timeString.length !== 5 || !/^\d{2}:\d{2}$/.test(timeString)) {
			return defaultValue;
		}

		const [hoursStr, minutesStr] = timeString.split(':');
		const hours = parseInt(hoursStr, 10);
		const minutes = parseInt(minutesStr, 10);

		if (hours > 23 || minutes > 59) {
			return defaultValue;
		}

		return timeString.replace(':', '');
	}

	/**
	 * 숫자 입력 시 자동으로 시간:분 포메팅 변환 함수
	 * 7 -> 07:00
	 * @param inputText: string 21:30
	 * @param value
	 * @returns {string} 2130
	 */
	static formatTimeInput(value: string): string {
		if (!value || value.trim() === '') return '';

		const cleanValue = value.replace(/[^\d]/g, ''); // 숫자만 추출

		if (cleanValue.length === 0) return '';

		// 1~2자리: 시간으로 간주 (12 → 12:00)
		if (cleanValue.length <= 2) {
			const hour = parseInt(cleanValue);
			if (hour >= 0 && hour <= 23) {
				return `${cleanValue.padStart(2, '0')}:00`;
			}
		}
		// 3자리: H:MM 형식 (130 → 01:30)
		else if (cleanValue.length === 3) {
			const hour = parseInt(cleanValue.substring(0, 1));
			const minute = parseInt(cleanValue.substring(1, 3));
			if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
				return `${hour.toString().padStart(2, '0')}:${cleanValue.substring(1, 3)}`;
			}
		}
		// 4자리: HHMM 형식 (1200 → 12:00)
		else if (cleanValue.length === 4) {
			const hour = parseInt(cleanValue.substring(0, 2));
			const minute = parseInt(cleanValue.substring(2, 4));
			if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
				return `${cleanValue.substring(0, 2)}:${cleanValue.substring(2, 4)}`;
			}
		}

		return value; // 변환할 수 없으면 원본 반환
	}
}

export default dateUtil;
