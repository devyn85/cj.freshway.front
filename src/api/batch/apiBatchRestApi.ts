import axios from '@/api/Axios';

const { VITE_APP_AXIOS_BASE_BATCH_URL } = import.meta.env; // Axios 기본 URL
/**
 * 배치 인수 설정 popup 조회
 * @param {any} params 배치 인수 정보
 * @returns {object} 성공여부 결과값
 */
const apiPostCallBatchApiParamSetList = (params: any) => {
	return axios.post(VITE_APP_AXIOS_BASE_BATCH_URL + '/batch/api/v1.0/execute', params).then(res => res);
};

/**
 * 쿼츠 스케쥴링 리스타트
 * @param {any} params 파람없음.
 * @returns {object} 성공여부 결과값
 */
const apiPostCallRescheduleJob = (params: any) => {
	return axios.post(VITE_APP_AXIOS_BASE_BATCH_URL + '/batch/api/v1.0/rescheduleJob', params).then(res => res);
};

export { apiPostCallBatchApiParamSetList, apiPostCallRescheduleJob };
