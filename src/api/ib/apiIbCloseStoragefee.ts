/*
 ############################################################################
 # FiledataField	: apiIbCloseStoragefeeClose.ts
 # Description		: 보관료 마감 처리 
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.29
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/ib/closeStoragefee';

/**
 * 현황조회
 * @param params
 * @returns
 */
const apiGetDataStatusHeaderlist = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDataStatusHeaderlist', params).then(res => res.data);
};

/**
 * 마감 조회
 * @param params
 * @returns
 */
const apigetDataHeaderlist = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDataHeaderlist', params).then(res => res.data);
};

/**
 * 저장
 * @param params
 * @returns
 */
const apiSaveClose = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveClose', params).then(res => res.data);
};

/**
 * 마감/마감취소
 * @param params
 * @returns
 */
const apiSaveCloseStoragefee = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveCloseStoragefee', params).then(res => res.data);
};

/**
 * 강제마감
 * @param params
 * @returns
 */
const apiSaveCloseStoragefeeWMS = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveCloseStoragefeeWMS', params).then(res => res.data);
};

/**
 * 마감내역조회
 * @param params
 * @returns
 */
const apiGetDataRead = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDataRead', params).then(res => res.data);
};
export {
	apigetDataHeaderlist,
	apiGetDataRead,
	apiGetDataStatusHeaderlist,
	apiSaveClose,
	apiSaveCloseStoragefee,
	apiSaveCloseStoragefeeWMS,
};
