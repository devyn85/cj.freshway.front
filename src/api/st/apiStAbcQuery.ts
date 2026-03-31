/*
 ############################################################################
 # FiledataField	: apiStAbcQuery.ts
 # Description		: 재고 > 재고운영 > ABC 분석 API
 # Author			: KimDongHan
 # Since			: 2025.11.12
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/abcQuery';

/**
 * 재고 > 재고운영 > ABC 분석 분석_탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT1List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT1List', params).then(res => res.data);
};

/**
 * 재고 > 재고운영 > ABC 분석 기준_탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT2List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT2List', params).then(res => res.data);
};

/**
 * 재고 > 재고운영 > ABC 분석 기준_탭 저장
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSaveMasterT2List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterT2List', params).then(res => res.data);
};

export { apiPostMasterT1List, apiPostMasterT2List, apiPostSaveMasterT2List };
