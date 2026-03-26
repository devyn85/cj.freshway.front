import { useCallback, useState } from 'react';
import { Cookies } from 'react-cookie';
const cookies = new Cookies();

// default 옵션
const COOKIES_OPTION: any = {
	sameSite: 'strict',
	path: '/',
	expires: null,
};

/**
 * useCookie hook
 * @param {string} name name
 * @param {*} defaultValue 기본 값
 * @param {*} options 옵션
 * @returns {*} value, updateCookie, deleteCookie
 */
export default function useGlobalCookies(name: string, defaultValue: any, options?: any) {
	// 기본 쿠키 생성
	const [value, setValue] = useState(() => {
		const cookie = cookies.get(name);
		if (cookie) return cookie;
		cookies.set(name, defaultValue, setOption(options));
		return defaultValue;
	});
	// 쿠키 업데이트
	const updateCookie = useCallback(
		(newValue: string, options: any) => {
			cookies.set(name, newValue, setOption(options));
			setValue(newValue);
		},
		[name],
	);
	// 쿠키 삭제
	const deleteCookie = useCallback(() => {
		cookies.remove(name);
	}, [name]);

	return [value, updateCookie, deleteCookie];
}

/**
 * 쿠키 기본 옵션 적용
 * @param {*} option 옵션 정보
 * @returns {*} option 정보
 */
const setOption = (option: any) => {
	const today = new Date();
	// 기본 옵션 1주일
	const expireDate = today.setDate(today.getDate() + 7);
	COOKIES_OPTION.expires = new Date(expireDate);
	// merge
	return Object.assign(COOKIES_OPTION, option);
};
