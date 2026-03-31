import axios from '@/api/Axios';

/**
 * Admin > 시스템정보 > 시스템운영자열람자료 목록 검색 조회
 * @param {any} params 검색 조건
 * @returns {object} 목록
 */
const apiGetCommuintyList = (params: any) => {
	return axios.get('/api/cb/community/v1.0/getCommunityList', { params }).then(res => res.data);
};

/**
 * Admin > 시스템정보 > 시스템운영자열람자료 상세 검색 조회
 * @param {any} params 상세 검색 조건
 * @returns {object} 상세 목록
 */
const apiGetCommuintyDetailList = (params: any) => {
	return axios.get('/api/cb/community/v1.0/getCommunityDetail', { params }).then(res => res.data);
};

/**
 * Admin > 시스템정보 > 시스템운영자열람자료 수정 및 등록
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostSaveCommuinty = (params: any) => {
	return axios.post('/api/cb/community/v1.0/saveCommunity', params).then(res => res);
};

export { apiGetCommuintyDetailList, apiGetCommuintyList, apiPostSaveCommuinty };
