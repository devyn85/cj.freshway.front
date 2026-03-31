import { apiGetPlantList } from '@/api/ms/apiMsPickBatchGroup';
import store from '@/store/core/coreStore';
import { createSlice } from '@reduxjs/toolkit';

export const msPlantStore = createSlice({
	name: 'msPlant',
	initialState: {
		plantList: [],
	},
	reducers: {
		setMsPlantList(state, action: any) {
			state.plantList = action.payload;
		},
	},
});

export const { setMsPlantList } = msPlantStore.actions;
export default msPlantStore.reducer;

/**
 * 플랜트 리스트 조회
 * @returns {Array} 플랜트 리스트
 */
export async function fetchMsPlant() {
	const plantList = store.getState().msPlant.plantList;

	if (plantList.length > 0) {
		return null; // 이미 피킹존 리스트가 존재하는 경우, 재조회하지 않음
	}
	const params = {};
	const response = await apiGetPlantList(params).then(res => res.data);
	store.dispatch(setMsPlantList(response));

	return response;
}

/**
 * 플랜트 리스트
 * @param {string} dcCode 플랜트코드
 * @returns {any[]} 플랜트 목록
 */
export const getMsPlantList = (dcCode: string): any[] => {
	const plantList = store.getState().msPlant.plantList;

	// const find = plantList.filter(el => {
	// 	if (el.dcCode === dcCode) {
	// 		return el.baseCode;
	// 	}
	// });

	return plantList;
};

/**
 * 플랜트 코드로 플랜트 이름 찾기
 * @param {string} dcCode 플랜트
 * @param {string} baseCode 플랜트 코드
 * @returns {MenuType} 플랜트 이름
 */
export const getFindPlant = (dcCode: string, baseCode: string) => {
	const getPlantNm = store.getState().msPlant.plantList.filter(el => {
		return (
			el.dcCode?.toLocaleLowerCase() === dcCode?.toLocaleLowerCase() &&
			el.baseCode?.toLocaleLowerCase() === baseCode?.toLocaleLowerCase()
		);
	});
	return getPlantNm[0];
};
