import axios from '@/api/Axios';

/**
 * 자동취소 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 자동취소 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/wd/allocationCancel/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 자동취소 상세 및 지정취소 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 자동취소 상세 및 지정취소 목록
 */
const apiGetDetailList = (params: any) => {
	return axios.post('/api/wd/allocationCancel/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 지정취소 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 지정취소 상세
 */
const apiGetDetailSubList = (params: any) => {
	return axios.post('/api/wd/allocationCancel/v1.0/getDetailSubList', params).then(res => res.data);
};

/**
 * 차량별취소 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 차량별취소 목록
 */
const apiGetMasterListCarno = (params: any) => {
	return axios.post('/api/wd/allocationCancel/v1.0/getMasterListCarno', params).then(res => res.data);
};

/**
 * 자동취소 저장
 * @param {any} params 검색 조건
 * @returns {object} 자동취소 저장
 */
const apiSaveAutoBatch = (params: any) => {
	return axios.post('/api/wd/allocationCancel/v1.0/saveAutoBatch', params).then(res => res.data);
};

/**
 * 차량번호별취소 저장
 * @param {any} params 검색 조건
 * @returns {object} 차량번호별취소 저장
 */
const apiSaveCarnoBatch = (params: any) => {
	return axios.post('/api/wd/allocationCancel/v1.0/saveCarnoBatch', params).then(res => res.data);
};

export {
	apiGetDetailList,
	apiGetDetailSubList,
	apiGetMasterList,
	apiGetMasterListCarno,
	apiSaveAutoBatch,
	apiSaveCarnoBatch,
};
