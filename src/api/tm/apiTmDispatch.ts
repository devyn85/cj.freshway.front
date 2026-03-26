/*
############################################################################
# API: TM Dispatch API (배차 관련)
# 목적: TmPlan 화면에서 사용하는 배차 실행, 조정, 저장 API
# 
# [주요 기능]
# - setDispatch: 자동배차 실행 (TmOrderList에서 조건 전달받아 실행)
# - getAdjustPlan: 배차조정 실행 (TmPlanList에서 조건 전달받아 재계산)
# - saveDispatch: 배차 저장/확정 (임시저장 또는 최종확정)
# - getDispatchList: 배차 목록 조회 (TmPlanList에서 사용)
# - updateDispatchConfirmed: 배차 확정 업데이트
# 
# [사용처]
# - TmPlan.tsx: 자동배차/배차조정 실행, 배차 저장/확정
# - TmPlanList.tsx: 배차 목록 조회
# - TmOrderList.tsx: 자동배차 조건 전달
# 
# [API 엔드포인트]
# - /api/tm/dispatch/v1.0/setDispatch: 자동배차 실행
# - /api/tm/dispatch/v1.0/saveDispatch: 배차 저장/확정
# - /api/tm/dispatch/v1.0/getDispatchList: 배차 목록 조회
# - /api/tm/dispatch/v1.0/updateConfirmed: 배차 확정 업데이트
############################################################################
*/

import axios from '@/api/Axios';

// 자동배차 실행 요청 DTO
// 사용처: TmOrderList에서 자동배차 실행 시 사용
// 저장 이유: 배차 엔진에 전달할 조건을 명확히 정의하여 타입 안전성 확보
export type TmSetDispatchReqDto = {
	dccode: string; // 물류센터코드 (필수)
	deliveryDate: string; // 배송일자 (YYYYMMDD 형식, 필수)
	deliveryType?: 'WD' | 'WOD' | 'WWD' | 'WSD'; // 배송유형 (선택)
	custCode?: string; // 거래처코드 - ',' 단위로 구분 다중검색 (선택)
	planEntryType?: 'AUTO' | 'ADJUST'; // 진입 유형 (선택)
};

export type TmVehiclesDto = {
	carCapacity: string;
	carno: string; // 차량번호
	contractType: string;
	vehicleName?: string; // 차량명/기사명
	vehicleType?: string; // 차량유형 (고정/지입 등)
	vehicleGroup?: string; // 차량그룹
	outGroupCd?: string; // 조차 코드
	maxWeight?: number; // 최대중량 (kg)
	loadedWeight?: number; // 적재중량 (kg)
	weightUsagePercent?: number; // 중량 적재율 (%)
	maxCbm?: number; // 최대CBM
	loadedCbm?: number; // 적재CBM
	cbmUsagePercent?: number; // CBM 적재율 (%)
	orderCount?: number; // 주문수
	totalTimeMinutes?: number; // 총 소요시간 (분)
	totalTimeDisplay?: string; // 총 소요시간 표시용
	totalDistanceKm?: number; // 총 이동거리 (km)
	steps: TmEngineStepDto[]; // 작업 스텝 목록 (타임라인 블록으로 변환)
	cost?: number; // 비용
	setup?: number; // 설정비용 (초)
	duration?: number; // 소요시간 (초)
	waitingTime?: number; // 대기시간 (초)
	priority?: number; // 우선순위
	roundSeq?: number; // 회차번호 (동일 차량번호 내 순서, 1부터 시작)
	violations?: any[]; // 위반사항
	description?: string; // 설명
	geometry?: string; // 전체 경로 지오메트리
	distance?: number; // 이동거리 (미터)
	uniqueId?: string;
	drivername?: string;
	phone1?: string;
	needRecalculation?: boolean; // 수동재계산 필요 여부
};

