/*
 ############################################################################
 # FiledataField	: apiRtQCConfirmResult.ts
 # Description		: 입고 > 입고작업 > 반품판정현황 조회 API
 # Author			: KimDongHyeon
 # Since			: 2025.07.21
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/rt/qcConfirmResult';

/**
 * 입고 > 입고작업 > 반품판정현황 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 반품판정현황 목록 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostClaimTypeList = (params?: any) => {
	return axios.post(REQUEST_API + '/v1.0/getClaimTypeList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 반품판정현황 목록 상세 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostClaimTypeList2 = (params?: any) => {
	return axios.post(REQUEST_API + '/v1.0/getClaimTypeList2', params).then(res => res.data);
};

export { apiPostMasterList, apiPostClaimTypeList, apiPostClaimTypeList2 };
