/**
 * Swagger BackEnd API Document - 공통기능 API
 * http://api.ictdev.cj.net/swagger-ui/index.html?configUrl=%2Fv3%2Fapi-docs%2Fswagger-config&urls.primaryName=%EA%B3%B5%ED%86%B5%EA%B8%B0%EB%8A%A5%20API
 */

import axios from '../Axios';

/**
 * 공지사항 API
 * @param {object} params 공지사항 권한 체크 대상 userId
 * @returns {object} 공지사항 권한 보유 여부 반환
 */
const apiGetAdminCheck = async (params: any) => {
	return axios.get('/comfunc/func/bbs/bbsAdminMng/adminCheck', { params }).then(res => res.data);
};

const apiGetBbsList = async (params: any) => {
	return axios.get('/comfunc/func/bbs/bbsAdminMng/search', { params }).then(res => res.data);
};

const apiGetBbsDetail = async (params: any) => {
	return axios.get('/comfunc/func/bbs/bbsAdminRegPop/search', { params }).then(res => res.data);
};

const apiGetBbsAttchFileList = async (params: any) => {
	return axios.get('/comfunc/func/bbs/bbsAdminRegPop/searchFile', { params }).then(res => res.data);
};

const apiPostSaveBbs = async (params: any) => {
	return axios.post('/comfunc/func/bbs/bbsAdminRegPop/save', params).then(res => {
		res.data;
	});
};

const apiPostRemoveBbs = async (params: any) => {
	return axios.post('/comfunc/func/bbs/bbsAdminRegPop/delete', params).then(res => {
		res.data;
	});
};

/**
 * 파일 목록 조회 API
 * @param {Array<object>} params file 그룹 아이디
 * @returns {object} 파일 목록 반환
 */
const apiGetFileList = async (params: any) => {
	return axios.get('/comfunc/func/filePage/search', { params }).then(res => res.data);
};

const apiGetAttchFileList = async (params: any) => {
	return axios.get('/api/func/file/search', { params }).then(res => res.data);
};

const apiPostSaveFile = async (params: any) => {
	return axios.post('/api/func/file/save', params);
};

const apiPostDownloadFile = async (params: any) => {
	return axios
		.post(
			'/api/func/file/downloadFile',
			{ contentType: 'application/x-www-form-urlencoded' },
			{ params, responseType: 'blob' },
		)
		.then(res => res);
};

/**
 * 차트 API
 * @param {object} params 차트 조회 param
 * @returns {object} 차트 데이터 목록
 */
const apiGetChartData = async (params: any) => {
	return axios.get('/comfunc/func/chart/list', { params }).then(res => res.data);
};

/**
 * 임직원 팝업 목록 조회 API
 * @param {object} params 조회 param
 * @returns {object} 임직원 목록
 */
const apiGetPopupEmpGetData = async (params: any) => {
	return axios.get('/comfunc/func/popup/emp/getData', { params }).then(res => res.data);
};

/**
 * 엑셀 업로드 API
 * @param {object} params 엑셀 파일
 * @returns {object} 업로드 성공 여부
 */
const apiPostExcelUpload = async (params: any) => {
	return axios
		.post('/comfunc/func/excel/excelUpload', params, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then(res => res.data);
};

/**
 * 엑셀 다운로드 API
 * @param {object} params 다운로드할 엑셀 id
 * @returns {object} 엑셀 파일 다운로드
 */
const apiPostExcelDownload = async (params: any) => {
	return axios.post('/comfunc/func/excel/download/xlsx', params, { responseType: 'blob' }).then(res => res);
};

/**
 * 이메일 전송 API
 * @param {object} params 이메일 정보
 * @returns {object} 메일 전송 성공 여부
 */
const apiPostSendSimpleMail = async (params: any) => {
	return axios.post('/comfunc/func/mail/sendSimpleMail', params).then(res => res.data);
};

/**
 * 대량데이터 조회 API
 * @param {object} params 조회 param
 * @returns {object} 대량데이터 목록
 */
const apiGetLargeDataSearch = async (params: any) => {
	return axios.get('/comfunc/func/largedata/search', { params }).then(res => res.data);
};

/**
 * 대량데이터 엑셀 다운로드 API
 * 엑셀 다운로드 결과 값은 res만 return
 * @param {object} params 엑셀 조회 param
 * @returns {object} 엑셀 파일
 */
const apiGetLargeDataExcel = (params: any) => {
	return axios.get('/comfunc/func/largedata/excel', { params }).then(res => res);
};

/**
 * 타임존 리스트 조회 API
 * @returns {object} 타임존 목록
 */
const apiGetTimezoneList = () => {
	return axios.get('/comfunc/func/timezone/list').then(res => res.data);
};

const apiGetPagingNaviList = (params: any) => {
	return axios.get('/comfunc/func/paging/navi/list', { params }).then(res => res.data);
};

const apiGetPagingScrollList = (params: any) => {
	return axios.get('/comfunc/func/paging/scroll/list', { params }).then(res => res.data);
};

export {
	apiGetAdminCheck,
	apiGetAttchFileList,
	apiGetBbsAttchFileList,
	apiGetBbsDetail,
	apiGetBbsList,
	apiGetChartData,
	apiGetFileList,
	apiGetLargeDataExcel,
	apiGetLargeDataSearch,
	apiGetPagingNaviList,
	apiGetPagingScrollList,
	apiGetPopupEmpGetData,
	apiGetTimezoneList,
	apiPostDownloadFile,
	apiPostExcelDownload,
	apiPostExcelUpload,
	apiPostRemoveBbs,
	apiPostSaveBbs,
	apiPostSaveFile,
	apiPostSendSimpleMail,
};
