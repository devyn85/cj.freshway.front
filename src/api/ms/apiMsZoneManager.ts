import axios from '@/api/Axios';

/**
 * 존 정보 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 존 정보 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.get('/api/ms/zone/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * 존 정보 저장
 * @param {any} params 존 정보 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/zone/v1.0/saveMasterList', params).then(res => res);
};

export { apiGetMasterList, apiPostSaveMasterList };
