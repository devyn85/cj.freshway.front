/*
 ############################################################################
 # FiledataField	: MenuTitle.tsx
 # Description		: 메뉴타이틀
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import { Breadcrumb, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// CSS
import Title from '@/assets/styled/Title/Title';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';

// Hook
import { useMoveTab } from '@/hooks/useMoveTab';
import { useActivate, useAliveController, useUnactivate } from 'react-activation';

// Store
import { useKeydown } from '@/hooks/useKeydown';
import { useKeydownAUIGrid } from '@/hooks/useKeydownAUIGrid';
import { useAppDispatch, useAppSelector } from '@/store/core/coreHook';

import CustomTooltip from '@/components/common/custom/CustomTooltip';
import { usePageLayoutVisible } from '@/hooks/usePageLayoutVisible';
import { getAllGridElement } from '@/lib/AUIGrid/auIGridUtil';
import { getFindMenu, getFindMenuByProgNo, MenuType } from '@/store/core/menuStore';
import { setCachedTabs, setTabs, TabType } from '@/store/core/tabStore';
import { BookmarkSaveButton } from './BookmarkSaveButton';

// Component
import CmManualViewerPopup from '@/components/cm/popup/CmManualViewerPopup';
import CustomModal from '@/components/common/custom/CustomModal';

interface MenuTitleProps {
	name?: string;
	title?: string;
	authority?: string;
	func?: any;
	slotLocation?: 'left' | 'right' | null | undefined;
	children?: any;
	isShowMenuAuthButton?: boolean;
	isShowSearchFormButton?: boolean;
}

const MenuTitle = (props: MenuTitleProps) => {
	// 초기 props 설정
	const {
		name = '',
		authority,
		slotLocation = 'right',
		func,
		children,
		isShowMenuAuthButton = true,
		isShowSearchFormButton = true,
	} = props;

	const [breadcrumbItem, setBreadcrumbItem] = useState([]);
	const currentMenuRef = useRef(null); // 현재 메뉴 정보
	const refModalManual = useRef(null);
	const [popUpParams, setPopUpParams] = useState({}); // 팝업 파라미터

	/**
	 * 매뉴얼 뷰 팝업
	 * @returns {void}
	 */
	const onClickManualPopup = () => {
		setPopUpParams(currentMenuRef.current);
		refModalManual.current.handlerOpen();
	};

	useEffect(() => {
		// 현재 메뉴 위치
		const currentMenu = getFindMenu(location.pathname);
		currentMenuRef.current = currentMenu;
		setBreadcrumbItem([
			{ title: getFindMenuByProgNo(currentMenu?.progNo?.slice(0, -4))?.progNm },
			{ title: getFindMenuByProgNo(currentMenu?.progNo?.slice(0, -2))?.progNm },
			{ title: currentMenu?.progNm },
		]);
	}, []);

	useEffect(() => {
		const el = document.querySelector('.ant-breadcrumb');
		el?.addEventListener('copy', e => {
			e.preventDefault();
			const text = el.innerText
				.replace(/\n/g, ' ')
				.replace(/\s{2,}/g, ' ')
				.trim();
			e.clipboardData.setData('text/plain', text);
		});
	}, []);

	return (
		<Title>
			<MenuName name={name} />
			<span>
				<BookmarkSaveButton />
				{/* {currentMenuRef.current?.fileCnt === '1' && (
					<Button
						icon={<IcoSvg data={icoSvgData.icoInfoCircle} label={'정보'} />}
						style={{
							left: '8px',
						}}
						onClick={onClickManualPopup}
					/>
				)} */}
				<Button
					icon={<IcoSvg data={icoSvgData.icoInfoCircle} label={'정보'} />}
					style={{
						left: '8px',
					}}
					onClick={onClickManualPopup}
				/>
			</span>

			<Breadcrumb separator=">" items={breadcrumbItem} />

			{isShowMenuAuthButton && (
				<MenuAuthButton
					authority={authority}
					slotLocation={slotLocation}
					func={func}
					isShowSearchFormButton={isShowSearchFormButton}
				>
					{children}
				</MenuAuthButton>
			)}

			{/* PDF 팝업 */}
			<CustomModal ref={refModalManual} width="1014px">
				<CmManualViewerPopup popUpParams={popUpParams} />
			</CustomModal>
		</Title>
	);
};

