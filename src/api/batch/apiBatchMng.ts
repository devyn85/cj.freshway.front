import axios from '@/api/Axios';

/**
 * 배치 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 배치 목록
 */
const apiGetBatchMngList = (params: any) => {
    return axios.get('/api/batch/batchMng/v1.0/getBatchMngList', { params }).then(res => res.data);
};


/**
 * 배치 목록 조회(비동기화)
 * @param {any} params 검색 조건
 * @returns {object} 배치 목록
 */
const apiGetBatchMngListAsync = (params: any) => {
    // @ts-ignore
    return axios.get('/api/batch/batchMng/v1.0/getBatchMngList', { params, showLoading: false } as any).then(res => res.data);
};

/**
 * 배치 등록/수정
 * @param {any} params 배치 정보 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveBatchMngList = (params: any) => {
	return axios.post('/api/batch/batchMng/v1.0/saveBatchMngList', params).then(res => res);
};

export { apiGetBatchMngList, apiPostSaveBatchMngList, apiGetBatchMngListAsync};
