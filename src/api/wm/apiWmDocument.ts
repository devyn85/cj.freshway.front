import axios from '@/api/Axios';
import dayjs from 'dayjs';
import instance from '../Axios';

/*
############################################################################
# API: WM Document API (주문 목록 관련)
# 목적: TmOrderList 화면에서 사용하는 주문 목록 조회 및 좌표 업데이트 API
# 
# [주요 기능]
# - getOrderList: WM API를 통한 주문 목록 조회
# - updateBulkCustDlvInfoPoint: 좌표 대량 업데이트 (자동배차 전 실행)
# - updateCustDlvInfoPoint: 좌표 단건 업데이트 (좌표 수정 모달에서 사용)
# 
# [사용처]
# - TmOrderList.tsx: 주문 목록 조회, 자동배차 시 좌표 대량 업데이트
# - CmMapPopup: 좌표 수정 시 단건 업데이트
# 
# [API 엔드포인트]
# - /api/tm/orderList/v1.0/getOrderList: 주문 목록 조회
# - /api/tm/orderList/v1.0/updateBulkCustDlvInfoPoint: 좌표 대량 업데이트
# - /api/tm/orderList/v1.0/updateCustDlvInfoPoint: 좌표 단건 업데이트
############################################################################
*/

// ----------------------------------------------------------------------------
// TM 주문 목록 조회 DTO (Swagger 기반)
// 사용처: getOrderList API 응답 데이터 타입 정의
// 저장 이유: API 응답 구조를 명확히 하여 타입 안전성 확보
// ----------------------------------------------------------------------------
export type TmOrderListResDto = {
	storerkey?: string;
	dccode?: string;
	dcname?: string;
	deliverydate?: string; // YYYYMMDD
	tmDeliverytype?: string; // WD | WOD | WWD | WSD
	ordertypeNm?: string;
	dlvgroupId?: string;
	dlvgroupNm?: string;
	dlvdistrictId?: string;
	dlvdistrictNm?: string;
	popno?: string;
	carno?: string;
	hjdongCd?: string;
	claimYn?: string; // Y | N
	toCusttype?: string;
	toCustkey?: string;
	toCustname?: string;
	toCustAddress?: string;
	toTruthcustkey?: string;
	toTruthcustname?: string;
	toTruthcustAddress?: string;
	coordinateYn?: string;
	orderQty?: string;
	orderWeight?: string;
	orderCube?: string;
	dcLatitude?: string;
	dcLongitude?: string;
};

export type ApiResultTmOrderListResDto = {
	data: TmOrderListResDto[];
};

/* ############################################################################
 * WM 주문 목록 조회 API
 * 사용처: TmOrderList.tsx에서 검색 조건에 맞는 주문 목록 조회
 * API: /api/tm/orderList/v1.0/getOrderList
 * 저장 이유: 배송일자, 배송유형, 거래처명, DC코드로 주문 목록 필터링 조회
 * 
 * [파라미터]
 * - deliveryDate: 배송일자 (YYYYMMDD 형식)
 * - deliveryType: 배송유형 (WD=배송, WOD=배송제외, WWD=배송대기, WSD=배송시작)
 * - custCode: 거래처 코드 (선택)
 * - gDccode: 물류센터 코드 (선택)
 * 
 * [응답]
 * - data: TmOrderListResDto[] 배열
 * - 각 주문의 상세 정보 (관리처, 실착지, 좌표, 물량 등)
############################################################################ */

export type WmOrderListSearchParams = {
	deliveryDate: any; // dayjs | string
	deliveryType?: string; // 'WD' | 'WOD' | 'WWD' | 'WSD'
	custName?: string; // 거래처명 검색어 (선택)
	gDccode?: string; // 물류센터 코드 (선택)
};

// WM 주문 목록 조회 함수
export const getOrderList = async (params: WmOrderListSearchParams): Promise<ApiResultTmOrderListResDto> => {
	const url = '/ltx/tm/orderList/v1.0/getOrderList';

	// 배송일자 형식 변환 (dayjs 객체 또는 문자열 -> YYYYMMDD)
	const rawDate = params.deliveryDate;
	const d = typeof rawDate === 'string' ? rawDate : dayjs(rawDate).format('YYYYMMDD');
	const deliveryDate = d && d.length === 8 ? d : dayjs(rawDate).format('YYYYMMDD');

	// API 요청 파라미터 구성
	const query = {
		deliveryDate, // 배송일자 (YYYYMMDD)
		deliveryType: params.deliveryType || undefined, // 배송유형 (WD, WOD, WWD, WSD)
		custCode: params.custName || undefined, // 거래처 코드
		gDccode: params.gDccode || undefined, // 물류센터 코드
	} as const;

	// 다국어 지원을 위한 언어 설정
	const language = localStorage.getItem('language') || 'ko-kr';

	// API 요청 실행
	const res = await instance.get<ApiResultTmOrderListResDto>(url, {
		params: query,
		headers: { 'Accept-Language': language },
	});
	return res?.data;
};

