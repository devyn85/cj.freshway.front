import { CustomerLocationItem, PopupVehicleCustomerItem, VehicleLocationItem } from '@/types/tm/locationMonitor';
import { useMemo } from 'react';

// 화면에 표시될 단일화된 마커 타입
export interface DisplayMarker {
	longitude: number;
	latitude: number;
	color: string;
	displaySeqNo: string;
	isGrouped: boolean;
	customers: CustomerData[];
	custAddress?: string;
}

// API 응답 데이터를 결합하고 UI에 필요한 데이터를 추가한 타입
export interface CustomerData {
	// From CustomerLocationItem
	latitude: string;
	longitude: string;
	otherCustYn: string;
	priority: string;
	sortSeq: number;
	truthcustkey: string;
	// From PopupVehicleCustomerItem
	actualArrivalTime: string;
	claimYn: string;
	custAddress: string;
	custKey: string;
	custName: string;
	defCarno: string;
	defDistrictCode: string;
	expectedArrivalTime: string;
	faceInspect: string;
	keyCustType: string;
	reqdlvtime1From: string;
	reqdlvtime1To: string;
	returnYn: string;
	seqNo: string;
	specialConditionYn: string;
	// Added for UI
	isArrived: boolean;
	color: string;
}

interface UseLocationMarkersProps {
	customerLocationData?: {
		locations: CustomerLocationItem[];
		customers: PopupVehicleCustomerItem[];
	} | null;
	allVehicleLocationData?: VehicleLocationItem[] | null;
}

// displayMarkers 생성 로직
const createDisplayMarkers = (
	customerLocationData: UseLocationMarkersProps['customerLocationData'],
): DisplayMarker[] => {
	if (!customerLocationData?.locations || !customerLocationData?.customers) return [];

	// locations와 customers를 custKey(truthcustkey) 기준으로 결합
	const combinedMarkers: CustomerData[] = customerLocationData.locations
		.map((location: CustomerLocationItem) => {
			const customer = customerLocationData.customers.find(
				(c: PopupVehicleCustomerItem) => c.custKey === location.truthcustkey,
			);
			if (!customer) {
				return null;
			}
			return {
				...location,
				...customer, // customer의 모든 속성을 여기에 포함
				isArrived: !!customer?.actualArrivalTime,
				color: customer?.actualArrivalTime ? '#9E9E9E' : '#4076FF',
			};
		})
		.filter((marker): marker is CustomerData => marker !== null);

	const markersByCoords = combinedMarkers.reduce((acc: Record<string, CustomerData[]>, marker: CustomerData) => {
		const key = `${marker.latitude},${marker.longitude}`;
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(marker);
		return acc;
	}, {});

	const preliminaryMarkers = Object.values(markersByCoords).map((group: CustomerData[]) => {
		group.sort((a, b) => Number(a.seqNo) - Number(b.seqNo));

		const firstCustomer = group[0];
		if (group.length > 1) {
			return {
				isGrouped: true,
				latitude: Number(firstCustomer.latitude),
				longitude: Number(firstCustomer.longitude),
				customers: group,
				color: firstCustomer.color,
				seqNo: firstCustomer.seqNo, // 정렬용 대표 seqNo
				custAddress: firstCustomer.custAddress,
			};
		}
		return {
			...firstCustomer,
			latitude: Number(firstCustomer.latitude),
			longitude: Number(firstCustomer.longitude),
			isGrouped: false,
			customers: group,
			seqNo: firstCustomer.seqNo,
			custAddress: firstCustomer.custAddress,
		};
	});

	return preliminaryMarkers.map(marker => {
		// 중복(그룹화)된 경우 그룹 내 가장 낮은 seqNo를 표시, 아니면 원래 seqNo 그대로 표시
		const displaySeqNo = marker.isGrouped
			? String(Math.min(...marker.customers.map(c => Number(c.seqNo))))
			: String(marker.seqNo);
		return {
			longitude: marker.longitude,
			latitude: marker.latitude,
			color: marker.color,
			displaySeqNo,
			isGrouped: marker.isGrouped,
			customers: marker.customers,
			custAddress: marker.custAddress,
		};
	});
};

// allVehicleMarkers 생성 로직
const getVehicleMarkerColor = (deliveryStatus: string) => {
	if (deliveryStatus === '10') return '#FFA217';
	if (deliveryStatus === '20') return '#4076FF';
	return '#50545F';
};

const createVehicleMarkers = (allVehicleLocationData: UseLocationMarkersProps['allVehicleLocationData']) => {
	if (!allVehicleLocationData || allVehicleLocationData.length === 0) return [];

	return allVehicleLocationData
		.filter(vehicle => vehicle.latitude && vehicle.longitude)
		.map(vehicle => ({
			...vehicle,
			color: getVehicleMarkerColor(vehicle.deliveryStatus),
		}));
};

export const useLocationMarkers = ({ customerLocationData, allVehicleLocationData }: UseLocationMarkersProps) => {
	const displayMarkers = useMemo(() => createDisplayMarkers(customerLocationData), [customerLocationData]);
	const allVehicleMarkers = useMemo(() => createVehicleMarkers(allVehicleLocationData), [allVehicleLocationData]);

	return { displayMarkers, allVehicleMarkers };
};
