/*
 ############################################################################
 # FiledataField	: apiStInquiry.ts
 # Description		: 재고 > 재고조사 > 재고조사등록 API
 # Author			: KimDongHan
 # Since			: 2025.11.02
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/inquiry';

/**
 * 재고 > 재고조사 > 재고조사등록 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고조사 > 재고조사등록 상세 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 재고 > 재고조사 > 재고조사등록 상세 저장(5건 보다 큰 경우)
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSaveDetailList1 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveDetailList1', params).then(res => res.data);
};

/**
 * 재고 > 재고조사 > 재고조사등록 상세 저장(5건 보다 작은 경우)
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSaveDetailList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveDetailList2', params).then(res => res.data);
};

/**
 * 재고 > 재고조사 > 엑셀 다운로드 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostExcelList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getExcelList', params).then(res => res.data);
};

/**
 * 재고 > 재고조사 > 엑셀 업로드 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostExcelUpList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getExcelUpList', params).then(res => res.data);
};

export {
	apiPostDetailList,
	apiPostExcelList,
	apiPostExcelUpList,
	apiPostMasterList,
	apiPostSaveDetailList1,
	apiPostSaveDetailList2,
};
