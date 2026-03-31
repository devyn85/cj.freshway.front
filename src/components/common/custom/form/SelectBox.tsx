/*
############################################################################
# FiledataField : SelectBox.tsx
# Description   : Custom SelectBox 
# Author        : Canal Frame
# Since         : 23.09.25
############################################################################
*/
import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { FormProps, SelectboxProps } from '@/types/input';
import { CaretDownOutlined } from '@ant-design/icons';
import { Col, Form, Select } from 'antd';
// useMemo를 추가로 import 합니다.
import { useEffect, useMemo, useRef, useState } from 'react';

interface Props extends SelectboxProps {
	fieldNames?: { label: string; value: string };
}

const SelectBox = (props: Props) => {
	const {
		refs,
		name,
		span = 24,
		label,
		required,
		options,
		placeholder = '--- 선택 ---',
		fieldNames,
		showSearch,
		defaultValue,
		disabled,
		mode,
		notFoundContent,
		allowClear,
		filterOption,
		onSelect,
		onChange,
		onSearch,
		onBlur,
		rules,
		style,
		validateValueInOptions,
	} = props;

	/* multiple all 선택시 전체선택 */
	const ALL_VALUE = 'all';
	const allOptionValues = options?.map((o: any) => o[fieldNames?.value || 'value']);
	const prevRef = useRef<any[]>([]);

	const [open, setOpen] = useState<boolean>(false);
	const selectRef = useRef<any>(null);
	const selectForm = Form.useFormInstance?.();

	const formProps: FormProps = {
		label: label,
		name: name,
		span: span,
		required: required,
		rules: rules,
		colon: props.colon ?? true,
		initialValue: props.initval, // FormItemProps.initialValue 값 추가 (2025.05.13)(JGS)
	};

	// Arrow 버튼과 Clear 버튼 노출여부
	const [showArrowState, setShowArrowState] = useState(true);

	// 외부 스크롤 시 드롭다운 닫기 훅 사용
	useCloseOnExternalScroll({
		open,
		onClose: () => setOpen(false),
		allowScrollRefs: [selectRef],
	});

	/**
	 * Select filter 적용
	 * @param {string} input 입력 값
	 * @param {object} option filter option
	 * @returns {boolean} filter 결과
	 */
	const filter = (input: string, option: any) => {
		if (fieldNames?.label) {
			return option[fieldNames?.label].indexOf(input) >= 0;
		} else {
			return option.label.indexOf(input) >= 0;
		}
	};

	const handleDropdownVisibleChange = (visible: boolean) => {
		setOpen(visible);
		if (props.onDropdownVisibleChange) {
			props.onDropdownVisibleChange(visible);
		}
	};

	// onChange 이벤트 선 처리
	const preOnChange = (value: any) => {
		// Arrow 버튼과 Clear 버튼 노출여부 설정
		// 간단한 빈 값 체크 (실제 프로젝트의 commUtil 로직에 맞게 수정 필요)
		const isEmpty = !value || (Array.isArray(value) && value.length === 0);
		setShowArrowState(isEmpty);

		/*멀티플 all 로직 추가*/
		if (Array.isArray(value)) {
			const prevValue = prevRef.current;
			const hasAllPrev = prevValue.includes('all');
			const hasAllNext = value.includes('all');
			// 1. 전체 클릭
			if (!hasAllPrev && hasAllNext) {
				selectForm.setFieldValue(name, allOptionValues);
				prevRef.current = allOptionValues;
				return;
			}

			// 2. 전체 선택된 상태에서 전체 클릭 (전체 해제)
			if (hasAllPrev && !hasAllNext) {
				selectForm.setFieldValue(name, []);
				prevRef.current = [];
				return;
			}

			// 3. 전체 상태에서 개별 요소 해제 → all도 해제
			if (hasAllPrev && prevValue.length === allOptionValues.length && value.length < allOptionValues.length) {
				const filtered = value.filter((v: any) => v !== 'all');
				selectForm.setFieldValue(name, filtered);
				prevRef.current = filtered;
				return;
			}

			// 4. 개별 옵션을 전부 선택 → all 자동 포함
			const onlyOptions = value.filter(v => v !== 'all');
			const optionValues = allOptionValues.filter(v => v !== 'all');
			if (onlyOptions.length === optionValues.length) {
				selectForm.setFieldValue(name, allOptionValues);
				prevRef.current = allOptionValues;
				return;
			}

			//5. 기본
			selectForm.setFieldValue(name, value);
			prevRef.current = value;
		}

		// 콜백 처리
		if (props.onChange && props.onChange instanceof Function) {
			props.onChange(value);
		}
	};

	useEffect(() => {
		if (commUtil.isNotEmpty(selectForm?.getFieldValue(name))) {
			if (Array.isArray(selectForm?.getFieldValue(name))) {
				// [null] 값 filter 처리
				const cleanArray = selectForm?.getFieldValue(name)?.filter((v: any) => v != null);
				if (cleanArray?.length > 0) {
					setShowArrowState(false);
				}
			} else {
				setShowArrowState(false);
			}
		}
	}, []);

	// -----------------------------------------------------------
	// [수정 포인트] 가장 긴 Option 텍스트 길이에 맞춰 Width 계산
	// -----------------------------------------------------------
	const isMulti = mode === 'multiple' || mode === 'tags';

	const calculatedWidth = useMemo(() => {
		// 1. Multi 모드면 너비 계산을 하지 않고 100% 등을 사용하기 위해 null 반환
		if (isMulti) return '100%';

		// 2. 옵션이 없으면 기본값 (예: 120px 또는 auto)
		if (!options || options.length === 0) return '100%';

		// 3. 라벨 키 찾기 (fieldNames가 없으면 기본값 'label')
		const labelKey = fieldNames?.label || 'label';
		let maxLen = 0;

		// 4. 옵션을 순회하며 가장 긴 텍스트 길이 찾기
		options.forEach((opt: any) => {
			const text = opt[labelKey];
			if (text) {
				// 한글과 영문의 너비 차이가 있으므로, 정확도를 위해 Byte 길이로 계산하거나
				// 단순하게는 글자 수 * 가중치를 둡니다. 여기서는 글자 수 기준입니다.
				const currentLen = String(text).length;
				if (currentLen > maxLen) maxLen = currentLen;
			}
		});

		// 5. 픽셀로 변환 (대략적인 계산)
		// 기본 폰트 14px 기준, 글자당 약 14~15px 잡고 + 패딩/아이콘 공간(약 45px) 추가
		const pixelWidth = maxLen * 10 + 25;

		return `${pixelWidth}px`;
	}, [options, isMulti, fieldNames]);

	// 6. 최종 스타일 병합
	// Multi일 때는 기존처럼 100% (또는 props.style), Single일 때는 계산된 너비 적용
	const mergedStyle = {
		width: calculatedWidth,
		...style, // props로 넘어온 style이 있다면 덮어씌울 수도 있음 (순서 조절 가능)
	};

	// Backspace 완전 차단
	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Backspace') {
			e.preventDefault();
			e.stopPropagation(); // 이벤트 전파 방지
		}
	};

	// 빈값 여부에 따라 Arrow 버튼과 Clear 버튼 노출 설정
	const value = Form.useWatch(name, selectForm);
	useEffect(() => {
		if (commUtil.isNotEmpty(value)) {
			setShowArrowState(false);

			// validateValueInOptions props가 true인 경우, value가 options에 없으면 빈값으로 처리
			if (validateValueInOptions && options && options.length > 0) {
				const valueKey = fieldNames?.value || 'value';
				const optionValues = options.map((o: any) => o[valueKey]);

				// value가 options에 없으면 빈값으로 세팅
				if (!optionValues.includes(value)) {
					selectForm.setFieldValue(name, undefined);
					return;
				}
			}
		} else {
			setShowArrowState(true);
		}
	}, [value, options, validateValueInOptions, fieldNames, name, selectForm]);

	return (
		<Col span={span}>
			<Form.Item {...formProps}>
				<Select
					{...props}
					// 👇 계산된 width가 적용된 스타일
					style={mergedStyle}
					ref={refs || selectRef}
					placeholder={placeholder}
					fieldNames={fieldNames}
					options={options}
					showSearch={showSearch}
					defaultValue={defaultValue}
					disabled={disabled}
					mode={mode}
					notFoundContent={notFoundContent}
					allowClear={allowClear && !showArrowState}
					suffixIcon={!allowClear || showArrowState ? <CaretDownOutlined style={{ pointerEvents: 'none' }} /> : null}
					filterOption={filterOption ? filterOption : filter}
					onSelect={onSelect}
					onChange={preOnChange}
					onSearch={onSearch}
					onBlur={onBlur}
					open={open}
					dropdownAlign={{
						offset: [0, -1],
					}}
					onDropdownVisibleChange={handleDropdownVisibleChange}
					// 👇 'multiple' 모드일 경우 제어
					{...(mode === 'multiple' && {
						showSearch: false,
						allowClear: true,
						suffixIcon: showArrowState ? <CaretDownOutlined style={{ pointerEvents: 'none' }} /> : null,
						maxTagCount: 0,
						maxTagPlaceholder: (omittedValues: any) =>
							omittedValues.length > 1
								? `${omittedValues[0]?.['label']} 외 ${omittedValues.length - 1}개`
								: omittedValues[0]?.['label'],
						onInputKeyDown: handleInputKeyDown,
					})}
				/>
			</Form.Item>
		</Col>
	);
};

export default SelectBox;
