const colorMap = new Map<string, string>();
export const colorPalette = ['#6c5ce7', '#fd79a8', '#00b894', '#e17055', '#a29bfe', '#fab1a0', '#ff7675', '#74b9ff'];
export const colorById = (id: string) => {
	if (id === 'unassigned') return '#BDC2CE';
	if (colorMap.has(id)) return colorMap.get(id);
	const color = colorPalette[colorMap.size % colorPalette.length];
	colorMap.set(id, color);
	return color;
};
