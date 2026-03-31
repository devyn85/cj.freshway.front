import axios from '@/api/Axios';

/**
 * 재고재배치 Data 조회
 * @param {any} params 검색 조건
 * @returns {object} 재고재배치 Data 조회
 */
const apiGetDataList = () => {
	return axios.get('/api/om/stockReocation/v1.0/getDataList').then(res => res.data);
};

/**
 * 재고재배치 ai api 요청
 * @param {any} params 검색 조건
 * @returns {object} 재고재배치 ai api 요청
 */
const apiStartOptimization = (params: any) => {
	return axios.post('/api/om/stockReocation/v1.0/startOptimization', params).then(res => res.data);
};

/**
 * 재고재배치 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 재고재배치 Capa 조회
 */
const apiGetDetailList = () => {
	return axios.get('/api/om/stockReocation/v1.0/getDetailList').then(res => res.data);
};

/**
 * 현재고 배차안 asis tobe 상품 비교
 * @param {any} params 검색 조건
 * @returns {object} 현재고 배차안 asis tobe 상품 비교
 */
const apiGetSkuCompareList = (params: any) => {
	return axios.get('/api/om/stockReocation/v1.0/getSkuCompareList', { params }).then(res => res.data);
};

export { apiGetDataList, apiGetDetailList, apiGetSkuCompareList, apiStartOptimization };
