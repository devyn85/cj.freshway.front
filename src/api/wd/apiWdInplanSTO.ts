import axios from '@/api/Axios';

/**
 * 광역출고현황 목록 조회
 * @param params
 * @returns {object}
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/wd/inplanSTO/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 광역출고현황 - 주문현황 목록 조회
 * @param params
 * @returns {object}
 */
const apiGetMasterListTab1 = (params: any) => {
	return axios.post('/api/wd/inplanSTO/v1.0/getMasterListTab1', params).then(res => res.data);
};

/**
 * 광역출고현황 이력현황 목록 조회
 * @param params
 * @returns {object}
 */
const apiGetMasterListTab2 = (params: any) => {
	return axios.post('/api/wd/inplanSTO/v1.0/getMasterListTab2', params).then(res => res.data);
};

/**
 * 광역출고현황 출고이력정보 목록 조회
 * @param params
 * @returns {object}
 */
const apiGetMasterListTab3 = (params: any) => {
	return axios.post('/api/wd/inplanSTO/v1.0/getMasterListTab3', params).then(res => res.data);
};

/**
 * 이체확인서 출력 (마스터 그리드)
 * @param params
 */
const apiGetPrintMasterInvoice = (params: any) => {
	return axios.post('/api/wd/inplanSTO/v1.0/getPrintMasterInvoice', params).then(res => res.data);
};

/**
 * 이체확인서 출력 (디테일 그리드)
 * @param params
 */
const apiGetPrintDetailInvoice = (params: any) => {
	return axios.post('/api/wd/inplanSTO/v1.0/getPrintDetailInvoice', params).then(res => res.data);
};

/**
 * 엑셀 다운로드
 * @param params
 */
const apiPostLargeDataExcel = (params: any) => {
	return axios
		.post('/api/wd/inplanSTO/v1.0/saveLargeDataExcel', params, { responseType: 'blob' })
		.then(res => res.data);
};
/**
 * 엑셀 다운로드
 * @param params
 */
const apiGetExcellist = (params: any) => {
	return axios.post('/api/wd/inplanSTO/v1.0/getExcellist', params).then(res => res.data);
};

export {
	apiGetExcellist,
	apiGetMasterList,
	apiGetMasterListTab1,
	apiGetMasterListTab2,
	apiGetMasterListTab3,
	apiGetPrintDetailInvoice,
	apiGetPrintMasterInvoice,
	apiPostLargeDataExcel,
};
