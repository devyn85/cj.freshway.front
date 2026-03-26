/*
 ############################################################################
 # FiledataField	: apiWdDeliveryLabelForce.ts
 # Description		: 출고 > 출고 > 배송 라벨 출력(예외 기준 적용) API
 # Author			: KimDongHan
 # Since			: 2025.10.17
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/wd/deliveryLabelForce';

/**
 * 출고 > 출고 > 배송 라벨 출력(예외 기준 적용)_분류표출력 탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT1List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT1List', params).then(res => res.data);
};

/**
 * 출고 > 출고 > 배송 라벨 출력(예외 기준 적용)_분류표출력 탭 인쇄
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSavePrintList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/savePrintList', params).then(res => res.data);
};

/**
 * 출고 > 출고 > 배송 라벨 출력(예외 기준 적용)_기준정보 탭 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterT2List = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getMasterT2List', params).then(res => res.data);
};

/**
 * 출고 > 출고 > 배송 라벨 출력(예외 기준 적용)_STO 등록 팝업 조회
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostPopMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getPopMasterList', params).then(res => res.data);
};

/**
 * 출고 > 출고 > 배송 라벨 출력(예외 기준 적용)_STO 등록 팝업 저장
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSavePopMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/savePopMasterList', params).then(res => res.data);
};

/**
 * 출고 > 출고 > 배송 라벨 출력(예외 기준 적용)_기준정보 탭 저장
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

export {
	apiPostMasterT1List,
	apiPostMasterT2List,
	apiPostPopMasterList,
	apiPostSaveMasterList,
	apiPostSavePopMasterList,
	apiPostSavePrintList,
};
