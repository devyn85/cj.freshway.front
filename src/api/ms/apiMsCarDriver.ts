import axios from '@/api/Axios';

/**
 *  차량정보 마스터
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/ms/carDriver/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 차량정보 마스터
 * @param {any} params 검색 조건
 * @returns {object} 상세
 */
const apiGetMaster = (params: any) => {
	return axios.get('/api/ms/carDriver/v1.0/getMaster', { params }).then(res => res.data);
};

/**
 *  입출차정보 목록
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetEntryInfoList = (params: any) => {
	return axios.post('/api/ms/carDriver/v1.0/getEntryInfoList', params).then(res => res.data);
};

/**
 * 차량정보 목록 저장
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/carDriver/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 차량정보 저장
 * @param {any} params 저장데이터
 * @returns {object} 상세
 */
const apiPostSaveMaster = (params: any) => {
	return axios.post('/api/ms/carDriver/v1.0/saveMaster', params).then(res => res.data);
};

/**
 * 파일 업로드
 * @param {any} params 업로드 파일 및 정보
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveFile = async (params: any) => {
	return axios.post('api/ms/cardriver/v1.0/saveFileUpload', params);
};

/**
 * 차량정보 파일 업로드
 * @param {any} params 업로드 파일 및 정보
 * @returns {object} 성공여부 결과값
 */
const apiPostCarDriverSaveFile = async (params: any) => {
	return axios.post('/api/ms/carDriver/v1.0/carDriverSaveFileUpload', params);
};

/**
 * 엑셀업로드 유효성검사
 * @param {any} params 검색 조건
 * @returns {object} 상세
 */
const apiGetValidateExcelList = (params: any) => {
	return axios.post('/api/ms/carDriver/v1.0/saveExcelList', params).then(res => res.data);
};

/**
 * 엑셀업로드 저장
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiPostSaveExcelList = (params: any) => {
	return axios.post('/api/ms/carDriver/v1.0/saveExcelList', params).then(res => res.data);
};

/**
 *	기사연락처, 동승자 조회
 * @param params
 * @returns
 */
const apiGetCmDriverList = async (params: any) => {
	return axios.post('/api/ms/carDriver/v1.0/getDriverList', params).then(res => res.data);
};

export {
	apiGetCmDriverList,
	apiGetEntryInfoList,
	apiGetMaster,
	apiGetMasterList,
	apiGetValidateExcelList,
	apiPostCarDriverSaveFile,
	apiPostSaveExcelList,
	apiPostSaveFile,
	apiPostSaveMaster,
	apiPostSaveMasterList,
};
