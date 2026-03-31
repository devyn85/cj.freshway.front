/*
 ############################################################################
 # FiledataField	: apiDpUnload.ts
 # Description		: 입고 > 입고작업 > 입고하차관리 조회 API
 # Author			: KimDongHyeon
 # Since			: 2025.07.28
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/dp/unload';

/**
 * 입고 > 입고작업 > 입고하차관리 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 입고하차관리 목록 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 입고하차관리 목록 엑셀 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostExcelList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getExcelList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 입고하차관리 하차등록
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSaveCarLog = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveCarLog', params).then(res => res.data);
};

export { apiPostMasterList, apiPostDetailList, apiPostExcelList, apiPostSaveCarLog };
