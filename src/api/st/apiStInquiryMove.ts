/*
 ############################################################################
 # FiledataField	: apiMgModifyLog.ts
 # Description		: 재고 > 재고현황 > 조사지시현황 조회 API
 # Author			: sss
 # Since			: 2025.07.31
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/stInquiryMove';

/**
 * 재고 > 재고현황 > 조사지시현황
 * @param params
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post('/api/st/stInquiryMove/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 조사지시현황 - 소비기한
 * @param params
 * @returns {object}  목록
 */
const apiPostTab1DetailList = (params: any) => {
	return axios.post('/api/st/stInquiryMove/v1.0/getTab1DetailList', params).then(res => res.data);
};

// /**
//  * 재고 > 재고현황 > 조사지시현황 - 실사처리 - apiPostTab1DetailList로 통합됨
//  * @param {any} params  검색 조건
//  * @returns {object}  목록
//  */
// const apiPostTab2DetailList = (params: any) => {
// 	return axios.post('/api/st/stInquiryMove/v1.0/getTab2DetailList', params).then(res => res.data);
// };

/**
 * 재고 > 재고현황 > 조사지시현황 저장 List1
 * @param params
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/st/stInquiryMove/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 조사지시현황 저장 List1 - 재고이동 처리
 * @param params
 */
const apiPostSaveMasterList02 = (params: any) => {
	return axios.post('/api/st/stInquiryMove/v1.0/saveMasterList02', params).then(res => res.data);
};

export { apiPostMasterList, apiPostSaveMasterList, apiPostSaveMasterList02, apiPostTab1DetailList };
