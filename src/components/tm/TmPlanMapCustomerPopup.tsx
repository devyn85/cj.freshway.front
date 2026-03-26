import { TmEngineStepDto } from '@/api/tm/apiTmDispatch';
import {
	IconCall,
	IconClaim,
	IconFTFInspection,
	IconKey,
	IconOTD,
	IconReturn,
	IconSpecialCondition,
} from '@/components/tm/TmPlan/TmInfoIcon';
import { parseKeyType } from '@/util/keyType';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Button, Space, Tag, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';

// step에 추가된 차량 정보 타입
type StepWithVehicleInfo = TmEngineStepDto & {
	_internalCarno?: string;
	_internalVehicleType?: string;
	_internalRoundSeq?: number;
};

export interface TmPlanMapCustomerPopupProps {
	selectedOrder: StepWithVehicleInfo & { groupedSteps?: StepWithVehicleInfo[] };
	onClickDetail?: (order?: TmEngineStepDto) => void;
	onClickHistory?: (orderId: string) => void;
	onClickOrder?: (orderId: string) => void;
}

const TmPlanMapCustomerPopup = ({
	selectedOrder,
	onClickDetail,
	onClickHistory,
	onClickOrder,
}: TmPlanMapCustomerPopupProps) => {
	const renderBadgeIcon = (badge: string) => {
		switch (badge) {
			case 'ftf':
				return <IconFTFInspection />;
			case 'special':
				return <IconSpecialCondition />;
			case 'return':
				return <IconReturn />;
			case 'claim':
				return <IconClaim />;
			case 'otd':
				return <IconOTD />;
			case 'call':
				return <IconCall />;
			case 'key':
				return <IconKey />;
			default:
				return null;
		}
	};

	const renderBadges = (badges?: string[]) => {
		if (!badges || badges.length === 0) return null;
		return (
			<Space size={6}>
				{badges.map((badge, idx) => (
					<span key={`${badge}-${idx}`}>{renderBadgeIcon(badge)}</span>
				))}
			</Space>
		);
	};

	const getBadges = (stepData: any) => {
		const b = [];
		if (stepData.faceInspect === 'Y') b.push('ftf');
		if (stepData.specialConditionYn === 'Y') b.push('special');
		if (stepData.returnYn === 'Y') b.push('return');
		if (stepData.claimYn === 'Y') b.push('claim');
		if (stepData.reqdlvtime1To) b.push('otd');
		// 2026/01/14 키 유형 검사 함수 추가 변경 가능성 있음
		if (parseKeyType(stepData.passwordType, stepData.passwordTypeCd).showPasswordIcon) b.push('key');
		return b;
	};

	// 여러 주문을 렌더링하는 함수
	const renderOrderItem = (stepData: TmEngineStepDto) => {
		const orderBadges = getBadges(stepData);
		return (
			<OrderItem
				key={`${stepData.id}-${stepData._stepIndex}`}
				onClick={() => onClickOrder?.(stepData.uniqueId)}
				$clickable={!!onClickOrder}
			>
				<TopLine>
					<CustomerInfo>
						<Tag
							color={stepData._stepIndex && stepData._stepIndex > 0 ? '#e6f4ff' : '#d9d9d9'}
							style={{ color: stepData._stepIndex && stepData._stepIndex > 0 ? '#1677ff' : '#000', borderRadius: 12 }}
						>
							{stepData._stepIndex && stepData._stepIndex > 0 ? stepData._stepIndex : '-'}
						</Tag>
						<CustomerName strong>{stepData.custName}</CustomerName>
					</CustomerInfo>
					<Space size={8}>
						<Button
							size="small"
							onClick={e => {
								e.stopPropagation();
								onClickDetail?.(stepData);
							}}
						>
							상세
						</Button>
						<Button
							size="small"
							onClick={e => {
								e.stopPropagation();
								onClickHistory?.(stepData.id);
							}}
						>
							배차이력
						</Button>
					</Space>
				</TopLine>
				<BottomLine>
					<Space size={10}>
						{renderBadges(orderBadges)}
						{orderBadges.length > 0 && <Separator />}
						<Typography.Text type="secondary">중량 {Number(stepData.weight ?? 0).toFixed(3)}kg</Typography.Text>
						<Typography.Text type="secondary">체적 {Number(stepData.cube ?? 0).toFixed(2)}m³</Typography.Text>
					</Space>
				</BottomLine>
			</OrderItem>
		);
	};

	// 차량 헤더 텍스트 생성 (타입 + 차량번호 + 회차)
	const getVehicleHeaderText = (step: StepWithVehicleInfo) => {
		const carNo = step._internalCarno || '';
		const roundSeq = step._internalRoundSeq ? `(${step._internalRoundSeq}회)` : '';
		const text = [carNo, roundSeq].filter(Boolean).join(' ');
		return text || '미배차';
	};

	// 차량별로 그룹화 (_carno + _roundSeq 기준)
	const groupByVehicle = (steps: StepWithVehicleInfo[]) => {
		return steps.reduce((acc, step) => {
			const vehicleKey = step._internalCarno ? `${step._internalCarno}_${step._internalRoundSeq || 1}` : '미배차';
			if (!acc[vehicleKey]) {
				acc[vehicleKey] = [];
			}
			acc[vehicleKey].push(step);
			return acc;
		}, {} as Record<string, StepWithVehicleInfo[]>);
	};

	const isGrouped = selectedOrder.groupedSteps && selectedOrder.groupedSteps.length > 1;

	return (
		<Wrapper>
			<HeaderRow>
				<Space size={8} wrap>
					<Space size={4}>
						<EnvironmentOutlined style={{ color: '#595959' }} />
						<Typography.Text>{selectedOrder.custAddress}</Typography.Text>
					</Space>
				</Space>
			</HeaderRow>

			{isGrouped ? (
				<MultiBody onWheel={e => e.stopPropagation()}>
					{Object.entries(groupByVehicle(selectedOrder.groupedSteps!)).map(([vehicleKey, steps], groupIdx, arr) => (
						<VehicleGroup key={vehicleKey}>
							<VehicleHeader>{getVehicleHeaderText(steps[0])}</VehicleHeader>
							{steps.map((step, idx) => (
								<React.Fragment key={`${step.id}-${step._stepIndex}`}>
									{renderOrderItem(step)}
									{idx < steps.length - 1 && <OrderDivider />}
								</React.Fragment>
							))}
							{groupIdx < arr.length - 1 && <OrderDivider />}
						</VehicleGroup>
					))}
				</MultiBody>
			) : (
				<SingleBody>{renderOrderItem(selectedOrder)}</SingleBody>
			)}
		</Wrapper>
	);
};

