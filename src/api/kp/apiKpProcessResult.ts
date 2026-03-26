/*
 ############################################################################
 # FiledataField	: apiKpProcessResult.tsx
 # Description		: 공정별생산성 API
 # Author			    : 박요셉 (medstorm@cj.net)
 # Since			    : 25.12.18
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 센터별 List 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetTab1MasterList = (params: any) => {
	return axios.post('/api/kp/processResult/v1.0/getTab1MasterList', params).then(res => res.data);
};
/**
 * 작업자별 List 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetTab2MasterList = (params: any) => {
	return axios.post('/api/kp/processResult/v1.0/getTab2MasterList', params).then(res => res.data);
};
/**
 * Raw List 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetTab3MasterList = (params: any) => {
	return axios.post('/api/kp/processResult/v1.0/getTab3MasterList', params).then(res => res.data);
};

export { apiGetTab1MasterList, apiGetTab2MasterList, apiGetTab3MasterList };
