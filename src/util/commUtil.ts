// statusnm 컬럼의 styleFunction 분리

import dataRegex from '@/util/dataRegex';
import dateUtil from '@/util/dateUtil';
import dayjs from 'dayjs';
import i18next from 'i18next'; // i18next를 사용하여 다국어 처리
import React from 'react';

class commUtil extends React.Component {
	//static tabs = useAppSelector(state => state.tab.tabs);

	// 다국어
	//const { t } = useTranslation();

	static removeTab() {
		//console.log(commUtil.tabs);
	}

	static isEmpty(value: any) {
		if (
			value === '' ||
			value === null ||
			value === 'null' ||
			value === undefined ||
			(value !== null && typeof value === 'object' && !Object.keys(value).length)
		) {
			return true;
		} else {
			return false;
		}
	}

	static isNotEmpty(value: any) {
		return !commUtil.isEmpty(value);
	}

	/**
	 * undefined이거나 null인지 체크
	 * @param {*} sValue value
	 * @returns {boolean} null | undefined 여부
	 */
	static isNull(sValue: any) {
		if (sValue instanceof String) {
			const sVal = new String(sValue);
			if (sVal.valueOf() == 'undefined' || sValue == null || sValue == 'null' || sValue.trim().length <= 0) return true;
		} else {
			if (
				typeof sValue == 'undefined' ||
				sValue == 'null' ||
				sValue == 'undefined' ||
				sValue == null ||
				sValue == undefined ||
				sValue.length == 0
			)
				return true;
		}

		const v_ChkStr = new String(sValue);
		if (v_ChkStr == null || v_ChkStr.length == 0) return true;

		return false;
	}

	/**
	 * undefined, null을 지정값으로 치환
	 * @param {string} strValue 기준 값
	 * @param {string} strValue2 null 시 변경 값
	 * @returns {string} nvl 처리된 결과
	 */
	static nvl(strValue: any, strValue2: any) {
		if (commUtil.isNull(strValue)) return strValue2;
		return strValue;
	}

	static toStr(str: string, dfVal: string) {
		dfVal = dfVal || '';
		if (typeof str == 'undefined' || str == 'undefined' || str == null || str == 'null') {
			str = dfVal;
		}
		return String(str);
	}

	/**
	 * 문자열에 들어 있는 특정한 문자를 지운다. removedChar 지워질 문자열
	 * @param {string} str 문자열
	 * @param {string} removedChar 제거 문자
	 * @returns {string} 특정 문자가 제거된 문자열
	 */
	static removeChar(str: string, removedChar: string) {
		if (typeof str == 'undefined' || str == null) return str;
		if (typeof removedChar == 'undefined' || removedChar == null) return str;
		const regExp = new RegExp(removedChar, 'g');
		return str.replace(regExp, '');
	}

	/**
	 * 날짜형식 보정
	 * @param {string} strDate 시작 일자
	 * @returns {string} 포맷팅된 일자
	 */
	static fixDate(strDate: string) {
		strDate = commUtil.toStr(strDate, '');
		if (strDate != '') {
			strDate = strDate.replaceAll('-', '').replaceAll('/', '').replaceAll('.', '');
		}

		return strDate;
	}

	/**
	 * 문자열에 있는 모든 영어를 소문자로 바꾸는 Basic API
	 * @param {string} args 문자열
	 * @returns {string} 소문자로 변환된 문자열
	 */
	static toLower(args: string) {
		if (commUtil.isNull(args)) return '';
		return String(args).toLowerCase();
	}

	/**
	 * 특수문자 제거
	 * @param {string} str 문자열
	 * @param {*} regExp 정규식
	 * @returns {string} 정규식에 의해 제거된 문자열
	 */
	static removeSpacCharRegExr(str: string, regExp: any) {
		return str.replace(regExp, '');
	}

	static removeSpecChar(str: string) {
		const regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
		return commUtil.removeSpacCharRegExr(str, regExp);
	}

	static getValueInListByKey(list: any, key: string, keyValue: string, value: string) {
		let val = '';
		list.map((item: any) => {
			if (item[key] == keyValue) val = item[value];
		});

		return val;
	}

	static getObjectInListByKey(list: any, key: string, keyValue: string) {
		let retItem = {};
		list.map((item: any) => {
			if (item[key] == keyValue) retItem = item;
		});
		return retItem;
	}

