import { Button, InputNumber, Select, Space, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import {
	MsOutGroupGetMasterListRes,
	MsOutGroupSettingReqDto,
	OutGroupOption,
	OutGroupSetting,
	apiMsOutGroupGetMasterList,
	apiMsOutGroupUpdateMasterList,
} from '@/api/ms/apiMsOutGroupSetting';
import {
	OutGroupOptionDto,
	TmReturnOrderDto,
	TmUnassignedOrderDto,
	TmVehiclesDto,
	setDispatchTemporaryCar,
} from '@/api/tm/apiTmDispatch';
import Modal from '@/components/common/Modal';
import * as MessageUtil from '@/util/MessageUtil';

type RowModel = {
	id: string;
	group: string; // outGroupCd
	maxWeight?: number;
	maxCbm?: number;
	maxStops?: number;
	carCount?: number;
	isNew?: boolean;
	outGroupNm?: string;
};

// 실비차 배차 결과 타입
export type TemporaryCarDispatchResult = {
	vehicles: TmVehiclesDto[]; // 배차된 실비차 목록
	unassignedOrders: TmUnassignedOrderDto[]; // 남은 미배차 주문
	returnOrders: TmReturnOrderDto[]; // 반품 주문
};

type Props = {
	open: boolean;
	dccode: string;
	deliveryDate: string; // 배송일자 (YYYYMMDD 형식)
	onClose: () => void;
	onSaved?: () => void;
	unassignedOrders?: TmUnassignedOrderDto[]; // 미배차 주문 목록
	onDispatchSuccess?: (result: TemporaryCarDispatchResult) => void; // 배차 성공 시 결과 전달
};

const toNumber = (v?: string): number | undefined => {
	if (v === undefined || v === null) return undefined;
	const n = Number(v);
	return Number.isFinite(n) ? n : undefined;
};

const toStringOrEmpty = (v?: number): string | undefined => {
	if (v === undefined || v === null) return undefined;
	return String(v);
};

const TmOutGroupSettingModal = ({
	open,
	dccode,
	deliveryDate,
	onClose,
	onSaved,
	unassignedOrders,
	onDispatchSuccess,
}: Props) => {
	const [groupOptions, setGroupOptions] = useState<{ label: string; value: string }[]>([]);
	const [rows, setRows] = useState<RowModel[]>([]);

	const canSubmit = useMemo(() => rows.every(r => !!r.group), [rows]);

	const handleFetch = async () => {
		if (!dccode) return;
		try {
			const res = (await apiMsOutGroupGetMasterList({ dccode })) as MsOutGroupGetMasterListRes;
			const outGroupList = (res?.data?.outGroupList ?? []) as OutGroupOption[];
			const outGroupSettingList = (res?.data?.outGroupSettingList ?? []) as OutGroupSetting[];

			setGroupOptions(outGroupList.map(g => ({ label: g.value, value: g.key })));
			setRows(
				outGroupSettingList.map(item => ({
					id: `${item.outGroupCd}`,
					group: item.outGroupCd,
					maxWeight: toNumber(item.maxWeight),
					maxCbm: toNumber(item.maxCbm),
					maxStops: toNumber(item.maxLoadQty),
					carCount: toNumber(item.carCount) ?? 0,
					isNew: false,
					outGroupNm: item.outGroupNm,
				})),
			);
		} catch (e) {
			MessageUtil.showMessage({ modalType: 'error', content: '실비차 목록 조회 중 오류가 발생했습니다.' });
		}
	};

	useEffect(() => {
		if (open) {
			handleFetch();
		}
	}, [open, dccode]);

	const handleAdd = () => {
		setRows(prev => [
			...prev,
			{
				id: `ac-${Date.now()}`,
				group: groupOptions?.[0]?.value ?? '',
				maxWeight: 900,
				maxCbm: 9,
				maxStops: 10,
				carCount: 0,
				isNew: true,
				outGroupNm: undefined,
			},
		]);
	};

	const handleRemove = (id: string) => setRows(prev => prev.filter(r => r.id !== id));

	const handleSaveGroups = async () => {
		if (!dccode) {
			MessageUtil.showMessage({ modalType: 'warning', content: '센터코드가 없습니다.' });
			return;
		}
		const body: MsOutGroupSettingReqDto[] = rows
			.filter(x => x.isNew === false)
			.map(r => ({
				dccode,
				outGroupCd: r.group,
				maxWeight: toStringOrEmpty(r.maxWeight),
				maxCbm: toStringOrEmpty(r.maxCbm),
				maxLoadQty: toStringOrEmpty(r.maxStops),
				carCount: toStringOrEmpty(r.carCount),
			}));
		const res = await apiMsOutGroupUpdateMasterList(body);
		if (res?.statusCode === 0) handleDispatch();
		else
			MessageUtil.showMessage({ modalType: 'error', content: '배차 중 오류가 발생했습니다. (실비차 옵션 저장 실패)' });
	};

	// 배차 시 유효성 검증 (0보다 큰 양수 필요)
	const isValidForDispatch = (value?: number): boolean => {
		if (value === undefined || value === null) return false;
		if (value <= 0) return false;
		return true;
	};

	// 실비차 배차 실행
	const handleDispatch = async () => {
		// 차량수가 0보다 큰 조건만 필터링
		const validRows = rows.filter(r => r.carCount && r.carCount > 0);
		if (validRows.length === 0) {
			MessageUtil.showMessage({ modalType: 'warning', content: '배차할 실비차 조건을 입력해주세요.' });
			return;
		}

		// 실비차 조건 검증: 차량수가 입력된 경우 최대중량/CBM/최대착지수는 필수이며 0보다 큰 값이어야 함
		const hasInvalidCondition = validRows.some(
			r => !isValidForDispatch(r.maxWeight) || !isValidForDispatch(r.maxCbm) || !isValidForDispatch(r.maxStops),
		);
		if (hasInvalidCondition) {
			MessageUtil.showAlert('알림', '실비차 조건을 확인해주세요.');
			return;
		}

		if (!unassignedOrders || unassignedOrders.length === 0) {
			MessageUtil.showMessage({ modalType: 'warning', content: '미배차 주문이 없습니다.' });
			return;
		}

		// 실비차 옵션 목록 생성
		const outGroupOptionList: OutGroupOptionDto[] = validRows.map(r => ({
			carCount: String(r.carCount || 0),
			dccode,
			maxCbm: String(r.maxCbm || ''),
			maxLoadQty: String(r.maxStops || ''),
			maxWeight: String(r.maxWeight || ''),
			outGroupCd: r.group,
		}));

		const res = await setDispatchTemporaryCar({
			dccode,
			deliveryDate,
			outGroupOptionList,
			unAssignedOrderList: unassignedOrders,
		});

		const beforeUnassignedOrders = unassignedOrders.length;
		if (res?.statusCode === 0) {
			if (res.data.vehicles.length === 0)
				MessageUtil.showMessage({ modalType: 'error', content: '배차된 실비차가 없습니다. 차량조건을 확인해주세요.' });
			else
				MessageUtil.showMessage({
					modalType: 'success',
					content: `미배차 ${beforeUnassignedOrders}건 중 ${
						beforeUnassignedOrders - res.data.unassignedOrders.length
					}건 배차되었습니다.`,
				});
			if (onDispatchSuccess && res.data) {
				onDispatchSuccess({
					vehicles: res.data.vehicles || [],
					unassignedOrders: res.data.unassignedOrders || [],
					returnOrders: [],
				});
			}

			if (onSaved) onSaved();
			onClose();
		} else {
			MessageUtil.showMessage({ modalType: 'error', content: res?.statusMessage || '실비차 배차에 실패했습니다.' });
		}
	};

	if (!open) return null;

	return (
		<Modal closeModal={onClose} width={'min(1160px, calc(100vw - 120px))'} height={'auto'}>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Typography.Text strong style={{ fontSize: 16 }}>
					실비차 조건 설정
				</Typography.Text>
				<Button size="small" onClick={handleAdd}>
					+ 추가
				</Button>
			</div>
			<div style={{ marginTop: 10 }} />
			<Space direction="vertical" style={{ width: '100%' }}>
				{rows.map(row => (
					<div
						key={row.id}
						style={{
							display: 'grid',
							gridTemplateColumns: '120px 1fr 1fr 1fr 1fr 60px',
							alignItems: 'center',
							gap: 8,
						}}
					>
						<Select
							value={row.group}
							options={groupOptions}
							style={{ width: '100%', minWidth: 0 }}
							onChange={v => row.isNew && setRows(prev => prev.map(r => (r.id === row.id ? { ...r, group: v } : r)))}
							disabled={!row.isNew}
						/>
						<InputNumber
							addonBefore="최대중량"
							value={row.maxWeight}
							onChange={v =>
								setRows(prev =>
									prev.map(r => (r.id === row.id ? { ...r, maxWeight: v === null ? undefined : Number(v) } : r)),
								)
							}
							style={{ width: '100%', minWidth: 0 }}
						/>
						<InputNumber
							addonBefore="최대CBM"
							value={row.maxCbm}
							onChange={v =>
								setRows(prev =>
									prev.map(r => (r.id === row.id ? { ...r, maxCbm: v === null ? undefined : Number(v) } : r)),
								)
							}
							style={{ width: '100%', minWidth: 0 }}
						/>
						<InputNumber
							addonBefore="최대착지수"
							value={row.maxStops}
							onChange={v =>
								setRows(prev =>
									prev.map(r => (r.id === row.id ? { ...r, maxStops: v === null ? undefined : Number(v) } : r)),
								)
							}
							style={{ width: '100%', minWidth: 0 }}
						/>
						<InputNumber
							addonBefore="차량수"
							value={row.carCount}
							precision={0}
							onChange={v =>
								setRows(prev =>
									prev.map(r =>
										r.id === row.id
											? {
													...r,
													carCount: v === null || v === undefined ? undefined : Math.max(0, Math.floor(Number(v))),
											  }
											: r,
									),
								)
							}
							style={{ width: '100%', minWidth: 0 }}
						/>
						<div>
							{row.isNew && (
								<Button danger onClick={() => handleRemove(row.id)}>
									삭제
								</Button>
							)}
						</div>
					</div>
				))}
			</Space>
			<div style={{ marginTop: 16, textAlign: 'right' }}>
				<Space>
					<Button onClick={onClose}>닫기</Button>
					<Button type="primary" onClick={handleSaveGroups} disabled={!canSubmit}>
						배차
					</Button>
				</Space>
			</div>
		</Modal>
	);
};

export default TmOutGroupSettingModal;
