/**
 * 좌표 유효성 검증 함수
 * @param lng
 * @param lat
 */
export const isValidCoordinate = (lng: number, lat: number): boolean =>
	typeof lng === 'number' &&
	typeof lat === 'number' &&
	!isNaN(lng) &&
	!isNaN(lat) &&
	isFinite(lng) &&
	isFinite(lat) &&
	lng >= -180 &&
	lng <= 180 &&
	lat >= -90 &&
	lat <= 90;

/**
 * 좌표 배열에서 유효한 좌표만 필터링
 * @param coordinates
 */
export const filterValidCoordinates = (coordinates: [number, number][]): [number, number][] =>
	coordinates.filter(coord => coord && coord.length >= 2 && isValidCoordinate(coord[0], coord[1]));

/**
 * 좌표 배열로부터 바운딩 박스 계산
 * @param coordinates
 */
export const calculateBounds = (
	coordinates: [number, number][],
): { minLng: number; maxLng: number; minLat: number; maxLat: number } | null => {
	const validCoords = filterValidCoordinates(coordinates);
	if (validCoords.length === 0) return null;

	const lngs = validCoords.map(coord => coord[0]);
	const lats = validCoords.map(coord => coord[1]);

	const minLng = Math.min(...lngs);
	const maxLng = Math.max(...lngs);
	const minLat = Math.min(...lats);
	const maxLat = Math.max(...lats);

	if (!isValidCoordinate(minLng, minLat) || !isValidCoordinate(maxLng, maxLat)) {
		return null;
	}

	return { minLng, maxLng, minLat, maxLat };
};

export interface FitBoundsPadding {
	top: number;
	bottom: number;
	left: number;
	right: number;
}

export interface FitBoundsOptions {
	padding?: FitBoundsPadding;
	duration?: number;
	maxZoom?: number;
}

/**
 * mapbox에 fitBounds 적용
 * @param mapbox
 * @param coordinates
 * @param options
 */
export const fitMapToBounds = (
	mapbox: mapboxgl.Map | undefined,
	coordinates: [number, number][],
	options: FitBoundsOptions = {},
): boolean => {
	if (!mapbox) return false;

	const bounds = calculateBounds(coordinates);
	if (!bounds) return false;

	const { minLng, maxLng, minLat, maxLat } = bounds;
	const { padding = { top: 100, bottom: 100, left: 100, right: 100 }, duration = 1000, maxZoom } = options;
	// mapbox의 높이 너비
	const mapboxHeight = mapbox.getContainer().clientHeight;
	const mapboxWidth = mapbox.getContainer().clientWidth;

	const adjustPadding = (p1: number, p2: number, size: number, margin = 100): [number, number] => {
		if (size < margin) return [0, 0];
		if (p1 + p2 + margin <= size) return [p1, p2];
		const ratio = (size - margin) / (p1 + p2);
		return [Math.floor(p1 * ratio), Math.floor(p2 * ratio)];
	};

	const [top, bottom] = adjustPadding(padding.top, padding.bottom, mapboxHeight);
	const [left, right] = adjustPadding(padding.left, padding.right, mapboxWidth);
	const controlledPadding = { top, bottom, left, right };

	mapbox.fitBounds([minLng, minLat, maxLng, maxLat], {
		duration,
		padding: controlledPadding,
		...(maxZoom !== undefined && { maxZoom }),
	});

	return true;
};

export const moveToXY = (mapbox: mapboxgl.Map | undefined, x: number, y: number, zoom = 15): boolean => {
	if (!mapbox) return false;

	mapbox.flyTo({
		center: [x, y],
		zoom,
		duration: 0,
	});

	return true;
};

/**
 * location 배열에서 유효한 좌표 추출
 * @param location
 */
export const extractValidCoordinate = (location: number[] | undefined | null): [number, number] | null => {
	if (!location || location.length < 2) return null;
	const lng = location[0];
	const lat = location[1];
	if (!isValidCoordinate(lng, lat)) return null;
	return [lng, lat];
};
