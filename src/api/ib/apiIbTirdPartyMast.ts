/*
 ############################################################################
 # FiledataField	: apiIbTirdPartyMast.ts
 # Description		: 정산	> 3PL 수수료 > 일배 물류대행 파트너사 수수료 정산 API
 # Author			: KimDongHan
 # Since			: 2025.09.25
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/ib/tirdPartyMast';

/**
 * 정산	> 3PL 수수료 > 일배 물류대행 파트너사 수수료 정산 단가마스터_탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT1List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT1List', params).then(res => res.data);
};

/**
 * 정산	> 3PL 수수료 > 일배 물류대행 파트너사 수수료 정산 협력사관리_탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT2List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT2List', params).then(res => res.data);
};

/**
 * 정산	> 3PL 수수료 > 일배 물류대행 파트너사 수수료 정산 검수관리_탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT3List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT3List', params).then(res => res.data);
};

/**
 * 정산	> 3PL 수수료 > 일배 물류대행 파트너사 수수료 정산 검수관리_탭 상세 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailT3List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailT3List', params).then(res => res.data);
};

/**
 * 정산	> 3PL 수수료 > 일배 물류대행 파트너사 수수료 정산 정산관리_탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT4List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT4List', params).then(res => res.data);
};

/**
 * 정산	> 3PL 수수료 > 일배 물류대행 파트너사 수수료 정산 단가마스터_탭 저장
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSaveMasterT1List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterT1List', params).then(res => res.data);
};

/**
 * 정산	> 3PL 수수료 > 일배 물류대행 파트너사 수수료 정산 협력사관리_탭 저장
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSaveMasterT2List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterT2List', params).then(res => res.data);
};

/**
 * 정산	> 3PL 수수료 > 일배 물류대행 파트너사 수수료 정산 검수관리_탭 강제확정
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSaveMasterT3List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterT3List', params).then(res => res.data);
};

/**
 * 정산	> 3PL 수수료 > 일배 물류대행 파트너사 수수료 정산 정산관리_탭 저장
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSaveMasterT4List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterT4List', params).then(res => res.data);
};

/**
 * 정산	> 3PL 수수료 > 일배 물류대행 파트너사 수수료 정산 정산관리_탭 수정
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostUpdateMasterT4List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/updateMasterT4List', params).then(res => res.data);
};

export {
	apiPostDetailT3List,
	apiPostMasterT1List,
	apiPostMasterT2List,
	apiPostMasterT3List,
	apiPostMasterT4List,
	apiPostSaveMasterT1List,
	apiPostSaveMasterT2List,
	apiPostSaveMasterT3List,
	apiPostSaveMasterT4List,
	apiPostUpdateMasterT4List,
};
