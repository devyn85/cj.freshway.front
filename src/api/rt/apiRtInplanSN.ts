import axios from '@/api/Axios';

/**
 * 이력상품반품현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력상품반품현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/rt/rtInplanSN/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 이력상품반품현황 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력상품반품현황 상세
 */
const apiGetDetailList = (params: any) => {
	return axios.post('/api/rt/rtInplanSN/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 이력상품반품현황 엑셀다운로드자료 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력상품반품현황 엑셀다운로드자료
 */
const apiGetDataExcelList = (params: any) => {
	return axios.post('/api/rt/rtInplanSN/v1.0/getDataExcelList', params).then(res => res.data);
};

export { apiGetDataExcelList, apiGetDetailList, apiGetMasterList };
