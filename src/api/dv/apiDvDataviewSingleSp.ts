import axios from '@/api/Axios';

/**
 * 이력재고처리현황 조회
 * @param params
 * @returns
 */
const apiSearchDvDataviewSingleSpList = (params: any) => {
	return axios.get('/api/dv/dvDataviewSingleSp/v1.0/getDvDataviewSingleSpList', { params }).then(res => res.data);
};

export { apiSearchDvDataviewSingleSpList };
