/*
 ############################################################################
 # FiledataField	: apiMsExDCSimulation.tsx
 # Description		: 외부창고정산 시뮬레이션 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.023
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 외부창고정산 창고비교 시뮬레이션 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부창고정산 창고비교 시뮬레이션 목록
 */
const apiPostMasterList = (params: any) => {
	return axios
		.post('/api/ms/exdcsimulation/v1.0/getMasterList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 외부창고정산 상품 시뮬레이션 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부창고정산 상품 시뮬레이션 목록
 */
const apiPostSkuList = (params: any) => {
	return axios
		.post('/api/ms/exdcsimulation/v1.0/getSkuList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 외부창고정산 창고비교 시뮬레이션
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/exdcsimulation/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 외부창고정산 상품 시뮬레이션
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveSkuList = (params: any) => {
	return axios.post('/api/ms/exdcsimulation/v1.0/saveSkuList', params).then(res => res.data);
};

export { apiPostMasterList, apiPostSaveMasterList, apiPostSaveSkuList, apiPostSkuList };
