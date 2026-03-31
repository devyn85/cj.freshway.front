/*
 ############################################################################
 # FiledataField	: apiIbKxStoragefeeExpense.ts
 # Description		: 보관료 마감
 # Author			    : jangjaehyun
 # Since			    : 25.11.05
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/ib/kxStoragefeeExpense';

/**
 * 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 계산
 * @param params
 * @returns
 */
const apiPostSaveKxStorageExpense = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveKxStorageExpense', params).then(res => res.data);
};

/**
 * 계산 취소
 * @param params
 * @returns
 */
const apiPostCancelKxStorageExpense = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/cancelKxStorageExpense', params).then(res => res.data);
};

export { apiGetMasterList, apiPostCancelKxStorageExpense, apiPostSaveKxStorageExpense };
