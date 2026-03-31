import axios from '@/api/Axios';

/**
 * 배차작업로그(차량) 목록조회
 * @param {any} params 검색 조건
 * @returns {object} 배차작업로그 목록
 */
const apiGetWorkLogByCarList = (params: any) => {
	return axios.post('/api/tm/carlog/v1.0/getWorkLogByCarList', params).then(res => res.data);
};

/**
 * 배차작업로그(차량) 상세 목록조회
 * @param {any} params 검색 조건
 * @returns {object} 배차작업로그 상세 목록
 */
const apiGetWorkLogByCarDetailList = (params: any) => {
	return axios.post('/api/tm/carlog/v1.0/getWorkLogByCarDetailList', params).then(res => res.data);
};

export { apiGetWorkLogByCarDetailList, apiGetWorkLogByCarList };
