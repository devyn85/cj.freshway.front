/*
 ############################################################################
 # FiledataField	: apiMsTplUser.ts
 # Description		: 정산 > 위탁물류 >  화주정보관리 API
 # Author			: ParkYoSep
 # Since			: 2025.10.23
 ############################################################################
*/
import axios from '@/api/Axios';
/**
 * 정산 > 위탁물류 >  화주정보관리 사용자목록 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const getUserList = () => {
	return axios.post('/api/ms/tplUser/v1.0/getUserList').then(res => res.data);
};

/**
 * 정산 > 위탁물류 >  화주정보관리 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apipostDetailList = (params: any) => {
	return axios.post('/api/ms/tplUser/v1.0/getMasterList', params).then(res => res.data);
};
/**
 * 화주정보관리 저장
 * @param params
 * @returns
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('/api/ms/tplUser/v1.0/saveConfirm', params).then(res => res.data);
};

export { apipostDetailList, apiSaveMasterList, getUserList };
