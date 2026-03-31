/*
 ############################################################################
 # FiledataField	: MainTabs.tsx
 # Description		: 메인 탭
 # Author			: Canal Frame
 # Since			: 23.10.02
 ############################################################################
*/
// lib
import { Button } from 'antd';
import { MouseEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
// utils
import { useMoveTab } from '@/hooks/useMoveTab';
import { useAppDispatch, useAppSelector } from '@/store/core/coreHook';
import { MenuType, setSelectedMenu, setSelectedRootMenuId } from '@/store/core/menuStore';
import { homeTab, setCachedTabs, setInitHomeTabs, setTabs, setUpdateTabs, TabType } from '@/store/core/tabStore';
import commUtil from '@/util/commUtil';
import { showConfirm } from '@/util/MessageUtil';
// component
import Tab from '@/assets/styled/Tab/Tab';
import CustomTooltip from '@/components/common/custom/CustomTooltip';
import DragDrop from '@/components/common/DragDrop';
import Icon from '@/components/common/Icon';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';
import { useKeydown } from '@/hooks/useKeydown';
import { removeAllPageLayoutConfig, removePageLayoutConfig } from '@/store/core/layoutStore';
import { useAliveController } from 'react-activation';

// hook
import { useThrottle } from '@/hooks/useThrottle';

const MainTabs = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const dispatch = useAppDispatch();
	const { moveTab } = useMoveTab();

	const location = useLocation();
	const tabs = useAppSelector(state => state.tab.tabs);
	const menuList = useAppSelector(state => state.menu.menuList);

	// KeepAlive 캐싱 제거
	const { drop, clear } = useAliveController();

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 메뉴 설정
	 * @param {string} menuUrl 메뉴 URL
	 * @returns {void}
	 */
	const setMenuTab = (menuUrl: string): void => {
		const getAccessToken = localStorage.getItem('accessToken');

		// 권한 있는 경우 실행
		if (!commUtil.isEmpty(getAccessToken)) {
			if (commUtil.isEmpty(menuUrl)) {
				moveTab(homeTab);
				return;
			} else if (menuUrl === '/home') {
				dispatch(setUpdateTabs(homeTab));
				dispatch(setSelectedMenu(homeTab));
			}

			const findMenu = menuList.find(item => item.progUrl === menuUrl);
			const currentUUID = location.state?.uuid
				? location.state?.uuid
				: tabs?.find(el => el.progUrl === menuUrl)?.menuUUID;

			if (findMenu != undefined) {
				const menuItem = {
					progCd: findMenu.progCd,
					progNm: findMenu.progNm,
					progUrl: findMenu.progUrl,
					progNo: findMenu.progNo,

					menuId: findMenu.menuId,
					menuNm: findMenu.menuNm,
					menuUUID: currentUUID,
					menuUrl: findMenu.menuUrl,
					upperMenuId: findMenu.upperMenuId,
					current: true,
					isDragDisabled: false,
				};

				// 신규 탭 추가
				const isExistTab = tabs.find(el => el.menuUUID === currentUUID);
				if (isExistTab === undefined) {
					dispatch(setTabs([...tabs, menuItem]));
					dispatch(setCachedTabs([...tabs, menuItem]));
				}

				// 현재 메뉴
				dispatch(setUpdateTabs(menuItem));
				dispatch(setSelectedMenu(menuItem));
			}
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		setMenuTab(location.pathname);
	}, [location, menuList]);

	return (
		<Tab>
			{/* 탭 목록 */}
			<DragDropTabs tabs={tabs} drop={(name: string) => drop(name)} />
			{/* 탭 버튼 */}
			<TabButtonList tabs={tabs} location={location} clear={() => clear()} />
		</Tab>
	);
};

export default MainTabs;

