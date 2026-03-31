/*
 ############################################################################
 # FiledataField	: apiStStockLabel.ts
 # Description		: 재고 > 재고현황 > 재고라벨출력 조회 API
 # Author			: sss
 # Since			: 2025.07.31
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/stockLabel';

/**
 * 재고 > 재고현황 > 재고라벨출력 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 재고라벨출력 상세 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiGetDetailList = (params: any) => {
	return axios.get(REQUEST_API + '/v1.0/getDetailList', { params }).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 재고라벨출력 인쇄 List1
 * @param params
 */
const apiPostPrintMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/printMasterList', params).then(res => res.data);
};

export { apiGetDetailList, apiPostMasterList, apiPostPrintMasterList };
