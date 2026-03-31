/*
 ############################################################################
 # FiledataField	: apiWdVsrModify.ts
 # Description		: 출고 > 출고 > CS 출고 정정 요청 대응 API
 # Author			: KimDongHan
 # Since			: 2025.10.21
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/wd/vsrModify';

/**
 * 출고 > 출고 > CS 출고 정정 요청 대응 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 출고 > 출고 > CS 출고 정정 요청 대응 저장
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiPostMasterList, apiPostSaveMasterList };
