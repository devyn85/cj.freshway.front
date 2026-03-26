/*
 ############################################################################
 # FiledataField	: apiTmManageEntity.tsx
 # Description		: ​​정산항목관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.04
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * ​​정산항목관리 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/tm/manageEntity/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * ​​정산항목관리 저장
 * @param params
 * @returns
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('/api/tm/manageEntity/v1.0/saveConfirm', params).then(res => res.data);
};
export { apiGetMasterList, apiSaveMasterList };