export type TmDispatchData = {
	dccode: string; // 물류센터코드
	deliveryDate: string; // 배송일자
	deliveryType: string; // 배송유형
	tmDeliveryType: string;
	status: string; // 처리상태 (SUCCESS | FAILED)
	message: string; // 처리 메시지
	summary: {
		cost: number; // 총 비용
		routes: number; // 총 경로 수
		unassigned: number; // 미배차 주문 수
		setup: number; // 설정 비용
		service: number; // 서비스 비용
		duration: number; // 총 소요시간 (초)
		waitingTime: number; // 대기시간
		priority: number; // 우선순위
		violations: any[]; // 위반사항 목록
		distance: number; // 총 이동거리 (미터)
		computingTimes?: object; // 계산 시간 정보
		totalUnassignedWeight: number; // 미배차 총 중량 (kg)
		requiredCharterVehicles: number; // 필요한 1t 용차 대수 (900kg 기준)
	};
	vehicles: TmVehiclesDto[];
	unassignedOrders: TmUnassignedOrderDto[]; // 미배차 주문 목록
	returnOrders: TmReturnOrderDto[]; // 반품 주문 목록
};

// 자동배차 실행 응답 DTO
// 사용처: TmPlan에서 배차 결과를 받아 타임라인에 표시
// 저장 이유: 배차 엔진의 응답 구조를 명확히 하여 UI 데이터 매핑 시 타입 안전성 확보
export type TmSetDispatchResp = {
	statusCode: string | number; // 응답 상태코드
	statusMessage: string; // 응답 메시지
	data: TmDispatchData;
};

// API 엔드포인트 루트 경로
const ROOT = '/api/tm/dispatch/v1.0';

// 자동배차 실행 API
// 사용처: TmPlan에서 자동배차 실행 시 호출
// 저장 이유: 배차 엔진에 조건을 전달하여 최적 배차 결과를 받아옴
export const setDispatch = async (body: TmSetDispatchReqDto): Promise<TmSetDispatchResp> => {
	// Accept-Language header는 Axios 인터셉터에서 localStorage('language') 기반으로 자동 주입됨
	const bodyWithPlanEntryType: TmSetDispatchReqDto = {
		...body,
		planEntryType: 'AUTO',
	};
	return axios.post(`${ROOT}/setDispatch`, bodyWithPlanEntryType).then(res => res.data);
};

// 배차조정 요청 DTO (임시 - 백엔드 API 제공 전까지 사용)
// 사용처: TmPlanList에서 배차조정 실행 시 사용
// 저장 이유: 배차조정 조건을 명확히 정의하여 타입 안전성 확보
export type GetAdjustPlanReq = {
	deliveryDate: string; // 배송일자
	dccode?: string | null; // 물류센터코드 (선택)
	deliveryType?: string | null; // 배송유형 (선택)
	regionCode?: string | null; // 권역코드 (선택)
	carnoSearch?: string | null; // 차량번호 검색 (선택)
};

// 배차조정 실행 API (임시 - setDispatch 엔드포인트 재사용)
// 사용처: TmPlan에서 배차조정 실행 시 호출
// 저장 이유: 기존 배차 엔진을 재사용하여 배차조정 결과를 받아옴
export const getAdjustPlan = async (params: GetAdjustPlanReq): Promise<TmSetDispatchResp> => {
	// 현재는 setDispatch 엔드포인트를 재사용하여 배차조정 시뮬레이션
	// 최소한의 필드만 매핑하여 엔진을 호출하며, 추후 백엔드 API로 교체 예정
	const body: TmSetDispatchReqDto = {
		dccode: params.dccode || '',
		deliveryDate: params.deliveryDate,
		deliveryType: (params.deliveryType as 'WD' | 'WOD' | 'WWD' | 'WSD') || 'WD',
		custCode: undefined,
		planEntryType: 'ADJUST',
	};
	return axios.post(`${ROOT}/setDispatch`, body).then(res => res.data);
};

// 배차 목록 조회 요청 DTO
// 사용처: TmPlanList에서 배차 목록 조회 시 사용
// 저장 이유: 배차 목록 조회 조건을 명확히 정의하여 타입 안전성 확보
export type GetDispatchListReq = {
	deliveryDate: string; // 배송일자 (필수)
	dccode: string; // 물류센터코드 (필수)
	deliveryType?: string; // 배송유형 (선택)
	regionCode?: string; // 권역코드 (선택)
	carnoSearch?: string; // 차량번호 검색 (선택)
	dispatchStatus?: 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'; // 배차상태 (선택)
};

