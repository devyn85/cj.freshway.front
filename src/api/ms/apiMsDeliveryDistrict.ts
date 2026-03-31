import axios from '@/api/Axios';

//////////////////////
////// 권역 탭 API 부분 ////////
//////////////////////

// // 메인 검색시
// 1-1. 메인 그리드 리스트 -> 검색영역 (센터 배송 권역 조회)
// 		2-1. (배송그룹 탭 api)센터 배송 권역 그룹 리스트 조회 (메인 그리드 리스트) (검색 영역의 날짜 + 물류센터 기준으로 가져오기)
// 1-9. 센터 배송 권역 그룹 (POP 조회 내부에 포함됨) 권역그룹 리스트, (권역그룹 리스트 - 내부에 대표pop 리스트 있음)
// 1-7. 폴리곤api 2회 (GROUP, DISTRICT) (배송 권역 폴리곤 조회) -> 지도 사용

// // 1-2. 서브 그리드 리스트 ->  메인 그리드 행 선택 시 (배송 권역 행정동 리스트 조회)
// // 1-3. 권역 탭 > 센터에 등록된 모든 행정동 리스트 (해당 리스트에서 사용중인 행정동/미사용중 행정동 구별하기)
// 1-4. 메인 그리드 저장 (센터 배송 권역 저장)
// 1-5. 서브 그리드 저장 (저장 전 유효성 검사(아래 5번 요청) -> 통과 시 서브 그리드 저장) (배송 권역 행정동 저장)

/**
 * 센터 배송 권역 조회
 * @param params
 * {
  "effectiveDate": "string",
  "gMultiDccode": "string",
  "dlvdistrictId": "string",
  "serialkey": "string",
  "dlvdistrictNm": "string",
  "searchDistrict": "string",
  "searchDistrictGroup": "string",
  "dlvgroupNm": "string",
  "dccode": "string",
  "searchKeyword": "string"
}
 * @returns {object} 1-1. 메인 그리드 리스트 -> 검색영역 (센터 배송 권역 조회)
[
  {
	  "serialkey": "801",
    "dccode": "2600",
    "dlvgroupId": " ",
    "dlvgroupNm": null,
    "dlvdistrictId": "2600-D801",
    "dlvdistrictNm": "테스트권역 33",
    "hjdongCount": "0",
    "description": "string",
    "fromDate": "20251005",
    "toDate": "29991231",
    "popList": null,
    "delYn": "N"
  }
]
 */ // 1-1. 메인 그리드 리스트 -> 검색영역 (센터 배송 권역 조회)
const apiPostGetMasterList = (params: any) => {
	// Swagger: MsCenterDlvDistrictReqDto { effectiveDate, dccode, searchDistrict, searchDistrictGroup, startRow, listCount, skipCount }
	return axios.post('/api/ms/deliveryDistrict/v1.0/getMasterList', params).then(res => res.data);
};

// // 1-9. 센터 배송 권역 그룹 (POP 조회 내부에 포함됨) 권역그룹 리스트, (권역그룹 리스트 - 내부에 대표pop 리스트 있음)
// 권역 탭 > 권역그룹 리스트 (권역그룹 그리드 select box 리스트)
const apiPostGetDlvDistrictgroupPopList = (params: any) => {
	return axios.post('/api/ms/deliveryDistrictGroup/v1.0/getDlvDistrictgroupPopList', params).then(res => res.data);
};

/**
 * 센터 배송 > 권역 폴리곤 / 그룹 폴리곤 조회
 * 1-7. 폴리곤api 2회 (센터, 배송권역그룹) (배송 권역 폴리곤 조회)
 * @param params
 * {
  "gMultiDccode": "string",
  "dccode": "string",
  "districtId": "string",
  "effectiveDate": "string",
  "dcname": "string",
  "dlvDistrictType": "string"
}
 * @returns {object} 센터 배송 > 권역 폴리곤 / 그룹 폴리곤 리스트
[
  {
    "serialkey": "string",
    "dccode": "string",
    "dlvDistrictType": "string",
    "dlvDistrictNm": "string",
    "districtId": "string",
    "fromDate": "string",
    "toDate": "string",
    "geojson": "string",
    "delYn": "string"
  }
]
 */ // 1-7. 폴리곤api 2회 (GROUP, DISTRICT) (배송 권역 폴리곤 조회) -> 지도 사용
