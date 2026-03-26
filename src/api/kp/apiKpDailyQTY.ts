/*
 ############################################################################
 # FiledataField	: apiKpDailyQTY.ts
 # Description		: 지표 > 센터 운영 > 일일 물동량 조회 API
 # Author			: KimDongHan
 # Since			: 2025.09.02
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/kp/dailyQTY';

/**
 * 지표 > 센터 운영 > 일일 물동량 조회 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post('/ltx/kp/dailyQTY/v1.0/getMasterList', params).then(res => res.data);
};

export { apiPostMasterList };
