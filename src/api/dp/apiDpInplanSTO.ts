import axios from '@/api/Axios';

/**
 * 광역입고현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 광역입고현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/dp/dpInplanSTO/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 광역입고현황 주문현황 조회
 * @param {any} params 검색 조건
 * @returns {object} 광역입고현황 주문현황
 */
const apiGetDetailList = (params: any) => {
	return axios.post('/api/dp/dpInplanSTO/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 광역입고현황 이력현황 조회
 * @param {any} params 검색 조건
 * @returns {object} 광역입고현황 이력현황
 */
const apiGetSerialInfoList = (params: any) => {
	return axios.post('/api/dp/dpInplanSTO/v1.0/getSerialInfoList', params).then(res => res.data);
};

/**
 * 광역입고현황 엑셀 조회
 * @param {any} params 검색 조건
 * @returns {object} 광역입고현황 엑셀
 */
const apiGetDataExcelList = (params: any) => {
	return axios.post('/api/dp/dpInplanSTO/v1.0/getDataExcelList', params).then(res => res.data);
};

export { apiGetDataExcelList, apiGetDetailList, apiGetMasterList, apiGetSerialInfoList };
