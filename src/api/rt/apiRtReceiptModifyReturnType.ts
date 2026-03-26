/*
 ############################################################################
 # FiledataField	: apiRtReceiptModifyReturnType.ts
 # Description		: 반품 > 반품작업 > 반품회수/미회수변경 조회 API
 # Author			: KimDongHyeon
 # Since			: 2025.09.10
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/rt/receiptModifyReturnType';

/**
 * 반품 > 반품작업 > 반품회수/미회수변경 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 반품 > 반품작업 > 반품회수/미회수변경 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

export {
	apiPostMasterList,
	apiPostSaveMasterList,
};
