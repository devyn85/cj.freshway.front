/*
 ############################################################################
 # FiledataField	: apiWdQuickRequest.ts
 # Description		: 출고 > 출고작업 > 퀵접수(VSR)및처리 조회 API
 # Author			: sss
 # Since			: 2025.07.31
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/wd/quickRequest';

/**
 * 출고 > 출고작업 > 퀵접수(VSR)및처리 - 변경이력Tab List
 * @param params
 * @returns {object}  목록
 */
const apiPostTab1MasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getTab1MasterList', params).then(res => res.data);
};

/**
 * 출고 > 출고작업 > 퀵접수(VSR)및처리 - Tab List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostTab2MasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getTab2MasterList', params).then(res => res.data);
};

/**
 * 출고 > 출고작업 > 퀵접수(VSR)및처리 - Tab List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostTab3MasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getTab3MasterList', params).then(res => res.data);
};

/**
 * 출고 > 출고작업 > 퀵접수(VSR)및처리 - Tab2 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiGetTab2DetailList = (params: any) => {
	return axios.get(REQUEST_API + '/v1.0/getTab2DetailList01', { params }).then(res => res.data); // get방식 -> { params }
};

/**
 * 출고 > 출고작업 > 퀵접수(VSR)및처리 - 센터리스트 조회 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiGetCenterList = (params: any) => {
	return axios.get(REQUEST_API + '/v1.0/getCenterList', { params }).then(res => res.data); // get방식 -> { params }
};

/**
 * 출고 > 출고작업 > 퀵접수(VSR)및처리 - 접수처리 List1
 * @param params
 */
const apiPostSaveMasterList01 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList01', params).then(res => res.data);
};

/**
 * 출고 > 출고작업 > 퀵접수(VSR)및처리 - 접수처리
 * @param params
 */ 1;
const apiPostSaveMasterListCenterRecept01 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterListCenterRecept01', params).then(res => res.data);
};

/**
 * 출고 > 출고작업 > 퀵접수(VSR)및처리 - 집하지처리
 * @param params
 */
const apiPostsaveDetailListDelivery01 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveDetailListDelivery01', params).then(res => res.data);
};

/**
 * 출고 > 출고작업 > 퀵접수(VSR)및처리 - 고객정보 List1
 * @param params
 */
const apiPostsaveDetailListDestination01 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveDetailListDestination01', params).then(res => res.data);
};

/**
 * 출고 > 출고작업 > 퀵접수(VSR)및처리 - 접수처리
 * @param params
 */
const apiPostSaveMasterListCenterRecept02 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterListCenterRecept02', params).then(res => res.data);
};

/**
 * 출고 > 출고작업 > 퀵접수(VSR)및처리 - 퀵주문 API 호출
 * @param params
 */
const apiPostGetOrderRequest01 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getOrderRequest01', params).then(res => res.data);
};

/**
 * 출고 > 출고작업 > 퀵접수(VSR)및처리 - 수기집하지 처리
 * @param params
 */
const apiPostsaveDetailListDelivery02 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveDetailListDelivery02', params).then(res => res.data);
};

/**
 * 출고 > 출고작업 > 퀵접수(VSR)및처리 - 수기 고객정보 처리
 * @param params
 */
const apiPostsaveDetailListDestination02 = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveDetailListDestination02', params).then(res => res.data);
};

export {
	apiGetCenterList,
	apiGetTab2DetailList,
	apiPostGetOrderRequest01,
	apiPostsaveDetailListDelivery01,
	apiPostsaveDetailListDelivery02,
	apiPostsaveDetailListDestination01,
	apiPostsaveDetailListDestination02,
	apiPostSaveMasterList01,
	apiPostSaveMasterListCenterRecept01,
	apiPostSaveMasterListCenterRecept02,
	apiPostTab1MasterList,
	apiPostTab2MasterList,
	apiPostTab3MasterList,
};
