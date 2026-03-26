/*
 ############################################################################
 # FiledataField	: apiWdPltDp.ts
 # Description		: 재고 > 공용기 관리업 > PLT 수불 관리 API
 # Author			: KimDongHan
 # Since			: 2025.09.22
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/wd/pltDp';

/**
 * 재고 > 공용기 관리업 > PLT 수불 관리 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 재고 > 공용기 관리업 > PLT 수불 관리 저장
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiPostMasterList, apiPostSaveMasterList };
