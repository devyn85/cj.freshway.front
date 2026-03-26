/*
############################################################################
# Component: TmDispatchOptionsModal (배차옵션 설정 모달)
# 목적: TmOrderList 화면에서 배차 조건을 설정하는 모달 컴포넌트
# 
# [주요 기능]
# - 배차 옵션 설정 (최대중량, 특수조건, 최대착지수, 다회전여부, CBM조정, POP개수제한)
# - 옵션별 ON/OFF 토글 및 값 입력
# - 변경사항 감지 및 저장 확인
# - DC코드별 옵션 저장/조회
# 
# [배차 옵션 설명]
# - 최대중량: ON=차량 최대물량 기준 배차, OFF=적정물량 기준 배차
# - 특수조건: ON=특수조건 관리처는 고정차량만 배차, OFF=다른 차량 배차 허용
# - 최대착지수: ON=설정한 최대 착지수 미만으로 배차, OFF=착지수 제한 없음
# - 다회전여부: ON=다회전 고려하여 배차, OFF=단회전 기준으로 배차
# - 최대적재량조정(CBM): ON=톤급별 허용비율(%)로 최대 적재량 적용, OFF=CBM 제한 없음
# - POP최대개수: ON=입력한 최대 POP개수 이내로 배차, OFF=POP개수 제한 없음
# 
# [사용처]
# - TmOrderList.tsx에서 배차옵션 버튼 클릭 시 열림
# - 배송/조달 유형에 따라 모달 제목 동적 변경
# 
# [Props]
# - open: 모달 열림/닫힘 상태
# - onClose: 모달 닫기 함수
# - title: 모달 제목 (배송옵션/조달옵션)
# - dccode: 물류센터 코드 (옵션 저장/조회 시 사용)
# 
# [API 연동]
# - getDispatchOptions: 배차 옵션 조회
# - setDispatchOptions: 배차 옵션 저장
############################################################################
*/

import { getDispatchOptions, setDispatchOptions, type DispatchOptionsDTO } from '@/api/tm/apiTmDispatchOptions';
import { showAlert } from '@/util/MessageUtil';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Modal as AntdModal, Button, Divider, InputNumber, Switch, Tooltip, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

// 배차옵션 모달 Props 타입 정의
export type TmDispatchOptionsModalProps = {
	open: boolean; // 모달 열림/닫힘 상태
	onClose: () => void; // 모달 닫기 함수
	onSave?: () => void; // 저장 성공 시 호출되는 콜백 (배차 재계산용)
	title?: string; // 모달 제목 (배송옵션/조달옵션)
	dccode?: string | null; // 물류센터 코드 (옵션 저장/조회 시 사용)
};

// 로컬 옵션 상태 타입 정의
type LocalOptions = {
	maxWeight: boolean; // 최대중량 사용 여부
	specialCondition: boolean; // 특수조건 사용 여부
	maxStopsOn: boolean; // 최대 착지수 사용 여부
	multiTurnOn: boolean; // 다회전 여부 사용 여부
	cbmAdjustOn: boolean; // CBM 조정 사용 여부
	cbmAdjustValue: number | undefined; // CBM 조정값 (deprecated)
	// 톤급별 CBM 허용 비율 (%)
	cbmRatio1: number | undefined; // 1톤
	cbmRatio1_4: number | undefined; // 1.4톤
	cbmRatio2_5: number | undefined; // 2.5톤
	cbmRatio3_5: number | undefined; // 3.5톤
	cbmRatio5: number | undefined; // 5톤
	cbmRatio11: number | undefined; // 11톤
	maxPopOn: boolean; // POP 최대 개수 사용 여부
	maxPopCount: number | undefined; // POP 최대 개수
};

