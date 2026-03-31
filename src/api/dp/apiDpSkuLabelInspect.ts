/*
 ############################################################################
 # FiledataField	: apiDpSkuLabelInspect.ts
 # Description		: 입고 > 입고작업 > 입고라벨출력(검수) 조회 API
 # Author			: YangChangHwan
 # Since			: 25.06.23
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/dp/dpSkuLabelInspect';

/**
 * 입고 > 입고작업 > 입고라벨출력(검수) 목록 검색 조회 상세 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiSearchDpSkuLabelInspectList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDpSkuLabelInspectList', params).then(res => res.data);
};

/**
 * 입고 > 입고작업 > 입고라벨출력(검수) 목록 검색 조회 Grid1 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiSearchDpSkuLabelInspectGrid1List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDpSkuLabelInspectGrid1List', params).then(res => res.data);
};

export { apiSearchDpSkuLabelInspectGrid1List, apiSearchDpSkuLabelInspectList };
