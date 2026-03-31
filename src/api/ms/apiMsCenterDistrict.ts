import axios from '@/api/Axios';

// 기준정보 > 센터기준정보 > 센터 권역
/**
 * 조회 조건에 따른 센터 권역 목록 조회 (센터 권역 그리드 리스트)
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/ms/centerDistrict/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 센터 권역 폴리곤 목록 조회 (센터 권역 폴리곤 데이터 - 지도 권역 폴리곤)
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetCenterDistrictPolygon = (params: any) => {
	return axios.post('/api/ms/centerDistrict/v1.0/getCenterDistrictPolygon', params).then(res => res.data);
};

/**
 * 미사용(미등록) 권역 행정동 리스트 조회 (노랑색 폴리곤 및 그리드 추가 시 사용)
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostNewHjdongList = (params: any) => {
	return axios.post('/api/ms/centerDistrict/v1.0/getNewHjdongList', params).then(res => {
		return res?.data;
	});
};

/**
 * 센터별 행정동 데이터 저장 및 센터 폴리곤 생성 - 센터 권역 그리드 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('/api/ms/centerDistrict/v1.0/saveMasterList', params).then(res => res.data);
};

// 센터별 행정동 유효성 검사 api
// 센터권역 행정동 TODATE 하위 영향도 검증
// POST api/ms/centerDistrict/v1.0/getTodateChildImpact
// - 센터권역 행정동의 TODATE 단축 시, 하위 배송권역 행정동에 영향이 있는지 확인
// reqParams:
// {
// 	"dccode": "센터코드",
// 	"hjdongCd": "행정동코드",
// 	"toDate": "변경하려는TODATE(yyyyMMdd)"
// }
// response:
// {
//   "success": true,
//   "data": {
//     "affectedYn": "Y"   // Y: 하위에 영향 있음(수정 차단), N: 영향 없음(수정 가능)
//   }
// }
const apiPostSrmValidateCenterHjdong = (params: any) => {
	return axios.post('/api/ms/centerDistrict/v1.0/getTodateChildImpact', params).then(res => res.data);
};

// 기준정보 > 센터기준정보 > 설정 팝업
/**
 * 주문그룹 목록 조회 (플랫폼 주문유형 팝업 조회 전 주문그룹(select box) 리스트 조회)
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetOrdGrpList = (params?: any) => {
	return axios.get('/api/ms/centerDistrictOrdGrp/v1.0/getOrdGrpList', { params }).then(res => res.data);
};

// 권역 폴리곤
/**
 * (행정동)권역 유형별 폴리곤 목록 조회 - 폴리곤 데이터가 아닌 그냥 리스트 데이터만 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetDistrictPolygonMasterList = (params: any) => {
	return axios.get('/api/ms/districtPolygon/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * (행정동)권역 유형별 폴리곤 목록 파일에서 조회 - 폴리곤 리스트 데이터 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterListOfFile = (params: any) => {
	return axios.post('/api/ms/districtPolygon/v1.0/getMasterListOfFile', params).then(res => {
		return res?.data;
	});
};

// // 신설 핼정동 그리드 처리 api
// 센터권역 > 메인그리드 추가 api
// - URL: GET /api/ms/centerDistrict/v1.0/getNewCreatedHjdongWithoutPolygon
//  - 파라미터: 없음
//  - 응답: ApiResult<List>
//  {
//   "hjdongCd": "행정동코드",
//   "ctpKorNm": "시도명",
//   "sigKorNm": "시군구명",
//   "hjdongNm": "행정동명"
//  }
//  - 설명: 행안부 행정구역 개편으로 신규 생성된 행정동(MVMN_RES_CD = '31') 중 폴리곤이 아직 미반영된 목록 조회
//  - 3계층(시도/시군구/행정동) 모두 포함, 데이터 없으면 빈 배열 반환
const apiGetNewCreatedHjdongWithoutPolygon = () => {
	return axios.get('/api/ms/centerDistrict/v1.0/getNewCreatedHjdongWithoutPolygon').then(res => res.data);
};

/////////////////////////////

//// 플랫폼 주문 유형 팝업 처리 관련 (구 주문그룹 관련 API)
/**
 * 센터 권역 주문그룹 우선순위 상세 조회
 * @param {any} params 요청 파라미터
 * @param {any} params.ordGrp
 * @param {any} params.effectiveDate
 * @param {any} params.pr1Dccode
 * @param {any} params.pr2Dccode
 * @returns {object} 응답값
 */
const apiGetDcOrdGrpListByPrDccode = (params: {
	ordGrp: string;
	effectiveDate: string;
	pr1Dccode: string;
	pr2Dccode: string;
}) => {
	return axios.post('/api/ms/centerDistrictDcOrdGrp/v1.0/getDcOrdGrpListByPrDccode', params).then(res => {
		return res?.data;
	});
};

/**
 * 센터 권역 주문그룹 우선순위 조회
 * @param {any} params 요청 파라미터
 * @param {any} params.ordGrp
 * @param {any} params.effectiveDate
 * @returns {object} 응답값
 */
const apiGetDcOrdGrpList = (params: { ordGrp: string; effectiveDate: string }) => {
	return axios.post('/api/ms/centerDistrictDcOrdGrp/v1.0/getMasterList', params).then(res => {
		return res?.data;
	});
};

/**
 * 센터 권역 주문그룹 우선순위 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiSaveDcOrdGrpList = (params: any) => {
	return axios.post('/api/ms/centerDistrictDcOrdGrp/v1.0/saveMasterList', params).then(res => {
		return res?.data;
	});
};

/**
 * 변경이력 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostCenterDistrictHistoryList = (params: any) => {
	return axios.get('/api/ms/centerDistrictHistory/v1.0/getMasterList', { params }).then(res => {
		return res?.data;
	});
};

export {
	apiGetCenterDistrictPolygon,
	apiGetDcOrdGrpList,
	apiGetDcOrdGrpListByPrDccode,
	apiGetDistrictPolygonMasterList,
	apiGetMasterList,
	apiGetMasterListOfFile,
	apiGetNewCreatedHjdongWithoutPolygon,
	apiGetOrdGrpList,
	apiPostCenterDistrictHistoryList,
	apiPostNewHjdongList,
	apiPostSrmValidateCenterHjdong,
	apiSaveDcOrdGrpList,
	apiSaveMasterList,
};
