/*
 ############################################################################
 # FiledataField	: apiStConvertId.ts
 # Description		: 재고 > 재고현황 > PLT-ID변경 조회 API
 # Author			: sss
 # Since			: 2025.08.25
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/convertId';

/**
 * 재고 > 재고현황 > PLT-ID변경 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post('/api/st/convertId/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > PLT-ID변경 상세 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiGetDetailList = (params: any) => {
	return axios.get('/api/st/convertId/v1.0/getDetailList', { params }).then(res => res.data);
};

/**
 * 재고 > 재고현황 > PLT-ID변경 인쇄 List1
 * @param params
 */
const apiPostPrintMasterList = (params: any) => {
	return axios.post('/api/st/convertId/v1.0/printMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > CROSS자동보충 저장
 * @param params
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/st/moveCross/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiGetDetailList, apiPostMasterList, apiPostPrintMasterList };
