/*
 ############################################################################
 # FiledataField	: apiRtReturnOut.ts
 # Description		: 반품 > 반품작업 > 협력사반품지시 조회 API
 # Author			: KimDongHyeon
 # Since			: 2025.10.13
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/rt/returnOut';

/**
 * 반품 > 반품작업 > 협력사반품지시 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};
/**
 * 반품 > 반품작업 > 협력사반품지시 인쇄 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPrintList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPrintList', params).then(res => res.data);
};
/**
 * 반품 > 반품작업 > 협력사반품지시 엑셀 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostExcelList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getExcelList', params).then(res => res.data);
};

/**
 * 반품 > 반품작업 > 협력사반품지시 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 반품 > 반품작업 > 협력사반품지시 인쇄 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPrintList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPrintList2', params).then(res => res.data);
};
/**
 * 반품 > 반품작업 > 협력사반품지시 엑셀 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostExcelList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getExcelList2', params).then(res => res.data);
};

/**
 * 엑셀 반품 > 반품작업 > 협력사반품지시 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록Print*/
const apiPostMasterList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList2', params).then(res => res.data);
};

/**
 * 반품 > 반품작업 > 협력사반품지시 목록 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList2', params).then(res => res.data);
};

/**
 * 반품 > 반품작업 > 협력사반품지시 저장
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSaveMaster = (params: any) => {
	return axios.post('/api/dp/inspect/v1.0/saveMaster', params).then(res => res.data);
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
	apiPostSaveMaster,
};
