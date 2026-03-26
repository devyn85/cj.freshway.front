/*
 ############################################################################
 # FiledataField	: apiTmAllocationCheck.tsx
 # Description		: 배차마스터체크결과
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 배차마스터체크결과 헤더 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/tm/allocationCheck/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 배차마스터체크결과 상세 조회
 * @param params
 * @returns
 */
const apiGetDetailList = (params: any) => {
	return axios.get('/api/tm/allocationCheck/v1.0/getDetailList', { params }).then(res => res.data);
};
export { apiGetDetailList, apiGetMasterList };
