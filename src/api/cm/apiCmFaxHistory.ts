/*
 ############################################################################
 # FiledataField	: apiCmFaxHistory.tsx
 # Description		: 팩스 발송 이력 팝업  API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.21
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 팩스 발송 이력 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 팩스 발송 이력 목록
 */
const getPostDataFaxHistlist = (params: any) => {
	return axios
		.post('/api/ext/test/v1.0/getDataFaxHistlist', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

export { getPostDataFaxHistlist };
