import axios from '@/api/Axios';

/**
 * 피킹그룹정보 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/ms/pickBatchGroup/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 피킹그룹정보 목록 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/pickBatchGroup/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 플랜트 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetPlantList = (params: any) => {
	return axios.get('/api/ms/pickBatchGroup/v1.0/getDataPlant', { params }).then(res => res.data);
};

export { apiGetMasterList, apiGetPlantList, apiPostSaveMasterList };
