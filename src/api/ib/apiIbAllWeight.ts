/*
 ############################################################################
 # FiledataField	: apiIbAllWeight.ts
 # Description		: 정산 > 정산작업 > 센터별물동량 정산 조회 API
 # Author			: KimDongHyeon
 # Since			: 2025.11.12
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/ib/allWeight';

/**
 * 정산 > 정산작업 > 센터별물동량 정산 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 정산 > 정산작업 > 센터별물동량 정산 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록Print*/
const apiPostMasterList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList2', params).then(res => res.data);
};

/**
 * 정산 > 정산작업 > 센터별물동량 정산 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록Print*/
const apiPostCopyMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/copyMasterList2', params).then(res => res.data);
};

/**
 * 정산 > 정산작업 > 센터별물동량 정산 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록Print*/
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList2', params).then(res => res.data);
};

/**
 * 정산 > 정산작업 > 센터별물동량 정산 엑셀
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostExcel = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getExcel', params, { responseType: 'blob' }).then(res => res);
};

export {
	apiPostMasterList,
	apiPostMasterList2,
	apiPostCopyMasterList,
	apiPostSaveMasterList,
	apiPostExcel,
};
