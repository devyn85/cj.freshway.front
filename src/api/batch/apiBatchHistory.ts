import axios from '@/api/Axios';

/**
 * 배치 JOB 이력 조회
 * @param {any} params 검색 조건
 * @returns {object} 배치 JOB 이력
 */
const apiGetBatchJobHistList = (params: any) => {
	return axios.get('/api/batch/batchHistory/v1.0/getBatchJobHistList', { params }).then(res => res.data);
};

/**
 * 배치 JOB 상세내역 조회.
 * @param {any} params 검색 조건
 * @returns {object} 배치 JOB 이력
 */
const apiGetBatchJobDetailHistList = (params: any) => {
    return axios.get('/api/batch/batchHistory/v1.0/getBatchJobDetailHistList', { params }).then(res => res.data);
};

/**
 * 배치 PARAM 조회
 * @param {any} params 검색 조건
 * @returns {object} 배치 PARAM 목록
 */
const apiGetBatchParamHistList = (params: any) => {
	return axios.get('/api/batch/batchHistory/v1.0/getBatchParamHistList', { params }).then(res => res.data);
};

/**
 * 배치 PARAM 조회
 * @param {any} params 검색 조건
 * @returns {object} 배치 PARAM 목록
 */
const apiGetBatchStepHistList = (params: any) => {
	return axios.get('/api/batch/batchHistory/v1.0/getBatchStepHistList', { params }).then(res => res.data);
};



export { apiGetBatchJobHistList, apiGetBatchJobDetailHistList, apiGetBatchParamHistList, apiGetBatchStepHistList };
