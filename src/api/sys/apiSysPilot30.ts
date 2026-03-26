import axios from '@/api/Axios';

/**
 * ADMIN > 시스템운영 > 프로그램 목록 검색 조회
 * @param {any} params 프로그램 검색 조건
 * @returns {object} 프로그램 목록
 */
const apiSearchSysPilot30List = (params: any) => {
	return axios.get('/api/sys/pilot30/v1.0/getPilot30List', { params }).then(res => res.data);
};

/**
 * ADMIN > 시스템운영 > 프로그램 수정 및 등록
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveSysPilot30 = (params: any) => {
	return axios.post('/api/sys/pilot30/v1.0/savePilot30List', params).then(res => res);
};

export { apiPostSaveSysPilot30, apiSearchSysPilot30List };
