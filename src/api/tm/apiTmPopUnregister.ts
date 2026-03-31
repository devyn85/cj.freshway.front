/*
 ############################################################################
 # FiledataField	: apiTmPopUnregister.tsx
 # Description		: 거래처별 POP 미등록 현황 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.16
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 거래처별 POP 미등록 현황 조회
 * @param {any} params 검색 조건
 * @returns {object} 거래처별 POP 미등록 현황 목록
 */
const apiPostMasterList = (params: any) => {
	return axios
		.post('/api/tm/popunregister/v1.0/getMasterList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 거래처별 배송이력 조회
 * @param {any} params 검색 조건
 * @returns {object} 거래처별 배송이력 목록
 */
const apiPostCustDeliveryList = (params: any) => {
	return axios
		.post('/api/tm/popunregister/v1.0/getCustDeliveryList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 차량별 롤테이너별 배송이력 조회
 * @param {any} params 검색 조건
 * @returns {object} 차량별 롤테이너별 배송이력 목록
 */
const apiPostCarRolltainerList = (params: any) => {
	return axios
		.post('/api/tm/popunregister/v1.0/getCarRolltainerList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 추천 POP 조회
 * @param {any} params 검색 조건
 * @returns {object} 차량별 롤테이너별 배송이력 목록
 */
const apiPostRecommendPOPList = (params: any) => {
	return axios
		.post('/api/tm/popunregister/v1.0/getRecommendPOPList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 거래처별 POP 저장
 * @param {any} params 거래처별 POP 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveCustPop = (params: any) => {
	return axios.post('/api/tm/popunregister/v1.0/saveCustPOP', params).then(res => res);
};

export {
	apiPostCarRolltainerList,
	apiPostCustDeliveryList,
	apiPostMasterList,
	apiPostRecommendPOPList,
	apiPostSaveCustPop,
};
