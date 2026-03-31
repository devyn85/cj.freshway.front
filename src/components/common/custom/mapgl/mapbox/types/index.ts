import { LayersList, PickingInfo } from '@deck.gl/core';
import type { Map, MapMouseEvent, MapTouchEvent, MapWheelEvent } from 'mapbox-gl';
import { CSSProperties, ReactNode } from 'react';

export type NaverMapInstance = naver.maps.Map | undefined;

export type MapEvent = MapMouseEvent & {
	features?: any[];
};

export type ViewStateChangeEvent = {
	viewState: {
		latitude: number;
		longitude: number;
		zoom: number;
		bearing?: number;
		pitch?: number;
	};
};

export interface MapProps extends naver.maps.MapOptions {
	id: string;
	clientId?: string;
	style?: CSSProperties;
	cursor?: string;
	onLoad?: (map: naver.maps.Map) => void;
	onGlLoad?: () => void;
	children?: ReactNode;

	interactiveLayerIds?: string[];

	deckLayers?: LayersList;
	onHoverDeck?: ((info: PickingInfo, event: any) => void) | null | undefined;

	onClick?: (event: MapEvent) => void;
	onDblClick?: (event: MapEvent) => void;
	onMouseDown?: (event: MapEvent) => void;
	onMouseUp?: (event: MapEvent) => void;
	onMouseMove?: (event: MapEvent) => void;
	onMouseEnter?: (event: MapEvent) => void;
	onMouseLeave?: (event: MapEvent) => void;
	onMouseOver?: (event: MapEvent) => void;
	onMouseOut?: (event: MapEvent) => void;
	onContextMenu?: (event: MapEvent) => void;

	onTouchStart?: (event: MapTouchEvent) => void;
	onTouchEnd?: (event: MapTouchEvent) => void;
	onTouchMove?: (event: MapTouchEvent) => void;
	onTouchCancel?: (event: MapTouchEvent) => void;

	onWheel?: (event: MapWheelEvent) => void;

	onMove?: (event: ViewStateChangeEvent) => void;
	onMoveStart?: (event: ViewStateChangeEvent) => void;
	onMoveEnd?: (event: ViewStateChangeEvent) => void;

	onZoom?: (event: ViewStateChangeEvent) => void;
	onZoomStart?: (event: ViewStateChangeEvent) => void;
	onZoomEnd?: (event: ViewStateChangeEvent) => void;

	onRotate?: (event: ViewStateChangeEvent) => void;
	onRotateStart?: (event: ViewStateChangeEvent) => void;
	onRotateEnd?: (event: ViewStateChangeEvent) => void;

	onPitch?: (event: ViewStateChangeEvent) => void;
	onPitchStart?: (event: ViewStateChangeEvent) => void;
	onPitchEnd?: (event: ViewStateChangeEvent) => void;

	onDrag?: (event: ViewStateChangeEvent) => void;
	onDragStart?: (event: ViewStateChangeEvent) => void;
	onDragEnd?: (event: ViewStateChangeEvent) => void;
}

export interface MapWithStyle extends Map {
	style?: any;
}
