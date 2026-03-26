/**
 * Swagger BackEnd API Document - Common API
 * http://api.canalframe.cj.net/swagger-ui/index.html#/Public
 */

// import axios from '@/api/Axios';
import axios from '../Axios';

/**
 * 공통코드 조회 API(Public)
 * @param {object} params 공통코드
 * @returns {object} 공통코드 목록
 */
const apiGetCommonCdList = (params: any) => {
	return axios.get('/common/public/commonCdList', { params }).then(res => res.data);
};

/**
 * ***********************************************************
 * ********* MAIN
 * ***********************************************************
 */

/**
 *	멀티 공통코드 리스트 조회 API
 *	Array params 적용
 * @param {object} params 공통그룹코드 리스트
 * @returns {object} 멀티 공통코드 리스트
 */
const apiGetGrpCommCodeList = (params: any) => {
	return axios
		.get('/common/main/getGrpCommCodeList', {
			params,
		})
		.then(res => res.data);
};

const apiGetUser = () => {
	return axios.get('/common/main/user').then(res => res.data);
};

const apiGetMenuList = () => {
	return axios.get('/common/main/menulist').then(res => res.data);
};

const apiGetLoginLogOutList = (params: any) => {
	return axios.get('/common/main/getLoginLogOutList', { params }).then(res => res.data);
};

const apiGetSearchUsersMyMenu = (params: any) => {
	return axios.get('/common/main/searchUsersMyMenu', { params }).then(res => res.data);
};

const apiPostInsertUsersMyMenu = (params: any) => {
	return axios.post('/common/main/insertUsersMyMenu', params).then(res => res.data);
};

const apiPostDeleteUsersMyMenu = (params: any) => {
	return axios.post('/common/main/deleteUsersMyMenu', params).then(res => res.data);
};

const apiGetLatestLogin = (params: any) => {
	return axios.get('/common/main/getLatestLogin', { params }).then(res => res.data);
};

/* 로그인 */
const apiPostAuthLogin = (params: any) => {
	return axios.post('/common/auth/login', params).then(res => res.data);
};

const apiPostSendVerificationCode = (params: any) => {
	return axios.post('/common/auth/sendVerificationCode', params).then(res => res.data);
};

const apiPostCheckVerificationCode = (params: any) => {
	return axios.post('/common/auth/checkVerificationCode', params).then(res => res.data);
};

const apiPostFindPwdSearch = (params: any) => {
	return axios.post('/common/auth/findPwdSearch', params).then(res => res.data);
};

const apiGetFindIdSearch = (params: any) => {
	return axios.post('/common/auth/findIdSearch', params).then(res => res.data);
};

const apiGetLogout = (params?: any) => {
	return axios.get('/common/auth/logout', { params }).then(res => res.data);
};

/* SSO 로그인 */
const apiPostSSOLogin = (params: any) => {
	return axios.post('/common/auth/sso', params).then(res => res.data);
};

export {
	apiGetCommonCdList,
	apiGetFindIdSearch,
	apiGetGrpCommCodeList,
	apiGetLatestLogin,
	apiGetLoginLogOutList,
	apiGetLogout,
	apiGetMenuList,
	apiGetSearchUsersMyMenu,
	apiGetUser,
	apiPostAuthLogin,
	apiPostCheckVerificationCode,
	apiPostDeleteUsersMyMenu,
	apiPostFindPwdSearch,
	apiPostInsertUsersMyMenu,
	apiPostSendVerificationCode,
	apiPostSSOLogin,
};