const DragDropTabs = ({ tabs, drop }: any) => {
	const dispatch = useAppDispatch();
	const { moveTab } = useMoveTab();

	/**
	 * Tab Drag & Drop 이벤트 함수
	 * @param {object} result 드래그 엔드 이벤트 결과 객체
	 * @returns {void}
	 */
	const onDragEnd = (result: any) => {
		// Home 이동 불가
		if (result.source.index === 0 || result.destination.index === 0 || !result.destination) {
			return;
		}
		// Tab 변경 배열
		const arr = [...tabs];
		const removedItem = arr.splice(result.source.index, 1)[0];
		arr.splice(result.destination.index, 0, removedItem);

		dispatch(setTabs([...arr]));
		dispatch(setCachedTabs([...arr]));
	};

	/**
	 * 탭 이동
	 * @param {object} tab 이동할 탭 정보
	 * @returns {void}
	 */
	const onClickMoveTab = (tab: any) => {
		moveTab(tab);
		if (tab.menuUUID === 'HOME') {
			// HOME 버튼 클릭시 LNB 메뉴 초기화
			dispatch(setSelectedRootMenuId());
			// dispatch(hideSidebarVisible());
		}
	};

	/**
	 * 활성화 탭으로 scroll 이동
	 */
	const moveScroll2ActiveTab = () => {
		// Drag & Drop Element
		const tabScrollEl: HTMLElement = document.querySelector("[data-rbd-droppable-id='tab-droppable']");

		// 활성화된 Tab Element
		const activeTabEl: HTMLElement = tabScrollEl.querySelector(
			'[data-rbd-droppable-id="tab-droppable"] a.on',
		)?.parentElement;

		// 활성화된 Tab의 left offset
		const offsetLeft = activeTabEl?.offsetLeft - (tabScrollEl?.offsetWidth - activeTabEl?.offsetWidth) / 2;

		// Drag & Drop 영역에서 활성화된 탭 위치로 부드럽게 scroll 이동
		tabScrollEl.scroll({
			left: offsetLeft,
			behavior: 'smooth',
		});
	};

	/**
	 * Tabs 상태 변경 감지
	 */
	useEffect(() => {
		// 활성화된 탭으로 scroll 이동
		moveScroll2ActiveTab();
	}, [tabs]);

	/**
	 * 탭 삭제
	 * @param {MouseEvent} event mouse event
	 * @param {*} remove 삭제 대상 탭
	 * @returns {void}
	 */
	const onClickRemoveTab = (event: MouseEvent, remove: any): void => {
		event.stopPropagation();
		const removeIndex = tabs.findIndex((tab: TabType) => tab.menuUUID === remove.menuUUID);
		const removeItems = tabs.filter((tab: TabType) => tab.menuUUID !== remove.menuUUID);

		// 탭 변경
		dispatch(setTabs(removeItems));
		dispatch(setCachedTabs(removeItems));

		drop(remove.menuUUID);

		dispatch(removePageLayoutConfig(remove.progUrl));
		// clear();

		if (tabs[removeIndex].current) {
			// 1. 삭제할 탭이 현재 탭인 경우
			if (removeIndex === tabs.length - 1) {
				// 1-1. 현재 탭이 마지막 탭인 경우
				const lastTab = tabs[removeIndex - 1];
				moveTab(lastTab);
			} else {
				// 1-2. 현재 탭이 마지막 탭이 아닌 경우
				const currentTab = tabs[removeIndex + 1];
				moveTab(currentTab);
			}
		}
		// dispatch(setTabs(removeItems));
		// dispatch(setCachedTabs(removeItems));
	};

	return (
		<DragDrop
			droppableId="tab-droppable"
			items={tabs}
			itemKey="menuUUID"
			isDragDisabled="isDragDisabled"
			onDragEnd={onDragEnd}
			direction="horizontal"
		>
			{/* direction="horizontal" */}
			{tabs.map((tab: TabType) => {
				if (tab.menuUUID === 'HOME') {
					return (
						<CustomTooltip key={tab.menuUUID} placement="bottomLeft" title={'홈으로'}>
							<a
								key={tab.menuUUID}
								className={tab.current ? 'tab_home on' : 'tab_home'}
								onClick={() => {
									onClickMoveTab(tab);
								}}
							>
								<IcoSvg data={icoSvgData.icoHomeLine} />
							</a>
						</CustomTooltip>
					);
				} else {
					return (
						<a
							key={tab.menuUUID}
							className={tab.current ? 'on' : ''}
							onClick={() => {
								onClickMoveTab(tab);
							}}
						>
							{tab.progNm}
							<Button
								//label={'닫기'}
								icon={<IcoSvg data={icoSvgData.icoClose} />}
								onClick={(event: MouseEvent) => onClickRemoveTab(event, tab)}
							/>
						</a>
					);
				}
			})}
		</DragDrop>
	);
};

/**
 * 탭 버튼 리스트 컴퍼넌트
 * @param {any} param0 탭 버튼 리스트 컴포넌트 Props
 * @param {any} param0.tabs 탭 리스트
 * @param {any} param0.location 현재 location 정보
 * @returns {object} 탭 버튼 목록 컴포넌트
 */
