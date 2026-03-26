import axios from '@/api/Axios';

/**
 * 권역별차량관리 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/ms/district/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 권역별차량관리 목록 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/district/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 엑셀업로드 유효성검사
 * @param {any} params 검색 조건
 * @returns {object} 상세
 */
const apiGetValidateExcelList = (params: any) => {
	return axios.post('/api/ms/district/v1.0/getValidateExcelList', params).then(res => res.data);
};

export { apiGetMasterList, apiGetValidateExcelList, apiPostSaveMasterList };
