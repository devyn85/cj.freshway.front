/*
 ############################################################################
 # FiledataField	: apiTmDistanceBand.ts.
 # Description		: 센터구간설정
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.22
 ############################################################################
*/

import axios from '@/api/Axios';

/**
 * 센터구간설정 헤더 조회
 * @param params
 * @returns
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/tm/distanceBand/v1.0/getMasterList', params).then(res => res.data);
};

const getHjdDataSetList = (params: any) => {
	return axios.post('/api/tm/distanceBand/v1.0/getHjdDataSetList', params).then(res => res.data);
};

/**
 * 센터구간설정 저장
 * @param params
 * @returns
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('/api/tm/distanceBand/v1.0/saveConfirm', params).then(res => res.data);
};

/**
 * 센터구간설정 저장
 * @param params
 * @returns
 */
const apiGetExcelUpload = (params: any) => {
	return axios.post('/api/tm/distanceBand/v1.0/getExcelUpload', params).then(res => res.data);
};
/**
 * 센터구간설정 저장
 * @param params
 * @returns
 */
const apigetHjdDataList = (params: any) => {
	return axios.get('/api/tm/distanceBand/v1.0/getHjdDataList', { params }).then(res => res.data);
};
/**
 * 센터구간설정 저장
 * @param params
 * @returns
 */
const apiSaveList = (params: any) => {
	return axios.post('/api/tm/distanceBand/v1.0/saveConfirmTmentity', params).then(res => res.data);
};
export { apiGetExcelUpload, apigetHjdDataList, apiGetMasterList, apiSaveList, apiSaveMasterList, getHjdDataSetList };
