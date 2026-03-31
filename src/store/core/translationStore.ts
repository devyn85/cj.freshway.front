import { apiGetTranslationList } from '@/api/cm/apiCmPublic';
import store from '@/store/core/coreStore';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const translationList: any[] = [];

export const translationStore = createSlice({
	name: 'translation',
	initialState: {
		translationList,
	},
	reducers: {
		setTranslation(state: any, action: PayloadAction<any[]>) {
			state.translationList = action.payload;
		},
		setInitTranslationStore(state: any) {
			state.translationList = [...translationStore.getInitialState().translationList];
		},
	},
});
export const { setTranslation, setInitTranslationStore } = translationStore.actions;
export default translationStore.reducer;

/**
 * 다국어 목록 가져오기
 * @returns {Array} 다국어 목록
 */
export const getTranslationList = () => {
	return store.getState().translation.translationList;
};

/**
 * @function fetchTranslationList 다국어 리스트 조회
 * @param {object} params 조회 조건
 * @returns {Array} 다국어 목록
 */
export async function fetchTranslationList(params: any) {
	const response = await apiGetTranslationList(params).then(res => res?.data);
	store.dispatch(setTranslation(response));
	return response;
}
