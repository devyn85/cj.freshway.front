/*
 ############################################################################
 # FiledataField	: apiRtQCConfirm.ts
 # Description		: 반품 > 반품작업 > 반품판정처리 조회 API
 # Author			: KimDongHyeon
 # Since			: 2025.09.23
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/rt/qcConfirm';

/**
 * 반품 > 반품작업 > 반품판정처리 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 반품 > 반품작업 > 반품판정처리2 목록 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList2', params).then(res => res.data);
};

/**
 * 반품 > 반품작업 > 반품판정처리 저장
 * @param {any} params  검색 조건
 * @returns {object}  목록Print*/
const apiPostSaveMasterList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList2', params).then(res => res.data);
};

export { apiPostMasterList, apiPostMasterList2, apiPostSaveMasterList2 };
