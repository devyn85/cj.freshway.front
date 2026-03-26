/*
 ############################################################################
 # FiledataField	: apiOmOrderCreationSTOOrdBaseFO.tsx
 # Description		: 당일광역보충발주(FO) API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 26.03.10
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 당일광역보충발주(FO) 조회
 * @param {any} params 검색 조건
 * @returns {object} 당일광역보충발주(FO) 검색 목록
 */
const apiPostMasterList = (params: any) => {
	return axios
		.post('/api/om/ordercreationstoordbasefo/v1.0/getMasterList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 당일광역보충발주(FO) 결과 조회
 * @param {any} params 검색 조건
 * @returns {object} 당일광역보충발주(FO) 결과 목록
 */
const apiPostResultList = (params: any) => {
	return axios
		.post('/api/om/ordercreationstoordbasefo/v1.0/getResultList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 당일광역보충발주(FO) 이동대상 조회
 * @param {any} params 검색 조건
 * @returns {object} 당일광역보충발주(FO) 이동대상 목록
 */
const apiPostSTOList = (params: any) => {
	return axios
		.post('/api/om/ordercreationstoordbasefo/v1.0/getSTOList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 당일광역보충발주(FO) 물류센터 조회
 * @param {any} params 검색 조건
 * @returns {object} 당일광역보충발주(FO) 물류센터 목록
 */
const apiPostDcname = (params: any) => {
	return axios
		.post('/api/om/ordercreationstoordbasefo/v1.0/getDcname', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 당일광역보충발주(FO) 저장
 * @param {any} params 당일광역보충발주 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/om/ordercreationstoordbasefo/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiPostDcname, apiPostMasterList, apiPostResultList, apiPostSaveMasterList, apiPostSTOList };
