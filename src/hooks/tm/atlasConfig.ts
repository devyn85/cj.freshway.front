// 마커 아틀라스 설정 (2x 해상도)
// 레이아웃: 핀 20개 (168×204) + 숫자 201개 (80×100, 40열) + 그룹마커 1개

// 핀 셀
const MARKER_W = 168;
const MARKER_H = 204;
const PAD = 8;
const CELL_W = MARKER_W + PAD;
const CELL_H = MARKER_H + PAD;

// 숫자 셀 (압축)
const NUM_W = 80;
const NUM_H = 100;
const NUM_CELL_W = NUM_W + PAD;
const NUM_CELL_H = NUM_H + PAD;
const NUM_COLS = 40;
const NUM_Y_START = CELL_H;

export const MARKER_ATLAS_URL = '/img/marker-atlas.png';

export const ATLAS_COLORS = [
	'#6c5ce7',
	'#fd79a8',
	'#00b894',
	'#e17055',
	'#a29bfe',
	'#fab1a0',
	'#ff7675',
	'#74b9ff',
	'#4076ff',
	'#9e9e9e',
];

type IconDef = {
	x: number;
	y: number;
	width: number;
	height: number;
	anchorX: number;
	anchorY: number;
};

const mkPinEntry = (col: number): IconDef => ({
	x: col * CELL_W + PAD / 2,
	y: PAD / 2,
	width: MARKER_W,
	height: MARKER_H,
	anchorX: MARKER_W / 2,
	anchorY: MARKER_H - 4,
});

const mkNumEntry = (idx: number): IconDef => ({
	x: (idx % NUM_COLS) * NUM_CELL_W + PAD / 2,
	y: NUM_Y_START + Math.floor(idx / NUM_COLS) * NUM_CELL_H + PAD / 2,
	width: NUM_W,
	height: NUM_H,
	anchorX: NUM_W / 2,
	anchorY: 102,
});

// 통합 매핑
export const atlasMapping: Record<string, IconDef> = (() => {
	const m: Record<string, IconDef> = {};
	// 빈 핀 (row 0, col 0~9)
	ATLAS_COLORS.forEach((c, i) => {
		m[c] = mkPinEntry(i);
	});
	// 원 핀 (row 0, col 10~19)
	ATLAS_COLORS.forEach((c, i) => {
		m[`${c}_0`] = mkPinEntry(ATLAS_COLORS.length + i);
	});
	// 숫자 1~200 (압축 셀)
	for (let i = 1; i <= 200; i++) {
		m[String(i)] = mkNumEntry(i - 1);
	}
	// "200+"
	m['200+'] = mkNumEntry(200);
	// 그룹 마커 (숫자 영역 이후)
	const numRows = Math.ceil(201 / NUM_COLS);
	m['group_marker'] = {
		x: PAD / 2,
		y: NUM_Y_START + numRows * NUM_CELL_H + PAD / 2,
		width: MARKER_W,
		height: MARKER_H,
		anchorX: 48,
		anchorY: 234,
	};
	return m;
})();

// 핀 아이콘 키 (색상 소문자 정규화)
export const getPinIcon = (color: string, index: number): string => {
	const c = color.toLowerCase();
	return index <= 0 ? `${c}_0` : c;
};

// 숫자 아이콘 키
export const getNumIcon = (index: number): string => {
	if (index > 200) return '200+';
	return String(index);
};

// 렌더 아이템: 핀+숫자+그룹마크를 인터리브하여 단일 IconLayer용 데이터 생성
export const toRenderItems = <T extends { index: number; color: string }>(
	items: T[],
	pinIconFn: (color: string, index: number) => string = getPinIcon,
	hasGroup?: (d: T) => boolean,
): (T & { _icon: string })[] => {
	return items.flatMap(d => {
		const result: (T & { _icon: string })[] = [{ ...d, _icon: pinIconFn(d.color, d.index) }];
		if (d.index > 0) {
			result.push({ ...d, _icon: getNumIcon(d.index) });
		}
		if (hasGroup?.(d)) {
			result.push({ ...d, _icon: 'group_marker' });
		}
		return result;
	});
};
