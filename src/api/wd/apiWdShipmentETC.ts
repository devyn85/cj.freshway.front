import axios from '@/api/Axios';

/**
 * 매각출고처리-기타출고 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 매각출고처리-기타출고 목록
 */
const apiGetTab1MasterList = (params: any) => {
	return axios.post('/api/wd/shipmentETC/v1.0/getTab1MasterList', params).then(res => res.data);
};

/**
 * 매각출고처리-기타출고 저장[매각]
 * @param {any} params 검색 조건
 * @returns {object} 매각출고처리-기타출고 저장
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('/api/wd/shipmentETC/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 매각출고처리-기타출고 저장[매각]
 * @param {any} params 검색 조건
 * @returns {object} 매각출고처리-기타출고 저장
 */
const apiSaveMasterList01 = (params: any) => {
	return axios.post('/api/wd/shipmentETC/v1.0/saveMasterList01', params).then(res => res.data);
};

/**
 * 매각출고처리-기타출고 저장[기부]
 * @param {any} params 검색 조건
 * @returns {object} 매각출고처리-기타출고 저장
 */
const apiSaveMasterList02 = (params: any) => {
	return axios.post('/api/wd/shipmentETC/v1.0/saveMasterList02', params).then(res => res.data);
};

/**
 * 매각출고처리-매각내역 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 매각출고처리-처리결과 목록
 */
const apiGetTab3MasterList = (params: any) => {
	return axios.post('/api/wd/shipmentETC/v1.0/getTab3MasterList', params).then(res => res.data);
};

/**
 * 매각출고처리-매각내역 저장
 * @param {any} params 검색 조건
 * @returns {object} 매각출고처리-기타출고 저장
 */
const apiSaveMasterList03 = (params: any) => {
	return axios.post('/api/wd/shipmentETC/v1.0/saveMasterList03', params).then(res => res.data);
};

/**
 * 매각출고처리-처리결과 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 매각출고처리-처리결과 목록
 */
const apiGetTab2MasterList = (params: any) => {
	return axios.post('/api/wd/shipmentETC/v1.0/getTab2MasterList', params).then(res => res.data);
};

export {
	apiGetTab1MasterList,
	apiGetTab2MasterList,
	apiGetTab3MasterList,
	apiSaveMasterList,
	apiSaveMasterList01,
	apiSaveMasterList02,
	apiSaveMasterList03,
};
