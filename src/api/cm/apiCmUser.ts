import axios from '@/api/Axios';

/**
 * 기준정보 > 사용자및센터정보 > 사용자정보관리 > 그룹권한 목록 검색 조회
 * @param {any} params 그룹권한 검색 조건
 * @returns {object} 그룹권한 목록
 */
const apiGetCmAuthorityGroupList = (params: any) => {
	return axios.get('/api/cm/user/v1.0/getAuthorityGroupList', { params }).then(res => res.data);
};

/**
 * 기준정보 > 사용자및센터정보 > 사용자정보관리 > 사용자 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetCmUserList = (params: any) => {
	return axios.get('/api/cm/user/v1.0/getUserList', { params }).then(res => res.data);
};

/**
 * 기준정보 > 사용자및센터정보 > 사용자정보관리 > 사용자 상세 정보 조회
 * @param {any} params 사용자 정보
 * @returns {object} 목록
 */
const apiGetCmUserDetail = (params: any) => {
	return axios.get('/api/cm/user/v1.0/getUserDetail', { params }).then(res => res.data);
};

/**
 * 기준정보 > 사용자및센터정보 > 사용자정보관리 > 사용자 센터 권한 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetCmUserConnectList = (params: any) => {
	return axios.get('/api/cm/user/v1.0/getUserConnectList', { params }).then(res => res.data);
};

/**
 * 기준정보 > 사용자및센터정보 > 사용자정보관리 > 사용자 그룹권한 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetCmUserAuthorityList = (params: any) => {
	return axios.get('/api/cm/user/v1.0/getUserAuthorityList', { params }).then(res => res.data);
};

/**
 * 기준정보 > 사용자및센터정보 > 사용자정보관리 > 사용자 관리 저장
 * @param {any} params 저장 정보
 * @returns {object} 성공여부
 */
const apiPostSaveCmUser = (params: any) => {
	return axios.post('/api/cm/user/v1.0/saveUser', params).then(res => res);
};

/**
 * 기준정보 > 사용자및센터정보 > 사용자정보관리 > 사용자별 센터 권한 저장
 * @param {any} params 저장 정보
 * @returns {object} 성공여부
 */
const apiPostSaveCmUserConnect = (params: any) => {
	return axios.post('/api/cm/user/v1.0/saveUserConnect', params).then(res => res);
};

/**
 * 기준정보 > 사용자및센터정보 > 사용자정보관리 > 사용자별 권한 저장
 * @param {any} params 저장 정보
 * @returns {object} 성공여부
 */
const apiPostSaveCmUserAuthority = (params: any) => {
	return axios.post('/api/cm/user/v1.0/saveUserAuthority', params).then(res => res);
};

/**
 * 기준정보 > 사용자및센터정보 > 사용자정보관리 > 사용자 인증 SMS 전송
 * @param {any} params 전송 정보
 * @returns {object} 성공여부
 */
const apiPostSendSmsVerification = (params: any) => {
	return axios.post('/api/cm/user/v1.0/sendSmsVerification', params).then(res => res);
};

/**
 * 기준정보 > 사용자및센터정보 > 사용자정보관리 > 임시비밀번호 생성 및 발송
 * @param {any} params 저장 정보
 * @returns {object} 성공여부
 */
const apiPostSaveUserTmpPwd = (params: any) => {
	return axios.post('/api/cm/user/v1.0/saveUserTmpPwd', params).then(res => res);
};

/**
 * 기준정보 > 사용자및센터정보 > 사용자정보관리 > 임시 사용자 승인
 * @param {any} params 승인 정보
 * @returns {object} 성공여부
 */
const apiPostSaveUserApprv = (params: any) => {
	return axios.post('/api/cm/user/v1.0/saveUserApprv', params).then(res => res);
};

/**
 * 기준정보 > 사용자및센터정보 > 사용자정보관리 > 사용자 잠김 계정 해제
 * @param {any} params 저장 정보
 * @returns {object} 성공여부
 */
const apiPostSaveUnlockUser = (params: any) => {
	return axios.post('/api/cm/user/v1.0/saveUnlockUser', params).then(res => res);
};

export {
	apiGetCmAuthorityGroupList,
	apiGetCmUserAuthorityList,
	apiGetCmUserConnectList,
	apiGetCmUserDetail,
	apiGetCmUserList,
	apiPostSaveCmUser,
	apiPostSaveCmUserAuthority,
	apiPostSaveCmUserConnect,
	apiPostSaveUnlockUser,
	apiPostSaveUserApprv,
	apiPostSaveUserTmpPwd,
	apiPostSendSmsVerification,
};
