/*
 ############################################################################
 # FiledataField	: apiTmCrmWmsMemo.ts.
 # Description		: 배송 > 고객배송관리 > CRM요청관리
 # Author			    : YeoSeungCheol(pw6375@cj.net)
 # Since			    : 25.10.23
 ############################################################################
*/
import axios from '@/api/Axios';

/**
 * CRM요청관리 목록 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/tm/crmWmsMemo/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 처리이력 목록 조회
 * @param params
 * @returns
 */
const apiGetMasterHistList = (params: any) => {
	return axios.post('/api/tm/crmWmsMemo/v1.0/getDetailHistoryList', params).then(res => res.data);
};

/**
 * 처리상세 조회
 * @param params
 */
const apiGetMasterDetail = (params: any) => {
	return axios.post('/api/tm/crmWmsMemo/v1.0/getDetailInfo', params).then(res => res.data);
};

/**
 * CRM 요청관리 목록 - 확정 처리
 * @param params
 */
const apiSaveCrmApply = (params: any) => {
	return axios.post('/api/tm/crmWmsMemo/v1.0/saveCrmApply', params).then(res => res.data);
};

/**
 * CRM 요청관리 목록 - 삭제 처리
 * @param params
 */
const apiCrmDelete = (params: any) => {
	return axios.post('/api/tm/crmWmsMemo/v1.0/delete', params).then(res => res.data);
};

/**
 * 처리상세 - 저장
 * @param params
 */
const apiSaveDetail = (params: any) => {
	return axios.post('/api/tm/crmWmsMemo/v1.0/saveDetail', params).then(res => res.data);
};

/**
 * CRM요청관리 첨부파일 업로드 팝업 - 첨부파일 목록
 * @param params
 */
const apiGetPopupUploadFileList = (params: any) => {
	return axios.post('/api/tm/crmWmsMemo/v1.0/fileList', params).then(res => res.data);
};

/**
 * CRM요청관리 첨부파일 업로드 팝업 - 첨부파일 업로드
 * @param params
 */
const apiSavePopupUploadFile = (params: any) => {
	return axios.post('/api/tm/crmWmsMemo/v1.0/fileUpload', params).then(res => res.data);
};

/**
 * CRM요청관리 첨부파일 업로드 팝업 - 첨부파일 삭제
 * @param params
 */
const apiDeletePopupUploadFile = (params: any) => {
	return axios.post('/api/tm/crmWmsMemo/v1.0/fileDelete', params).then(res => res.data);
};

export {
	apiCrmDelete,
	apiDeletePopupUploadFile,
	apiGetMasterDetail,
	apiGetMasterHistList,
	apiGetMasterList,
	apiGetPopupUploadFileList,
	apiSaveCrmApply,
	apiSaveDetail,
	apiSavePopupUploadFile,
};
