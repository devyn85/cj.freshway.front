import axios from '@/api/Axios';

/**
 * 외부창고 현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부창고 현황 목록
 */
const apiGetExDCStatusList = (params: any) => {
	return axios.post('/api/ms/exdcstatus/v1.0/getExDCStatusList', params).then(res => res.data);
};

/**
 * 외부창고 현황 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부창고 현황 단건
 */
const apiGetExDCStatusDtl = (params: any) => {
	return axios.get('/api/ms/exdcstatus/v1.0/getExDCStatusDtl', { params }).then(res => res.data);
};

/**
 * 외부창고 현황 상세 요율 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부창고 현황 단건
 */
const apiGetExDCStatusSkuDtl = (params: any) => {
	return axios.get('/api/ms/exdcstatus/v1.0/getExDCStatusSkuDtl', { params }).then(res => res.data);
};

/**
 * 외부창고 현황 창고 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 외부창고 현황 단건
 */
const apigetPlantList = () => {
	return axios.get('/api/ms/exdcstatus/v1.0/getPlantList').then(res => res.data);
};

export { apiGetExDCStatusDtl, apiGetExDCStatusList, apiGetExDCStatusSkuDtl, apigetPlantList };
