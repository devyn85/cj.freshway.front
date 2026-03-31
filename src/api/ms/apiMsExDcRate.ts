/*
 ############################################################################
 # FiledataField	: apiMsExDcRate.tsx
 # Description		: 외부창고요율관리 API
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.06.19
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 저장위치정보 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 저장위치정보 목록
 */
const apiGetMsExDcRateList = (params: any) => {
	return axios.post('/api/ms/exdcrate/v1.0/getExDcRateList', params).then(res => res.data);
};

/**
 * 상품그룹정보 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 저장위치정보 목록
 */
const apiGetgetSkuSpecForMsExDcRate = (params: any) => {
	return axios.get('/api/ms/exdcrate/v1.0/getSkuSpecForMsExDcRate', { params }).then(res => res.data);
};

/**
 * 상품 단건 조회
 * @param {any} params 검색 조건
 * @returns {object} 저장위치정보 목록
 */
const apiGetDataSelectSkuForMsExDcRate = (params: any) => {
	return axios.get('/api/ms/exdcrate/v1.0/getDataSelectSkuForMsExDcRate', { params }).then(res => res.data);
};

/**
 * 요율체크 로직 호출
 * @param params
 * @returns
 */
const apiMsExdcRateCheckRateAvg = async (params: any) => {
	try {
		const res = await axios.post('/api/ms/exdcrate/v1.0/checkRateAvg', params);
		return res.data;
	} catch (err) {
		alert('요율 평균 체크 중 오류가 발생했습니다. 관리자에게 문의하세요.');
		throw err; // 호출부에서 try-catch할 수 있게!
	}
};

/**
 * 외부창고 요율삭제
 * @param {any} params 검색 조건
 * @returns {object} 저장위치정보 목록
 */
const apiMsExdcRateDeleteConfirm = (params: any) => {
	return axios.post('/api/ms/exdcrate/v1.0/deleteConfirm', params).then(res => res.data);
};
/**
 * 외부창고 요율 저장
 * @param {any} params 검색 조건
 * @returns {object} 저장위치정보 목록
 */
const apiMsExdcRateSaveConfirm = (params: any) => {
	return axios.post('/api/ms/exdcrate/v1.0/saveConfirm', params).then(res => res.data);
};

/**
 * 외부창고 요율 저장
 * @param {any} params 검색 조건
 * @returns {object} 저장위치정보 목록
 */
const apiMsExdcRateExcelCheck = (params: any) => {
	return axios.post('/api/ms/exdcrate/v1.0/getExcelCheck', params).then(res => res.data);
};
export {
	apiGetDataSelectSkuForMsExDcRate,
	apiGetMsExDcRateList,
	apiGetgetSkuSpecForMsExDcRate,
	apiMsExdcRateCheckRateAvg,
	apiMsExdcRateDeleteConfirm,
	apiMsExdcRateExcelCheck,
	apiMsExdcRateSaveConfirm,
};
