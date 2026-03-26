import axios from '@/api/Axios';

/**
 * 일배입출차이현황 List
 * @param params
 * @returns
 */
const apiSearchDvDataviewMultiSpList = (params: any) => {
	return axios.post('/api/dv/dataviewMultiSp/v1.0/getDvDataviewMultiSpList', params).then(res => res.data);
};

/**
 * 상세 내역 List
 * @param params
 * @returns
 */
const apiSearchDvDataviewMultiSpDetailList = (params: any) => {
	return axios.post('/api/dv/dataviewMultiSp/v1.0/getDvDataviewMultiSpDetailList', params).then(res => res.data);
};

export { apiSearchDvDataviewMultiSpDetailList, apiSearchDvDataviewMultiSpList };
