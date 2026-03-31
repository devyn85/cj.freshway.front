/*
 ############################################################################
 # FiledataField	: apiKpEXstorageMonitoring.tsx
 # Description		: 외부창고재고모니터링 API
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.07.15
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 외부창고재고모니터링 헤더 List
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/kp/eXstorageMonitoring/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 외부창고재고모니터링 Local 헤더 List
 * @param params
 * @returns
 */
const apiGetMaster1List = (params: any) => {
	return axios.post('/api/kp/eXstorageMonitoring/v1.0/getDataLocalHeaderList', params).then(res => res.data);
};

/**
 * 외부창고재고모니터링 Tcs 헤더 List
 * @param params
 * @returns
 */
const apiGetMaster2List = (params: any) => {
	return axios.post('/api/kp/eXstorageMonitoring/v1.0/getDataTcsHeaderList', params).then(res => res.data);
};

/**
 * 외부창고재고모니터링 상세 List
 * @param params
 * @returns
 */
const getDataDetailList = (params: any) => {
	return axios.post('/api/kp/eXstorageMonitoring/v1.0/getDataDetailList', params).then(res => res.data);
};

/**
 * 외부창고재고모니터링 Local 상세 List
 * @param params
 * @returns
 */
const getDataDetai1lList = (params: any) => {
	return axios.post('/api/kp/eXstorageMonitoring/v1.0/getDataLocalDetailList', params).then(res => res.data);
};

/**
 * 외부창고재고모니터링 Sub 상세 List
 * @param params
 * @returns
 */
const getDataDetai2lList = (params: any) => {
	return axios.post('/api/kp/eXstorageMonitoring/v1.0/getDataDetailSubList', params).then(res => res.data);
};

/**
 * 외부창고재고모니터링 Tcs 상세 List
 * @param params
 * @returns
 */
const getDataDetai3lList = (params: any) => {
	return axios.post('/api/kp/eXstorageMonitoring/v1.0/getDataDetailTcsList', params).then(res => res.data);
};

/**
 * 외부창고재고모니터링 Local Sub 상세 List
 * @param params
 * @returns
 */
const getDataDetai4lList = (params: any) => {
	return axios.post('/api/kp/eXstorageMonitoring/v1.0/getDataLocalDetailSubList', params).then(res => res.data);
};
/**
 * 외부창고재고모니터링 Local Sub 상세 List
 * @param params
 * @returns
 */
const getDataDetai5lList = (params: any) => {
	return axios.post('/api/kp/eXstorageMonitoring/v1.0/getDataDetailTcsSubList', params).then(res => res.data);
};
export {
	apiGetMaster1List,
	apiGetMaster2List,
	apiGetMasterList,
	getDataDetai1lList,
	getDataDetai2lList,
	getDataDetai3lList,
	getDataDetai4lList,
	getDataDetai5lList,
	getDataDetailList,
};
