/*
 ############################################################################
 # FiledataField	: apiKpDailyUnload.ts
 # Description		: 지표 > 생산성 > 데일리 생산성 하역 지표 관리 API
 # Author			: JiHoPark
 # Since			: 2026.01.19
 ############################################################################
*/
import axios from '@/api/Axios';

/**
 * 데일리 생산성 하역 지표 관리 - 투입인원 목록 조회
 * @param {any} params 투입인원 목록 검색 조건
 * @returns {object} 투입인원 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/kp/kpdailyunload/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 데일리 생산성 하역 지표 관리 - 물량/라벨/시간 목록 조회
 * @param {any} params 물량/라벨/시간 목록 검색 조건
 * @returns {object} 물량/라벨/시간 목록
 */
const apiGetMasterList2 = (params: any) => {
	return axios.post('/api/kp/kpdailyunload/v1.0/getMasterList2', params).then(res => res.data);
};

/**
 * 데일리 생산성 하역 지표 관리 - 센터업무관리 목록 조회
 * @param {any} params 센터업무관리 목록 검색 조건
 * @returns {object} 센터업무관리 목록
 */
const apiGetPopupMasterList = (params: any) => {
	return axios.post('/api/kp/kpdailyunload/v1.0/getPopupMasterList', params).then(res => res.data);
};

/**
 * 데일리 생산성 하역 지표 관리 - 센터업무관리(예외) 목록 조회
 * @param {any} params 센터업무관리(예외) 목록 검색 조건
 * @returns {object} 센터업무관리(예외) 목록
 */
const apiGetPopupMasterList2 = (params: any) => {
	return axios.post('/api/kp/kpdailyunload/v1.0/getPopupMasterList2', params).then(res => res.data);
};

/**
 * 데일리 생산성 하역 지표 관리 - 분류피킹 제외대상 고객목록 조회
 * @param {any} params 분류피킹 제외대상 고객 목록 검색 조건
 * @returns {object} 분류피킹 제외대상 고객 목록
 */
const apiGetPopupMasterList3 = (params: any) => {
	return axios.post('/api/kp/kpdailyunload/v1.0/getPopupMasterList3', params).then(res => res.data);
};

/**
 * 데일리 생산성 하역 지표 관리 - 투입인원 목록 저장
 * @param {any} params 저장데이터 목록
 * @returns {object} 저장 결과
 */
const apiSaveMasterList = (params: any) => {
	return axios.post('/api/kp/kpdailyunload/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 데일리 생산성 하역 지표 관리 - 센터업무관리 목록 저장
 * @param {any} params 센터업무관리 목록
 * @returns {object} 저장 결과
 */
const apiSavePopupMasterList = (params: any) => {
	return axios.post('/api/kp/kpdailyunload/v1.0/savePopupMasterList', params).then(res => res.data);
};

/**
 * 데일리 생산성 하역 지표 관리 - 센터업무관리(예외) 목록 저장
 * @param {any} params 센터업무관리(예외) 목록
 * @returns {object} 저장 결과
 */
const apiSavePopupMasterList2 = (params: any) => {
	return axios.post('/api/kp/kpdailyunload/v1.0/savePopupMasterList2', params).then(res => res.data);
};

/**
 * 데일리 생산성 하역 지표 관리 - 분류피킹 제외대상 고객 목록 저장
 * @param {any} params 분류피킹 제외대상 고객 목록
 * @returns {object} 저장 결과
 */
const apiSavePopupMasterList3 = (params: any) => {
	return axios.post('/api/kp/kpdailyunload/v1.0/savePopupMasterList3', params).then(res => res.data);
};

export {
	apiGetMasterList,
	apiGetMasterList2,
	apiGetPopupMasterList,
	apiGetPopupMasterList2,
	apiGetPopupMasterList3,
	apiSaveMasterList,
	apiSavePopupMasterList,
	apiSavePopupMasterList2,
	apiSavePopupMasterList3,
};
