/*
 ############################################################################
 # FiledataField	: apiKpClose.ts
 # Description		: 모니터링 > 물동 > 물동마감 진행 현황 API
 # Author			: KimDongHan
 # Since			: 2025.08.22
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/kp/close';

/**
 * 모니터링 > 물동 > 물동마감 진행현황 > 진행현황 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post('/ltx/kp/close/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 모니터링 > 물동 > 물동마감 진행현황 > 진행현황 상세 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 모니터링 > 물동 > 물동마감 진행현황 > 월마감처리 저장
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiPostDetailList, apiPostMasterList, apiPostSaveMasterList };
