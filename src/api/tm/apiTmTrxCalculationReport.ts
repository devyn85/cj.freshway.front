/*
 ############################################################################
 # FiledataField	: apiTmTrxCalculationReport.ts
 # Description		: 운송비정산서 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.10.20
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 운송비정산서 조회
 * @param {any} params 검색 조건
 * @returns {object} 운송비정산서
 */
const apiPostMasterList = (params: any) => {
	return axios
		.post('/api/tm/trxcalculationreport/v1.0/getMasterList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 운송사 이메일 조회
 * @param {any} params 검색 조건
 * @returns {object} 이메일주소
 */
const apiPostCustEmail = (params: any) => {
	return axios
		.post('/api/tm/trxcalculationreport/v1.0/getCustEmail', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 월 기준 근무일수 조회
 * @param {any} params 검색 조건
 * @returns {object} 월 기준 근무일수
 */
const apiPostWorkDay = (params: any) => {
	return axios
		.post('/api/tm/trxcalculationreport/v1.0/getWorkDay', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

export { apiPostCustEmail, apiPostMasterList, apiPostWorkDay };
