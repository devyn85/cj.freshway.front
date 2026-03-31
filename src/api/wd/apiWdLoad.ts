/*
 ############################################################################
 # FiledataField	: apiWdLoad.ts
 # Description		: 출고 > 출차지시 > 출차지시처리
 # Author			: JiHoPark
 # Since			: 2025.11.12.
 ############################################################################
*/
import axios from '@/api/Axios';

/**
 * 출차지시처리 - 출차지시처리 목록 조회
 * @param {any} params 출차지시처리 목록 검색 조건
 * @returns {object} 출차지시처리 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/wd/load/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 출차지시처리 - 출차지시처리 상세 목록 조회
 * @param {any} params 출차지시처리 상세 목록 검색 조건
 * @returns {object} 출차지시처리 상세 목록
 */
const apiGetMasterList2 = (params: any) => {
	return axios.post('/api/wd/load/v1.0/getMasterList2', params).then(res => res.data);
};

/**
 * 출차지시처리 - report 정보 조회
 * @param {any} params report 정보 목록 검색 조건
 * @returns {object} report 정보 목록
 */
const apiGetLoadReportInfo = (params: any) => {
	return axios.post('/api/wd/load/v1.0/getLoadReportInfo', params).then(res => res.data);
};

export { apiGetLoadReportInfo, apiGetMasterList, apiGetMasterList2 };
