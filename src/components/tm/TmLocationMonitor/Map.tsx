import { TmPlanCustomerDetailPopupReqDto } from '@/api/tm/apiTmCustomerDetailPopup';
import { Layer, Marker, Source, useRooutyMap } from '@/components/common/custom/mapgl/mapbox';
import WrapperDistrictBoundaries from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/WrapperDistrictBoundaries';
import Icon from '@/components/common/Icon';
import CustomerDetailModal from '@/components/tm/TmPlan/CustomerDetailModal';
import { TmPlanMapCustomerPopupProps } from '@/components/tm/TmPlanMapCustomerPopup';
import { useLocationIconLayer } from '@/hooks/tm/useLocationIconLayer';
import { useLocationLayer } from '@/hooks/tm/useLocationLayer';
import { CustomerData, DisplayMarker, useLocationMarkers } from '@/hooks/tm/useLocationMarkers';
import {
	ActualRouteItem,
	CustomerLocationItem,
	PlanRouteItem,
	PopupVehicleCustomerItem,
	VehicleLocationItem,
	VehicleShippingStatusItem,
} from '@/types/tm/locationMonitor';
import { extractValidCoordinate, fitMapToBounds } from '@/util/mapUtils';
import { Radio, RadioChangeEvent } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TmLocationMonitorMapInfoPopup from '../TmLocationMonitorMapInfoPopup';

const DEFINE_MAP_ID = 'locationMonitorMap';

export interface CustomerPopupInfo extends TmPlanMapCustomerPopupProps {
	id: string;
	lat: number;
	lng: number;
}

interface TmLocationMonitorMapProps {
	routeData?: ActualRouteItem[]; // 실제 경로 데이터
	customerLocationData?: {
		locations: CustomerLocationItem[];
		customers: PopupVehicleCustomerItem[];
	} | null; // 실착지 위치 데이터
	planRouteData?: PlanRouteItem[]; // 계획 경로 데이터
	carLocationData?: VehicleLocationItem[]; // 차량 위치 데이터
	allVehicleLocationData?: VehicleLocationItem[] | null; // 모든 차량 위치 데이터 (미선택 시)
	onVehicleSelect?: (vehicle: any) => void; // 차량 선택 콜백 함수
	searchParams?: any; // 부모 컴포넌트의 검색 조건
	selectedVehicle?: VehicleShippingStatusItem | null; // 부모 컴포넌트에서 선택된 차량 정보
	selectedOrderId?: string; // 선택된 주문 ID (custKey)
	lastMarkerClickTime?: number; // 마커 클릭 시간 (lastMarkerClickRef 패턴용)
	onOrderClick?: (orderId: string | undefined) => void; // 주문 선택 콜백 함수
}

