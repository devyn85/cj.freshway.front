export interface TFeatureProperties {
	hjdongCd?: string; // 메인코드
	ctpKorNm?: string; // 시도명
	sigKorNm?: string; // 시군구명
	hjdongNm?: string; // 행정동명
	fromDate?: string; // 시작일
	toDate?: string; // 종료일
}
export type TDistrict = 'sido' | 'sgg' | 'dem';

export interface IFeature {
	geometry: {
		coordinates: Array<Array<[number, number]>>;
		type: 'Polygon';
	};
	properties: TFeatureProperties;
	type: 'Feature';
}

export interface IPolygonData {
	type: 'FeatureCollection';
	features: IFeature[];
}

export type IListenerSource = {
	[K in TDistrict]: IPolygonData;
};

// /// 권역 responseData
// hjdongCd : string | null // 메인코드
// ctpKorNm : string | null // 시도명
// sigKorNm : string | null // 시군구명
// hjdongNm : string | null // 행정동명
// geojson : IFeature | null // 지오json
// // geojson : {type: 'MultiPolygon' | 'Polygon', coordinates: Array<Array<Array<[number, number]>>>}
// fromDate : string | null
// toDate : string | null
