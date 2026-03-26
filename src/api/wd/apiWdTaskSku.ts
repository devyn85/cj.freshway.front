import axios from '@/api/Axios';

/**
 * 피킹작업지시-조회생성 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 피킹작업지시-조회생성 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/wd/taskSku/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 피킹작업지시-조회생성 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 피킹작업지시-조회생성 상세
 */
const apiGetDetailList = (params: any) => {
	return axios.post('/api/wd/taskSku/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 피킹지시(대상확정) 배치
 * @param {any} params 검색 조건
 * @returns {object} 피킹지시(대상확정) 배치
 */
const apiSavePickingBatch = (params: any) => {
	return axios.post('/api/wd/taskSku/v1.0/savePickingBatch', params).then(res => res.data);
};

export { apiGetDetailList, apiGetMasterList, apiSavePickingBatch };
