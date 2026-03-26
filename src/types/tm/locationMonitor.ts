/*
 ############################################################################
 # FiledataField	: locationMonitor.ts
 # Description		: 차량위치모니터링 타입 정의
 # Author			: AI Assistant
 # Since			: 2025.01.13
 ############################################################################
*/

/**
 * 공통 API 응답 타입
 */
export interface ApiResponse<T> {
	data: T;
	statusCode: number;
	statusMessage: string;
}

/**
 * 차량 상태 목록 조회 요청 파라미터
 * apiTmLocationMonitorPostGetVehicleStatusList
 */
export interface VehicleStatusListRequest {
	cargroup?: string;
	carno?: string;
	contracttype?: string[];
	dccode: string;
	deliverydt: string;
	tmDeliverytype?: string;
}

/**
 * 차량 위치 조회 요청 파라미터
 * apiTmLocationMonitorPostGetVehicleLocationList
 */
export interface VehicleLocationRequest {
	carnoList: string[];
	dccode: string;
	deliverydt: string;
}

/**
 * 차량 위치 조회 응답 데이터 (단일 차량)
 */
export interface VehicleLocationItem {
	carno: string;
	latitude: number;
	longitude: number;
	dccode: string;
	deliveryStatus: string;
	deliverydt: string;
	latestPriority: string;
}

/**
 * 차량 위치 조회 응답 타입
 * apiTmLocationMonitorPostGetVehicleStatusList
 */
export type VehicleStatusListResponse = ApiResponse<VehicleLocationItem[]>;

/**
 * 특정 차량 위치 조회 요청 파라미터
 * apiTmLocationMonitorPostGetVehicleLocationList
 */
export interface SpecificVehicleLocationRequest {
	cargroup: string;
	carnoList: string[];
	contracttype: string[];
	dccode: string;
	deliverydt: string;
	tmDeliverytype: string;
}

/**
 * 특정 차량 위치 조회 응답 타입
 * apiTmLocationMonitorPostGetVehicleLocationList
 */
export type SpecificVehicleLocationResponse = ApiResponse<VehicleLocationItem[]>;

/**
 * 경로 조회 요청 파라미터 (실제 경로, 계획 경로 공통)
 * apiTmLocationMonitorPostGetActualRouteList
 * apiTmLocationMonitorPostGetPlanRouteList
 */
export interface RouteRequest {
	carno: string;
	dccode: string;
	deliverydt: string;
	priority: string;
	tmDeliverytype: string;
}

/**
 * 실제 경로 조회 응답 데이터 (단일 경로)
 */
export interface ActualRouteItem {
	carno: string;
	endTime: string;
	geojsonLinestring: string;
	pointCount: number;
	startTime: string;
	tripDate: string;
	custtype: string;
}

/**
 * 실제 경로 조회 응답 타입
 * apiTmLocationMonitorPostGetActualRouteList
 */
export type ActualRouteListResponse = ApiResponse<ActualRouteItem[]>;

/**
 * 계획 경로 조회 응답 데이터 (단일 경로)
 */
export interface PlanRouteItem {
	carno: string;
	deliverydt: string;
	priority: string;
	routePolyline: string;
	custtype: string;
}

/**
 * 계획 경로 조회 응답 타입
 * apiTmLocationMonitorPostGetPlanRouteList
 */
export type PlanRouteListResponse = ApiResponse<PlanRouteItem[]>;

/**
 * 실착지 위치 조회 요청 파라미터
 * apiTmLocationMonitorPostGetCustomerLocationList
 */
export interface CustomerLocationRequest {
	carno: string;
	dccode: string;
	deliverydt: string;
	priority: string;
	tmDeliverytype: string;
}

/**
 * 실착지 위치 조회 응답 데이터 (단일 실착지)
 */
export interface CustomerLocationItem {
	latitude: string;
	longitude: string;
	otherCustYn: string;
	priority: string;
	sortSeq: number;
	truthcustkey: string;
}

/**
 * 실착지 위치 조회 응답 타입
 * apiTmLocationMonitorPostGetCustomerLocationList
 */
export type CustomerLocationListResponse = ApiResponse<CustomerLocationItem[]>;

/**
 * 공통 검색 조건 (목록 조회용)
 */
export interface MonitoringSearchRequest {
	carnoList: string[];
	contracttype?: string[];
	dccode: string;
	deliverydt: string;
	tmDeliverytype?: string;
}

/**
 * 차량 상태 카운트 응답 데이터 (단일 항목)
 */
