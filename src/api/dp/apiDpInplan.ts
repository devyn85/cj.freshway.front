import axios from '@/api/Axios';

/**
 * 입고진행현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 입고진행현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/dp/dpInplan/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 입고진행현황 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 입고진행현황 상세
 */
const apiGetDetailList = (params: any) => {
	return axios.post('/api/dp/dpInplan/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 입고진행현황 엑셀 조회
 * @param {any} params 검색 조건
 * @returns {object} 입고진행현황 엑셀
 */
const apiGetDataExcelList = (params: any) => {
	return axios.post('/ltx/dp/dpInplan/v1.0/getDataExcelList', params, { responseType: 'blob' }).then(res => res);
};

export { apiGetDataExcelList, apiGetDetailList, apiGetMasterList };
