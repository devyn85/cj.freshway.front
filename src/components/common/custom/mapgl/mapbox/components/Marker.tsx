import type { LngLat, MarkerOptions } from 'mapbox-gl';
import { Marker as MapboxMarker } from 'mapbox-gl';
import { Children, forwardRef, memo, useContext, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { applyReactStyle } from '../utils/applyReactStyle';
import { arePointsEqual } from '../utils/deepEqual';
import { MapContext } from './RooutyMap';

interface IMapEvent<SourceT, OriginalEventT = undefined> {
	type: string;
	target: SourceT;
	originalEvent: OriginalEventT;
}

export type MarkerEvent<OriginalEventT = undefined> = IMapEvent<MapboxMarker, OriginalEventT>;

export type MarkerDragEvent = MarkerEvent & {
	type: 'dragstart' | 'drag' | 'dragend';
	lngLat: LngLat;
};

export type MarkerProps = MarkerOptions & {
	longitude: number;
	latitude: number;
	style?: React.CSSProperties;
	onClick?: (e: MarkerEvent<MouseEvent>) => void;
	onDragStart?: (e: MarkerDragEvent) => void;
	onDrag?: (e: MarkerDragEvent) => void;
	onDragEnd?: (e: MarkerDragEvent) => void;
	children?: React.ReactNode;
};

export const Marker = memo(
	forwardRef((props: MarkerProps, ref: React.Ref<MapboxMarker>) => {
		const mapContext = useContext(MapContext);
		const map = mapContext?.mapbox;

		const thisRef = useRef({ props });

		const marker: MapboxMarker = useMemo(() => {
			let hasChildren = false;
			Children.forEach(props.children, el => {
				if (el) {
					hasChildren = true;
				}
			});
			const childContainer = document.createElement('div');
			childContainer.style.position = 'absolute';
			childContainer.style.top = '0';
			childContainer.style.left = '0';
			childContainer.style.willChange = 'transform';
			const options = {
				...props,
				element: hasChildren ? childContainer : null,
			};

			const mk = new MapboxMarker(options as any);
			mk.setLngLat([props.longitude, props.latitude]);

			mk.getElement().addEventListener('click', (e: MouseEvent) => {
				thisRef.current.props.onClick?.({
					type: 'click',
					target: mk,
					originalEvent: e,
				});
			});

			mk.on('dragstart', (e: MarkerDragEvent) => {
				e.lngLat = marker.getLngLat();
				thisRef.current.props.onDragStart?.(e);
			});
			mk.on('drag', (e: MarkerDragEvent) => {
				e.lngLat = marker.getLngLat();
				thisRef.current.props.onDrag?.(e);
			});
			mk.on('dragend', (e: MarkerDragEvent) => {
				e.lngLat = marker.getLngLat();
				thisRef.current.props.onDragEnd?.(e);
			});

			return mk;
		}, []);

		useEffect(() => {
			if (!map) return;
			marker.addTo(map);

			return () => {
				marker.remove();
			};
		}, []);

		const { longitude, latitude, offset, style, draggable = false } = props;

		useEffect(() => applyReactStyle(marker.getElement(), style), [style]);

		useImperativeHandle(ref, () => marker, []);

		if (marker.getLngLat().lng !== longitude || marker.getLngLat().lat !== latitude)
			marker.setLngLat([longitude, latitude]);
		if (offset && !arePointsEqual(marker.getOffset(), offset)) marker.setOffset(offset);
		if (marker.isDraggable() !== draggable) marker.setDraggable(draggable);
		thisRef.current.props = props;
		return createPortal(props.children, marker.getElement());
	}),
);
