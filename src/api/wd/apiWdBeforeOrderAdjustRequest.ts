import axios from '@/api/Axios';

/**
 * 사전주문 조정의뢰 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 사전주문 조정의뢰 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/wd/beforeOrderAdjustRequest/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 사전주문 조정의뢰 저장
 * @param {any} params 검색 조건
 * @returns {object} 사전주문 조정의뢰 저장
 */
const apiSaveOrderRequest = (params: any) => {
	return axios.post('/api/wd/beforeOrderAdjustRequest/v1.0/saveOrderRequest', params).then(res => res.data);
};

export { apiGetMasterList, apiSaveOrderRequest };
