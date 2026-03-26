/*
 ############################################################################
 # FiledataField	: apiTmTrxCalculation.ts
 # Description		: 운송비정산 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.09.23
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 운송비정산 내역 조회
 * @param {any} params 검색 조건
 * @returns {object} 운송비정산 내역
 */
const apiPostMasterList = (params: any) => {
	return axios
		.post('/ltx/tm/trxcalculation/v1.0/getMasterList', null, {
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
		.post('/api/tm/trxcalculation/v1.0/getWorkDay', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 차수별 착지 조회
 * @param {any} params 검색 조건
 * @returns {object} 차수별 착지
 */
const apiPosCostPriorityList = (params: any) => {
	return axios
		.post('/api/tm/trxcalculation/v1.0/getCostPriorityList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 차수별 권역이동수 조회
 * @param {any} params 검색 조건
 * @returns {object} 차수별 권역이동수
 */
const apiPosRegnMoveList = (params: any) => {
	return axios
		.post('/api/tm/trxcalculation/v1.0/getRegnMoveList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 운송비정산
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveCalculation = (params: any) => {
	return axios.post('/api/tm/trxcalculation/v1.0/saveCalculation', params).then(res => res.data);
};

/**
 * 운송비정산
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveClosing = (params: any) => {
	return axios.post('/api/tm/trxcalculation/v1.0/saveClosing', params).then(res => res.data);
};

export {
	apiPosCostPriorityList,
	apiPosRegnMoveList,
	apiPostMasterList,
	apiPostSaveCalculation,
	apiPostSaveClosing,
	apiPostWorkDay,
};
