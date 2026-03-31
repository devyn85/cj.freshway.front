import axios from '@/api/Axios';

/**
 * 누락분STO이체 조회
 * @param {any} params 검색 조건
 * @returns {object} 누락분STO이체 조회
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/om/tnsfMissingSTO/v1.0/getMasterList', params).then(res => res.data);
};
/**
 * 누락분STO이체 조회
 * @param {any} params 검색 조건
 * @returns {object} 누락분STO이체 조회
 */
const apiGetMasterPrintList = (params: any) => {
	return axios.post('/api/om/tnsfMissingSTO/v1.0/getMasterPrintList', params).then(res => res.data);
};
/**
 * 누락분STO이체 조회
 * @param {any} params 검색 조건
 * @returns {object} 누락분STO이체 조회
 */
const apiGetMaster1PrintList = (params: any) => {
	return axios.post('/api/om/tnsfMissingSTO/v1.0/getMaster1PrintList', params).then(res => res.data);
};
/**
 * 누락분 공급받는센터 STO이체 조회
 * @param {any} params 검색 조건
 * @returns {object} 누락분STO이체 조회
 */
const apiGetMasterList1 = (params: any) => {
	return axios.post('/api/om/tnsfMissingSTO/v1.0/getMasterList1', params).then(res => res.data);
};

/**
 * 누락분STO이체 저장
 * @param {any} params 누락분STO이체 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/om/tnsfMissingSTO/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 누락분STO이체 저장
 * @param {any} params 누락분STO이체 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList1 = (params: any) => {
	return axios.post('/api/om/tnsfMissingSTO/v1.0/saveMasterList1', params).then(res => res.data);
};

/**
 * 누락분STO이체 확정
 * @param {any} params 누락분STO이체 확정 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostConfirmMasterList = (params: any) => {
	return axios.post('/api/om/tnsfMissingSTO/v1.0/confirmMasterList', params).then(res => res.data);
};
export {
	apiGetMaster1PrintList,
	apiGetMasterList,
	apiGetMasterList1,
	apiGetMasterPrintList,
	apiPostConfirmMasterList,
	apiPostSaveMasterList,
	apiPostSaveMasterList1,
};
