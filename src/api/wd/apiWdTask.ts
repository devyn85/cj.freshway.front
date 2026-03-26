import axios from '@/api/Axios';

/**
 * 피킹작업지시-조회생성 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 피킹작업지시-조회생성 목록
 */
const apiGetTab1MasterList = (params: any) => {
	return axios.post('/api/wd/task/v1.0/getTab1MasterList', params).then(res => res.data);
};

/**
 * 피킹작업지시-조회생성 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 피킹작업지시-조회생성 상세
 */
const apiGetTab1DetailList = (params: any) => {
	return axios.post('/api/wd/task/v1.0/getTab1DetailList', params).then(res => res.data);
};

/**
 * 피킹작업지시-진행현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 피킹작업지시-진행현황 목록
 */
const apiGetTab2MasterList = (params: any) => {
	return axios.post('/api/wd/task/v1.0/getTab2MasterList', params).then(res => res.data);
};

/**
 * 피킹작업지시-진행현황 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 피킹작업지시-진행현황 상세
 */
const apiGetTab2DetailList = (params: any) => {
	return axios.post('/api/wd/task/v1.0/getTab2DetailList', params).then(res => res.data);
};

/**
 * 피킹작업지시-피킹작업자현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 피킹작업지시-피킹작업자현황 목록 조회
 */
const apiGetTab3MasterList = (params: any) => {
	return axios.post('/api/wd/task/v1.0/getTab3MasterList', params).then(res => res.data);
};

/**
 * 피킹작업지시-조회생성(차량) 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 피킹작업지시-조회생성(차량) 목록
 */
const apiGetTab4MasterList = (params: any) => {
	return axios.post('/api/wd/task/v1.0/getTab4MasterList', params).then(res => res.data);
};

/**
 * 피킹작업지시-피킹리스트 STD 출력 조회
 * @param {any} params 검색 조건
 * @returns {object} 피킹작업지시-피킹리스트 STD 출력 조회
 */
const apiGetPrintSTDList = (params: any) => {
	return axios.post('/api/wd/task/v1.0/getPrintSTDList', params).then(res => res.data);
};

/**
 * 피킹작업지시-피킹리스트 출력 조회
 * @param {any} params 검색 조건
 * @returns {object} 피킹작업지시-피킹리스트 출력 조회
 */
const apiGetPrintList = (params: any) => {
	return axios.post('/api/wd/task/v1.0/getPrintList', params).then(res => res.data);
};

/**
 * 피킹작업지시-피킹리스트 멀티 출력 조회
 * @param {any} params 검색 조건
 * @returns {object} 피킹작업지시-피킹리스트 멀티 출력 조회
 */
const apiGetMultiPrintList = (params: any) => {
	return axios.post('/api/wd/task/v1.0/getMultiPrintList', params).then(res => res.data);
};

/**
 * 피킹작업지시-PLT바코드 출력 조회
 * @param {any} params 검색 조건
 * @returns {object} 피킹작업지시-PLT바코드 출력 조회
 */
const apiGetPrintBarcodeList = (params: any) => {
	return axios.post('/api/wd/task/v1.0/getPrintBarcodeList', params).then(res => res.data);
};

/**
 * 피킹지시 배치
 * @param {any} params 검색 조건
 * @returns {object} 피킹지시 배치
 */
const apiSavePickingBatch = (params: any) => {
	return axios.post('/api/wd/task/v1.0/savePickingBatch', params).then(res => res.data);
};

/**
 * 수동피킹 배치
 * @param {any} params 검색 조건
 * @returns {object} 수동피킹 배치
 */
const apiSaveManualPickingBatch = (params: any) => {
	return axios.post('/api/wd/task/v1.0/saveManualPickingBatch', params).then(res => res.data);
};

/**
 * 모바일피킹지시 배치
 * @param {any} params 검색 조건
 * @returns {object} 모바일피킹지시 배치
 */
const apiSaveMobilePickingBatch = (params: any) => {
	return axios.post('/api/wd/task/v1.0/saveMobilePickingBatch', params).then(res => res.data);
};

/**
 * 피킹분리 배치
 * @param {any} params 검색 조건
 * @returns {object} 피킹분리 배치
 */
const apiSaveDivisionTask = (params: any) => {
	return axios.post('/api/wd/task/v1.0/saveDivisionTask', params).then(res => res.data);
};

/**
 * 피킹병합 배치
 * @param {any} params 검색 조건
 * @returns {object} 피킹병합 배치
 */
const apiSaveMergeTask = (params: any) => {
	return axios.post('/api/wd/task/v1.0/saveMergeTask', params).then(res => res.data);
};

/**
 * 피킹생성취소
 * @param {any} params 검색 조건
 * @returns {object} 피킹생성취소
 */
const apiSavePickingBatchDelete = (params: any) => {
	return axios.post('/api/wd/task/v1.0/savePickingBatchDelete', params).then(res => res.data);
};

export {
	apiGetMultiPrintList,
	apiGetPrintBarcodeList,
	apiGetPrintList,
	apiGetPrintSTDList,
	apiGetTab1DetailList,
	apiGetTab1MasterList,
	apiGetTab2DetailList,
	apiGetTab2MasterList,
	apiGetTab3MasterList,
	apiGetTab4MasterList,
	apiSaveDivisionTask,
	apiSaveManualPickingBatch,
	apiSaveMergeTask,
	apiSaveMobilePickingBatch,
	apiSavePickingBatch,
	apiSavePickingBatchDelete,
};
