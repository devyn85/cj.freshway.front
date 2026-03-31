/*
 ############################################################################
 # FiledataField	: apiMgModifyLog.ts
 # Description		: 재고 > 재고현황 > 재고폐기요청/처리 API
 # Author			: sss
 # Since			: 2025.07.31
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/disuseRequestCenter';

/**
 * 재고 > 재고현황 > 재고폐기요청/처리 - Tab1 List
 * @param params
 * @returns {object}  목록
 */
const apiPostTab1MasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getTab1MasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 재고폐기요청/처리 - Tab2 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostTab2MasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getTab2MasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 재고폐기요청/처리 - Tab3 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostTab3MasterResultList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getTab3MasterResultList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 재고폐기요청/처리 저장 List
 * @param params
 */
const apiSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 재고폐기요청/처리 확정 처리 List
 * @param params
 */
const apiPostConfirmMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/confirmMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 재고폐기요청/처리 - Tab4 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostTab4MasterApprovalList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getTab4MasterApprovalList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 재고폐기요청/처리 삭제 List
 * @param params
 */
const apiPostDeleteMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/deleteMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 재고폐기요청/처리 - 전자결재 Tab4 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiSaveElectApproval = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveElectApproval', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 재고폐기요청/처리 - 폐기처리 Tab5 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostTab5MasterProcessList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getTab5MasterProcessList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > 재고폐기요청/처리 - 제일제당(STO) 처리
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiSaveCJSTO = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveCJSTO', params).then(res => res.data);
};

export {
	apiPostConfirmMasterList,
	apiPostDeleteMasterList,
	apiPostTab1MasterList,
	apiPostTab2MasterList,
	apiPostTab3MasterResultList,
	apiPostTab4MasterApprovalList,
	apiPostTab5MasterProcessList,
	apiSaveCJSTO,
	apiSaveElectApproval,
	apiSaveMasterList,
};
