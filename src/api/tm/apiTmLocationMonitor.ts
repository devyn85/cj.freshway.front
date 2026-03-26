/*
 ############################################################################
 # FiledataField	: apiTmLocationMonitor.ts
 # Description		: 지표모니터링 > 차량관제 > 자동발주 차량위치모니터링 조회 API
 # Author			: BS.kim
 # Since			: 2025.09.10
 ############################################################################
*/
import axios from '@/api/Axios';
import type {
	ActualRouteListResponse,
	CarTrackQryLogListRequest,
	CarTrackQryLogListResponse,
	CustomerLocationListResponse,
	CustomerLocationRequest,
	CustomerManagementListRequest,
	CustomerManagementListResponse,
	MonitoringSearchRequest,
	PlanRouteListResponse,
	PopupVehicleCustomerListRequest,
	PopupVehicleCustomerListResponse,
	PopupVehicleInfoRequest,
	PopupVehicleInfoResponse,
	RouteRequest,
	SpecificVehicleLocationRequest,
	SpecificVehicleLocationResponse,
	VehicleConditionCountListResponse,
	VehicleDetailMonitoringListResponse,
	VehicleDetailMonitoringRequest,
	VehicleGroupMonitoringListResponse,
	VehicleMonitoringListResponse,
	VehicleStatusCountListResponse,
	VehicleStatusCountRequest,
	VehicleStatusListRequest,
	VehicleStatusListResponse,
	WeatherInfoResponse,
} from '@/types/tm/locationMonitor';

/** 모니터링 타입: 배달(자동발주) / 수송 */
type MonitorType = 'delivery' | 'carrier';

/**
 * 수송 API suffix 반환
 * @param {MonitorType} type - 모니터링 타입
 * @returns {string} 수송일 경우 'ByCarrier', 아닐 경우 빈 문자열
 */
const getCarrierSuffix = (type?: MonitorType): string => (type === 'carrier' ? 'ByCarrier' : '');

/*********************************************************************************************************************/
/****************************************************** [ 합계 ] *****************************************************/
/*********************************************************************************************************************/

/**
 * 지표모니터링 > 차량관제 > 차량위치모니터링 전체 카운트 List(서머리 합계 영역-[항목별 '/' 기준 왼쪽 숫자])
 * @param {MonitoringSearchRequest} params - 검색 조건
 * @param {MonitorType} type - 모니터링 타입 (delivery: 배달, carrier: 수송)
 * @returns {Promise<VehicleConditionCountListResponse>} 차량 상태 카운트 목록
 */
const apiTmLocationMonitorPostGetVehicleConditionCountList = (
	params: MonitoringSearchRequest,
	type?: MonitorType,
): Promise<VehicleConditionCountListResponse> => {
	const suffix = getCarrierSuffix(type);
	return axios.post(`/api/tm/locationMonitor/v1.0/getVehicleConditionCountList${suffix}`, params).then(res => res.data);
};

/**
 * 지표모니터링 > 차량관제 > 차량위치모니터링 전체 카운트 List(서머리 합계 영역-[항목별 '/' 기준 오른쪽 숫자])
 * @param {VehicleStatusCountRequest} params - 검색 조건
 * @param {MonitorType} type - 모니터링 타입 (delivery: 배달, carrier: 수송)
 * @returns {Promise<VehicleStatusCountListResponse>} 차량 상태 합계 카운트 목록
 */
const apiTmLocationMonitorPostGetVehicleStatusCountList = (
	params: VehicleStatusCountRequest,
	type?: MonitorType,
): Promise<VehicleStatusCountListResponse> => {
	const suffix = getCarrierSuffix(type);
	return axios.post(`/api/tm/locationMonitor/v1.0/getVehicleStatusCountList${suffix}`, params).then(res => res.data);
};

/*********************************************************************************************************************/
/**************************************************** [ 목록-개수 ] ***************************************************/
/*********************************************************************************************************************/

