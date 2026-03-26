import { TmPlanCustomerDetailPopupReqDto } from '@/api/tm/apiTmCustomerDetailPopup';
import { TmEngineStepDto, TmVehiclesDto } from '@/api/tm/apiTmDispatch';
import { Layer, Marker, Source, useRooutyMap } from '@/components/common/custom/mapgl/mapbox';
import WrapperDistrictBoundaries from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/WrapperDistrictBoundaries';
import CustomerDetailModal from '@/components/tm/TmPlan/CustomerDetailModal';
import { colorById } from '@/components/tm/TmPlan/Timeline/hooks/useTimelineData';
import TmPlanMapCustomerPopup, { TmPlanMapCustomerPopupProps } from '@/components/tm/TmPlanMapCustomerPopup';
import VehicleOrderListModal, {
	VehicleOrderListModalInfo,
	VehicleOrderListModalItem,
} from '@/components/tm/VehicleOrderListModal';
import { usePlanIconLayer } from '@/hooks/tm/usePlanIconLayer';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { CommonCodeItem } from '@/types/tm/locationMonitor';
import { parseKeyType } from '@/util/keyType';
import { extractValidCoordinate, fitMapToBounds, moveToXY } from '@/util/mapUtils';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useUnactivate } from 'react-activation';
import styled from 'styled-components';

const DEFINE_MAP_ID = 'planMap';

export interface CustomerPopupInfo extends TmPlanMapCustomerPopupProps {
	id: string;
	lat: number;
	lng: number;
}

