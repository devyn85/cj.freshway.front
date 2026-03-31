/*
 ############################################################################
 # FiledataField	: apiKxDeliveryInvoice.ts
 # Description		: 출고 > 출고작업 > 택배송장발행(온라인)
 # Author			: JiHoPark
 # Since			: 2025.12.26
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/wd/kxdeliveryinvoice';

/**
 * 택배송장발행(온라인) - 주문 목록 조회
 * @param {any} params 주문 검색 조건
 * @returns {object} 주문 목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 택배송장발행(온라인) - 주문내역 저장
 * @param {any} params 저장 데이터
 * @returns {object} 저장 처리 결과
 */
const apiSaveMasterList01 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList01', params).then(res => res.data);
};

/**
 * 택배송장발행(온라인) - N배송 분리 처리
 * @param {any} params 저장 데이터
 * @returns {object} 저장 처리 결과
 */
const apiSaveMasterNDeliveryDivide = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterNDeliveryDivide', params).then(res => res.data);
};

/**
 * 택배송장발행(온라인) - 접수 처리
 * @param {any} params 저장 데이터
 * @returns {object} 저장 처리 결과
 */
const apiSaveMasterReceipt = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterReceipt', params).then(res => res.data);
};

/**
 * 택배송장발행(온라인) - 접수 처리(운송장)
 * @param {any} params 저장 데이터
 * @returns {object} 저장 처리 결과
 */
const apiSaveMasterInvoiceReceipt = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterInvoiceReceipt', params).then(res => res.data);
};

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

//  N배송 목록 조회
const apiPostMasterList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList2', params).then(res => res.data);
};

//  일반배송 목록 조회
const apiPostMasterList3 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList3', params).then(res => res.data);
};

/**
 * 택배송장발행(온라인) - 송장분리 처리
 * @param {any} params 저장 데이터
 * @returns {object} 저장 처리 결과
 */
const apiSaveMasterInvoiceDivide = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterInvoiceDivide', params).then(res => res.data);
};

/**
 * 택배송장발행(온라인) - 저장
 * @param {any} params 저장 데이터
 * @returns {object} 저장 처리 결과
 */
const apiSaveMasterList02 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList02', params).then(res => res.data);
};

/**
 * 택배송장발행(온라인) - 저장
 * @param {any} params 저장 데이터
 * @returns {object} 저장 처리 결과
 */
const apiSaveMasterList2 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList2', params).then(res => res.data);
};

/**
 * 택배송장발행(온라인) - 일반택배 목록 조회
 * @param {any} params 일반택배 검색 조건
 * @returns {object} 일반택배 목록
 */
const apiGetMasterList3 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList3', params).then(res => res.data);
};

/**
 * 택배송장발행(온라인) - 반품택배 목록 조회
 * @param {any} params 반품택배 검색 조건
 * @returns {object} 반품택배 목록
 */
const apiGetMasterList4 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList4', params).then(res => res.data);
};

/**
 * 택배송장발행(온라인) - 택배기준 목록 조회
 * @param {any} params 택배기준 검색 조건
 * @returns {object} 택배기준 목록
 */
const apiGetMasterList5 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList5', params).then(res => res.data);
};

/**
 * 택배송장발행(온라인) - 정렬기준정보 목록 조회
 * @param {any} params 정렬기준정보 검색 조건
 * @returns {object} 정렬기준정보 목록
 */
const apiGetMasterList6 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterList6', params).then(res => res.data);
};

/**
 * 택배송장발행(온라인) - 택배기준 저장
 * @param {any} params 택배기준 저장 데이터
 * @returns {object} 택배기준 저장 처리 결과
 */
const apiSaveMasterList5 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList5', params).then(res => res.data);
};

/**
 * 택배송장발행(온라인) - 운송장 출력 데이터 조회
 * @param {any} params 운송장 출력 조건
 * @returns {object} 운송장 출력 데이터
 */
const apiPostPrintMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/printMasterList', params).then(res => res.data);
};

/**
 * 출고 > 출고 > 배송 라벨 출력(예외 기준 적용)_기준정보 탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT2List = (params: any) => {
	return axios.post('/api/wd/deliveryLabelForce/v1.0/getMasterT2List', params).then(res => res.data);
};

export {
	apiGetMasterList3,
	apiGetMasterList4,
	apiGetMasterList5,
	apiGetMasterList6,
	apiPostMasterList,
	apiPostMasterList2,
	apiPostMasterList3,
	apiPostMasterT2List,
	apiPostPrintMasterList,
	apiSaveMasterInvoiceDivide,
	apiSaveMasterInvoiceReceipt,
	apiSaveMasterList01,
	apiSaveMasterList02,
	apiSaveMasterList5,
	apiSaveMasterNDeliveryDivide,
	apiSaveMasterReceipt,
};
