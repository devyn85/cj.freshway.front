import axios from '@/api/Axios';

/**
 * 본점별 브랜드 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.get('api/ms/custBrand/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * 본점별 브랜드 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('api/ms/custBrand/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 엑셀 업로드 유효성 검사
 * @param params
 */
const apiValidateExcelList = (params: any) => {
	return axios.post('api/ms/custBrand/v1.0/validateExcelList', params).then(res => res.data);
};

/**
 * 엑셀 업로드 저장
 * @param params
 */
const apiPostSaveExcelList = (params: any) => {
	return axios.post('api/ms/custBrand/v1.0/saveExcelList', params).then(res => res.data);
};

export { apiGetMasterList, apiPostSaveExcelList, apiPostSaveMasterList, apiValidateExcelList };
