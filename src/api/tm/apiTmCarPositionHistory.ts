/*
 ############################################################################
 # FiledataField	: apiTmCarPositionHistory.ts
 # Description		: 배송 > 차량관제 > 운행일지
 # Author			: JiHoPark
 # Since			: 2025.11.14.
 ############################################################################
*/
import axios from '@/api/Axios';

/**
 * 운행일지 - 운행일지 목록 조회
 * @param {any} params 운행일지 목록 검색 조건
 * @returns {object} 운행일지 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/tm/carpositionhistory/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 운행일지 - 운행일지 상세 목록 조회
 * @param {any} params 운행일지 상세 목록 검색 조건
 * @returns {object} 운행일지 상세 목록
 */
const apiGetMasterList2 = (params: any) => {
	return axios.post('/api/tm/carpositionhistory/v1.0/getMasterList2', params).then(res => res.data);
};

/**
 * 출차지시처리 - report 정보 조회
 * @param {any} params report 정보 목록 검색 조건
 * @returns {object} report 정보 목록
 */
const apiGetCarPositionHistoryInfo = (params: any) => {
	return axios.post('/api/tm/carpositionhistory/v1.0/getCarPositionHistoryInfo', params).then(res => res.data);
};

export { apiGetCarPositionHistoryInfo, apiGetMasterList, apiGetMasterList2 };
