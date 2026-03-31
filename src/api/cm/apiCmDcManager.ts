import axios from '@/api/Axios';

/**
 * 센터관리 마스터
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.get('/api/cm/dc/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 *  센터관리 마스터
 * @param {any} params 검색 조건
 * @returns {object} 상세
 */
const apiGetMaster = (params: any) => {
	return axios.get('/api/cm/dc/v1.0/getDetail', { params }).then(res => res.data);
};

/**
 *  센터관리 마스터
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiPostSaveMaster = (params: any) => {
	return axios.post('/api/cm/dc/v1.0/saveMasterList', params).then(res => res.data);
};

export { apiGetMaster, apiGetMasterList, apiPostSaveMaster };
