import axios from '@/api/Axios';

/**
 * 수발주정보 조회
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiGetPurchaseCust = (params: any) => {
	return axios.get('api/ms/purchaseCust/v1.0/getPurchaseCust', { params }).then(res => res.data);
};

/**
 * 수발주정보 저장
 * @param {any} params 요청 파라미터
 * @returns {object} 응답값
 */
const apiPostSavePurchaseCust = (params: any) => {
	return axios.post('api/ms/purchaseCust/v1.0/savePurchaseCust', params).then(res => res.data);
};

export { apiGetPurchaseCust, apiPostSavePurchaseCust };
