import type { Map } from "mapbox-gl";
import { MapWithStyle } from "../types";

export const isLivingInstance = (map: Map) => {
  return (map as MapWithStyle).style && (map as MapWithStyle).style._loaded;
};

export const isLightLivingInstance = (map: Map) => {
  return (map as MapWithStyle).style;
};
