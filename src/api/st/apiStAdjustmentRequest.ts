/*
 ############################################################################
 # FiledataField	: apiStAdjustmentRequest.ts
 # Description		: 재고 > 재고조정 > 재고조정처리
 # Author			: JiHoPark
 # Since			: 2025.10.13
 ############################################################################
*/
import axios from '@/api/Axios';

/**
 * 재고조정처리 - 피킹존 목록 조회
 * @param {any} params 피킹존 조회 조건
 * @returns {object} 피킹존 목록
 */
const apiGetZoneList = () => {
	return axios.post('/api/st/adjustmentRequest/v1.0/getZoneList').then(res => res.data);
};

/**
 * 재고조정처리 - 재고조정 요청 목록 조회
 * @param {any} params 재고조정 요청 목록 검색 조건
 * @returns {object} 재고조정 요청 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/st/adjustmentRequest/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 재고조정처리 - 재고조정 결재 목록 조회
 * @param {any} params 재고조정 결재 목록 검색 조건
 * @returns {object} 재고조정 결재 목록
 */
const apiGetMasterList3 = (params: any) => {
	return axios.post('/api/st/adjustmentRequest/v1.0/getMasterList3', params).then(res => res.data);
};

/**
 * 재고조정처리 - 재고조정 처리 목록 조회
 * @param {any} params 재고조정 처리 목록 검색 조건
 * @returns {object} 재고조정 처리 목록
 */
const apiGetMasterList4 = (params: any) => {
	return axios.post('/api/st/adjustmentRequest/v1.0/getMasterList4', params).then(res => res.data);
};

/**
 * 재고조정처리 - 재고조정 요청 저장
 * @param {any} params 재고조정 요청 저장 조건
 * @returns {object} 재고조정 요청 저장 결과
 */
const apiSaveMasterList1 = (params: any) => {
	return axios.post('/api/st/adjustmentRequest/v1.0/saveMasterList1', params).then(res => res.data);
};

/**
 * 재고조정처리 - 재고조정 결재 저장
 * @param {any} params 재고조정 결재 저장 조건
 * @returns {object} 재고조정 결재 저장 결과
 */
const apiSaveMasterList3 = (params: any) => {
	return axios.post('/api/st/adjustmentRequest/v1.0/saveMasterList3', params).then(res => res.data);
};

/**
 * 재고조정처리 - 재고조정 결재 전자결재
 * @param {any} params 재고조정 처리 조건
 * @returns {object} 재고조정 처리 목록
 */
const apiSaveElectApproval = (params: any) => {
	return axios.post('/api/st/adjustmentRequest/v1.0/saveElectApproval', params).then(res => res.data);
};

/**
 * 재고조정처리 - 재고조정 처리 저장
 * @param {any} params 재고조정 처리 조건
 * @returns {object} 재고조정 처리 목록
 */
const apiSaveMasterList4 = (params: any) => {
	return axios.post('/api/st/adjustmentRequest/v1.0/saveMasterList4', params).then(res => res.data);
};

export {
	apiGetMasterList,
	apiGetMasterList3,
	apiGetMasterList4,
	apiGetZoneList,
	apiSaveElectApproval,
	apiSaveMasterList1,
	apiSaveMasterList3,
	apiSaveMasterList4,
};
