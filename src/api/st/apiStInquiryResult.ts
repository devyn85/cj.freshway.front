/*
 ############################################################################
 # FiledataField	: apiMgModifyLog.ts
 # Description		: 재고 > 재고현황 > 조사지시현황 조회 API
 # Author			: sss
 # Since			: 2025.07.31
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/stInquiryResult';

/**
 * 재고 > 재고현황 > 조사지시현황 - 변경이력Tab List
 * @param params
 * @returns {object}  목록
 */
const apiPostTab1MasterList = (params: any) => {
	return axios.post('/api/st/stInquiryResult/v1.0/getTab1MasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 조사지시현황 - 상품이력번호변경Tab List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostTab2MasterList = (params: any) => {
	return axios.post('/api/st/stInquiryResult/v1.0/getTab2MasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 조사지시현황 예약재고조사(일일) 저장
 * @param params
 */
const apiPostSaveReserveMasterList = (params: any) => {
	return axios.post('/api/st/stInquiryResult/v1.0/saveReserveMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 조사지시현황 seq 채번
 * @param params
 */
const apiGetSequenceNumber = (params: any) => {
	return axios.post('/api/st/stInquiryResult/v1.0/getSequenceNumber', params).then(res => res.data);
};

/**
 * @param params
 */
const apiPostSaveCloseMasterList = (params: any) => {
	return axios.post('/api/st/stInquiryResult/v1.0/saveCloseMasterList', params).then(res => res.data);
};

/**
 * @param params
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/st/stInquiryResult/v1.0/saveMasterList', params).then(res => res.data);
};

export {
	apiGetSequenceNumber,
	apiPostSaveCloseMasterList,
	apiPostSaveMasterList,
	apiPostTab1MasterList,
	apiPostTab2MasterList,
};
