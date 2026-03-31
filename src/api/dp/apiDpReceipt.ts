/*
 ############################################################################
 # FiledataField	: apiDpReceipt.ts
 # Description		: 입고 > 입고작업 > 입고확정처리 조회 API
 # Author			: KimDongHyeon
 # Since			: 2025.08.22
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/dp/receipt';
const LTX_REQUEST_API = '/ltx/dp/receipt';

/**
 * 입고 > 입고작업 > 입고확정처리 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};
/**
 * 입고 > 입고작업 > 입고확정처리 인쇄 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPrintList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPrintList', params).then(res => res.data);
};
/**
 * 입고 > 입고작업 > 입고확정처리 엑셀 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostExcelList = (params: any) => {
	return axios.post(LTX_REQUEST_API + '/v1.0/getExcelList', params, { responseType: 'blob' }).then(res => res);
};

/**
 * 입고 > 입고작업 > 입고확정처리 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 입고확정처리 인쇄 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPrintList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPrintList2', params).then(res => res.data);
};
/**
 * 입고 > 입고작업 > 입고확정처리 엑셀 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostExcelList2 = (params: any) => {
	return axios.post(LTX_REQUEST_API + '/v1.0/getExcelList2', params, { responseType: 'blob' }).then(res => res);
};

/**
 * 엑셀 입고 > 입고작업 > 입고확정처리 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록Print*/
const apiPostMasterList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList2', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 입고확정처리 목록 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList2', params).then(res => res.data);
};

/**
 * 세금계산서 발행여부 조회
 * @param {any} params 검색 조건
 * @returns {object} 세금계산서 발행여부
 */
const apiGetBillYn = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getBillYn', params).then(res => res.data);
};

/**
 * 역 STO
 * @param {any} params 검색 조건
 * @returns {object} 세금계산서 발행여부
 */
const apiPostReverseSto = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/reverseSto', params).then(res => res.data);
};

export {
	apiPostMasterList,
	apiPostMasterList2,
	apiPostDetailList,
	apiPostDetailList2,
	apiPostPrintList,
	apiPostPrintList2,
	apiPostExcelList,
	apiPostExcelList2,
	apiGetBillYn,
	apiPostReverseSto,
};
