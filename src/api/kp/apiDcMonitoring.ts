import axios from '@/api/Axios';

/**
 * Home > 신규 마스터 정보 조회
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetKpDcNewMasterList = (params: any) => {
	return axios.get('/api/kp/dc/v1.0/getNewMasterRead', { params }).then(res => res.data);
};

/**
 * Home > 신규 마스터 상세 정보 조회
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetKpDcNewMasterDetailList = (params: any) => {
	return axios.get('/api/kp/dc/v1.0/getNewMasterDetailRead', { params }).then(res => res.data);
};

export { apiGetKpDcNewMasterDetailList, apiGetKpDcNewMasterList };
