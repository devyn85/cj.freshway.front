/*
 ############################################################################
 # FiledataField	: apiMgModifyLog.ts
 # Description		: 재고 > 재고현황 > 재고변경사유현황 조회 API
 # Author			: sss
 # Since			: 2025.07.31
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/mg/mgModifyLog';

/**
 * 재고 > 재고현황 > 재고변경사유현황 - 변경이력Tab List
 * @param params
 * @returns {object}  목록
 */
const apiPostTab1MasterList = (params: any) => {
	return axios.post('/api/mg/mgModifyLog/v1.0/getTab1MasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 재고변경사유현황 - 상품이력번호변경Tab List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostTab2MasterList = (params: any) => {
	return axios.post('/api/mg/mgModifyLog/v1.0/getTab2MasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 재고변경사유현황 인쇄 List1
 * @param params
 */
const apiPostPrintMasterList = (params: any) => {
	return axios.post('/api/mg/mgModifyLog/v1.0/printMasterList', params).then(res => res.data);
};

export { apiPostPrintMasterList, apiPostTab1MasterList, apiPostTab2MasterList };
