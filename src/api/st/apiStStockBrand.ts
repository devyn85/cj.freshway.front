import axios from '@/api/Axios';

/**
 * 조회 api 함수
 * @param params
 * @returns {object}  목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/st/stockBrand/v1.0/getMasterList', params).then(res => res.data);
};

export { apiGetMasterList };