	/**
	 * GET Method 요청 시 param에 '[', ']' 포함 여부
	 * @param {*} params Axios Request GET Method에 전달되는 parameters
	 * @returns {boolean} 검사 결과
	 */
	static checkGetReqParam(params: any) {
		let res = true;
		Object.keys(params).forEach((key: any) => {
			if (dataRegex.validSearchChar(params[key])) {
				res = false;
				return;
			}
		});

		return res;
	}

	/**
	 * Object value 값 확인
	 * @param {*} obj 객체
	 * @param {*} value 탐색 대상
	 * @returns {*} 있으면 value, 없으면 undefined
	 */
	static getKeyByValue(obj: any, value: string) {
		return Object.keys(obj).find(key => obj[key] === value);
	}

	/**
	 * 숫자 천단위 콤마 추가
	 * @param {number} value 변환할 숫자
	 * @returns {*} 숫자면 formatValue, 아니면 0
	 */
	static changeNumberFormatter = (value: number) => {
		if (isNaN(value)) {
			//NaN인지 판별
			return 0;
		} else {
			//NaN이 아닌 경우
			const formatValue = value.toLocaleString('ko-KR');
			return formatValue;
		}
	};

	/**
	 * @deprecated
	 * 유통기한 체크 => css 적용방식인 gfnDurationColor로 대체됨
	 * @param {*} strLottable01 유통기한
	 * @param {*} nDuration 유통기간
	 * @param {*} strDurationtype 유통기한관리방법
	 * @param {*} strDefaultColor 색상값
	 * @returns {*} 색상값
	 */
	static gfnDurationCheck = (
		strLottable01: any,
		nDuration: any,
		strDurationtype: any,
		strDefaultColor: any = '',
	): any => {
		// 유통기한
		let strDuration1 = ''; // 유통기한 1/3 남았을경우
		let strDuration2 = ''; // 유통기한 2/3 남았을경우
		let strDuration3 = ''; // 유통기한 3/3 남았을경우

		if (isNaN(strLottable01) || strLottable01 == 'STD') return strDefaultColor;

		if (strDurationtype == '1') {
			// 유통기한
			strDuration1 = dateUtil.addDays(strLottable01, -((nDuration * 1) / 3), '');
			strDuration2 = dateUtil.addDays(strLottable01, -((nDuration * 2) / 3), '');
			strDuration3 = dateUtil.addDays(strLottable01, -((nDuration * 3) / 3), '');
			if (strDuration1 <= dateUtil.getToDay('')) return '#FFC19E';
			else if (strDuration2 <= dateUtil.getToDay('') && dateUtil.getToDay('') < strDuration1) return '#D8E7EF';
			else if (strDuration3 <= dateUtil.getToDay('') && dateUtil.getToDay('') < strDuration2) return '#F0FFAE';
			else return '#FFC19E';
		} else if (strDurationtype == '2') {
			// 제조일자
			strDuration1 = dateUtil.addDays(strLottable01, (nDuration * 2) / 3, ''); // 1/3
			strDuration2 = dateUtil.addDays(strLottable01, (nDuration * 1) / 3, ''); // 2/3
			strDuration3 = strLottable01; // 3/3
			if (strDuration1 <= dateUtil.getToDay('')) return '#FFC19E';
			else if (strDuration2 <= dateUtil.getToDay('') && dateUtil.getToDay('') < strDuration1) return '#D8E7EF';
			else if (strDuration3 <= dateUtil.getToDay('') && dateUtil.getToDay('') < strDuration2) return '#F0FFAE';
			else return '#FFC19E';
		} else if (strDurationtype == '3') {
			// 도정일자
			strDuration1 = dateUtil.addDays(strLottable01, (nDuration * 2) / 3, ''); // 1/3
			strDuration2 = dateUtil.addDays(strLottable01, (nDuration * 1) / 3, ''); // 2/3
			strDuration3 = strLottable01; // 3/3
			if (strDuration1 <= dateUtil.getToDay('')) return '#FFC19E';
			else if (strDuration2 <= dateUtil.getToDay('') && dateUtil.getToDay('') < strDuration1) return '#D8E7EF';
			else if (strDuration3 <= dateUtil.getToDay('') && dateUtil.getToDay('') < strDuration2) return '#F0FFAE';
			else return '#FFC19E';
		} else {
			return strDefaultColor;
		}
	};

