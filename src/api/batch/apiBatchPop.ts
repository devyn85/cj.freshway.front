import axios from '@/api/Axios';

/**
 * 배치 인수 설정 popup 조회
 * @param {any} params 검색 조건
 * @returns {object} 배치 인수 조회
 */
const apiGetBatchParamSetList = (params: any) => {
	return axios.get('/api/batch/batchPop/v1.0/getBatchParamSetList', { params }).then(res => res.data);
};

/**
 * 배치 인수 설정 popup 조회
 * @param {any} params 배치 인수 정보
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveBatchParamSetList = (params: any) => {
	return axios.post('/api/batch/batchPop/v1.0/saveBatchParamSetList', params).then(res => res);
};

export { apiGetBatchParamSetList, apiPostSaveBatchParamSetList };
