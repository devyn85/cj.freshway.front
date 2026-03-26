
// @ts-ignore

import "react-js-cron/dist/styles.css";



const quartzToNaturalLanguage = (cron: string) => {


	function parseTimeField(field: string, unit: string): string {
		if (field.includes('/')) {
			const [start, interval] = field.split('/');
			if (start === '0' || start === '*') {
				return `매 ${interval}${unit}`;
			} else {
				return `${start}${unit}부터 매 ${interval}${unit}`;
			}
		} else if (field === '*') {
			return `매 ${unit}`;
		} else {
			return `${field}${unit}`;
		}
	}


	function convertDayOfWeek(field: string): string {
		switch (field.toUpperCase()) {
			case '1':
			case 'SUN':
				return '일요일';
			case '2':
			case 'MON':
				return '월요일';
			case '3':
			case 'TUE':
				return '화요일';
			case '4':
			case 'WED':
				return '수요일';
			case '5':
			case 'THU':
				return '목요일';
			case '6':
			case 'FRI':
				return '금요일';
			case '7':
			case 'SAT':
				return '토요일';
			default:
				return field + '요일';
		}
	}

	if (typeof cron !== 'string') {
		return '❌ 잘못된 입력값입니다.';
	}

	const fields: string[] = cron.trim().split(' ');

	if (fields.length < 6 || fields.length > 7) {
		return '❌ 잘못된 크론식입니다. (필드는 6~7개)';
	}

	const [sec, min, hour, dayOfMonth, monthOfYear, dayOfWeek] = fields;

	const secText = parseTimeField(sec, '초');
	const minText = parseTimeField(min, '분');
	const hourText = parseTimeField(hour, '시');

	let result = ``;

	if (dayOfMonth !== '?' && dayOfMonth !== '*') {
		result += ` 매월 ${dayOfMonth}일에 `;
	} else if (dayOfWeek !== '?' && dayOfWeek !== '*') {
		result += ` 매주 ${convertDayOfWeek(dayOfWeek)}에 `;
	} else {
		result += ` 매일 `;
	}

	if (secText.includes('마다') || minText.includes('마다') || hourText.includes('마다')) {
		result += `${hourText} ${minText} ${secText}마다`;
	} else {
		result += `${hourText} ${minText} ${secText}에`;
	}

	result += ' 실행됩니다.';
	return result;
}


export default quartzToNaturalLanguage;
