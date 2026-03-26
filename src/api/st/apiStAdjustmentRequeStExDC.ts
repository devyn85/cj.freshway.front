/*
 ############################################################################
 # FiledataField	: apiStAdjustmentRequeStExDC.ts
 # Description		: 외부비축재고감모처리
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.30
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 외부비축재고조정 - 재고조정 요청 목록 조회
 * @param {any} params 재고조정 검색 조건
 * @returns {object} 재고조정 요청 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/st/adjustmentreqeustexdc/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 외부비축재고조정 - 요청처리 목록 조회
 * @param {any} params 요청처리 검색 조건
 * @returns {object} 요청처리 목록
 */
const apiGetMasterList2 = (params: any) => {
	return axios.post('/api/st/adjustmentreqeustexdc/v1.0/getMasterList2', params).then(res => res.data);
};

/**
 * 외부비축재고조정 - 재고조정 결재 목록 조회
 * @param {any} params 재고조정 결재 검색 조건
 * @returns {object} 재고조정 결재 목록
 */
const apiGetMasterList3 = (params: any) => {
	return axios.post('/api/st/adjustmentreqeustexdc/v1.0/getMasterList3', params).then(res => res.data);
};

/**
 * 외부비축재고조정 - 재고조정 처리 조회
 * @param {any} params 재고조정 처리 조건
 * @returns {object} 재고조정 처리 목록
 */
const apiGetMasterList4 = (params: any) => {
	return axios.post('/api/st/adjustmentreqeustexdc/v1.0/getMasterList4', params).then(res => res.data);
};

/**
 * 외부비축재고조정 - 재고조정 요청 저장
 * @param {any} params 재고조정 처리 조건
 * @returns {object} 재고조정 처리 목록
 */
const apiSaveMasterList1 = (params: any) => {
	return axios.post('/api/st/adjustmentreqeustexdc/v1.0/saveMasterList1', params).then(res => res.data);
};

/**
 * 외부비축재고조정 - 재고조정 결재 저장
 * @param {any} params 재고조정 처리 조건
 * @returns {object} 재고조정 처리 목록
 */
const apiSaveMasterList3 = (params: any) => {
	return axios.post('/api/st/adjustmentreqeustexdc/v1.0/saveMasterList3', params).then(res => res.data);
};

/**
 * 외부비축재고조정 - 재고조정 결재 전자결재
 * @param {any} params 재고조정 처리 조건
 * @returns {object} 재고조정 처리 목록
 */
const apiSaveElectApproval = (params: any) => {
	return axios.post('/api/st/adjustmentreqeustexdc/v1.0/saveElectApproval', params).then(res => res.data);
};

/**
 * 외부비축재고조정 - 재고조정 처리 저장
 * @param {any} params 재고조정 처리 조건
 * @returns {object} 재고조정 처리 목록
 */
const apiSaveMasterList4 = (params: any) => {
	return axios.post('/api/st/adjustmentreqeustexdc/v1.0/saveMasterList4', params).then(res => res.data);
};

/**
 * 감모요청 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부비축소비기한변경 목록
 */
const apiGetAdjustmentRequestList = (params: any) => {
	return axios.post('/api/st/adjustmentreqeust/v1.0/getAdjustmentRequestList', params).then(res => res.data);
};

/**
 * 감모결재 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 감모결재 목록
 */
const apiGetAdjustmentApprovalList = (params: any) => {
	return axios.post('/api/st/adjustmentreqeust/v1.0/getAdjustmentApprovalList', params).then(res => res.data);
};

/**
 * 감모처리 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 감모처리 목록
 */
const apiGetAdjustmentProcessList = (params: any) => {
	return axios.post('/api/st/adjustmentreqeust/v1.0/getAdjustmentProcessList', params).then(res => res.data);
};

/**
 * 감모요청 저장
 * @param {any} params 검색 조건
 * @returns {object} 감모처리 저장
 */
const apiSaveAdjustmentRequestList = (params: any) => {
	return axios.post('/api/st/adjustmentreqeust/v1.0/saveAdjustmentRequestList', params).then(res => res.data);
};

/**
 * 감모요청 엑셀업로드
 * @param {any} params 검색 조건
 * @returns {object} 감모처리 저장
 */
const apiSaveAdjustmentRequestExcelList = (params: any) => {
	return axios.post('/api/st/adjustmentreqeust/v1.0/saveAdjustmentRequestList', params).then(res => res.data);
};

/**
 * 감모결재 저장
 * @param {any} params 검색 조건
 * @returns {object} 감모결재 저장
 */
const apiSaveAdjustmentApproval = (params: any) => {
	return axios.post('/api/st/adjustmentreqeust/v1.0/saveAdjustmentApproval', params).then(res => res.data);
};

/**
 * 감모처리 저장
 * @param {any} params 검색 조건
 * @returns {object} 감모처리 저장
 */
const apiSaveAdjustmentProcessList = (params: any) => {
	return axios.post('/api/st/adjustmentreqeust/v1.0/saveAdjustmentProcessList', params).then(res => res.data);
};

/**
 * 감모결재 취소
 * @param {any} params 검색 조건
 * @returns {object} 감모결재 취소
 */
const apiCancelAdjustmentApproval = (params: any) => {
	return axios.post('/api/st/adjustmentreqeust/v1.0/cancelAdjustmentApproval', params).then(res => res.data);
};

export {
	apiCancelAdjustmentApproval,
	apiGetAdjustmentApprovalList,
	apiGetAdjustmentProcessList,
	apiGetAdjustmentRequestList,
	apiGetMasterList,
	apiGetMasterList2,
	apiGetMasterList3,
	apiGetMasterList4,
	apiSaveAdjustmentApproval,
	apiSaveAdjustmentProcessList,
	apiSaveAdjustmentRequestList,
	apiSaveElectApproval,
	apiSaveMasterList1,
	apiSaveMasterList3,
	apiSaveMasterList4,
};
