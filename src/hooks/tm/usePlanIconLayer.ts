import { TmEngineStepDto, TmUnassignedOrderDto, TmVehiclesDto } from '@/api/tm/apiTmDispatch';
import { useRooutyMap } from '@/components/common/custom/mapgl/mapbox';
import { colorById } from '@/components/tm/TmPlan/Timeline/hooks/useTimelineData';

import { polylineDecode } from '@/util/polylineDecode';
import { IconLayer, PathLayer } from '@deck.gl/layers';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useActivate } from 'react-activation';
import { MARKER_ATLAS_URL, atlasMapping, toRenderItems } from './atlasConfig';

const UNASSIGNED_COLOR = '#9E9E9E';

// hex 색상을 RGBA 배열로 변환
const hexToRgba = (hex: string, alpha: number = 255): [number, number, number, number] => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (!result) return [128, 128, 128, alpha];
	return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), alpha];
};

type MarkerData = {
	index: number;
	coordinates: [number, number];
	rawData: TmEngineStepDto;
	color: string;
	vehicleId: string;
	_type: string;
	iconKey: string;
};

const createMarkerData = (index: number, step: TmEngineStepDto, vehicleId: string, color: string): MarkerData => {
	// iconKey 결정: start/end는 별도 레이어, unassigned는 미배차 마커, delivery는 색상+인덱스
	const iconKey =
		step.type === 'start' || step.type === 'end'
			? step.type
			: step.type === 'unassigned' || index <= 0
			? 'unassigned-0'
			: `${color}-${index}`;

	return {
		index,
		coordinates: [step.location[0], step.location[1]],
		rawData: step,
		color,
		vehicleId,
		_type: index !== -1 ? step.type : 'unassigned',
		iconKey,
	};
};

const createPathFeature = (
	coordinates: [number, number][],
	vehicleColor: string,
	isOutline: boolean,
	opacity: number = 1,
) => {
	return {
		type: 'Feature' as const,
		geometry: {
			type: 'LineString' as const,
			coordinates,
		},
		properties: {
			color: isOutline ? '#FFFFFF' : vehicleColor,
			width: isOutline ? 7 : 5,
			opacity,
		},
	};
};

const lngLatFilter = (x: number, y: number): [number, number] => {
	return x > y ? [x, y] : [y, x];
};

// 두 좌표 간 거리의 제곱 계산
const getDistanceSq = (a: [number, number], b: [number, number]): number => {
	const dx = a[0] - b[0];
	const dy = a[1] - b[1];
	return dx * dx + dy * dy;
};

// location 좌표와 가장 가까운 좌표(A)를 찾아 A → location → A 순서로 삽입
const insertLocationIntoPolyline = (locations: [number, number][], location: [number, number]): void => {
	if (locations.length === 0) {
		locations.push(location);
		return;
	}

	let minDistance = Infinity;
	let closestIndex = 0;

	// 가장 가까운 좌표의 인덱스 찾기
	for (let i = 0; i < locations.length; i++) {
		const distance = getDistanceSq(locations[i], location);
		if (distance < minDistance) {
			minDistance = distance;
			closestIndex = i;
		}
	}

	// 이미 같은 좌표면 삽입하지 않음
	const closest = locations[closestIndex];
	if (closest[0] === location[0] && closest[1] === location[1]) {
		return;
	}

	// A → location → A 순서로 삽입 (폴리라인이 location까지 갔다가 다시 돌아옴)
	locations.splice(closestIndex + 1, 0, location, closest);
};

const decodeGeometry = (geometry: string): [number, number][] | null => {
	if (!geometry || typeof geometry !== 'string' || geometry.trim().length === 0) return null;
	try {
		const decodedPath = polylineDecode(geometry);
		if (decodedPath.length > 1) return decodedPath.map(([lat, lng]) => lngLatFilter(lng, lat));
	} catch (error) {}
	return null;
};