	/**
	 * 유통기한 체크
	 * @param {*} strLottable01 유통기한
	 * @param {*} nDuration 유통기간
	 * @param {*} strDurationtype 유통기한관리방법
	 * @param {*} strDefaultColor 색상값
	 * @returns {*} 색상값
	 */
	static gfnDurationColor = (
		strLottable01: any,
		nDuration: any,
		strDurationtype: any,
		strDefaultColor: any = '',
	): any => {
		// 유통기한
		let strDuration1 = ''; // 유통기한 1/3 남았을경우
		let strDuration2 = ''; // 유통기한 2/3 남았을경우
		let strDuration3 = ''; // 유통기한 3/3 남았을경우

		//return 'gc-user40';

		if (isNaN(strLottable01) || strLottable01 == 'STD') return strDefaultColor;

		if (strDurationtype == '1') {
			// 유통기한
			strDuration1 = dateUtil.addDays(strLottable01, -((nDuration * 1) / 3), '');
			strDuration2 = dateUtil.addDays(strLottable01, -((nDuration * 2) / 3), '');
			strDuration3 = dateUtil.addDays(strLottable01, -((nDuration * 3) / 3), '');
			if (strDuration1 <= dateUtil.getToDay('')) return 'gc-user32';
			else if (strDuration2 <= dateUtil.getToDay('') && dateUtil.getToDay('') < strDuration1) return 'gc-user27';
			else if (strDuration3 <= dateUtil.getToDay('') && dateUtil.getToDay('') < strDuration2) return 'gc-user42';
			else return 'gc-user32';
		} else if (strDurationtype == '2') {
			// 제조일자
			strDuration1 = dateUtil.addDays(strLottable01, (nDuration * 2) / 3, ''); // 1/3
			strDuration2 = dateUtil.addDays(strLottable01, (nDuration * 1) / 3, ''); // 2/3
			strDuration3 = strLottable01; // 3/3
			if (strDuration1 <= dateUtil.getToDay('')) return 'gc-user32';
			else if (strDuration2 <= dateUtil.getToDay('') && dateUtil.getToDay('') < strDuration1) return 'gc-user27';
			else if (strDuration3 <= dateUtil.getToDay('') && dateUtil.getToDay('') < strDuration2) return 'gc-user42';
			else return 'gc-user32';
		} else if (strDurationtype == '3') {
			// 도정일자
			strDuration1 = dateUtil.addDays(strLottable01, (nDuration * 2) / 3, ''); // 1/3
			strDuration2 = dateUtil.addDays(strLottable01, (nDuration * 1) / 3, ''); // 2/3
			strDuration3 = strLottable01; // 3/3
			if (strDuration1 <= dateUtil.getToDay('')) return 'gc-user32';
			else if (strDuration2 <= dateUtil.getToDay('') && dateUtil.getToDay('') < strDuration1) return 'gc-user27';
			else if (strDuration3 <= dateUtil.getToDay('') && dateUtil.getToDay('') < strDuration2) return 'gc-user42';
			else return 'gc-user32';
		} else {
			return strDefaultColor;
		}
	};

