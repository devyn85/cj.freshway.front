import axios from '@/api/Axios';

/**
 * 이력정보 상세정보 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetCustHistList = (params: any) => {
	return axios.get('/api/ms/custHist/v1.0/getCustHistList', { params }).then(res => res.data);
};

export { apiGetCustHistList };
