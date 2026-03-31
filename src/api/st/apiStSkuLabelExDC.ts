/*
 ############################################################################
 # FiledataField	: apiStSkuLabelExDC.ts
 # Description		: 재고 > 재고조정 > 상품이력번호등록(재고생성) API
 # Author					: Baechan
 # Since					: 2025.09.03
 ############################################################################
*/
import axios from '@/api/Axios';

const REQUEST_API = '/api/st/skuLabelExDC';

/**
 * 조회 api 함수
 * @param params
 * @returns {object}  목록
 */
const apiGetMasterList = (params: any) => {
	return axios.get(REQUEST_API + '/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 * 저장 api 함수
 * @param params
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * durationtype 조회 api 함수
 * @param params
 */
const apiGetDurationTypeListByExcelUploadList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getDurationTypeListByExcelUploadList', params).then(res => res.data);
};

/**
 * 바코드 중복 조회 api 함수
 * @param params
 */
const apiGetCheckBarcodeDuplicate = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getCheckBarcodeDuplicate', params).then(res => res.data);
};

/**
 * 정합성검사 함수
 * @param params
 */
const apiGetExcelUploadSkuLabelExDCList = (params: any) => {
	return axios.post(REQUEST_API + '/v1.0/getExcelUploadSkuLabelExDCList', params).then(res => res.data);
};
export {
	apiGetCheckBarcodeDuplicate,
	apiGetDurationTypeListByExcelUploadList,
	apiGetExcelUploadSkuLabelExDCList,
	apiGetMasterList,
	apiPostSaveMasterList,
};
