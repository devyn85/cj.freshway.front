/*
 ############################################################################
 # FiledataField	: apiTmMonitoringCustomer.ts
 # Description		: 배송 > 배차현황 > 배송고객모니터링
 # Author			: JiHoPark
 # Since			: 2025.11.24
 ############################################################################
*/
import axios from '@/api/Axios';

/**
 * 배송고객모니터링 - 배송고객모니터링 목록 조회
 * @param {any} params 배송고객모니터링 목록 검색 조건
 * @returns {object} 배송고객모니터링 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/tm/monitoringcustomer/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 배송고객모니터링 - 모니터링 그룹 목록 조회
 * @param {any} params 모니터링 그룹 검색 조건
 * @returns {object} 모니터링 그룹 목록
 */
const apiGetMonitoringCustomerGroupList = (params: any) => {
	return axios.post('/api/tm/monitoringcustomer/v1.0/getMonitoringCustomerGroupList', params).then(res => res.data);
};

/**
 * 배송고객모니터링 - 모니터링 그룹 상세 목록 조회
 * @param {any} params 모니터링 그룹 상세 검색 조건
 * @returns {object} 모니터링 그룹 상세 목록
 */
const apiGetMonitoringCustomerGroupDetailList = (params: any) => {
	return axios
		.post('/api/tm/monitoringcustomer/v1.0/getMonitoringCustomerGroupDetailList', params)
		.then(res => res.data);
};

/**
 * 배송고객모니터링 - 배송고객모니터링 목록 저장
 * @param {any} params 저장데이터 목록
 * @returns {object} 저장 결과
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('/api/tm/monitoringcustomer/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 배송고객모니터링 - 모니터링 그룹 목록 저장
 * @param {any} params 모니터링 그룹 저장데이터
 * @returns {object} 저장 결과
 */
const apiSaveMonitoringCustomerGroupList = (params: any) => {
	return axios.post('/api/tm/monitoringcustomer/v1.0/saveMonitoringCustomerGroupList', params).then(res => res.data);
};

/**
 * 배송고객모니터링 - 모니터링 그룹 상세 저장
 * @param {any} params 모니터링 그룹 상세 저장데이터
 * @returns {object} 저장 결과
 */
const apiSaveMonitoringCustomerGroupDetailList = (params: any) => {
	return axios
		.post('/api/tm/monitoringcustomer/v1.0/saveMonitoringCustomerGroupDetailList', params)
		.then(res => res.data);
};

/**
 * 배송고객모니터링 - 이메일 발송
 * @param {any} params 이메일 발송 목록
 * @returns {object} 이메일 발송 결과
 */
const apiSendEmail = (params: any) => {
	return axios.post('/api/tm/monitoringcustomer/v1.0/sendEmail', params).then(res => res.data);
};

export {
	apiGetMasterList,
	apiGetMonitoringCustomerGroupDetailList,
	apiGetMonitoringCustomerGroupList,
	apiSaveMasterList,
	apiSaveMonitoringCustomerGroupDetailList,
	apiSaveMonitoringCustomerGroupList,
	apiSendEmail,
};
