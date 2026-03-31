import axios from '@/api/Axios';

/**
 * 고객배송조건 수신이력 조회 팝업
 * @param {any} params 고객배송조건 수신이력 조회 팝업 파라미터
 * @returns {object} 고객배송조건 수신이력 조회 팝업 결과값
 */
const apiGetCustDlvInfoHis = (params: any) => {
	return axios.get('/api/ms/custdelivery/v1.0/getCustDlvInfoHis', { params }).then(res => res.data);
};

export { apiGetCustDlvInfoHis };
