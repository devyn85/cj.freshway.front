import { ResType } from '@/types/api';
import Axios from '../Axios';

/**
 * 거래처 상세 팝업 응답 DTO
 */
export interface TmPlanCustomerDetailPopupResDto {
	storerkey: string; // 고객사코드
	custkey: string; // 고객 키
	custtype?: string; // 거래처유형
	custname: string; // 거래처명
	truthAddress1: string | null; // 실착지 거래처주소
	truthAddress2: string | null; // 실착지 상세주소
	parkingHeight: string | null; // 건물 진입가능 높이
	parkingHeightNm?: string | null; // 건물 진입가능 높이명
	deliveryAvailableTime: string | null; // 고객사 납품 가능 시간
	buildingOpenTime: string | null; // 고객사 건물 개방 시간
	reqDlvTime1From?: string | null; // 배송요청시간 시작 OTD(From)
	reqDlvTime1To?: string | null; // 배송요청시간 종료 OTD(To)
	reqDlvTime2From?: string | null; // 배송요청시간 시작 OTD(From)
	reqDlvTime2To?: string | null; // 배송요청시간 종료 OTD(To)
	otd?: string | null; // OTD
	faceInspect: string | null; // 대면검수여부
	distantYn: string; // 격오지여부
	kidsClYn: string; // 키즈분류여부
	lngDistantYn: string; // 장거리여부
	accessway: string | null; // 업장출입
	freezePlace: string | null; // 적재위치(냉동)
	coldPlace: string | null; // 적재위치(냉장)
	HTemperature: string | null; // 적재위치(상온) - 대문자 H
	keyType: string | null; // 거래처 열쇠
	keyDetail: string | null; // 거래처 열쇠 상세
	tmMemo: string | null; // tm메모
	memo: string | null; // 기타사항 (일별메모)
	cardMemo: string | null; // 요청사항(거래처카드)
	supplyMemo: string | null; // 메모(납품서반영)
	truthCustkey: string; // 실착지 거래처 키
	truthCustName: string; // 실착지 거래처명
	dlvWaitYn: string; // 납품대기여부
	unloadLvlCd: string; // 하차난이도코드
	tmMemoEditYn: string; // tm메모 수정 가능 여부
}

/**
 * 거래처 상세 팝업 목록 조회 요청 파라미터
 */
export interface TmPlanCustomerDetailPopupReqDto {
	truthCustkey: string; // 실착지 키
	custtype?: string; // 고객유형
	storerkey?: string; // 고객사코드
	deliveryDate: string; // 배송일자
	tmDeliveryType?: string; // 배송유형
	dccode: string; // 센터코드
	dispatchStatus?: string; // 배차상태
	carno?: string; // 차량번호(배차 저장 이전 요청 X)
	custCode?: string; // 거래처 코드 ',' 단위로 구분 다중검색
}

/**
 * 거래처 상세 팝업 메모 저장 요청 DTO
 */
export interface TmPlanCustomerDetailPopupMemoReqDto {
	custkey: string; // 거래처키
	storerkey: string; // 고객사코드
	custtype: string; // 거래처 유형
	deliveryDate: string; // 배송일자
	tmDeliveryType: string; // 배송유형
	dccode: string; // 센터코드
	dispatchStatus: string; // 배차상태
	carno?: string; // 차량번호(배차 저장 이전 요청 X)
	memo: string; // 메모 text
}

/**
 * 배차 실착지기준 거래처 상세팝업 목록 조회
 * @param params
 */
export const apiGetCustomerDetailPopupList = (
	params: TmPlanCustomerDetailPopupReqDto,
): Promise<ResType<TmPlanCustomerDetailPopupResDto[]>> => {
	return Axios.get('/api/tm/customerDetailPopup/v1.0/getMasterList', { params });
};

/**
 * 거래처 상세팝업 메모 저장
 * @param data
 */
export const apiPostSaveCustomerDetailPopupMemo = (
	data: TmPlanCustomerDetailPopupMemoReqDto,
): Promise<ResType<string>> => {
	return Axios.post('/api/tm/customerDetailPopup/v1.0/saveMemo', data);
};