/**
 * 지표모니터링 > 차량관제 > 차량위치모니터링 List-배송일자별 개수(depth-0[센터])
 * @param {MonitoringSearchRequest} params - 검색 조건
 * @param {MonitorType} type - 모니터링 타입 (delivery: 배달, carrier: 수송)
 * @returns {Promise<VehicleMonitoringListResponse>} 센터별 차량 개수 목록
 */
const apiTmLocationMonitorPostGetVehicleMonitoringList = (
	params: MonitoringSearchRequest,
	type?: MonitorType,
): Promise<VehicleMonitoringListResponse> => {
	const suffix = getCarrierSuffix(type);
	return axios.post(`/api/tm/locationMonitor/v1.0/getVehicleMonitoringList${suffix}`, params).then(res => res.data);
};

/**
 * 지표모니터링 > 차량관제 > 차량위치모니터링 List-배송일자별 개수(depth-1[센터-조별])
 * @param {MonitoringSearchRequest} params - 검색 조건
 * @param {MonitorType} type - 모니터링 타입 (delivery: 배달, carrier: 수송)
 * @returns {Promise<VehicleGroupMonitoringListResponse>} 센터-조별 차량 개수 목록
 */
const apiTmLocationMonitorPostGetVehicleGroupMonitoringList = (
	params: MonitoringSearchRequest,
	type?: MonitorType,
): Promise<VehicleGroupMonitoringListResponse> => {
	const suffix = getCarrierSuffix(type);
	return axios
		.post(`/api/tm/locationMonitor/v1.0/getVehicleGroupMonitoringList${suffix}`, params)
		.then(res => res.data);
};

/*********************************************************************************************************************/
/*************************************************** [ 목록-리스트 ] **************************************************/
/*********************************************************************************************************************/

/**
 * 지표모니터링 > 차량관제 > 차량위치모니터링 List-배송일자별 리스트(depth-2[센터-조별-차량별])
 * @param {VehicleDetailMonitoringRequest} params - 검색 조건
 * @param {MonitorType} type - 모니터링 타입 (delivery: 배달, carrier: 수송)
 * @returns {Promise<VehicleDetailMonitoringListResponse>} 차량 상세 목록
 */
const apiTmLocationMonitorPostGetVehicleDetailMonitoringList = (
	params: VehicleDetailMonitoringRequest,
	type?: MonitorType,
): Promise<VehicleDetailMonitoringListResponse> => {
	const suffix = getCarrierSuffix(type);
	return axios
		.post(`/api/tm/locationMonitor/v1.0/getVehicleDetailMonitoringList${suffix}`, params)
		.then(res => res.data);
};

/*********************************************************************************************************************/
/****************************************************** [ 팝업 ] *****************************************************/
/*********************************************************************************************************************/
// 운송관리 > 거래처 목록 팝업 거래처 목록 팝업 조회
/**
 * 지표모니터링 > 차량관제 > 차량위치모니터링 팝업 - 차량 상세 정보 조회[헤더]
 * @param {PopupVehicleInfoRequest} params - 검색 조건
 * @param {MonitorType} type - 모니터링 타입 (delivery: 배달, carrier: 수송)
 * @returns {Promise<PopupVehicleInfoResponse>} 차량 상세 정보
 */
const apiTmLocationMonitorPopupPostGetVehicleInfo = (
	params: PopupVehicleInfoRequest,
	type?: MonitorType,
): Promise<PopupVehicleInfoResponse> => {
	const suffix = getCarrierSuffix(type);
	return axios
		.post(`/api/tm/locationMonitorCustomerListByCarPopup/v1.0/getVehicleInfo${suffix}`, params)
		.then(res => res.data);
};

/**
 * 지표모니터링 > 차량관제 > 차량위치모니터링 팝업 - 차량별 거래처 목록 조회[목록]
 * @param {PopupVehicleCustomerListRequest} params - 검색 조건
 * @param {MonitorType} type - 모니터링 타입 (delivery: 배달, carrier: 수송)
 * @returns {Promise<PopupVehicleCustomerListResponse>} 거래처 목록
 */
