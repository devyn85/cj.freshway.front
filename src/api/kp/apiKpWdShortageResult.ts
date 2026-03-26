/*
 ############################################################################
 # FiledataField	: apiKpWdShortageResult.ts
 # Description		: 지표/모니터링 > 센터운영지표 > 출고결품실적 API
 # Author			: KimDongHan
 # Since			: 2025.12.02
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/kp/wdShortageResult';

/**
 * 지표/모니터링 > 센터운영지표> 출고결품실적 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostColList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getColList', params).then(res => res.data);
};

/**
 * 지표/모니터링 > 센터운영지표> 출고결품실적 월요약 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT1List = (params: any) => {
	return axios.post('/ltx/kp/wdShortageResult/v1.0/getMasterT1List', params).then(res => res.data);
};

/**
 * 지표/모니터링 > 센터운영지표> 출고결품실적 월요약 상세 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailT1List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailT1List', params).then(res => res.data);
};

/**
 * 지표/모니터링 > 센터운영지표> 출고결품실적 일요약 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT2List = (params: any) => {
	return axios.post('/ltx/kp/wdShortageResult/v1.0/getMasterT2List', params).then(res => res.data);
};

export { apiPostColList, apiPostDetailT1List, apiPostMasterT1List, apiPostMasterT2List };
