/*
 ############################################################################
 # FiledataField	: apiWdSendOutOrder.tsx
 # Description		: 외부비축출고지시서 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.16
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 오더있는 출고지시서 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고지시서 목록
 */
const apiGetDatalistOrder = (params: any) => {
	return axios.get('/api/wd/sendoutorder/v1.0/getDatalistOrder', { params }).then(res => res.data);
};

/**
 * 오더없는 출고지시서 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고지시서 목록
 */
const apiGetDatalistNotOrder = (params: any) => {
	return axios.get('/api/wd/sendoutorder/v1.0/getDatalistNotOrder', { params }).then(res => res.data);
};

/**
 * 수기출고 삭제
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostDeleteOrder = (params: any) => {
	return axios.post('/api/wd/sendoutorder/v1.0/deleteOrder', params).then(res => res.data);
};

/**
 * 인쇄
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostPrintMastrerList = (params: any) => {
	return axios.post('/api/wd/sendoutorder/v1.0/printMasterList', params).then(res => res.data);
};

/**
 * 사용자 이메일 조회
 * @param {object} params 조회 조건
 * @returns {object} 사용자 이메일
 */
const apiGetUserEmailByUserId = (params: any) => {
	return axios.get('/api/cm/main/v1.0/getUserEmailByUserId', { params }).then(res => res.data);
};

/**
 * 이메일 발송
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveEmail = (params: any) => {
	return axios.post('/api/ext/test/v1.0/saveEmailService', params).then(res => res.data);
};

/**
 * 팩스 발송
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveFax = (params: any) => {
	return axios.post('/api/ext/test/v1.0/saveFaxService', params).then(res => res.data);
};

/**
 * 출고지시서 인쇄 로그 저장
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiSavePrintHistory = (params: any) => {
	return axios.post('/api/wd/sendoutorder/v1.0/savePrintHistory', params).then(res => res.data);
};

export {
	apiGetDatalistNotOrder,
	apiGetDatalistOrder,
	apiGetUserEmailByUserId,
	apiPostDeleteOrder,
	apiPostPrintMastrerList,
	apiPostSaveEmail,
	apiPostSaveFax,
	apiSavePrintHistory,
};
