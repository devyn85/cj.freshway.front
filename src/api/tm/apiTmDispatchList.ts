import axios from '@/api/Axios';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 *  배송 > 배차현황 > 배차목록 > 차량별
 * @param params
 * @returns {object}
 */
const apiGetCarMasterGridList = (params: any) => {
	return axios.post('/api/tm/dispatchListByCar/v1.0/getDispatchListByCar', params).then(res => res.data);
};

/**
 *  배송 > 배차현황 > 배차목록 > 거래처별
 * @param params
 * @returns {object}
 */
const apiGetCustomerMasterGridList = (params: any) => {
	return axios.post('/api/tm/dispatchListByCustomer/v1.0/getDispatchListByCustomer', params).then(res => res.data);
};

/**
 *  배송 > 배차현황 > 배차목록 > POP별
 * @param params
 */
const apiGetPopMasterGridList = (params: any) => {
	return axios.post('/api/tm/dispatchListByPop/v1.0/getDispatchListByPop', params).then(res => res.data);
};

/**
 *  배송 > 배차현황 > 배차목록 > 권역별
 * @param params
 */
const apiGetDistrictMasterGridList = (params: any) => {
	return axios.post('/api/tm/dispatchListByDistrict/v1.0/getDispatchListByDistrict', params).then(res => res.data);
};

/**
 *  배송 > 배차현황 > 배차목록 > 차량 변경내역
 * @param params
 */
const apiGetCarHistoryMasterGridList = (params: any) => {
	return axios.post('/api/tm/dispatchListByCarHistory/v1.0/getDispatchListByCarHistory', params).then(res => res.data);
};

export {
	apiGetCarHistoryMasterGridList,
	apiGetCarMasterGridList,
	apiGetCustomerMasterGridList,
	apiGetDistrictMasterGridList,
	apiGetPopMasterGridList
};

