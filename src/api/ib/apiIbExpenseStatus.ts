/*
 ############################################################################
 # FiledataField	: apiIbExpenseStatus.tsx
 # Description		: 원가관리리포트 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.09.02
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 원가관리리포트 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 원가관리리포트 목록
 */
const apiPostMasterList = (params: any) => {
	return axios
		.post('/api/ib/expensestatus/v1.0/getMasterList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 외부창고 원가관리리포트 Popup ERP 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부창고 원가관리리포트 Popup ERP 조회 결과
 */
const apiPostPopupErpPoNoInfo = (params: any) => {
	return axios
		.post('/api/ib/expensestatus/v1.0/getPopupErpPoNoInfo', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 외부창고 원가관리리포트 Popup Item 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부창고 원가관리리포트 Popup Item 조회 결과
 */
const apiPostPopupItemCodeInfo = (params: any) => {
	return axios
		.post('/api/ib/expensestatus/v1.0/getPopupItemCodeInfo', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 외부창고 원가관리리포트 Popup HouseBLNo 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부창고 원가관리리포트 Popup HouseBLNo 조회 결과
 */
const apiPostPopupHouseBLNoInfo = (params: any) => {
	return axios
		.post('/api/ib/expensestatus/v1.0/getPopupHouseBLNoInfo', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

export { apiPostMasterList, apiPostPopupErpPoNoInfo, apiPostPopupHouseBLNoInfo, apiPostPopupItemCodeInfo };
