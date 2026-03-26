/*
 ############################################################################
 # FiledataField	: TmLocationMonitorRightDetail.tsx
 # Description		: 지표모니터링 > 차량관제 > 차량위치모니터링 Right Detail (지도 + 차량주문모달)
 # Author			: wm-youngjae
 # Since			: 2026.03.03
 ############################################################################
*/
import { Button } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { RooutyMapProvider } from '@/components/common/custom/mapgl/mapbox';
import VehicleOrderListModal, {
	VehicleOrderListModalInfo,
	VehicleOrderListModalItem,
} from '@/components/tm/VehicleOrderListModal';
import { TmLocationMonitorMap } from '@/components/tm/TmLocationMonitor/Map';
import commUtil from '@/util/commUtil';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {
	ActualRouteItem,
	LocationMonitorSearchForm,
	PlanRouteItem,
	PopupVehicleCustomerItem,
	PopupVehicleInfo,
	VehicleLocationItem,
	VehicleShippingStatusItem,
} from '@/types/tm/locationMonitor';

interface PopupData {
	header: PopupVehicleInfo;
	list: PopupVehicleCustomerItem[];
}

interface TmLocationMonitorRightDetailProps {
	routeData: ActualRouteItem[] | null;
	customerLocationData: any;
	planRouteData: PlanRouteItem[] | null;
	carLocationData: VehicleLocationItem[] | null;
	allVehicleLocationData: any;
	onVehicleSelect: (vehicleInfo: VehicleShippingStatusItem, priority?: number) => void;
	selectedVehicle: VehicleShippingStatusItem | null;
	searchParams: Partial<LocationMonitorSearchForm>;
	selectedOrderId?: string;
	lastMarkerClickTime: number;
	onOrderClick: (orderId: string | undefined) => void;
	popupData: PopupData | null;
	onChangePriority: React.Dispatch<React.SetStateAction<number>>;
	onReset: () => void;
}

const getEtaText = (item: PopupVehicleCustomerItem): string => {
	if (!commUtil.isEmpty(item.actualArrivalTime)) {
		return item.actualArrivalTime;
	}
	if (!commUtil.isEmpty(item.expectedArrivalTime)) {
		return item.expectedArrivalTime;
	}
	return '';
};

const TmLocationMonitorRightDetail = ({
	routeData,
	customerLocationData,
	planRouteData,
	carLocationData,
	allVehicleLocationData,
	onVehicleSelect,
	selectedVehicle,
	searchParams,
	selectedOrderId,
	lastMarkerClickTime,
	onOrderClick,
	popupData,
	onChangePriority,
	onReset,
}: TmLocationMonitorRightDetailProps) => {
	const [togglePopupFlag, setTogglePopupFlag] = useState(false);
	const [popHeaderData, setPopHeaderData] = useState<PopupVehicleInfo>({
		carcapacity: '',
		carcapacityName: '',
		cargroup: '',
		cargroupName: '',
		carno: '',
		contracttype: '',
		contracttypeName: '',
		drivername: '',
		maxPrepriority: '',
		phone1: '',
		prepriority: '',
	});
	const [popListData, setPopListData] = useState<PopupVehicleCustomerItem[]>([]);

	const fnClosePopup = () => {
		setTogglePopupFlag(false);
		onReset();
		onOrderClick(undefined);
	};

	useEffect(() => {
		if (popupData?.header && popupData?.list) {
			setPopHeaderData(popupData.header);
			setPopListData(popupData.list);
			setTogglePopupFlag(true);
		} else {
			setTogglePopupFlag(false);
		}
	}, [popupData]);

	const vehicleInfo = useMemo<VehicleOrderListModalInfo | null>(() => {
		if (!popHeaderData) return null;
		return {
			contractType: popHeaderData.contracttypeName || '',
			group: popHeaderData.cargroupName || '',
			carno: popHeaderData.carno || '',
			tonnage: (popHeaderData.carcapacity || '') + '톤',
			rotation: (popHeaderData.prepriority || '') + ' 회차',
			driverName: popHeaderData.drivername || '',
			phone: popHeaderData.phone1 || '',
		};
	}, [popHeaderData]);

	const orders = useMemo<VehicleOrderListModalItem[]>(() => {
		if (!popListData) return [];
		return popListData.map((item: PopupVehicleCustomerItem) => ({
			index: item.seqNo,
			custName: item.custName,
			address: item.custAddress,
			eta: getEtaText(item),
			otdStart: item.reqdlvtime1From,
			otdEnd: item.reqdlvtime1To,
			badges: [
				item.faceInspect === 'Y' ? 'ftf' : '',
				item.specialConditionYn === 'Y' ? 'special' : '',
				item.returnYn === 'Y' ? 'return' : '',
				item.claimYn === 'Y' ? 'claim' : '',
				item.keyCustType && item.keyCustType !== '없음' ? 'key' : '',
			].filter(Boolean),
			key: item.keyCustType,
			markerColor: commUtil.isEmpty(item.actualArrivalTime) ? '#2E66F6' : 'rgba(141, 141, 141, 1)',
			uniqueId: item.custKey,
		}));
	}, [popListData]);

	const headerExtra = useMemo(() => {
		if (!popHeaderData || popHeaderData.maxPrepriority === '1') return null;
		return (
			<div style={{ display: 'flex', gap: 12 }}>
				<StyledArrowButton
					size="small"
					variant="text"
					disabled={popHeaderData.prepriority === '1'}
					onClick={() => onChangePriority((prev: number) => prev - 1)}
				>
					<LeftOutlined />
				</StyledArrowButton>
				<StyledArrowButton
					size="small"
					variant="text"
					disabled={popHeaderData.prepriority === popHeaderData.maxPrepriority}
					onClick={() => onChangePriority((prev: number) => prev + 1)}
				>
					<RightOutlined />
				</StyledArrowButton>
			</div>
		);
	}, [onChangePriority, popHeaderData]);

	return (
		<div id="divMap" style={{ flex: 1, marginLeft: '10px', position: 'relative' }}>
			<RooutyMapProvider>
				<TmLocationMonitorMap
					routeData={routeData}
					customerLocationData={customerLocationData}
					planRouteData={planRouteData}
					carLocationData={carLocationData}
					allVehicleLocationData={allVehicleLocationData}
					onVehicleSelect={onVehicleSelect}
					selectedVehicle={selectedVehicle}
					searchParams={searchParams}
					selectedOrderId={selectedOrderId}
					lastMarkerClickTime={lastMarkerClickTime}
					onOrderClick={onOrderClick}
				/>
			</RooutyMapProvider>

			<VehicleOrderListModal
				isLocationMonitor
				open={togglePopupFlag}
				onClose={fnClosePopup}
				vehicleInfo={vehicleInfo}
				orders={orders}
				headerExtra={headerExtra}
				onOrderClick={order => {
					if (order.uniqueId) {
						onOrderClick(order.uniqueId);
					}
				}}
				style={{
					top: '36px',
				}}
			/>
		</div>
	);
};

export default TmLocationMonitorRightDetail;

const StyledArrowButton = styled(Button)`
	width: 24px;
	min-width: 24px;
	height: 24px;
	padding: 0;
`;
