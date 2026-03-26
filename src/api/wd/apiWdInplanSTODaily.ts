import axios from '@/api/Axios';

/**
 * 광역일배검수현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 광역일배검수현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/ltx/wd/inplanSTODaily/v1.0/getMasterList', params).then(res => res.data);
};

export { apiGetMasterList };
