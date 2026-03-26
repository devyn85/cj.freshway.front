import { createContext, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { RooutyMapInstance } from '../hooks/useMap';
import { MountedMapsContext } from '../provider/RooutyMapProvider';
import type { MapProps } from '../types';
import { isNaverMapsGLLoaded, loadNaverMapsSDK } from '../utils/loadNaverMapsSDK';
import { setupMapEvents } from '../utils/mapEvents';
import { DeckAdaptor } from './adaptor/DeckAdaptor';

export const MapContext = createContext<RooutyMapInstance | null>(null);

export const RooutyMap = (props: MapProps) => {
	const {
		id,
		clientId,
		style,
		cursor,
		onLoad,
		onGlLoad,
		children,
		interactiveLayerIds,
		deckLayers,
		onHoverDeck,
		...mapOptions
	} = props;
	const mountedMapsContext = useContext(MountedMapsContext);
	const mapRef = useRef<HTMLDivElement>(null);
	const glRef = useRef(false);
	const contextCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const contextLostHandlerRef = useRef<((event: Event) => void) | null>(null);
	const contextRestoredHandlerRef = useRef<(() => void) | null>(null);
	const [libLoaded, setLibLoaded] = useState(false);
	const [mapLoaded, setMapLoaded] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [mapLifecycleKey, setMapLifecycleKey] = useState(0);
	const [isContextRecovering, setIsContextRecovering] = useState(false);

	const { current: contextValue } = useRef<RooutyMapInstance>({
		navermap: undefined,
		mapbox: undefined,
	});

	useIsomorphicLayoutEffect(() => {
		if (isNaverMapsGLLoaded()) {
			setLibLoaded(true);
			return;
		}

		if (!clientId) {
			if (isNaverMapsGLLoaded()) setLibLoaded(true);
			else setError(new Error('Naver Maps SDK is not loaded. Please provide clientId or load the SDK manually.'));
			return;
		}

		loadNaverMapsSDK({ clientId, submodules: ['gl'] })
			.then(() => setLibLoaded(true))
			.catch(error => setError(error));
	}, [clientId]);

	useEffect(() => {
		if (!libLoaded || !mapRef.current) return;

		const options: naver.maps.MapOptions = {
			gl: true,
			disableDoubleClickZoom: true,
			// 로고 제거 & 줌 컨트롤 배치처리
			logoControl: true,
			zoomControl: true,
			zoomControlOptions: {
				style: naver.maps.ZoomControlStyle.LARGE,
				position: naver.maps.Position.RIGHT_CENTER,
			},
			...mapOptions,
		};
		glRef.current = false;
		let isCleanedUp = false;
		const map = new naver.maps.Map(mapRef.current, options);
		contextValue.navermap = map;
		map.addListenerOnce('load', () => {
			contextValue.mapbox = map._mapbox;
			const mapbox = map._mapbox as any;
			const canvas = mapbox?.getCanvas?.() as HTMLCanvasElement | undefined;

			const handleContextLost = (event: Event) => {
				event.preventDefault();
				if (isCleanedUp) return;
				setIsContextRecovering(true);
			};
			const handleContextRestored = () => {
				if (isCleanedUp) return;
				setIsContextRecovering(false);
				setMapLifecycleKey(prev => prev + 1);
			};

			contextCanvasRef.current = canvas || null;
			contextLostHandlerRef.current = handleContextLost;
			contextRestoredHandlerRef.current = handleContextRestored;
			canvas?.addEventListener('webglcontextlost', handleContextLost, false);
			canvas?.addEventListener('webglcontextrestored', handleContextRestored, false);

			mountedMapsContext?.onMapMount({ navermap: map, mapbox: map._mapbox }, id);
			onLoad?.(map);
			setMapLoaded(true);
		});

		map.addListenerOnce('glReady', () => {
			onGlLoad?.();
			glRef.current = true;
		});

		map.addListenerOnce('init', () => {
			if (glRef.current === false) setError(new Error('에러'));
		});
		const resizeListener = naver.maps.Event.addListener(map, 'resize', () => map.zoomBy(0.00001));

		return () => {
			isCleanedUp = true;
			setMapLoaded(false);
			setIsContextRecovering(false);
			naver.maps.Event.removeListener(resizeListener);
			const mapbox = map._mapbox as any;
			if (mapbox) {
				try {
					if (contextCanvasRef.current && contextLostHandlerRef.current) {
						contextCanvasRef.current.removeEventListener('webglcontextlost', contextLostHandlerRef.current);
					}
					if (contextCanvasRef.current && contextRestoredHandlerRef.current) {
						contextCanvasRef.current.removeEventListener('webglcontextrestored', contextRestoredHandlerRef.current);
					}
					contextCanvasRef.current = null;
					contextLostHandlerRef.current = null;
					contextRestoredHandlerRef.current = null;

					const style = mapbox.style;
					if (style?.glyphManager?.entries) {
						for (const key of Object.keys(style.glyphManager.entries)) {
							delete style.glyphManager.entries[key];
						}
					}

					const painter = mapbox.painter;
					if (painter) {
						if (painter.glyphManager?.entries) {
							for (const key of Object.keys(painter.glyphManager.entries)) {
								delete painter.glyphManager.entries[key];
							}
						}

						painter.imageManager = null;
						painter.glyphManager = null;
						painter.lineAtlas = null;
						painter.style = null;

						if (painter._tileTextures) {
							for (const size of Object.keys(painter._tileTextures)) {
								const textures = painter._tileTextures[size];
								textures?.forEach((tex: any) => tex?.destroy?.());
							}
							painter._tileTextures = {};
						}

						if (painter.cache) {
							for (const key of Object.keys(painter.cache)) {
								painter.cache[key]?.destroy?.();
							}
							painter.cache = {};
						}
					}

					mapbox._controls?.forEach((control: any) => {
						try {
							mapbox.removeControl(control);
						} catch (e) {}
					});

					mapbox.remove();
				} catch (e) {}
			}

			try {
				map.destroy();
			} catch (e) {}

			(map as any)._mapbox = null;

			contextValue.mapbox = undefined;
			contextValue.navermap = undefined;
			mountedMapsContext?.onMapUnmount(id);
		};
	}, [libLoaded, mapLifecycleKey]);

	useEffect(() => {
		const mapbox = contextValue.mapbox;
		if (!mapbox || !mapLoaded) return;

		const getViewState = () => {
			const center = contextValue.navermap?.getCenter();
			return {
				latitude: center?.y || 0,
				longitude: center?.x || 0,
				zoom: contextValue.navermap?.getZoom() || 0,
				bearing: mapbox.getBearing?.() || 0,
				pitch: mapbox.getPitch?.() || 0,
			};
		};

		const createMouseEvent = (e: any) => {
			const features = interactiveLayerIds
				? mapbox.queryRenderedFeatures(e.point, {
						layers: interactiveLayerIds,
				  })
				: [];
			return { ...e, features };
		};

		return setupMapEvents(mapbox, props, getViewState, createMouseEvent);
	}, [mapLoaded, interactiveLayerIds, props]);

	useEffect(() => {
		const mapbox = contextValue.mapbox;
		if (!mapbox || !mapLoaded) return;

		const canvas = mapbox.getCanvas();
		if (cursor) {
			canvas.style.cursor = cursor;
		} else {
			canvas.style.cursor = '';
		}
	}, [mapLoaded, cursor]);

	useEffect(() => {
		const navermap = contextValue.navermap;
		if (!navermap || !mapLoaded || !mapRef.current) return;

		const resizeObserver = new ResizeObserver(() => {
			navermap.autoResize();
		});

		resizeObserver.observe(mapRef.current);

		return () => {
			resizeObserver.disconnect();
		};
	}, [mapLoaded]);

	if (!libLoaded) return <div>Loading Naver Maps...</div>;

	const devicePixelRatio = window?.devicePixelRatio || 1;

	return (
		<div ref={mapRef} style={style}>
			<MapContext.Provider value={contextValue}>
				{mapLoaded && !isContextRecovering && (
					<DeckAdaptor
						key={`deck-${mapLifecycleKey}`}
						mapbox={contextValue.mapbox}
						useDevicePixels={devicePixelRatio}
						layers={deckLayers}
						onHover={onHoverDeck}
					/>
				)}
				{mapLoaded && !isContextRecovering && children}
			</MapContext.Provider>

			{error && (
				<ErrorContainer>
					지도를 표시하려면 브라우저의 하드웨어 가속을 활성화해 주세요.
					<br /> (설정 → 시스템 → [가능한 경우 그래픽 가속 사용] 옵션 활성화)
				</ErrorContainer>
			)}
		</div>
	);
};

const ErrorContainer = styled.div`
	z-index: 1000;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	color: #fff;
	font-size: 20px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	line-height: 1.4;
`;