export const usePlanIconLayer = ({
	mapId,
	vehicles,
	vehiclesFrozen,
	selectedVehicleId,
	setSelectedVehicleId,
	selectedOrderId,
	setSelectedOrderId,
	unassignedOrders,
	returnOrders,
}: {
	mapId: string;
	vehicles: TmVehiclesDto[];
	vehiclesFrozen: TmVehiclesDto[];
	selectedVehicleId?: string;
	setSelectedVehicleId?: Dispatch<SetStateAction<string>>;
	selectedOrderId?: string;
	setSelectedOrderId?: Dispatch<SetStateAction<string>>;
	unassignedOrders?: TmUnassignedOrderDto[];
	returnOrders?: TmUnassignedOrderDto[];
}) => {
	const { [mapId]: map } = useRooutyMap();
	const [regenerateDeckLayer, setRegenerateDeckLayer] = useState(0);

	useActivate(() => {
		setRegenerateDeckLayer(prev => prev + 1);
	});

	// vehicles 변경 시 레이어 강제 재생성
	useEffect(() => {
		setRegenerateDeckLayer(prev => prev + 1);
	}, [vehicles]);

	// 선택된 차량의 좌표에 맞춰 fitBounds
	useEffect(() => {
		if (!map?.mapbox || !selectedVehicleId) return;

		const selectedVehicle = vehicles.find(v => String(v.uniqueId) === String(selectedVehicleId));
		if (!selectedVehicle) return;

		const coordinates: [number, number][] = [];

		selectedVehicle.steps?.forEach(step => {
			const coord = extractValidCoordinate(step?.location);
			if (coord) coordinates.push(coord);
		});

		selectedVehicle.steps?.forEach((step: any) => {
			const decodedCoords = decodeGeometry(step.geometry);
			if (decodedCoords) {
				coordinates.push(...decodedCoords);
			}
		});

		fitMapToBounds(map.mapbox, coordinates, {
			padding: { left: 150, right: 40, top: 150, bottom: 150 },
			duration: 800,
		});
	}, [map, selectedVehicleId, vehicles]);

	// 마커 데이터 생성
	const data = useMemo(() => {
		const jobs: MarkerData[] = [];

		vehicles.forEach(v => {
			const vehicleColor = colorById(v.uniqueId);

			v.steps?.forEach(step => {
				// location이 없거나 유효하지 않으면 스킵
				if (!step?.location || !Array.isArray(step.location) || step.location.length < 2) {
					return;
				}
				// location이 [0, 0]인 경우도 스킵 (유효하지 않은 좌표)
				if (step.location[0] === 0 && step.location[1] === 0) {
					return;
				}
				if (step.type === 'job') {
					jobs.push(createMarkerData(Number(step._stepIndex), step, v.uniqueId, vehicleColor));
				} else if (step.type === 'start' || step.type === 'end') {
					jobs.push(createMarkerData(0, step, v.uniqueId, 'start_end'));
				}
			});
		});

		// 미배차 주문 마커 추가
		if (unassignedOrders && unassignedOrders.length > 0) {
			unassignedOrders.forEach(step => {
				if (!step?.location) return;

				const unassignedStep: TmEngineStepDto = {
					...step,
					type: 'unassigned',
				};

				jobs.push({
					index: 0,
					coordinates: [step.location[0], step.location[1]],
					rawData: unassignedStep,
					color: UNASSIGNED_COLOR,
					vehicleId: 'unassigned',
					_type: 'unassigned',
					iconKey: 'unassigned-0',
				});
			});
		}

		// 반품 주문 마커 추가 (미배차와 동일한 로직)
		if (returnOrders && returnOrders.length > 0) {
			returnOrders.forEach(step => {
				if (!step?.location) return;

				const returnStep: TmEngineStepDto = {
					...step,
					type: 'unassigned',
				};

				jobs.push({
					index: 0,
					coordinates: [step.location[0], step.location[1]],
					rawData: returnStep,
					color: UNASSIGNED_COLOR,
					vehicleId: 'unassigned',
					_type: 'unassigned',
					iconKey: 'unassigned-0',
				});
			});
		}

		return jobs;
	}, [vehicles, unassignedOrders, returnOrders]);

	// 같은 좌표에 2개 이상 주문이 있는 좌표 Set (그룹 마커용)
	const groupedCoords = useMemo(() => {
		const coordCount = new Map<string, number>();
		data.forEach(d => {
			if (d._type !== 'job') return;
			const key = `${d.coordinates[0]}__${d.coordinates[1]}`;
			coordCount.set(key, (coordCount.get(key) || 0) + 1);
		});
		const set = new Set<string>();
		coordCount.forEach((count, key) => {
			if (count >= 2) set.add(key);
		});
		return set;
	}, [data]);

	// GeoJSON 형태로 경로 데이터를 생성
	const pathGeoJSON = useMemo(() => {
		const features: any[] = [];

		const sortedVehicles = [...vehiclesFrozen].sort((a, b) => {
			if (!selectedVehicleId) return 0;
			const aIsSelected = String(a.uniqueId) === String(selectedVehicleId);
			const bIsSelected = String(b.uniqueId) === String(selectedVehicleId);
			if (aIsSelected && !bIsSelected) return 1;
			if (!aIsSelected && bIsSelected) return -1;
			return 0;
		});

		sortedVehicles.forEach(v => {
			const vehicleColor = colorById(v.uniqueId);
			const isSelected = !selectedVehicleId || String(v.uniqueId) === String(selectedVehicleId);
			const opacity = isSelected ? 1 : 0.1;

			const locations: [number, number][] = [];

			// 1. 모든 geometry 좌표를 먼저 수집
			v.steps?.forEach((step: any) => {
				const coordinates = decodeGeometry(step.geometry);
				if (coordinates) {
					locations.push(...coordinates);
				}
			});

			// 2. 각 step의 location을 가장 가까운 좌표 뒤에 삽입
			v.steps?.forEach((step: any) => {
				const location = step.location;
				if (location && locations.length > 0) {
					const coord: [number, number] = [location[0], location[1]];
					insertLocationIntoPolyline(locations, coord);
				}
			});

			if (locations.length > 1) {
				features.push(createPathFeature(locations, vehicleColor, true, opacity));
				features.push(createPathFeature(locations, vehicleColor, false, opacity));
			}
		});

		return {
			type: 'FeatureCollection' as const,
			features,
		};
	}, [vehiclesFrozen, selectedVehicleId]);

	// 선택된 차량의 폴리라인 데이터 (deck.gl PathLayer용 - 마커 위에 렌더링)
	const selectedVehiclePathData = useMemo(() => {
		if (!selectedVehicleId) return null;

		const selectedVehicle = vehiclesFrozen.find(v => String(v.uniqueId) === String(selectedVehicleId));
		if (!selectedVehicle) return null;

		const locations: [number, number][] = [];

		selectedVehicle.steps?.forEach((step: any) => {
			const coordinates = decodeGeometry(step.geometry);
			if (coordinates) {
				locations.push(...coordinates);
			}
		});

		selectedVehicle.steps?.forEach((step: any) => {
			const location = step.location;
			if (location && locations.length > 0) {
				const coord: [number, number] = [location[0], location[1]];
				insertLocationIntoPolyline(locations, coord);
			}
		});

		if (locations.length <= 1) return null;

		return {
			path: locations,
			color: colorById(selectedVehicle.uniqueId),
		};
	}, [vehiclesFrozen, selectedVehicleId]);

	// 레이어 생성
	const layers = useMemo(() => {
		// 선택 여부에 따라 데이터 분리
		const getFilteredData = (isSelectedLayer: boolean) => {
			return data.filter(d => {
				const isPickupOrDelivery = d._type === 'job';
				const isUnassigned = d._type === 'unassigned';
				const isAssignedToVehicle = d.vehicleId !== 'unassigned';

				if (!isPickupOrDelivery && !isUnassigned) return false;

				// 진짜 미배차 주문 (차량에 할당되지 않은 경우만)
				if (isUnassigned && !isAssignedToVehicle) {
					const isSelectedOrder = selectedOrderId ? String(d.rawData.uniqueId) === String(selectedOrderId) : false;
					return isSelectedOrder && isSelectedLayer;
				}

				// delivery 또는 차량에 할당된 주문 (모양만 미배차인 경우 포함)
				if (!selectedVehicleId) return isSelectedLayer;

				const isSelectedVehicle = String(d.vehicleId) === String(selectedVehicleId);
				const isSelectedOrder = selectedOrderId ? String(d.rawData.uniqueId) === String(selectedOrderId) : false;
				const shouldBeInSelectedLayer = isSelectedVehicle || isSelectedOrder;

				return isSelectedLayer ? shouldBeInSelectedLayer : !shouldBeInSelectedLayer;
			});
		};

		// 선택된 orderId 마커만 반환 (맨 위에 추가로 그리기 위함)
		const getSelectedOrderData = () => {
			if (!selectedOrderId) return [];
			return data.filter(d => {
				const isPickupOrDelivery = d._type === 'job';
				const isUnassigned = d._type === 'unassigned';
				if (!isPickupOrDelivery && !isUnassigned) return false;
				return String(d.rawData.uniqueId) === String(selectedOrderId);
			});
		};

		const getStartEndFilteredData = (isSelectedLayer: boolean) => {
			return data.filter(d => {
				const isStartOrEnd = d._type === 'start';
				if (!isStartOrEnd) return false;

				if (!selectedVehicleId) return isSelectedLayer;
				const isSelected = String(d.vehicleId) === String(selectedVehicleId);
				return isSelectedLayer ? isSelected : !isSelected;
			});
		};

		const handleMarkerClick = (info: any) => {
			const markerData = info?.object;
			if (!markerData) return;
			const id = markerData.rawData.uniqueId;
			if (markerData.vehicleId !== selectedVehicleId) {
				setSelectedVehicleId?.(undefined);
			}
			setSelectedOrderId?.(selectedOrderId === id ? undefined : id);
		};

		const unselectedData = getFilteredData(false);
		const selectedData = getFilteredData(true);
		const selectedOrderData = getSelectedOrderData();

		const hasGroup = (d: MarkerData) => {
			if (d._type !== 'job') return false;
			return groupedCoords.has(`${d.coordinates[0]}__${d.coordinates[1]}`);
		};

		// 비선택 마커 레이어 (핀+숫자+그룹마크 인터리브, 투명)
		const layerUnselected = new IconLayer({
			id: 'layer-unselected',
			data: toRenderItems(unselectedData, undefined, hasGroup),
			iconAtlas: MARKER_ATLAS_URL,
			iconMapping: atlasMapping,
			getIcon: (d: any) => d._icon,
			getPosition: (d: any) => d.coordinates,
			getSize: 34,
			opacity: 0.01,
			pickable: true,
			alphaCutoff: 0.01,
			onClick: handleMarkerClick,
			updateTriggers: {
				getIcon: [data, regenerateDeckLayer],
				getPosition: [data, regenerateDeckLayer],
			},
		});

		// 선택된 마커 레이어 (핀+숫자+그룹마크 인터리브)
		const layerSelected = new IconLayer({
			id: 'layer-selected',
			data: toRenderItems(selectedData, undefined, hasGroup),
			iconAtlas: MARKER_ATLAS_URL,
			iconMapping: atlasMapping,
			getIcon: (d: any) => d._icon,
			getPosition: (d: any) => d.coordinates,
			getSize: 34,
			opacity: 1,
			pickable: true,
			alphaCutoff: 0.6,
			onClick: handleMarkerClick,
			updateTriggers: {
				getIcon: [data, regenerateDeckLayer],
				getPosition: [data, regenerateDeckLayer],
			},
		});

		// 선택된 start/end 레이어
		const startLayer = new IconLayer<MarkerData>({
			id: 'startLayer',
			data: getStartEndFilteredData(true),
			getIcon: () => ({ url: `/img/icon/marker_start.png`, width: 123, height: 150, anchorX: 61, anchorY: 148 }),
			getPosition: d => d.coordinates,
			getSize: 34,
			opacity: 1,
			pickable: true,
			alphaCutoff: 0.6,
			loadOptions: {
				imagebitmap: {
					resizeQuality: 'high',
				},
			},
			updateTriggers: {
				getIcon: [data, regenerateDeckLayer],
				getPosition: [data, regenerateDeckLayer],
			},
		});

		// 선택된 주문 마커 레이어 (가장 위에 렌더링)
		const layerSelectedOrder = new IconLayer({
			id: 'layer-selectedOrder',
			data: toRenderItems(selectedOrderData, undefined, hasGroup),
			iconAtlas: MARKER_ATLAS_URL,
			iconMapping: atlasMapping,
			getIcon: (d: any) => d._icon,
			getPosition: (d: any) => d.coordinates,
			getSize: 34,
			opacity: 1,
			pickable: true,
			alphaCutoff: 0.6,
			onClick: handleMarkerClick,
			updateTriggers: {
				getIcon: [data, regenerateDeckLayer, selectedOrderId],
				getPosition: [data, regenerateDeckLayer, selectedOrderId],
			},
		});

		// 선택된 차량 폴리라인 레이어 (마커 위에 렌더링되어 가려지지 않음)
		const selectedPathLayers: any[] = [];
		if (selectedVehiclePathData) {
			// outline (흰색 테두리)
			selectedPathLayers.push(
				new PathLayer({
					id: 'selected-vehicle-path-outline',
					data: [selectedVehiclePathData],
					getPath: d => d.path,
					getColor: [255, 255, 255, 255],
					getWidth: 7,
					widthMinPixels: 4,
					widthUnits: 'pixels',
					capRounded: true,
					jointRounded: true,
				}),
			);
			// 실제 라인
			selectedPathLayers.push(
				new PathLayer({
					id: 'selected-vehicle-path',
					data: [selectedVehiclePathData],
					getPath: d => d.path,
					getColor: hexToRgba(selectedVehiclePathData.color),
					getWidth: 5,
					widthMinPixels: 2,
					widthUnits: 'pixels',
					capRounded: true,
					jointRounded: true,
				}),
			);
		}

		// 레이어 순서: 비선택마커 -> 선택폴리라인 -> 선택마커 -> 시작마커 -> 선택주문마커
		// (선택 폴리라인이 비선택 마커 위, 선택 마커 아래에 위치)
		return [layerUnselected, ...selectedPathLayers, layerSelected, startLayer, layerSelectedOrder];
	}, [data, selectedOrderId, regenerateDeckLayer, setSelectedOrderId, selectedVehicleId, setSelectedVehicleId, selectedVehiclePathData, groupedCoords]);

	return { layers, pathGeoJSON };
};
