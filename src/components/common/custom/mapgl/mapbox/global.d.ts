/// <reference types="@types/navermaps" />

declare namespace naver.maps {
  interface Map {
    _mapbox?: import("mapbox-gl").Map;
    isGLReady(): boolean;
  }
}