const TmDispatchOptionsModal = ({ open, onClose, onSave, title, dccode }: TmDispatchOptionsModalProps) => {
	// 현재 옵션 상태 (사용자가 변경하는 값)
	const [options, setOptions] = useState<LocalOptions>({
		maxWeight: true, // 기본값: 최대중량 사용
		specialCondition: false, // 기본값: 특수조건 미사용
		maxStopsOn: false, // 기본값: 최대 착지수 미사용
		multiTurnOn: false, // 기본값: 다회전 미사용
		cbmAdjustOn: false, // 기본값: CBM 조정 미사용
		cbmAdjustValue: undefined, // 기본값: CBM 조정값 없음 (deprecated)
		// 톤급별 CBM 허용 비율 기본값: 100%
		cbmRatio1: 100,
		cbmRatio1_4: 100,
		cbmRatio2_5: 100,
		cbmRatio3_5: 100,
		cbmRatio5: 100,
		cbmRatio11: 100,
		maxPopOn: false, // 기본값: POP 최대 개수 미사용
		maxPopCount: undefined, // 기본값: POP 최대 개수 없음
	});

	// 초기 옵션 상태 (서버에서 조회한 원본 값)
	const [initialOptions, setInitialOptions] = useState<LocalOptions>({
		maxWeight: true,
		specialCondition: false,
		maxStopsOn: false,
		multiTurnOn: false,
		cbmAdjustOn: false,
		cbmAdjustValue: undefined,
		cbmRatio1: 100,
		cbmRatio1_4: 100,
		cbmRatio2_5: 100,
		cbmRatio3_5: 100,
		cbmRatio5: 100,
		cbmRatio11: 100,
		maxPopOn: false,
		maxPopCount: undefined,
	});

	const [modal, contextHolder] = AntdModal.useModal();

	// 변경사항 감지: 현재 옵션과 초기 옵션 비교
	const isDirty = useMemo(() => {
		return (
			options.maxWeight !== initialOptions.maxWeight ||
			options.specialCondition !== initialOptions.specialCondition ||
			options.maxStopsOn !== initialOptions.maxStopsOn ||
			options.multiTurnOn !== initialOptions.multiTurnOn ||
			options.cbmAdjustOn !== initialOptions.cbmAdjustOn ||
			options.cbmAdjustValue !== initialOptions.cbmAdjustValue ||
			options.cbmRatio1 !== initialOptions.cbmRatio1 ||
			options.cbmRatio1_4 !== initialOptions.cbmRatio1_4 ||
			options.cbmRatio2_5 !== initialOptions.cbmRatio2_5 ||
			options.cbmRatio3_5 !== initialOptions.cbmRatio3_5 ||
			options.cbmRatio5 !== initialOptions.cbmRatio5 ||
			options.cbmRatio11 !== initialOptions.cbmRatio11 ||
			options.maxPopOn !== initialOptions.maxPopOn ||
			options.maxPopCount !== initialOptions.maxPopCount
		);
	}, [options, initialOptions]);

	// 부호 있는 소수점 입력 검증 (CBM 조정값용)
	const handleSignedDecimalKeyDown = useCallback((e: any) => {
		// 허용된 키 (백스페이스, 삭제, 탭, 엔터, 방향키 등)
		const allowed = ['Backspace', 'Delete', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
		if (allowed.includes(e.key)) return;

		// 단축키 허용 (Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X)
		if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(String(e.key).toLowerCase())) return;

		const key = String(e.key);
		const isDigit = /^\d$/.test(key);
		const isMinus = key === '-';
		const isDot = key === '.';

		if (isDigit) {
			// 숫자 입력 시: 부호 있는 소수점 2자리까지 허용
			const input = e.target as HTMLInputElement | undefined;
			const value = input?.value ?? '';
			const start = input?.selectionStart ?? value.length;
			const end = input?.selectionEnd ?? value.length;
			const newValue = `${value.slice(0, start)}${key}${value.slice(end)}`;
			const regex = /^-?\d*(?:\.\d{0,2})?$/;
			if (!regex.test(newValue)) {
				e.preventDefault();
			}
			return;
		}

		if (isMinus) {
			// 마이너스 입력 시: 맨 앞에 1회만 허용
			const input = e.target as HTMLInputElement | undefined;
			const value = input?.value ?? '';
			const selectionStart = input?.selectionStart ?? 0;
			if (selectionStart !== 0 || value.startsWith('-')) {
				e.preventDefault();
			}
			return;
		}

		if (isDot) {
			// 소수점 입력 시: 1회만 허용
			const input = e.target as HTMLInputElement | undefined;
			const value = input?.value ?? '';
			if (value.includes('.')) {
				e.preventDefault();
			}
			return;
		}

		// 기타 키는 모두 차단
		e.preventDefault();
	}, []);

	// 부호 있는 소수점 붙여넣기 검증 (CBM 조정값용)
	const handleSignedDecimalPaste = useCallback((e: any) => {
		const input = e.target as HTMLInputElement | undefined;
		const value = input?.value ?? '';
		const start = input?.selectionStart ?? value.length;
		const end = input?.selectionEnd ?? value.length;
		const pasted = e.clipboardData?.getData('text') ?? '';
		const newValue = `${value.slice(0, start)}${pasted}${value.slice(end)}`;
		const regex = /^-?\d*(?:\.\d{0,2})?$/;
		if (!regex.test(newValue)) {
			e.preventDefault();
		}
	}, []);

	// 부호 없는 정수 입력 검증 (POP 최대 개수용 - 0 미포함)
	const handleUnsignedIntegerKeyDown = useCallback((e: any) => {
		const allowed = ['Backspace', 'Delete', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
		if (allowed.includes(e.key)) return;
		if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(String(e.key).toLowerCase())) return;
		const isDigit = /^\d$/.test(e.key);
		if (!isDigit) {
			e.preventDefault();
			return;
		}
		// 0만 입력되는 경우 방지 (빈 값에 0 입력 또는 전체 선택 후 0 입력)
		const input = e.target as HTMLInputElement | undefined;
		const value = input?.value ?? '';
		const start = input?.selectionStart ?? 0;
		const end = input?.selectionEnd ?? value.length;
		const newValue = `${value.slice(0, start)}${e.key}${value.slice(end)}`;
		// 0으로 시작하거나 0만 있는 경우 차단
		if (/^0/.test(newValue)) {
			e.preventDefault();
		}
	}, []);

	// 부호 없는 정수 붙여넣기 검증 (POP 최대 개수용 - 0 미포함)
	const handleUnsignedIntegerPaste = useCallback((e: any) => {
		const input = e.target as HTMLInputElement | undefined;
		const value = input?.value ?? '';
		const start = input?.selectionStart ?? value.length;
		const end = input?.selectionEnd ?? value.length;
		const pasted = e.clipboardData?.getData('text') ?? '';
		const newValue = `${value.slice(0, start)}${pasted}${value.slice(end)}`;
		// 숫자만 허용하고, 0으로 시작하는 값 차단
		const regex = /^[1-9]\d*$/;
		if (!regex.test(newValue)) {
			e.preventDefault();
		}
	}, []);

	// 모달 제목 설정 (기본값: '배차옵션 설정')
	const optionTitle = useMemo(() => title ?? '배차옵션 설정', [title]);

	// CBM 비율 유효성 검사 함수 (10~200 사이 정수)
	const isValidCbmRatio = (value: number | undefined): boolean => {
		if (value === undefined || value === null) return false;
		return Number.isInteger(value) && value >= 10 && value <= 200;
	};

	// 저장 버튼 비활성화 조건
	const isSaveDisabled = useMemo(() => {
		// POP 최대 개수가 활성화되었지만 값이 없거나 0인 경우
		if (
			options.maxPopOn &&
			(options.maxPopCount === undefined || options.maxPopCount === null || options.maxPopCount === 0)
		) {
			return true;
		}
		// CBM 조정이 활성화된 경우 모든 톤급별 비율이 유효해야 함
		if (options.cbmAdjustOn) {
			const ratios = [
				options.cbmRatio1,
				options.cbmRatio1_4,
				options.cbmRatio2_5,
				options.cbmRatio3_5,
				options.cbmRatio5,
				options.cbmRatio11,
			];
			if (ratios.some(ratio => !isValidCbmRatio(ratio))) {
				return true;
			}
		}
		return false;
	}, [
		options.maxPopOn,
		options.maxPopCount,
		options.cbmAdjustOn,
		options.cbmRatio1,
		options.cbmRatio1_4,
		options.cbmRatio2_5,
		options.cbmRatio3_5,
		options.cbmRatio5,
		options.cbmRatio11,
	]);

	// 실제 저장 처리 함수
	const doSave = useCallback(async () => {
		try {
			// API 요청용 페이로드 구성
			const payload: DispatchOptionsDTO = {
				useMaxWeight: !!options.maxWeight, // 최대중량 사용 여부
				useSkills: !!options.specialCondition, // 특수조건 사용 여부
				useMaxLocation: !!options.maxStopsOn, // 최대 착지수 사용 여부
				useRounds: !!options.multiTurnOn, // 다회전 여부 사용 여부
				useMaxCbm: !!options.cbmAdjustOn, // CBM 조정 사용 여부
				offsetCbm: Number(options.cbmAdjustValue ?? 0), // CBM 조정값 (deprecated)
				// 톤급별 CBM 허용 비율 (%)
				cbmRatio1: Number(options.cbmRatio1 ?? 100),
				cbmRatio1_4: Number(options.cbmRatio1_4 ?? 100),
				cbmRatio2_5: Number(options.cbmRatio2_5 ?? 100),
				cbmRatio3_5: Number(options.cbmRatio3_5 ?? 100),
				cbmRatio5: Number(options.cbmRatio5 ?? 100),
				cbmRatio11: Number(options.cbmRatio11 ?? 100),
				useMaxPop: !!options.maxPopOn, // POP 최대 개수 사용 여부
				popCount: Number(options.maxPopCount ?? 0), // POP 최대 개수
				planOptionType: 1, // 계획 옵션 타입 (고정값)
				dccode: dccode, // 물류센터 코드
			};

			// 서버에 배차옵션 저장
			const res = await setDispatchOptions(payload);
			if (res.statusCode === 0) {
				// 옵션이 변경된 경우 배차 재계산 콜백 호출
				if (isDirty && onSave) {
					onSave?.();
				} else {
					showAlert('알림', '배차옵션이 저장되었습니다.');
				}
				onClose();
			} else {
				showAlert('알림', '배차옵션 저장에 실패했습니다.');
			}
		} catch (e) {
			showAlert('오류', '배차옵션 저장에 실패했습니다.');
		}
	}, [options, onClose, onSave, isDirty, dccode]);

	// 배차옵션 저장 처리 (변경사항이 있으면 확인 다이얼로그 표시)
	const handleSave = useCallback(() => {
		if (isDirty && onSave) {
			modal.confirm({
				title: '자동배차 재실행',
				content: '배차옵션을 변경하면 현재 배차 결과가 초기화되고 자동배차가 다시 실행됩니다. 계속하시겠습니까?',
				okText: '확인',
				cancelText: '취소',
				onOk: () => doSave(),
			});
		} else {
			doSave();
		}
	}, [isDirty, onSave, doSave, modal]);

	// 모달 열림 시 기존 배차옵션 조회
	useEffect(() => {
		if (!open || !dccode) return;
		(async () => {
			try {
				const res = await getDispatchOptions({ planOptionType: 1, dccode });
				const data = (res?.data ?? res) as Partial<DispatchOptionsDTO>;

				// 서버 응답을 로컬 옵션 형태로 변환
				const loaded: LocalOptions = {
					maxWeight: !!data.useMaxWeight, // 최대중량 사용 여부
					specialCondition: !!data.useSkills, // 특수조건 사용 여부
					maxStopsOn: !!data.useMaxLocation, // 최대 착지수 사용 여부
					multiTurnOn: !!data.useRounds, // 다회전 여부 사용 여부
					cbmAdjustOn: !!data.useMaxCbm, // CBM 조정 사용 여부
					cbmAdjustValue:
						data.offsetCbm === 0 || data.offsetCbm === undefined || data.offsetCbm === null
							? undefined
							: Number(data.offsetCbm),
					// 톤급별 CBM 허용 비율 (%) - 기본값 100
					cbmRatio1: data.cbmRatio1 ?? 100,
					cbmRatio1_4: data.cbmRatio1_4 ?? 100,
					cbmRatio2_5: data.cbmRatio2_5 ?? 100,
					cbmRatio3_5: data.cbmRatio3_5 ?? 100,
					cbmRatio5: data.cbmRatio5 ?? 100,
					cbmRatio11: data.cbmRatio11 ?? 100,
					maxPopOn: !!data.useMaxPop, // POP 최대 개수 사용 여부
					maxPopCount:
						data.popCount === 0 || data.popCount === undefined || data.popCount === null
							? undefined
							: Number(data.popCount),
				};

				// 현재 옵션과 초기 옵션 모두 설정
				setOptions(loaded);
				setInitialOptions(loaded);
			} catch (e) {
				showAlert('오류', '배차옵션 조회에 실패했습니다.');
			}
		})();
	}, [open, dccode]);

	// 모달 닫기 시도 시 변경사항 확인
	const handleAttemptClose = useCallback(() => {
		if (!isDirty) {
			onClose();
			return;
		}
		modal.confirm({
			content: '변경사항이 있습니다. 계속 진행하시겠습니까?',
			okText: '확인',
			cancelText: '닫기',
			onOk: () => onClose(),
		});
	}, [isDirty, onClose, modal]);

	if (!open) return null;

	return (
		<>
			{/* <Modal closeModal={handleAttemptClose} width={'480px'}> */}
			<Typography.Text strong style={{ fontSize: 16 }}>
				{optionTitle}
			</Typography.Text>
			<Typography.Text strong style={{ display: 'block', marginTop: 12, marginBottom: 6 }}>
				기준 옵션
			</Typography.Text>
			<Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
				ON/OFF에 따라 해당 조건이 배차 시 반영되거나 제외됩니다.
			</Typography.Paragraph>
			<Divider style={{ margin: '8px 0' }} />
			<div style={{ width: '100%' }}>
				{/* 최대중량 */}
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
					<span style={{ display: 'inline-flex', alignItems: 'center', width: 140 }}>
						<Typography.Text>최대중량</Typography.Text>
						<Tooltip
							title={
								<div>
									<div>ON: 차량 ‘최대물량’ 기준으로 배차</div>
									<div>OFF: 차량 ‘적정물량’ 기준으로 배차</div>
								</div>
							}
						>
							<InfoCircleOutlined style={{ color: '#9aa4b0', marginLeft: 6 }} />
						</Tooltip>
					</span>
					<Switch
						checkedChildren="ON"
						unCheckedChildren="OFF"
						checked={options.maxWeight}
						onChange={v => setOptions(prev => ({ ...prev, maxWeight: v }))}
					/>
				</div>
				{/* 특수조건 */}
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
					<span style={{ display: 'inline-flex', alignItems: 'center', width: 140 }}>
						<Typography.Text>특수조건</Typography.Text>
						<Tooltip
							title={
								<div>
									<div>ON: 특수조건 관리처는 고정차량만 배차</div>
									<div>OFF: 다른 차량 배차 허용</div>
								</div>
							}
						>
							<InfoCircleOutlined style={{ color: '#9aa4b0', marginLeft: 6 }} />
						</Tooltip>
					</span>
					<Switch
						checkedChildren="ON"
						unCheckedChildren="OFF"
						checked={options.specialCondition}
						onChange={v => setOptions(prev => ({ ...prev, specialCondition: v }))}
					/>
				</div>
				{/* 최대 착지수 */}
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
					<span style={{ display: 'inline-flex', alignItems: 'center', width: 140 }}>
						<Typography.Text>최대 착지수</Typography.Text>
						<Tooltip
							title={
								<div>
									<div>ON : 설정한 최대 착지수 이하로 배차</div>
									<div>OFF: 착지수 제한 없음</div>
								</div>
							}
						>
							<InfoCircleOutlined style={{ color: '#9aa4b0', marginLeft: 6 }} />
						</Tooltip>
					</span>
					<Switch
						checkedChildren="ON"
						unCheckedChildren="OFF"
						checked={options.maxStopsOn}
						onChange={v => setOptions(prev => ({ ...prev, maxStopsOn: v }))}
					/>
				</div>
				{/* 다회전 여부 */}
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
					<span style={{ display: 'inline-flex', alignItems: 'center', width: 140 }}>
						<Typography.Text>다회전 여부</Typography.Text>
						<Tooltip
							title={
								<div>
									<div>ON: 다회전 고려하여 배차</div>
									<div>OFF: 단회전 기준으로 배차</div>
								</div>
							}
						>
							<InfoCircleOutlined style={{ color: '#9aa4b0', marginLeft: 6 }} />
						</Tooltip>
					</span>
					<Switch
						checkedChildren="ON"
						unCheckedChildren="OFF"
						checked={options.multiTurnOn}
						onChange={v => setOptions(prev => ({ ...prev, multiTurnOn: v }))}
					/>
				</div>
				{/* 최대 적재량 조정(CBM) */}
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
					<span style={{ display: 'inline-flex', alignItems: 'center', width: 140 }}>
						<Typography.Text>최대 적재량 조정(CBM)</Typography.Text>
						<Tooltip
							title={
								<div>
									<div>ON: 톤급별 허용비율로 최대적재량 적용</div>
									<div>OFF: CBM 제한 없음</div>
									<div style={{ marginTop: 4, fontSize: 11, color: '#aaa' }}>
										최대 CBM = 기준 CBM × 허용비율(%) / 100
									</div>
									<div style={{ marginTop: 4, fontSize: 11, color: '#aaa' }}>10~200% 범위, 정수만 입력 가능</div>
								</div>
							}
						>
							<InfoCircleOutlined style={{ color: '#9aa4b0', marginLeft: 6 }} />
						</Tooltip>
					</span>
					<Switch
						checkedChildren="ON"
						unCheckedChildren="OFF"
						checked={options.cbmAdjustOn}
						onChange={v =>
							setOptions(prev => ({
								...prev,
								cbmAdjustOn: v,
							}))
						}
					/>
				</div>
				{options.cbmAdjustOn && (
					<div style={{ paddingTop: 4, paddingBottom: 6 }}>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
							<div>
								<Typography.Text style={{ fontSize: 12, marginBottom: 2, display: 'block' }}>1톤</Typography.Text>
								<InputNumber
									style={{ width: '100%' }}
									value={options.cbmRatio1}
									min={10}
									max={200}
									step={1}
									precision={0}
									placeholder="100"
									addonAfter="%"
									onChange={v =>
										setOptions(prev => ({
											...prev,
											cbmRatio1: v === null || v === undefined ? undefined : Math.round(Number(v)),
										}))
									}
								/>
							</div>
							<div>
								<Typography.Text style={{ fontSize: 12, marginBottom: 2, display: 'block' }}>1.4톤</Typography.Text>
								<InputNumber
									style={{ width: '100%' }}
									value={options.cbmRatio1_4}
									min={10}
									max={200}
									step={1}
									precision={0}
									placeholder="100"
									addonAfter="%"
									onChange={v =>
										setOptions(prev => ({
											...prev,
											cbmRatio1_4: v === null || v === undefined ? undefined : Math.round(Number(v)),
										}))
									}
								/>
							</div>
							<div>
								<Typography.Text style={{ fontSize: 12, marginBottom: 2, display: 'block' }}>2.5톤</Typography.Text>
								<InputNumber
									style={{ width: '100%' }}
									value={options.cbmRatio2_5}
									min={10}
									max={200}
									step={1}
									precision={0}
									placeholder="100"
									addonAfter="%"
									onChange={v =>
										setOptions(prev => ({
											...prev,
											cbmRatio2_5: v === null || v === undefined ? undefined : Math.round(Number(v)),
										}))
									}
								/>
							</div>
							<div>
								<Typography.Text style={{ fontSize: 12, marginBottom: 2, display: 'block' }}>3.5톤</Typography.Text>
								<InputNumber
									style={{ width: '100%' }}
									value={options.cbmRatio3_5}
									min={10}
									max={200}
									step={1}
									precision={0}
									placeholder="100"
									addonAfter="%"
									onChange={v =>
										setOptions(prev => ({
											...prev,
											cbmRatio3_5: v === null || v === undefined ? undefined : Math.round(Number(v)),
										}))
									}
								/>
							</div>
							<div>
								<Typography.Text style={{ fontSize: 12, marginBottom: 2, display: 'block' }}>5톤</Typography.Text>
								<InputNumber
									style={{ width: '100%' }}
									value={options.cbmRatio5}
									min={10}
									max={200}
									step={1}
									precision={0}
									placeholder="100"
									addonAfter="%"
									onChange={v =>
										setOptions(prev => ({
											...prev,
											cbmRatio5: v === null || v === undefined ? undefined : Math.round(Number(v)),
										}))
									}
								/>
							</div>
							<div>
								<Typography.Text style={{ fontSize: 12, marginBottom: 2, display: 'block' }}>11톤</Typography.Text>
								<InputNumber
									style={{ width: '100%' }}
									value={options.cbmRatio11}
									min={10}
									max={200}
									step={1}
									precision={0}
									placeholder="100"
									addonAfter="%"
									onChange={v =>
										setOptions(prev => ({
											...prev,
											cbmRatio11: v === null || v === undefined ? undefined : Math.round(Number(v)),
										}))
									}
								/>
							</div>
						</div>
					</div>
				)}
				{/* POP 최대 개수 */}
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
					<span style={{ display: 'inline-flex', alignItems: 'center', width: 140 }}>
						<Typography.Text>
							POP 최대 개수
							{options.maxPopOn && <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>}
						</Typography.Text>
						<Tooltip
							title={
								<div>
									<div>ON: 입력한 최대 POP개수 이내로 배차</div>
									<div>OFF: POP개수 제한 없음</div>
								</div>
							}
						>
							<InfoCircleOutlined style={{ color: '#9aa4b0', marginLeft: 6 }} />
						</Tooltip>
					</span>
					<Switch
						checkedChildren="ON"
						unCheckedChildren="OFF"
						checked={options.maxPopOn}
						onChange={v =>
							setOptions(prev => ({ ...prev, maxPopOn: v, maxPopCount: v ? prev.maxPopCount : undefined }))
						}
					/>
				</div>
				{options.maxPopOn && (
					<div style={{ paddingLeft: 140, paddingTop: 4 }}>
						<InputNumber
							style={{ width: '100%' }}
							value={options.maxPopCount}
							min={1}
							step={1}
							precision={0}
							placeholder="POP 최대 개수를 입력하세요."
							onChange={v =>
								setOptions(prev => ({
									...prev,
									maxPopCount: v === null || v === undefined ? undefined : Math.max(1, Number(v)),
								}))
							}
							onKeyDown={handleUnsignedIntegerKeyDown}
							onPaste={handleUnsignedIntegerPaste}
						/>
					</div>
				)}
			</div>
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 16 }}>
				<Button onClick={handleAttemptClose}>닫기</Button>
				<Button type="primary" onClick={handleSave} disabled={isSaveDisabled}>
					저장
				</Button>
			</div>
			{/* </Modal> */}
			{contextHolder}
		</>
	);
};

export default TmDispatchOptionsModal;
