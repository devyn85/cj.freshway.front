import axios from '@/api/Axios';

// 기준정보 > 배차계획 > 실비차 조건 설정
// 실비차 목록 조회 (GET)

const API_PATH = '/api/ms/outGroupSetting/v1.0';

export const apiMsOutGroupGetMasterList = (params: { dccode: string }) => {
	return axios.get(`${API_PATH}/getMasterList`, { params }).then(res => res.data);
};

// 실비차 설정 저장 (POST)
export type MsOutGroupSettingReqDto = {
	dccode: string;
	outGroupCd: string;
	maxWeight?: string;
	maxCbm?: string;
	maxLoadQty?: string;
    carCount?: string;
};

export const apiMsOutGroupUpdateMasterList = (body: MsOutGroupSettingReqDto[]) => {
	return axios.post(`${API_PATH}/updateMasterList`, body).then(res => res.data);
};

export type OutGroupOption = { key: string; value: string };
export type OutGroupSetting = {
	dccode: string;
	outGroupCd: string;
	outGroupNm: string;
	maxWeight?: string;
	maxCbm?: string;
	maxLoadQty?: string;
    carCount?: string;
};

export type MsOutGroupGetMasterListRes = {
	data?: {
		outGroupList?: OutGroupOption[];
		outGroupSettingList?: OutGroupSetting[];
	};
};
