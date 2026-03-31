import axios from '@/api/Axios';

/**
 * WMS진행현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} WMS진행현황 목록
 */
const getTotalMasterList = (params: any) => {
	return axios.get('/api/om/inplanMonitoring/v1.0/getTotalMasterList', { params }).then(res => res.data);
};

/**
 * 경로별마감 마스터 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 경로별마감 마스터 목록
 */
const getCustCloseTypeMasterList = (params: any) => {
	return axios.get('/api/om/inplanMonitoring/v1.0/getCustCloseTypeMasterList', { params }).then(res => res.data);
};

/**
 * 경로별마감 디테일 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 경로별마감 마스터 목록
 */
const getCustCloseTypeDetailList = (params: any) => {
	return axios.get('/api/om/inplanMonitoring/v1.0/getCustCloseTypeDetailList', { params }).then(res => res.data);
};

/**
 * 경로별마감 강제마감
 * @param {any} params 검색 조건
 * @returns {object} 경로별마감 마스터 목록
 */
const saveOrderCloseStatus = (params: any) => {
	return axios.post('/api/om/inplanMonitoring/v1.0/saveOrderCloseStatus', params).then(res => res.data);
};

/**
 * 출고마감 마스터 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고마감 마스터 목록
 */
const getCloseWdMasterList = (params: any) => {
	return axios.get('/api/om/inplanMonitoring/v1.0/getCloseWdMasterList', { params }).then(res => res.data);
};

/**
 * 영업오더차이 마스터 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 영업오더차이 목록
 */
const getChkFsMasterList = (params: any) => {
	return axios.get('/api/om/inplanMonitoring/v1.0/getChkFsMasterList', { params }).then(res => res.data);
};

/**
 * 영업오더차이 상세 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 영업오더차이 목록
 */
const getChkFsDetailList = (params: any) => {
	return axios.get('/api/om/inplanMonitoring/v1.0/getChkFsDetailList', { params }).then(res => res.data);
};

/**
 * 영업오더차이 I/F 상세 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 영업오더차이 목록
 */
const getOrderListChkFSIF = (params: any) => {
	return axios.get('/api/om/inplanMonitoring/v1.0/getOrderListChkFSIF', { params }).then(res => res.data);
};

/**
 * 영업실적차이 마스터 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 영업실적차이 목록
 */
const getChkRsltFsMasterList = (params: any) => {
	return axios.get('/api/om/inplanMonitoring/v1.0/getChkRsltFsMasterList', { params }).then(res => res.data);
};

/**
 * 영업실적차이 상세 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 영업실적차이 목록
 */
const getChkRsltFsDetailList = (params: any) => {
	return axios.get('/api/om/inplanMonitoring/v1.0/getChkRsltFsDetailList', { params }).then(res => res.data);
};

/**
 * 영업실적차이 I/F 상세 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 영업실적차이 목록
 */
const getOrderListChkRsltFSIF = (params: any) => {
	return axios.get('/api/om/inplanMonitoring/v1.0/getOrderListChkRsltFSIF', { params }).then(res => res.data);
};

/**
 * TAB1 수급담당요약 헤더 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 영업실적차이 목록
 */
const getTab1MasterList = (params: any) => {
	return axios.get('/ltx/om/purchaseCtl/v1.0/getTab1MasterList', { params }).then(res => res.data);
};

/**
 * TAB2 SKU현황 헤더 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 영업실적차이 목록
 */
const getTab2MasterList = (params: any) => {
	return axios.get('/api/om/purchaseCtl/v1.0/getTab2MasterList', { params }).then(res => res.data);
};

/**
 * TAB2 SKU현황 상세 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 영업실적차이 목록
 */
const getTab2DetailList = (params: any) => {
	return axios.get('/api/om/purchaseCtl/v1.0/getTab2DetailList', { params }).then(res => res.data);
};

/**
 * TAB2 SKU현황 상세2 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 영업실적차이 목록
 */
const getTab2Detail2List = (params: any) => {
	return axios.get('/api/om/purchaseCtl/v1.0/getTab2Detail2List', { params }).then(res => res.data);
};

/**
 * TAB3 SKU현황 헤더 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 영업실적차이 목록
 */
const getTab3MasterList = (params: any) => {
	return axios.get('/api/om/purchaseCtl/v1.0/getTab3MasterList', { params }).then(res => res.data);
};

/**
 * TAB3 SKU현황 상세 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 영업실적차이 목록
 */
const getTab3DetailList = (params: any) => {
	return axios.get('/api/om/purchaseCtl/v1.0/getTab3DetailList', { params }).then(res => res.data);
};

/**
 * TAB3 SKU현황 상세2 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 영업실적차이 목록
 */
const getTab3Detail2List = (params: any) => {
	return axios.get('/api/om/purchaseCtl/v1.0/getTab3Detail2List', { params }).then(res => res.data);
};

export {
	getChkFsDetailList,
	getChkFsMasterList,
	getChkRsltFsDetailList,
	getChkRsltFsMasterList,
	getCloseWdMasterList,
	getCustCloseTypeDetailList,
	getCustCloseTypeMasterList,
	getOrderListChkFSIF,
	getOrderListChkRsltFSIF,
	getTab1MasterList,
	getTab2Detail2List,
	getTab2DetailList,
	getTab2MasterList,
	getTab3Detail2List,
	getTab3DetailList,
	getTab3MasterList,
	getTotalMasterList,
	saveOrderCloseStatus,
};