// 배차 목록 항목 DTO
// 사용처: TmPlanList에서 배차 목록 그리드에 표시
// 저장 이유: 배차 목록의 각 항목 구조를 명확히 하여 UI 표시 시 타입 안전성 확보
export type DispatchListItem = {
	deliveryDate: string; // 배송일자
	pop: string; // POP 코드
	carNo: string; // 차량번호
	areaName: string; // 권역명
	areaGroupName: string; // 권역그룹명
	contractType: string; // 계약유형
	priority: string; // 우선순위
	dispatchStatus: string; // 배차상태
	destinationCount: string; // 목적지 수
	totalCbm: string; // 총 CBM
	totalWeightKg: string; // 총 중량
	reason: string; // 사유
	blameCarNo: string; // 책임차량번호
};

// 배차 목록 조회 응답 DTO
// 사용처: TmPlanList에서 배차 목록 조회 결과 처리
// 저장 이유: 배차 목록 조회 응답 구조를 명확히 하여 데이터 처리 시 타입 안전성 확보
export type GetDispatchListResp = {
	statusCode?: string | number; // 응답 상태코드
	statusMessage?: string; // 응답 메시지
	data?: {
		searchSummary?: any; // 검색 요약
		statistics?: any; // 통계 정보
		dispatchList: DispatchListItem[]; // 배차 목록
		pagingInfo?: any; // 페이징 정보
	};
};

// 배차 목록 조회 API
// 사용처: TmPlanList에서 배차 목록 조회 시 호출
// 저장 이유: 저장된 배차 목록을 조회하여 그리드에 표시
export const getDispatchList = async (params: GetDispatchListReq): Promise<GetDispatchListResp> => {
	return axios.get(`${ROOT}/getDispatchList`, { params }).then(res => res.data);
};

// 배차 차량변경 저장 API - 삭제예정
export const saveDispatchChangeCarNo = async (params: GetDispatchListReq): Promise<GetDispatchListResp> => {
	return axios.post(`${ROOT}/changeCarNo`, params).then(res => res.data);
};

// 배차 차량변경 리스트트 저장 API
export const saveDispatchList = async (params: any): Promise<GetDispatchListResp> => {
	return axios.post(`${ROOT}/saveDispatchList`, params).then(res => res.data);
};

// 미배차 주문 DTO
// 사용처: TmPlan에서 미배차 주문 목록 표시
// 저장 이유: 미배차 주문의 구조를 명확히 하여 UI 표시 시 타입 안전성 확보
export type TmUnassignedOrderDto = {
	id?: string; // 작업/주문 ID
	location?: [number, number]; // 위치 좌표 [경도, 위도]
	description?: string; // 단계 설명
	locationIdx?: number; // 위치 인덱스
	service?: number; // 서비스 시간 (초)
	expectedArrivalTime?: string; // 예상 도착시간
	storerkey?: string; // 고객사코드
	custType?: string; // 거래처유형
	custName?: string; // 고객처명
	faceInspect?: string; // 대면검수 YN
	specialConditionYn?: string; // 특수조건 YN
	claimYn?: string; // 클레임 YN
	reqdlvtime1From?: string; // OTD 시작시간
	reqdlvtime1To?: string; // OTD 종료시간
	keyCustType?: string; // 키 유형
	splitItems?: any[]; // 분할 상품 정보
	defDistrictCode?: string; // 본POP (고정 POP번호)
	defCarno?: string; // 본차량 (고정 차량번호)
	defPop?: string; // 고정 POP번호 (DEF_DELIVERYGROUP)
	basePop?: string; // 기본 대표POP번호 (POPNO)
	returnYn?: string; // 반품여부
	custAddress?: string; // 실착지 주소
	cube?: string; // CBM
	weight?: string; // 중량 (kg)
	orderQty?: string; // 주문수량
	slipline?: string; // 전표라인
	slipdt?: string; // 전표일자
	slipno?: string; // 전표번호
	splitDeliveryYn?: string; // 분할배송여부
	splitDeliverySeq?: string; // 분할배송순번
	tmDeliveryType?: string; // 배송유형
	_parentUid?: string; // 부모 주문 ID
	_seqIndex?: number; // 순번
	_uid?: string; // 고유 ID
	_isSplittedParent?: boolean; // 분할 부모 여부
	_stepIndex?: number; // 스텝 인덱스
	_originVid?: string; // 원본 차량 ID
	uniqueId?: string; // 고유 ID
	passwordType?: string; // 키 유형
	passwordTypeCd?: string; // 키 유형 코드
};

