import axios from '@/api/Axios';

/**
 * 이체및출고현황 정보 조회(목록)
 * @param {any} params 검색 조건
 * @returns {object} 이체및출고현황 조회(목록)
 */
const apiGetMasterList = (params: any) => {
	return axios.get('/api/kp/orderQtyStoInfo/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * 이체및출고현황 상세 정보 조회
 * @param {any} params 검색 조건
 * @returns {object} 이체및출고현황 상세 정보 조회
 */
const apiGetDetailList = (params: any) => {
	return axios.get('/api/kp/orderQtyStoInfo/v1.0/getDetailList', { params }).then(res => res.data);
};

export { apiGetDetailList, apiGetMasterList };
