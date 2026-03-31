/*
 ############################################################################
 # FiledataField	: apiDpSkuLabel.ts
 # Description		: 입고 > 입고작업 > 입고라벨출력 조회 API
 # Author			: KimDongHyeon
 # Since			: 2025.08.07
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/dp/skuLabel';

/**
 * 입고 > 입고작업 > 입고라벨출력 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 입고라벨출력 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 입고라벨출력 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList2', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 입고라벨출력 목록 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList2', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 입고라벨출력 zone
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostZone = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getZone', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 입고라벨출력 인쇄 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPrintList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPrintList', params).then(res => res.data);
};

export { apiPostMasterList, apiPostMasterList2, apiPostDetailList, apiPostDetailList2, apiPostZone, apiPostPrintList };