const TabButtonList = ({ tabs, location, clear }: any) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { moveTab } = useMoveTab();
	const [toStart, setToStart] = useState(true);
	const throttle = useThrottle();

	/**
	 * 현재 활성화 된 탭 인덱스
	 */
	const currentTabIndex = tabs.findIndex((tab: TabType) => tab.current);

	const onClickCloseAll = () => {
		if (tabs.length > 1) {
			showConfirm('', t('msg.closeAllTab'), () => {
				dispatch(setInitHomeTabs());
				moveTab(homeTab);
				dispatch(removeAllPageLayoutConfig());
				setTimeout(() => {
					clear();
				}, 500);
			});
		}
	};

	const onClickRefreshTab = () => {
		const currentIndex = tabs.findIndex((tab: TabType) => tab.menuUUID === location.state.uuid);
		// drop(tabs[currentIndex].menuUUID);

		//HOME 화면에서 리플레시 적용시 HOME 아이콘 사라지는 현상 버그 수정 (12/19)
		const uuid = location.state.uuid === 'HOME' ? 'HOME' : uuidv4();
		const refreshTab = { ...tabs[currentIndex], menuUUID: uuid };

		const refreshTabs = tabs.map((tab: MenuType, index: number) => {
			if (index === currentIndex) {
				return refreshTab;
			}
			return tab;
		});
		// TO-DO 새로고침!! (추가?삭제?이동?)
		dispatch(setTabs(refreshTabs));
		dispatch(setCachedTabs(refreshTabs));
		moveTab(refreshTab);
	};

	const moveScroll = () => {
		const tabScrollEl: HTMLElement = document.querySelector("[data-rbd-droppable-id='tab-droppable']");

		if (!tabScrollEl) return;

		const currentScrollLeft = tabScrollEl.scrollLeft;
		const maxScrollLeft = tabScrollEl.scrollWidth - tabScrollEl.clientWidth;

		// 현재 위치에 따라 이동 방향 결정
		let targetScrollLeft: number;

		if (currentScrollLeft === 0) {
			// 맨 처음에 있으면 맨 끝으로
			targetScrollLeft = maxScrollLeft;
			setToStart(false);
		} else if (currentScrollLeft >= maxScrollLeft - 5) {
			// 맨 끝에 있으면 맨 처음으로 (5px 여유)
			targetScrollLeft = 0;
			setToStart(true);
		} else {
			// 맨 처음도, 맨 끝도 아니면 toStart 상태에 따라 이동( toStart의 초기값은 true)
			targetScrollLeft = toStart ? 0 : maxScrollLeft;
			setToStart(prev => !prev);
		}

		tabScrollEl.scroll({
			left: targetScrollLeft,
			behavior: 'smooth',
		});
	};

	/**
	 * TAB 이전/다음 이동
	 * @param {string} to 이동 방향
	 */
	const moveTabAction = throttle((to: string) => {
		if (to === 'start') {
			if (currentTabIndex > 0) {
				moveTab(tabs[currentTabIndex - 1]);
			}
		} else {
			if (currentTabIndex < tabs.length - 1) {
				moveTab(tabs[currentTabIndex + 1]);
			}
		}
	}, 700);

	/**
	 * Alt + PageDown : 다음 탭으로 이동
	 */
	useKeydown({ key: 'PageDown', altKey: true }, () => {
		if (currentTabIndex < tabs.length - 1) {
			moveTab(tabs[currentTabIndex + 1]);
		}
	});

	/**
	 * Alt + PageUp : 이전 탭으로 이동
	 */
	useKeydown({ key: 'PageUp', altKey: true }, () => {
		if (currentTabIndex > 0) {
			moveTab(tabs[currentTabIndex - 1]);
		}
	});

	return (
		<div className="tab-icon-wrap">
			<CustomTooltip placement="bottomLeft" title={'SCROLL이동'}>
				<Button type="link" size="small" className="scroll-icon" onClick={() => moveScroll()}>
					<Icon icon="icon-h_scroll3" />
				</Button>
			</CustomTooltip>

			<CustomTooltip placement="bottomLeft" title={'TAB이동'}>
				<Button type="link" size="small" className="left-icon" onClick={() => moveTabAction('start')}>
					<Icon icon="icon-arrow-left-20" />
				</Button>
			</CustomTooltip>

			<CustomTooltip placement="bottomLeft" title={'TAB이동'}>
				<Button type="link" size="small" className="right-icon" onClick={() => moveTabAction('end')}>
					<Icon icon="icon-arrow-right-20" />
				</Button>
			</CustomTooltip>

			{/* <Button type="link" size="small" className="refresh-icon">
					<Icon icon="icon-ellipsis_verti-20" />
				</Button> */}

			{/* <Button type="link" size="small" className="refresh-icon">
					<Icon icon="icon-tab-refresh-24-px" onClick={onClickRefreshTab} />
				</Button> */}
			<CustomTooltip placement="bottomLeft" title={'전체 탭 닫기'}>
				<Button type="link" size="small" className="delete-icon" onClick={onClickCloseAll}>
					<Icon icon="icon-tab-delete-20" />
				</Button>
			</CustomTooltip>
		</div>
	);
};
