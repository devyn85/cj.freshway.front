/*
 ############################################################################
 # FiledataField	: apiIbStoWeight.ts
 # Description		: 정산 > 정산작업 > 센터별물동량 조회 API
 # Author			: KimDongHyeon
 # Since			: 2025.10.24
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/ib/stoWeight';

/**
 * 정산 > 정산작업 > 센터별물동량 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};
/**
 * 정산 > 정산작업 > 센터별물동량 인쇄 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPrintList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPrintList', params).then(res => res.data);
};
/**
 * 정산 > 정산작업 > 센터별물동량 엑셀 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostExcelList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getExcelList', params).then(res => res.data);
};

/**
 * 정산 > 정산작업 > 센터별물동량 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 정산 > 정산작업 > 센터별물동량 인쇄 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPrintList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPrintList2', params).then(res => res.data);
};
/**
 * 정산 > 정산작업 > 센터별물동량 엑셀 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostExcelList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getExcelList2', params).then(res => res.data);
};

/**
 * 엑셀 정산 > 정산작업 > 센터별물동량 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록Print
 */
const apiPostMasterList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList2', params).then(res => res.data);
};

/**
 * 엑셀 정산 > 정산작업 > 센터별물동량 전월복사
 * @param {any} params  검색 조건
 * @returns {object}  목록Print
 */
const apiPostCopyMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/copyMasterList', params).then(res => res.data);
};

/**
 * 엑셀 정산 > 정산작업 > 센터별물동량 저장
 * @param {any} params  검색 조건
 * @returns {object}  목록Print
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 엑셀 정산 > 정산작업 > 센터별물동량 저장
 * @param {any} params  검색 조건
 * @returns {object}  목록Print
 */
const apiPostSaveBatchMasterList = (params: any) => {
	return axios.post('/ltx/ib/stoWeight/v1.0/saveBatchMasterList', params).then(res => res.data);
};

/**
 *정산 > 정산작업 > 센터별물동량 유효성검사
 * @param {any} params  검색 조건
 * @returns {object}  목록Print
 */
const apiPostExcelValChk = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getExcelValChk', params).then(res => res.data);
};

export {
	apiPostCopyMasterList,
	apiPostDetailList,
	apiPostExcelList,
	apiPostExcelList2,
	apiPostExcelValChk,
	apiPostMasterList,
	apiPostMasterList2,
	apiPostPrintList,
	apiPostPrintList2,
	apiPostSaveBatchMasterList,
	apiPostSaveMasterList,
};
