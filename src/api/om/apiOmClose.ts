import axios from '@/api/Axios';

/**
 * 주문마감현황 마스터 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 주문이력현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.get('/api/om/close/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * 주문마감현황 상세 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 주문이력현황 목록
 */
const apiGetDetailList = (params: any) => {
	return axios.get('/api/om/close/v1.0/getDetailList', { params }).then(res => res.data);
};

/**
 * 주문마감현황 상세2 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 주문이력현황 목록
 */
const apiGetDetail2List = (params: any) => {
	return axios.get('/api/om/close/v1.0/getDetail2List', { params }).then(res => res.data);
};

export { apiGetDetail2List, apiGetDetailList, apiGetMasterList };