export const TmPlanMap = ({
	vehicles,
	vehiclesFrozen,
	selectedVehicleId,
	setSelectedVehicleId,
	selectedOrderId,
	setSelectedOrderId,
	unassignedOrders,
	returnOrders,
	onClickHistory,
	onMapMarkerClick,
	dccode,
}: {
	vehicles: TmVehiclesDto[];
	vehiclesFrozen: TmVehiclesDto[];
	selectedVehicleId?: string;
	setSelectedVehicleId?: Dispatch<SetStateAction<string>>;
	selectedOrderId?: string;
	setSelectedOrderId?: Dispatch<SetStateAction<string>>;
	unassignedOrders?: any[];
	returnOrders?: any[];
	onClickHistory?: (orderId: string) => void;
	onMapMarkerClick?: () => void;
	dccode?: string;
}) => {
	const { [DEFINE_MAP_ID]: map } = useRooutyMap();
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [isMapLoaded, setIsMapLoaded] = useState(false);
	const [detailTargetOrder, setDetailTargetOrder] = useState<TmEngineStepDto | undefined>(undefined);
	const lastXYRef = useRef<{ x: number; y: number; zoom: number } | null>(null);

	useUnactivate(() => {
		const lat = map?.mapbox?.getCenter().lat || 0;
		const lng = map?.mapbox?.getCenter().lng || 0;
		const zoom = map?.mapbox?.getZoom() || 15;
		if (lat > 10 && lng > 50) lastXYRef.current = { x: lng, y: lat, zoom };
	});
	const allSteps = useMemo(() => {
		return vehicles
			.flatMap(v =>
				v.steps.map(s => ({
					...s,
					_internalCarno: v.carno,
					_internalVehicleType: v.vehicleType,
					_internalRoundSeq: v.roundSeq,
				})),
			)
			.filter(s => s.type === 'job');
	}, [vehicles]);

	const groupsMap = useMemo(() => {
		const locationMap = new Map<string, string[]>();
		allSteps.forEach(s => {
			const location = extractValidCoordinate(s.location);
			if (location) {
				const locationKey = `${location[0]}__${location[1]}`;
				locationMap.set(locationKey, [...(locationMap.get(locationKey) || []), s.uniqueId]);
			}
		});
		const filteredMap = new Map([...locationMap.entries()].filter(([_, value]) => value.length >= 2));
		return filteredMap;
	}, [allSteps]);

	// selectedOrder에 그룹화된 steps 추가
	const selectedOrderWithGroup = useMemo(() => {
		const vehicleOrder = vehicles.flatMap(v => v.steps).find(s => s.uniqueId === selectedOrderId);
		const order =
			vehicleOrder ??
			unassignedOrders?.find(o => o.uniqueId === selectedOrderId) ??
			returnOrders?.find(o => o.uniqueId === selectedOrderId);

		if (!order) return undefined;

		const location = extractValidCoordinate(order.location);
		if (!location) return order;

		const locationKey = `${location[0]}__${location[1]}`;
		const groupedIds = groupsMap.get(locationKey);
		const shouldAddGroup = vehicleOrder && groupedIds && groupedIds.length >= 2;

		if (!shouldAddGroup) return order;

		const groupedSteps = allSteps.filter(s => groupedIds.includes(s.uniqueId));
		return { ...order, groupedSteps };
	}, [vehicles, selectedOrderId, unassignedOrders, returnOrders, groupsMap, allSteps]);

	const lastMarkerClickRef = useRef(0);
	const lastDragEndTimeRef = useRef(0);

	const handleSetSelectedOrderId = useCallback(
		(value: any) => {
			lastMarkerClickRef.current = Date.now();
			onMapMarkerClick?.();
			setSelectedOrderId?.(value);
		},
		[setSelectedOrderId, onMapMarkerClick],
	);

	const { layers, pathGeoJSON } = usePlanIconLayer({
		mapId: DEFINE_MAP_ID,
		vehicles,
		vehiclesFrozen,
		selectedVehicleId,
		selectedOrderId,
		setSelectedOrderId: handleSetSelectedOrderId,
		setSelectedVehicleId,
		unassignedOrders,
		returnOrders,
	});
	const [cursor, setCursor] = useState<'pointer' | 'default'>('default');

	// 전체 경로 fitBounds (데이터 로드 시)
	useEffect(() => {
		if (lastXYRef.current) {
			if (!isMapLoaded || !map?.mapbox) return;
			if (lastXYRef.current.x > 50 && lastXYRef.current.y > 10)
				moveToXY(map.mapbox, lastXYRef.current.x, lastXYRef.current.y, lastXYRef.current.zoom);
			lastXYRef.current = null;
			return;
		}
		if (!isMapLoaded || !map?.mapbox) return;
		const coordinates: [number, number][] = [];
		vehicles
			.flatMap(vehicle => vehicle.steps ?? [])
			.forEach(step => {
				const coord = extractValidCoordinate(step?.location);
				if (coord) coordinates.push(coord);
			});
		setTimeout(() => {
			fitMapToBounds(map.mapbox, coordinates);
		}, 100);
	}, [map, vehicles, isMapLoaded]);

	// 마커 클릭 시 해당 위치로 이동
	useEffect(() => {
		if (!selectedOrderWithGroup || !map?.mapbox) return;

		const coord = extractValidCoordinate(selectedOrderWithGroup.location);
		if (!coord) return;

		// 차량 모달이 열려있을 때는 왼쪽 padding 추가 (모달 너비 420px + 여유 30px)
		const padding = selectedVehicleId
			? { top: 100, bottom: 100, left: 450, right: 100 }
			: { top: 100, bottom: 100, left: 100, right: 100 };

		fitMapToBounds(map.mapbox, [coord], { maxZoom: 13, padding });
	}, [selectedOrderWithGroup, map, selectedVehicleId]);

	// Redux에서 배차 관련 정보 가져오기
	const deliveryDate = useAppSelector(state => state.tmDispatch.deliveryDate);
	const storerKey = useAppSelector(state => state.global.globalVariable.gStorerkey);

	// API 파라미터 생성 - 상세보기 클릭 시 해당 주문 정보 사용
	const apiParams = useMemo<TmPlanCustomerDetailPopupReqDto | undefined>(() => {
		// 그룹화된 주문이 있을 때는 현재 그룹 인덱스에 해당하는 파라미터 사용

		const targetOrder = detailTargetOrder || selectedOrderWithGroup;
		if (!targetOrder) return undefined;
		// truthCustkey는 id 필드를 사용 (실착지 키)
		return {
			truthCustkey: targetOrder.id || '', // 실착지 키
			custtype: targetOrder.custType || '', // 고객유형
			storerkey: storerKey || '', // 고객사코드
			deliveryDate: deliveryDate || '', // 배송일자
			tmDeliveryType: targetOrder.tmDeliveryType || '1', // 배송유형 (TmEngineStepDto에 없음, 필요시 추가)
			dccode: dccode || '', // 센터코드
			dispatchStatus: '00', // 배차상태 (임시값, 필요시 Redux에서 가져오기)
			carno: targetOrder._originCarno || '', // 차량번호
		};
	}, [detailTargetOrder, selectedOrderWithGroup, deliveryDate, storerKey, dccode]);

	// 상세보기 클릭 핸들러
	const handleClickDetail = (order?: TmEngineStepDto) => {
		const vehicle = vehicles.find(x => x.steps?.find(s => s.uniqueId === order.uniqueId));
		const updatedOrder = order;
		if (vehicle?.carno) {
			updatedOrder._originCarno = vehicle?.carno;
		}
		setDetailTargetOrder(updatedOrder);
		setIsDetailModalOpen(true);
	};

	// 상세 모달 닫기 핸들러
	const handleCloseDetailModal = () => {
		setIsDetailModalOpen(false);
		setDetailTargetOrder(undefined);
	};

	const selectedVehicle = useMemo(
		() => vehicles.find(v => v.uniqueId === selectedVehicleId) || null,
		[vehicles, selectedVehicleId],
	);

	const commCdContracttype = getCommonCodeList('CONTRACTTYPE', null, null, { storerkey: 'FW00' });

	const vehicleInfo = useMemo<VehicleOrderListModalInfo | null>(() => {
		if (!selectedVehicle) return null;
		const contractType = commCdContracttype.find((row: CommonCodeItem) => row.comCd === selectedVehicle.contractType);
		const carGroup = getCommonCodeList('CARGROUP', null, null, { storerkey: 'FW00' });
		const group = carGroup.find((row: CommonCodeItem) => row.comCd === selectedVehicle.outGroupCd)?.cdNm;
		return {
			contractType: contractType.convdescr || contractType.cdNm,
			group: group || '-',
			carno: String(selectedVehicle.carno),
			tonnage: selectedVehicle.carCapacity ? selectedVehicle.carCapacity : '-',
			rotation: `${selectedVehicle.roundSeq}회차`,
			driverName: selectedVehicle.drivername || '-',
			phone: selectedVehicle.phone1 || '-',
		};
	}, [selectedVehicle]);

	const vehicleOrders = useMemo<VehicleOrderListModalItem[]>(() => {
		if (!selectedVehicle?.steps) return [];

		return selectedVehicle.steps
			.filter(s => s.type === 'job')
			.sort((a, b) => Number(a.arrival || 0) - Number(b.arrival || 0))
			.map((step, index) => {
				const badges: string[] = [];
				if (step.faceInspect === 'Y') badges.push('ftf');
				if (step.specialConditionYn === 'Y') badges.push('special');
				if (step.returnYn === 'Y' || step.tmDeliveryType === '2') badges.push('return');
				if (step.claimYn === 'Y') badges.push('claim');
				// 2026/01/14 키 유형 검사 함수 추가 변경 가능성 있음
				if (parseKeyType(step.passwordType, step.passwordTypeCd).showPasswordIcon) badges.push('key');

				return {
					index: step._stepIndex,
					custName: step.custName || '-',
					address: step.custAddress || '-',
					eta: (step.expectedArrivalTime || '-').replace(' : ', ':'),
					otdStart: step.reqdlvtime1From,
					otdEnd: step.reqdlvtime1To,
					badges,
					key: step.keyCustType || '-',
					vid: step._originVid,
					markerColor: colorById(step._originVid || 'unassigned'),
					uniqueId: step.uniqueId,
					defPop: step.defPop,
					defCarno: step.defCarno,
				};
			});
	}, [selectedVehicle]);

	const handleMapClick = useCallback(() => {
		if (Date.now() - lastMarkerClickRef.current < 200) return;
		if (Date.now() - lastDragEndTimeRef.current < 200) return;
		setSelectedOrderId?.(undefined as any);
	}, [setSelectedOrderId]);

	const handleDragEnd = useCallback(() => {
		lastDragEndTimeRef.current = Date.now();
	}, []);

	return (
		<div style={{ position: 'relative', width: '100%', height: '100%' }}>
			<WrapperDistrictBoundaries
				showWeather={true}
				deckLayers={layers}
				id={DEFINE_MAP_ID}
				cursor={cursor}
				loadBoundaryDataOnLoad={false}
				onHoverDeck={e => setCursor(e.picked ? 'pointer' : 'default')}
				onGlLoad={() => setIsMapLoaded(true)}
				onClick={handleMapClick}
				onDragEnd={handleDragEnd}
			>
				{/* 경로 레이어 - Source/Layer 사용 */}
				<Source id="route-paths" type="geojson" data={pathGeoJSON}>
					<Layer
						id="route-line"
						type="line"
						paint={{
							'line-color': ['get', 'color'],
							'line-width': ['get', 'width'],
							'line-opacity': ['get', 'opacity'],
						}}
						layout={{
							'line-cap': 'round',
							'line-join': 'round',
						}}
					/>
				</Source>

				{selectedOrderWithGroup && (
					<Marker
						longitude={selectedOrderWithGroup.location[0]}
						latitude={selectedOrderWithGroup.location[1]}
						offset={[0, -45]}
						style={{ zIndex: 1 }}
						anchor={'bottom'}
					>
						<TmPlanMapCustomerPopup
							selectedOrder={selectedOrderWithGroup}
							onClickDetail={handleClickDetail}
							onClickHistory={onClickHistory}
							onClickOrder={handleSetSelectedOrderId}
						/>
					</Marker>
				)}
			</WrapperDistrictBoundaries>

			{/* 차량 주문 목록 모달 (지도 위에 오버레이) */}
			<VehicleOrderListModal
				open={!!selectedVehicleId}
				onClose={() => setSelectedVehicleId(undefined)}
				vehicleInfo={vehicleInfo}
				orders={vehicleOrders}
				onOrderClick={order => {
					if (order.uniqueId) {
						handleSetSelectedOrderId(order.uniqueId);
					}
				}}
			/>

			{/* 거래처 상세 모달 */}
			<CustomerDetailModal open={isDetailModalOpen} onClose={handleCloseDetailModal} apiParams={apiParams} />
		</div>
	);
};

export const MarkerItem = styled.div``;
