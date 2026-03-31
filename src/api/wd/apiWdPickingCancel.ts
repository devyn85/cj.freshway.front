import axios from '@/api/Axios';

/**
 * 피킹취소처리 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 피킹취소처리 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/wd/pickingCancel/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 피킹취소처리 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 피킹취소처리 상세
 */
const apiGetDetailList = (params: any) => {
	return axios.post('/api/wd/pickingCancel/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 지정취소 저장
 * @param {any} params 검색 조건
 * @returns {object} 지정취소 저장
 */
const apiSavePicking = (params: any) => {
	return axios.post('/api/wd/pickingCancel/v1.0/savePicking', params).then(res => res.data);
};
/**
 * 일괄취소 저장
 * @param {any} params 검색 조건
 * @returns {object} 일괄취소 저장
 */
const apiSaveBatch = (params: any) => {
	return axios.post('/api/wd/pickingCancel/v1.0/saveBatch', params).then(res => res.data);
};

export { apiGetDetailList, apiGetMasterList, apiSaveBatch, apiSavePicking };