export type TmReturnOrderDto = {
	slipdt?: string; // 전표일자
	claimYn?: string; // 클레임 YN
	cube?: string; // CBM
	custAddress?: string; // 실착지 주소
	custName?: string; // 고객처명
	custType?: string; // 거래처유형
	defDistrictCode?: string; // 본POP (고정 POP번호)
	defCarno?: string; // 본차량 (고정 차량번호)
	defPop?: string; // 고정 POP번호 (DEF_DELIVERYGROUP)
	basePop?: string; // 기본 대표POP번호 (POPNO)
	faceInspect?: string; // 대면검수 YN
	id?: string; // 작업/주문 ID
	keyCustType?: string; // 키 유형
	location?: [number, number]; // 위치 좌표 [경도, 위도]
	orderQty?: string; // 주문수량
	reqdlvtime1From?: string; // OTD 시작시간
	reqdlvtime1To?: string; // OTD 종료시간
	specialConditionYn?: string; // 특수조건 YN
	tmDeliveryType?: string; // 배송유형
	storerkey?: string; // 고객사코드
	weight?: string; // 중량 (kg)
	uniqueId?: string; // 고유 ID
	passwordType?: string; // 키 유형
	passwordTypeCd?: string; // 키 유형 코드
};

// 배차 엔진 스텝 DTO (Swagger 기반)
// 사용처: 배차 저장 시 차량별 작업 스텝 정보 전달
// 저장 이유: 배차 엔진의 스텝 구조를 명확히 하여 저장 시 타입 안전성 확보
export type TmEngineStepDto = {
	type?: string; // 스텝 타입 ('start' | 'pickup' | 'delivery' | 'end')
	arrival?: string; // 도착시간 (초)
	duration?: string; // 이동시간(초)
	stepDuration?: string; // 단계별 소요시간 (초)
	setup?: number; // 작업초기설정시간(초)
	service?: number; // 서비스시간(초)
	waitingTime?: number; // 대기시간(초)
	violations?: any[]; // 위반사항
	location?: [number, number]; // 위치 ([경도, 위도])
	distance?: string; // 누적 거리 (미터)
	stepDistance?: string; // 단계별 이동거리 (미터)
	id?: string; // 작업/주문 ID
	_stepIndex?: number; // 스텝 인덱스
	_originVid?: string; // 원본 차량 ID
	_originCarno?: string;
	locationIdx?: number; // 위치 인덱스
	expectedArrivalTime?: string; // 예상 도착시간
	description?: string; // 단계 설명
	storerkey?: string; // 고객사코드
	custType?: string; // 거래처유형
	custName?: string; // 고객처명
	faceInspect?: string; // 대면검수 YN
	specialConditionYn?: string; // 특수조건 YN
	claimYn?: string; // 클레임 YN
	reqdlvtime1From?: string; // OTD 시작시간
	reqdlvtime1To?: string; // OTD 종료시간
	keyCustType?: string; // 키 유형
	defDistrictCode?: string; // 본POP (고정 POP번호)
	defCarno?: string; // 본차량 (고정 차량번호)
	defPop?: string; // 고정 POP번호 (DEF_DELIVERYGROUP)
	basePop?: string; // 기본 대표POP번호 (POPNO)
	returnYn?: string; // 반품여부
	custAddress?: string; // 실착지 주소
	geometry?: string; // 단계 지오메트리
	weight?: string; // 중량 (kg)
	cube?: string; // CBM
	orderQty?: string; // 주문수량
	tmDeliveryType?: string; // 배송유형
	slipdt?: string; // 전표일자
	slipno?: string; // 전표번호
	slipline?: string; // 전표라인
	splitDeliveryYn?: string; // 분할배송여부
	splitDeliverySeq?: string; // 분할배송순번
	splitItems?: any[]; // 분할 상품 정보
	roundSeq?: number; // 라운드 순번
	uniqueId?: string; // 고유 ID
	passwordType?: string; // 키 유형
	passwordTypeCd?: string; // 키 유형 코드
};

// 배차 저장용 차량 DTO
// 사용처: 배차 저장 시 차량별 정보 전달
// 저장 이유: 차량별 배차 정보를 명확히 하여 저장 시 타입 안전성 확보
export type SaveDispatchVehicle = {
	carno?: string; // 차량번호
	steps?: TmEngineStepDto[]; // 작업 스텝 목록
};