/* ############################################################################
 * 거래처 좌표 단건 업데이트 API
 * 사용처: CmMapPopup에서 좌표 수정 시 호출
 * API: /api/tm/orderList/v1.0/updateCustDlvInfoPoint
 * 저장 이유: 개별 주문의 배송지 좌표를 수정하여 배차 시 정확한 경로 계산 가능
 * 
 * [파라미터]
 * - storerkey: 스토어 키
 * - custType: 고객 유형
 * - dlvcustkey: 배송 고객 키
 * - longitude: 경도
 * - latitude: 위도
############################################################################ */

// ----------------------------------------------------------------------------
// 거래처 좌표 단건 업데이트 API (Swagger: /api/tm/orderList/v1.0/updateCustDlvInfoPoint)
// ----------------------------------------------------------------------------
export type TmCustDlvInfoPointReqDto = {
	storerkey: string; // 고객사 코드
	custType: string; // 거래처유형
	dlvcustkey: string; // 배송처 코드
	longitude: string; // 경도
	latitude: string; // 위도
};

export type ApiResultString = {
	data: string;
	statusCode?: string | number;
	statusMessage?: string;
};

// 거래처 좌표 단건 업데이트 함수
export const updateCustDlvInfoPoint = async (payload: TmCustDlvInfoPointReqDto): Promise<ApiResultString> => {
	const url = '/api/tm/orderList/v1.0/updateCustDlvInfoPoint';

	// 다국어 지원을 위한 언어 설정
	const language = localStorage.getItem('language') || 'ko-kr';

	// API 요청 실행 (POST)
	const res = await instance.post<ApiResultString>(url, payload, {
		headers: { 'Accept-Language': language },
	});
	return res?.data;
};

// ----------------------------------------------------------------------------
// 좌표 대량 업데이트 API (Swagger: /api/tm/orderList/v1.0/updateBulkCustDlvInfoPoint)
// ----------------------------------------------------------------------------
export type TmOrderListReqDto = {
	deliveryDate: string; // YYYYMMDD
	deliveryType?: string; // WD | WOD | WWD | WSD
	gDccode?: string; // 센터코드
};

// 좌표 대량 업데이트 함수 (자동배차 전 실행)
export const updateBulkCustDlvInfoPoint = async (payload: TmOrderListReqDto): Promise<ApiResultString> => {
	const url = '/api/tm/orderList/v1.0/updateBulkCustDlvInfoPoint';

	// 다국어 지원을 위한 언어 설정
	const language = localStorage.getItem('language') || 'ko-kr';

	// API 요청 실행 (POST)
	const res = await instance.post<ApiResultString>(url, payload, {
		headers: { 'Accept-Language': language },
	});
	return res?.data;
};

/*****************************************************************************************/

/**
 *  배송 > 배차작업 > 주문목록 > 차량설정
 * @param params
 */
export const apiGetPlanCarGridList = (params: any) => {
	return axios.post('/api/tm/dispatch/v1.0/getPlanCar', params).then(res => res.data);
};

export const apiPostSavePlanCarGridList = (params: any) => {
	return axios.post('/api/tm/dispatch/v1.0/savePlanCar', params).then(res => res.data);
};

/*****************************************************************************************/

/**
 *  배송 > 배차작업 > 주문목록 > 클레임 목록
 * @param params
 */
export const apiGetClaimListGridList = (params: any) => {
	return axios.post('/api/tm/orderList/v1.0/getClaimList', params).then(res => res.data);
};

/*****************************************************************************************/
/**
 * 엑셀 다운로드 API
 * 엑셀 다운로드 결과 값은 res만 return
 * @param {object} params 엑셀 조회 param
 * @returns {object} 엑셀 파일
 */
export const apiPostOrderManualExcelDownload = (params: any) => {
	return axios.post('/ltx/tm/dispatch/manual/download/excel', params, { responseType: 'blob' }).then(res => res);
};

/*****************************************************************************************/
/**
 * 엑셀 업로드 API
 * 엑셀 업로드 결과 값은 res만 return
 * @param {object} params 엑셀 조회 param
 * @returns {object} 엑셀 파일
 */
export const apiPostOrderManualExcelUpload = (params: any) => {
	return axios
		.post('/api/tm/dispatch/manual/upload', params, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then(res => res.data);
};

/*****************************************************************************************/
/**
 * 수동배차 업로드 테스트 API (유효성 검사)
 * 엑셀 업로드 후 유효성 검사 결과를 반환
 * @param {FormData} params 엑셀 파일 및 조회 param
 * @returns {object} 유효성 검사 결과 데이터
 */
export const apiPostOrderManualExcelUploadValidation = (params: any) => {
	return axios
		.post('/api/tm/dispatch/manual/uploadValidation', params, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then(res => res.data);
};

export const apiPostOrderManualExcelUploadSave = (params: any) => {
	return axios.post('/api/tm/dispatch/manual/uploadSave', params, {}).then(res => res.data);
};

export const apiGetOrderManualGeoValidation = (params: any) => {
	return axios.post('api/tm/dispatch/manual/validation/geo', params).then(res => res.data);
};
