import axios from '@/api/Axios';

/**
 * 차량정보 파일 업로드
 * @param {any} params 업로드 파일 및 정보
 * @returns {object} 성공여부 결과값
 */
const apiPostCarDriverSaveFile = async (params: any) => {
	return axios.post('/api/func/file/v1.0/carDriverSaveFileUpload', params);
};

/**
 * 저장위치정보 파일 업로드
 * @param {any} params 업로드 파일 및 정보
 * @returns {object} 성공여부 결과값
 */
const apiPostPlantXslSaveFile = async (params: any) => {
	return axios.post('/api/func/file/v1.0/plantXslSaveFileUpload', params);
};

/**
 * 저장위치정보 파일 다운로드
 * @param {any} params 다운로드 파일 정보
 * @returns {object} 성공여부 결과값
 */
const apiPostPlantXslDownloadFile = async (params: any) => {
	return axios.post(
		'/api/func/file/v1.0/plantXslFileDownload',
		{ contentType: 'application/x-www-form-urlencoded' },
		{ params, responseType: 'blob' },
	);
};

/**
 * 엑셀양식 파일 업로드
 * @param {any} params 업로드 파일 및 정보
 * @returns {object} 성공여부 결과값
 */
const apiPostExcelTemplateSaveFile = async (params: any) => {
	return axios.post('/api/ext/test/v1.0/saveExcelTemplateFileUpload', params);
};

/**
 * Fax 파일 업로드
 * @param {any} params 업로드 파일 및 정보
 * @returns {object} 성공여부 결과값
 */
const apiPostFaxSaveFile = async (params: any) => {
	return axios.post('/api/ext/test/v1.0/saveFaxFileUpload', params);
};

/**
 * Fax 파일 다운로드
 * @param {any} params 다운로드 파일 정보
 * @returns {object} 성공여부 결과값
 */
const apiPostFaxDownloadFile = async (params: any) => {
	return axios.post(
		'/api/ext/test/v1.0/faxFileDownload',
		{ contentType: 'application/x-www-form-urlencoded' },
		{ params, responseType: 'blob' },
	);
};

/**
 * SAP 연동 테스트
 * @param {any} params params
 * @returns {object} 성공여부 결과값
 */
const apiGetSapTest = (params: any) => {
	return axios.get('/api/ext/test/v1.0/getSapTest', params).then(res => res.data);
};

/**
 * EAI 연동 테스트
 * @param {any} params params
 * @returns {object} 성공여부 결과값
 */
const apiGetEaiTest = (params: any) => {
	return axios.get('/ltx/ext/test/v1.0/getEaiTest', params).then(res => res.data);
};

/**
 * EAI IAM 연동 테스트
 * @param {any} params params
 * @returns {object} 성공여부 결과값
 */
const apiGetEaiIamTest = (params: any) => {
	return axios.get('/api/ext/test/v1.0/getEaiIamTest', params).then(res => res.data);
};

/**
 * Email 전송 테스트
 * @param {any} params params
 * @returns {object} 성공여부 결과값
 */
const apiGetSendEmailTest = (params: any) => {
	return axios.get('/api/ext/test/v1.0/sendEmail', { params }).then(res => res.data);
};

/**
 * FAX 전송
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveFax = (params: any) => {
	return axios.post('/api/ext/test/v1.0/saveFax', params).then(res => res);
};

/**
 * SMS 전송
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveSms = (params: any) => {
	return axios.post('/api/ext/test/v1.0/saveSms', params).then(res => res);
};

/**
 * 드라이버 사용자 ID 생성
 * @param {any} params params
 * @returns {object} 성공여부 결과값
 */
const apiGetDriverUser = (params: any) => {
	return axios.get('/api/ext/test/v1.0/saveDriverUser', { params }).then(res => res.data);
};

/**
 * 대량데이터 엑셀 다운로드 API
 * 엑셀 다운로드 결과 값은 res만 return
 * @param {object} params 엑셀 조회 param
 * @returns {object} 엑셀 파일
 */
const apiPostLargeDataExcel = (params: any) => {
	return axios.post('/api/ext/test/v1.0/saveLargeDataExcel', params, { responseType: 'blob' }).then(res => res);
};

/**
 * AI팀 CSV 파일 저장 예제
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveAICsv = (params: any) => {
	return axios.post('/api/ext/test/v1.0/saveAICsv', params).then(res => res);
};

export {
	apiGetDriverUser,
	apiGetEaiIamTest,
	apiGetEaiTest,
	apiGetSapTest,
	apiGetSendEmailTest,
	apiPostCarDriverSaveFile,
	apiPostExcelTemplateSaveFile,
	apiPostFaxDownloadFile,
	apiPostFaxSaveFile,
	apiPostLargeDataExcel,
	apiPostPlantXslDownloadFile,
	apiPostPlantXslSaveFile,
	apiPostSaveAICsv,
	apiPostSaveFax,
	apiPostSaveSms,
};
