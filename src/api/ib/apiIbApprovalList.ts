/*
 ############################################################################
 # FiledataField	: apiIbApprovalList.tsx
 # Description		: 비용결재 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.25
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 비용결재 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 비용결재 목록
 */
const apiPostMasterList = (params: any) => {
	return axios
		.post('/api/ib/approvalList/v1.0/getMasterList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 비용결재 라인 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 비용결재 라인 목록
 */
const apiPostApprovalLine = (params: any) => {
	return axios
		.post('/api/ib/approvalList/v1.0/getApprovalLine', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 비용결재 상신취소
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostCancelMasterList = (params: any) => {
	return axios.post('/api/ib/approvalList/v1.0/saveCancelMasterList', params).then(res => res.data);
};

/**
 * 비용결재 반려
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostRejectMasterList = (params: any) => {
	return axios.post('/api/ib/approvalList/v1.0/saveRejectMasterList', params).then(res => res.data);
};

/**
 * 비용결재 결재
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostApproveMasterList = (params: any) => {
	return axios.post('/api/ib/approvalList/v1.0/saveApprovelMasterList', params).then(res => res.data);
};

export {
	apiPostApprovalLine,
	apiPostApproveMasterList,
	apiPostCancelMasterList,
	apiPostMasterList,
	apiPostRejectMasterList,
};
