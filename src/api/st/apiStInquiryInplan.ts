/*
 ############################################################################
 # FiledataField	: apiStInquiryInplan.ts
 # Description		: 재고 > 재고조사 > 재고 실사 지시 API
 # Author			: KimDongHan
 # Since			: 2025.10.28
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/inquiryInplan';

/**
 * 재고 > 재고조사 > 재고 실사 지시 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고조사 > 재고 실사 지시 조사명칭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostInquiryName = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getInquiryName', params).then(res => res.data);
};

/**
 * 재고 > 재고조사 > 재고 실사 지시 저장
 * @param {any} params
 * @returns {object}
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiPostInquiryName, apiPostMasterList, apiPostSaveMasterList };