// 배차 저장 요청 DTO
// 사용처: TmPlan에서 배차 저장/확정 시 사용
// 저장 이유: 배차 저장 조건을 명확히 정의하여 서버에 전달
export type SaveDispatchReq = {
	deliveryDate: string; // 배송일자
	deliveryType: string; // 배송유형 (WD 또는 새벽배송 등)
	dccode: string; // 물류센터코드
	vehicles: SaveDispatchVehicle[]; // 차량별 배차 정보
	custCode?: string; // 거래처코드 (선택)
	isPreDispatch?: boolean; // 배차저장 여부 (true: 임시저장, false: 최종확정)
	isPartialSave?: boolean; // 부분저장 여부 (true: 부분저장, false: 전체저장)
	unassignedOrders?: string[];
};

// 배차 저장 응답 DTO
// 사용처: TmPlan에서 배차 저장 결과 처리
// 저장 이유: 배차 저장 응답 구조를 명확히 하여 결과 처리 시 타입 안전성 확보
export type SaveDispatchResp = {
	result?: string; // 처리 결과
	message?: string; // 처리 메시지
	statusCode?: number; // 응답 상태코드
};

// 배차 저장/확정 API
// 사용처: TmPlan에서 배차저장 또는 배차확정 버튼 클릭 시 호출
// 저장 이유: 배차 결과를 서버에 저장하여 추후 조회 및 실행 가능하도록 함
export const saveDispatch = async (body: SaveDispatchReq): Promise<SaveDispatchResp> => {
	return axios.post(`${ROOT}/saveDispatch`, body).then(res => res.data);
};

// 배차 확정 업데이트 요청 DTO (Swagger 기반)
// 사용처: 배차 확정 업데이트 시 사용
// 저장 이유: 배차 확정 업데이트 조건을 명확히 정의하여 타입 안전성 확보
export type UpdateDispatchConfirmedReq = {
	dccode?: string; // 물류센터코드 (선택)
	slipDt?: string; // 전표일자 (선택)
	slipNo?: string; // 전표번호 (선택)
	docType?: string; // 문서유형 (선택)
};

// 배차 확정 업데이트 응답 DTO
// 사용처: 배차 확정 업데이트 결과 처리
// 저장 이유: 배차 확정 업데이트 응답 구조를 명확히 하여 결과 처리 시 타입 안전성 확보
export type UpdateDispatchConfirmedResp = {
	statusCode: string; // 응답 상태코드
	statusMessage: string; // 응답 메시지
	data?: string; // 응답 데이터
};

// 배차 확정 업데이트 API
// 사용처: 배차 확정 업데이트 시 호출
// 저장 이유: 임시 배차를 최종 확정 상태로 업데이트
export const updateDispatchConfirmed = async (
	body: UpdateDispatchConfirmedReq[],
): Promise<UpdateDispatchConfirmedResp> => {
	return axios.post(`${ROOT}/updateConfirmed`, body).then(res => res.data);
};

// 배차이력 조회
export const apiTmGetPlanCustomerDispatchHistoryPopup = (params: any) => {
	return axios
		.post('/api/tm/planCustomerDispatchHistoryPopup/v1.0/getPlanCustomerDispatchHistoryPopup', params)
		.then(res => res.data);
};

// 배차취소
export const apiTmCancelDispatch = (params: any) => {
	return axios.post('/api/tm/dispatch/v1.0/cancelDispatch', params).then(res => res.data);
};

// 엔진 재계산 요청 DTO (자동 최적화)
// 사용처: TmPlan에서 엔진 재계산 버튼 클릭 시 사용
// 저장 이유: 현재 배차 상태를 기반으로 엔진 재계산 조건을 명확히 정의
export type OptimizeAutoReqStepDto = {
	id: string; // 주문 ID
	storerkey: string; // 스토어 키
	custType: string; // 고객 유형
};

export type OptimizeAutoReqVehicleDto = {
	carno: string; // 차량번호
	vehicleType: string; // 차량유형
	outGroupCd: string; // 권역그룹코드
	steps: OptimizeAutoReqStepDto[]; // 주문 목록
};

