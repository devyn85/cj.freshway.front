/*
 ############################################################################
 # File name    : apiKpSyncOrdDtlMonitoring.ts
 # Description  : 주문동기화 상세 모니터링 (DP/RT/WD/AJ/ST INPLAN)
 # Author       :
 # Since        :
 ############################################################################
*/

import axios from '@/api/Axios';

const BASE = '/api/kp/syncOrdDtlMonitoring/v1.0';

/**
 * KP 주문동기화 상세 모니터링 - DP_INPLAN 목록 조회
 * @param params
 */
const apiGetDPInplanList = (params: any) => {
	return axios.post(`${BASE}/getDPInplanList`, params).then(res => res.data);
};

/**
 * KP 주문동기화 상세 모니터링 - RT_INPLAN 목록 조회
 * @param params
 */
const apiGetRTInplanList = (params: any) => {
	return axios.post(`${BASE}/getRTInplanList`, params).then(res => res.data);
};

/**
 * KP 주문동기화 상세 모니터링 - WD_INPLAN 목록 조회
 * @param params
 */
const apiGetWDInplanList = (params: any) => {
	return axios.post(`${BASE}/getWDInplanList`, params).then(res => res.data);
};

/**
 * KP 주문동기화 상세 모니터링 - AJ_INPLAN 목록 조회
 * @param params
 */
const apiGetAJInplanList = (params: any) => {
	return axios.post(`${BASE}/getAJInplanList`, params).then(res => res.data);
};

/**
 * KP 주문동기화 상세 모니터링 - ST_INPLAN 목록 조회
 * @param params
 */
const apiGetSTInplanList = (params: any) => {
	return axios.post(`${BASE}/getSTInplanList`, params).then(res => res.data);
};

export { apiGetAJInplanList, apiGetDPInplanList, apiGetRTInplanList, apiGetSTInplanList, apiGetWDInplanList };
