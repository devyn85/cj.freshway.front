/*
 ############################################################################
 # FiledataField	: apiIbClose.ts
 # Description		: Admin > 모니터링 > 마감상태 관리 API
 # Author			: KimDongHan
 # Since			: 2025.08.21
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/ib/close';

/**
 * Admin > 모니터링 > 마감상태 관리 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * Admin > 모니터링 > 마감상태 관리 저장
 * @param {any} params
 * @returns {object}
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiPostMasterList, apiPostSaveMasterList };
