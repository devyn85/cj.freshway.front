/*
 ############################################################################
 # FiledataField	: apiMsWdApp.ts
 # Description		: 기준정보 > 물류센터 정보 > 결품대응 POP그룹 관리 API
 # Author			: KimDongHan
 # Since			: 2025.10.24
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/ms/wdApp';

/**
 * 기준정보 > 물류센터 정보 > 결품대응 POP그룹 관리 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 기준정보 > 물류센터 정보 > 결품대응 POP그룹 관리 상세 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 기준정보 > 물류센터 정보 > 결품대응 POP그룹 관리 저장
 * @param {any} params
 * @returns {object}
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 기준정보 > 물류센터 정보 > 결품대응 POP그룹 관리 상세 저장
 * @param {any} params
 * @returns {object}
 */
const apiPostSaveDetailList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveDetailList', params).then(res => res.data);
};

export { apiPostDetailList, apiPostMasterList, apiPostSaveDetailList, apiPostSaveMasterList };
