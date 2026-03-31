/*
 ############################################################################
 # FiledataField	: apiStConvertContractSN.tsx
 # Description		: 상품이력계약정보변경
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.11.14
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 상품이력계약정보변경 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/st/convertContractSN/v1.0/getDataHeaderList', params).then(res => res.data);
};

/**
 * 상품이력계약정보변경 저장
 * @param params
 * @returns
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('/api/st/convertContractSN/v1.0/saveConfirm', params).then(res => res.data);
};
export { apiGetMasterList, apiSaveMasterList };
