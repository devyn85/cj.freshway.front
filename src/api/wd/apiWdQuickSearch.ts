/*
 ############################################################################
 # FiledataField	: apiWdQuickSearch.ts
 # Description		: 출고 > 출고작업 > 퀵배송조회 조회 API
 # Author			: sss
 # Since			: 2025.12.09
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/wd/quickSearch';

/**
 * 출고 > 출고작업 > 퀵배송조회 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

export { apiPostMasterList };
