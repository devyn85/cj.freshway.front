/*
 ############################################################################
 # FiledataField	: apiDpInspectDailyPrint.ts
 # Description		: 입고 > 입고작업 > 일배입고검수출력 조회 API
 # Author			: KimDongHyeon
 # Since			: 2025.07.10
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/dp/inspectDailyPrint';

/**
 * 입고 > 입고작업 > 일배입고검수출력 일배입고검수출력 조회 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 일배입고검수출력 po미맵핑출고현황 조회 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPoNotMapList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPoNotMapList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 일배입고검수출력 입고진행현황상세(구매현황) 조회 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 일배입고검수출력 po미맵핑출고현황상세 조회 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPoNotMapDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPoNotMapDetailList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 일배입고검수출력 일배입고검수지 출력 데이터 (출력유형: 배차변경출력 외) 조회 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPrintMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPrintMasterList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 일배입고검수출력 PO맵핑
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSavePoMapping = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/savePoMapping', params).then(res => res.data);
};

export {
	apiPostMasterList,
	apiPostPoNotMapList,
	apiPostDetailList,
	apiPostPoNotMapDetailList,
	apiPostPrintMasterList,
	apiPostSavePoMapping,
};
