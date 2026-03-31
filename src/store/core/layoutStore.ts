import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/** 페이지별 레이아웃 설정 인터페이스 */
export interface PageLayoutConfig {
	/** 모든 레이아웃 표출 여부 */
	isAllLayoutVisible: boolean;
	/** 사이드바 표출 여부 */
	isSidebarVisible: boolean;
	/** 조회박스 표출 여부 */
	isSearchFormVisible: boolean;
	/** 그리드 상단 버튼 표출 여부 */
	isGridTopBtnVisible: boolean;
}

export interface LayoutState {
	/** 페이지별 레이아웃 설정 */
	pageLayoutConfig: Record<string, PageLayoutConfig>;
	/** 현재 활성 페이지 경로 */
	currentPageLayout: string;
}

const defaultPageLayout: PageLayoutConfig = {
	isAllLayoutVisible: true,
	isSidebarVisible: true,
	isSearchFormVisible: true,
	isGridTopBtnVisible: true,
};

const initialState: LayoutState = {
	pageLayoutConfig: {},
	currentPageLayout: '',
};

export const layoutStore = createSlice({
	name: 'layout',
	initialState,
	reducers: {
		/**
		 * 현재 페이지 경로 설정
		 * @param state
		 * @param action
		 */
		setCurrentPageLayout(state, action: PayloadAction<string>) {
			state.currentPageLayout = action.payload;

			// 페이지별 레이아웃이 없으면 기본값으로 초기화
			if (!state.pageLayoutConfig[action.payload]) {
				state.pageLayoutConfig[action.payload] = { ...defaultPageLayout };
			}
		},

		/**
		 * 현재 페이지의 사이드바 토글
		 * @param state
		 */
		toggleSidebarVisible(state) {
			const currentPage = state.currentPageLayout;
			if (state.pageLayoutConfig[currentPage]) {
				state.pageLayoutConfig[currentPage].isSidebarVisible = !state.pageLayoutConfig[currentPage].isSidebarVisible;
			}
		},

		/**
		 * 현재 페이지의 사이드바 표출
		 * @param state
		 */
		showSidebarVisible(state) {
			const currentPage = state.currentPageLayout;
			if (state.pageLayoutConfig[currentPage]) {
				state.pageLayoutConfig[currentPage].isSidebarVisible = true;
			}
		},

		/**
		 * 현재 페이지의 사이드바 숨김
		 * @param state
		 */
		hideSidebarVisible(state) {
			const currentPage = state.currentPageLayout;
			if (state.pageLayoutConfig[currentPage]) {
				state.pageLayoutConfig[currentPage].isSidebarVisible = false;
			}
		},

		/**
		 * 현재 페이지의 사이드바 표출 설정
		 * @param state
		 * @param action
		 */
		setSidebarVisible(state, action: PayloadAction<boolean>) {
			const currentPage = state.currentPageLayout;
			if (state.pageLayoutConfig[currentPage]) {
				state.pageLayoutConfig[currentPage].isSidebarVisible = action.payload;
			}
		},

		/**
		 * 현재 페이지의 조회박스 토글
		 * @param state
		 */
		toggleSearchFormVisible(state) {
			const currentPage = state.currentPageLayout;
			if (state.pageLayoutConfig[currentPage]) {
				state.pageLayoutConfig[currentPage].isSearchFormVisible =
					!state.pageLayoutConfig[currentPage].isSearchFormVisible;
			}
		},

		/**
		 * 현재 페이지의 조회박스 표출
		 * @param state
		 */
		showSearchFormVisible(state) {
			const currentPage = state.currentPageLayout;
			if (state.pageLayoutConfig[currentPage]) {
				state.pageLayoutConfig[currentPage].isSearchFormVisible = true;
			}
		},

		/**
		 * 현재 페이지의 조회박스 숨김
		 * @param state
		 */
		hideSearchFormVisible(state) {
			const currentPage = state.currentPageLayout;
			if (state.pageLayoutConfig[currentPage]) {
				state.pageLayoutConfig[currentPage].isSearchFormVisible = false;
			}
		},

		/**
		 * 현재 페이지의 조회박스 표출 설정
		 * @param state
		 * @param action
		 */
		setSearchFormVisible(state, action: PayloadAction<boolean>) {
			const currentPage = state.currentPageLayout;
			if (state.pageLayoutConfig[currentPage]) {
				state.pageLayoutConfig[currentPage].isSearchFormVisible = action.payload;
			}
		},

		/**
		 * 현재 페이지의 그리드 상단 버튼 토글
		 * @param state
		 */
		toggleGridTopBtnVisible(state) {
			const currentPage = state.currentPageLayout;
			if (state.pageLayoutConfig[currentPage]) {
				state.pageLayoutConfig[currentPage].isGridTopBtnVisible =
					!state.pageLayoutConfig[currentPage].isGridTopBtnVisible;
			}
		},

		/**
		 * 현재 페이지의 그리드 상단 버튼 표출
		 * @param state
		 */
		showGridTopBtnVisible(state) {
			const currentPage = state.currentPageLayout;
			if (state.pageLayoutConfig[currentPage]) {
				state.pageLayoutConfig[currentPage].isGridTopBtnVisible = true;
			}
		},

		/**
		 * 현재 페이지의 그리드 상단 버튼 숨김
		 * @param state
		 */
		hideGridTopBtnVisible(state) {
			const currentPage = state.currentPageLayout;
			if (state.pageLayoutConfig[currentPage]) {
				state.pageLayoutConfig[currentPage].isGridTopBtnVisible = false;
			}
		},

		/**
		 * 현재 페이지의 그리드 상단 버튼 표출 설정
		 * @param state
		 * @param action
		 */
		setGridTopBtnVisible(state, action: PayloadAction<boolean>) {
			const currentPage = state.currentPageLayout;
			if (state.pageLayoutConfig[currentPage]) {
				state.pageLayoutConfig[currentPage].isGridTopBtnVisible = action.payload;
			}
		},

		/**
		 * 현재 페이지 확장 뷰 (모든 레이아웃 숨김)
		 * @param state
		 */
		expandedView(state) {
			const currentPage = state.currentPageLayout;
			if (state.pageLayoutConfig[currentPage]) {
				state.pageLayoutConfig[currentPage].isSidebarVisible = false;
				state.pageLayoutConfig[currentPage].isSearchFormVisible = false;
				state.pageLayoutConfig[currentPage].isGridTopBtnVisible = false;
				state.pageLayoutConfig[currentPage].isAllLayoutVisible = false;
			}
		},

		/**
		 * 현재 페이지 축소 뷰 (모든 레이아웃 표출)
		 * @param state
		 */
		collapsedView(state) {
			const currentPage = state.currentPageLayout;
			if (state.pageLayoutConfig[currentPage]) {
				state.pageLayoutConfig[currentPage].isSidebarVisible = true;
				state.pageLayoutConfig[currentPage].isSearchFormVisible = true;
				state.pageLayoutConfig[currentPage].isGridTopBtnVisible = true;
				state.pageLayoutConfig[currentPage].isAllLayoutVisible = true;
			}
		},

		/**
		 * 페이지의 확대 & 축소 레이아웃 설정 제거
		 * @param state
		 * @param action
		 */
		removePageLayoutConfig(state, action: PayloadAction<string>) {
			const pagePath = action.payload;
			delete state.pageLayoutConfig[pagePath];
		},

		/**
		 * 모든 페이지 레이아웃 설정 초기화
		 * @param state
		 */
		removeAllPageLayoutConfig(state) {
			state.pageLayoutConfig = {};
		},
	},
});

export const {
	setCurrentPageLayout,
	toggleSidebarVisible,
	showSidebarVisible,
	hideSidebarVisible,
	setSidebarVisible,
	toggleSearchFormVisible,
	showSearchFormVisible,
	hideSearchFormVisible,
	setSearchFormVisible,
	toggleGridTopBtnVisible,
	showGridTopBtnVisible,
	hideGridTopBtnVisible,
	setGridTopBtnVisible,
	expandedView,
	collapsedView,
	removePageLayoutConfig,
	removeAllPageLayoutConfig,
} = layoutStore.actions;

export default layoutStore.reducer;

// 현재 페이지 레이아웃 상태를 가져오는 셀렉터
export const getCurrentPageLayout = (state: any): PageLayoutConfig => {
	const currentPage = state.layout.currentPageLayout;
	return state.layout.pageLayoutConfig[currentPage] || { ...defaultPageLayout };
};
