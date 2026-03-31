/*
 ############################################################################
 # FiledataField	: apiKpWdLoadMonitoring.ts
 # Description		: 지표/모니터링 > 검수지표 > 상차검수현황 API
 # Author			: ParkYoSep
 # Since			: 2025.12.12
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/kp/wdLoadMonitoring';

/**
 * 지표/모니터링 > 검수지표 > 상차검수현황 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 지표/모니터링 > 검수지표 > 상차검수현황 상세 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList', params).then(res => res.data);
};

export { apiPostDetailList, apiPostMasterList };
