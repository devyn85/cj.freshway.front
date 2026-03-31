import type { Map } from "mapbox-gl";
import type { MapProps } from "../types";

type EventHandler = (e: any) => void;

const MOUSE_EVENTS = [
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "mouseover",
  "mouseout",
  "contextmenu",
] as const;

const TOUCH_EVENTS = [
  "touchstart",
  "touchend",
  "touchmove",
  "touchcancel",
] as const;

const WHEEL_EVENTS = ["wheel"] as const;

const VIEW_STATE_EVENTS = [
  "move",
  "movestart",
  "moveend",
  "zoom",
  "zoomstart",
  "zoomend",
  "rotate",
  "rotatestart",
  "rotateend",
  "pitch",
  "pitchstart",
  "pitchend",
  "drag",
  "dragstart",
  "dragend",
] as const;

type EventName =
  | (typeof MOUSE_EVENTS)[number]
  | (typeof TOUCH_EVENTS)[number]
  | (typeof WHEEL_EVENTS)[number]
  | (typeof VIEW_STATE_EVENTS)[number];

const eventPropMap: Record<EventName, keyof MapProps> = {
  click: "onClick",
  dblclick: "onDblClick",
  mousedown: "onMouseDown",
  mouseup: "onMouseUp",
  mousemove: "onMouseMove",
  mouseenter: "onMouseEnter",
  mouseleave: "onMouseLeave",
  mouseover: "onMouseOver",
  mouseout: "onMouseOut",
  contextmenu: "onContextMenu",
  touchstart: "onTouchStart",
  touchend: "onTouchEnd",
  touchmove: "onTouchMove",
  touchcancel: "onTouchCancel",
  wheel: "onWheel",
  move: "onMove",
  movestart: "onMoveStart",
  moveend: "onMoveEnd",
  zoom: "onZoom",
  zoomstart: "onZoomStart",
  zoomend: "onZoomEnd",
  rotate: "onRotate",
  rotatestart: "onRotateStart",
  rotateend: "onRotateEnd",
  pitch: "onPitch",
  pitchstart: "onPitchStart",
  pitchend: "onPitchEnd",
  drag: "onDrag",
  dragstart: "onDragStart",
  dragend: "onDragEnd",
};

export const setupMapEvents = (
  mapbox: Map,
  props: MapProps,
  getViewState: () => any,
  createMouseEvent: (e: any) => any
): (() => void) => {
  const handlers: Array<[EventName, EventHandler]> = [];

  for (const eventName of MOUSE_EVENTS) {
    const propName = eventPropMap[eventName];
    const handler = props[propName as keyof MapProps];
    if (handler && typeof handler === "function") {
      const wrappedHandler = (e: any) =>
        (handler as any)(createMouseEvent(e));
      mapbox.on(eventName, wrappedHandler);
      handlers.push([eventName, wrappedHandler]);
    }
  }

  for (const eventName of TOUCH_EVENTS) {
    const propName = eventPropMap[eventName];
    const handler = props[propName as keyof MapProps];
    if (handler && typeof handler === "function") {
      mapbox.on(eventName, handler as any);
      handlers.push([eventName, handler as any]);
    }
  }

  for (const eventName of WHEEL_EVENTS) {
    const propName = eventPropMap[eventName];
    const handler = props[propName as keyof MapProps];
    if (handler && typeof handler === "function") {
      mapbox.on(eventName, handler as any);
      handlers.push([eventName, handler as any]);
    }
  }

  for (const eventName of VIEW_STATE_EVENTS) {
    const propName = eventPropMap[eventName];
    const handler = props[propName as keyof MapProps];
    if (handler && typeof handler === "function") {
      const wrappedHandler = () =>
        (handler as any)({ viewState: getViewState() });
      mapbox.on(eventName, wrappedHandler);
      handlers.push([eventName, wrappedHandler]);
    }
  }

  return () => {
    handlers.forEach(([event, handler]) => {
      mapbox.off(event as any, handler);
    });
  };
};
