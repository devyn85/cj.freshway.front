/*
############################################################################
# Component: VehicleOrderListModal (차량별 관리처 주문목록 모달)
# 목적: 차량의 배송 주문 목록을 상세히 표시하는 모달 (범용)
############################################################################
*/

import {
	IconCall,
	IconClaim,
	IconFTFInspection,
	IconKey,
	IconReturn,
	IconSpecialCondition,
} from '@/components/tm/TmPlan/TmInfoIcon';
import store from '@/store/core/coreStore';
import { showAlert } from '@/util/MessageUtil';
import { CloseOutlined, DownOutlined, PhoneFilled, UpOutlined } from '@ant-design/icons';
import { Card, Divider, Space, Typography } from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

export interface VehicleOrderListModalInfo {
	contractType: string;
	group?: string;
	carno: string;
	tonnage: string;
	rotation?: string;
	driverName?: string;
	phone?: string;
}

export interface VehicleOrderListModalItem {
	index: number | string;
	custName: string;
	address: string;
	eta: string;
	otdStart?: string;
	otdEnd?: string;
	badges?: string[];
	key?: string;
	vid?: string;
	markerColor?: string;
	uniqueId?: string;
	defPop?: string;
	defCarno?: string;
}

interface VehicleOrderListModalProps {
	open: boolean;
	onClose: () => void;
	vehicleInfo: VehicleOrderListModalInfo | null;
	orders: VehicleOrderListModalItem[];
	style?: React.CSSProperties;
	headerExtra?: React.ReactNode;
	isLocationMonitor?: boolean;
	onOrderClick?: (order: VehicleOrderListModalItem) => void;
}

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
		<Space size={6} align="center" style={{ paddingTop: 6 }}>
			{badges.map((badge, idx) => (
				<React.Fragment key={`${badge}-${idx}`}>
					{renderBadgeIcon(badge)}
					{idx < badges.length - 1 && <div style={{ width: 1, height: 12, backgroundColor: '#D8DDEA' }} />}
				</React.Fragment>
			))}
		</Space>
	);
};

