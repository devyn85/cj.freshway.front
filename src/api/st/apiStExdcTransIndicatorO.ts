/*
 ############################################################################
 # FiledataField	: apiStConvertLotExDC.tsx
 # Description		: 외부비축소비기한변경 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.16
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 외부비축소비기한변경 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부비축소비기한변경 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/st/exdcTransIndicatorO/v1.0/getMasterList', params).then(res => res.data);
};

export { apiGetMasterList };
