import axios from '@/api/Axios';

/**
 * 거래처별POP관리 정보 조회
 * @param {any} params 검색 조건
 * @returns {object} 거래처별POP관리 정보 조회(목록)
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/ms/popMng/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * Rolltainer 조회
 * @param params
 * @returns {object} 거래처별POP관리 정보 조회(목록)
 */
const apiGetRolltainerList = () => {
	return axios.get('/api/ms/popMng/v1.0/getRolltainerList').then(res => res.data);
};

/**
 * 거래처별POP관리 정보 MERGE
 * @param {any} params 거래처별POP관리 정보 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/popMng/v1.0/saveMasterList', params).then(res => res);
};

/**
 * 거래처별POP관리 정보 일괄 재전송
 * @param {any} params 거래처별POP관리 정보 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterResend = (params: any) => {
	return axios.post('/api/ms/popMng/v1.0/saveMasterResend', params).then(res => res);
};

/**
 * 거래처별POP관리 excel 대량 업로드
 * @param {any} params 거래처별POP관리 정보 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveExcelList = (params: any) => {
	return axios.post('/api/ms/popMng/v1.0/saveExcelList', params).then(res => res);
};

/**
 * codelist 정보 조회
 * @param {any} params 검색 조건
 * @returns {object} codelist 정보 조회(목록)
 */
const apiGetDetailCodeList = (params: any) => {
	return axios.get('/api/ms/popMng/v1.0/getDetailCodeList', { params }).then(res => res.data);
};

/**
 * 대표POP변경 codeList & bulk update 저장
 * @param {any} params codeList 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveCodeList = (params: any) => {
	return axios.post('/api/ms/popMng/v1.0/saveCodeList', params).then(res => res);
};

export {
	apiGetDetailCodeList,
	apiGetMasterList,
	apiGetRolltainerList,
	apiPostSaveCodeList,
	apiPostSaveExcelList,
	apiPostSaveMasterList,
	apiPostSaveMasterResend,
};
