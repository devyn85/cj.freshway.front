/*
 ############################################################################
 # FiledataField	: TmTrxCalculationClose.tsx
 # Description		: 운송비 정산마감
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 운송비 정산마감 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('api/tm/trxCalculationClose/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 운송비 정산마감
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveClosing = (params: any) => {
	return axios.post('/api/tm/trxCalculationClose/v1.0/saveClosing', params).then(res => res.data);
};

/**
 * 운송비 월정산
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveCalculation = (params: any) => {
	return axios.post('/api/tm/trxCalculationClose/v1.0/saveCalculation', params).then(res => res.data);
};

export { apiGetMasterList, apiPostSaveCalculation, apiPostSaveClosing };
