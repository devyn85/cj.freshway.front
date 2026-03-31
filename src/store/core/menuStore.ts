import { apiGetMenuRoleList } from '@/api/cm/apiCmMain';
import { apiGetMyFavoriteMenuList } from '@/api/cm/apiCmMenu';
import store from '@/store/core/coreStore';
import commUtil from '@/util/commUtil';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { List } from 'reselect/es/types';

export interface MenuType {
	progCd?: string;
	progNm?: string;
	progUrl?: string;
	progLvl?: string;
	progNo?: string;

	menuId: string;
	menuNm: string;
	menuUrl: string;
	upperMenuId: string | null;
	menuIcon?: string;
	sortOrder?: string;
	menuYn?: string;
	useYn?: string;
	searchYn?: string;
	newYn?: string;
	deleteYn?: string;
	saveYn?: string;
	printYn?: string;
	excelYn?: string;
	btn1Yn?: string;
	btn2Yn?: string;
	btn3Yn?: string;
	btn4Yn?: string;
	btn5Yn?: string;
	btn6Yn?: string;
	btn7Yn?: string;
	btn8Yn?: string;
	btn9Yn?: string;
	btn10Yn?: string;

	btn1Nm?: string;
	btn2Nm?: string;
	btn3Nm?: string;
	btn4Nm?: string;
	btn5Nm?: string;
	btn6Nm?: string;
	btn7Nm?: string;
	btn8Nm?: string;
	btn9Nm?: string;
	btn10Nm?: string;
	favoriteYn?: string;
}

const menuList: MenuType[] = [];
const myMenuList: MenuType[] = [];
const selectedMenu: MenuType = null;
const selectedRootMenuId: string = null;
const showBookmarkMenu = false;

export const menuStore = createSlice({
	name: 'menu',
	initialState: {
		menuList,
		myMenuList,
		selectedRootMenuId,
		selectedMenu,
		showBookmarkMenu,
		initialized: false,
		noticeCnt: 0,
	},
	reducers: {
		setMenu(state, action: PayloadAction<MenuType[]>) {
			const menuList = action.payload;
			setMenuIcon(menuList);
			state.menuList = menuList;
		},
		setMyMenuList(state, action: PayloadAction<MenuType[]>) {
			state.myMenuList = action.payload;
		},
		setSelectedMenu(state, action: PayloadAction<MenuType>) {
			state.selectedMenu = action.payload;
		},
		setSelectedRootMenuId(state, action: PayloadAction<string>) {
			state.selectedRootMenuId = action.payload;
		},
		setShowBookmarkMenu(state, action: PayloadAction<boolean>) {
			state.showBookmarkMenu = action.payload;
		},
		setInitialized(state, action: PayloadAction<boolean>) {
			state.initialized = action.payload;
		},
		setNoticeCnt(state, action: PayloadAction<number>) {
			state.noticeCnt = action.payload;
		},
		setInitMenuStore(state) {
			state.menuList = [...menuStore.getInitialState().menuList];
			state.myMenuList = [...menuStore.getInitialState().myMenuList];
			state.selectedRootMenuId = menuStore.getInitialState().selectedRootMenuId;
			state.selectedMenu = menuStore.getInitialState().selectedMenu;
			state.showBookmarkMenu = menuStore.getInitialState().showBookmarkMenu;
			state.initialized = menuStore.getInitialState().initialized;
			state.noticeCnt = menuStore.getInitialState().noticeCnt;
		},
	},
});
export const {
	setMenu,
	setMyMenuList,
	setSelectedMenu,
	setSelectedRootMenuId,
	setInitMenuStore,
	setShowBookmarkMenu,
	setInitialized,
	setNoticeCnt,
} = menuStore.actions;
export default menuStore.reducer;

export const getUpperMenuId = (menuList: List, progNo: string) => {
	let upperMenuId = '';
	menuList.map(menu => {
		if (menu.progNo == progNo) {
			upperMenuId = menu.progNo?.slice(0, -2);
		}
	});
	return upperMenuId;
};
export const getMenuObj = (menuList: List, progCd: string): MenuType | null => {
	menuList.map((item: MenuType) => {
		if (item.progCd.toLocaleLowerCase() == progCd.toLocaleLowerCase()) {
			return { ...item };
		}
	});
	return null;
};

/**
 * 현재 URL로 메뉴 찾기
 * @param {string} progUrl 현재 URL
 * @returns {MenuType} 현재 메뉴
 */
export const getFindMenu = (progUrl: string) => {
	const getMenu = store.getState().menu.menuList.filter(el => {
		return el.progUrl?.toLocaleLowerCase() === progUrl?.toLocaleLowerCase();
	});
	return getMenu[0];
};

/**
 * "내부순번" 값으로 메뉴 찾기
 * @param {string} progNo 내부순번
 * @returns {MenuType} 메뉴
 */
