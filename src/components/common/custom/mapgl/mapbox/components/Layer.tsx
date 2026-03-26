import { AnyLayer, CustomLayerInterface, Map } from "mapbox-gl";
import { useEffect, useMemo, useState, useRef, useContext } from "react";
import { assert } from "../utils/assert";
import { deepEqual } from "../utils/deepEqual";
import { MapContext } from "./RooutyMap";
import {
  isLightLivingInstance,
  isLivingInstance,
} from "../utils/isLivingInstance";

type OptionalId<T> = T extends { id: string }
  ? Omit<T, "id"> & { id?: string }
  : T;
type OptionalSource<T> = T extends { source: string }
  ? Omit<T, "source"> & { source?: string }
  : T;

export type LayerProps = (
  | OptionalSource<OptionalId<AnyLayer>>
  | CustomLayerInterface
) & {
  beforeId?: string;
};

const updateLayer = (
  map: Map,
  id: string,
  props: LayerProps,
  prevProps: LayerProps
) => {
  assert(props.id === prevProps.id, "layer id changed");
  assert(props.type === prevProps.type, "layer type changed");

  if (props.type === "custom" || prevProps.type === "custom") return;

  const { layout = {}, paint = {}, filter, minzoom, maxzoom, beforeId } = props;

  if (beforeId !== prevProps.beforeId) map.moveLayer(id, beforeId);
  if (layout !== prevProps.layout) {
    const prevLayout = prevProps.layout || {};
    for (const key in layout) {
      if (!deepEqual((layout as any)[key], (prevLayout as any)[key]))
        map.setLayoutProperty(id, key as any, (layout as any)[key]);
    }
    for (const key in prevLayout) {
      if (!layout.hasOwnProperty(key))
        map.setLayoutProperty(id, key as any, undefined);
    }
  }
  if (paint !== prevProps.paint) {
    const prevPaint = prevProps.paint || {};
    for (const key in paint) {
      if (!deepEqual((paint as any)[key], (prevPaint as any)[key]))
        map.setPaintProperty(id, key as any, (paint as any)[key]);
    }
    for (const key in prevPaint) {
      if (!paint.hasOwnProperty(key))
        map.setPaintProperty(id, key as any, undefined);
    }
  }

  if (!deepEqual(filter, prevProps.filter)) map.setFilter(id, filter);
  if (minzoom !== prevProps.minzoom || maxzoom !== prevProps.maxzoom)
    map.setLayerZoomRange(id, minzoom as any, maxzoom as any);
};

const createLayer = (map: Map, id: string, props: LayerProps) => {
  if (
    map &&
    isLivingInstance(map) &&
    (!("source" in props) || map.getSource(props.source as string))
  ) {
    const options: LayerProps = { ...props, id };
    delete options.beforeId;

    map.addLayer(options as AnyLayer, props.beforeId);
  }
};

let layerCounter = 0;

export const Layer = (props: LayerProps) => {
  const map = useContext(MapContext)?.mapbox;

  const propsRef = useRef(props);
  const [, setStyleLoaded] = useState(0);

  const id = useMemo(() => props.id || `jsx-layer-${layerCounter++}`, []);

  useEffect(() => {
    if (map) {
      const forceUpdate = () => setStyleLoaded((version) => version + 1);
      map.on("styledata", forceUpdate);
      forceUpdate();

      return () => {
        map.off("styledata", forceUpdate);
        if (map && isLivingInstance(map) && map.getLayer(id))
          map.removeLayer(id);
      };
    }
    return undefined;
  }, [map]);

  const layer = map && isLightLivingInstance(map) && map.getLayer(id);
  if (layer) {
    try {
      updateLayer(map, id, props, propsRef.current);
    } catch (error) {
      //console.warn(error);
    }
  } else if (map) {
    createLayer(map, id, props);
  }

  propsRef.current = props;

  return null;
};