	/**
	 * 영문을 한글로 변환 (영문자판 → 한글)
	 * @param str
	 * @returns {string}
	 */
	static convertEngToKor(str: string): string {
		const engChosung = 'rRseEfaqQtTdwWczxvg';
		const engJungsung = {
			k: 0,
			o: 1,
			i: 2,
			O: 3,
			j: 4,
			p: 5,
			u: 6,
			P: 7,
			h: 8,
			hk: 9,
			ho: 10,
			hl: 11,
			y: 12,
			n: 13,
			nj: 14,
			np: 15,
			nl: 16,
			b: 17,
			m: 18,
			ml: 19,
			l: 20,
		};
		const engJongsung = {
			'': 0,
			r: 1,
			R: 2,
			rt: 3,
			s: 4,
			sw: 5,
			sg: 6,
			e: 7,
			f: 8,
			fr: 9,
			fa: 10,
			fq: 11,
			ft: 12,
			fx: 13,
			fv: 14,
			fg: 15,
			a: 16,
			q: 17,
			qt: 18,
			t: 19,
			T: 20,
			d: 21,
			w: 22,
			c: 23,
			z: 24,
			x: 25,
			v: 26,
			g: 27,
		};
		const engChosungReg = '[' + engChosung + ']';
		const engJungsungReg = 'hk|ho|hl|nj|np|nl|ml|k|o|i|O|j|p|u|P|h|y|n|b|m|l';
		const engJongsungReg = 'rt|sw|sg|fr|fa|fq|ft|fx|fv|fg|qt|r|R|s|e|f|a|q|t|T|d|w|c|z|x|v|g|';

		const regExp = new RegExp(
			'(' +
				engChosungReg +
				')(' +
				engJungsungReg +
				')((' +
				engJongsungReg +
				')(?=(' +
				engChosungReg +
				')(' +
				engJungsungReg +
				'))|(' +
				engJongsungReg +
				'))',
			'g',
		);

		const converter = (_: string, cho: string, jung: keyof typeof engJungsung, jong: keyof typeof engJongsung) => {
			return String.fromCharCode(engChosung.indexOf(cho) * 588 + engJungsung[jung] * 28 + engJongsung[jong] + 44032);
		};

		return str.replace(regExp, converter);
	}

