/*
 ############################################################################
 # FiledataField	: apiTmDeliveryMemo.ts
 # Description		: 배송 > 배차현황 > 거래처별 메모사항 조회
 # Author			: JiHoPark
 # Since			: 2025.10.27
 ############################################################################
*/
import axios from '@/api/Axios';

/**
 * 거래처별 메모사항 조회 - 거래처별 메모사항 조회 목록 조회
 * @param {any} params 거래처별 메모사항 조회 목록 검색 조건
 * @returns {object} 거래처별 메모사항 조회 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/tm/deliveryMemo/v1.0/getMasterList', params).then(res => res.data);
};

export { apiGetMasterList };
