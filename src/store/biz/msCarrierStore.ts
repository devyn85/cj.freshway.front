import { apiGetMasterList } from '@/api/ms/apiMsCarrier';
import store from '@/store/core/coreStore';
import { createSlice } from '@reduxjs/toolkit';

export const msCarrierStore = createSlice({
	name: 'msCarrier',
	initialState: {
		carrierList: [],
	},
	reducers: {
		setMsCarrierList(state, action: any) {
			state.carrierList = action.payload;
		},
	},
});

export const { setMsCarrierList } = msCarrierStore.actions;
export default msCarrierStore.reducer;

/**
 * 운송사 리스트 조회
 * @returns {Array} 운송사 리스트
 */
export async function fetchMsCarrier() {
	const carrierList = store.getState().msCarrier.carrierList;

	if (carrierList.length > 0) {
		return null; // 이미 운송사 리스트가 존재하는 경우, 재조회하지 않음
	}

	const params = {};
	const response = await apiGetMasterList(params).then(res => res.data);
	store.dispatch(setMsCarrierList(response));

	return response;
}

/**
 * 운송사 리스트
 * @param {string} carrierType 운송사구분
 * @returns {any[]} 운송사 목록
 */
export const getMsCarrierList = (carrierType: string): any[] => {
	const carrierList = store.getState().msCarrier.carrierList;

	const find = carrierList.filter(el => {
		if (el.carrierType === carrierType) {
			return el.carrierKey;
		}
	});

	return find;
};

/**
 * Carrier 코드로 Carrier 이름 찾기
 * @param {string} carrierType 운송사구분
 * @param {string} carrierKey 운송사키
 * @returns {MenuType} Carrier 이름
 */
export const getFindCarrier = (carrierType: string, carrierKey: string) => {
	const getCarrierNm = store.getState().msCarrier.carrierList.filter(el => {
		return (
			el.carrierType?.toLocaleLowerCase() === carrierType?.toLocaleLowerCase() &&
			el.carrierKey?.toLocaleLowerCase() === carrierKey?.toLocaleLowerCase()
		);
	});
	return getCarrierNm[0];
};
