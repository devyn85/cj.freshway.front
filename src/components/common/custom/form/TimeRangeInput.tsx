import type { FormInstance } from 'antd';
import { Col, Form, Input, Space } from 'antd';
import React from 'react';

interface TimeRangeInputProps {
	label?: string;
	required?: boolean;
	span?: number;
	fromName: string;
	toName: string;
	fromPlaceholder?: string;
	toPlaceholder?: string;
	fromMaxLength?: number; // 기본 5
	toMaxLength?: number; // 기본 5
	form?: FormInstance; // 폼 컨텍스트 밖에서 사용할 때 주입
	autoValidate?: boolean; // 블러 시 HH:MM 정규화 (기본 true)
}

/* ---------------- v5/v4 공통 set/get/watch ---------------- */

const setField = (form: FormInstance | undefined, name: string, value: any) => {
	if (!form) return;
	if ('setFieldValue' in form) (form as any).setFieldValue(name, value); // v5
	else (form as any).setFieldsValue({ [name]: value }); // v4
};

const getField = (form: FormInstance | undefined, name: string) => {
	if (!form) return undefined;
	if ('getFieldValue' in form) return (form as any).getFieldValue(name); // v5/v4 공통
	return undefined;
};

const useAntdWatch = (name: string, form: FormInstance | undefined) => {
	const anyForm = Form as any;
	return anyForm.useWatch ? anyForm.useWatch(name, form) : getField(form, name);
};

/* ---------------- 키/붙여넣기 제어 ---------------- */

const isEditKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
	const k = e.key;
	return (
		k === 'Backspace' ||
		k === 'Delete' ||
		k === 'ArrowLeft' ||
		k === 'ArrowRight' ||
		k === 'Tab' ||
		e.ctrlKey ||
		e.metaKey
	);
};

/* ---------------- 포맷/정규화 함수 ---------------- */

const toHHMMLive = (raw: string) => {
	const d = raw.replace(/\D/g, '').slice(0, 4); // 숫자만 + 최대 4자리
	if (d.length <= 2) return d; // "1","12"
	return `${d.slice(0, 2)}:${d.slice(2)}`; // "12:3","12:34"
};

const normalizeOnBlur = (raw: string) => {
	const d = (raw || '').replace(/\D/g, '');
	if (d.length !== 4) {
		// 4자리가 아니면 (1~3자리) → 비움 처리
		return '';
	}

	const hh = d.slice(0, 2);
	const mm = d.slice(2, 4);

	// 숫자 변환
	const h = parseInt(hh, 10);
	const m = parseInt(mm, 10);

	// ✅ 유효 범위 검사
	if (isNaN(h) || isNaN(m) || h > 23 || m > 59) {
		return ''; // 비움 처리
	}

	// ✅ 두 자리 고정
	const paddedH = String(h).padStart(2, '0');
	const paddedM = String(m).padStart(2, '0');

	return `${paddedH}:${paddedM}`;
};

/* ---------------- 컴포넌트 ---------------- */

const TimeRangeInput: React.FC<TimeRangeInputProps> = ({
	label,
	required = false,
	span = 24,
	fromName,
	toName,
	fromPlaceholder,
	toPlaceholder,
	fromMaxLength = 5,
	toMaxLength = 5,
	form: formProp,
	autoValidate = true,
}) => {
	// 폼 인스턴스: props 우선, 없으면 컨텍스트
	const formInstance: FormInstance | undefined = formProp ?? (Form as any).useFormInstance?.();

	// 디버깅 용도
	//useAntdWatch(fromName, formInstance);
	//useAntdWatch(toName, formInstance);

	// 숫자만 허용(입력 단계)
	const onBeforeInputDigitsOnly = (e: React.FormEvent<HTMLInputElement>) => {
		const native = e as unknown as InputEvent;
		if (!('data' in native) || native.data == null) return;
		if (/[^0-9]/.test(native.data)) e.preventDefault();
	};

	const onKeyDownDigitsOnly = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (isEditKey(e)) return;
		if (!/^[0-9]$/.test(e.key)) e.preventDefault();
	};

	const onPasteDigitsOnly = (e: React.ClipboardEvent<HTMLInputElement>, name: string) => {
		e.preventDefault();
		const digits = e.clipboardData.getData('text').replace(/\D/g, '');
		if (!digits) return;
		const cur = String(getField(formInstance, name) ?? '');
		const next = toHHMMLive(cur + digits); // 최대 4자리 유지 + 콜론
		setField(formInstance, name, next);
	};

	const formItemProps = { label, required, colon: false as const, style: { marginBottom: 0 } };

	return (
		<Col span={span}>
			<Form.Item {...formItemProps}>
				<Space align="center" size={8} style={{ display: 'flex' }}>
					{/* from */}
					<Form.Item name={fromName} noStyle>
						<Input
							id={fromName}
							placeholder={fromPlaceholder ?? 'HH:MM'}
							maxLength={fromMaxLength}
							style={{ flex: 1, minWidth: 0 }}
							inputMode="numeric"
							onBeforeInput={onBeforeInputDigitsOnly}
							onKeyDown={onKeyDownDigitsOnly}
							onPaste={e => onPasteDigitsOnly(e, fromName)}
							onChange={e => {
								const next = toHHMMLive(e.target.value);
								setField(formInstance, fromName, next);
							}}
							onBlur={() => {
								if (!autoValidate) return;
								const raw = String(getField(formInstance, fromName) ?? '');
								setField(formInstance, fromName, normalizeOnBlur(raw));
							}}
						/>
					</Form.Item>

					<span className="sep" style={{ flex: '0 0 auto' }}>
						~
					</span>

					{/* to */}
					<Form.Item name={toName} noStyle>
						<Input
							id={toName}
							placeholder={toPlaceholder ?? 'HH:MM'}
							maxLength={toMaxLength}
							style={{ flex: 1, minWidth: 0 }}
							inputMode="numeric"
							onBeforeInput={onBeforeInputDigitsOnly}
							onKeyDown={onKeyDownDigitsOnly}
							onPaste={e => onPasteDigitsOnly(e, toName)}
							onChange={e => {
								const next = toHHMMLive(e.target.value);
								setField(formInstance, toName, next);
							}}
							onBlur={() => {
								if (!autoValidate) return;
								const raw = String(getField(formInstance, toName) ?? '');
								setField(formInstance, toName, normalizeOnBlur(raw));
							}}
						/>
					</Form.Item>
				</Space>
			</Form.Item>
		</Col>
	);
};

export default TimeRangeInput;
