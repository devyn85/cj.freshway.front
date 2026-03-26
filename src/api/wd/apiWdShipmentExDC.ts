/*
 ############################################################################
 # FiledataField	: apiWdShipmentExDC.tsx
 # Description		: 외부비축출고처리 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.30
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 외부비축출고처리 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부비축출고처리 목록
 */
const apiPostMasterList = (params: any) => {
	return axios
		.post('/api/wd/shipmentexdc/v1.0/getMasterList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 외부비축출고처리 대상 확정
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/wd/shipmentexdc/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 외부비축출고처리 같은 운송비그룹 대상 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부비축출고처리 목록
 */
const apiPostPriceMasterList = (params: any) => {
	return axios
		.post('/api/wd/shipmentexdc/v1.0/getPriceMasterList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 외부비축출고처리 운송료 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 운송료 목록
 */
const apiPostPriceList = (params: any) => {
	return axios
		.post('/api/wd/shipmentexdc/v1.0/getPriceList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 외부비축출고처리 운임단가 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 운임단가 목록
 */
const apiPostCarrierPriceList = (params: any) => {
	return axios
		.post('/api/wd/shipmentexdc/v1.0/getCarrierPriceList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 외부비축출고처리 운송비 배부 저장
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSavePriceList = (params: any) => {
	return axios.post('/api/wd/shipmentexdc/v1.0/savePriceList', params).then(res => res.data);
};

/**
 * 외부비축출고처리 운송비 저장
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveREFERENCE10 = (params: any) => {
	return axios.post('/api/wd/shipmentexdc/v1.0/saveREFERENCE10', params).then(res => res.data);
};

/**
 * SCM담당자 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} SCM담당자 목록
 */
const apiPostScmUserList = (params: any) => {
	return axios
		.post('/api/wd/shipmentexdc/v1.0/getScmUserList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 보관료 계산 조회
 * @param {any} params 검색 조건
 * @returns {object} 보관료 계산 목록
 */
const apiPostStockPrice = (params: any) => {
	return axios
		.post('/api/wd/shipmentexdc/v1.0/getStockPrice', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

export {
	apiPostCarrierPriceList,
	apiPostMasterList,
	apiPostPriceList,
	apiPostPriceMasterList,
	apiPostSaveMasterList,
	apiPostSavePriceList,
	apiPostSaveREFERENCE10,
	apiPostScmUserList,
	apiPostStockPrice,
};
