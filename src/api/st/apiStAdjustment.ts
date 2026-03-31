/*
 ############################################################################
 # FiledataField	: apiMgModifyLog.ts
 # Description		: 재고 > 재고현황 > 센터자체감모 조회 API
 # Author			: sss
 # Since			: 2025.07.31
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/adjustment';

/**
 * 재고 > 재고현황 > 센터자체감모 - 변경이력Tab List
 * @param params
 * @returns {object}  목록
 */
const apiPostTab1MasterList = (params: any) => {
	return axios.post('/api/st/adjustment/v1.0/getTab1MasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 센터자체감모 - 상품이력번호변경Tab List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostTab2MasterList = (params: any) => {
	return axios.post('/api/st/adjustment/v1.0/getTab2MasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 센터자체감모 저장 List1
 * @param params
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/st/adjustment/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 센터자체감모 저장 List1
 * @param params
 */
const apiPostsaveZeroStock = (params: any) => {
	return axios.post('/api/st/adjustment/v1.0/saveZeroStock', params).then(res => res.data);
};

/**
 * 창고 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 창고 목록
 */
const apiGetOrganizeList = (params: any) => {
	return axios.get('/api/st/stAdjustResult/v1.0/getOrganizeList', { params }).then(res => res.data);
};

export {
	apiGetOrganizeList,
	apiPostSaveMasterList,
	apiPostsaveZeroStock,
	apiPostTab1MasterList,
	apiPostTab2MasterList,
};
