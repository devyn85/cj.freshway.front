/*
############################################################################
# API: TM Dispatch Options API (배차 옵션 관련)
# 목적: TmOrderList 화면에서 배차 조건 설정을 위한 API
# 
# [주요 기능]
# - getDispatchOptions: 배차 옵션 조회
# - setDispatchOptions: 배차 옵션 저장
# 
# [사용처]
# - TmDispatchOptionsModal: 배차 옵션 설정 모달에서 사용
# - DC코드별 배차 조건 저장/조회
# 
# [API 엔드포인트]
# - /api/tm/dispatchOptions/v1.0/getOptions: 배차 옵션 조회
# - /api/tm/dispatchOptions/v1.0/setOptions: 배차 옵션 저장
# 
# [배차 옵션 설명]
# - useMaxWeight: 최대중량 사용 여부
# - useSkills: 특수조건 사용 여부
# - useMaxLocation: 최대 착지수 사용 여부
# - useRounds: 다회전 여부 사용 여부
# - useMaxCbm: 최대 적재량 조정(CBM) 사용 여부
# - offsetCbm: 최대 적재량 조정값 (CBM) - deprecated
# - cbmRatio1/1_4/2_5/3_5/5/11: 톤급별 CBM 허용 비율 (%)
# - useMaxPop: POP 최대 개수 사용 여부
# - popCount: POP 최대 개수
# - planOptionType: 계획 옵션 타입 (1=기본)
# - dccode: 물류센터 코드
############################################################################
*/

import axios from '@/api/Axios';

// 배차 옵션 DTO 타입 정의
// 사용처: 배차 옵션 조회/저장 API의 요청/응답 데이터 타입
// 저장 이유: 배차 조건 설정 데이터의 구조를 명확히 하여 타입 안전성 확보
export type DispatchOptionsDTO = {
	useMaxWeight: boolean; // 최대중량 사용 여부
	useSkills: boolean; // 특수조건 사용 여부
	useMaxLocation: boolean; // 최대 착지수 사용 여부
	useRounds: boolean; // 다회전 여부 사용 여부
	useMaxCbm: boolean; // 최대 적재량 조정(CBM) 사용 여부
	offsetCbm: number; // 최대 적재량 조정값 (CBM) - deprecated, 톤급별 비율로 대체
	// 톤급별 CBM 허용 비율 (%) - 기준 CBM 대비 최대 허용 비율
	cbmRatio1?: number; // 1톤 CBM 허용 비율 (%)
	cbmRatio1_4?: number; // 1.4톤 CBM 허용 비율 (%)
	cbmRatio2_5?: number; // 2.5톤 CBM 허용 비율 (%)
	cbmRatio3_5?: number; // 3.5톤 CBM 허용 비율 (%)
	cbmRatio5?: number; // 5톤 CBM 허용 비율 (%)
	cbmRatio11?: number; // 11톤 CBM 허용 비율 (%)
	useMaxPop: boolean; // POP 최대 개수 사용 여부
	popCount: number; // POP 최대 개수 (정수)
	planOptionType?: number; // 계획 옵션 타입 (선택, 기본값: 1)
	dccode?: string | null; // 물류센터 코드 (선택)
};

// API 엔드포인트 루트 경로
const ROOT = '/api/tm/dispatchOptions/v1.0';

// 배차 옵션 조회 API
// 사용처: TmDispatchOptionsModal에서 모달 열림 시 기존 설정값 조회
// 저장 이유: DC코드별 저장된 배차 옵션을 조회하여 모달에 표시
export const getDispatchOptions = (params?: any): Promise<{ data: DispatchOptionsDTO }> => {
	return axios.get(`${ROOT}/getOptions`, { params }).then(res => res.data);
};

// 배차 옵션 저장 API
// 사용처: TmDispatchOptionsModal에서 사용자가 설정한 옵션을 저장
// 저장 이유: DC코드별 배차 조건을 서버에 저장하여 배차 시 사용
export const setDispatchOptions = (data: DispatchOptionsDTO & Record<string, any>): Promise<any> => {
	return axios.post(`${ROOT}/setOptions`, data).then(res => res.data);
};
