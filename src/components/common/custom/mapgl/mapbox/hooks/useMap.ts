import { useMemo, useContext } from "react";

import { MapContext } from "../components/RooutyMap";
import { MountedMapsContext } from "../provider/RooutyMapProvider";
import { Map } from "mapbox-gl";

export type RooutyMapInstance = {
  navermap: naver.maps.Map | undefined;
  mapbox: Map | undefined;
};

export type MapCollection = {
  [id: string]: RooutyMapInstance | undefined;
  current?: RooutyMapInstance;
};

export function useRooutyMap(): MapCollection {
  const maps = useContext(MountedMapsContext)?.maps;
  const currentMap = useContext(MapContext);

  const mapsWithCurrent = useMemo(() => {
    return { ...maps, current: currentMap };
  }, [maps, currentMap]);

  return mapsWithCurrent as MapCollection;
}
