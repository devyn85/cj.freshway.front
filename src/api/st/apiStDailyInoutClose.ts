import axios from '@/api/Axios';

/**
 * 수불마감정보 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/st/dailyInoutClose/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 수불마감정보 목록 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/st/dailyInoutClose/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 수불마감정보 일괄마감
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveBatchClose = (params: any) => {
	return axios.post('/api/st/dailyInoutClose/v1.0/saveBatchClose', params).then(res => res.data);
};

export { apiGetMasterList, apiPostSaveBatchClose, apiPostSaveMasterList };
