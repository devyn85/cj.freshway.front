import { apiGetOrganizeList } from '@/api/cm/apiCmDcXOrganizeManager';
import store from '@/store/core/coreStore';
import { createSlice } from '@reduxjs/toolkit';
import { t } from 'i18next';

export const msOrganizeStore = createSlice({
	name: 'msOrganize',
	initialState: {
		OrganizeList: [],
	},
	reducers: {
		setMsOrganizeList(state, action: any) {
			state.OrganizeList = action.payload;
		},
	},
});

export const { setMsOrganizeList } = msOrganizeStore.actions;
export default msOrganizeStore.reducer;

/**
 * 창고 리스트 조회
 * @returns {Array} 창고 리스트
 */
export async function fetchMsOrganize() {
	const OrganizeList = store.getState().msOrganize.OrganizeList;

	if (OrganizeList.length > 0) {
		return null; // 이미 창고 리스트가 존재하는 경우, 재조회하지 않음
	}

	const params = {};
	const response = await apiGetOrganizeList(params).then(res => res.data);
	store.dispatch(setMsOrganizeList(response));

	return response;
}

/**
 * 창고 리스트
 * @param {string} dccode 물류센터
 * @param dccode
 * @returns {any[]} 창고 목록
 */
export const getMsOrganizeList = (dccode: string): any[] => {
	const OrganizeList = store.getState().msOrganize.OrganizeList;

	const find = OrganizeList.filter(el => el.dcCode === dccode);
	//console.log('b->' + JSON.stringify(find));

	return [{ comCd: '', comNm: t('lbl.SELECT') }, ...find];
};

/**
 * Organize 코드로 Organize 이름 찾기
 * @param {string} dccode 물류센터
 * @param {string} comCd Organize 코드
 * @param comCd
 * @param comCd
 * @returns {MenuType} Organize 이름
 */
export const getFindOrganize = (dccode: string, comCd: string) => {
	const getOrganizeNm = store.getState().msOrganize.OrganizeList.filter(el => {
		return (
			el.dccode?.toLocaleLowerCase() === dccode?.toLocaleLowerCase() &&
			el.comCd?.toLocaleLowerCase() === comCd?.toLocaleLowerCase()
		);
	});
	return getOrganizeNm[0];
};
