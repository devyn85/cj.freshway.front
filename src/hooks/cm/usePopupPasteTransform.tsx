import { useCallback } from 'react';

/**
 * 붙여넣기 시 텍스트를 변환하는 hook
 * 줄바꿈(\r\n, \r, \n)을 콤마(,)로 변환하고 마지막 콤마 제거
 * @returns {Function} 붙여넣기 이벤트 핸들러를 반환하는 함수
 */
export const usePopupPasteTransform = () => {
	return useCallback((form: any, fieldName: string, searchYn?: boolean, code?: string) => {
		return (event: any) => {
			event.preventDefault(); // 기본 붙여넣기 동작 방지

			const pastedText = event.clipboardData.getData('text/plain');
			let transformedText = pastedText.replace(/(?:\r\n|\r|\n)/g, ',');

			// 제일 끝 문자가 ','로 끝나면 제거
			if (transformedText.endsWith(',')) {
				transformedText = transformedText.slice(0, -1);
			}

			// 중복 문자열 제거
			transformedText = [...new Set(transformedText.split(','))].join(',');

			// form에 변환된 텍스트 설정
			form.setFieldsValue({ [fieldName]: transformedText });

			// 검색영역에 붙여넣기 할 경우
			if (searchYn) {
				if (transformedText.includes(',')) {
					form.setFieldsValue({ [fieldName]: `${transformedText.split(',').length}건 선택` });
				}
				form.setFieldsValue({ [code]: transformedText });
			}
		};
	}, []);
};
