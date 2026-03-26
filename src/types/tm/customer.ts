import { TmPlanCustomerDetailPopupResDto } from '@/api/tm/apiTmCustomerDetailPopup';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// 거래처 상세 정보 타입 (UI 표시용)
export interface CustomerDetailInfo {
	custKey: string; // 거래처코드
	custName: string; // 거래처명
	custAddress: string; // 실 배송지 주소
	vehicleHeightLimit: string; // 차량제한높이
	deliveryAvailableTime: string; // 납품가능시간
	buildingAccessTime: string; // 건물출입가능
	otdFrom: string; // OTD From
	otdTo: string; // OTD To
	faceInspection: string; // 대면검수
	specialCondition: string; // 특수조건 (격오지, 키즈분류, 장거리)
	businessAccess: string; // 업장출입
	loadingPosition: string; // 적재위치
	keyType: string; // 키 종류
	keyDetail: string; // 키 상세
	fixedMemo: string; // 고정메모 (tm메모)
	dailyMemo: string; // 일별메모 (기타사항)
	cardMemo: string; // 요청사항(거래처카드)
	supplyMemo: string; // 메모(납품서반영)
	tmMemoEditable: boolean;
}

// API 응답을 UI 표시용으로 변환하는 함수
export const convertApiToCustomerDetail = (data: TmPlanCustomerDetailPopupResDto): CustomerDetailInfo => {
	// 납품 가능 시간 코드 변환
	const deliveryAvlTimeCodes = getCommonCodeList('CRM_DLV_DELIVERYAVLTIME');
	const deliveryAvailableTimeNm =
		deliveryAvlTimeCodes?.find(x => x.comCd === data.deliveryAvailableTime)?.cdNm || data.deliveryAvailableTime || '';

	// 건물 개방 시간 코드 변환
	const buildingOpenTimeCodes = getCommonCodeList('CRM_DLV_BUILDINGOPENTIME');
	const buildingOpenTimeNm =
		buildingOpenTimeCodes?.find(x => x.comCd === data.buildingOpenTime)?.cdNm || data.buildingOpenTime || '';

	const parkingHeightCodes = getCommonCodeList('CRM_DLV_PARKINGHEIGHT');
	const parkingHeightNm =
		parkingHeightCodes?.find(x => x.comCd === data.parkingHeightNm)?.cdNm || data.parkingHeightNm || '';

	const codes = getCommonCodeList('UNLOAD_DIFFICULTY');
	let unloadLvlCdNm = '';
	if (data.unloadLvlCd && codes?.find(x => x.comCd === data.unloadLvlCd)) {
		unloadLvlCdNm = codes.find(x => x.comCd === data.unloadLvlCd)?.cdNm?.replace('없음', '') || '';
	}
	const specialConditions = [];
	if (data.distantYn === 'Y') specialConditions.push('격오지');
	if (data.kidsClYn === 'Y') specialConditions.push('키즈분류');
	if (data.lngDistantYn === 'Y') specialConditions.push('장거리');
	if (data.dlvWaitYn === 'Y') specialConditions.push('납품대기');
	if (unloadLvlCdNm) specialConditions.push('하차난이도: ' + unloadLvlCdNm);

	// 적재위치 구성
	const loadingPositions = [];
	if (data.freezePlace) loadingPositions.push(`냉동: ${data.freezePlace}`);
	if (data.coldPlace) loadingPositions.push(`냉장: ${data.coldPlace}`);
	if (data.HTemperature) loadingPositions.push(`상온: ${data.HTemperature}`); // 대문자 H

	// OTD 파싱 - 1순위: reqDlvTime1From/To, 2순위: otd 필드에서 "01:00 ~ 02:00" 형식 파싱
	let otdFrom = '';
	let otdTo = '';

	// 0순위: reqDlvTime2From과 reqDlvTime2To가 있으면 사용
	if (data.reqDlvTime2From && data.reqDlvTime2To) {
		otdFrom = data.reqDlvTime2From;
		otdTo = data.reqDlvTime2To;
	}
	// 1순위: reqDlvTime1From과 reqDlvTime1To가 있으면 사용
	else if (data.reqDlvTime1From && data.reqDlvTime1To) {
		otdFrom = data.reqDlvTime1From;
		otdTo = data.reqDlvTime1To;
	}
	// 2순위: otd 필드가 있으면 파싱하여 사용
	else if (data.otd) {
		const otdParts = data.otd.split('~').map(part => part.trim());
		if (otdParts.length === 2) {
			otdFrom = otdParts[0] || '';
			otdTo = otdParts[1] || '';
		}
	}

	return {
		custKey: data.custkey || '',
		custName: data.custname || '',
		custAddress: [data.truthAddress1, data.truthAddress2].filter(Boolean).join(' ') || '',
		vehicleHeightLimit: parkingHeightNm,
		deliveryAvailableTime: deliveryAvailableTimeNm,
		buildingAccessTime: buildingOpenTimeNm,
		otdFrom: otdFrom,
		otdTo: otdTo,
		faceInspection: data.faceInspect || '',
		specialCondition: specialConditions.join(', '),
		businessAccess: data.accessway || '',
		loadingPosition: loadingPositions.join(' / '),
		keyType: data.keyType || '',
		keyDetail: data.keyDetail || '',
		fixedMemo: data.memo || '',
		dailyMemo: data.tmMemo || '',
		cardMemo: data.cardMemo || '',
		supplyMemo: data.supplyMemo || '',
		tmMemoEditable: data.tmMemoEditYn === 'N' ? false : true,
	};
};
