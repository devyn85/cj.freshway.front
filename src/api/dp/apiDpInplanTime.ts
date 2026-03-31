/*
 ############################################################################
 # FiledataField	: apiDpInplanTime.ts
 # Description		: 입고 > 입고현황 > 입고 예정진행 현황(입차시간) API
 # Author			: KimDongHan
 # Since			: 2025.12.01
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/dp/inplanTime';

/**
 * 입고 > 입고현황 > 입고 예정진행 현황(입차시간) 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

export { apiPostMasterList };
