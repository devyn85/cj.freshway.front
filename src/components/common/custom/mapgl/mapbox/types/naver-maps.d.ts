declare namespace naver {
	namespace maps {
		interface MapOptions {
			center?: LatLng | LatLngLiteral;
			zoom?: number;
			mapTypeId?: string;
			minZoom?: number;
			maxZoom?: number;
			draggable?: boolean;
			scrollWheel?: boolean;
			keyboardShortcuts?: boolean;
			disableDoubleClickZoom?: boolean;
			disableDoubleTapZoom?: boolean;
			disableTwoFingerTapZoom?: boolean;
			logoControl?: boolean;
			mapDataControl?: boolean;
			scaleControl?: boolean;
			tileDuration?: number;
			[key: string]: any; // 추가 옵션들을 위한 인덱스 시그니처
		}

		interface LatLng {
			lat(): number;
			lng(): number;
			equals(other: LatLng): boolean;
			toString(): string;
		}

		interface LatLngLiteral {
			lat: number;
			lng: number;
		}

		interface Map {
			setCenter(center: LatLng | LatLngLiteral): void;
			getCenter(): LatLng;
			setZoom(zoom: number): void;
			getZoom(): number;
			fitBounds(bounds: LatLngBounds): void;
			panTo(position: LatLng | LatLngLiteral): void;
			destroy(): void;
			addListener(eventName: string, handler: Function): MapEventListener;
			[key: string]: any;
		}

		interface LatLngBounds {
			extend(point: LatLng | LatLngLiteral): LatLngBounds;
			getSouthWest(): LatLng;
			getNorthEast(): LatLng;
		}

		interface MapEventListener {
			remove(): void;
		}

		// 생성자 함수들
		function LatLng(lat: number, lng: number): LatLng;
		function LatLngBounds(sw: LatLng, ne: LatLng): LatLngBounds;

		class Map {
			constructor(element: HTMLElement | string, options?: MapOptions);
		}
	}
}

// 전역 window 객체에 naver 추가
interface Window {
	naver: typeof naver;
}
