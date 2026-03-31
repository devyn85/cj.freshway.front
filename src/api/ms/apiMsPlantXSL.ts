import axios from '@/api/Axios';

/**
 * 저장위치정보 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 저장위치정보 목록
 */
const apiGetPlantXSLList = (params: any) => {
	return axios.post('/api/ms/plantxsl/v1.0/getPlantXSLList', params).then(res => res.data);
};

/**
 * 저장위치정보 상세 조회
 * @param {any} params 검색 조건
 * @returns {object} 저장위치정보 단건
 */
const apiGetPlantXSLDtl = (params: any) => {
	return axios.get('/api/ms/plantxsl/v1.0/getPlantXSLDtl', { params }).then(res => res.data);
};

/**
 * 저장위치정보 저장
 * @param {any} params 검색 조건
 * @returns {object} 저장위치정보 단건
 */
const apiSavePlantXSLDtl = (params: any) => {
	return axios.post('/api/ms/plantxsl/v1.0/savePlantXSLDtl', params).then(res => res.data);
};

/**
 * 저장위치정보 창고 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 저장위치정보 단건
 */
const apigetPlantList = () => {
	return axios.get('/api/ms/plantxsl/v1.0/getPlantList').then(res => res.data);
};

/**
 * 저장위치정보 파일 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 저장위치정보 단건
 */
const apiGetMasterFileList = (params: any) => {
	return axios.post('/api/ms/plantxsl/v1.0/getMasterFileList', params).then(res => res.data);
};

/**
 * 저장위치정보 첨부파일 COUNT
 * @param {any} params 첨부파일 COUNT 조회 조건
 * @returns {object} 저장위치정보 첨부파일 COUNT
 */
const apiGetAtchFileCnt = (params: any) => {
	return axios.post('/api/ms/plantxsl/v1.0/getAtchFileCnt', params).then(res => res.data);
};

/**
 * 저장위치정보 파일 업로드
 * @param {any} params 업로드 파일 및 정보
 * @returns {object} 성공여부 결과값
 */
const apiFileUploadMaster = async (params: any) => {
	return axios.post('/api/ms/plantxsl/v1.0/saveFileUpload', params);
};

/**
 * 저장위치정보 파일 다운로드
 * @param {any} params 다운로드 파일 정보
 * @returns {object} 성공여부 결과값
 */
const apiFileDownloadMaster = async (params: any) => {
	return axios.post(
		//'/api/func/file/v1.0/plantXslFileDownload',
		'/api/ms/plantxsl/v1.0/saveFileDownload',
		{ contentType: 'application/x-www-form-urlencoded' },
		{ params, responseType: 'blob' },
	);
};

/**
 * 저장위치정보 파일 삭제
 * @param {any} params 검색 조건
 * @returns {object} 감모처리 저장
 */
const apiFileDeleteMaster = (params: any) => {
	return axios.post('/api/ms/plantxsl/v1.0/saveFileDelete', params).then(res => res.data);
};

export {
	apiFileDeleteMaster,
	apiFileDownloadMaster,
	apiFileUploadMaster,
	apiGetAtchFileCnt,
	apiGetMasterFileList,
	apigetPlantList,
	apiGetPlantXSLDtl,
	apiGetPlantXSLList,
	apiSavePlantXSLDtl,
};
