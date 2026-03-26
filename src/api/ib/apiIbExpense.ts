/*
 ############################################################################
 # FiledataField	: apiIbExpense.tsx
 # Description		: 비용기표 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.05
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 비용기표 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 비용기표 목록
 */
const apiPostMasterList = (params: any) => {
	return axios
		.post('/api/ib/expense/v1.0/getMasterList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 비용기표 문서정보 팝업 헤더 정보 조회
 * @param {any} params 검색 조건
 * @returns {object} 비용기표 문서정보 팝업 헤더 정보 조회 결과
 */
const apiPostPopupDocumentInfoHeader = (params: any) => {
	return axios
		.post('/api/ib/expense/v1.0/getPopupDocumentInfoHeader', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 비용기표 문서정보 팝업 상세 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 비용기표 문서정보 팝업 상세 목록 조회 결과
 */
const apiPostPopupDocumentInfoDetail = (params: any) => {
	return axios
		.post('/api/ib/expense/v1.0/getPopupDocumentInfoDetail', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 비용기표 매입세금계산서 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 비용기표 매입세금계산서 목록 조회 결과
 */
const apiPostElecTaxList = (params: any) => {
	return axios
		.post('/api/ib/expense/v1.0/getElecTaxList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 코스트코드 목록 조회
 * @param {any} params 검색 조건
 * @returns {object}  * 코스트코드 목록 조회 결과
 */
const apiPostCostCodeList = (params: any) => {
	return axios
		.post('/api/ib/expense/v1.0/getCostCodeList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * IF Status 목록 조회
 * @param {any} params 검색 조건
 * @returns {object}  * IF Status 목록 조회 결과
 */
const apiPostIFStatusList = (params: any) => {
	return axios
		.post('/api/ib/expense/v1.0/getIFStatusList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 비용기표 DocumentInfo Header 저장
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSavePopupDocumentInfoHeader = (params: any) => {
	return axios.post('/api/ib/expense/v1.0/savePopupDocumentInfoHeader', params).then(res => res.data);
};

/**
 * 비용기표 DocumentInfo Detail 저장
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSavePopupDocumentInfoDetail = (params: any) => {
	return axios.post('/api/ib/expense/v1.0/savePopupDocumentInfoDetail', params).then(res => res.data);
};

/**
 * 비용기표 DocumentInfo Detail 저장
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveKGPopupDocumentInfoDetail = (params: any) => {
	return axios.post('/api/ib/expense/v1.0/saveKGPopupDocumentInfoDetail', params).then(res => res.data);
};

/**
 * 비용기표 확정
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveConfirm = (params: any) => {
	return axios.post('/api/ib/expense/v1.0/saveConfirm', params).then(res => res.data);
};

/**
 * 비용기표 확정 취소
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveConfirmCancel = (params: any) => {
	return axios.post('/api/ib/expense/v1.0/saveConfirmCancel', params).then(res => res.data);
};

/**
 * 비용기표 Posting
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSavePosting = (params: any) => {
	return axios.post('/api/ib/expense/v1.0/savePosting', params).then(res => res.data);
};

/**
 * 비용기표 Posting 취소
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSavePostingCancel = (params: any) => {
	return axios.post('/api/ib/expense/v1.0/savePostingCancel', params).then(res => res.data);
};

/**
 * 비용기표 삭제
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostDeleteMasterList = (params: any) => {
	return axios.post('/api/ib/expense/v1.0/deleteMasterList', params).then(res => res.data);
};

/**
 * 파일 목록 조회
 * @param {any} params 저장 파라미터
 * @returns {object} 목록 조회 결과
 */
const apiPostFileList = (params: any) => {
	return axios
		.post('/api/ib/expense/v1.0/getFileList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 파일 업로드
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveFileUpload = async (params: any) => {
	return axios.post('/api/ib/expense/v1.0/saveFileUpload', params);
};

/**
 * 일괄 파일 업로드
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveFileUploadMulti = async (params: any) => {
	return axios.post('/api/ib/expense/v1.0/saveFileUploadMulti', params);
};

/**
 * 파일 다운로드
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostDownloadFile = async (params: any) => {
	return axios.post(
		'/api/ib/expense/v1.0/downloadFile',
		{ contentType: 'application/x-www-form-urlencoded' },
		{ params, responseType: 'blob' },
	);
};

/**
 * 결재자 목록 조회
 * @param {any} params 저장 파라미터
 * @returns {object} 목록 조회 결과
 */
const apiPostPopupApprovalUserInfo = (params: any) => {
	return axios
		.post('/api/ib/expense/v1.0/getPopupApprovalUserInfo', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 비용기표 헤더 조회
 * @param {any} params 저장 파라미터
 * @returns {object} 조회 결과
 */
const apiPostPopupApprovalExpenseInfo = (params: any) => {
	return axios
		.post('/api/ib/expense/v1.0/getPopupApprovalExpenseInfo', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 비용기표 결재승인요청
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveApprovalRequest = (params: any) => {
	return axios.post('/api/ib/expense/v1.0/saveApprovalRequest', params).then(res => res.data);
};

/**
 * 비용기표 체크 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 비용기표 체크 목록
 */
const apiPostKeynoList = (params: any) => {
	return axios
		.post('/api/ib/expense/v1.0/getKeynoList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

export {
	apiPostCostCodeList,
	apiPostDeleteMasterList,
	apiPostDownloadFile,
	apiPostElecTaxList,
	apiPostFileList,
	apiPostIFStatusList,
	apiPostKeynoList,
	apiPostMasterList,
	apiPostPopupApprovalExpenseInfo,
	apiPostPopupApprovalUserInfo,
	apiPostPopupDocumentInfoDetail,
	apiPostPopupDocumentInfoHeader,
	apiPostSaveApprovalRequest,
	apiPostSaveConfirm,
	apiPostSaveConfirmCancel,
	apiPostSaveFileUpload,
	apiPostSaveFileUploadMulti,
	apiPostSaveKGPopupDocumentInfoDetail,
	apiPostSavePopupDocumentInfoDetail,
	apiPostSavePopupDocumentInfoHeader,
	apiPostSavePosting,
	apiPostSavePostingCancel,
};
