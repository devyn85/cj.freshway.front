import { FormInstance } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

/**
 * Ant Design Form 변경 감지 훅
 * @param {FormInstance} form Ant Design FormInstance
 * @param {Record<string, any>} defaultValues 초기값 (선택)
 * @returns {void} 결과값
 */
export function useFormDiff(form: FormInstance, defaultValues?: Record<string, any>) {
	const [initialValues, setInitialValues] = useState<Record<string, any>>(defaultValues || {});
	const [changedFields, setChangedFields] = useState<string[]>([]);

	// 현재값 가져오기
	const getCurrentValues = () => form.getFieldsValue(true);

	// 변경된 필드 계산
	const calculateChangedFields = () => {
		const current = getCurrentValues();
		const diffKeys = Object.keys({ ...initialValues, ...current }).filter(key => {
			let initVal = initialValues[key] ?? '';
			let currentVal = current[key] ?? '';

			// dayjs 일 경우 비교할 수 있는 값으로 변경
			if (dayjs.isDayjs(initVal)) initVal = initVal.format('YYYY-MM-DD HH:mm:ss');
			if (dayjs.isDayjs(currentVal)) currentVal = currentVal.format('YYYY-MM-DD HH:mm:ss');

			return key !== 'rowStatus' && initVal !== currentVal;
		});

		// //console.log('DDDDDDDDDDDDDDDDDDDD');
		// //console.log(diffKeys);
		// //console.log('DDDDDDDDDDDDDDDDDDDD');

		setChangedFields(diffKeys);
	};

	useEffect(() => {
		calculateChangedFields();
	}, [initialValues]);

	// 변경된 값만 추출
	const changedValues = useMemo(() => {
		const current = getCurrentValues();
		return changedFields.reduce((acc, key) => {
			acc[key] = current[key];
			return acc;
		}, {} as Record<string, any>);
	}, [changedFields]);

	// 초기 상태로 리셋
	const resetForm = (initVal?: any) => {
		if (initVal) {
			form.setFieldsValue(initVal);
		}
		setChangedFields([]);
	};

	return {
		changedFields,
		changedValues,
		isFormChanged: changedFields.length > 0,
		resetForm,
		setInitialValues,
		onFormValuesChange: calculateChangedFields,
	};
}
