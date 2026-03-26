/*
 ############################################################################
 # FiledataField	: apiStAdjustmentBatch.ts
 # Description		: 일괄재고조정
 # Author			: JiHoPark
 # Since			: 2025.09.24
 ############################################################################
*/
import axios from '@/api/Axios';

/**
 * 재고조정처리 - 피킹존 목록 조회
 * @param {any} params 피킹존 조회 조건
 * @returns {object} 피킹존 목록
 */
const apiGetZoneList = () => {
	return axios.post('/api/st/adjustmentbatch/v1.0/getZoneList').then(res => res.data);
};

/**
 * 일괄재고조정 - 재고조정 목록 조회
 * @param {any} params 재고조정 검색 조건
 * @returns {object} 재고조정 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/st/adjustmentbatch/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 일괄재고조정 - 재고조정 저장
 * @param {any} params 재고조정 처리 조건
 * @returns {object} 재고조정 처리 결과
 */
const apiSaveMasterList1 = (params: any) => {
	return axios.post('/api/st/adjustmentbatch/v1.0/saveMasterList1', params).then(res => res.data);
};

export { apiGetMasterList, apiGetZoneList, apiSaveMasterList1 };
