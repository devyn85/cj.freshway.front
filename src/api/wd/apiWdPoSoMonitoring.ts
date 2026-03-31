/*
 ############################################################################
 # FiledataField	: apiWdDistributePlanSkuSum.ts
 # Description		: 출고 > 출고현황 > 일배PO/SO연결모니터링 API
 # Author			: YangChangHwan
 # Since			: 25.06.23
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/wd/wdPoSoMonitoring';

/**
 * 출고 > 출고현황 > 일배PO/SO연결모니터링 목록 검색 조회 상세 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiSearchWdPoSoMonitoringList = (params: any) => {
	return axios.get(REQUEST_API + '/v1.0/getWdPoSoMonitoringList', { params }).then(res => res.data);
};

/**
 * 출고 > 출고현황 > 일배PO/SO연결모니터링 목록 검색 조회 Grid1 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiSearchWdPoSoMonitoringGrid1List = (params: any) => {
	return axios.get(REQUEST_API + '/v1.0/getgetWdPoSoMonitoringGrid1List', { params }).then(res => res.data);
};

export { apiSearchWdPoSoMonitoringGrid1List, apiSearchWdPoSoMonitoringList };
