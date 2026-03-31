/*
 ############################################################################
 # FiledataField	: apiStConvertCG.ts
 # Description		: 재고 > 재고속성 > 속성변경 API
 # Author			    : 고혜미
 # Since		    	: 2025.09.18
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/stConvertCG';

/**
 * 조회 api 함수
 * @param params
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

const apiDetailList1 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList1', params).then(res => res.data);
};

const apiDetailList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList2', params).then(res => res.data);
};

/**
 * 저장 - 구현
 * @param {object} params - 저장할 파라미터 객체
 * @returns {Promise<any>} Axios response data
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiDetailList1, apiDetailList2, apiPostMasterList, apiPostSaveMasterList };
