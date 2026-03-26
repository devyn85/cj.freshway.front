import axios from '@/api/Axios';

/**
 * 수발주정보 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/ltx/ms/purchaseCust/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 수발주정보 목록 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/purchaseCust/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 수발주정보 상세 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetDetailList = (params: any) => {
	return axios.post('/api/ms/purchaseCust/v1.0/getDetailList', params).then(res => res.data);
};

/**
 * 수발주정보 목록 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostDeleteMasterList = (params: any) => {
	return axios.post('/api/ms/purchaseCust/v1.0/deleteMasterList', params).then(res => res.data);
};

/**
 * 수발주정보 엑셀 저장
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiPostSaveExcelList = (params: any) => {
	return axios.post('/api/ms/purchaseCust/v1.0/saveExcelList', params).then(res => res.data);
};

/**
 * 수발주정보 유효성검사
 * @param {any} params 검색 조건
 * @returns {object} 상세
 */
const apiGetValidateExcelList = (params: any) => {
	return axios.post('/api/ms/purchaseCust/v1.0/getValidateExcelList', params).then(res => res.data);
};

/**
 * 수발주정보 엑셀업로드 결과 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetExcelUploadList = (params: any) => {
	return axios.post('/api/ms/purchaseCust/v1.0/getExcelUploadList', params).then(res => res.data);
};

/**
 * 수발주정보 엑셀다운로드
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostLargeDataExcel = (params: any) => {
	return axios.post('/ltx/ms/purchaseCust/v1.0/saveLargeDataExcel', params, { responseType: 'blob' }).then(res => res);
};

/**
 * 수발주정보 > 공통 코드 수정 및 등록
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveCmDtlCode = (params: any) => {
	return axios.post('/api/ms/purchaseCust/v1.0/saveCmDtlCode', params).then(res => res);
};
export {
	apiGetDetailList,
	apiGetExcelUploadList,
	apiGetMasterList,
	apiGetValidateExcelList,
	apiPostDeleteMasterList,
	apiPostLargeDataExcel,
	apiPostSaveCmDtlCode,
	apiPostSaveExcelList,
	apiPostSaveMasterList,
};
