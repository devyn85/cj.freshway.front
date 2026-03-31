import axios from '@/api/Axios';

/**
 * 센터상품속성(광역일배) 마스터
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.get('/api/ms/skuDcSetSTO/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * 센터상품속성(광역일배) 마스터
 * @param {any} params 검색 조건
 * @returns {object} 상세
 */
const apiGetMaster = (params: any) => {
	return axios.get('/api/ms/skuDcSetSTO/v1.0/getMaster', { params }).then(res => res.data);
};

/**
 * 센터상품속성(광역일배) 저장
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiPostSaveMaster = (params: any) => {
	return axios.post('/api/ms/skuDcSetSTO/v1.0/saveMaster', params).then(res => res.data);
};

/**
 * 센터상품속성(광역일배) 엑셀 저장
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiPostSaveExcelList = (params: any) => {
	return axios.post('/api/ms/skuDcSetSTO/v1.0/saveExcelList', params).then(res => res.data);
};

/**
 * 엑셀업로드 유효성검사
 * @param {any} params 검색 조건
 * @returns {object} 상세
 */
const apiGetValidateExcelList = (params: any) => {
	return axios.post('/api/ms/skuDcSetSTO/v1.0/getValidateExcelList', params).then(res => res.data);
};

export { apiGetMaster, apiGetMasterList, apiGetValidateExcelList, apiPostSaveExcelList, apiPostSaveMaster };
