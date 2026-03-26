/*
 ############################################################################
 # FiledataField	: apiStConvertId.ts
 # Description		: 재고 > 재고현황 > PLT-ID변경 조회 API
 # Author			: sss
 # Since			: 2025.08.25
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/convertId';

/**
 * 재고 > 재고현황 > PLT-ID변경 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post('/api/st/tplReceiptReq/v1.0/getMasterList', params).then(res => res.data);
};
const apisaveMasterList = (params: any) => {
	return axios.post('/api/st/tplReceiptReq/v1.0/saveList', params).then(res => res.data);
};
/**
 * 첨부 삭제(소프트 삭제)
 * @param params
 */
const apiPostDeleteTplReceipReqFileUpload = (params: any) => {
	return axios.post('/api/st/tplReceiptReq/v1.0/deleteTplReceipReqFileUpload', params).then(res => res);
};
/**
 * 재고 > 재고현황 > PLT-ID변경 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiGetExcelCheck = (params: any) => {
	return axios.post('/api/st/tplReceiptReq/v1.0/getExcelCheck', params).then(res => res.data);
};

/**
 * 이미지 업로드 팝업 - 임시저장
 * @param params 임시저장: NAS 저장 + STATUS='N'
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveTplReceipReqFileUploadTemp = (params: any) => {
	return axios.post('/api/st/tplReceiptReq/v1.0/saveTplReceipReqFileUploadTemp', params).then(res => res);
};

/**
 * 이미지 업로드 팝업 - 확정
 * @param params 확정: EDMS 저장 + STATUS='Y'
 * @returns
 */
const apiPostConfirmTplReceipReqFileUpload = (params: any) => {
	return axios.post('/api/st/tplReceiptReq/v1.0/confirmTplReceipReqFileUpload', params).then(res => res);
};
/**
 * 거래처 배송정보 이미지 조회 (목록)
 * @param {any} params 검색 조건
 * @returns {object} 거래처 배송정보 이미지 조회 (목록)
 */
const apiGetUploadFileList = (params: any) => {
	return axios.get('/api/st/tplReceiptReq/v1.0/getUploadFileList', { params }).then(res => res.data);
};
/**
 * 거래처 배송정보 이미지 조회 (목록)
 * @param {any} params 검색 조건
 * @returns {object} 거래처 배송정보 이미지 조회 (목록)
 */
const apiGetDocNo = (params: any) => {
	return axios.post('/api/st/tplReceiptReq/v1.0/getDocNo', { params }).then(res => res.data);
};
// const apiPoststTplReceiptReqFileDownload = async (params: any) => {
// 	return axios.post(
// 		'/api/st/tplReceiptReq/v1.0/stTplReceiptReqFileDownload',
// 		{ contentType: 'application/x-www-form-urlencoded' },
// 		{ params, responseType: 'blob' },
// 	);
// };
const apiPoststTplReceiptReqFileDownload = async (params: any) => {
	return axios.post('/api/st/tplReceiptReq/v1.0/stTplReceiptReqFileDownload', null, {
		params,
		responseType: 'blob',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});
};

export {
	apiGetDocNo,
	apiGetExcelCheck,
	apiGetUploadFileList,
	apiPostConfirmTplReceipReqFileUpload,
	apiPostDeleteTplReceipReqFileUpload,
	apiPostMasterList,
	apiPostSaveTplReceipReqFileUploadTemp,
	apiPoststTplReceiptReqFileDownload,
	apisaveMasterList,
};
