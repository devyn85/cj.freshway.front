/*
 ############################################################################
 # FiledataField	: apiTmInplanMessage.ts.tsx
 # Description		: 통합수당관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.05
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 통합수당관리 헤더 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	//console.log(params);
	return axios.post('/api/tm/entityRule/v1.0/getMasterList', params).then(res => res.data);
};

const apiGeSttlItemCdList = (params: any) => {
	//console.log(params);
	return axios.post('/api/tm/entityRule/v1.0/geSttlItemCdList', params).then(res => res.data);
};
/**
 * 통합수당관리 저장
 * @param params
 * @returns
 */
const apiSaveMasterList = (params: any) => {
	//console.log(params);
	return axios.post('/api/tm/entityRule/v1.0/saveConfirm', params).then(res => res.data);
};
/**
 * 통합수당관리 저장
 * @param params
 * @returns
 */
const apiSaveTmEntityExcel = (params: any) => {
	//console.log(params);
	return axios.post('/api/tm/entityRule/v1.0/saveExcel', params).then(res => res.data);
};
/**
 * 통합수당관리 저장
 * @param params
 * @returns
 */
const apiPostExcelUploadTmEntity = (params: any) => {
	//console.log(params);
	return axios.post('/api/tm/entityRule/v1.0/apiPostExcelUploadTmEntity', params).then(res => res.data);
};

const apiGetTrspCloseChk = (params: any) => {
	//console.log(params);
	return axios.post('/api/tm/entityRule/v1.0/apiTrspCloseChk', params).then(res => res.data);
};
export {
	apiGeSttlItemCdList,
	apiGetMasterList,
	apiGetTrspCloseChk,
	apiPostExcelUploadTmEntity,
	apiSaveMasterList,
	apiSaveTmEntityExcel,
};
