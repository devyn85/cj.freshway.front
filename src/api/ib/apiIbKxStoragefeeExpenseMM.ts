/*
 ############################################################################
 # FiledataField	: apiIbKxStoragefeeExpense.ts
 # Description		: 비용기표(1000센터)
 # Author			    : ParkYoSep
 # Since			    : 25.12.29
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/ib/kxStoragefeeExpenseMM';

/**
 * 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};
/**
 * 비용기표 확정
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveConfirm = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveConfirm', params).then(res => res.data);
};
/**
 * 비용기표 확정CNLTH
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveConfirmCancel = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveConfirmCancel', params).then(res => res.data);
};
/**
 * 비용기표 Posting
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSavePosting = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/savePosting', params).then(res => res.data);
};

/**
 * 비용기표 Posting 취소
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSavePostingCancel = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/savePostingCancel', params).then(res => res.data);
};

export { apiGetMasterList, apiPostSaveConfirm, apiPostSaveConfirmCancel, apiPostSavePosting, apiPostSavePostingCancel };
