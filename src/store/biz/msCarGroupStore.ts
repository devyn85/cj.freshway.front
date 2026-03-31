import { apiGetVehicleExitGroupCfg } from '@/api/ms/apiMsVehicleExitGroupCfgPopup';
import store from '@/store/core/coreStore';
import { createSlice } from '@reduxjs/toolkit';

export const carGroupStore = createSlice({
	name: 'msCarGroup',
	initialState: {
		carGroupList: [],
	},
	reducers: {
		setCarGroupList(state, action: any) {
			state.carGroupList = action.payload;
		},
	},
});

export const { setCarGroupList } = carGroupStore.actions;
export default carGroupStore.reducer;

/**
 * 출차그룹 리스트 조회
 * @returns {Array} 출차그룹 리스트
 */
export async function fetchCarGroup() {
	const carGroupList = store.getState().msCarGroup.carGroupList;

	if (carGroupList.length > 0) {
		return null; // 이미 출차그룹 리스트가 존재하는 경우, 재조회하지 않음
	}

	const params = {
		startRow: 0,
		listCount: 10000,
		skipCount: false,
	};

	const response = await apiGetVehicleExitGroupCfg(params).then(res => res.data.list);
	store.dispatch(setCarGroupList(response));

	return response;
}

/**
 * 출차그룹 리스트 조회
 * @returns {Array} 출차그룹 리스트
 */
export async function fetchCarGroupRefresh() {
	const params = {
		startRow: 0,
		listCount: 10000,
		skipCount: false,
	};
	const response = await apiGetVehicleExitGroupCfg(params).then(res => res.data.list);
	store.dispatch(setCarGroupList(response));
}

/**
 * 출차그룹 리스트
 * @param {string} dcCode 물류센터
 * @returns {any[]} 출차그룹 목록
 */
export const getCarGroupList = (dcCode: string): any[] => {
	const carGroupList = store.getState().msCarGroup.carGroupList;

	const find = carGroupList.filter(el => {
		if (el.dcCode === dcCode) {
			return el.outGroupCd;
		}
	});

	return find;
};

/**
 * Zone 코드로 Zone 이름 찾기
 * @param {string} dcCode 물류센터
 * @param {string} baseCode Zone 코드
 * @returns {MenuType} Zone 이름
 */
export const getFindGroup = (dcCode: string, baseCode: string) => {
	const getGroupNm = store.getState().msCarGroup.carGroupList.filter(el => {
		return (
			el.dcCode?.toLocaleLowerCase() === dcCode?.toLocaleLowerCase() &&
			el.outGroupCd?.toLocaleLowerCase() === baseCode?.toLocaleLowerCase()
		);
	});
	return getGroupNm[0];
};
