import axios from '@/api/Axios';

/**
 * 공통 > 팝업 > 수급담당 변경이력 조회
 * @param {any} params 수급담당 변경이력 검색 조건
 * @returns {object} 수급담당 변경이력
 */

const apiGetPurchaseBuyerHstList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getPurchaseBuyerHstList', { params }).then(res => res.data);
};

export { apiGetPurchaseBuyerHstList };
