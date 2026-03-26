import i18n from 'i18next';

import ko from '@/lang/ko';

import * as dayjs from 'dayjs';
import 'dayjs/locale/ko';

/* 
 # FiledataField	: i18n.ts
 # Description	: 다국어 처리
 # Author	: CANALFRAME Developer
 # Since		: 22.09.23
 */
const resources = {
	// 'en-US': { translation: en },
	'ko-KR': { translation: ko },
};

const userLanguage = window.navigator.language;

i18n.use(initReactI18next).init({
	resources,
	lng: localStorage.getItem('language') || userLanguage || 'ko-KR',
	fallbackLng: constants.LOCALE.EN_US,
	interpolation: {
		escapeValue: false, // HTML escape 비활성화
	},
});

export default i18n;

export const setLocale = (lang: string): void => {
	localStorage.setItem('language', lang);
	i18n.changeLanguage(lang);
	dayjs.locale(getLangFormat(lang));
};

// ko-KR => ko
const getLangFormat = (lang: string): string => {
	switch (lang) {
		case 'ko-KR':
			return 'ko';
		case 'en-US':
			return 'en';
		default:
			return 'ko';
	}
};