const apiGetDlvDistrictPolygon = (params: any) => {
	// Swagger: MsDlvDistrictPolygonReqDto { dccode, effectiveDate, dlvDistrictType: 'DISTRICT'|'GROUP', districtId }
	return axios.post('/api/ms/deliveryDistrict/v1.0/getDlvDistrictPolygon', params).then(res => res.data);
};

/**
 * 배송 권역 사용 현황 조회
 * 1-3. 권역 탭 > 센터에 등록된 모든 행정동 리스트 (해당 리스트에서 사용중인 행정동/미사용중 행정동 구별하기)
 * @param params
 * {
  "dccode": "string",
  "effectiveDate": "string"
}
 * @returns {object} 센터 배송 권역 사용 현황 조회
[
  {
    "serialkey": null,
    "dccode": "2600",
    "dlvdistrictId": null,
    "dlvgroupId": null,
    "hjdongCd": "3102367000",
    "hjdongNm": null,
    "delYn": null,
    "fromDate": null,
    "toDate": null,
    "errorMessages": null
  }
]
 */ // 1-3. 권역 탭 > 센터에 등록된 모든 행정동 리스트 (해당 리스트에서 사용중인 행정동/미사용중 행정동 구별하기)
const apiPostGetCenterDistrictUsageList = (params: any) => {
	return axios.post('/api/ms/deliveryDistrict/v1.0/getCenterDistrictUsageList', params).then(res => res.data);
};

/**
 * 배송 권역 행정동 리스트 조회
 * 1-2. 서브 그리드 리스트 ->  메인 그리드 행 선택 시 (배송 권역 행정동 리스트 조회)
 * @param params
 * {
  "effectiveDate": "string",
  "dccode": "string",
  "dlvdistrictId": "string"
}
 * @returns {object} 서브 그리드 리스트
[
  {
    "serialkey": "string",
    "dccode": "string",
    "dlvdistrictId": "string",
    "hjdongCd": "string",
    "hjdongNm": "string",
    "delYn": "string",
    "fromDate": "string",
    "toDate": "string"
  }
]
 */ // 1-2. 서브 그리드 리스트 ->  메인 그리드 행 선택 시 (배송 권역 행정동 리스트 조회)
const apiPostgetHjdongList = (params: any) => {
	return axios.post('/api/ms/deliveryDistrict/v1.0/getHjdongList', params).then(res => res.data);
};

// 1-2-1. 서브 그리드 기간이 정해진 행정동 리스트
const apiPostgetCenterHjdongIntersectionList = (params: any) => {
	return axios.post('api/ms/deliveryDistrict/v1.0/getCenterHjdongIntersectionList', params).then(res => res.data);
};

/**
 * 센터 배송 권역 저장
 * 1-4. 메인 그리드 저장 (센터 배송 권역 저장)
 * @param {object} params 센터 배송 권역 요청
 * {
  "rowStatus": "string",
  "dccode": "string",
  "dlvgroupId": "string",
  "dlvdistrictNm": "string",
  "description": "string",
  "fromDate": "string",
  "toDate": "string", // TODO: rowStatus:D 일때 오늘날짜+3 으로 요청하기
  "serialkey": "string"
}
 * @returns {object} 공통코드 리스트
 */ // 1-4. 메인 그리드 저장 (센터 배송 권역 저장)
const apiPostsaveMasterList = (params: any) => {
	return axios.post('/api/ms/deliveryDistrict/v1.0/saveMasterList', params).then(res => res.data);
};

