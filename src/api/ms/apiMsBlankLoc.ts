import axios from '@/api/Axios';

/**
 * 기둥/빈 공간 정보 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/ms/blankLoc/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 기둥/빈 공간 정보 목록 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/ms/blankLoc/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * ZONE 정보 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetZoneList = (params: any) => {
	return axios.get('/api/ms/blankLoc/v1.0/getDataZone', { params }).then(res => res.data);
};

export { apiGetMasterList, apiGetZoneList, apiPostSaveMasterList };