export type OptimizeAutoReq = {
	dccode: string; // 물류센터코드
	deliveryDate: string; // 배송일자 (YYYYMMDD)
	tmDeliveryType: string; // 배송유형 (WD 등)
	custCode?: string; // 거래처코드 (선택)
	vehicles: any[]; // 차량별 배차 정보
};

// 엔진 재계산 응답은 TmSetDispatchResp와 동일한 구조 사용

// 엔진 재계산 API (자동 최적화)
// 사용처: TmPlan에서 엔진 재계산 버튼 클릭 시 호출
// API: POST /api/tm/planEta/v1.0/optimize/auto
// 저장 이유: 현재 배차 상태를 기반으로 엔진을 재실행하여 최적화된 배차 결과를 받아옴
export const optimizeAuto = async (isManual: boolean, body: OptimizeAutoReq): Promise<TmSetDispatchResp> => {
	return axios.post(`/api/tm/planEta/v1.0/optimize/${isManual ? 'manual' : 'auto'}`, body).then(res => res.data);
};

// 수동분할배차 마스터 목록 조회 요청 DTO
export type GetManualSplitMasterListReq = {
	custCode: string; // 거래처코드
	dccode: string; // 물류센터코드
	deliveryDate: string; // 배송일자
	dispatchStatus: string; // 배차상태
	tmDeliveryType: string; // 배송유형
	truthCustkey: string; // 실제 거래처키
};

// 수동분할배차 마스터 목록 항목 DTO
export type ManualSplitMasterItem = {
	cube: string; // 체적 (m³)
	custkey: string; // 거래처키
	custname: string; // 거래처명
	dccode: string; // 물류센터코드
	orderQty: string; // 주문수량
	sku: string; // SKU 코드
	skuDescr: string; // SKU 설명
	slipdt: string; // 전표일자
	slipline: string; // 전표라인
	slipno: string; // 전표번호
	splitDeliverySeq?: string; // 분할배송순번 (SLIPNO 기준)
	storagetypedesc: string; // 보관유형설명
	uom: string; // 단위
	weight: string; // 중량 (kg)
};

// 수동분할배차 마스터 목록 조회 API
// 사용처: TmOrderSplitModal에서 분할할 SKU 상세 목록 조회
// API: GET /api/tm/planUndispatchManualSplit/v1.0/getMasterList
export const getManualSplitMasterList = async (
	params: GetManualSplitMasterListReq,
): Promise<ManualSplitMasterItem[]> => {
	return axios
		.get('/api/tm/planUndispatchManualSplit/v1.0/getMasterList', { params })
		.then(res => res.data?.data || res.data || []);
};

// 실비차 배차 옵션 DTO
export type OutGroupOptionDto = {
	carCount: string; // 차량 수
	dccode: string; // 물류센터코드
	maxCbm: string; // 최대 CBM
	maxLoadQty: string; // 최대 착지수
	maxWeight: string; // 최대 중량
	outGroupCd: string; // 조차 코드
};

// 실비차 배차 요청 DTO
export type SetDispatchTemporaryCarReq = {
	deliveryDate: string; // 배송일자 (YYYYMMDD 형식)
	outGroupOptionList: OutGroupOptionDto[]; // 실비차 조건 목록
	unAssignedOrderList: TmUnassignedOrderDto[]; // 미배차 주문 목록
	dccode: string;
};

// 실비차 배차 응답 DTO (TmSetDispatchResp와 동일한 구조 사용)
export type SetDispatchTemporaryCarResp = {
	statusCode: string | number;
	statusMessage: string;
	data: {
		vehicles: TmVehiclesDto[]; // 실비차 배차 결과
		unassignedOrders: TmUnassignedOrderDto[]; // 남은 미배차 주문
	};
};

// 실비차 배차 API
// 사용처: TmPlan에서 실비차 배차 버튼 클릭 시 호출
// API: POST /api/tm/dispatch/v1.0/setDispatchTemporaryCar
export const setDispatchTemporaryCar = async (
	body: SetDispatchTemporaryCarReq,
): Promise<SetDispatchTemporaryCarResp> => {
	return axios.post(`${ROOT}/setDispatchTemporaryCar`, body).then(res => res.data);
};

// =============================================================================
// 배차결과 비교 API
// =============================================================================