export default TmPlanMapCustomerPopup;

// styles
const Wrapper = styled.div`
	background: #fff;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	width: 320px;
	max-width: 90vw;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
	padding: 10px 12px 12px;

	/* bottom-center caret */
	&::after {
		content: '';
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: -8px;
		border-width: 8px 8px 0 8px;
		border-style: solid;
		border-color: rgb(255, 255, 255) transparent transparent transparent;
	}
	&::before {
		content: '';
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: -7px;
		border-width: 8px 8px 0 8px;
		border-style: solid;
		border-color: #fff transparent transparent transparent;
	}
`;

const HeaderRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding-bottom: 8px;
	border-bottom: 1px dashed #e8e8e8;
`;

const SingleBody = styled.div`
	padding-top: 8px;
`;

const MultiBody = styled.div`
	padding-top: 8px;
	display: flex;
	flex-direction: column;
	gap: 0;
	max-height: min(300px, 24vh);
	overflow-y: auto;
	margin-right: -12px;
	padding-right: 12px;
`;

const OrderItem = styled.div<{ $clickable?: boolean }>`
	padding: 8px 0;
	cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
	border-radius: 4px;
	margin: 0 -4px;
	padding: 8px 4px;

	&:hover {
		background: ${({ $clickable }) => ($clickable ? '#f5f5f5' : 'transparent')};
	}
`;

const OrderDivider = styled.div`
	height: 1px;
	background: #f0f0f0;
	margin: 4px 0;
`;

const TopLine = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const BottomLine = styled.div`
	margin-top: 8px;
`;

const Separator = styled.span`
	display: inline-block;
	width: 1px;
	height: 12px;
	background: #d9d9d9;
`;

const CustomerInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 0;
	min-width: 0;
	flex: 1;
`;

const CustomerName = styled(Typography.Text)`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 150px;
`;

const VehicleGroup = styled.div`
	&:not(:first-child) {
		margin-top: 8px;
	}
`;

const VehicleHeader = styled.div`
	background: #f5f5f5;
	padding: 6px 8px;
	font-weight: 600;
	font-size: 13px;
	color: #333;
	border-radius: 4px;
	margin-bottom: 4px;
`;
