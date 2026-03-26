/*
 ############################################################################
 # FiledataField	: apiTmtransportcontrol.ts
 # Description		: 정산 > 운송비정산 > 수송배차조정
 # Author			: JiHoPark
 # Since			: 2025.11.06.
 ############################################################################
*/
import axios from '@/api/Axios';

/**
 * 수송배차조정 - 노선 목록 조회
 * @param {any} params 노선 목록 검색 조건
 * @returns {object} 노선 목록
 */
const apiGetTransportRoutingList = (params: any) => {
	return axios.post('/api/tm/transportcontrol/v1.0/getTransportRoutingList', params).then(res => res.data);
};

/**
 * 수송배차조정 - 수송배차조정 목록 조회
 * @param {any} params 수송배차조정 목록 검색 조건
 * @returns {object} 수송배차조정 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/tm/transportcontrol/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 수송배차조정 - 수송배차조정 상세 목록 조회
 * @param {any} params 수송배차조정 상세 목록 검색 조건
 * @returns {object} 수송배차조정 상세 목록
 */
const apiGetMasterList2 = (params: any) => {
	return axios.post('/api/tm/transportcontrol/v1.0/getMasterList2', params).then(res => res.data);
};

/**
 * 수송배차조정 - 차량정보 조회
 * @param {any} params 차량정보 조회 검색 조건
 * @returns {object} 차량정보
 */
const apiGetCarInfo = (params: any) => {
	return axios.post('/api/tm/transportcontrol/v1.0/getCarInfo', params).then(res => res.data);
};

/**
 * 수송배차조정 - 비용 정보 조회
 * @param {any} params 비용 정보 조회 검색 조건
 * @returns {object} 비용 정보
 */
const apiGetTotPrice = (params: any) => {
	return axios.post('/api/tm/transportcontrol/v1.0/getTotPrice', params).then(res => res.data);
};

/**
 * 수송배차조정 - 수송배차조정 저장
 * @param {any} params 저장데이터 목록
 * @returns {object} 저장 결과
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('/api/tm/transportcontrol/v1.0/saveMasterList', params).then(res => res.data);
};

export {
	apiGetCarInfo,
	apiGetMasterList,
	apiGetMasterList2,
	apiGetTotPrice,
	apiGetTransportRoutingList,
	apiSaveMasterList,
};
