/*
 ############################################################################
 # FiledataField	: apiOmAutoOrderMonitoring.ts
 # Description		: 시스템운영 > 시스템운영현황 > 자동발주 모니터링 조회 API
 # Author			: JiSooKim
 # Since			: 2025.08.12
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/om/omAutoOrderMonitoring';

/**
 * 시스템운영 > 시스템운영현황 > 자동발주 모니터링 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiGetMasterList = (params: any) => {
	return axios.get('/api/om/autoOrderMonitoring/v1.0/getMasterList', { params }).then(res => res.data);
};

export { apiGetMasterList };