// 배차결과 비교 공통 요청 DTO
export type PlanSummaryDiffReq = {
	dccode: string; // 물류센터코드 (필수)
	deliveryDate: string; // 배송일자 (YYYYMMDD 형식, 필수)
	tmDeliveryType: string; // 배송유형 (WD 등)
	carno?: string; // 차량번호 (선택)
};

// 배차결과 비교 마스터 목록 항목 DTO
// API: GET /api/tm/planSummaryDiff/v1.0/getMasterList
export type PlanSummaryDiffMasterItem = {
	contractnm: string;
	item: string;
	tempDispatch: string;
	confirmed: string;
	gap: string;
};

// 배차결과 비교 마스터 목록 응답 DTO (배열로 바로 반환됨)
export type GetPlanSummaryDiffMasterListResp = PlanSummaryDiffMasterItem[];

// 배차 차량 요약 - 착지 정보 DTO
export type CustSummaryDiffItem = {
	custname: string; // 거래처명 (실착지명)
	dispatchYn: string; // 배차확정 여부 (Y/N)
	preDispatchYn: string; // 가배차 여부 (Y/N)
	truthcustkey: string; // 실착지코드 - truth 철자 주의
};

// 배차 차량 요약 응답 DTO (객체로 바로 반환됨)
// API: GET /api/tm/planSummaryDiff/v1.0/getMasterCarList
export type GetMasterCarListResp = {
	carSummaryDiff: any[]; // 차량 요약 정보
	carno: string; // 차량번호
	custSummaryDiff: CustSummaryDiffItem[]; // 착지 정보 목록
};

// 배차결과 비교 마스터 목록 조회 API
// 사용처: TmDispatchCompareModal에서 전체 비교 데이터 조회
// API: GET /api/tm/planSummaryDiff/v1.0/getMasterList
export const getPlanSummaryDiffMasterList = async (
	params: PlanSummaryDiffReq,
): Promise<GetPlanSummaryDiffMasterListResp> => {
	return axios.get('/api/tm/planSummaryDiff/v1.0/getMasterList', { params }).then(res => res.data);
};

// 배차 차량 요약 조회 API
// 사용처: TmDispatchCompareModal에서 차량 선택 시 상세 정보 조회
// API: GET /api/tm/planSummaryDiff/v1.0/getMasterCarList
export const getPlanSummaryDiffMasterCarList = async (params: PlanSummaryDiffReq): Promise<GetMasterCarListResp> => {
	return axios.get('/api/tm/planSummaryDiff/v1.0/getMasterCarList', { params }).then(res => res.data);
};

// =============================================================================
// 신규 주문 갯수 조회 API
// =============================================================================

// 신규 주문 갯수 조회 요청 DTO
export type GetNewOrderCountReq = {
	dccode: string; // 물류센터코드 (필수)
	deliveryDate: string; // 배송일자 (YYYYMMDD 형식, 필수)
	tmDeliveryType: string; // 배송유형 (필수)
};

// 신규 주문 갯수 조회 응답 DTO
export type GetNewOrderCountResp = {
	data: number; // 신규 주문 갯수
	statusCode: number; // 상태코드
	statusMessage: string; // 상태 메시지
};

// 신규 주문 갯수 조회 API
// 사용처: TmPlan에서 1분마다 폴링하여 신규 주문 알림 표시
// API: POST /api/tm/planOrderNewPopup/v1.0/getNewOrderCount
export const getNewOrderCount = async (body: GetNewOrderCountReq): Promise<GetNewOrderCountResp> => {
	return axios
		.post('/api/tm/planOrderNewPopup/v1.0/getNewOrderCount', body, { showLoading: false } as any)
		.then(res => res.data);
};

// =============================================================================
// 신규 주문 추가 API
// =============================================================================

// 신규 주문 추가 응답 DTO
export type AddNewOrdersResp = {
	data: TmUnassignedOrderDto[]; // 신규 주문 실착지 목록
	statusCode: number; // 상태코드
	statusMessage: string; // 상태 메시지
};

// 신규 주문 추가 API
// 사용처: TmPlan에서 신규 주문 알림 클릭 시 주문 추가
// API: POST /api/tm/planOrderNewPopup/v1.0/addNewOrders
export const addNewOrders = async (body: GetNewOrderCountReq): Promise<AddNewOrdersResp> => {
	return axios.post('/api/tm/planOrderNewPopup/v1.0/addNewOrders', body).then(res => res.data);
};
