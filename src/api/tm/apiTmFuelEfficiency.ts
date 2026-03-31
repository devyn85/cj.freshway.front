/*
 ############################################################################
 # FiledataField	: apiTmFuelEfficiency.ts
 # Description		: 연비관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.09.10
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 연비관리 헤더 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/tm/fuelEfficiency/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 연비관리 저장
 * @param params
 * @returns
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('/api/tm/fuelEfficiency/v1.0/saveConfirm', params).then(res => res.data);
};
export { apiGetMasterList, apiSaveMasterList };
