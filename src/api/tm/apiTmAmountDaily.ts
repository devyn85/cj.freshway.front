import axios from '@/api/Axios';

/**
 * 일자별 차량수당관리 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('api/tm/amountdaily/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 일자별 차량수당관리 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetCarInfo = (params: any) => {
	return axios.post('api/tm/amountdaily/v1.0/getCarInfo', params).then(res => res.data);
};

/**
 * 일자별 차량수당관리 목록 저장
 * @param {any} params	요청 파라미터
 * @returns {object}	응답값
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('api/tm/amountdaily/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 일자별 차량수당관리 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetExcelValChk = (params: any) => {
	return axios.post('api/tm/amountdaily/v1.0/getExcelValChk', params).then(res => res.data);
};

/**
 * 일자별 차량수당관리 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiSaveExcel = (params: any) => {
	return axios.post('api/tm/amountdaily/v1.0/apiSaveExcel', params).then(res => res.data);
};

/**
 * 마감 확인
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetTrspCloseChk = (params: any) => {
	return axios.post('api/tm/amountdaily/v1.0/getTrspCloseChk', params).then(res => res.data);
};

/**
 * 파일 목록 조회
 * @param {any} params 저장 파라미터
 * @returns {object} 목록 조회 결과
 */
const apiPostFileList = (params: any) => {
	return axios
		.post('/api/tm/amountdaily/v1.0/getFileList', null, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: params,
		})
		.then(res => res.data);
};

/**
 * 파일 업로드
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveFileUpload = async (params: any) => {
	return axios.post('/api/tm/amountdaily/v1.0/saveFileUpload', params);
};

/**
 * 파일 다운로드
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostDownloadFile = async (params: any) => {
	return axios.post('/api/tm/amountdaily/v1.0/downloadFile', null, {
		params,
		responseType: 'blob',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});
};

/**
 * 파일 삭제
 * @param {any} params 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostDeleteFile = async (params: any) => {
	return axios.post('api/tm/amountdaily/v1.0/deleteUploadFile', params).then(res => res.data);
};

export {
	apiGetCarInfo,
	apiGetExcelValChk,
	apiGetMasterList,
	apiGetTrspCloseChk,
	apiPostDeleteFile,
	apiPostDownloadFile,
	apiPostFileList,
	apiPostSaveFileUpload,
	apiSaveExcel,
	apiSaveMasterList,
};
