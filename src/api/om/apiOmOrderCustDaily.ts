import axios from '@/api/Axios';

/**
 * 일배협력사별주문현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 일배협력사별주문현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/om/omOrderCustDaily/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 일배협력사별주문현황 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 일배협력사별주문현황 상세
 */
const apiGetDetailList = (params: any) => {
	return axios.post('/api/om/omOrderCustDaily/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 일배협력사별주문현황 프린트 조회
 * @param {any} params 검색 조건
 * @returns {object} 일배협력사별주문현황 프린트
 */
const apiGetDataPrintList = (params: any) => {
	return axios.post('/api/om/omOrderCustDaily/v1.0/getDataPrintList', params).then(res => res.data);
};

export { apiGetDataPrintList, apiGetDetailList, apiGetMasterList };
