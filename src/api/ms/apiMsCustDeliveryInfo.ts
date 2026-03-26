import axios from '@/api/Axios';

/**
 * GPS 좌표등록 조회 (목록)
 * @param {any} params 검색 조건
 * @returns {object} GPS 좌표등록 조회 (목록)
 */
const apiGetGpsMasterList = (params: any) => {
	return axios.post('/api/ms/custdelivery/v1.0/getGpsMasterList', params).then(res => res.data);
};

/**
 * GPS 좌표 저장
 * @param {any} params GPS 좌표 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveCustDeliveryInfo = (params: any) => {
	return axios.post('/api/ms/custdelivery/v1.0/saveDeliveryInfo', params).then(res => res.data);
};

/**
 * 거래처 배송정보 조회 (목록)
 * @param {any} params 검색 조건
 * @returns {object} 거래처 배송정보 조회 (목록)
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/ms/custdelivery/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 거래처 배송정보 조회 (단건)
 * @param {any} params 검색 조건
 * @returns {object} 거래처 배송정보 조회 (단건)
 */
const apiGetMaster = (params: any) => {
	return axios.get('/api/ms/custdelivery/v1.0/getMaster', { params }).then(res => res.data);
};

/**
 * 거래처 배송정보 조회 (단건)
 * @param {any} params 검색 조건
 * @returns {object} 거래처 배송정보 조회 (단건)
 */
const apiGetMasterPrintList = (params: any) => {
	return axios.get('/api/ms/custdelivery/v1.0/getMasterPrintList', { params }).then(res => res.data);
};

/**
 * 거래처 정보 저장
 * @param {any} params 거래처 정보 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/custdelivery/v1.0/saveMasterList', params).then(res => res);
};

/**
 * 엑셀 업로드 유효성 검사(목록)
 * @param {any} params 엑셀 업로드 유효성 검사(목록)
 * @returns {object} 성공여부 결과값
 */
const apiGetValidateExcelList = (params: any) => {
	return axios.post('/api/ms/custdelivery/v1.0/getValidateExcelList', params).then(res => res);
};

/**
 * 거래처 정보 저장
 * @param {any} params 거래처 정보 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMaster = (params: any) => {
	return axios.post('/api/ms/custdelivery/v1.0/saveMaster', params).then(res => res);
};

/**
 * 거래처 배송정보 이미지 조회 (목록)
 * @param {any} params 검색 조건
 * @returns {object} 거래처 배송정보 이미지 조회 (목록)
 */
const apiGetUploadFileList = (params: any) => {
	return axios.get('/api/ms/custdelivery/v1.0/getUploadFileList', { params }).then(res => res.data);
};

/**
 * 거래처 배송정보 이미지 저장
 * @param {any} params 거래처 배송정보 이미지 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveCustDeliveryInfoFileUpload = (params: any) => {
	return axios.post('/api/ms/custdelivery/v1.0/saveCustDeliveryInfoFileUpload', params).then(res => res);
};

/**
 * 이미지 업로드 팝업 - 임시저장
 * @param params 임시저장: NAS 저장 + STATUS='N'
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveCustDeliveryInfoFileUploadTemp = (params: any) => {
	return axios.post('/api/ms/custdelivery/v1.0/saveCustDeliveryInfoFileUploadTemp', params).then(res => res);
};

/**
 * 이미지 업로드 팝업 - 확정
 * @param params 확정: EDMS 저장 + STATUS='Y'
 * @returns
 */
const apiPostConfirmCustDeliveryInfoFileUpload = (params: any) => {
	return axios.post('/api/ms/custdelivery/v1.0/confirmCustDeliveryInfoFileUpload', params).then(res => res);
};

/**
 * 첨부 삭제(소프트 삭제)
 * @param params
 */
const apiPostDeleteCustDeliveryInfoFileUpload = (params: any) => {
	return axios.post('/api/ms/custdelivery/v1.0/deleteCustDeliveryInfoFileUpload', params).then(res => res);
};

/**
 * 주소 정보 조회
 * @param {any} params 거래처 코드.
 * @returns {object} 거래처 기본 정보.
 */
const selectAddressInfoList = (params: any) => {
	return axios.post('/api/ms/custdelivery/v1.0/selectAddressInfoList', params).then(res => res.data);
};

/**
 * 주소 정보 조회_거래처
 * @param {any} params 거래처 코드.
 * @returns {object} 거래처 기본 정보.
 */
const apiSelectAddressList = (params: any) => {
	return axios.post('/api/ms/custdelivery/v1.0/selectAddressList', params).then(res => res.data);
};

export {
	apiGetGpsMasterList,
	apiGetMaster,
	apiGetMasterList,
	apiGetMasterPrintList,
	apiGetUploadFileList,
	apiGetValidateExcelList,
	apiPostConfirmCustDeliveryInfoFileUpload,
	apiPostDeleteCustDeliveryInfoFileUpload,
	apiPostSaveCustDeliveryInfo,
	apiPostSaveCustDeliveryInfoFileUpload,
	apiPostSaveCustDeliveryInfoFileUploadTemp,
	apiPostSaveMaster,
	apiPostSaveMasterList,
	apiSelectAddressList,
	selectAddressInfoList,
};
