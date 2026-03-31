/*
 ############################################################################
 # FiledataField	: apiStDisuseRequeStExDC.ts
 # Description		: 외부비축재고폐기처리
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.30
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 외부비축재고폐기처리 - 폐기 요청 목록 조회
 * @param {any} params 폐기 요청 검색 조건
 * @returns {object} 폐기 요청 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/st/disuserequestexdc/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 외부비축재고폐기처리 - 폐기 결재 목록 조회
 * @param {any} params 폐기 결재 검색 조건
 * @returns {object} 폐기 결재 목록
 */
const apiGetMasterList3 = (params: any) => {
	return axios.post('/api/st/disuserequestexdc/v1.0/getMasterList3', params).then(res => res.data);
};

/**
 * 외부비축재고폐기처리 - 재고조정 결재 목록 조회
 * @param {any} params 재고조정 결재 검색 조건
 * @returns {object} 재고조정 결재 목록
 */
const apiGetMasterList4 = (params: any) => {
	return axios.post('/api/st/disuserequestexdc/v1.0/getMasterList4', params).then(res => res.data);
};

/**
 * 외부비축재고폐기처리 - 폐기 요청 저장
 * @param {any} params 폐기 처리 조건
 * @returns {object} 폐기 처리 목록
 */
const apiSaveMasterList1 = (params: any) => {
	return axios.post('/api/st/disuserequestexdc/v1.0/saveMasterList1', params).then(res => res.data);
};

/**
 * 외부비축재고폐기처리 - 재고조정 결재 저장
 * @param {any} params 재고조정 처리 조건
 * @returns {object} 재고조정 처리 목록
 */
const apiSaveMasterList3 = (params: any) => {
	return axios.post('/api/st/disuserequestexdc/v1.0/saveMasterList3', params).then(res => res.data);
};

/**
 * 외부비축재고폐기처리 - 재고조정 결재 전자결재
 * @param {any} params 재고조정 처리 조건
 * @returns {object} 재고조정 처리 목록
 */
const apiSaveElectApproval = (params: any) => {
	return axios.post('/api/st/disuserequestexdc/v1.0/saveElectApproval', params).then(res => res.data);
};

/**
 * 외부비축재고폐기처리 - 재고조정 처리 저장
 * @param {any} params 재고조정 처리 조건
 * @returns {object} 재고조정 처리 목록
 */
const apiSaveMasterList4 = (params: any) => {
	return axios.post('/api/st/disuserequestexdc/v1.0/saveMasterList4', params).then(res => res.data);
};

export {
	apiGetMasterList,
	apiGetMasterList3,
	apiGetMasterList4,
	apiSaveElectApproval,
	apiSaveMasterList1,
	apiSaveMasterList3,
	apiSaveMasterList4,
};
