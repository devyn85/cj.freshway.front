import axios from '@/api/Axios';

/**
 * 공통 > 팝업 > 상품 분류 목록 조회
 * @param {any} params 상품 분류 검색 조건
 * @returns {object} 상품 분류 목록
 */
const getSkuSpecList = (params: any) => {
	return axios.get('/api/cm/search/v1.0/getSkuSpecList', { params }).then(res => res.data);
};

export { getSkuSpecList };
