/*
 ############################################################################
 # FiledataField	: apiWdItemTrace.ts
 # Description		: 모니터링 > 검수 > 검수 공정별 현황 API
 # Author			: KimDongHan
 # Since			: 2025.11.17
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/wd/itemTrace';

/**
 * 모니터링 > 검수 > 검수 공정별 현황 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post('/ltx/wd/itemTrace/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 모니터링 > 검수 > 결품추적 팝업 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPopList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPopList', params).then(res => res.data);
};

export { apiPostMasterList, apiPostPopList };
