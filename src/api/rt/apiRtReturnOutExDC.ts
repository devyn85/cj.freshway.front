/*
 ############################################################################
 # FiledataField	: apiRtReturnOutExDC.tsx
 # Description		: 외부비축협력사반품지시 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.16
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 외부비축협력사반품지시 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부비축협력사반품지시 목록
 */
const apiGetDataHeaderList = (params: any) => {
	return axios.get('/api/rt/returnoutexdc/v1.0/getDataHeaderList', { params }).then(res => res.data);
};

/**
 * 외부비축협력사반품지시 저장
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveConfirm = (params: any) => {
	return axios.post('/api/rt/returnoutexdc/v1.0/saveConfirm', params).then(res => res.data);
};

export { apiGetDataHeaderList, apiPostSaveConfirm };
