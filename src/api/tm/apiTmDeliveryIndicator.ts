/*
 ############################################################################
 # FiledataField	: apiTmDeliveryIndicator.ts
 # Description		: 배차마스터체크결과
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 일자별 차량수당관리 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('api/tm/deliveryIndicator/v1.0/getMasterList', params).then(res => res.data);
};

export { apiGetMasterList };
