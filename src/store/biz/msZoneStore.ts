import { apiGetZoneList } from '@/api/ms/apiMsBlankLoc';
import store from '@/store/core/coreStore';
import { createSlice } from '@reduxjs/toolkit';

export const msZoneStore = createSlice({
	name: 'msZone',
	initialState: {
		zoneList: [],
	},
	reducers: {
		setMsZoneList(state, action: any) {
			state.zoneList = action.payload;
		},
	},
});

export const { setMsZoneList } = msZoneStore.actions;
export default msZoneStore.reducer;

/**
 * 피킹존 리스트 조회
 * @returns {Array} 피킹존 리스트
 */
export async function fetchMsZone() {
	const zoneList = store.getState().msZone.zoneList;

	if (zoneList.length > 0) {
		return null; // 이미 피킹존 리스트가 존재하는 경우, 재조회하지 않음
	}

	const params = {};
	const response = await apiGetZoneList(params).then(res => res.data);
	store.dispatch(setMsZoneList(response));

	return response;
}

/**
 * 피킹존 리스트
 * @param {string | string[]} dcCode 물류센터 (문자열 또는 배열)
 * @returns {any[]} 피킹존 목록
 */
export const getMsZoneList = (dcCode: any): any[] => {
	const zoneList = store.getState().msZone.zoneList;

	// dcCode가 배열인 경우
	if (Array.isArray(dcCode)) {
		const find = zoneList.filter(el => {
			return dcCode.includes(el.dcCode);
		});
		return find;
	}

	// dcCode가 문자열인 경우
	const find = zoneList.filter(el => {
		if (el.dcCode === dcCode) {
			return el.baseCode;
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
export const getFindZone = (dcCode: string, baseCode: string) => {
	const getZoneNm = store.getState().msZone.zoneList.filter(el => {
		return (
			el.dcCode?.toLocaleLowerCase() === dcCode?.toLocaleLowerCase() &&
			el.baseCode?.toLocaleLowerCase() === baseCode?.toLocaleLowerCase()
		);
	});
	return getZoneNm[0];
};
