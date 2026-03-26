export const flattedZ = (z: number, zoom: number) => {
	return Math.round(z * (1 / Math.pow(2, zoom)));
};
