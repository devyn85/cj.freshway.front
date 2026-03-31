/*
 ############################################################################
 # FiledataField	: apiTmDeliveryStatus.ts
 # Description		: 모니터링 > 배송 > 배송현황 API
 # Author			: BS.kim
 # Since			: 2025.11.17
 ############################################################################
*/

import axios from '@/api/Axios';

/*********************************************************************************************************************/
/***************************************************** [ 경로별 ] ****************************************************/
/*********************************************************************************************************************/
// 조회
const apiTmDeliveryStatusByRouteList = (params: any) => {
	return axios.post('/api/tm/deliveryStatusByRoute/v1.0/getDeliveryStatusByRoute', params).then(res => res.data);
};

/*********************************************************************************************************************/
/**************************************************** [ 거래처별 ] ***************************************************/
/*********************************************************************************************************************/
// 조회
const apiTmDeliveryStatusByCustomerList = (params: any) => {
	return axios.post('/api/tm/deliveryStatusByCustomer/v1.0/getDeliveryStatusByCustomer', params).then(res => res.data);
};

// 저장
const apiTmDeliveryStatusByCustomerSave = (params: any) => {
	return axios.post('/api/tm/deliveryStatusByCustomer/v1.0/processArrival', params).then(res => res.data);
};

/*********************************************************************************************************************/
/***************************************************** [ 차량별 ] ****************************************************/
/*********************************************************************************************************************/
// 조회-당일
const apiTmDeliveryStatusByCarDayList = (params: any) => {
	return axios.post('/api/tm/deliveryStatusByVehicle/v1.0/getDeliveryStatusByVehicle', params).then(res => res.data);
};

// 조회-당월
const apiTmDeliveryStatusByCarMonthList = (params: any) => {
	return axios.post('/api/tm/deliveryStatusByVehicle/v1.0/getDeliveryStatusByVehicleMonth', params).then(res => res.data);
};

// 조회-상세
const apiTmDeliveryStatusByCarDetailList = (params: any) => {
	return axios.post('/api/tm/deliveryStatusByVehicle/v1.0/getDeliveryStatusByVehicleCar', params).then(res => res.data);
};

export { apiTmDeliveryStatusByCarDayList, apiTmDeliveryStatusByCarDetailList, apiTmDeliveryStatusByCarMonthList, apiTmDeliveryStatusByCustomerList, apiTmDeliveryStatusByCustomerSave, apiTmDeliveryStatusByRouteList };

