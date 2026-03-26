import { Form } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { useEffect } from 'react';

/**
 * 팝업 검색 초기화
 * @description 팝업이 열리는 inputSearch 값이 비어있으면, form 값을 초기화
 * @param {object} param0 팝업 검색 초기화 파라미터 객체
 * @param {FormInstance} param0.form 폼 인스턴스
 * @param {string} param0.name 팝업 검색 초기화 파라미터 이름
 * @param {string} param0.value 팝업 검색 초기화 파라미터 값
 * @param {string} param0.code 팝업 검색 초기화 파라미터 코드
 * @returns {void}
 */
export const usePopupSearchValue = ({
	form,
	name,
	code,
	value,
}: {
	form: FormInstance;
	name: string;
	code: string;
	value?: string;
}) => {
	const watchValue = Form.useWatch(name, form);

	useEffect(() => {
		if (!watchValue?.trim()) {
			form.setFieldsValue({ [name]: '', [code]: '' });
		}
	}, [watchValue]);

	useEffect(() => {
		if (value) {
			form.setFieldsValue({ [name]: value });
		}
	}, [value]);
};
