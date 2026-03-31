/**
 * Swagger BackEnd API Document - 시스템관리 API
 * http://api.ictdev.cj.net/swagger-ui/index.html?configUrl=%2Fv3%2Fapi-docs%2Fswagger-config&urls.primaryName=%EC%8B%9C%EC%8A%A4%ED%85%9C%EA%B4%80%EB%A6%AC%20API
 */

import axios from '../Axios';

/**
 * 공통코드 다국어관리 API
 * @param {object} params Request Params
 * @returns {object} 응답 결과
 */
const apiGetCommonI18NGroupCode = (params: any) => {
	return axios.get('/sysmgt/func/commoncodeI18N/searchGroupCd', { params }).then(res => res.data);
};

const apiGetCommonI18NCommonCode = (params: any) => {
	return axios.get('/sysmgt/func/commoncodeI18N/searchCommonCd', { params }).then(res => res.data);
};

const apiPostSaveCommonI18NCommonCode = (params: any) => {
	return axios.post('/sysmgt/func/commoncodeI18N/save', params).then(res => res.data);
};

/**
 * 공통코드 관리 API
 * @param {object} params Request Params
 * @returns {object} 응답 결과
 */
const apiGetCmmCdSearchGrpCd = (params: any) => {
	return axios.get('/sysmgt/func/commoncode/searchGroupCd', { params }).then(res => res.data);
};

const apiGetCmmCdSearchCmmCd = (params: any) => {
	return axios.get('/sysmgt/func/commoncode/searchCommonCd', { params }).then(res => res.data);
};

const apiPostSaveCommonCode = (params: any) => {
	return axios.post('/sysmgt/func/commoncode/save', params).then(res => res.data);
};

/**
 * 메뉴관리 API
 * @param {object} params Request Params
 * @returns {object} 응답 결과
 */
const apiGetMenuList = (params: any) => {
	return axios.get('/sysmgt/func/menu/list', { params }).then(res => res);
};

const apiPostSaveMenu = (params: any) => {
	return axios.post('/sysmgt/func/menu/save', params).then(res => res);
};

/**
 * 권한 관리 API
 * @param {object} params Request Params
 * @returns {object} 응답 결과
 */
const apiGetRoleList = (params: any) => {
	return axios.get('/sysmgt/func/roles/list', { params }).then(res => res.data);
};

const apiPostSaveRole = (params: any) => {
	return axios.post('/sysmgt/func/roles/save', params).then(res => res.data);
};

/**
 * 사용자 관리 API
 * @param {object} params Request Params
 * @returns {object} 응답 결과
 */
const apiGetUserList = (params: any) => {
	return axios.post('/sysmgt/func/users/list', params).then(res => res.data);
};

const apiPostSaveUser = (params: any) => {
	return axios.post('/sysmgt/func/users/save', params).then(res => res.data);
};

/**
 * 권한별 메뉴 관리 API
 * @param {object} params Request Params
 * @returns {object} 응답 결과
 */
const apiGetRolesMappingMenuList = (params: any) => {
	return axios.get('/sysmgt/func/rolesmappingmenu/list', { params }).then(res => res.data);
};

const apiPostCopyRole = (params: any) => {
	return axios.post('/sysmgt/func/rolesmappingmenu/copy', params).then(res => res.data);
};

const apiPostSaveRolesMappingMenu = (params: any) => {
	return axios.post('/sysmgt/func/rolesmappingmenu/save', params).then(res => res.data);
};

/**
 * 권한별 사용자 관리 API
 * @param {object} params Request Params
 * @returns {object} 응답 결과
 */
const apiGetRoleMappingUser = (params: any) => {
	return axios.get('/sysmgt/func/rolesmappingusers/list', { params }).then(res => res.data);
};

const apiGetUserRoleList = (params: any) => {
	return axios.post('/sysmgt/func/rolesmappingusers/userList', params).then(res => res.data);
};

const apiGetUserRoleMapping = (params: any) => {
	return axios.post('/sysmgt/func/roles/userRoleList', params).then(res => res.data);
};

const apiPostSaveRoleAndUser = (params: any) => {
	return axios.post('/sysmgt/func/rolesmappingusers/save', params).then(res => res.data);
};

/**
 * IP 허용 예외 관리
 * @param {object} params Request Params
 * @returns {object} 응답 결과
 */
const apiGetIpAllowList = (params: any) => {
	return axios.get('/sysmgt/func/ipallow/list', { params }).then(res => res.data);
};

const apiPostIpAllowSave = (params: any) => {
	return axios.post('/sysmgt/func/ipallow/save', params).then(res => res.data);
};

/**
 * 다국어 메뉴 관리
 * @param {object} params Request Params
 * @returns {object} 응답 결과
 */
const apiGetmenuI18nList = (params: any) => {
	return axios.get('/sysmgt/func/menuI18N/list', { params }).then(res => res.data);
};

const apiPostmenuI18nSave = (params: any) => {
	return axios.post('/sysmgt/func/menuI18N/save', params).then(res => res.data);
};

/**
 * 배치 수행 이력
 * @param {object} params Request Params
 * @returns {object} 응답 결과
 */
const apiGetJobList = (params: any) => {
	return axios.get('/sysmgt/func/batch/search', { params }).then(res => res.data);
};

const apiGetStepList = (params: any) => {
	return axios.get('/sysmgt/func/batch/searchStep', { params }).then(res => res.data);
};

const apiGetStepMsg = (params: any) => {
	return axios.get('/sysmgt/func/batch/searchStepMSG', { params }).then(res => res.data);
};

/**
 * 시스템 예외 이력 목록
 * @param {*} params fromDt, thruDt 조회 날짜
 * @returns {object} 데이터 리스트
 */
const apiGetExcLogSearch = (params: any) => {
	return axios.get('/sysmgt/func/exc/excLog/search', { params }).then(res => res.data);
};

export {
	apiGetCmmCdSearchCmmCd,
	apiGetCmmCdSearchGrpCd,
	apiGetCommonI18NCommonCode,
	apiGetCommonI18NGroupCode,
	apiGetExcLogSearch,
	apiGetIpAllowList,
	apiGetJobList,
	apiGetMenuList,
	apiGetRoleList,
	apiGetRoleMappingUser,
	apiGetRolesMappingMenuList,
	apiGetStepList,
	apiGetStepMsg,
	apiGetUserList,
	apiGetUserRoleList,
	apiGetUserRoleMapping,
	apiGetmenuI18nList,
	apiPostCopyRole,
	apiPostIpAllowSave,
	apiPostSaveCommonCode,
	apiPostSaveCommonI18NCommonCode,
	apiPostSaveMenu,
	apiPostSaveRole,
	apiPostSaveRoleAndUser,
	apiPostSaveRolesMappingMenu,
	apiPostSaveUser,
	apiPostmenuI18nSave,
};
