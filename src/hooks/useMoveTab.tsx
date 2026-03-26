/**
 * 탭 이동에 관련된 함수 모음
 */
import { useMoveMenu } from '@/hooks/useMoveMenu';
import { homeTab } from '@/store/core/tabStore';

/**
 * 탭을 이동하는 Custom Hook
 * @returns {object} moveTab method
 */
export const useMoveTab = () => {
	const { navigateMenu, setSearchParam } = useMoveMenu();
	const location = useLocation();

	/**
	 * 탭 이동 (QueryString 미유지)
	 * @param {any} tab tab 정보
	 */
	const moveTab = (tab: any) => {
		if (tab.menuId === 'HOME') {
			// 홈 강제 이동
			navigateMenu(tab.menuUrl, homeTab.menuUUID, homeTab);
		} else {
			navigateMenu(tab.progUrl, tab.menuUUID);
		}
	};

	/**
	 * 메뉴 탭 이동 (QueryString 유지)
	 * @param {any} tab tab 정보
	 */
	const moveMenuTab = (tab: any) => {
		let url = null;
		if (tab.menuId === 'HOME') {
			// 홈 강제 이동
			url = setSearchParam(location, homeTab.menuUrl);
			navigateMenu(url, homeTab.menuUUID, homeTab);
		} else {
			url = setSearchParam(location, tab.menuUrl);
			navigateMenu(setSearchParam(location, tab.menuUrl), tab.menuUUID);
		}
	};

	return { moveTab, moveMenuTab };
};