export const getFindMenuByProgNo = (progNo: string) => {
	const getMenu = store.getState().menu.menuList.filter(el => {
		return el.progNo === progNo;
	});
	return getMenu[0];
};

/**
 * 프로그램코드로 메뉴 찾기
 * @param {string} progCd 프로그램코드
 * @returns {MenuType} 메뉴
 */
export const getFindMenuByProgCd = (progCd: string) => {
	const getMenu = store.getState().menu.menuList.filter(el => {
		return el.progCd?.toLocaleLowerCase() === progCd?.toLocaleLowerCase();
	});
	return getMenu[0];
};

/**
 * 하위 메뉴 리스트
 * @param {List} menuList 메뉴 리스트
 * @param {string | null} upperProgNo 상위 프로그램
 * @returns {List} 필터링 된 메뉴 리스트
 */
export const getChildMenu = (menuList: List, upperProgNo: string | null) => {
	if (upperProgNo) {
		return menuList.filter(menu => menu.progNo?.slice(0, -2) == upperProgNo && menu.menuYn == '1');
	} else {
		return menuList.filter(menu => menu.topmenuYn == '1' && menu.progLvl == '2' && menu.menuYn == '1');
	}
};

/**
 * 즐겨찾기 트리 구조 추출
 * @param {List} menuList - 즐겨찾기 전체 리스트
 * @returns {Array} 폴더/메뉴 트리 [{ folder, childMenus, childFolders }]
 */
export const getBookmarkTree = (menuList: List) => {
	// menuSeq 기준 정렬 함수
	const sortBySeq = (arr: MenuType[]) => arr.slice().sort((a, b) => Number(a.menuSeq) - Number(b.menuSeq));

	// 1. 루트에 속한 메뉴(M)와 폴더(F) 추출 및 정렬
	const rootItems = sortBySeq(menuList.filter(menu => !menu.uprFolderId));

	// 2. 폴더별 하위 트리 구성
	const getFolderTree = (folder: MenuType) => {
		const childMenus = sortBySeq(menuList.filter(menu => menu.menuType === 'M' && menu.uprFolderId === folder.progCd));
		const childFolders = sortBySeq(
			menuList.filter(menu => menu.menuType === 'F' && menu.uprFolderId === folder.progCd),
		);
		return {
			folder,
			childMenus,
			childFolders: childFolders.map(subFolder => getFolderTree(subFolder)),
		};
	};

	// 3. rootItems를 menuSeq 순서대로 반환 (폴더는 트리 구조 포함)
	return rootItems.map(item => {
		if (item.menuType === 'F') {
			return getFolderTree(item);
		}
		return item;
	});
};

export const getMenuId = (str: string) => {
	if (!commUtil.isEmpty(str) && str.indexOf('?') > -1 && str.indexOf('/') > -1) {
		const a = str.split('?')[0].split('/');
		return a[a.length - 1];
	}
	return '';
};

export const setMenuIcon = (menuList: MenuType[]): void => {
	menuList.map(menu => {
		menu.menuIcon = MENU_ICON[menu.menuId] || DEFAULT_MENU_ICON;
	});
};

const DEFAULT_MENU_ICON = 'icon-monitor';

const MENU_ICON: { [key: string]: string } = {
	FO_MGT_STD_01: 'icon-code', // 공통코드관리
	FO_MGT_STD_17: 'icon-code-book', // 공통코드 다국어관리
	FO_MGT_STD_02: 'icon-list-check', // 메뉴관리
	FO_MGT_STD_03: 'icon-list', // 메뉴 다국어관리
	FO_MGT_STD_04: 'icon-options', // 권한관리
	FO_MGT_STD_05: 'icon-carousel', // 권한별 메뉴관리
	FO_MGT_STD_06: 'icon-house-check', // 권한별 사용자관리
	FO_MGT_STD_07: 'icon-user', // 사용자관리
	FO_MGT_STD_08: 'icon-note', // 배치 수행 이력
	FO_MGT_STD_10: 'icon-shield', // IP허용 예외관리
	FO_MGT_STD_13: 'icon-monitor', // 시스템 예외 이력
};

/**
 * @function fetchMenuList 메뉴 리스트 조회
 * @returns {Array} menu 목록
 */
export async function fetchMenuList() {
	const response = await apiGetMenuRoleList().then(res => res.data);
	store.dispatch(setMenu(response));
	return response;
}

/**
 * @function fetchMyMenuList 즐겨찾기 메뉴 리스트 조회
 * @returns {Array} myMenuList 목록
 */
export async function fetchMyMenuList() {
	// const response = await apiGetCmFavoriteMenuList().then(res => res.data);
	const params = {};
	const response = await apiGetMyFavoriteMenuList(params).then(res => res.data);

	store.dispatch(setMyMenuList(response));
	return response;
}
