import { useAppDispatch, useAppSelector } from '@/store/core/coreHook';
import {
	collapsedView,
	expandedView,
	getCurrentPageLayout,
	PageLayoutConfig,
	setCurrentPageLayout,
	toggleGridTopBtnVisible,
	toggleSearchFormVisible,
	toggleSidebarVisible,
} from '@/store/core/layoutStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 페이지별 레이아웃 상태를 관리하는 커스텀 훅, 상태는 store에서 관리하고 있음
 * @returns {object} layout, actions
 */
export const usePageLayoutVisible = () => {
	const location = useLocation();
	const dispatch = useAppDispatch();

	const selectedMenu = useAppSelector(state => state.menu.selectedMenu);

	// 현재 페이지 레이아웃 상태 가져오기
	const currentPageLayout: PageLayoutConfig = useAppSelector(getCurrentPageLayout);

	// 페이지 변경 시 현재 페이지 경로 설정
	useEffect(() => {
		dispatch(setCurrentPageLayout(selectedMenu?.progUrl ?? location.pathname));
	}, [location.pathname, dispatch, selectedMenu?.progUrl]);

	// 액션 함수들
	const actions = {
		toggleSidebar: () => dispatch(toggleSidebarVisible()),
		toggleSearchForm: () => dispatch(toggleSearchFormVisible()),
		toggleGridTopBtn: () => dispatch(toggleGridTopBtnVisible()),
		expandView: () => dispatch(expandedView()),
		collapseView: () => dispatch(collapsedView()),
	};

	return {
		layout: currentPageLayout,
		actions,
		currentPath: location.pathname,
	};
};
