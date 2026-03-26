import axios from '@/api/Axios';

/**
 * 상품정보 마스터
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/ms/sku/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 상품정보 마스터
 * @param {any} params 검색 조건
 * @returns {object} 상세
 */
const apiGetMaster = (params: any) => {
	return axios.get('/api/ms/sku/v1.0/getMaster', { params }).then(res => res.data);
};

/**
 * CBM 목록
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetCbmList = (params: any) => {
	return axios.get('/api/ms/sku/v1.0/getCbmList', { params }).then(res => res.data);
};

/**
 * 상품목록 저장
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiPostSaveSkuPlt = (params: any) => {
	return axios.post('/api/ms/sku/v1.0/saveSkuPlt', params).then(res => res.data);
};

/**
 * 상품정보 저장
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiPostSaveMaster = (params: any) => {
	return axios.post('/api/ms/sku/v1.0/saveMaster', params).then(res => res.data);
};

/**
 * CBM 목록 저장
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiPostSaveCbm = (params: any) => {
	return axios.post('/api/ms/sku/v1.0/saveCbm', params).then(res => res.data);
};

/**
 * 엑셀업로드 저장
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiPostSaveExcelList = (params: any) => {
	return axios.post('/api/ms/sku/v1.0/saveExcelList', params).then(res => res.data);
};

/**
 * 엑셀업로드 유효성검사
 * @param {any} params 검색 조건
 * @returns {object} 상세
 */
const apiGetValidateExcelList = (params: any) => {
	return axios.post('/api/ms/sku/v1.0/getValidateExcelList', params).then(res => res.data);
};

export {
	apiGetCbmList,
	apiGetMaster,
	apiGetMasterList,
	apiGetValidateExcelList,
	apiPostSaveCbm,
	apiPostSaveExcelList,
	apiPostSaveMaster,
	apiPostSaveSkuPlt,
};
