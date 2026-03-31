import { showAlert } from '@/util/MessageUtil';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { t } from 'i18next';
import type { PickerMode } from 'rc-picker/lib/interface';
import { useEffect, useState } from 'react';

dayjs.extend(customParseFormat);

/**
 * 엔터 이벤트 발생 시키는 함수
 * @param {HTMLElement} htmlElement - 이벤트를 발생시킬 HTML 요소
 */
const simulateEnter = (htmlElement: HTMLElement) => {
	const event = new KeyboardEvent('keydown', {
		key: 'Enter',
		code: 'Enter',
		keyCode: 13,
		which: 13,
		bubbles: true,
	});
	htmlElement.dispatchEvent(event);
};

/**
 * 다음 탭 가능한 요소로 이동하는 함수
 * 같은 form 내의 요소들만 대상으로 함
 * @param currentElement
 */
const focusNextTabbable = (currentElement: HTMLElement) => {
	if (!currentElement) {
		return;
	}

	// RangePicker의 시작일일 경우 종료일로 포커스
	if (currentElement.getAttribute('date-range') === 'start') {
		(
			document.querySelector(`input[name="${currentElement.getAttribute('name')}"][date-range="end"]`) as HTMLElement
		)?.focus();
	}

	// RangePicker의 종료일이거나, DatePicker일 경우 다음 탭 가능한 요소로 이동
	if (currentElement.getAttribute('date-range') === 'end' || !currentElement.getAttribute('date-range')) {
		// 현재 요소에서 가장 가까운 form을 찾기
		const parentForm = currentElement.closest('form');

		if (parentForm) {
			// form의 다음 element sibling을 찾아서 포커스
			const nextElement = parentForm.nextElementSibling as HTMLElement;
			if (nextElement) {
				nextElement.focus();
			} else {
				currentElement.blur();
			}
		}
	}
};

/**
 * 입력값의 형식에 따라 dayjs 객체로 변환하는 함수
 * YYYYMMDD, YYMMDD, MMDD, MDD 형식 지원
 * @example
 * YYYYMMDD 형식: 20240328 -> 2024-03-28
 * YYMMDD 형식: 250315 -> 2025-03-15
 * MMDD 형식: 0620 -> 2025-06-20 // 이번년도로 변환
 * MDD 형식: 620 -> 2025-06-20 // 이번년도로 변환
 * @param {string} inputValue - 입력값
 * @param {any} picker - 피커 모드
 * @param {any} e - Event
 * @returns {dayjs.Dayjs | null} dayjs 객체
 */
const convertInputToDayjs = (inputValue: string, picker: any, e?: any): dayjs.Dayjs | null => {
	if (!inputValue) {
		return null;
	}
	const str = inputValue.replace(/[^0-9]/g, '');

	let d: dayjs.Dayjs | null = null;

	switch (picker) {
		case 'month':
			if (/^\d{6}$/.test(str)) {
				d = dayjs(str, 'YYYYMM', true); // strict parsing
			} else if (/^\d{4}$/.test(str)) {
				d = dayjs(str, 'YYMM', true); // strict parsing
			} else {
				d = dayjs(str, 'YYYYMM', true); // strict parsing
			}
			break;
		case 'year':
			if (/^\d{4}$/.test(str)) {
				d = dayjs(str, 'YYYY', true); // strict parsing
			} else {
				d = dayjs(str, 'YY', true); // strict parsing
			}
			break;
		case 'date':
			if (/^\d{8}$/.test(str)) {
				// YYYYMMDD 형식: 20240328
				d = dayjs(str, 'YYYYMMDD', true); // strict parsing
			} else if (/^\d{6}$/.test(str)) {
				// YYMMDD 형식: 250315
				d = dayjs(str, 'YYMMDD', true); // strict parsing
			} else if (/^\d{3,4}$/.test(str)) {
				// MMDD, MDD 형식: 0620, 620, 1020 등
				const year = dayjs().year();
				const mm = str.length === 3 ? `0${str.slice(0, 1)}` : str.slice(0, 2);
				const dd = str.length === 3 ? str.slice(1) : str.slice(2);
				d = dayjs(`${year}-${mm}-${dd}`, 'YYYY-MM-DD', true); // strict parsing
			} else if (/^\d{1,2}$/.test(str)) {
				// DD, D 형식: 15, 7 등
				const year = dayjs().year();
				let mm = `${dayjs().month() + 1}`;
				if (mm.length === 1) mm = '0' + mm;
				const dd = str.length === 2 ? str : '0' + str;
				d = dayjs(`${year}-${mm}-${dd}`, 'YYYY-MM-DD', true); // strict parsing
			} else {
				return null; // 파싱 불가
			}
			break;
		case 'time':
			if (/^\d{4}$/.test(str)) {
				d = dayjs(str, 'HHmm', true); // strict parsing
			}
			break;
		case 'datetime':
			if (/^\d{12}$/.test(str)) {
				// YYYYMMDDHHmm 형식: 202403281730
				d = dayjs(str, 'YYYYMMDDHHmm', true); // strict parsing
			}
			break;
		default:
			d = dayjs(str, 'YYYYMMDD', true); // strict parsing
			break;
	}

	if (!d?.isValid()) {
		// TO날짜에 FOCUS 가는걸 방지하기 위해 setTimeout 적용
		setTimeout(() => {
			if (e.target) e.target.focus();
			showAlert('', t('msg.MSG_COM_VAL_015'));
		}, 200);
		return null;
	}

	return d;
};

