/*
 ############################################################################
 # FiledataField	: apiDpReceiptBox.ts
 # Description		: 입고 > 입고작업 > 입고확정처리(수원3층) 조회 API
 # Author			: KimDongHyeon
 # Since			: 2025.09.08
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/dp/receiptBox';

/**
 * 입고 > 입고작업 > 입고확정처리(수원3층) 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};
/**
 * 입고 > 입고작업 > 입고확정처리(수원3층) 인쇄 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPrintList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPrintList', params).then(res => res.data);
};
/**
 * 입고 > 입고작업 > 입고확정처리(수원3층) 엑셀 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostExcelList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getExcelList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 입고확정처리(수원3층) 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 입고확정처리(수원3층) PLTID
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMaxStockId = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMaxStockId', params).then(res => res.data);
};

export { apiPostMasterList, apiPostDetailList, apiPostPrintList, apiPostExcelList, apiPostMaxStockId };
