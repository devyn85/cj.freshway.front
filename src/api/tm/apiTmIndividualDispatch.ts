import axios from '@/api/Axios';

/**
 *  배송 > 배차현황 > 개별배차 > 목록 조회
 * @param params
 * @returns {object}
 */
const apiGetIndividualDispatchList = (params: any) => {
	return axios.post('/api/tm/individualDispatch/v1.0/getIndividualDispatchList', params).then(res => res.data);
};

/**
 *  배송 > 배차현황 > 개별배차 > 배차확정
 * @param params
 * @returns {object}
 */
const apiConfirmIndividualDispatch = (params: any) => {
	return axios.post('/api/tm/individualDispatch/v1.0/updateConfirmDispatch', params).then(res => res.data);
};

/**
 *  배송 > 배차현황 > 개별배차 > 팝업 목록 조회
 * @param params
 * @returns {object}
 */
const apiGetIndividualDispatchPopList = (params: any) => {
	return axios.get('/api/tm/individualDispatch/v1.0/getIndividualDispatchPopList', { params }).then(res => res.data);
};

export { apiConfirmIndividualDispatch, apiGetIndividualDispatchList, apiGetIndividualDispatchPopList };