const apiTmLocationMonitorPopupPostGetVehicleCustomerList = (
	params: PopupVehicleCustomerListRequest,
	type?: MonitorType,
): Promise<PopupVehicleCustomerListResponse> => {
	const suffix = getCarrierSuffix(type);
	return axios
		.post(`/api/tm/locationMonitorCustomerListByCarPopup/v1.0/getVehicleCustomerList${suffix}`, params)
		.then(res => res.data);
};
//

/**
 * 지표모니터링 > 차량관제 > 차량위치모니터링 팝업 - 실제 이동경로 조회[목록]
 * @param {RouteRequest} params - 경로 조회 조건
 * @param {MonitorType} type - 모니터링 타입 (delivery: 배달, carrier: 수송)
 * @returns {Promise<ActualRouteListResponse>} 실제 경로 목록
 */
const apiTmLocationMonitorPostGetActualRouteList = (
	params: RouteRequest,
	type?: MonitorType,
): Promise<ActualRouteListResponse> => {
	const suffix = getCarrierSuffix(type);
	return axios.post(`/api/tm/locationMonitorByCar/v1.0/getActualRouteList${suffix}`, params).then(res => res.data);
};

/**
 * 지표모니터링 > 차량관제 > 차량위치모니터링 - 실착지 위치 조회
 * @param {CustomerLocationRequest} params - 실착지 조회 조건
 * @param {MonitorType} type - 모니터링 타입 (delivery: 배달, carrier: 수송)
 * @returns {Promise<CustomerLocationListResponse>} 실착지 위치 목록
 */
const apiTmLocationMonitorPostGetCustomerLocationList = (
	params: CustomerLocationRequest,
	type?: MonitorType,
): Promise<CustomerLocationListResponse> => {
	const suffix = getCarrierSuffix(type);
	return axios.post(`/api/tm/locationMonitorByCar/v1.0/getCustomerLocationList${suffix}`, params).then(res => res.data);
};

/**
 * 지표모니터링 > 차량관제 > 자동발주 차량위치모니터링 - 계획 경로 조회
 * @param {RouteRequest} params - 경로 조회 조건
 * @returns {Promise<PlanRouteListResponse>} 계획 경로 목록
 */
const apiTmLocationMonitorPostGetPlanRouteList = (params: RouteRequest): Promise<PlanRouteListResponse> => {
	return axios.post('/api/tm/locationMonitorByCar/v1.0/getPlanRouteList', params).then(res => res.data);
};

/**
 * 지표모니터링 > 차량관제 > 차량위치모니터링 - 차량 마커 조회(차량번호)
 * @param {SpecificVehicleLocationRequest} params - 차량 조회 조건
 * @param {MonitorType} type - 모니터링 타입 (delivery: 배달, carrier: 수송)
 * @returns {Promise<SpecificVehicleLocationResponse>} 차량 위치 목록
 */
const apiTmLocationMonitorPostGetVehicleLocationList = (
	params: SpecificVehicleLocationRequest,
	type?: MonitorType,
): Promise<SpecificVehicleLocationResponse> => {
	const suffix = getCarrierSuffix(type);
	return axios.post(`/api/tm/locationMonitorByCar/v1.0/getVehicleLocationList${suffix}`, params).then(res => res.data);
};

/**
 * 지표모니터링 > 차량관제 > 차량위치모니터링 - 차량 마커 조회(검색조건)
 * @param {VehicleStatusListRequest} params - 검색 조건
 * @param {MonitorType} type - 모니터링 타입 (delivery: 배달, carrier: 수송)
 * @returns {Promise<VehicleStatusListResponse>} 차량 위치 목록
 */
