/*
 ############################################################################
 # FiledataField	: apiStAdjustmentTRBLExDC.tsx
 # Description		: 외부비축BL내재고이관 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 외부비축BL내재고이관 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부비축BL내재고이관 목록
 */
const apiPostMasterList = (params: any) => {
	return axios
		.post('/api/st/adjustmenttrblexdc/v1.0/getMasterList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 외부비축BL내재고이관 수정
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/st/adjustmenttrblexdc/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiPostMasterList, apiPostSaveMasterList };
