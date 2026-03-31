/*
 ############################################################################
 # FiledataField	: apiSttplIssueReq.ts
 # Description		: 재고 > 재고현황 > PLT-ID변경 조회 API
 # Author			: sss
 # Since			: 2025.08.25
 ############################################################################
*/
import axios from '@/api/Axios';
import { processSearchCondition } from '@/api/cm/apiCmSearch';

/**
 * 재고 > 재고현황 > PLT-ID변경 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostMasterList = (params: any) => {
	return axios.post('/api/st/tplIssueReq/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 재고 > 재고현황 > PLT-ID변경 List
 * @param {any} params  검색 조건
 * @returns {object}  목록
 */
const apiPostStTplIssueReqPopupData = (params: any) => {
	return axios.post('/api/st/tplIssueReq/v1.0/getStTplIssueReqPopupData', params).then(res => res.data);
};
const apisaveMasterList = (params: any) => {
	return axios.post('/api/st/tplIssueReq/v1.0/saveList', params).then(res => res.data);
};
const apiGetExcelCheck = (params: any) => {
	return axios.post('/api/st/tplIssueReq/v1.0/getExcelCheck', params).then(res => res.data);
};
/**
 * 첨부 삭제(소프트 삭제)
 * @param params
 */
const apiPostDeleteTplReceipReqFileUpload = (params: any) => {
	return axios.post('/api/st/tplIssueReq/v1.0/deleteTplReceipReqFileUpload', params).then(res => res);
};

/**
 * 이미지 업로드 팝업 - 임시저장
 * @param params 임시저장: NAS 저장 + STATUS='N'
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveTplReceipReqFileUploadTemp = (params: any) => {
	return axios.post('/api/st/tplIssueReq/v1.0/saveTplReceipReqFileUploadTemp', params).then(res => res);
};

/**
 * 이미지 업로드 팝업 - 확정
 * @param params 확정: EDMS 저장 + STATUS='Y'
 * @returns
 */
const apiPostConfirmTplReceipReqFileUpload = (params: any) => {
	return axios.post('/api/st/tplIssueReq/v1.0/confirmTplReceipReqFileUpload', params).then(res => res);
};
/**
 * 거래처 배송정보 이미지 조회 (목록)
 * @param {any} params 검색 조건
 * @returns {object} 거래처 배송정보 이미지 조회 (목록)
 */
const apiGetUploadFileList = (params: any) => {
	return axios.get('/api/st/tplIssueReq/v1.0/getUploadFileList', { params }).then(res => res.data);
};
/**
 * 거래처 배송정보 이미지 조회 (목록)
 * @param {any} params 검색 조건
 * @returns {object} 거래처 배송정보 이미지 조회 (목록)
 */
const apiGetDocNo = (params: any) => {
	return axios.post('/api/st/tplIssueReq/v1.0/getDocNo', { params }).then(res => res.data);
};
const apiPoststtplIssueReqFileDownload = async (params: any) => {
	return axios.post(
		'/api/st/tplIssueReq/v1.0/sttplIssueReqFileDownload',
		{ contentType: 'application/x-www-form-urlencoded' },
		{ params, responseType: 'blob' },
	);
};

/**
 * 상품 코드 조회
 * @param {any} params 상품 코드 검색 조건
 * @returns {object} 상품 목록
 */
const apiGetSkuList = (params: any): any => {
	if (!processSearchCondition(params)) {
		return false;
	}

	return axios
		.post('/api/st/tplIssueReq/v1.0/getTplSkuList', params, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: (({ multiSelect, ...qs }) => qs)(params), // 쿼리스트링에서 multiSelect를 제거한 후 요청합니다. (Body에 담아서 보냄)
		})
		.then(res => res.data);
};
export {
	apiGetDocNo,
	apiGetExcelCheck,
	apiGetSkuList,
	apiGetUploadFileList,
	apiPostConfirmTplReceipReqFileUpload,
	apiPostDeleteTplReceipReqFileUpload,
	apiPostMasterList,
	apiPostSaveTplReceipReqFileUploadTemp,
	apiPoststtplIssueReqFileDownload,
	apiPostStTplIssueReqPopupData,
	apisaveMasterList,
};
