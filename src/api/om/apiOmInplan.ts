import axios from '@/api/Axios';

/**
 * 주문이력현황 마스터 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 주문이력현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/om/inplan/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 주문이력현황 상세 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 주문이력현황 목록
 */
const apiGetDetailList = (params: any) => {
	return axios.get('/api/om/inplan/v1.0/getDetailList', { params }).then(res => res.data);
};

/**
 * 진행상태 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 주문이력현황 목록
 */
const apiGetStatusList = (params: any) => {
	return axios.get('/api/om/inplan/v1.0/getStatusList', { params }).then(res => res.data);
};

export { apiGetDetailList, apiGetMasterList, apiGetStatusList };
