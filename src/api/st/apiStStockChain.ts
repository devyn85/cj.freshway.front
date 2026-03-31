/*
 ############################################################################
 # FiledataField	: apiMgModifyLog.ts
 # Description		: 재고 > 재고현황 > 상품별현재고(PLT)현황 조회 API
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/stockChain';

/**
 * 조회 api 함수
 * @param params
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

export { apiPostMasterList };
