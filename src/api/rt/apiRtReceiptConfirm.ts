/*
 ############################################################################
 # FiledataField	: apiRtReceiptConfirm.ts
 # Description		: 반품 > 반품작업 > 반품확정처리 조회 API
 # Author			: KimDongHyeon
 # Since			: 2025.09.16
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/rt/receiptConfirm';

/**
 * 반품 > 반품작업 > 반품확정처리 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 반품 > 반품작업 > 반품확정처리 mamd 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMaMdInfoList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMaMdInfoList', params).then(res => res.data);
};
/**
 * 반품 > 반품작업 > 반품확정처리 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 엑셀 반품 > 반품작업 > 반품확정처리 임시저장
 * @param {any} params  검색 조건
 * @returns {object}  목록Print*/
const apiPostTempSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/tempSaveMaster', params).then(res => res.data);
};

/**
 * 엑셀 반품 > 반품작업 > 반품확정처리 이메일
 * @param {any} params  검색 조건
 * @returns {object}  목록Print*/
const apiPostSendMaster = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/sendMaster', params).then(res => res.data);
};

/**
 * 엑셀 반품 > 반품작업 > 반품확정처리 임시저장 취소
 * @param {any} params  검색 조건
 * @returns {object}  목록Print*/
const apiPostCancelMaster = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/cancelMaster', params).then(res => res.data);
};

/**
 * 반품 > 반품작업 > 반품확정처리 목록 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList2', params).then(res => res.data);
};

export {
	apiPostMasterList,
	apiPostTempSaveMasterList,
	apiPostDetailList,
	apiPostDetailList2,
	apiPostSendMaster,
	apiPostCancelMaster,
	apiPostMaMdInfoList,
};