// 1-4-1. 배송권역 > 권역 그리드 저장 전 유효성 검사 (SRM 처리를 위한 유효성 검사)
// POST api/ms/deliveryDistrict/v1.0/getTodateChildImpact
// 권역 TODATE 하위 영향도 검증
// - 권역의 TODATE 단축 시, 하위 행정동에 영향이 있는지 확인
// reqParams:
// {
//  "dccode": "센터코드",
//  "dlvdistrictId": "권역ID",
//  "toDate": "변경하려는TODATE(yyyyMMdd)"
// }[]
// response:
// {
//   "success": true,
//   "data": {
//     "affectedYn": "Y"   // Y: 하위에 영향 있음(수정 차단), N: 영향 없음(수정 가능)
//   }
// }
const apiPostSrmValidateDistrict = (params: any) => {
	return axios.post('/api/ms/deliveryDistrict/v1.0/getTodateChildImpact', params).then(res => res.data);
};

/**
 * 배송 권역 행정동 저장
 * 1-5. 서브 그리드 저장 (저장 전 유효성 검사(아래 5번 요청) -> 통과 시 서브 그리드 저장) (배송 권역 행정동 저장)
 * @param {object} params 배송 권역 행정동 저장
 * {
  "dccode": "string",
  "dlvdistrictId": "string",
  "serialkey": "string",
  "hjdongList": [
    {
      "rowStatus": "string",
      "serialkey": "string",
      "hjdongCd": "string",
      "fromDate": "string",
      "toDate": "string"
    }
  ]
}
 * @returns {object} 공통코드 리스트
"Success". (이건 확인해 봐야 함)
 */ // 1-5. 서브 그리드 저장 (저장 전 유효성 검사(아래 6번 요청) -> 통과 시 서브 그리드 저장) (배송 권역 행정동 저장)
const apiPostsaveHjdongList = (params: any) => {
	return axios.post('/api/ms/deliveryDistrict/v1.0/saveHjdongList', params).then(res => res.data);
};

//////////////////////
////// 권역 그룹 탭 API 부분 ////////
//////////////////////

// 2-1. 배송 권역 리스트 조회 (메인 그리드 리스트)
// 2-2. 센터 배송 권역 그룹 저장 (메인 그리드 저장)
// 2-3. 센터 배송 권역 그룹 X POP 조회 (서브 그리드 리스트)
// // 3-1. 센터 권역 POP 조회 (서브그리드 대표 POP 번호, 대표 POP 명 에서 리스트로 사용된다!)
// 2-4, 센터 권역 POP 저장 (서브 그리드 저장)

/**
 * 2-1. 배송 권역 리스트 조회 (메인 그리드 리스트)
 * @param params
 * {
  "dlvgroupId": "string",
  "dlvgroupNm": "string",
  "searchKeyword": "string",
  "dccode": "string",
  "effectiveDate": "string",
  "gMultiDccode": "string"
}
 * @returns {object} 센터 배송 권역 그룹 리스트
[
  {
    "serialkey": "string",
    "dccode": "string",
    "dlvgroupId": "string",
    "dlvgroupNm": "string",
    "description": "string",
    "delYn": "string",
    "fromDate": "string",
    "toDate": "string",
    "dcname": "string"
  }
]
 */ // 2-1. 배송 권역 리스트 조회 (메인 그리드 리스트)
