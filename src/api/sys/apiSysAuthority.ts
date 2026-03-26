import axios from '@/api/Axios';

/**
 * ADMIN > 시스템운영 > 그룹권한 목록 검색 조회
 * @param {any} params 그룹권한 검색 조건
 * @returns {object} 그룹권한 목록
 */
const apiGetSysAuthorityGroupList = (params: any) => {
	return axios.get('/api/sys/authority/v1.0/getAuthorityGroupList', { params }).then(res => res.data);
};

/**
 * ADMIN > 시스템운영 > 권한그룹 저장
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveSysAuthorityGroup = (params: any) => {
	return axios.post('/api/sys/authority/v1.0/saveAuthorityGroup', params).then(res => res);
};

/**
 * ADMIN > 시스템운영 > 권한그룹별 프로그램 목록 검색 조회
 * @param {any} params 권한그룹별 프로그램 검색 조건
 * @returns {object} 권한그룹별 프로그램 목록
 */
const apiGetSysAuthorityProgramList = (params: any) => {
	return axios.get('/api/sys/authorityProgram/v1.0/getAuthorityProgramList', { params }).then(res => res.data);
};

/**
 * ADMIN > 시스템운영 > 권한그룹별 프로그램 저장
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveSysAuthorityProgram = (params: any) => {
	return axios.post('/api/sys/authorityProgram/v1.0/saveAuthorityProgram', params).then(res => res);
};

/**
 * ADMIN > 시스템운영 > 권한그룹별 사용자 조회
 * @param {any} params 권한그룹별 사용자 검색 조건
 * @returns {object} 권한그룹별 사용자 목록
 */
const apiGetSysAuthorityUserList = (params: any) => {
	return axios.get('/api/sys/authorityUser/v1.0/getAuthorityUserList', { params }).then(res => res.data);
};

/**
 * ADMIN > 시스템운영 > 권한그룹별 사용자 저장
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveSysAuthorityUser = (params: any) => {
	return axios.post('/api/sys/authorityUser/v1.0/saveAuthorityUser', params).then(res => res);
};

export {
	apiGetSysAuthorityGroupList,
	apiGetSysAuthorityProgramList,
	apiGetSysAuthorityUserList,
	apiPostSaveSysAuthorityGroup,
	apiPostSaveSysAuthorityProgram,
	apiPostSaveSysAuthorityUser,
};
