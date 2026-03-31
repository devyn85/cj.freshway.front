/*
 ############################################################################
 # FiledataField	: apiOmOrderCreationSTOForOut.tsx
 # Description		: 외부센터 보충발주 API
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.08
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 외부센터 보충발주 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부센터 보충발주 목록
 */
const apiPostMasterList = (params: any) => {
	return axios
		.post('/api/om/ordercreationstoforout/v1.0/getMasterList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 외부센터 보충발주 저장 결과 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부센터 보충발주 저장 결과 목록
 */
const apiPostResultList = (params: any) => {
	return axios
		.post('/api/om/ordercreationstoforout/v1.0/getResultList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 외부센터 보충발주 저장
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/om/ordercreationstoforout/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 외부센터 보충발주 엑셀업로드 저장
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveExcelList = (params: any) => {
	return axios.post('/api/om/ordercreationstoforout/v1.0/saveExcelList', params).then(res => res.data);
};

/**
 * 엑셀 검증
 * @param {any} params 외부센터 보충발주 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostValidateExcel = (params: any) => {
	return axios.post('/api/om/ordercreationstoforout/v1.0/validateExcel', params).then(res => res);
};

export { apiPostMasterList, apiPostResultList, apiPostSaveExcelList, apiPostSaveMasterList, apiPostValidateExcel };
