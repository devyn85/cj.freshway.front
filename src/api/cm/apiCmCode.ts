import axios from '@/api/Axios';

/**
 * 기준정보 > 기타기준정보 > 코드 목록 검색 조회
 * @param {any} params 코드 검색 조건
 * @returns {object} 코드 목록
 */
const apiGetCmCodeList = (params: any) => {
	return axios.get('/api/cm/code/v1.0/getCodeHeaderList', { params }).then(res => res.data);
};

/**
 * 기준정보 > 기타기준정보 > 상세 코드 목록 검색 조회
 * @param {any} params 상세 코드 검색 조건
 * @returns {object} 상세 코드 목록
 */
const apiGetCmCodeDetailList = (params: any) => {
	return axios.get('/api/cm/code/v1.0/getCodeDetailList', { params }).then(res => res.data);
};

/**
 * 기준정보 > 기타기준정보 > 그룹 코드 수정 및 등록
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveCmGrpCode = (params: any) => {
	return axios.post('/api/cm/code/v1.0/saveCmGrpCode', params).then(res => res);
};

/**
 * 기준정보 > 기타기준정보 > 공통 코드 수정 및 등록
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveCmDtlCode = (params: any) => {
	return axios.post('/api/cm/code/v1.0/saveCmDtlCode', params).then(res => res);
};

export { apiGetCmCodeDetailList, apiGetCmCodeList, apiPostSaveCmDtlCode, apiPostSaveCmGrpCode };