const apiPostGetDistrictGroupList = (params: any) => {
	// 🔹 실제 API 요청 (주석 처리)
	return axios.post('/api/ms/deliveryDistrictGroup/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 2-2. 센터 배송 권역 그룹 저장 (메인 그리드 저장)
 * @param params
 * [
  {
    "dccode": "string",
    "dlvgroupNm": "string",
    "description": "string",
    "fromDate": "string",
    "toDate": "string",
    "serialkey": "string",
    "dlvgroupId": "string",
    "delYn": "string",
    "rowStatus": "string"
  }
]
 * @returns {object} 센터 배송 권역 그룹 리스트
"string"
 */ // 2-2. 센터 배송 권역 그룹 저장 (메인 그리드 저장)
const apiPostSaveDistrictGroup = (params: any) => {
	return axios.post('/api/ms/deliveryDistrictGroup/v1.0/saveMasterList', params).then(res => res.data);
};

// 2-2-1. 권역그룹 TODATE 하위 영향도 검증 (메인 그리드 저장 전 유효성 검사 - SRM 처리를 위한 유효성 검사)
// POST api/ms/deliveryDistrictGroup/v1.0/getTodateChildImpact
// - 권역그룹의 TODATE 단축 시, 하위 권역그룹POP + 권역에 영향이 있는지 확인
// reqParams:
// {
//   "dccode": "센터코드",
//   "dlvgroupId": "권역그룹ID",
//   "toDate": "변경하려는TODATE(yyyyMMdd)"
// }[]
// response:
// {
//   "success": true,
//   "data": {
//     "affectedYn": "Y"   // Y: 하위에 영향 있음(수정 차단), N: 영향 없음(수정 가능)
//   }
// }
const apiPostSrmValidateGroup = (params: any) => {
	return axios.post('/api/ms/deliveryDistrictGroup/v1.0/getTodateChildImpact', params).then(res => res.data);
};

// 2-2-2. 권역그룹 하위 대표 POP 유효성 검사 api (삭제해도 무방한지 검사하는 api)
// 권역 그룹 삭제 검증 API 입니다
// POST /api/ms/deliveryDistrictGroup/v1.0/getDeleteGroupPopImpact
// Body: [ { "serialkey": "123" }, { "serialkey": "456" } ]
const apiPostSrmValidateDeleteGroupPop = (params: any) => {
	return axios.post('/api/ms/deliveryDistrictGroup/v1.0/getDeleteGroupPopImpact', params).then(res => res.data);
};

// 2-2-3. 권역그룹 하위 대표 POP SRM 연계  (권역그룹-대표POP 삭제 가능여부 검증 API)
// POST /api/ms/deliveryDistrictGroup/v1.0/getDeleteGroupXPopHjdongImpact
// 요청
//  {
//   "dccode": "센터코드",
//   "dlvgroupId": "권역그룹ID",
//   "popList": [
//    { "serialkey": "POP키1" },
//    { "serialkey": "POP키2" }
//   ]
//  }
// 응답
// {
//   "deletableSerialkeys": ["삭제 가능 POP키 목록"],
//   "nonDeletableSerialkeys": ["삭제 불가 POP키 목록"]
//  }
const apiPostgetDeleteGroupXPopHjdongImpact = (params: any) => {
	return axios.post('/api/ms/deliveryDistrictGroup/v1.0/getDeleteGroupXPopHjdongImpact', params).then(res => res.data);
};

/**
 * 2-3. 센터 배송 권역 그룹 X POP 조회 (서브 그리드 리스트)
 * @param params
 * {
  "dccode": "string",
  "dlvgroupId": "string",
  "effectiveDate": "string"
}
 * @returns {object} 센터 배송 권역 그룹 리스트
[
  {
    "serialkey": "string",
    "popNo": "string",
    "popName": "string",
    "fromHour": "string",
    "toHour": "string",
    "fromDate": "string",
    "toDate": "string",
    "baseYn": "string",
    "delYn": "string"
  }
]
 */ // 2-3. 센터 배송 권역 그룹 X POP 조회 (서브 그리드 리스트)
const apiPostGetDistrictGroupXPop = (params: any) => {
	return axios.post('/api/ms/deliveryDistrictGroup/v1.0/getDistrictGroupXPop', params).then(res => res.data);
};
/**
 * 2-4, 센터 권역 POP 저장 (서브 그리드 저장)
 * @param params
 * {
  "dccode": "string",
  "dlvgroupId": "string",
  "popList": [
    {
      "popNo": "string",
      "fromHour": "string",
      "toHour": "string",
      "fromDate": "string",
      "toDate": "string",
      "serialkey": "string",
      "delYn": "string",
      "rowStatus": "string"
    }
  ]
}
 * @returns {object} 센터 배송 권역 그룹 리스트
"string"
 */ // 2-4, 센터 권역 POP 저장 (서브 그리드 저장)
const apiPostSaveGroupXPopList = (params: any) => {
	return axios.post('/api/ms/deliveryDistrictGroup/v1.0/saveGroupXPopList', params).then(res => res.data);
};

//////////////////////
////// POP 탭 API 부분 ////////
//////////////////////
// 3-1. 센터 권역 POP 조회
// 3-2. 센터 권역 POP 저장

/**
 * 3-1. 센터 권역 POP 조회
 * @param params
 * {
  "dccode": "string",
  "searchKeyword": "string",
  "effectiveDate": "string",
  "fromDate": "string",
  "toDate": "string",
  "description": "string"
}
 * @returns {object} POP 리스트
[
  {
    "serialkey": "string",
    "dccode": "string",
    "popNo": "string",
    "popName": "string",
    "fromDate": "string",
    "toDate": "string",
    "description": "string",
    "delYn": "string",
    "baseYn": "string"
  }
]
 */ // 3-1. 센터 권역 POP 조회
const apiPostGetPopList = (params: any) => {
	return axios.post('/api/ms/deliveryDistrictRepPop/v1.0/getMasterList', params).then(res => res.data);
};
// 3-1-1. 센터 권역 POP 유효성 검사 조회
const apiPostExistsRepPop = (params: any) => {
	return axios.post('/api/ms/deliveryDistrictRepPop/v1.0/existsRepPop', params).then(res => res.data);
};

/**
 * 3-2. 센터 권역 POP 저장
 * @param {object} params 공통그룹코드 리스트
 * @returns {object} 공통코드 리스트
 */
const apiPostSavePopList = (params: any) => {
	return axios.post('/api/ms/deliveryDistrictRepPop/v1.0/saveMasterList', params).then(res => res.data);
};

// 센터권역변경이력
const apiPostDeliveryDistrictHistoryList = (params: any) => {
	return axios.post('/api/ms/deliveryDistrictHistory/v1.0/getHistoryList', params).then(res => res.data);
};

// 기존 데이터 변경 시(U,D 요청 시) SRM 처리를 위한 유효성 검사
// 대표POP TODATE 하위 영향도 검증
// POST api/ms/deliveryDistrictRepPop/v1.0/getTodateChildImpact
// reqParams:
// {
//   "dccode": "센터코드",
//   "popNo": "대표POP번호",
//   "toDate": "변경하려는TODATE(yyyyMMdd)"
// }[]
// response:
// {
//   "success": true,
//   "data": {
//     "affectedYn": "Y"   // Y: 하위에 영향 있음(수정 차단), N: 영향 없음(수정 가능)
//   }
// }
const apiPostSrmValidatePop = (params: any) => {
	return axios.post('/api/ms/deliveryDistrictRepPop/v1.0/getTodateChildImpact', params).then(res => res.data);
};

export {
	apiGetDlvDistrictPolygon,
	apiPostDeliveryDistrictHistoryList,
	apiPostExistsRepPop,
	apiPostGetCenterDistrictUsageList,
	apiPostgetCenterHjdongIntersectionList,
	apiPostgetDeleteGroupXPopHjdongImpact,
	apiPostGetDistrictGroupList,
	apiPostGetDistrictGroupXPop,
	apiPostGetDlvDistrictgroupPopList,
	apiPostgetHjdongList,
	apiPostGetMasterList,
	apiPostGetPopList,
	apiPostSaveDistrictGroup,
	apiPostSaveGroupXPopList,
	apiPostsaveHjdongList,
	apiPostsaveMasterList,
	apiPostSavePopList,
	apiPostSrmValidateDeleteGroupPop,
	apiPostSrmValidateDistrict,
	apiPostSrmValidateGroup,
	apiPostSrmValidatePop,
};
