import axios from '@/api/Axios';

/**
 * 이력재고처리현황 조회
 * @param params
 * @returns
 */
const apiSearchDvPackingScarceStockList = (params: any) => {
	return axios.get('/api/dv/dvPackingScarceStock/v1.0/getDvPackingScarceStockList', { params }).then(res => res.data);
};

export { apiSearchDvPackingScarceStockList };
