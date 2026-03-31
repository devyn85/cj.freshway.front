/*
 ############################################################################
 # FiledataField	: apiStLocMove.ts
 # Description		: 재고 > 재고현황 > 재고일괄이동 조회 API
 # Author			: sss
 # Since			: 2025.07.31
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/locMove';

/**
 * 재고 > 재고현황 > 재고일괄이동 - 변경이력Tab List
 * @param params
 * @returns {object}  목록
 */
const apiPostTab1MasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getTab1MasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 재고일괄이동 - 상품이력번호변경Tab List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostTab2MasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getTab2MasterList', params).then(res => res.data);
};

/**
 * 저장 - 구현
 * @param {object} params - 저장할 파라미터 객체
 * @returns {Promise<any>} Axios response data
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiPostSaveMasterList, apiPostTab1MasterList, apiPostTab2MasterList };
