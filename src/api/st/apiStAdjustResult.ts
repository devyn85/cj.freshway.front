import axios from '@/api/Axios';

/**
 * 재고감모현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 재고감모현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/st/adjustResult/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 재고감모현황 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 재고감모현황 상세
 */
const apiGetDetailList = (params: any) => {
	return axios.get('/api/st/adjustResult/v1.0/getDetailList', { params }).then(res => res.data);
};

export { apiGetDetailList, apiGetMasterList };
