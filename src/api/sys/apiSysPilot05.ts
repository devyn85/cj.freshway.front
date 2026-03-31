import axios from '@/api/Axios';

/**
 * ADMIN > 시스템운영 > 프로그램 목록 검색 조회
 * @param {any} params 프로그램 검색 조건
 * @returns {object} 프로그램 목록
 */
const apiSearchSysPilot05List = (params: any) => {
	return axios.get('/api/sys/program/v1.0/getProgramList', { params }).then(res => res.data);
};

/**
 * ADMIN > 시스템운영 > 프로그램 수정 및 등록
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveSysPilot05 = (params: any) => {
	return axios.post('/api/sys/program/v1.0/saveProgram', params).then(res => res);
};

export { apiPostSaveSysPilot05, apiSearchSysPilot05List };
