import axios from '@/api/Axios';

/**
 * 이력피킹현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 이력피킹현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/wd/pickingListSN/v1.0/getMasterList', params).then(res => res.data);
};

export { apiGetMasterList };