export interface VehicleConditionCountItem {
	cnt: number;
	deliveryStatus: string;
	deliveryStatusName: string;
}

/**
 * 차량 상태 카운트 조회 응답 타입
 * apiTmLocationMonitorPostGetVehicleConditionCountList
 */
export type VehicleConditionCountListResponse = ApiResponse<VehicleConditionCountItem[]>;

/**
 * 차량 상태 합계 카운트 요청 파라미터
 * apiTmLocationMonitorPostGetVehicleStatusCountList
 */
export interface VehicleStatusCountRequest {
	dccode: string;
	deliverydt: string;
}

/**
 * 차량 상태 합계 카운트 조회 응답 타입
 * apiTmLocationMonitorPostGetVehicleStatusCountList
 */
export type VehicleStatusCountListResponse = ApiResponse<VehicleConditionCountItem[]>;

/**
 * 센터별 차량 모니터링 응답 데이터 (단일 항목)
 */
export interface VehicleMonitoringItem {
	cnt: number;
	dccode: string;
	dcname: string;
}

/**
 * 센터별 차량 모니터링 조회 응답 타입
 * apiTmLocationMonitorPostGetVehicleMonitoringList
 */
export type VehicleMonitoringListResponse = ApiResponse<VehicleMonitoringItem[]>;

/**
 * 센터-조별 차량 모니터링 응답 데이터 (단일 항목)
 */
export interface VehicleGroupMonitoringItem {
	cargroup: string;
	cargroupName: string;
	cnt: number;
	dccode: string;
}

/**
 * 센터-조별 차량 모니터링 조회 응답 타입
 * apiTmLocationMonitorPostGetVehicleGroupMonitoringList
 */
export type VehicleGroupMonitoringListResponse = ApiResponse<VehicleGroupMonitoringItem[]>;

/**
 * 차량 상세 모니터링 요청 타입
 */
export interface VehicleDetailMonitoringRequest {
	cargroup: string;
	carnoList: string[];
	contracttype?: string[];
	dccode: string;
	deliverydt: string;
	tmDeliverytype?: string;
}

/**
 * 차량 상세 모니터링 응답 데이터 (단일 항목)
 */
export interface VehicleDetailMonitoringItem {
	appDisconnectedYn: string;
	cargroup: string;
	carno: string;
	contractname: string;
	contracttype: string;
	dccode: string;
	deliveryStatus: string;
	driver1: string;
	drivername: string;
}

/**
 * 차량 상세 모니터링 조회 응답 타입
 * apiTmLocationMonitorPostGetVehicleDetailMonitoringList
 */
export type VehicleDetailMonitoringListResponse = ApiResponse<VehicleDetailMonitoringItem[]>;

/**
 * 팝업 차량 정보 요청 타입
 */
export interface PopupVehicleInfoRequest {
	carno: string;
	dccode: string;
	deliverydt: string;
	prepriority: string;
	tmDeliverytype: string;
}

/**
 * 팝업 차량 정보 응답 데이터
 */
export interface PopupVehicleInfo {
	carcapacity: string;
	carcapacityName: string;
	cargroup: string;
	cargroupName: string;
	carno: string;
	contracttype: string;
	contracttypeName: string;
	drivername: string;
	maxPrepriority: string;
	phone1: string;
	prepriority: string;
}

/**
 * 팝업 차량 정보 조회 응답 타입
 * apiTmLocationMonitorPopupPostGetVehicleInfo
 */
export type PopupVehicleInfoResponse = ApiResponse<PopupVehicleInfo>;

/**
 * 팝업 거래처 목록 요청 타입
 */
export interface PopupVehicleCustomerListRequest {
	carno: string;
	dccode: string;
	deliverydt: string;
	prepriority: string;
	tmDeliverytype: string;
}

/**
 * 팝업 거래처 목록 응답 데이터 (단일 항목)
 */
export interface PopupVehicleCustomerItem {
	actualArrivalTime: string;
	claimYn: string;
	custAddress: string;
	custKey: string;
	custName: string;
	defCarno: string;
	defDistrictCode: string;
	expectedArrivalTime: string;
	faceInspect: string;
	keyCustType: string;
	reqdlvtime1From: string;
	reqdlvtime1To: string;
	returnYn: string;
	seqNo: string;
	specialConditionYn: string;
}

/**
 * 팝업 거래처 목록 조회 응답 타입
 * apiTmLocationMonitorPopupPostgetVehicleCustomerList
 */
