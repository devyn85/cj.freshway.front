/*
 ############################################################################
 # FiledataField	: apiStOutMove.tsx
 # Description		: 외부비축센터간이동 API
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.06.16
 ############################################################################
*/
import axios from '@/api/Axios';

/**
 * 외부비축재고조회 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 재고감모현황 목록
 */
const apiGetDataHeaderList = (params: any) => {
	return axios.post('/api/st/outMove/v1.0/getDataHeaderList', params).then(res => res.data);
};

/**
 * 외부비축재고조회 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 재고감모현황 목록
 */
const apiSaveData = (params: any) => {
	return axios.post('/api/st/outMove/v1.0/saveDataList', params).then(res => res.data);
};

const apiGetStockPrice = (params: any) => {
	return axios.post('/api/st/outMove/v1.0/getStockPrice', params).then(res => res.data);
};

const apiGetExcelValChk = (params: any) => {
	return axios.post('/api/st/outMove/v1.0/getExcelValChk', params).then(res => res.data);
};
export { apiGetDataHeaderList, apiGetExcelValChk, apiGetStockPrice, apiSaveData };
