import axios from '@/api/Axios';

/**
 * 로그인 사용자 권한에 따른 메뉴 리스트 조회
 * @returns {object} 메뉴 리스트
 */
const apiGetMenuRoleList = () => {
	return axios.get('/api/cm/main/v1.0/getMenuRoleList').then(res => res.data);
};

/**
 * 사용자별 공통 코드 정보 조회
 * @param {object} params 공통그룹코드 리스트
 * @returns {object} 공통코드 리스트
 */
const apiGetUserCmCodeList = (params: any) => {
	return axios.get('/api/cm/main/v1.0/getUserCodeList', params).then(res => res.data);
};

/**
 * 로그인 후 사용자 정보 조회
 * @returns {object} 사용자 정보
 */
const apiGetCmUser = () => {
	return axios.get('/api/cm/main/v1.0/getCmUser').then(res => res.data);
};

/**
 * 사용자 접속 권한 정보 조회
 * @returns {object} 사용자 권한 정보
 */
const apiGetCmUserAuthority = () => {
	return axios.get('/api/cm/main/v1.0/getCmUserAuthority').then(res => res.data);
};

/**
 * 검색유형별 사용자 정보 조회
 * @param {object} params 조회 조건
 * @returns {object} 사용자 정보
 */
const apiGetUserBySelType = (params: any) => {
	return axios.get('/api/cm/main/v1.0/getUserBySelType', { params }).then(res => res.data);
};

/**
 * 사용자 이메일 조회
 * @param {object} params 조회 조건
 * @returns {object} 사용자 이메일
 */
const apiGetUserEmailByUserId = (params: any) => {
	return axios.get('/api/cm/main/v1.0/getUserEmailByUserId', { params }).then(res => res.data);
};

/**
 * 알림 읽음 처리
 * @param {any} params 조건
 * @returns {any} 결과값
 */
const apiPostSaveNoticeRead = (params: any) => {
	return axios.post('/api/cm/main/v1.0/saveNoticeRead', params, { showLoading: false } as any).then(res => res.data);
};

export {
	apiGetCmUser,
	apiGetCmUserAuthority,
	apiGetMenuRoleList,
	apiGetUserBySelType,
	apiGetUserCmCodeList,
	apiGetUserEmailByUserId,
	apiPostSaveNoticeRead,
};
