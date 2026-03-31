/*
 ############################################################################
 # FiledataField	: apiWdQuickMonClose.ts
 # Description		: 출고 > 출고작업 > 퀵배송조회 조회 API
 # Author			: sss
 # Since			: 2025.12.09
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/wd/quickMonClose';

/**
 * 출고 > 출고작업 > 퀵배송조회 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 출고 > 출고작업 > 퀵배송조회 저장처리
 * @param params
 */
const apiPostsaveMasterReveiveList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterReveiveList', params).then(res => res.data);
};

/**
 * 출고 > 출고작업 > 퀵배송조회 그리드 데이터 저장
 * @param {any} params  저장할 데이터
 * @returns {object}  저장 결과
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 출고 > 출고작업 > 퀵배송조회 마감 처리
 * @param {any} params  마감 데이터
 * @returns {object}  마감 결과
 */
const apiPostSaveMasterCloseList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterCloseList', params).then(res => res.data);
};

export { apiPostMasterList, apiPostSaveMasterCloseList, apiPostSaveMasterList, apiPostsaveMasterReveiveList };
