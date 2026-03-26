/*
 ############################################################################
 # FiledataField	: apiTmMultiPopAllocation.tsx
 # Description		: 거래처별이중 POP 배차 현황 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.23
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 거래처별이중 POP 배차 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 거래처별이중 POP 배차 목록
 */
const apiPostMasterList = (params: any) => {
	return axios
		.post('/api/tm/multipopallocation/v1.0/getMasterList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 배차조정 저장
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveTmInplan = (params: any) => {
	return axios.post('/api/tm/multipopallocation/v1.0/saveTmInplan', params).then(res => res.data);
};

export { apiPostMasterList, apiPostSaveTmInplan };
