import { StartPointMarker } from '@/hooks/tm/useLocationLayer';
import { DisplayMarker } from '@/hooks/tm/useLocationMarkers';
import { IconLayer } from '@deck.gl/layers';
import { useMemo, useState } from 'react';
import { useActivate } from 'react-activation';
import { MARKER_ATLAS_URL, atlasMapping, getPinIcon, toRenderItems } from './atlasConfig';

type MarkerData = {
	coordinates: [number, number];
	color: string;
	index: number;
	rawData: DisplayMarker;
};

type PlanStartMarkerData = {
	coordinates: [number, number];
	rawData: StartPointMarker;
};

interface UseLocationIconLayerProps {
	displayMarkers: DisplayMarker[];
	planStartPoints: StartPointMarker[];
	onMarkerClick?: (marker: DisplayMarker) => void;
}

export const useLocationIconLayer = ({ displayMarkers, planStartPoints, onMarkerClick }: UseLocationIconLayerProps) => {
	const [regenerateDeckLayer, setRegenerateDeckLayer] = useState(0);

	useActivate(() => {
		setRegenerateDeckLayer(prev => prev + 1);
	});

	// 마커 데이터 생성 (모든 마커 포함 - TmPlan 방식)
	const markerData = useMemo(() => {
		return displayMarkers.map(marker => ({
			coordinates: [marker.longitude, marker.latitude] as [number, number],
			color: marker.color,
			index: Number(marker.displaySeqNo) || 0,
			rawData: marker,
		}));
	}, [displayMarkers]);

	// 계획 경로 시작점 데이터 생성
	const planStartData = useMemo(() => {
		return planStartPoints.map(point => ({
			coordinates: [point.longitude, point.latitude] as [number, number],
			rawData: point,
		}));
	}, [planStartPoints]);

	// 레이어 생성
	const layers = useMemo(() => {
		// 핀 아이콘 키 (fallback 포함)
		const getPinIconWithFallback = (color: string, index: number): string => {
			const key = getPinIcon(color, index);
			return key in atlasMapping ? key : getPinIcon('#6c5ce7', index);
		};

		// 마커 레이어 (핀+숫자 인터리브)
		const markerLayer = new IconLayer({
			id: 'location-marker',
			data: toRenderItems(markerData, getPinIconWithFallback),
			iconAtlas: MARKER_ATLAS_URL,
			iconMapping: atlasMapping,
			getIcon: (d: any) => d._icon,
			getPosition: (d: any) => d.coordinates,
			getSize: 34,
			opacity: 1,
			pickable: true,
			alphaCutoff: 0.6,
			onClick: (info: any) => {
				const markerData = info?.object;
				if (!markerData) return;
				onMarkerClick?.(markerData.rawData);
			},
			updateTriggers: {
				getIcon: [markerData, regenerateDeckLayer],
				getPosition: [markerData, regenerateDeckLayer],
			},
		});

		// 계획 경로 시작점 레이어
		const planStartLayer = new IconLayer<PlanStartMarkerData>({
			id: 'location-planStartLayer',
			data: planStartData,
			getIcon: () => ({
				url: `/img/icon/marker_start.png`,
				width: 123,
				height: 150,
				anchorX: 61,
				anchorY: 148,
			}),
			getPosition: d => d.coordinates,
			getSize: 34,
			opacity: 1,
			pickable: false,
			alphaCutoff: 0.6,
			loadOptions: {
				imagebitmap: {
					resizeQuality: 'high',
				},
			},
			updateTriggers: {
				getIcon: [planStartData, regenerateDeckLayer],
				getPosition: [planStartData, regenerateDeckLayer],
			},
		});

		// 레이어 순서: 핀 베이스 -> 숫자 -> 계획 시작점
		return [markerLayer, planStartLayer];
	}, [markerData, planStartData, regenerateDeckLayer, onMarkerClick]);

	return { layers };
};
