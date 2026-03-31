import axios from '@/api/Axios';

// =============================================================================
// 상차지시 팝업 설정 API
// =============================================================================
// 상차지시 팝업 설정 요청 DTO
export type TypeGetWDLoadSettingReq = {
	dccode: string; // 물류센터코드 (필수)
	shipDt: string; // 배송일자 (YYYYMMDD 형식, 필수)
};
// 상차지시 팝업 설정 응답 DTO
export type TypeGetWDLoadSettingResp = {
	data: any; // 상차지시 팝업 설정 데이터
	statusCode: number; // 상태코드
	statusMessage: string; // 상태 메시지
};
// 상차지시 설정 팝업 조회 API
export const getLoadStatusSetting = async (body: TypeGetWDLoadSettingReq): Promise<TypeGetWDLoadSettingResp> => {
	return axios.post('/api/wd/loadPop/v1.0/getLoadDirectionsStatus',  body ).then((res: any) => res.data);
};

export type TypePostSaveLoadStatusSettingReq = {
  dccode: string;
  shipDt: string;
  loadStatus: string;
};
// 상차지시 설정 저장 API
export const saveLoadStatusSetting = async (body: TypePostSaveLoadStatusSettingReq) => {
	return axios.post('/api/wd/loadPop/v1.0/updateLoadDirectionsStatus', body).then((res: any) => res.data);
};
