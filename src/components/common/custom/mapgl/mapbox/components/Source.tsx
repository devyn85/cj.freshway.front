import type { AnySourceData, AnySourceImpl, GeoJSONSource, ImageSource, Map } from 'mapbox-gl';
import { Children, cloneElement, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { assert } from '../utils/assert';
import { deepEqual } from '../utils/deepEqual';
import { isLightLivingInstance, isLivingInstance } from '../utils/isLivingInstance';
import { MapContext } from './RooutyMap';

export type SourceProps = AnySourceData & {
	id?: string;
	children?: any;
};

let sourceCounter = 0;

const createSource = (map: Map, id: string, props: SourceProps) => {
	if (isLivingInstance(map)) {
		const options = { ...props };
		delete options.id;
		delete options.children;
		map.addSource(id, options);
		return map.getSource(id);
	}
	return null;
};

const updateSource = (source: AnySourceImpl, props: SourceProps, prevProps: SourceProps) => {
	assert(props.id === prevProps.id, 'source id changed');
	assert(props.type === prevProps.type, 'source type changed');

	let changedKey = '';
	let changedKeyCount = 0;

	for (const key in props) {
		if (
			key !== 'children' &&
			key !== 'id' &&
			!deepEqual(prevProps[key as keyof SourceProps], props[key as keyof SourceProps])
		) {
			changedKey = key;
			changedKeyCount++;
		}
	}

	if (!changedKeyCount) return;

	const type = props.type;

	if (type === 'geojson') (source as GeoJSONSource).setData(props.data as any);
	else if (type === 'image')
		(source as ImageSource).updateImage({
			url: props.url,
			coordinates: props.coordinates,
		});
	else if ('setCoordinates' in source && changedKeyCount === 1 && changedKey === 'coordinates')
		source.setCoordinates((props as any).coordinates);
	else if ('setUrl' in source && changedKey === 'url') source.setUrl((props as any).url);
	else if ('setTiles' in source && changedKey === 'tiles') source.setTiles((props as any).tiles);
	else console.warn(`Unable to update <Source> prop: ${changedKey}`);
};

export const Source = (props: SourceProps) => {
	const map = useContext(MapContext)?.mapbox;

	const propsRef = useRef(props);
	const [, setStyleLoaded] = useState(0);

	const id = useMemo(() => props.id || `jsx-source-${sourceCounter++}`, []);

	useEffect(() => {
		if (map) {
			const forceUpdate = () => setTimeout(() => setStyleLoaded(version => version + 1), 0);
			map.on('styledata', forceUpdate);
			forceUpdate();

			return () => {
				map.off('styledata', forceUpdate);
				if (isLivingInstance(map) && map.getSource(id)) {
					const allLayers = map.getStyle()?.layers;
					if (allLayers) {
						for (const layer of allLayers) {
							if ('source' in layer && layer.source === id) map.removeLayer(layer.id);
						}
					}
					map.removeSource(id);
				}
			};
		}
		return undefined;
	}, [map]);

	let source: AnySourceImpl | null = (map && isLightLivingInstance(map) && map.getSource(id)) || null;
	if (source) {
		updateSource(source, props, propsRef.current);
	} else if (map) {
		source = createSource(map, id, props);
	}
	propsRef.current = props;

	return (
		(source &&
			Children.map(
				props.children,
				child =>
					child &&
					cloneElement(child, {
						source: id,
					}),
			)) ||
		null
	);
};
