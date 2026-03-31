import axios from '@/api/Axios';

/**
 * 조회 api 함수
 * @param params
 * @returns {object}  목록
 */
const apiGetMasterList = (params: any) => {
	return axios.post('/api/st/stockLotMonitoring/v1.0/getMasterList', params).then(res => res.data);
};

/**
 * 소비기한 조회 api 함수
 * @param params
 * @returns {object}  목록
 */
const apiGetDurationList = (params: any) => {
	return axios.post('/api/st/stockLotMonitoring/v1.0/getDurationList', params).then(res => res.data);
};

/**
 * 저장조건 조회 api 함수
 * @param params
 * @returns {object}  목록
 */
const apiGetStoragetypeList = (params: any) => {
	return axios.post('/api/st/stockLotMonitoring/v1.0/getStoragetypeList', params).then(res => res.data);
};

const apiPostLargeDataExcel = (params: any) => {
	return axios
		.post('/ltx/st/stockLotMonitoring/v1.0/saveLargeDataExcel', params, { responseType: 'blob' })
		.then(res => res);
};

export { apiGetDurationList, apiGetMasterList, apiGetStoragetypeList, apiPostLargeDataExcel };
