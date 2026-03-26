/*
 ############################################################################
 # FiledataField	: apiIbKxStoragefeeMonth.ts
 # Description		: 일별 보관료 계산 
 # Author			    : jangjaehyun
 # Since			    : 25.11.05
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/ib/kxStoragefeeMonth';

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
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 계산취소
 * @param params
 * @returns
 */
const apiPostSaveClose = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveClose', params).then(res => res.data);
};

export { apiGetMasterList, apiPostSaveClose, apiPostSaveMasterList };