const VehicleOrderListModal = ({
	open,
	onClose,
	vehicleInfo,
	orders,
	style,
	headerExtra,
	isLocationMonitor = false,
	onOrderClick,
}: VehicleOrderListModalProps) => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const handleDialClick = (phoneNumber?: string) => {
		const { VITE_CLICK_TO_DIAL_URL } = import.meta.env;
		const user = store.getState().user.userInfo;

		if (!phoneNumber) {
			showAlert(null, '전화번호 정보가 없습니다.');
			return;
		}

		const params = {
			REQ: 'C2C',
			caller: user.telNo?.replaceAll('-', ''),
			called: phoneNumber.replaceAll('-', ''),
		};
		extUtil.openWindowAndPost(VITE_CLICK_TO_DIAL_URL, params, { width: '200', height: '200' });
	};

	if (!open || !vehicleInfo) return null;

	const carnoFiltered = (carno: string) => {
		const regex = /TEMPORARY-\d+-[a-zA-Z0-9]+/;
		if (regex.test(carno)) return `실비차 ${carno.split('-')[1]}`;
		return carno;
	};

	return (
		<div
			style={{
				position: 'absolute',
				left: '16px',
				top: '10px',
				width: '420px',
				maxHeight: 'calc(100% - 20px)',
				zIndex: 10,
				pointerEvents: 'auto',
				...style,
			}}
		>
			<Card
				size="small"
				style={{
					boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
					borderRadius: '8px',
					maxHeight: '100%',
					overflow: 'hidden',
				}}
				bodyStyle={{
					padding: isCollapsed ? '12px 16px' : '16px',
					transition: 'padding 0.25s ease-out',
				}}
			>
				{/* 헤더: 차량 정보 */}
				<div
					style={{
						position: 'relative',
						marginBottom: isCollapsed ? 0 : '12px',
						transition: 'margin-bottom 0.25s ease-out',
					}}
				>
					<Space direction="vertical" size={4} style={{ width: '100%' }}>
						{/* 1행: 배지 + 차량번호 + 톤수 + 회차 */}
						<Space size={4} wrap>
							<Text strong style={{ fontSize: '16px' }}>
								{carnoFiltered(vehicleInfo.carno)}
							</Text>
							{vehicleInfo.contractType && (
								<>
									<Text type="secondary">|</Text>
									<Text>{vehicleInfo.contractType}</Text>
								</>
							)}
							{vehicleInfo.group && (
								<>
									<Text type="secondary">|</Text>
									<Text>{vehicleInfo.group}</Text>
								</>
							)}
							<Text type="secondary">|</Text>
							<Text>{vehicleInfo.tonnage}</Text>
							{vehicleInfo.rotation && (
								<>
									<Text type="secondary">|</Text>
									<Text>{vehicleInfo.rotation}</Text>
								</>
							)}
						</Space>

						<Space style={{ width: '100%', justifyContent: 'space-between' }}>
							<Text type="secondary" style={{ fontSize: '13px' }}>
								{vehicleInfo.driverName} {vehicleInfo.phone}{' '}
								{isLocationMonitor && (
									<PhoneFilled
										style={{ color: '#000000', cursor: 'pointer' }}
										onClick={() => handleDialClick(vehicleInfo.phone)}
									/>
								)}
							</Text>
							{headerExtra}
						</Space>
					</Space>

					{/* 접기/닫기 버튼 */}
					<Space
						size={12}
						style={{
							position: 'absolute',
							top: '0',
							right: '0',
						}}
					>
						{isCollapsed ? (
							<DownOutlined
								onClick={() => setIsCollapsed(false)}
								style={{
									fontSize: '14px',
									cursor: 'pointer',
									color: '#999',
								}}
							/>
						) : (
							<UpOutlined
								onClick={() => setIsCollapsed(true)}
								style={{
									fontSize: '14px',
									cursor: 'pointer',
									color: '#999',
								}}
							/>
						)}
						<CloseOutlined
							onClick={onClose}
							style={{
								fontSize: '14px',
								cursor: 'pointer',
								color: '#999',
							}}
						/>
					</Space>
				</div>

				{/* 애니메이션을 위해 항상 렌더링하고 높이로 제어 */}
				<div
					style={{
						maxHeight: isCollapsed ? 0 : 'calc(100vh - 300px)',
						opacity: isCollapsed ? 0 : 1,
						overflow: 'hidden',
						transition: 'max-height 0.25s ease-out, opacity 0.2s ease-out',
					}}
				>
					<Divider style={{ margin: '12px 0' }} />

					{/* 주문 목록 */}
					<div
						style={{ display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}
					>
						{orders.map((order, idx) => {
							const markerColor = order.markerColor || '#1C48CD';
							return (
								<div
									key={idx}
									style={{
										display: 'flex',
										gap: '12px',
										alignItems: 'flex-start',
										cursor: onOrderClick ? 'pointer' : 'default',
									}}
									onClick={() => onOrderClick?.(order)}
								>
									{/* 순번 마커 */}
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											paddingTop: '2px',
											alignSelf: 'stretch',
										}}
									>
										<div
											style={{
												position: 'relative',
												width: '24px',
												height: '28px',
												flexShrink: 0,
											}}
										>
											{/* SVG 마커 */}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="28"
												viewBox="0 0 16 20"
												fill="none"
												style={{ position: 'absolute', top: 0, left: 0 }}
											>
												<path
													fillRule="evenodd"
													clipRule="evenodd"
													d="M7.262 19.7281C7.262 19.7281 0 13.7354 0 7.83872C0 5.75976 0.842855 3.76595 2.34315 2.29591C3.84344 0.825863 5.87827 0 8 0C10.1217 0 12.1566 0.825863 13.6569 2.29591C15.1571 3.76595 16 5.75976 16 7.83872C16 13.7354 8.738 19.7281 8.738 19.7281C8.334 20.0926 7.669 20.0887 7.262 19.7281Z"
													fill={markerColor}
												/>
											</svg>
											{/* 숫자 */}
											<div
												style={{
													position: 'absolute',
													top: '4px',
													left: '0',
													width: '24px',
													height: '16px',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													color: '#fff',
													fontSize: '14px',
													fontWeight: 600,
												}}
											>
												{Number(order.index) > 0 ? Number(order.index) : '-'}
											</div>
										</div>
										{/* 연결선 */}
										{idx < orders.length - 1 && (
											<div
												style={{
													width: '2px',
													height: '100%',
													background: '#D8DDEA',
													marginBottom: '-2px',
												}}
											/>
										)}
									</div>

									{/* 주문 정보 */}
									<div style={{ flex: 1, minWidth: 0 }}>
										<Space
											direction="vertical"
											size={0}
											style={{ width: '100%', paddingBottom: idx === orders.length - 1 ? 0 : 6, paddingTop: 3 }}
										>
											{/* 1행: 고객처명 + ETA */}
											<Space size={8} wrap>
												<Text strong style={{ fontSize: '14px' }}>
													{order.custName}
												</Text>
												<Text type="secondary" style={{ fontSize: '12px' }}>
													ETA {order.eta}
												</Text>
											</Space>

											{/* 2행: 주소 + OTD */}
											<Space size={8} wrap style={{ width: '100%', paddingTop: 2 }}>
												<Text
													style={{
														fontSize: '13px',
														flex: 1,
														overflow: 'hidden',
														lineHeight: '1',
													}}
												>
													{order.address}
												</Text>
											</Space>

											{/* 3행: 키종류 + 아이콘 */}
											{(order.otdStart || order.otdEnd || (order.badges && order.badges.length > 0)) && (
												<Space size={6} align="center" style={{ height: 14 }}>
													{(order.otdStart || order.otdEnd) && (
														<Text style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
															OTD {order.otdStart || ''} ~ {order.otdEnd || ''}
														</Text>
													)}
													{renderBadges(order.badges)}
													{order.badges.includes('key') && order.key && (
														<Text style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>{order.key}</Text>
													)}
												</Space>
											)}
											{/* 4행: 고정POP/고정차량 (배차 차량과 다를 경우) */}
											{order.defCarno && vehicleInfo?.carno && order.defCarno !== vehicleInfo.carno && (
												<Space size={4} align="center" style={{ height: 14 }}>
													{order.defPop && (
														<>
															<Text style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>{order.defPop}</Text>
															<div
																style={{
																	width: '1px',
																	height: '10px',
																	background: '#D8DDEA',
																	marginBottom: '-2px',
																}}
															/>
														</>
													)}
													<Text style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>{order.defCarno}</Text>
												</Space>
											)}
										</Space>
									</div>
								</div>
							);
						})}

						{orders.length === 0 && (
							<div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
								<Text type="secondary">배송 주문이 없습니다.</Text>
							</div>
						)}
					</div>
				</div>
			</Card>
		</div>
	);
};

export default VehicleOrderListModal;
