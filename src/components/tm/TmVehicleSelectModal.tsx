/*
############################################################################
# Component: TmVehicleSelectModal (차량 변경 모달)
# 목적: TmPlan 화면에서 차량 추가/변경 시 사용하는 간단한 모달
#
# [주요 기능]
# - 기존 차량 정보 표시
# - Select로 새 차량 선택
# - 저장/닫기
#
# [Props]
# - open: 모달 열림/닫힘 상태
# - onClose: 모달 닫기 함수
# - onSelect: 차량 선택 시 콜백
# - dccode: 물류센터 코드
# - currentVehicle: 현재 차량 정보 (변경 시)
############################################################################
*/

import { Button } from '@/components/common/custom/form';
import Modal from '@/components/common/Modal';
import { DownOutlined } from '@ant-design/icons';
import { Divider, Select, Space, Typography } from 'antd';
import { useState } from 'react';

export type TmVehicleSelectModalProps = {
	open: boolean;
	onClose: () => void;
	onSelect: (vehicle: any, id: string) => void;
	currentVehicle?: { carno: string; vehicleType: string; id: string }; // 기존 차량 정보 (변경 시)
	vehicleList: any[]; // 부모에서 전달받은 차량 목록
	assignedVehicles?: string[]; // 이미 배정된 차량 번호 리스트 (carno)
};

const TmVehicleSelectModal = ({ open, onClose, onSelect, currentVehicle, vehicleList }: TmVehicleSelectModalProps) => {
	const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
	if (!open) return null;
	const handleSave = () => {
		if (!selectedVehicleId) {
			alert('변경할 차량을 선택해주세요.');
			return;
		}

		const selected = vehicleList.find(v => v.carno === selectedVehicleId);
		if (selected) {
			onSelect(selected, currentVehicle?.id);
			onClose();
		}
	};
	const vehicleOptions = vehicleList.map(v => ({
		label: `[${v.contractTypeData1 || ''}] ${v.carno}`,
		value: v.carno,
	}));

	return (
		<Modal closeModal={onClose} width={'500px'} height="320px" style={{ zIndex: 1100 }}>
			<Typography.Text strong style={{ fontSize: 16 }}>
				차량 변경
			</Typography.Text>
			<Divider style={{ margin: '16px 0' }} />
			{currentVehicle && (
				<div style={{ marginBottom: 16 }}>
					<Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
						기존차량
					</Typography.Text>
					<div
						style={{
							padding: '4px 8px',
							border: '1px solid #d9d9d9',
							borderRadius: 4,
							backgroundColor: '#fafafa',
						}}
					>
						<Space>
							<Typography.Text strong>{currentVehicle?.vehicleType || ''}</Typography.Text>
							<Typography.Text>{currentVehicle?.carno || ''}</Typography.Text>
						</Space>
					</div>
				</div>
			)}

			<div style={{ textAlign: 'center', margin: '8px 0' }}>
				<DownOutlined style={{ fontSize: 16, color: '#000' }} />
			</div>

			<div style={{ marginBottom: 24 }}>
				<Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
					변경차량
				</Typography.Text>
				<Select
					style={{ width: '100%' }}
					placeholder="차량을 선택하세요"
					options={vehicleOptions}
					value={selectedVehicleId}
					onChange={setSelectedVehicleId}
					showSearch
					optionFilterProp="label"
				/>
			</div>

			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
				<Button onClick={onClose}>닫기</Button>
				<Button type="primary" onClick={handleSave}>
					저장
				</Button>
			</div>
		</Modal>
	);
};

export default TmVehicleSelectModal;