const apiTmLocationMonitorPostGetVehicleStatusList = (
	params: VehicleStatusListRequest,
	type?: MonitorType,
): Promise<VehicleStatusListResponse> => {
	const suffix = getCarrierSuffix(type);
	return axios.post(`/api/tm/locationMonitorByCar/v1.0/getVehicleStatusList${suffix}`, params).then(res => res.data);
};

/**
 * 지표모니터링 > 차량관제 > 차량위치모니터링 - 관리처 목록 조회
 * @param {CustomerManagementListRequest} params - 검색 조건
 * @param {MonitorType} type - 모니터링 타입 (delivery: 배달, carrier: 수송)
 * @returns {Promise<CustomerManagementListResponse>} 관리처 목록
 */
const apiTmLocationMonitorPostGetCustomerManagementList = (
	params: CustomerManagementListRequest,
	type?: MonitorType,
): Promise<CustomerManagementListResponse> => {
	const suffix = getCarrierSuffix(type);
	return axios
		.post(`/api/tm/locationMonitorByCar/v1.0/getCustomerManagementList${suffix}`, params)
		.then(res => res.data);
};

/**
 * 차량 위치 조회 이력 목록 조회
 * @param {CarTrackQryLogListRequest} params - 검색 조건
 * @returns {Promise<CarTrackQryLogListResponse>} 차량 위치 조회 이력 목록
 */
const apiTmLocationMonitorPostGetCarTrackQryLogList = (
	params: CarTrackQryLogListRequest,
): Promise<CarTrackQryLogListResponse> => {
	return axios.post('/api/tm/locationMonitor/v1.0/getCarTrackQryLogList', params).then(res => res.data);
};

/**
 * @returns {Promise<WeatherInfoResponse>} 날씨 정보
 */
const apiTmLocationMonitorPostGetWeatherInfo = (): Promise<WeatherInfoResponse> => {
	return axios.post('/api/tm/locationMonitorByCar/v1.0/getWeatherInfoList', {}).then(res => res.data);
};

/*********************************************************************************************************************/
/****************************************************** [ 지도 ] *****************************************************/
/*********************************************************************************************************************/
// 운송관리 > 차량별 (예상, 실제) 이동 경로 및 거래처 마커 차량별 (예상, 실제) 이동 경로 및 거래처 마커 조회
// 실제 이동경로                        /api/tm/locationMonitorByCar/v1.0/getActualRouteList
// 실착지 위치 조회                     /api/tm/locationMonitorByCar/v1.0/getCustomerLocationList
// 관리처 목록 조회                     /api/tm/locationMonitorByCar/v1.0/getCustomerManagementList
// 계획 경로 조회                       /api/tm/locationMonitorByCar/v1.0/getPlanRouteList
// 차량 모니터링 차량 마커 조회(차량번호) /api/tm/locationMonitorByCar/v1.0/getVehicleLocationList
// 차량 모니터링 차량 마커 조회(검색조건) /api/tm/locationMonitorByCar/v1.0/getVehicleStatusList

export type { MonitorType };

export {
	apiTmLocationMonitorPopupPostGetVehicleCustomerList,
	apiTmLocationMonitorPopupPostGetVehicleInfo,
	apiTmLocationMonitorPostGetActualRouteList,
	apiTmLocationMonitorPostGetCarTrackQryLogList,
	apiTmLocationMonitorPostGetCustomerLocationList,
	apiTmLocationMonitorPostGetCustomerManagementList,
	apiTmLocationMonitorPostGetPlanRouteList,
	apiTmLocationMonitorPostGetVehicleConditionCountList,
	apiTmLocationMonitorPostGetVehicleDetailMonitoringList,
	apiTmLocationMonitorPostGetVehicleGroupMonitoringList,
	apiTmLocationMonitorPostGetVehicleLocationList,
	apiTmLocationMonitorPostGetVehicleMonitoringList,
	apiTmLocationMonitorPostGetVehicleStatusCountList,
	apiTmLocationMonitorPostGetVehicleStatusList,
	apiTmLocationMonitorPostGetWeatherInfo,
};
