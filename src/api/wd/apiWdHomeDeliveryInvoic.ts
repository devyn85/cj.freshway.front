import axios from '@/api/Axios';

/**
 * 출고진행현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고진행현황 목록
 */
const apiGetDeliveryStatus = (params: any) => {
	return axios.post('/api/wd/homeDeliveryInvoice/v1.0/getDeliveryStatus', params).then(res => res.data);
};

/**
 * 주문변경내역 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 주문변경내역 목록
 */
const apiGetDocumentModify = (params: any) => {
	return axios.post('/api/wd/homeDeliveryInvoice/v1.0/getDocumentModify', params).then(res => res.data);
};

export { apiGetDeliveryStatus, apiGetDocumentModify };
