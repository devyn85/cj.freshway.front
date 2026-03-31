import store from '@/store/core/coreStore';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuType } from './menuStore';

export interface TabType {
	progCd?: string;
	progNm?: string;
	progUrl?: string;
	progNo?: string;

	menuId: string;
	menuNm: string;
	menuUrl: string;
	menuUUID?: string;
	upperMenuId: string;
	current?: boolean;
	isDragDisabled?: boolean;
}

export const homeTab: TabType & MenuType = {
	menuId: 'HOME',
	menuNm: 'HOME',
	menuUrl: '/home',
	menuUUID: 'HOME',
	upperMenuId: null,
	current: true,
	isDragDisabled: true,
};

const isDeleteTab: string = null;
const tabs: TabType[] = [homeTab];
const cachedTabs: Array<string> = [homeTab.menuUUID];
export const tabStore = createSlice({
	name: 'tab',
	initialState: {
		isDeleteTab,
		tabs,
		cachedTabs,
	},
	reducers: {
		setIsDeleteTab(state, action: PayloadAction<string>) {
			state.isDeleteTab = action.payload;
		},
		setTabs(state, action: PayloadAction<TabType[]>) {
			state.tabs = action.payload;
			// state.cachedTabs = action.payload.map(tab => tab.menuUUID);
		},
		setCachedTabs(state, action: PayloadAction<TabType[]>) {
			// state.tabs = action.payload;
			state.cachedTabs = action.payload.map(tab => tab.menuUUID);
		},
		setUpdateTabs(state, action: PayloadAction<TabType>) {
			const stateTabs = [
				...state.tabs.map(el => {
					if (el.menuUUID === action.payload.menuUUID) {
						el.current = true;
					} else {
						el.current = false;
					}
					return el;
				}),
			];
			state.tabs = [...stateTabs];
		},
		setInitTabStore(state) {
			state.isDeleteTab = tabStore.getInitialState().isDeleteTab;
			state.tabs = [...tabStore.getInitialState().tabs];
			state.cachedTabs = [...tabStore.getInitialState().cachedTabs];
		},
		setInitHomeTabs(state) {
			state.tabs = [...tabStore.getInitialState().tabs];
			state.cachedTabs = [...tabStore.getInitialState().cachedTabs];
		},
	},
});

export const { setIsDeleteTab, setTabs, setCachedTabs, setInitTabStore, setUpdateTabs, setInitHomeTabs } =
	tabStore.actions;
export default tabStore.reducer;

/**
 * filter tab
 * @param {string} location 메뉴 주소
 * @returns {Array} 메뉴 정보
 */
export const getFilterTab = (location: string) => {
	return store.getState().tab.tabs.filter(el => {
		return el.menuUrl === location;
	});
};

/**
 * 메뉴 검색
 * @param {string} menuUrl 메뉴 url
 * @returns {*} menu array
 */
export const getFindTab = (menuUrl: string) => {
	const getMenu = store
		.getState()
		.tab.tabs.find((tab: any) => tab.progUrl?.toLocaleLowerCase() === menuUrl?.toLocaleLowerCase());
	return getMenu;
};