export const TmLocationMonitorMap = ({
	routeData,
	customerLocationData,
	planRouteData,
	carLocationData,
	allVehicleLocationData,
	onVehicleSelect,
	searchParams,
	selectedVehicle,
	selectedOrderId,
	lastMarkerClickTime,
	onOrderClick,
}: TmLocationMonitorMapProps) => {
	const { [DEFINE_MAP_ID]: map } = useRooutyMap();

	const [routeDisplayFilter, setRouteDisplayFilter] = useState('ALL');
	const [selectedMarker, setSelectedMarker] = useState<DisplayMarker | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [modalApiParams, setModalApiParams] = useState<TmPlanCustomerDetailPopupReqDto | undefined>();
	const mapStateRef = useRef<{ center?: naver.maps.LatLng; zoom?: number } | null>(null);
	const lastMarkerClickRef = useRef(0);

	const { displayMarkers, allVehicleMarkers } = useLocationMarkers({ customerLocationData, allVehicleLocationData });
	const { mergedRouteFeature, mergedPlanRouteFeature, planStartPoints } = useLocationLayer({
		routeData,
		planRouteData,
	});

	// 그룹화된 마커 맵 생성 (TmPlan 방식)
	const groupsMap = useMemo(() => {
		const locationMap = new Map<string, DisplayMarker[]>();
		displayMarkers.forEach(marker => {
			if (marker.isGrouped) {
				const locationKey = `${marker.longitude}__${marker.latitude}`;
				locationMap.set(locationKey, [...(locationMap.get(locationKey) || []), marker]);
			}
		});
		return locationMap;
	}, [displayMarkers]);

	// deck.gl IconLayer 사용
	const { layers } = useLocationIconLayer({
		displayMarkers,
		planStartPoints: routeDisplayFilter === 'ALL' || routeDisplayFilter === 'PLAN' ? planStartPoints : [],
		onMarkerClick: marker => {
			lastMarkerClickRef.current = Date.now();
			setSelectedMarker(marker);
		},
	});

	const [cursor, setCursor] = useState<'pointer' | 'default'>('default');

	// 수송 여부 확인 (tmDeliverytype === '7')
	const isCarrier = searchParams?.tmDeliverytype === '7';

	const handleRouteDisplayFilterChange = (e: RadioChangeEvent) => {
		setRouteDisplayFilter(e.target.value);
	};

	// 수송 모드로 변경 시 계획경로 필터가 선택되어 있으면 전체로 변경
	useEffect(() => {
		if (isCarrier && routeDisplayFilter === 'PLAN') {
			setRouteDisplayFilter('REAL');
		}
	}, [isCarrier, routeDisplayFilter]);

	useEffect(() => {
		setSelectedMarker(null);
	}, [selectedVehicle]);

	// selectedOrderId 변경 시 displayMarkers에서 해당 마커 찾아서 selectedMarker 업데이트
	useEffect(() => {
		if (!selectedOrderId || !displayMarkers.length) {
			setSelectedMarker(null);
			return;
		}

		// displayMarkers에서 customers 배열에 selectedOrderId(custKey)와 일치하는 마커 찾기
		const foundMarker = displayMarkers.find(marker =>
			marker.customers.some(customer => customer.custKey === selectedOrderId),
		);

		if (foundMarker) {
			setSelectedMarker(foundMarker);
		} else {
			setSelectedMarker(null);
		}
	}, [selectedOrderId, displayMarkers]);

	// selectedMarker 변경 시 해당 위치로 지도 포커싱
	useEffect(() => {
		if (!selectedMarker || !map?.mapbox) return;

		const coord = extractValidCoordinate([selectedMarker.longitude, selectedMarker.latitude]);
		if (!coord) return;

		// 모달이 열려있을 때는 왼쪽 padding 추가 (모달 너비 500px + 여유 30px)
		const padding = {
			top: 100,
			bottom: 100,
			left: 530,
			right: 100,
		};

		fitMapToBounds(map.mapbox, [coord], { maxZoom: 13, padding });
	}, [selectedMarker, map]);

	// 지도 이동/줌 변경 시 상태 저장
	const onHandleMap = useCallback((event: { viewState: { latitude: number; longitude: number; zoom: number } }) => {
		const { latitude, longitude, zoom } = event.viewState;
		mapStateRef.current = {
			center: new globalThis.naver.maps.LatLng(latitude, longitude),
			zoom,
		};
	}, []);
	// 차량 선택 시 경로 폴리라인 전체가 보이도록 지도 포커스 (1순위: 계획경로, 2순위: 실제경로)
	useEffect(() => {
		if (!selectedVehicle || !map?.navermap || !map?.mapbox) return;

		// 1순위: 계획 경로, 2순위: 실제 경로
		const routeFeature = mergedPlanRouteFeature || mergedRouteFeature;
		if (!routeFeature) return;

		// 경로 폴리라인 좌표 수집
		const allCoordinates: [number, number][] = [];

		routeFeature.features.forEach((feature: any) => {
			if (feature?.geometry?.coordinates) {
				feature.geometry.coordinates.forEach((coord: [number, number]) => {
					allCoordinates.push(coord);
				});
			}
		});

		if (allCoordinates.length > 0) {
			// bounds 계산 (coord는 [lng, lat] 형식)
			const boundsCalc = allCoordinates.reduce(
				(acc, coord) => ({
					minLng: Math.min(acc.minLng, coord[0]),
					maxLng: Math.max(acc.maxLng, coord[0]),
					minLat: Math.min(acc.minLat, coord[1]),
					maxLat: Math.max(acc.maxLat, coord[1]),
				}),
				{ minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity },
			);

			// 여유 공간 확보를 위한 패딩 (경위도 기준 약 15% 확장)
			const latPadding = (boundsCalc.maxLat - boundsCalc.minLat) * 0.15;
			const lngPadding = (boundsCalc.maxLng - boundsCalc.minLng) * 0.15;
			// 오른쪽으로 치우치게 하기 위해 왼쪽에 더 큰 패딩 적용
			const lngPaddingLeft = lngPadding * 10;
			const lngPaddingRight = lngPadding * 1;

			// 네이버 지도 LatLngBounds 객체 생성 (패딩 적용)
			const bounds = new globalThis.naver.maps.LatLngBounds(
				new globalThis.naver.maps.LatLng(boundsCalc.minLat - latPadding, boundsCalc.minLng - lngPaddingLeft),
				new globalThis.naver.maps.LatLng(boundsCalc.maxLat + latPadding, boundsCalc.maxLng + lngPaddingRight),
			);

			if (map?.navermap) {
				map.navermap.fitBounds(bounds);
			}
		}
	}, [selectedVehicle, mergedPlanRouteFeature, mergedRouteFeature, map]);

	// 레이어 순서 제어: 실제 경로가 계획 경로 위에 오도록
	useEffect(() => {
		if (map?.mapbox && mergedRouteFeature && mergedPlanRouteFeature) {
			setTimeout(() => {
				// 실제 경로 레이어를 맨 위로 이동
				if (map.mapbox.getLayer('route-line-outline')) {
					map.mapbox.moveLayer('route-line-outline');
				}
				if (map.mapbox.getLayer('route-line')) {
					map.mapbox.moveLayer('route-line');
				}
			}, 100);
		}
	}, [map, mergedRouteFeature, mergedPlanRouteFeature, routeDisplayFilter]);

	const handleDetailClick = (customer: CustomerData) => {
		const params: TmPlanCustomerDetailPopupReqDto = {
			truthCustkey: customer.truthcustkey || '',
			deliveryDate: searchParams?.deliverydt ? dayjs(searchParams.deliverydt).format('YYYYMMDD') : '',
			dccode: selectedVehicle?.dccode || '',
			carno: selectedVehicle?.carno || '',
			tmDeliveryType: searchParams?.tmDeliverytype || '',
		};
		setModalApiParams(params);
		setIsDetailModalOpen(true);
	};

	const handleMapClick = useCallback(() => {
		// 마커 클릭 후 200ms 이내의 지도 클릭은 무시 (이벤트 버블링 방지)
		if (lastMarkerClickTime && Date.now() - lastMarkerClickTime < 200) return;
		if (Date.now() - lastMarkerClickRef.current < 200) return;
		setSelectedMarker(null);
		onOrderClick?.(undefined);
	}, [lastMarkerClickTime, onOrderClick]);

	return (
		<div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
			<Radio.Group
				onChange={handleRouteDisplayFilterChange}
				value={routeDisplayFilter}
				options={[
					{
						value: 'ALL',
						className: 'option-1',
						label: '전체',
					},
					{
						value: 'REAL',
						className: 'option-2',
						label: '실제경로만 보기',
					},
					{
						value: 'PLAN',
						className: 'option-3',
						label: '계획경로만 보기',
						disabled: isCarrier, // 수송일 때 비활성화 (계획경로 없음)
					},
				]}
			/>

			<WrapperDistrictBoundaries
				id={DEFINE_MAP_ID}
				showWeather={true}
				loadBoundaryDataOnLoad={false}
				center={mapStateRef.current?.center}
				zoom={mapStateRef.current?.zoom}
				onMove={onHandleMap}
				onZoom={onHandleMap}
				onClick={handleMapClick}
				onDblClick={() => {
					setSelectedMarker(null);
				}}
				deckLayers={layers}
				cursor={cursor}
				onHoverDeck={e => setCursor(e.picked ? 'pointer' : 'default')}
				interactiveLayerIds={['base-fill-layer', 'base-line-layer']}
				style={{ width: '100%', flex: 1, borderStyle: 'solid', borderWidth: 'thin' }}
			>
				{/* 계획 경로 표시 (routeDisplayFilter가 ALL 또는 PLAN일 때만) */}
				{mergedPlanRouteFeature && (routeDisplayFilter === 'ALL' || routeDisplayFilter === 'PLAN') && (
					<Source id="merged-plan-route-source" type="geojson" data={mergedPlanRouteFeature}>
						{/* 계획 경로 선 (외곽선) */}
						<Layer
							id="plan-route-line-outline"
							type="line"
							paint={{
								'line-color': '#FFFFFF',
								'line-width': 6,
								'line-opacity': 0.8,
							}}
						/>
						{/* 계획 경로 선 (메인) */}
						<Layer
							id="plan-route-line"
							type="line"
							paint={{
								'line-color': '#9E9E9E',
								'line-width': 4,
								'line-opacity': 1,
							}}
						/>
					</Source>
				)}

				{/* 실제 경로 표시 (routeDisplayFilter가 ALL 또는 REAL일 때만) */}
				{mergedRouteFeature && (routeDisplayFilter === 'ALL' || routeDisplayFilter === 'REAL') && (
					<Source id="merged-route-source" type="geojson" data={mergedRouteFeature}>
						{/* 경로 선 (외곽선) - 계획 경로보다 위에 */}
						<Layer
							id="route-line-outline"
							type="line"
							paint={{
								'line-color': '#FFFFFF',
								'line-width': 6,
								'line-opacity': 0.8,
							}}
						/>
						{/* 경로 선 (메인) - 계획 경로보다 위에 */}
						<Layer
							id="route-line"
							type="line"
							paint={{
								'line-color': '#4076FF',
								'line-width': 4,
								'line-opacity': 1,
							}}
						/>
					</Source>
				)}

				{/* 그룹화된 마커 표시 (TmPlan 방식) */}
				{Array.from(groupsMap.entries()).map(([key]) => (
					<Marker
						key={key}
						longitude={Number(key.split('__')[0])}
						latitude={Number(key.split('__')[1])}
						offset={[12, -20]}
						style={{ zIndex: 1 }}
						anchor={'bottom'}
					>
						<Icon icon="ic_multie_marker" />
					</Marker>
				))}

				{/* 선택된 마커 팝업 */}
				{selectedMarker && (
					<Marker
						longitude={selectedMarker.longitude}
						latitude={selectedMarker.latitude}
						offset={[0, -45]}
						style={{ zIndex: 10 }}
						anchor={'bottom'}
					>
						<TmLocationMonitorMapInfoPopup markerData={selectedMarker} onClickDetail={handleDetailClick} />
					</Marker>
				)}

				{/* 모든 차량 마커 표시 (차량 미선택 시) */}
				{!carLocationData &&
					allVehicleMarkers.map(vehicle => (
						<Marker
							key={`vehicle-${vehicle.carno}`}
							longitude={vehicle.longitude}
							latitude={vehicle.latitude}
							offset={[0, 0]}
							style={{ zIndex: 2 }}
							anchor={'center'}
							onClick={() => onVehicleSelect?.(vehicle)}
						>
							<VehicleMarkerIcon color={vehicle.color} />
						</Marker>
					))}

				{/* 선택된 차량 마커 표시 */}
				{carLocationData?.map(item => {
					const getMarkerColor = (deliveryStatus: string) => {
						if (deliveryStatus === '10') return '#FFA217';
						if (deliveryStatus === '20') return '#4076FF';
						return '#50545F';
					};
					const markerColor = getMarkerColor(item.deliveryStatus);

					return (
						<Marker
							key={`car-${item.carno}`}
							longitude={item.longitude}
							latitude={item.latitude}
							offset={[0, 0]}
							style={{ zIndex: 3 }}
							anchor={'center'}
							onClick={() => onVehicleSelect?.(item)}
						>
							<VehicleMarkerIcon color={markerColor} />
						</Marker>
					);
				})}
			</WrapperDistrictBoundaries>

			{/* 거래처 상세 모달 */}
			<CustomerDetailModal
				open={isDetailModalOpen}
				onClose={() => setIsDetailModalOpen(false)}
				apiParams={modalApiParams}
				isReadOnly={true}
			/>
		</div>
	);
};

