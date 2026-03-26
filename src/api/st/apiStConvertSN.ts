/*
 ############################################################################
 # FiledataField	: apiStConvertSN.ts
 # Description		: 재고 > 재고조정 > 상품이력번호변경 API
 # Author			: KimDongHan
 # Since			: 2025.09.11
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/convertSN';

/**
 * 재고 > 재고조정 > 상품이력번호변경 마스터 조회 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고조정 > 상품이력번호변경 재고현황_탭 조회 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailT1List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailT1List', params).then(res => res.data);
};

/**
 * 재고 > 재고조정 > 상품이력번호변경 입출이력_탭 조회 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailT2List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailT2List', params).then(res => res.data);
};

/**
 * 재고 > 재고조정 > 상품이력번호변경 입출이력_탭 조회 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiPostDetailT1List, apiPostDetailT2List, apiPostMasterList, apiPostSaveMasterList };
