/*
 ############################################################################
 # FiledataField	: apiMsCostCenterCtgyInfo.ts
 # Description		: 거래처기준정보 > 마감기준정보 > 사업부상세조직분류
 # Author			: YeoSeungCheol
 # Since			: 25.12.08
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/ms/costCenterCtgyInfo';

/**
 * 사업부 상세 목록 조회
 * @param params
 */
const getMasterListTab1 = (params: any) => {
	// return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
	return axios.post(REQUEST_API + '/v1.0/getMasterListTab1', params).then(res => res.data);
};

/**
 * 고객 군납현황 조회
 * @param params
 */
const getMasterListTab2 = (params: any) => {
	// return axios.post(REQUEST_API + '/v1.0/getArmyCustList', params).then(res => res.data);
	return axios.post(REQUEST_API + '/v1.0/getMasterListTab2', params).then(res => res.data);
};

/**
 * 전용상품 조회
 * @param params
 */
const getMasterListTab3 = (params: any) => {
	// return axios.post(REQUEST_API + '/v1.0/getSkuRiceList', params).then(res => res.data);
	return axios.post(REQUEST_API + '/v1.0/getMasterListTab3', params).then(res => res.data);
};

/**
 * 엑셀 업로드 데이터 유효성 검사
 * @param params 업로드 데이터 배열
 */
const apiValidateCostCenterCtgyExcelList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/validateExcelList', params).then(res => res);
};

/**
 * 엑셀 업로드 데이터 저장
 * @param params 업로드 데이터 배열 (선택/검증 완료건)
 */
const apiPostSaveCostCenterCtgyExcelList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveExcelList', params).then(res => res);
};

/**
 * 엑셀 업로드 데이터 유효성 검사
 * @param params 업로드 데이터 배열
 */
const apiValidateExcelListTab3 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/validateExcelListTab3', params).then(res => res);
};

/**
 * 엑셀 업로드 데이터 저장
 * @param params 업로드 데이터 배열 (선택/검증 완료건)
 */
const apiPostSaveCostCenterCtgyExcelListTab3 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveExcelListTab3', params).then(res => res);
};
export {
	apiPostSaveCostCenterCtgyExcelList,
	apiPostSaveCostCenterCtgyExcelListTab3,
	apiValidateCostCenterCtgyExcelList,
	apiValidateExcelListTab3,
	getMasterListTab1,
	getMasterListTab2,
	getMasterListTab3,
};
