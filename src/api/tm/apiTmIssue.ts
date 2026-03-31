/*
 ############################################################################
 # FiledataField	: apiTmIssue.ts.
 # Description		: 배송 > 고객배송관리 > 배송이슈
 # Author			    : YeoSeungCheol(pw6375@cj.net)
 # Since			    : 25.10.23
 ############################################################################
*/
import axios from '@/api/Axios';

/**
 * 배송이슈 목록 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/tm/issue/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 배송이슈 저장(신규/수정)
 * @param params
 * @returns
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('/api/tm/issue/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 배송이슈 삭제
 * @param params
 * @returns
 */
const apiDeleteMasterList = (params: any) => {
	return axios.post('/api/tm/issue/v1.0/deleteMasterList', params).then(res => res.data);
};

/**
 * 배송이슈 확정
 * @param params
 * @returns
 */
const apiConfirmMasterList = (params: any) => {
	return axios.post('/api/tm/issue/v1.0/confirmMasterList', params).then(res => res.data);
};

/**
 * 배송이슈 첨부파일 업로드 팝업 - 첨부파일 목록
 * @param params
 * @returns
 */
const apiGetPopupUploadFileList = (params: any) => {
	return axios.post('/api/tm/issue/v1.0/fileList', params).then(res => res.data);
};

/**
 * 배송이슈 첨부파일 업로드 팝업 - 첨부파일 업로드
 * @param params
 * @returns
 */
const apiSavePopupUploadFile = (params: any) => {
	// return axios.post('/api/tm/issue/v1.0/fileUpload', data, { params: queryParams }).then(res => res.data);
	return axios.post('/api/tm/issue/v1.0/fileUpload', params).then(res => res.data);
};

/**
 * 배송이슈 첨부파일 업로드 팝업 - 첨부파일 삭제
 * @param params
 * @returns
 */
const apiDeletePopupUploadFile = (params: any) => {
	return axios.post('/api/tm/issue/v1.0/fileDelete', params).then(res => res.data);
};

/**
 * 배송이슈 첨부파일 업로드 팝업 - 첨부파일 다운로드 카운트
 * @param params
 * @returns
 */
const apiGetPopupUploadFileDownloadCount = (params: any) => {
	return axios.post('/api/tm/issue/v1.0/fileDownloadCount', params).then(res => res.data);
};

const apiGetValidateExcelList = (params: any) => {
	return axios.post('/api/tm/issue/v1.0/getValidateExcelList', params).then(res => res.data);
};

export {
	apiConfirmMasterList,
	apiDeleteMasterList,
	apiDeletePopupUploadFile,
	apiGetMasterList,
	apiGetPopupUploadFileDownloadCount,
	apiGetPopupUploadFileList,
	apiGetValidateExcelList,
	apiSaveMasterList,
	apiSavePopupUploadFile,
};
