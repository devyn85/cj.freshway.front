/*
 ############################################################################
 # FiledataField	: MainAside.tsx
 # Description		: 메인 Aside
 # Author			: Canal Frame
 # Since			: 23.10.02
 ############################################################################
*/
// utils
import { useArrowKeyNavigation } from '@/hooks/useArrowKeyNavigation';
import { useMoveMenu } from '@/hooks/useMoveMenu';
import { useMoveTab } from '@/hooks/useMoveTab';
import { useAppDispatch, useAppSelector } from '@/store/core/coreHook';
import * as MenuStore from '@/store/core/menuStore';
import { homeTab, setInitHomeTabs } from '@/store/core/tabStore';
import commUtil from '@/util/commUtil';
import { useEffect, useRef, useState } from 'react';

// component
import Aside from '@/assets/styled/Aside/Aside';
import CustomTooltip from '@/components/common/custom/CustomTooltip';
import Icon from '@/components/common/Icon';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';
import BookmarkMenuShowButton from '@/layout/LNB/BookmarkMenuShowButton';
import { AutoComplete, Button, Input } from 'antd';

const MainAside = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { moveTab } = useMoveTab();
	const dispatch = useAppDispatch(); // store 에 요청 전송
	const menuList = useAppSelector(state => state.menu.menuList); // 전체 메뉴 리스트
	const myMenuList = useAppSelector(state => state.menu.myMenuList); // 즐겨찾기 메뉴 리스트

	const selectedMenu = useAppSelector(state => state.menu.selectedMenu); // 선택된 메뉴
	const selectedRootMenuId = useAppSelector(state => state.menu.selectedRootMenuId); // 선택된 메뉴
	const showBookmarkMenu = useAppSelector(state => state.menu.showBookmarkMenu); // 즐겨찾기 메뉴 노출여부

	const [asideMenus, setAsideMenus] = useState([]);
	const [searchValue, setSearchValue] = useState('');
	const [isShowBookmarkMenu, setIsShowBookmarkMenu] = useState(false);

	// ref
	const asideRef = useRef<HTMLElement>(null);
	const leftMenuRef = useRef<HTMLDivElement>(null);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 메뉴 이동
	 */
	const { moveMenu } = useMoveMenu();
	const onClickMoveMenu = (menu: any, showBookmarkMenuParam?: boolean, event?: any) => {
		if (showBookmarkMenuParam) {
			dispatch(MenuStore.setShowBookmarkMenu(true));
		} else {
			dispatch(MenuStore.setShowBookmarkMenu(false));
		}

		// 새탭 열기 (컨트롤 + 클릭 시)
		if (event?.ctrlKey) {
			window.open(menu.progUrl, '_blank');
		} else {
			moveMenu(menu.progUrl);
		}
	};

	/**
	 * 화살표 키 네비게이션 훅
	 */
	const { resetFocus } = useArrowKeyNavigation({
		focusableItemClassName: 'menu-nav-item',
		searchInputClassName: 'menu-search-input',
		containerRef: asideRef,
		onEscapePress: () => {
			// 검색어 초기화
			setSearchValue('');
		},
	});

	/**
	 * 상위 메뉴 이벤트
	 * @param {string} id 선택된 menu id
	 */
	const onClickMenuEvent = (id: string) => {
		const element = document.getElementById('left_' + id);
		const menuIndex = element.className.indexOf('open');
		if (menuIndex < 0) {
			openClass(id);
		} else {
			closeClass(id);
		}
	};

	/**
	 * 메뉴 열기
	 * @param {*} id 메뉴 아이디
	 */
	const openClass = (id: string) => {
		const element = document.getElementById('left_' + id);
		element.classList.remove('close');
		element.classList.toggle('open');
	};

	/**
	 * 메뉴 닫기
	 * @param {*} id 메뉴 아이디
	 */
	const closeClass = (id: string) => {
		const element = document.getElementById('left_' + id);
		element.classList.remove('open');
		element.classList.toggle('close');
	};

	/**
	 * 홈메뉴 이동
	 */
	const onClickMoveHome = () => {
		// 로고 클릭으로 새로고침 : cachedTabs/openedTabs 초기화
		dispatch(setInitHomeTabs());

		// Home 화면 이동
		moveTab(homeTab);
	};

	/**
	 * 검색 조건에 따른 메뉴 출력 여부
	 * @param {any} menu 메뉴 정보
	 * @returns {boolean} 검색 조건에 따른 하위 메뉴 출력 여부
	 */
	const isFoundSubMenuBySearch = (menu: any) => {
		return menu?.progNm
			?.replaceAll(/\s+/g, '')
			.toLowerCase()
			.includes(searchValue.replaceAll(/\s+/g, '').toLowerCase());
	};

	const handleClickBookmarkMenuShowButton = () => {
		dispatch(MenuStore.setShowBookmarkMenu(true));
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	/**
	 * 메뉴 검색시 전체 메뉴를 대상으로 조회
	 */
	// useEffect(() => {
	// 	if (commUtil.isNotEmpty(searchValue)) {
	// 		setAsideMenus(menuList);
	// 	} else {
	// 		// 메뉴 검색어 없을 경우 기존 대메뉴 기준으로 노출
	// 		if (!selectedRootMenuId) {
	// 			return;
	// 		}
	// 		setAsideMenus(MenuStore.getChildMenu(menuList, selectedRootMenuId));
	// 	}
	// 	// 검색어 변경시 포커스 초기화
	// 	resetFocus();
	// }, [searchValue, resetFocus]);

	/**
	 * 대메뉴 선택시
	 */
	useEffect(() => {
		if (!selectedMenu) {
			return;
		}
		// 상위메뉴(M)의 상위메뉴(L) = 루트메뉴
		if (commUtil.isNotEmpty(selectedMenu.progNo)) {
			const menuId = MenuStore.getUpperMenuId(menuList, selectedMenu.progNo?.slice(0, -2));
			dispatch(MenuStore.setSelectedRootMenuId(menuId));
		}

		setSearchValue(''); // 메뉴 변경 시 검색 초기화
	}, [selectedMenu]);

	useEffect(() => {
		// 헤더 상위 메뉴 클릭시 스크롤 맨 위로 이동
		if (leftMenuRef.current) {
			leftMenuRef.current.scrollTop = 0;
		}

		if (!selectedRootMenuId) {
			return;
		}
		setAsideMenus(MenuStore.getChildMenu(menuList, selectedRootMenuId));
		if (!showBookmarkMenu) {
			setIsShowBookmarkMenu(false); // 상위 메뉴 변경 시 즐겨찾기 메뉴 닫기
		}
		// window.dispatchEvent(new Event('resize')); // LNB 노출시 'resize' 이벤트 강제 발생

		setSearchValue(''); // 메뉴 변경 시 검색 초기화
	}, [selectedRootMenuId]);

	/**
	 * 즐겨찾기 메뉴 토글시 포커스 초기화
	 */
	useEffect(() => {
		resetFocus();
	}, [isShowBookmarkMenu, resetFocus]);

	/**
	 * 검색어 변경시 포커스 초기화
	 */
	useEffect(() => {
		resetFocus();
	}, [searchValue]);

	/**
	 * 즐겨찾기 메뉴 노출여부 변경시
	 */
	useEffect(() => {
		setIsShowBookmarkMenu(showBookmarkMenu);
	}, [showBookmarkMenu]);

	const asideMenusBySearch = searchValue ? menuList : asideMenus;

	// getBookmarkTree로 트리 구조 추출
	const bookmarkRootItems = MenuStore.getBookmarkTree(myMenuList);

	return (
		<Aside className={'on'} ref={asideRef}>
			<div className="menu-area">
				<CustomTooltip placement="bottomLeft" title={'메뉴'}>
					{/* active 클래스로 메뉴 활성화 */}
					<Button
						className="btn-menu"
						icon={<IcoSvg data={icoSvgData.icoMenu} />}
						onClick={() => dispatch(MenuStore.setShowBookmarkMenu(false))}
					/>
				</CustomTooltip>
				<BookmarkMenuShowButton
					isActive={isShowBookmarkMenu}
					onClick={() => dispatch(MenuStore.setShowBookmarkMenu(true))}
				/>

				<AutoComplete
					key={selectedMenu?.progNo || 'default'}
					value={searchValue}
					onChange={setSearchValue}
					popupMatchSelectWidth={100}
				>
					<Input.Search placeholder="메뉴 검색" className="menu-search-input" tabIndex={0} />
				</AutoComplete>
			</div>

			<menu ref={leftMenuRef}>
				{/* <BookMark menu={selectedMenu} user={user} /> */}

				{!isShowBookmarkMenu &&
					asideMenusBySearch.map(menu => {
						// 중메뉴 출력, 페이지에 해당하는 레벨만 출력
						const subMenus = MenuStore.getChildMenu(menuList, menu.progNo)?.filter(
							menu => menu.topmenuYn !== '1' && menu.progLvl === '4',
						);

						/**
						 * 검색 조건에 따른 메뉴 출력 여부
						 * @description 하위 메뉴가 있을 때 상위 메뉴도 같이 출력
						 * @description 검색 조건이 없으면 모든 메뉴 출력
						 */
						const hasSubMenus = searchValue ? subMenus.some(sub => isFoundSubMenuBySearch(sub)) : true;

						if (subMenus.length > 0 && hasSubMenus) {
							return (
								<ul key={`aside_${menu.progCd}`}>
									<>
										<li id={`left_${menu.progCd}`} className="open" onClick={() => onClickMenuEvent(menu.progCd)}>
											<Icon icon="icon-lnb-arrow" />
											{menu.progNm}
										</li>
										<dl>
											{subMenus
												.filter(sub => isFoundSubMenuBySearch(sub))
												.map(sub => {
													return (
														<dd
															key={`aside_${sub.progCd}`}
															className={`menu-nav-item ${sub.progUrl === location.pathname ? 'active' : ''}`}
															onClick={(e: any) => onClickMoveMenu(sub, false, e)}
															tabIndex={0}
														>
															{/* <Icon icon={sub.menuIcon} /> */}
															{sub.progNm}
														</dd>
													);
												})}
										</dl>
									</>
								</ul>
							);
						}
					})}

				{/* 즐겨찾기 메뉴 */}
				{isShowBookmarkMenu && (
					<>
						{bookmarkRootItems.map(item => {
							if (item.menuType === 'M') {
								// 메뉴 바로 출력
								return (
									<dl key={`bookmark_rootmenu_${item.progCd}`}>
										<dd
											className={`menu-nav-item ${item.progUrl === location.pathname ? 'active' : ''}`}
											onClick={(e: any) => onClickMoveMenu(item, true, e)}
											tabIndex={0}
										>
											{/* <Icon icon={item.menuIcon} /> */}
											{item.progNm}
										</dd>
									</dl>
								);
							} else if (item.folder) {
								// 폴더 트리 출력
								const { folder, childMenus, childFolders } = item;
								return (
									<ul key={`bookmark_folder_${folder.progCd}`}>
										<li id={`left_${folder.progCd}`} className="open" onClick={() => onClickMenuEvent(folder.progCd)}>
											<Icon icon="icon-lnb-arrow" />
											{folder.progNm}
										</li>
										<dl>
											{childMenus.map((menu: any) => (
												<dd
													key={`bookmark_menu_${menu.progCd}`}
													className={`menu-nav-item ${menu.progUrl === location.pathname ? 'active' : ''}`}
													onClick={(e: any) => onClickMoveMenu(menu, true, e)}
													tabIndex={0}
												>
													{/* <Icon icon={menu.menuIcon} /> */}
													{menu.progNm}
												</dd>
											))}
											{childFolders.map((subFolderTree: any) => {
												const {
													folder: subFolder,
													childMenus: subFolderMenus,
													childFolders: subSubFolders,
												} = subFolderTree;
												return (
													(subFolderMenus.length > 0 || subSubFolders.length > 0) && (
														<ul key={`bookmark_subfolder_${subFolder.progCd}`}>
															<li
																id={`left_${subFolder.progCd}`}
																className="open"
																onClick={() => onClickMenuEvent(subFolder.progCd)}
															>
																<Icon icon="icon-lnb-arrow" />
																{subFolder.progNm}
															</li>
															<dl>
																{subFolderMenus.map((menu: any) => (
																	<dd
																		key={`bookmark_menu_${menu.progCd}`}
																		className={`menu-nav-item ${menu.progUrl === location.pathname ? 'active' : ''}`}
																		onClick={(e: any) => onClickMoveMenu(menu, true, e)}
																		tabIndex={0}
																	>
																		{/* <Icon icon={menu.menuIcon} /> */}
																		{menu.progNm}
																	</dd>
																))}
																{/* 하위 폴더가 더 있으면 재귀적으로 출력 */}
																{subSubFolders &&
																	subSubFolders.map((subSubFolderTree: any) => {
																		const { folder: subSubFolder, childMenus: subSubFolderMenus } = subSubFolderTree;
																		return (
																			<ul key={`bookmark_subsubfolder_${subSubFolder.progCd}`}>
																				<li
																					id={`left_${subSubFolder.progCd}`}
																					className="open"
																					onClick={() => onClickMenuEvent(subSubFolder.progCd)}
																				>
																					<Icon icon="icon-lnb-arrow" />
																					{subSubFolder.progNm}
																				</li>
																				<dl>
																					{subSubFolderMenus.map((menu: any) => (
																						<dd
																							key={`bookmark_menu_${menu.progCd}`}
																							className={`menu-nav-item ${
																								menu.progUrl === location.pathname ? 'active' : ''
																							}`}
																							onClick={(e: any) => onClickMoveMenu(menu, true, e)}
																							tabIndex={0}
																						>
																							{/* <Icon icon={menu.menuIcon} /> */}
																							{menu.progNm}
																						</dd>
																					))}
																				</dl>
																			</ul>
																		);
																	})}
															</dl>
														</ul>
													)
												);
											})}
										</dl>
									</ul>
								);
							}
							return null;
						})}
					</>
				)}
			</menu>
		</Aside>
	);
};

export default MainAside;
