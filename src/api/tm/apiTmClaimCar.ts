/*
 ############################################################################
 # FiledataField	: apiTmClaimCar.ts.
 # Description		: 클레임정보(RDC검증중)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.05
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 클레임정보(RDC검증중) 헤더 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/tm/claimCar/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 클레임정보(RDC검증중) 서브 조회
 * @param params
 * @returns
 */
const apiGetDetailList = (params: any) => {
	return axios.post('/api/tm/claimCar/v1.0/getMaster1List', params).then(res => res.data);
};

/**
 * 클레임정보(RDC검증중) 클레임 세분류 리스트 조회
 * @param params
 * @returns
 */
const getClaimDtlList = (params: any) => {
	return axios.post('/api/tm/claimCar/v1.0/getClaimDtlList', params).then(res => res.data);
};
/**
 * 클레임정보(RDC검증중) 저장
 * @param params
 * @returns
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('/api/tm/claimCar/v1.0/saveConfirm', params).then(res => res.data);
};
export { apiGetDetailList, apiGetMasterList, apiSaveMasterList, getClaimDtlList };
