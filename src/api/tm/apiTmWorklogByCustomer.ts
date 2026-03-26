import axios from '@/api/Axios';

/**
 * 배차작업로그(거래처별) 목록 조회
 * @param {any} params 검색 조건
 * @returns {object} 배차작업로그 목록
 */
const apiGetWorkLogByCustomerList = (params: any) => {
	return axios.post('/api/tm/custlog/v1.0/getWorkLogByCustomerList', params).then(res => res.data);
};

/**
 * 배차작업로그(거래처별) 상세 목록조회
 * @param {any} params 검색 조건
 * @returns {object} 배차작업로그 상세 목록
 */
const apiGetWorkLogByCustomerDetailList = (params: any) => {
	return axios.post('/api/tm/custlog/v1.0/getWorkLogByCustomerDetailList', params).then(res => res.data);
};

export { apiGetWorkLogByCustomerDetailList, apiGetWorkLogByCustomerList };
