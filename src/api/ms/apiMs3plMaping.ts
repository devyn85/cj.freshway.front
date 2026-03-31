/*
 ############################################################################
 # FiledataField	: apiMs3plMaping.ts
 # Description		: 기준정보 > 기준정보작업 > 3PL전산기준목록 조회 API
 # Author			: KimDongHyeon
 # Since			: 2025.11.18
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/ms/3plMaping';

/**
 * 기준정보 > 기준정보작업 > 3PL전산기준목록 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};
/**
 * 기준정보 > 기준정보작업 > 3PL전산기준목록 인쇄 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPrintList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPrintList', params).then(res => res.data);
};
/**
 * 기준정보 > 기준정보작업 > 3PL전산기준목록 엑셀 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostExcelList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getExcelList', params).then(res => res.data);
};

/**
 * 기준정보 > 기준정보작업 > 3PL전산기준목록 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 기준정보 > 기준정보작업 > 3PL전산기준목록 인쇄 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPrintList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPrintList2', params).then(res => res.data);
};
/**
 * 기준정보 > 기준정보작업 > 3PL전산기준목록 엑셀 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostExcelList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getExcelList2', params).then(res => res.data);
};

/**
 * 엑셀 기준정보 > 기준정보작업 > 3PL전산기준목록 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록Print*/
const apiPostMasterList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList2', params).then(res => res.data);
};

/**
 * 기준정보 > 기준정보작업 > 3PL전산기준목록 목록 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList2', params).then(res => res.data);
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
};
