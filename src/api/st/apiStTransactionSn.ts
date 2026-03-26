/*
 ############################################################################
 # FiledataField	: apiStTransactionSn.ts
 # Description		: 재고 > 재고현황 > 재고조회 조회 API
 # Author			: sss
 # Since			: 2025.07.31
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/transactionSn';
/**
 * 이력재고처리현황 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

export { apiGetMasterList };
