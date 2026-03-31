/*
 ############################################################################
 # FiledataField	: apiMgModifyLog.ts
 # Description		: 재고 > 재고현황 > 재고조회 조회 API
 # Author			: sss
 # Since			: 2025.07.31
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/stock';

/**
 * 조회 api 함수
 * @param params
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

export { apiPostMasterList };
