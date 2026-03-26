import axios from '@/api/Axios';

/**
 * 출고진행현황 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 출고진행현황 목록
 */
const apiGetMasterList = (params: any) => {
	return axios.get('/api/sys/executeLog/v1.0/getLogHeaderList', { params }).then(res => res.data);
};

export { apiGetMasterList };
