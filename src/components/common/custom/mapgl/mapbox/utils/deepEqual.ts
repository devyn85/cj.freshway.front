import { PointLike } from 'mapbox-gl';

export const deepEqual = (a: any, b: any): boolean => {
	if (a === b) {
		return true;
	}
	if (!a || !b) {
		return false;
	}
	if (Array.isArray(a)) {
		if (!Array.isArray(b) || a.length !== b.length) {
			return false;
		}
		for (let i = 0; i < a.length; i++) {
			if (!deepEqual(a[i], b[i])) {
				return false;
			}
		}
		return true;
	} else if (Array.isArray(b)) {
		return false;
	}
	if (typeof a === 'object' && typeof b === 'object') {
		const aKeys = Object.keys(a);
		const bKeys = Object.keys(b);
		if (aKeys.length !== bKeys.length) {
			return false;
		}
		for (const key of aKeys) {
			if (!b.hasOwnProperty(key)) {
				return false;
			}
			if (!deepEqual(a[key], b[key])) {
				return false;
			}
		}
		return true;
	}
	return false;
};

export const arePointsEqual = (a?: PointLike, b?: PointLike): boolean => {
	const ax = Array.isArray(a) ? a[0] : a ? a.x : 0;
	const ay = Array.isArray(a) ? a[1] : a ? a.y : 0;
	const bx = Array.isArray(b) ? b[0] : b ? b.x : 0;
	const by = Array.isArray(b) ? b[1] : b ? b.y : 0;
	return ax === bx && ay === by;
};