// 차량 마커 아이콘 컴포넌트
const VehicleMarkerIcon = ({ color }: { color: string }) => {
	return (
		<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="0.75" y="0.75" width="34.5" height="34.5" rx="17.25" fill={color} />
			<rect x="0.75" y="0.75" width="34.5" height="34.5" rx="17.25" stroke="white" strokeWidth="1.5" />
			<path
				d="M10.3 18.3496V21.8496C10.3 22.0353 10.3738 22.2133 10.5051 22.3446C10.6363 22.4759 10.8144 22.5496 11 22.5496H11.7C11.7 23.1066 11.9213 23.6407 12.3151 24.0345C12.709 24.4284 13.2431 24.6496 13.8 24.6496C14.357 24.6496 14.8911 24.4284 15.285 24.0345C15.6788 23.6407 15.9 23.1066 15.9 22.5496H20.1C20.1 23.1066 20.3213 23.6407 20.7151 24.0345C21.109 24.4284 21.6431 24.6496 22.2 24.6496C22.757 24.6496 23.2911 24.4284 23.685 24.0345C24.0788 23.6407 24.3 23.1066 24.3 22.5496H25C25.1857 22.5496 25.3637 22.4759 25.495 22.3446C25.6263 22.2133 25.7 22.0353 25.7 21.8496V13.4496C25.7 12.8927 25.4788 12.3585 25.085 11.9647C24.6911 11.5709 24.157 11.3496 23.6 11.3496H17.3C16.7431 11.3496 16.209 11.5709 15.8151 11.9647C15.4213 12.3585 15.2 12.8927 15.2 13.4496V14.8496H13.8C13.474 14.8496 13.1525 14.9255 12.8609 15.0713C12.5693 15.2171 12.3157 15.4288 12.12 15.6896L10.44 17.9296C10.4196 17.96 10.4031 17.993 10.391 18.0276L10.349 18.1046C10.3182 18.1827 10.3016 18.2657 10.3 18.3496ZM21.5 22.5496C21.5 22.4112 21.5411 22.2758 21.618 22.1607C21.6949 22.0456 21.8043 21.9559 21.9322 21.9029C22.0601 21.8499 22.2008 21.8361 22.3366 21.8631C22.4724 21.8901 22.5971 21.9567 22.695 22.0546C22.7929 22.1525 22.8596 22.2773 22.8866 22.413C22.9136 22.5488 22.8997 22.6896 22.8468 22.8175C22.7938 22.9454 22.7041 23.0547 22.5889 23.1316C22.4738 23.2086 22.3385 23.2496 22.2 23.2496C22.0144 23.2496 21.8363 23.1759 21.7051 23.0446C21.5738 22.9133 21.5 22.7353 21.5 22.5496ZM16.6 13.4496C16.6 13.264 16.6738 13.0859 16.8051 12.9546C16.9363 12.8234 17.1144 12.7496 17.3 12.7496H23.6C23.7857 12.7496 23.9637 12.8234 24.095 12.9546C24.2263 13.0859 24.3 13.264 24.3 13.4496V21.1496H23.754C23.5572 20.9331 23.3173 20.76 23.0497 20.6416C22.7821 20.5232 22.4927 20.4621 22.2 20.4621C21.9074 20.4621 21.618 20.5232 21.3504 20.6416C21.0828 20.76 20.8429 20.9331 20.646 21.1496H16.6V13.4496ZM15.2 17.6496H12.4L13.24 16.5296C13.3053 16.4427 13.3898 16.3721 13.487 16.3235C13.5842 16.2749 13.6914 16.2496 13.8 16.2496H15.2V17.6496ZM13.1 22.5496C13.1 22.4112 13.1411 22.2758 13.218 22.1607C13.2949 22.0456 13.4043 21.9559 13.5322 21.9029C13.6601 21.8499 13.8008 21.8361 13.9366 21.8631C14.0724 21.8901 14.1971 21.9567 14.295 22.0546C14.3929 22.1525 14.4596 22.2773 14.4866 22.413C14.5136 22.5488 14.4997 22.6896 14.4468 22.8175C14.3938 22.9454 14.3041 23.0547 14.1889 23.1316C14.0738 23.2086 13.9385 23.2496 13.8 23.2496C13.6144 23.2496 13.4363 23.1759 13.3051 23.0446C13.1738 22.9133 13.1 22.7353 13.1 22.5496ZM11.7 19.0496H15.2V20.9956C14.7869 20.6264 14.2446 20.4354 13.6913 20.4643C13.138 20.4931 12.6185 20.7394 12.246 21.1496H11.7V19.0496Z"
				fill="white"
			/>
		</svg>
	);
};
