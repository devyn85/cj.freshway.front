/*
 ############################################################################
 # FiledataField	: apiTmResultTempCar.tsx
 # Description		: 일별임시차현황
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.06
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 일별임시차현황 마스터 리스트 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/tm/resultTempCar/v1.0/getMasterList', params).then(res => res.data);
};
export { apiGetMasterList };
