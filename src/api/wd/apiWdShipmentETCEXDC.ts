/*
 ############################################################################
 # FiledataField	: apiWdShipmentETCEXDC.ts
 # Description		: 외부센터매각출고처리
 # Author			: JiHoPark
 # Since			: 2025.09.11
 ############################################################################
*/
import axios from '@/api/Axios';

/**
 * 외부센터매각출고처리 - 기타출고 요청 목록 조회
 * @param {any} params 기타출고 검색 조건
 * @returns {object} 기타출고 요청 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/wd/shipmentetcexdc/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 외부센터매각출고처리 - 기타출고 요청 결과 목록 조회
 * @param {any} params 기타출고 요청 결과 목록 조회 조건
 * @returns {object} 기타출고 요청 결과 목록
 */
const apiGetMasterList2 = (params: any) => {
	return axios.post('/api/wd/shipmentetcexdc/v1.0/getMasterList2', params).then(res => res.data);
};

/**
 * 외부센터매각출고처리 - 기타출고 결재 목록 조회
 * @param {any} params 기타출고 결재 검색 조건
 * @returns {object} 기타출고 결재 목록
 */
const apiGetMasterList3 = (params: any) => {
	return axios.post('/api/wd/shipmentetcexdc/v1.0/getMasterList3', params).then(res => res.data);
};

/**
 * 외부센터매각출고처리 - 기타출고 처리 조회
 * @param {any} params 기타출고 처리 조건
 * @returns {object} 기타출고 처리 목록
 */
const apiGetMasterList4 = (params: any) => {
	return axios.post('/api/wd/shipmentetcexdc/v1.0/getMasterList4', params).then(res => res.data);
};

/**
 * 외부센터매각출고처리 - 기타출고 요청 저장
 * @param {any} params 기타출고 요청 조건
 * @returns {object} 기타출고 요청 결과
 */
const apiSaveMasterList1 = (params: any) => {
	return axios.post('/api/wd/shipmentetcexdc/v1.0/saveMasterList1', params).then(res => res.data);
};

/**
 * 외부센터매각출고처리 - 기타출고 결재 저장
 * @param {any} params 기타출고 저장 조건
 * @returns {object} 기타출고 처리 결과
 */
const apiSaveMasterList3 = (params: any) => {
	return axios.post('/api/wd/shipmentetcexdc/v1.0/saveMasterList3', params).then(res => res.data);
};

/**
 * 외부센터매각출고처리 - 기타출고 결재 전자결재
 * @param {any} params 기타출고 전자결재 조건
 * @returns {object} 기타출고 전자결재 결과
 */
const apiSaveElectApproval = (params: any) => {
	return axios.post('/api/wd/shipmentetcexdc/v1.0/saveElectApproval', params).then(res => res.data);
};

/**
 * 외부센터매각출고처리 - 기타출고 처리 저장
 * @param {any} params 기타출고 처리 저장 조건
 * @returns {object} 기타출고 처리 결과
 */
const apiSaveMasterList4 = (params: any) => {
	return axios.post('/api/wd/shipmentetcexdc/v1.0/saveMasterList4', params).then(res => res.data);
};

/**
 * 외부센터매각출고처리 - 기타출고 확정 처리
 * @param {any} params 기타출고 확정 data
 * @returns {object} 기타출고 처리 결과
 */
const apiConfirmMasterList4 = (params: any) => {
	return axios.post('/api/wd/shipmentetcexdc/v1.0/confirmMasterList4', params).then(res => res.data);
};

export {
	apiConfirmMasterList4,
	apiGetMasterList,
	apiGetMasterList2,
	apiGetMasterList3,
	apiGetMasterList4,
	apiSaveElectApproval,
	apiSaveMasterList1,
	apiSaveMasterList3,
	apiSaveMasterList4,
};
