import axios from '@/api/Axios';

/**
 * 거래처별전용차량정보 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} * 거래처별전용차량정보 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/ms/custUsageCar/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 거래처별전용차량정보 저장
 * @param {any} params * 거래처별전용차량정보 저장 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/custUsageCar/v1.0/saveMasterList', params).then(res => res);
};

/**
 * 엑셀업로드 유효성 체크
 * @param {any} params * 엑셀업로드 유효성 체크 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiGetValidateSaveList = (params: any) => {
	return axios.post('/api/ms/custUsageCar/v1.0/getValidateSaveList', params).then(res => res);
};

export { apiGetMasterList, apiGetValidateSaveList, apiPostSaveMasterList };
