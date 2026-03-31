/*
 ############################################################################
 # FiledataField	: apiKpDpShortageResult.ts
 # Description		: 지표 > 센터 운영 > 입고 결품 현황 API
 # Author			: KimDongHan
 # Since			: 2025.09.08
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/kp/dpShortageResult';

/**
 * 지표 > 센터 운영 > 입고 결품 현황 일배_탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT1List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT1List', params).then(res => res.data);
};

/**
 * 지표 > 센터 운영 > 입고 결품 현황 저장_탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT2List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT2List', params).then(res => res.data);
};

/**
 * 지표 > 센터 운영 > 입고 결품 현황 일배요약_탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT3List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT3List', params).then(res => res.data);
};

/**
 * 지표 > 센터 운영 > 입고 결품 현황 저장요약_탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT4List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT4List', params).then(res => res.data);
};

export { apiPostMasterT1List, apiPostMasterT2List, apiPostMasterT3List, apiPostMasterT4List };
