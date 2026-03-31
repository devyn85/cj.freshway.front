/*
 ############################################################################
 # FiledataField	: apiStMKit.ts
 # Description		: 재고 > 재고조정 > 키트처리 API
 # Author			    : 고혜미
 # Since		    	: 2025.11.05
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/stMKit';

/**
 * 키트처리 목록 조회[이체대상TAB]
 * @param params
 * @returns {object}  목록
 */
const apiPostMasterList01 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList01', params).then(res => res.data);
};

/**
 * 키트 목록 조회[이체대상TAB]
 * @param params
 * @returns {object}  목록
 */
const apiPostKitList01 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getKitList01', params).then(res => res.data);
};

/**
 * 전자결재 목록 조회[전자결재TAB]
 * @param params
 * @returns {object}  목록
 */
const apiPostMasterList02 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList02', params).then(res => res.data);
};

/**
 * 키트처리 목록 조회[키트처리TAB]
 * @param params
 * @returns {object}  목록
 */
const apiPostMasterList03 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList03', params).then(res => res.data);
};

/* 이체대상 자품목 저장
 * @param params
 * @returns {object}  목록
 */
const apiPostSaveSubItemsList01 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveSubItemsList01', params).then(res => res.data);
};

/* 이체대상 모품목 저장
 * @param params
 * @returns {object}  목록
 */
const apiPostSaveSubItemsList02 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveSubItemsList02', params).then(res => res.data);
};

/* 이체대상 자품목 저장
 * @param params
 * @returns {object}  목록
 */
const apiPostSaveSubItemsList03 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveSubItemsList03', params).then(res => res.data);
};

/* 이체대상 모품목 저장
 * @param params
 * @returns {object}  목록
 */
const apiPostSaveSubItemsList04 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveSubItemsList04', params).then(res => res.data);
};

/**
 * 이체대상 저장
 * @param params
 * @returns {object}  목록
 */
const apiPostSaveMasterList01 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList01', params).then(res => res.data);
};

/**
 * 이체대상 저장
 * @param params
 * @returns {object}  목록
 */
const apiPostPrintList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getReportList', params).then(res => res.data);
};

/**
 * 키트처리 목록 조회[이체대상TAB]
 * @param params
 * @returns {object}  목록
 */
const apiPosMasterResultList01 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterResultList01', params).then(res => res.data);
};

/**
 * 전자결재
 * @param params
 * @returns {object}  목록
 */
const apiPostSaveMasterList02 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList02', params).then(res => res.data);
};

/**
 * 전자결재탭 저장
 * @param params
 * @returns {object}  목록
 */
const apiPostSaveMasterList05 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList05', params).then(res => res.data);
};

/**
 * 처리 저장
 * @param params
 * @returns {object}  목록
 */
const apiPostSaveMasterList03 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList03', params).then(res => res.data);
};

/**
 * 해제대상 저장
 * @param params
 * @returns {object}  목록
 */
const apiPostSaveMasterList04 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList04', params).then(res => res.data);
};

export {
	apiPosMasterResultList01,
	apiPostKitList01,
	apiPostMasterList01,
	apiPostMasterList02,
	apiPostMasterList03,
	apiPostPrintList,
	apiPostSaveMasterList01,
	apiPostSaveMasterList02,
	apiPostSaveMasterList03,
	apiPostSaveMasterList04,
	apiPostSaveMasterList05,
	apiPostSaveSubItemsList01,
	apiPostSaveSubItemsList02,
	apiPostSaveSubItemsList03,
	apiPostSaveSubItemsList04,
};
