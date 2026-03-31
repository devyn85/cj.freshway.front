import axios from '@/api/Axios';

/* 로그인 */
const apiPostAuthLogin = (params: any) => {
	return axios.post('/api/cm/login/v1.0/login', params).then(res => res.data);
};

/**
 * 인증번호 전송
 * @param {any} params 사용자 정보
 * @returns {any} 결과값
 */
const apiPostSendVerificationCode = (params: any) => {
	return axios.post('/api/cm/login/v1.0/sendVerificationCode', params).then(res => res.data);
};

/**
 * 인증번호 확인
 * @param {any} params 사용자 정보
 * @returns {any} 결과값
 */
const apiGetCheckVerificationCode = (params: any) => {
	return axios.get('/api/cm/login/v1.0/checkVerificationCode', { params }).then(res => res.data);
};

/**
 * 사용자ID 중복 count 조회
 * @param {any} params 사용자 정보
 * @returns {object} 중복 개수
 */
const apiGetDupUserIdCnt = (params: any) => {
	return axios.get('/api/cm/login/v1.0/getDupUserIdCnt', { params }).then(res => res.data);
};

/**
 * 사용자 정보 수정
 * @param {any} params 사용자 정보
 * @returns {any} 결과값
 */
const apiPostSaveUserInfo = (params: any) => {
	return axios.post('/api/cm/login/v1.0/saveUserInfo', params).then(res => res.data);
};

/**
 * 사용자 비밀번호 수정
 * @param {any} params 사용자 정보
 * @returns {any} 결과값
 */
const apiPostSaveUserPwdNo = (params: any) => {
	return axios.post('/api/cm/login/v1.0/saveUserPwdNo', params).then(res => res.data);
};

/**
 * 접속이력 팝업 조회
 * @returns {object} 접속이력 리스트
 */
const apiGetLoginHistory = () => {
	return axios.get('/api/cm/login/v1.0/getLoginHistoryList', {}).then(res => res.data);
};

/**
 * 로그아웃
 * @param {any} params 조건
 * @returns {any} 결과값
 */
const apiGetLogout = (params?: any) => {
	return axios.get('/api/cm/login/v1.0/logout', { params }).then(res => res.data);
};

export {
	apiGetCheckVerificationCode,
	apiGetDupUserIdCnt,
	apiGetLoginHistory,
	apiGetLogout,
	apiPostAuthLogin,
	apiPostSaveUserInfo,
	apiPostSaveUserPwdNo,
	apiPostSendVerificationCode,
};
