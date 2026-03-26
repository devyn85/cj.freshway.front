/*
 ############################################################################
 # FiledataField	: apiKpSyncOrdMonitoring.ts
 # Description		: 주문동기화 모니터링
 # Author			    :
 # Since			    :
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 주문동기화 모니터링 헤더 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/kp/syncOrdMonitoring/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 주문동기화 모니터링 상세 조회
 * @param params
 * @returns
 */
const apiGetDetailList = (params: any) => {
	return axios.get('/api/kp/syncOrdMonitoring/v1.0/getDetailList', { params }).then(res => res.data);
};
export { apiGetDetailList, apiGetMasterList };
