import axios from '@/api/Axios';

/**
 * 이력상품출고현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력상품출고현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/wd/inplanSN/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 이력상품출고현황 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력상품출고현황 상세
 */
const apiGetDetailList = (params: any) => {
	return axios.post('/api/wd/inplanSN/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 이력상품출고현황 엑셀 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력상품출고현황 엑셀
 */
const apiGetDataExcelList = (params: any) => {
	return axios.post('/api/wd/inplanSN/v1.0/getDataExcelList', params).then(res => res.data);
};

export { apiGetDataExcelList, apiGetDetailList, apiGetMasterList };
