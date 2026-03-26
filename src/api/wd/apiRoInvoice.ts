/*
 ############################################################################
 # FiledataField	: apiRoInvoice.ts
 # Description		: 입고 > 입고작업 > 반출명세서출력 조회 API
 # Author			: KimDongHyeon
 # Since			: 2025.07.16
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/wd/roInvoice';

/**
 * 입고 > 입고작업 > 반출명세서출력 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 반출명세서출력 목록 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 반출명세서출력 출력
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPrintMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPrintMasterList', params).then(res => res.data);
};

export { apiPostMasterList, apiPostDetailList, apiPostPrintMasterList };
