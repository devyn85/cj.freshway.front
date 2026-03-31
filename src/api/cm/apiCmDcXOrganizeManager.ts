import axios from '@/api/Axios';

/**
 * 물류센터별창고관리 마스터
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.get('/api/cm/dcXOrganize/v1.0/getMasterList', { params }).then(res => res.data);
};

/**
 *  물류센터별창고관리 마스터
 * @param {any} params 저장데이터
 * @returns {object} 목록
 */
const apiPostSaveMasterList = (params: any) => {
	return axios.post('/api/cm/dcXOrganize/v1.0/saveMasterList', params).then(res => res.data);
};

/**
 * 창고 정보 목록 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetOrganizeList = (params: any) => {
	return axios.get('/api/cm/dcXOrganize/v1.0/getOrganizeList', { params }).then(res => res.data);
};

export { apiGetMasterList, apiGetOrganizeList, apiPostSaveMasterList };