	/**
	 * XML 문자열에서 <TAG>value</TAG> 형태로 값을 추출합니다.
	 * @param {string} mode        – "SELECT" 만 지원 (추후 확장 가능)
	 * @param {string} xml         – 전체 XML/메시지 문자열
	 * @param {string} tagName     – 꺼내고자 하는 태그명
	 * @param {string} defaultValue– 태그가 없을 때 반환할 기본값
	 * @param defaultValue
	 * @returns {string}           – 태그 안의 값 또는 defaultValue
	 */
	static gfnGetParameter(mode: string, xml: string, tagName: string, defaultValue: string) {
		if (mode !== 'SELECT') {
			throw new Error(`Unsupported mode: ${mode}`);
		}
		const re = new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`);
		const m = xml.match(re);
		return m ? m[1] : defaultValue;
	}

	/**
	 * 날짜 여부를 확인
	 * @param sYmd
	 * @returns
	 */
	static gfnIsDateYmd(sYmd: string) {
		if (commUtil.isNull(sYmd)) return false;

		// 문자열로 변환 후 특수문자 제거
		const dateStr = String(sYmd).replace(/[-/.]/g, '');

		// 숫자만 있는지 체크
		if (!/^\d{8}$/.test(dateStr)) return false;

		const year = parseInt(dateStr.substring(0, 4));
		const month = parseInt(dateStr.substring(4, 6));
		const day = parseInt(dateStr.substring(6, 8));

		// 기본 범위 체크
		if (year < 1900 || year > 9999) return false;
		if (month < 1 || month > 12) return false;
		if (day < 1 || day > 31) return false;

		// Date 객체로 실제 날짜 존재 여부 확인
		const date = new Date(year, month - 1, day);
		return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
	}

	/**
	 * dataField로 초기값 생성
	 * @param gridCol
	 * @param initvalue
	 * @returns 초기값 객체
	 */
	static gfnCreateInitValue(gridCol: any, initvalue: Record<string, any> = {}) {
		return gridCol.reduce((map: Record<string, any>, col: any) => {
			if (!col.dataField) return map;

			// initvalue에 해당 필드가 존재하면 그것을 사용
			if (initvalue.hasOwnProperty(col.dataField)) {
				map[col.dataField] = initvalue[col.dataField];
			} else {
				// 그렇지 않으면 dataType 기준 기본값 설정
				switch (col.dataType) {
					case 'numeric':
						map[col.dataField] = 0;
						break;
					case 'boolean':
						map[col.dataField] = false;
						break;
					default:
						map[col.dataField] = '';
				}
			}

			return map;
		}, initvalue);
	}

	/**
	 * 저장기한 대비 만료일까지 남은 비율 계산
	 * @param {string} expiryDateStr - 만료일 ('YYYYMMDD' 포맷)
	 * @param {number} durationDays - 전체 저장기한(일)
	 * @param expireDate
	 * @param duration
	 * @param includePercent - '%' 기호 포함 여부 (기본값: true)
	 * @returns {string|number} 잔여일 비율(0~100) 또는 백분율 문자열
	 */
	static calcDurationRate(expireDate: string, duration: string, includePercent = true) {
		const durationNum = Number(duration);
		if (expireDate === 'STD') {
			return includePercent ? 100 + '%' : 100;
		}
		const today = dayjs().startOf('day');
		const expiryDate = dayjs(expireDate, 'YYYYMMDD');

		const diffDays = expiryDate.diff(today, 'day'); // 오늘부터 만료일까지 남은 일수
		if (diffDays <= 0) {
			return includePercent ? 0 + '%' : 0;
		}

		const remainRate = Math.floor((diffDays / durationNum) * 100);

		return includePercent ? remainRate + '%' : remainRate;
	}

	/**
	 * 소비기간
	 * @param {string} expiryDateStr - 만료일 ('YYYYMMDD' 포맷)
	 * @param {number} durationDays - 전체 저장기한(일)
	 * @param expireDate
	 * @param duration
	 * @returns {number} 잔여일 비율(0~100)
	 */
	static calcDurationTerm(expireDate: string, duration: string) {
		const durationNum = Number(duration);
		if (expireDate === 'STD') {
			return `/${duration}`;
		}
		const today = dayjs().startOf('day');
		const expiryDate = dayjs(expireDate, 'YYYYMMDD');

		const diffDays = expiryDate.diff(today, 'day'); // 오늘부터 만료일까지 남은 일수

		return `${diffDays}/${duration}`;
	}

	/**
	 * 배열에서 특정 키의 값이 중복되는지 체크
	 * @param List 중복 체크할 리스트
	 * @param key 중복 체크할 키
	 * @returns 중복 여부
	 */
	static hasDuplicateKeyInList(List: any[], key: string) {
		const seen = new Set();
		for (const item of List) {
			if (seen.has(item[key])) {
				return true; // 중복 발견 즉시 종료
			}
			seen.add(item[key]); // 중복 발견 안되면 추가
		}
		return false;
	}

	/**
	 * 자릿수 패드
	 * @param num 숫자
	 * @param len 자릿수
	 * @param padChar 채울문자
	 * @returns 패딩된 문자열
	 */
	static padNumber(num: number, len: number, padChar = '0') {
		return String(num).padStart(len, padChar);
	}

	static aLinkClick(href: string, target: string) {
		const link = document.createElement('a');
		link.href = href;
		link.target = target;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	/**
	 * 코드와 이름을 조합하여 반환
	 * returnValueFormat 옵션이 있으면 그에 맞게 반환값을 조정 (예: 코드만, 이름만, 둘 다 등)
	 * @param code 코드
	 * @param name 이름
	 * @param returnValueFormat 반환 형식 옵션
	 * @returns 조합된 문자열
	 */
	static convertCodeWithName(code: string, name: string, returnValueFormat?: any) {
		if (!code) {
			throw new Error('code는 유효한 값이어야 합니다.');
		}

		console.log('convertCodeWithName called with:', { code, name, returnValueFormat });

		// 기사등록 시에는 명만 보여야 함
		if (returnValueFormat === 'onlyName') {
			return name;
		}

		if (!name) {
			return `[${code || ''}]`;
		}

		return `[${code || ''}] ${name || ''}`;
	}

	/**
	 * 8자리 날짜를 입력하면 요일값 리턴
	 * @param date 숫자
	 * @returns 요일 숫자 일 (0:일요일 ~ 6:토요일)
	 */
	static getDay(date: string) {
		if (!commUtil.gfnIsDateYmd(date)) {
			throw new Error('유효한 날짜 형식이 아닙니다. YYYYMMDD 형식이어야 합니다.');
		}
		const year = parseInt(date.substring(0, 4), 10);
		const month = parseInt(date.substring(4, 6), 10) - 1; // 월은 0부터 시작
		const day = parseInt(date.substring(6, 8), 10);
		const dt = new Date(year, month, day);
		return dt.getDay();
	}

	/**
	 * 8자리 날짜를 입력하면 요일값 리턴
	 * @param date 숫자
	 * @returns 요일 문자 (일요일 ~ 토요일)
	 */
	static getDayWeek(date: string) {
		const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
		const dayIndex = commUtil.getDay(date);
		return dayNames[dayIndex];
	}

	/*
	 * 문자열의 UTF-8 바이트 길이 계산
	 * @param str
	 */
	static getByteLength(str: string | null | undefined): number {
		if (!str) return 0;
		if (typeof TextEncoder !== 'undefined') {
			try {
				return new TextEncoder().encode(str).length;
			} catch (e) {
				// fallback to manual
			}
		}
		let acc = 0;
		for (let i = 0; i < str.length; i++) {
			const code = str.charCodeAt(i);
			if (code <= 0x7f) acc += 1;
			else if (code <= 0x7ff) acc += 2;
			else if (code >= 0xd800 && code <= 0xdbff) {
				// surrogate pair (4 bytes)
				acc += 4;
				i++; // skip low surrogate
			} else acc += 3;
		}
		return acc;
	}

	/*
	 * 지정한 바이트 길이에 맞춰 문자열을 자름 (UTF-8 기준)
	 * @param str
	 * @param maxBytes
	 */
	static truncateByBytes(str: string | null | undefined, maxBytes: number): string {
		if (!str) return '';
		if (maxBytes <= 0) return '';

		if (typeof TextEncoder !== 'undefined') {
			const enc = new TextEncoder();
			const parts: string[] = [];
			let acc = 0;
			for (const ch of str) {
				const len = enc.encode(ch).length;
				if (acc + len > maxBytes) break;
				acc += len;
				parts.push(ch);
			}
			return parts.join('');
		}

		// fallback manual
		let out = '';
		let acc = 0;
		for (let i = 0; i < str.length; i++) {
			const code = str.charCodeAt(i);
			let add = 0;
			if (code <= 0x7f) add = 1;
			else if (code <= 0x7ff) add = 2;
			else if (code >= 0xd800 && code <= 0xdbff) {
				add = 4;
				if (acc + add > maxBytes) break;
				out += str[i] + (str[i + 1] || '');
				acc += add;
				i++;
				continue;
			} else add = 3;

			if (acc + add > maxBytes) break;
			acc += add;
			out += str[i];
		}
		return out;
	}

	/*
	 * 바이트 제한 검증 및 경고 (MessageUtil.showAlert 사용)
	 * 반환값: 유효하면 true, 초과하면 false (그리고 alert 호출)
	 * @param value
	 * @param maxBytes
	 * @param fieldLabel
	 */
	static validateAndAlertByteLimit(value: any, maxBytes: number, fieldLabel?: string): boolean {
		const str = value == null ? '' : String(value);
		const len = commUtil.getByteLength(str);
		if (len <= maxBytes) return true;

		//const labelPart = fieldLabel ? `'${fieldLabel}' ` : '';
		const labelPart = fieldLabel ? `[${fieldLabel}] ` : '';
		// 너무 길면 메시지에서 잘라서 보여주기 (UI에서 과도한 텍스트 방지)
		const displayValue = str.length > 200 ? str.slice(0, 200) + '...' : str;

		//const msg = `${labelPart}${maxBytes}바이트를 초과할 수 없습니다. (현재 ${len} 바이트)\n입력값: ${displayValue}`;
		showAlert(
			null,
			// {{0}}\n{{1}} 바이트를 초과할 수 없습니다.\n(현재 {{2}} 바이트)\n입력값:{{3}}
			i18next.t('msg.MSG_COM_ERR_MAX_LEN', [labelPart, maxBytes, len, displayValue]),
		);
		return false;
	}

	/**
	 * 난수 발생
	 * @param {number} max 최대값
	 * @returns {number} 결과값
	 */
	static secureRandom(max: number) {
		const arr = new Uint32Array(1);
		crypto.getRandomValues(arr);
		return arr[0] % max;
	}
	/**
	 * 퀵 스타일 함수 - 상태명 컬럼
	 * @param rowIndex
	 * @param columnIndex
	 * @param value
	 * @param headerText
	 * @param item
	 */
	static styleBackGround01(rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
		const status = item?.status ?? '';
		if (status == '01') return ''; // 없음
		if (status === '02') return 'gc-user36'; // 02:센터접수->파랑
		if (status === '03') return 'gc-user39'; // 03:퀵주문등록->회색
		return '';
	}

	/**
	 * 택배 스타일 함수 - 상태명 컬럼
	 * @param rowIndex
	 * @param columnIndex
	 * @param value
	 * @param headerText
	 * @param item
	 */
	static styleBackGround02(rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
		const status = item?.status ?? '';
		if (status == '10') return ''; // 10:업로드->없음
		if (status === '12') return 'gc-user41'; // 12:접수실패->빨강
		if (status === '16') return 'gc-user51'; // 16:접수확정->노랑
		if (status === '17') return 'gc-user25'; // 17:송장분리완료->파랑
		if (status === '20') return 'gc-user54'; // 20:택배접수완료->초록
		if (status === '21') return 'gc-user41'; // 21:택배접수취소->빨강
		return '';
	}

	/**
	 * 입고가능여부
	 * @param item
	 * @param 기준마스터 코드리스트
	 * @param expCodeListMap
	 * @returns {boolean} 결과값
	 */
	static isDpPossible(item: any, expCodeListMap: any) {
		if (!dayjs(item?.lotExpire).isValid()) {
			//1.STD
			return true;
		}
		if (item?.duration == '9999') {
			//2.소비일자 9999
			return true;
		}
		if (dayjs(item?.lotExpire).isBefore(dayjs(), 'day')) {
			//4.소비기한이 오늘전
			return false;
		}
		if (item?.excptYnOri == 'Y') {
			//5.예외 O
			return true;
		}
		//5. 코드 기간 확인
		const expCode = expCodeListMap.find((c: any) => {
			return (
				(item?.storagetype == c.storagetype || item?.storagetypeCode == c.storagetype) &&
				parseInt(item?.duration) >= parseInt(c.start) &&
				parseInt(item?.duration) < parseInt(c.end)
			);
		});

		if (parseInt(commUtil.calcDurationRate(item?.lotExpire, item?.duration)) < parseInt(expCode?.rate)) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * 그리드내 PK(유니크값) 체크로직(행추가로 생성된 빈값은 제외하고 중복값을 찾아냄)
	 * @param gridRef(예 : ref.gridRef(current는 제외))
	 * @param columnList(예: ['dccode', 'sku', 'custkey'])
	 * @param gridRef
	 * @param columnList
	 * @returns {boolean} 결과값
	 */
	static validatePKData(gridRef: any, columnList: any) {
		if (columnList.length < 1) return false;

		const columnInfoList: any[] = []; // 체크 컬럼
		const collectRequiredColumns = (columns: any[]) => {
			for (const item of columns) {
				// 체크 칼럼 추가
				if (columnList.includes(item.dataField)) {
					columnInfoList.push(item);
				}

				// 자식 칼럼도 체크
				if (item.children && item.children.length > 0) {
					collectRequiredColumns(item.children);
				}
			}
		};
		const allColumnLayout: any = gridRef.current.getColumnLayout();
		collectRequiredColumns(allColumnLayout);

		const gridData = gridRef.current.getGridData();
		const existingRows = gridData.filter((r: any) => columnInfoList.some((col: any) => r[col.dataField]));

		const map = new Map();
		for (const i in existingRows) {
			const value = columnInfoList.map((col: any) => `${existingRows[i][col.dataField]}`).join(',');

			// 중복된 값이 있을 경우
			if (map.has(value)) {
				showAlert(null, `[ ${value} ] 중복된 값입니다.`);

				return false;
			} else {
				map.set(value, i);
			}
		}

		return true;
	}

	/**
	 * 제조일자 또는 소비일자 변경 시 관련 값 계산
	 *@param flag(1:제조일자, 2:소비일자)
	 * @param flag
	 * @param dt
	 * @param duration
	 */
	static calcLotDates(flag: string, dt: string, duration: number) {
		let dt2 = '';

		if (dt == 'STD') {
			return 'STD';
		}
		if (flag === '1') {
			//
			dt2 = dayjs(dt, 'YYYYMMDD')
				.add(duration - 1, 'day')
				.format('YYYYMMDD');
		} else if (flag === '2') {
			//
			dt2 = dayjs(dt, 'YYYYMMDD')
				.add(-(duration - 1), 'day')
				.format('YYYYMMDD');
		}

		return dt2;
	}
}

export default commUtil;
