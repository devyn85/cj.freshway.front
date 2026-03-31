/*
 ############################################################################
 # FiledataField	: apiTmCalendar.ts.
 # Description		: 휴일관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.22
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 휴일관리 헤더 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/tm/calendar/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 휴일관리 저장
 * @param params
 * @returns
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('/api/tm/calendar/v1.0/saveConfirm', params).then(res => res.data);
};

/**
 * 달력 생성
 * @param params
 * @returns
 */
const apiPostCreateCalendar = (params: any) => {
	return axios.post('/api/tm/calendar/v1.0/saveCalendar', params).then(res => res.data);
};
export { apiGetMasterList, apiPostCreateCalendar, apiSaveMasterList };
