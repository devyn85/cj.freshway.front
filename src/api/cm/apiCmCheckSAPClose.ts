/*
 ############################################################################
 # FiledataField	: apiCmCheckSAPClose.tsx
 # Description		: SAP 마감 체크 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.02
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * SAP 마감 조회
 * @param {any} params 검색 조건
 * @returns {object} SAP 마감 상태
 */
const apiGetStatus = (params: any) => {
	return axios.get('/api/cm/checkSAPClose/v1.0/getStatus', { params }).then(res => res.data);
};

export { apiGetStatus };
