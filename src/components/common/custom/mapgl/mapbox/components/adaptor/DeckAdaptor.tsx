import { type DeckProps } from '@deck.gl/core';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { MapMouseEvent } from 'mapbox-gl';
import { useEffect, useRef } from 'react';

export const DeckAdaptor = ({ mapbox, ...props }: DeckProps & { mapbox: any }): any => {
	const overlayRef = useRef<MapboxOverlay | null>(null);
	const skipRef = useRef(false);

	const handleMoveStart = () => (skipRef.current = true);
	const handleMoveEnd = () => (skipRef.current = false);

	useEffect(() => {
		if (!mapbox) return;

		let internalOverlay = new MapboxOverlay({
			...props,
			interleaved: false,
		});
		const mapCanvas = mapbox.getCanvas()?.parentElement;

		// @ts-ignore
		const originalHandleMouseEvent = internalOverlay._handleMouseEvent;
		let skip = false;
		const db = new Map<string, number>();
		// @ts-ignore
		internalOverlay._handleMouseEvent = (event: MapMouseEvent) => {
			// @ts-expect-error unexpected type
			if (event.type === 'dragstart' || event.type === 'dragend') {
				skip = event.type === 'dragstart';
				return;
			}
			const now = performance.now();
			const isThrottled = db.get(event.type) && now - (db.get(event.type) as number) < 32;
			if (skip || skipRef.current || isThrottled) return;
			db.set(event.type, now);
			originalHandleMouseEvent(event);
		};
		mapbox.addControl(internalOverlay, 'bottom-right');
		const controller = mapbox._controlPositions['bottom-right'];
		mapCanvas?.appendChild(controller);
		overlayRef.current = internalOverlay;

		mapbox.on('movestart', handleMoveStart);
		mapbox.on('moveend', handleMoveEnd);

		return () => {
			mapbox.off('movestart', handleMoveStart);
			mapbox.off('moveend', handleMoveEnd);
			try {
				internalOverlay?.finalize();
			} catch (e) {}
			try {
				mapbox.removeControl(internalOverlay);
			} catch (e) {}
			internalOverlay = null;
			overlayRef.current = null;
			try {
				controller?.remove?.();
			} catch (e) {}
		};
	}, [mapbox]);

	useEffect(() => {
		if (overlayRef.current) {
			try {
				// @ts-ignore
				const { _map, _deck } = overlayRef.current;
				if (_map && _deck)
					_deck.setProps({
						...props,
					});
			} catch (e) {}
		}
	}, [props]);

	return null;
};
