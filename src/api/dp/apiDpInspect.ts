import axios from '@/api/Axios';

/**
 * 입고검수처리 마스터
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetDpInspectMasterList = (params: any) => {
	return axios.post('/api/dp/inspect/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 입고검수처리 총량
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetDpInspectTotalList = (params: any) => {
	return axios.post('/api/dp/inspect/v1.0/getTotalList', params).then(res => res.data);
};

/**
 * 입고검수처리 일배상세
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetDpInspectDetailList = (params: any) => {
	return axios.post('/api/dp/inspect/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 입고검수처리 저장
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiPostSaveMaster = (params: any) => {
	return axios.post('/api/dp/inspect/v1.0/saveMaster', params).then(res => res.data);
};

export { apiGetDpInspectDetailList, apiGetDpInspectMasterList, apiGetDpInspectTotalList, apiPostSaveMaster };
