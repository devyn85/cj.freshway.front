import axios from '@/api/Axios';

/**
 * PO 발주현황 조회
 * @param {any} params 검색 조건
 * @returns {object} PO 발주현황 조회
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/om/purchaseMonitoring/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 발주추이 조회
 * @param {any} params 검색 조건
 * @returns {object} 발주추이 조회
 */
const apiGetGraphList = (params: any) => {
	return axios.get('/api/om/purchaseMonitoring/v1.0/getGraphList', { params }).then(res => res.data);
};

export { apiGetGraphList, apiGetMasterList };