/**
 * DatePicker Input 값을 dayjs 객체로 변환하여 날짜를 선택하는 커스텀 훅
 * @returns {object} 훅 반환값
 * @returns {Function} returns.onKeydownDatePicker - 키 다운 이벤트 핸들러
 * @returns {Function} returns.onBlurDatePicker - 블러 이벤트 핸들러
 * @returns {Function} returns.convertDatePickerInputToDayjs - 입력값을 dayjs 객체와 YYYYMMDD 형식의 string 값으로 변환하는 함수
 * @example
 * ```tsx
 * const { onKeydownDatePicker, onBlurDatePicker, convertDatePickerInputToDayjs } = useDatepickerInputToDayjs();
 */
export const useDatepickerInputToDayjs = () => {
	const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

	useEffect(() => {
		const handleMouseDown = () => {
			setIsMouseDown(true);

			setTimeout(() => {
				setIsMouseDown(false);
			}, 100);
		};

		document.addEventListener('mousedown', handleMouseDown);
		return () => {
			document.removeEventListener('mousedown', handleMouseDown);
		};
	}, []);

	/**
	 * 키 다운 이벤트 핸들러
	 * @param {React.KeyboardEvent<HTMLElement>} e - 키 다운 이벤트
	 * @param {Function} callback - 콜백 함수
	 * @param {'DateRange' | 'DatePicker' | 'RangePicker'} UIType - UI 타입
	 * @param {boolean} isFirstInput - 첫 번째 입력 여부
	 * @param {any} showTime - showTimne
	 */
	const onKeydownDatePicker = (
		e: React.KeyboardEvent<HTMLElement>,
		callback: () => void,
		UIType: 'DateRange' | 'DatePicker' | 'RangePicker',
		isFirstInput?: boolean,
		showTime?: any,
	) => {
		switch (UIType) {
			case 'DatePicker':
				if (e.key !== 'Enter' && e.key !== 'Tab') {
					return;
				}

				if (e.key === 'Tab' && e.shiftKey) {
					return;
				}

				if (e.key === 'Tab') {
					e.preventDefault();
					e.stopPropagation();
					setTimeout(() => {
						simulateEnter(e.target as HTMLElement);
					}, 100);
					return;
				}

				break;
			case 'RangePicker':
				if (e.key !== 'Enter' && e.key !== 'Tab') {
					return;
				}

				if (e.key === 'Tab' && e.shiftKey) {
					return;
				}

				if (e.key === 'Tab') {
					e.preventDefault();
					e.stopPropagation();
					setTimeout(() => {
						simulateEnter(e.target as HTMLElement);
					}, 100);
					return;
				}

				break;
			case 'DateRange':
				if (e.key !== 'Enter' && e.key !== 'Tab') {
					return;
				}

				if (e.key === 'Tab' && e.shiftKey) {
					return;
				}

				if (e.key === 'Tab') {
					e.preventDefault();
					e.stopPropagation();
					setTimeout(() => {
						simulateEnter(e.target as HTMLElement);
					}, 100);
					return;
				}

				break;
		}

		callback();

		if (e.key === 'Enter') {
			setTimeout(() => {
				// showTime 옵션으로 시간 영역 노출시 "확인" 버튼을 눌러야지만 다음 로직 수행하는 이슈 해결
				if (commUtil.isNotEmpty(showTime)) {
					const okBtn: any = document.querySelector('.ant-picker-ok button');
					if (okBtn && !okBtn.disabled) {
						okBtn.click();
					}
				}
				focusNextTabbable(e.target as HTMLElement);
			}, 100);
		}
	};

	/**
	 * DateRange blur 발생 시 엔터 이벤트 발생
	 * @description DatePicker와 구별하기 위해 따로 분리
	 * @param {Function} callback - 콜백 함수
	 * @param {any} showTime - showTime
	 */
	const onBlurDatePicker = (callback: () => void, showTime?: any) => {
		if (isMouseDown) {
			// showTime 옵션으로 시간 영역 노출시 "확인" 버튼을 눌러야지만 다음 로직 수행하는 이슈 해결
			if (commUtil.isNotEmpty(showTime)) {
				const okBtn: any = document.querySelector('.ant-picker-ok button');
				if (okBtn && !okBtn.disabled) {
					okBtn.click();
				}
			}

			callback();
		}
	};

	/**
	 * 입력값을 dayjs 객체와 YYYYMMDD 형식의 string 값으로 변환하는 함수
	 * @param {string} inputValue - 입력값
	 * @param {PickerMode} picker PickerMode
	 * @param {any} e Event
	 * @param {any} showTime showTime
	 * @returns {any} dayjsDate : 변환된 dayjs 객체 (formattedDate : YYYYMMDD 형식의 string 값)
	 */
	const convertDatePickerInputToDayjs = (inputValue: string, picker: PickerMode, e?: any, showTime?: any) => {
		const initialValue: { dayjsDate: dayjs.Dayjs | null; formattedDate: string | null } = {
			dayjsDate: null,
			formattedDate: null,
		};

		if (!inputValue) {
			return initialValue;
		}

		if (!picker) {
			picker = 'date';
		}

		// picker="datetime" 설정시 달력이 중복으로 2개 생기는 이슈 때문에 임시적으로 아래 로직 추가
		// commUtil.isNotEmpty(showTime) ? 'datetime' : picker
		const dayjsDate = convertInputToDayjs(inputValue, commUtil.isNotEmpty(showTime) ? 'datetime' : picker, e);

		if (!dayjsDate) {
			return initialValue;
		}

		const formattedDate = dayjsDate.format('YYYYMMDD');

		return { dayjsDate, formattedDate };
	};

	return {
		onKeydownDatePicker,
		onBlurDatePicker,
		convertDatePickerInputToDayjs,
	};
};
