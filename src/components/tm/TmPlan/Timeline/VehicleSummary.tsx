import { TmVehiclesDto } from '@/api/tm/apiTmDispatch';
import { getVehicleAlias } from '@/components/tm/TmPlan/Timeline/getVehicleAlias';
import { colorById } from '@/components/tm/TmPlan/Timeline/hooks/useTimelineData';
import { Button, Select, Space, Typography } from 'antd';
import { useMemo } from 'react';
import styled from 'styled-components';

export const VehicleTypeMap = {
	지입차: '지입',
	월대용차: '월대',
	고정용차: '고정',
	임시용차: '임시',
	실비용차: '실비',
	고객자차: '자차',
	실비차차: '실비',
	지입: '지입',
	월대: '월대',
	고정: '고정',
	임시: '임시',
	실비: '실비',
	자차: '자차',
};

interface VehicleSummaryProps {
	vehicle: TmVehiclesDto;
	isSelected: boolean;
	onDirectVehicleSelect?: (vehicleId: string, selectedCarno: number) => void;
	onChangeVehicle?: (carno: string, vehicleType: string, id: string) => void;
	onDeleteVehicle?: (vehicleId: string) => void;
	onDriverClick?: (vehicleId: string | number) => void;
	availableCarNumbers: any[];
	changedRows: string[];
}

const VehicleSummary = ({
	vehicle,
	isSelected,
	onDirectVehicleSelect,
	onChangeVehicle,
	onDeleteVehicle,
	onDriverClick,
	availableCarNumbers,
	changedRows,
}: VehicleSummaryProps) => {
	const options = useMemo(() => {
		return availableCarNumbers.map((car, index) => ({
			label: `[${car.contractTypeData1 || ''}] ${car.carno}`,
			value: index,
		}));
	}, [availableCarNumbers]);

	const isUnassigned = vehicle.carno.includes('unassigned');
	const isChanged = changedRows.includes(vehicle.uniqueId);
	const duration = isChanged ? '---' : vehicle.totalTimeDisplay;
	const distance = isChanged ? '' : vehicle.totalDistanceKm?.toFixed(3) + 'km';
	const loadedWeight = vehicle.steps.reduce((acc, step) => {
		if (step.tmDeliveryType === '2') return acc; // 반품은 중량 합산에서 제외
		return acc + Number(step.weight);
	}, 0);
	const loadedCbm = vehicle.steps.reduce((acc, step) => {
		if (step.tmDeliveryType === '2') return acc; // 반품은 체적 합산에서 제외
		return acc + Number(step.cube);
	}, 0);

	let vehicleType = '';
	const rawVehicleType = vehicle?.vehicleType;
	if (rawVehicleType && rawVehicleType in VehicleTypeMap)
		vehicleType = VehicleTypeMap[rawVehicleType as keyof typeof VehicleTypeMap];
	else vehicleType = rawVehicleType || '';

	return (
		<Container
			style={{ backgroundColor: isSelected ? 'rgb(243, 243, 243)' : 'white', paddingRight: 4 }}
			onClick={() => {
				onDriverClick?.(vehicle.uniqueId);
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				{vehicle?.carno.includes('unassigned') ? (
					<>
						<Select
							style={{ flex: 1 }}
							placeholder="차량을 선택하세요"
							options={options}
							onChange={selectedCarno => onDirectVehicleSelect(String(vehicle.uniqueId), selectedCarno)}
							showSearch
							optionFilterProp="label"
						/>
						<Button
							type="link"
							onClick={e => {
								e.stopPropagation();
								onDeleteVehicle?.(vehicle.uniqueId);
							}}
						>
							삭제
						</Button>
					</>
				) : (
					<>
						<Typography.Text>{vehicleType}</Typography.Text>
						<Typography.Text strong>
							&nbsp; {getVehicleAlias(vehicle)} ({vehicle.roundSeq}회)&nbsp;&nbsp;
						</Typography.Text>
						<div
							style={{
								backgroundColor: colorById(vehicle?.uniqueId),
								width: '12px',
								height: '12px',
								borderRadius: '50%',
							}}
						></div>
						<Button
							type="link"
							style={{ marginLeft: 'auto', minWidth: 28, maxWidth: 28 }}
							onClick={e => {
								e.stopPropagation();
								onChangeVehicle(vehicle.carno ?? '', vehicle.vehicleType ?? '', vehicle.uniqueId);
							}}
						>
							변경
						</Button>
						<Button
							type="link"
							style={{ minWidth: 28, maxWidth: 28 }}
							onClick={e => {
								e.stopPropagation();
								onDeleteVehicle?.(vehicle.uniqueId);
							}}
						>
							삭제
						</Button>
					</>
				)}
			</div>
			<div style={{ fontSize: '12px' }}>
				<Space>
					<Typography.Text type="secondary">중량</Typography.Text>
					<Typography.Text>
						{isUnassigned ? '-' : Number(loadedWeight).toFixed(3) || '0'}kg
						{vehicle.maxWeight > 0 ? `(${Math.round((loadedWeight / vehicle.maxWeight) * 100)}%)` : ''}
					</Typography.Text>
					<Typography.Text type="secondary">체적</Typography.Text>
					<Typography.Text>
						{isUnassigned ? '-' : (loadedCbm || 0).toFixed(2)}m³
						{vehicle.cbmUsagePercent != null
							? `(${Math.round(vehicle.cbmUsagePercent)}%)`
							: vehicle.maxCbm > 0
							? `(${Math.round((loadedCbm / vehicle.maxCbm) * 100)}%)`
							: ''}
					</Typography.Text>
				</Space>
			</div>
			<div style={{ fontSize: '12px' }}>
				<Space>
					<Typography.Text type="secondary">착지</Typography.Text>
					<Typography.Text>{vehicle?.steps.filter(x => x.type === 'job').length + '건'}</Typography.Text>
					<Typography.Text>{duration}</Typography.Text>
					<Typography.Text>{distance}</Typography.Text>
				</Space>
			</div>
		</Container>
	);
};

const Container = styled.div`
	width: 300px;
	padding: 8px;
	position: sticky;
	left: 0;
	z-index: 3;
	height: 93px;
	background-color: white;
	border-right: 1px solid #d9d9d9;
	cursor: pointer;
	&:hover {
		background-color: rgb(243, 243, 243);
	}
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

export default VehicleSummary;
