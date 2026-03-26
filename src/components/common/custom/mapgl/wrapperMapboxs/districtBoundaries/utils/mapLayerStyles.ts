// 폴리곤 레이어 스타일
// 스타일 상수 정의 (HEX 변환 버전)
export const BasePloygonLayerStyle = {
	fillColor: 'rgba(170, 170, 170, 0.3)',
	lineColor: 'rgba(170, 170, 170, 1)',
	lineWidth: 2,
};
// 선택한 센터 폴리곤 레이어 스타일
export const SelectedCenterPloygonLayerStyle = {
	fillColor: 'rgba(118, 157, 255, 0.5)',
	lineColor: 'rgba(64, 110, 226, 1)',
};
// 센터 폴리곤 레이어 스타일
export const CenterPloygonLayerStyle = {
	fillColor: 'rgba(118, 157, 255, 0.2)',
	lineColor: 'rgba(64, 110, 226, 1)',
};
// 선택한 센터 폴리곤 텍스트 스타일 
export const SelectedCenterTextLayerStyle = {
	layout: {
		'text-field': ['get', 'name'],
		'text-size': 14,
		'text-anchor': 'center',
		'text-allow-overlap': true,
	},
	paint: {
		'text-color': '#111',
		'text-halo-color': '#ffffff',
		'text-halo-width': 1.2,
	},
};
// 센터 폴리곤 레이어 스타일
export const centerTextLayerStyle = {
	layout: {
		'text-field': ['get', 'name'],
		'text-size': 14,
		'text-anchor': 'center',
		'text-allow-overlap': true,
	},
	paint: {
		'text-color': 'rgba(17, 17, 17, 0.6)',
		'text-halo-color': 'rgba(255, 255, 255, 0.8)',
		'text-halo-width': 1.0,
	},
};

// 그룹 권역 레이어 스타일
export const GroupDistirctPloygonLayerStyle = {
	fillColor: 'rgba(118, 157, 255, 0.3)',
	lineColor: 'rgba(64, 110, 226, 1)',
};
// 선택한 권역그룹 폴리곤 레이어 스타일
export const SelectedGroupDistirctPloygonLayerStyle = {
	fillColor: 'rgba(118, 157, 255, 0.4)',
	lineColor: 'rgba(64, 110, 226, 1)',
};
// 권역 레이어 스타일
export const DistrictPloygonLayerStyle = {
	fillColor: 'rgba(118, 157, 255, 0.4)',
	lineColor: 'rgba(64, 110, 226, 1)',
};
// 선택한 권역 폴리곤 레이어 스타일
export const SelectedDistrictPloygonLayerStyle = {
	fillColor: 'rgba(118, 157, 255, 0.6)',
	lineColor: 'rgba(64, 110, 226, 1)',
};
// 미사용중인 행정동 폴리곤 레이어 스타일
export const UnusageHjdongPloygonLayerStyle = {
	fillColor: 'rgba(255, 193, 7, 0.39)',
	lineColor: 'rgba(255, 193, 7, 1)',
};
// 중복된 행정동 폴리곤 레이어 스타일
export const DuplicateHjdongPloygonLayerStyle = {
	fillColor: 'rgba(239, 21, 30, 0.63)',
	lineColor: 'rgba(239, 21, 30, 0.63)',
};
// 센터 권역 관리 행정동 신규 추가시 보이는 폴리곤 스타일 (초록색)
export const CenterDistrictNewHjdongPloygonLayerStyle = {
	fillColor: 'rgba(46, 204, 113, 0.4)',
	lineColor: 'rgba(39, 174, 96, 0.6)',
};
// 센터 권역(배송권역>권역) 행정동 기존 제거(종료일자가 시작일자  or 오늘 +2 일 일때)보이는 폴리곤 스타일 (보라색)
export const CenterDistrictClosedHjdongPloygonLayerStyle = {
	fillColor: 'rgba(146, 114, 254, 0.7)',
	lineColor: 'rgba(146, 114, 254, 1)',
};
// 센터 권역 (센터권역 그리드 _메인그리드) 행정동 클릭 시 보이는 폴리곤 스타일 (2초 후 사라지는 폴리곤)
export const CenterDistrictClickedHjdongPloygonLayerStyle = {
	fillColor: 'rgba(239, 21, 30, 0.63)',
	lineColor: 'rgba(239, 21, 30, 0.63)',
};

// 선택한 배송권역 폴리곤 텍스트 스타일 
export const SelectedDistrictTextLayerStyle = {
	layout: {
		'text-field': ['get', 'name'],
		'text-size': 14,
		'text-anchor': 'center',
		'text-allow-overlap': true,
	},
	paint: {
		'text-color': '#111',
		'text-halo-color': '#ffffff',
		'text-halo-width': 1.2,
	},
};
// 배송권역 폴리곤 레이어 스타일
export const districtTextLayerStyle = {
	layout: {
		'text-field': ['get', 'name'],
		'text-size': 14,
		'text-anchor': 'center',
		'text-allow-overlap': true,
	},
	paint: {
		'text-color': 'rgba(17, 17, 17, 0.6)',
		'text-halo-color': 'rgba(255, 255, 255, 0.8)',
		'text-halo-width': 1.0,
	},
};


export const OverLappedPloygonLayerStyle = {
	fillColor: 'rgba(239, 21, 30, 0.3)',
	lineColor: 'rgba(239, 21, 30, 0.63)',
};

export const ClickedPloygonLayerStyle = {
	fillColor: 'rgba(95, 126, 204, 0.3)',
	lineColor: 'rgba(51, 88, 181, 1)',
};

export const HoverPloygonLayerStyle = {
	fillColor: 'rgba(255, 193, 7, 0.39)',
	lineColor: 'rgba(255, 193, 7, 1)',
	lineWidth: 3,
};

export const SelectedPloygonLayerStyle = {
	fillColor: 'rgba(255, 87, 34, 0.47)',
	lineColor: 'rgba(255, 87, 34, 1)',
	lineWidth: 4,
};
