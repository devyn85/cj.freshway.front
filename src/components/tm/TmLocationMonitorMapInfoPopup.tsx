import {
	IconCall,
	IconClaim,
	IconFTFInspection,
	IconKey,
	IconOTD,
	IconReturn,
	IconSpecialCondition,
} from '@/components/tm/TmPlan/TmInfoIcon';
import { CustomerData, DisplayMarker } from '@/hooks/tm/useLocationMarkers';
import { parseKeyType } from '@/util/keyType';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Button, Space, Tag, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';

export interface TmLocationMonitorMapInfoPopupProps {
	markerData: DisplayMarker;
	onClickDetail?: (customer: CustomerData) => void;
}

const TmLocationMonitorMapInfoPopup = ({ markerData, onClickDetail }: TmLocationMonitorMapInfoPopupProps) => {
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

	const isGrouped = markerData.customers.length > 1;

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

	const getBadges = (customerData: CustomerData) => {
		const b = [];
		if (customerData.faceInspect === 'Y') b.push('ftf');
		if (customerData.specialConditionYn === 'Y') b.push('special');
		if (customerData.returnYn === 'Y') b.push('return');
		if (customerData.claimYn === 'Y') b.push('claim');
		if (customerData.reqdlvtime1To) b.push('otd');
		// 2026/01/14 키 유형 검사 함수 추가 변경 가능성 있음
		if (parseKeyType(customerData.keyCustType).showPasswordIcon) b.push('key');
		return b;
	};

	// 여러 주문을 렌더링하는 함수
	const renderOrderItem = (customerData: CustomerData) => {
		const orderBadges = getBadges(customerData);
		return (
			<OrderItem key={customerData.custKey}>
				<TopLine>
					<CustomerInfo>
						<Tag color="#e6f4ff" style={{ color: '#1677ff', borderRadius: 12 }}>
							{customerData.seqNo}
						</Tag>
						<CustomerName strong>{customerData.custName}</CustomerName>
					</CustomerInfo>
					<Space size={8}>
						<Button size="small" onClick={() => onClickDetail?.(customerData)}>
							상세
						</Button>
					</Space>
				</TopLine>
				<BottomLine>
					<Space size={10}>{renderBadges(orderBadges)}</Space>
				</BottomLine>
			</OrderItem>
		);
	};

	return (
		<Wrapper
			isGrouped={isGrouped}
			onWheel={e => {
				if (isGrouped) e.stopPropagation();
			}}
			onClick={e => e.stopPropagation()}
		>
			<HeaderRow>
				<Space size={8} wrap>
					<Space size={4}>
						<EnvironmentOutlined style={{ color: '#595959' }} />
						<Typography.Text>{markerData.custAddress}</Typography.Text>
					</Space>
				</Space>
			</HeaderRow>
			<Body isGrouped={isGrouped}>
				{markerData.customers?.map((customer, idx) => (
					<React.Fragment key={customer.custKey}>
						{renderOrderItem(customer)}
						{idx < (markerData.customers?.length || 0) - 1 && <OrderDivider />}
					</React.Fragment>
				))}
			</Body>
		</Wrapper>
	);
};

export default TmLocationMonitorMapInfoPopup;

// styles
const Wrapper = styled.div<{ isGrouped?: boolean }>`
	background: #fff;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	width: 320px;
	max-width: 90vw;
	max-height: ${props => (props.isGrouped ? '400px' : 'auto')};
	overflow-y: ${props => (props.isGrouped ? 'auto' : 'visible')};
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

const Body = styled.div<{ isGrouped: boolean }>`
	padding-top: 8px;
	${props =>
		props.isGrouped &&
		`
		display: flex;
		flex-direction: column;
		gap: 0;
	`}
`;

const OrderItem = styled.div`
	padding: 8px 0;
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
