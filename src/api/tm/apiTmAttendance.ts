/*
 ############################################################################
 # FiledataField	: apiTmAttendance.ts
 # Description		: 근태관리 검색
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.09.16
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 근태관리 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('api/tm/attendance/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 근태관리 목록 저장
 * @param {any} params	요청 파라미터
 * @returns {object}	응답값
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('api/tm/attendance/v1.0/saveConfirm', params).then(res => res.data);
};

export { apiGetMasterList, apiSaveMasterList };
