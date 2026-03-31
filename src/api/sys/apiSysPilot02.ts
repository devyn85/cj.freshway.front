import axios from '@/api/Axios';

/**
 * ADMIN > 시스템운영 > 프로그램 목록 검색 조회
 * @param {any} params 프로그램 검색 조건
 * @returns {object} 프로그램 목록
 */
const apiSearchSysPilot02List = (params: any) => {
	return axios.get('/api/sys/program/v1.0/getProgramList', { params }).then(res => res.data);
};

/**
 * ADMIN > 시스템운영 > 프로그램 수정 및 등록
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveSysPilot02 = (params: any) => {
	return axios.post('/api/sys/program/v1.0/saveProgram', params).then(res => res);
};

/**
 * ADMIN > 팝업 > 기사 조회
 * @param {any} params 기사 검색 조건
 * @returns {object} 기사 목록
 */
const apiSearchDriverList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getDriverList', { params }).then(res => res.data);
};

export { apiPostSaveSysPilot02, apiSearchDriverList, apiSearchSysPilot02List };
