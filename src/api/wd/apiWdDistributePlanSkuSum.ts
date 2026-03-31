/*
 ############################################################################
 # FiledataField	: apiWdDistributePlanSkuSum.ts
 # Description		: 출고 > 출고현황 > 미출예정확인(상품별합계) API
 # Author			: YangChangHwan
 # Since			: 25.05.20
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/wd/distributePlanSkuSum';

/**
 * 출고 > 출고현황 > 미출예정확인(상품별합계) 목록 검색 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiSearchWdDistributePlanSkuSumList = (params: any) => {
	return axios.get(REQUEST_API + '/v1.0/getWdDistributePlanSkuSumList', { params }).then(res => res.data);
};

export { apiSearchWdDistributePlanSkuSumList };
