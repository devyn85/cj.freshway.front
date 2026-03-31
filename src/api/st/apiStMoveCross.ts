import axios from '@/api/Axios';

/*
 ############################################################################
 # FiledataField	: apiStMoveCross.ts
 # Description		: 재고 > 재고현황 > CROSS자동보충 조회 API
 # Author			: sss
 # Since			: 2025.08.25
 ############################################################################
*/
const REQUEST_API = '/api/st/moveCross';

/**
 * 재고 > 재고현황 > CROSS자동보충 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > CROSS자동보충 상세 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiGetDetailList = (params: any) => {
	return axios.get(REQUEST_API + '/v1.0/getDetailList', { params }).then(res => res.data);
};

/**
 * 재고 > 재고현황 > CROSS자동보충 인쇄 List1
 * @param params
 */
const apiPostPrintMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/printMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > CROSS자동보충 저장
 * @param params
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiGetDetailList, apiPostMasterList, apiPostPrintMasterList, apiPostSaveMasterList };
