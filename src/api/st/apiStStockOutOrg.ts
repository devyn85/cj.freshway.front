/*
 ############################################################################
 # FiledataField	: apiStStockOutOrg.tsx
 # Description		: 외부비축재고조회 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
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
	return axios.post('/api/st/stockOutOrg/v1.0/getDataHeaderList', params).then(res => res.data);
};

/**
 * 외부비축재고조회 - 이메일 발송
 * @param {any} params 이메일 발송 목록
 * @returns {object} 이메일 발송 결과
 */
const apiSendEmail = (params: any) => {
	return axios.post('/api/st/stockOutOrg/v1.0/sendEmail', params).then(res => res.data);
};

export { apiGetDataHeaderList, apiSendEmail };