export default MenuTitle;

/**
 * 메뉴 이름: 메뉴 이름 없는 경우 현재 주소 메뉴 이름 설정
 * @param {MenuTitleProps} props 메뉴 명 컴포넌트 props
 * @returns {*} 메뉴 명 컴포넌트
 */
const MenuName = (props: MenuTitleProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { name } = props;
	const location = useLocation();
	const [menuName, setMenuName] = useState('');
	/**
	 * =====================================================================
	 *	03. react hook
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// useEffect(() => {
	// 	setCurrentMenuName(getFindMenu(location.pathname)?.progNm);
	// }, []);
	//
	// return <>{name ? <h2>{name}</h2> : <h2>{currentMenuName}</h2>}</>;
	useEffect(() => {
		if (!name) {
			const currentMenu = getFindMenu(location.pathname);
			setMenuName(currentMenu?.progNm || '');
		}
	}, [location.pathname, name]);

	return <h2>{name || menuName}</h2>;
};

/**
 * 메뉴 권한 버튼
 * @param {MenuTitleProps} props 메뉴 권한 버튼 컴포넌트 Props
 * @returns {void}
 */
const MenuAuthButton = (props: MenuTitleProps) => {
	const { slotLocation, func, children, isShowSearchFormButton } = props;

	const { moveTab } = useMoveTab();
	const dispatch = useAppDispatch();
	const location = useLocation();
	const tabs = useAppSelector(state => state.tab.tabs);
	const [isTabActive, setIsTabActive] = useState(true);

	// KeepAlive 캐시 제어
	const { drop } = useAliveController();

	const {
		layout: { isSearchFormVisible, isAllLayoutVisible },
		actions: { expandView, collapseView, toggleSearchForm },
	} = usePageLayoutVisible();

	// 상단에 state 추가
	const [isOpenRefreshTooltip, setIsOpenRefreshTooltip] = useState(false);

	/**
	 * 그리드가 직접 포함된 최하위 Panel들을 찾는 함수
	 * @param panels
	 * @returns {object} 그리드가 직접 포함된 최하위 Panel들과 첫 번째 그리드가 속한 패널
	 */
	const findDirectPanelsWithGrid = (panels: NodeListOf<Element>) => {
		const directPanelsWithGrid: Element[] = [];
		let directPanelWithFirstGrid: Element | null = null;

		panels.forEach((panel: Element) => {
			const hasGrid = panel.querySelector('.aui-grid-wrap');
			const hasNestedPanel = panel.querySelector('.ant-splitter-panel');

			if (hasGrid && !hasNestedPanel) {
				directPanelsWithGrid.push(panel);
				if (!directPanelWithFirstGrid) {
					directPanelWithFirstGrid = panel;
				}
			}
		});

		return { directPanelsWithGrid, directPanelWithFirstGrid };
	};

	/**
	 * 첫 번째 그리드가 속한 패널들을 수집하는 함수
	 * @description 패널이 중첩인 경우 첫 번째 그리드가 속한 패널들을 모두 수집하여, 확장 모드로 처리해야하기 때문에 필요
	 * @param panelWithFirstGrid
	 */
	const getPanelChainWithFirstGrid = (panelWithFirstGrid: Element | null): Element[] => {
		const panelChain: Element[] = [];
		let currentPanel: Element | null = panelWithFirstGrid;

		while (currentPanel) {
			panelChain.push(currentPanel);
			currentPanel = currentPanel.parentElement?.closest('.ant-splitter-panel') || null;
		}

		return panelChain;
	};

	/**
	 * 중첩 구조가 있는 Panel들을 확장 모드로 처리하는 함수, 나머지는 숨김 처리
	 * @param allPanels
	 * @param showablePanelChains 확장 모드로 처리할 패널 체인
	 */
	const expandNestedPanelsWithFirstGridAndCollapseRestPanels = (
		allPanels: NodeListOf<Element>,
		showablePanelChains: Element[],
	) => {
		allPanels.forEach((panel: Element) => {
			const htmlPanel = panel as HTMLElement;

			if (showablePanelChains.includes(panel)) {
				htmlPanel.style.display = '';
				htmlPanel.style.flex = '1 1 100%';
			} else {
				htmlPanel.style.display = 'none';
			}
		});
	};

	/**
	 * 기본 Panel 구조를 확장 모드로 처리하는 함수
	 * @param allPanels
	 */
	const expandBasicPanelWithFirstGridAndCollapseRestPanels = (allPanels: NodeListOf<Element>) => {
		let firstPanelWithGrid: Element | null = null;

		allPanels.forEach((panel: Element) => {
			const hasGrid = panel.querySelector('.aui-grid-wrap');
			if (hasGrid && !firstPanelWithGrid) {
				firstPanelWithGrid = panel;
			}

			const htmlPanel = panel as HTMLElement;

			if (panel === firstPanelWithGrid) {
				htmlPanel.style.flex = '1 1 100%';
				htmlPanel.style.display = '';
			} else {
				htmlPanel.style.display = 'none';
			}
		});
	};

	const expandFirstGridAndCollapseRestGrids = (allGrids: any[]) => {
		allGrids.forEach((grid: any, index: number) => {
			// Grid가 숨겨진 탭에 속해있는 경우
			const gridInHiddenTab = grid.closest('.ant-tabs-tabpane-hidden');

			if (gridInHiddenTab) {
				grid.closest('.agrid').style.display = 'none';
			} else {
				// 첫번째 그리드가 아니면 숨김 처리
				if (index !== 0) {
					grid.closest('.agrid').style.display = 'none';
				}
			}
		});
	};

	/**
	 * Panel들을 축소 모드로 처리하는 함수
	 * @param allPanels
	 */
	const collapsePanels = (allPanels: NodeListOf<Element>) => {
		allPanels.forEach((panel: Element) => {
			const htmlPanel = panel as HTMLElement;
			htmlPanel.style.display = '';
			htmlPanel.style.flex = '';
		});
	};

	/**
	 * 일반 그리드를 축소 모드로 처리하는 함수
	 * @param allGrids
	 */
	const collapseGrids = (allGrids: any[]) => {
		allGrids.forEach((grid: any) => {
			grid.closest('.agrid').style.display = 'block';
		});
	};

	/**
	 * Splitter Panel 구조를 확장 모드로 처리하는 함수
	 * @param allPanels
	 */
	const expandPanels = (allPanels: NodeListOf<Element>) => {
		const { directPanelsWithGrid, directPanelWithFirstGrid } = findDirectPanelsWithGrid(allPanels);

		if (directPanelsWithGrid.length > 0) {
			const panelChainWithFirstGrid = getPanelChainWithFirstGrid(directPanelWithFirstGrid);
			expandNestedPanelsWithFirstGridAndCollapseRestPanels(allPanels, panelChainWithFirstGrid);
		} else {
			expandBasicPanelWithFirstGridAndCollapseRestPanels(allPanels);
		}
	};

	/**
	 * 상세 화면에 있는 모든 탭을 숨김 처리하는 함수
	 */
	const visibleTabsInDetail = () => {
		const allTabsInDetail = document.querySelectorAll('.ant-tabs-nav');

		allTabsInDetail.forEach((tab: any) => {
			tab.style.display = isAllLayoutVisible ? 'none' : 'block';
		});
	};

	/**
	 * 확장/축소 버튼 클릭 시 확장/축소 상태 변경
	 * @returns {void}
	 */
	const handleClickExpandButton = () => {
		const allGrids = getAllGridElement();
		const allSplitterPanels = document.querySelectorAll('.ant-splitter-panel');
		const hasPanels = allSplitterPanels.length > 0;

		visibleTabsInDetail();

		if (isAllLayoutVisible) {
			expandView();

			if (hasPanels) {
				expandPanels(allSplitterPanels);
			} else {
				expandFirstGridAndCollapseRestGrids(Array.from(allGrids));
			}
		} else {
			collapseView();

			if (hasPanels) {
				collapsePanels(allSplitterPanels);
			} else {
				collapseGrids(Array.from(allGrids));
			}
		}

		window.dispatchEvent(new Event('resize'));
	};

	/**
	 * 초기화
	 * /src/layout/Tab/MainTabs.tsx >>> onClickRefreshTab function 그대로 가져옴
	 * @returns {void}
	 */
	const reset = () => {
		// 툴팁 먼저 닫기
		setIsOpenRefreshTooltip(false);

		const currentUUID = location.state?.uuid;
		const currentIndex = tabs.findIndex((tab: TabType) => tab.menuUUID === currentUUID);

		if (currentIndex === -1) return;

		//HOME 화면에서 리플레시 적용시 HOME 아이콘 사라지는 현상 버그 수정 (12/19)
		const uuid = currentUUID === 'HOME' ? 'HOME' : uuidv4();
		const refreshTab = { ...tabs[currentIndex], menuUUID: uuid };

		const refreshTabs = tabs.map((tab: MenuType, index: number) => {
			if (index === currentIndex) {
				return refreshTab;
			}
			return tab;
		});

		// react-activation: 기존 KeepAlive 캐시 제거 (HOME이 아닌 경우에만)
		if (currentUUID !== 'HOME') {
			drop(currentUUID);
		}

		dispatch(setTabs(refreshTabs));
		dispatch(setCachedTabs(refreshTabs));
		moveTab(refreshTab);
	};

	const handleClickSearch = () => {
		// 팝업 존재시 조회 기능 방지
		const modalMask = document.querySelector('.ant-modal-mask');
		if (isTabActive && !modalMask) {
			if (func && func['searchYn']) {
				func['searchYn']();
			}
		}
	};

	// 탭이 활성화될 때
	useActivate(() => {
		setIsTabActive(true);
	});

	// 탭이 비활성화될 때
	useUnactivate(() => {
		setIsTabActive(false);
	});

	const handleClickShowSearchFormButton = () => {
		if (isTabActive) {
			toggleSearchForm();
		}
	};

	/**
	 * 그리드 안에서는 단축키 실행 안되서 useKeydownAUIGrid도 같이 사용
	 */
	// 전역 단축키
	useKeydown({ key: 'F2' }, handleClickSearch);
	// 그리드 내 단축키
	useKeydownAUIGrid({ key: 'F2' }, handleClickSearch);

	if (isShowSearchFormButton) {
		useKeydown({ key: 'F10' }, handleClickShowSearchFormButton);
		useKeydownAUIGrid({ key: 'F10' }, handleClickShowSearchFormButton);
	}

	return (
		<div className="btn-group">
			{/* slot left */}
			{slotLocation === 'left' && <>{children}</>}
			{func && func['setting'] && (
				<CustomTooltip placement="bottomLeft" title={'설정'}>
					<Button className="ico_setting ant-btn-icon-only" label={'설정'} onClick={func['setting']} />
				</CustomTooltip>
			)}
			{/* <Button
				onClick={() => handleClickExpandButton()}
				icon={
					<IcoSvg
						data={isAllLayoutVisible ? icoSvgData.icoExpansion : icoSvgData.icoReduce}
						label={isAllLayoutVisible ? '확대' : '축소'}
					/>
				}
			/> */}
			{isShowSearchFormButton && (
				<CustomTooltip placement="bottomLeft" title={isSearchFormVisible ? '조회박스 닫기' : '조회박스 열기'}>
					<Button
						onClick={() => handleClickShowSearchFormButton()}
						icon={
							<IcoSvg
								data={isSearchFormVisible ? icoSvgData.icoFolding : icoSvgData.icoUnFolding}
								label={isSearchFormVisible ? '조회박스닫기' : '조회박스열기'}
							/>
						}
					/>
				</CustomTooltip>
			)}
			{/* <Button onClick={func && func['reset']} icon={<IcoSvg data={icoSvgData.icoRefresh} label={'새로고침'} />} /> */}
			<CustomTooltip
				placement="bottomLeft"
				title={'새로고침'}
				open={isOpenRefreshTooltip}
				onOpenChange={setIsOpenRefreshTooltip}
			>
				<Button
					onClick={reset}
					icon={<IcoSvg data={icoSvgData.icoRefresh} label={'새로고침'} />}
					onMouseOver={() => setIsOpenRefreshTooltip(true)}
				/>
			</CustomTooltip>
			{func && func['searchYn'] && (
				<Button type="secondary" onClick={handleClickSearch}>
					{'조회'}
				</Button>
			)}
			{/* slot right */}

			{slotLocation === 'right' && <>{children}</>}
		</div>
	);
};
