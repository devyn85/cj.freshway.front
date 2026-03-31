/*
 ############################################################################
 # FiledataField	: apiStDailyOnhandQtyAPI.tsx
 # Description		: 외부창고 API 재고현황 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.09.04
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 외부창고API재고현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부창고API재고현황 목록
 */
const apiPostMasterList = (params: any) => {
	return axios
		.post('/api/st/dailyonhandqtyapi/v1.0/getMasterList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

export { apiPostMasterList };
