/*
 ############################################################################
 # FiledataField	: apiTmInplanMessage.ts.tsx
 # Description		: 배송전달사항
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.05
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 배송전달사항 헤더 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/tm/inplanMessage/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 배송전달사항 저장
 * @param params
 * @returns
 */
const apisaveMasterList = (params: any) => {
	return axios.post('/api/tm/inplanMessage/v1.0/saveConfirm', params).then(res => res.data);
};
export { apiGetMasterList, apisaveMasterList };