export type PopupVehicleCustomerListResponse = ApiResponse<PopupVehicleCustomerItem[]>;

/**
 * 차량 위치 모니터링 검색 폼 타입
 */
export interface LocationMonitorSearchForm {
	/** 배송일자 (YYYYMMDD) */
	deliverydt: string;
	/** 센터 코드 */
	dccode: string;
	/** 계약유형 ('FIX', 'FIXTEMPORARY', 'TEMPORARY') */
	contracttype: string[] | null;
	/** 배송유형 (1: 배송, 2: 조달, 3: 수송, 4: 직송, 5: 픽업, 7: 수송(직송)) */
	tmDeliverytype: string | null;
	/** 실제로 검색에 포함은 안하지만 공통컴포넌트를 위한 코드 */
	carno?: string | null;
	/** 키워드 검색 (차량번호, 기사) */
	carnoList: string[] | null;
	/** 조회 타입 (ALL, REAL, PLAN) */
	type: string;
	/** 배송상태 (00: 전체, 10: 출차전, 20: 배송중, 30: 배송완료) */
	deliveryStatus: string;
}

/**
 * 공통 코드 아이템 타입
 */
export interface CommonCodeItem {
	comCd: string;
	cdNm: string;
	storerkey?: string;
	convdescr?: string;
}

/**
 * 체크박스/셀렉트 옵션 타입
 */
export interface FormOptionItem {
	label: string;
	value: string;
}

/**
 * 차량 상세 배송 상태 아이템
 */
export interface VehicleShippingStatusItem {
	appDisconnectedYn: string;
	cargroup: string;
	carno: string;
	contractname: string;
	contracttype: string;
	dccode: string;
	deliveryStatus: string;
	driver1: string;
	drivername: string;
}

/**
 * 차량 그룹 목록 아이템
 */
export interface VehicleGroupListItem {
	groupNo: string;
	carCount: number;
	shippingStatusList: VehicleShippingStatusItem[];
}

/**
 * 차량 센터별 목록 아이템
 */
export interface VehicleCenterListItem {
	centerNm: string;
	carCount: number;
	dccode: string;
	list: VehicleGroupListItem[];
}

/**
 * 써머리 데이터 아이템
 */
export interface SummaryDataItem {
	cnt: number;
	deliveryStatus: string;
	deliveryStatusName: string;
	subCnt: number;
}

/**
 * 거래처 관리 목록 아이템
 */
export interface CustomerManagementItem {
	address: string;
	custName: string;
	custKey: string;
	keytype2: string;
	otdYn: string;
	faceinspect: string;
	specialConditionYn: string;
	truthcustKey: string;
}

/**
 * 거래처 관리 목록 요청 타입
 */
export interface CustomerManagementListRequest {
	carno: string;
	deliverydt: string;
	priority: string;
	truthhcustkey: string;
}

/**
 * 거래처 관리 목록 응답 데이터
 */
export type CustomerManagementListResponse = ApiResponse<CustomerManagementItem[]>;

/**
 * 차량 위치 조회 이력 요청 타입
 */
export interface CarTrackQryLogListRequest {
	carnoList?: string[];
	dccode?: string;
	fromDate?: string;
	toDate?: string;
	username?: string;
}

/**
 * 차량 위치 조회 이력 응답 아이템 타입
 */
export interface CarTrackQryLogItem {
	carno: string;
	dccode: string;
	dcname: string;
	deliverydt: string;
	device: string;
	ipAddress: string;
	logTimestamp: string;
	userId: string;
	username: string;
}
/**
 * 차량 위치 조회 이력 응답 타입
 */
export type CarTrackQryLogListResponse = ApiResponse<CarTrackQryLogItem[]>;

export interface WeatherInfoItem {
	baseDate: string;
	baseTime: string;
	fcstDate: string;
	timezone: string;
	nx: string;
	ny: string;
	hjdongCd: string;
	sky: string;
	sno: string;
	pcp: string;
	pty: string;
	lonS100: string;
	latS100: string;
	ctpKorNm: string;
	sigKorNm: string | null;
	hjdongNm: string | null;
}

export interface GroupedWeatherInfo {
	ctpKorNm: string;
	sigKorNm: string | null;
	hjdongCd: string;
	lonS100: string;
	latS100: string;
	weatherInfo: WeatherInfoItem[];
}

export type WeatherInfoResponse = ApiResponse<WeatherInfoItem[]>;
