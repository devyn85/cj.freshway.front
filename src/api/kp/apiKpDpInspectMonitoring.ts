import axios from '@/api/Axios';

/**
 * 지표/모니터링 > 검수지표 > 입고검수현황
 * @param {any} params 검색 조건
 * @returns {object} 입고검수현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/ltx/kp/dpInspectMonitoring/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 지표/모니터링 > 검수지표 > 입고검수현황
 * @param {any} params 검색 조건
 * @returns {object} 입고검수현황 상세
 */
const apiGetDetailList = (params: any) => {
	return axios.post('/api/kp/dpInspectMonitoring/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 지표/모니터링 > 검수지표 > 입고검수현황 - 검수완료 버튼
 * @param {any} params [문서내역] -삭제오더초기화
 * @returns {object}
 */
const apiPostSaveInspectAll = (params: any) => {
	return axios.post('/api/kp/dpInspectMonitoring/v1.0/saveInspectAll', params).then(res => res);
};

/**
 * 지표/모니터링 > 검수지표 > 입고검수현황 - 검수완료 버튼
 * @param {any} params [문서내역] -삭제오더초기화
 * @returns {object}
 */
const apiPostSaveInspect = (params: any) => {
	return axios.post('/api/kp/dpInspectMonitoring/v1.0/saveInspect', params).then(res => res);
};

/**
 * 검수확인서 출력 (마스터 그리드)
 * @param params
 */
const apiGetPrintData = (params: any) => {
	return axios.post('/api/kp/dpInspectMonitoring/v1.0/getPrintData', params).then(res => res.data);
};

/**
 * 지표/모니터링 > 검수지표 > 입고검수현황 - SMS1차전송 버튼 (일괄)
 * @param {any} params
 * @returns {object}
 */
const apiPostSaveSendSMSAll = (params: any) => {
	return axios.post('/api/kp/dpInspectMonitoring/v1.0/saveSendSMSAll', params).then(res => res);
};

/**
 * 지표/모니터링 > 검수지표 > 입고검수현황 - SMS2차전송 버튼 (일괄)
 * @param {any} params
 * @returns {object}
 */
const apiPostSaveSendSMSAllResend = (params: any) => {
	return axios.post('/api/kp/dpInspectMonitoring/v1.0/saveSendSMSAllResend', params).then(res => res);
};

/**
 * 지표/모니터링 > 검수지표 > 입고검수현황 - SMS1차전송 버튼 (단건)
 * @param {any} params
 * @returns {object}
 */
const apiPostSaveSendSMS = (params: any) => {
	return axios.post('/api/kp/dpInspectMonitoring/v1.0/saveSendSMS', params).then(res => res);
};

/**
 * 지표/모니터링 > 검수지표 > 입고검수현황 - SMS2차전송 버튼 (단건)
 * @param {any} params
 * @returns {object}
 */
const apiPostSaveSendSMSResend = (params: any) => {
	return axios.post('/api/kp/dpInspectMonitoring/v1.0/saveSendSMSResend', params).then(res => res);
};

const apiGetDataExcelList = (params: any) => {
	return axios.post('/api/kp/dpInspectMonitoring/v1.0/getDataExcelList', params).then(res => res.data);
};

export {
	apiGetDataExcelList,
	apiGetDetailList,
	apiGetMasterList,
	apiGetPrintData,
	apiPostSaveInspect,
	apiPostSaveInspectAll,
	apiPostSaveSendSMS,
	apiPostSaveSendSMSAll,
	apiPostSaveSendSMSAllResend,
	apiPostSaveSendSMSResend,
};
