/**
 * 탭 닫기에 관련된 함수 모음
 */
import { useAppDispatch, useAppSelector } from '@/store/core/coreHook';
import { setCachedTabs, setTabs } from '@/store/core/tabStore';
import { useCallback } from 'react';
import { useAliveController } from 'react-activation';
import { useLocation } from 'react-router-dom';

/**
 * 탭을 닫는 Custom Hook
 * @returns {object} closeCurrentTab, closeTab methods
 */
export const useCloseTab = () => {
	const dispatch = useAppDispatch();
	const location = useLocation();
	const { drop } = useAliveController();
	const tabs = useAppSelector(state => state.tab.tabs);

	/**
	 * 특정 탭 닫기
	 * @param {string} menuUUID 닫을 탭의 UUID
	 */
	const closeTab = useCallback(
		(menuUUID: string) => {
			if (!menuUUID) return;

			const removeItems = tabs.filter((tab: any) => tab.menuUUID !== menuUUID);
			dispatch(setTabs(removeItems));
			dispatch(setCachedTabs(removeItems));
			drop(menuUUID); // KeepAlive 캐시 제거
		},
		[tabs, dispatch, drop],
	);

	/**
	 * 현재 활성화된 탭 닫기
	 */
	const closeCurrentTab = useCallback(() => {
		const currentTabUUID = location.state?.uuid;
		if (currentTabUUID) {
			closeTab(currentTabUUID);
		}
	}, [location.state?.uuid, closeTab]);

	return { closeTab, closeCurrentTab };
};

