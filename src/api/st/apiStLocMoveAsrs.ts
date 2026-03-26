import axios from '@/api/Axios';

/**
 * 자동창고보충 이동대상 조회
 * @param {any} params 검색 조건
 * @returns {object} 자동창고보충 이동대상 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/st/locMoveAsrs/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 자동창고보충 이동결과 조회
 * @param {any} params 검색 조건
 * @returns {object} 자동창고보충 이동결과 목록
 */
const apiGetResultList = (params: any) => {
	return axios.post('/api/st/locMoveAsrs/v1.0/getResultList', params).then(res => res.data);
};

/**
 * 자동창고보충 이동결과 조회
 * @param {any} params 검색 조건
 * @returns {object} 자동창고보충 이동결과 목록
 */
const apiSaveBatch = (params: any) => {
	return axios.post('/api/st/locMoveAsrs/v1.0/saveBatch', params).then(res => res.data);
};

export { apiGetMasterList, apiGetResultList, apiSaveBatch };
