import { useAppSelector } from '@/store/core/coreHook';
import { MouseEvent, useEffect, useRef, useState } from 'react';

import { apiGetLogout } from '@/api/common/apiCommon';
import DropHeader from '@/assets/styled/DropMenu/DropMenu';
import { MenuType } from '@/store/core/menuStore';
import { userLogout } from '@/store/core/userStore';
import dataTransform from '@/util/dataTransform';
import { AutoComplete, Button, ConfigProvider } from 'antd';

import Icon from '@/components/common/Icon';
import CustomModal from '@/components/common/custom/CustomModal';
import { useMoveMenu } from '@/hooks/useMoveMenu';
import { showAlert } from '@/util/MessageUtil';
import PopupUserHistory from '../common/PopupUserHistory';
import SiteMap from './SiteMap';
import sample4depth from './sample4depth.json';

const DropMenu = () => {
	const { t } = useTranslation();
	/**
	 * Store 정보
	 */
	const user = useAppSelector(state => state.user.userInfo);
	const menuList = useAppSelector(state => state.menu.menuList);
	// TUI 사용 시 (샘플 json 및 메뉴 파일 children -> _children 변경)
	const menus = dataTransform.makeTreeMenuData([...menuList, ...sample4depth]);
	/* 최상위 메뉴 열기 */
	const refDrop = useRef(null);
	const [currentMenu, setCurrentMenu] = useState(null);

	/* reverse mode */
	const [isReverse] = useState(true);
	/**
	 * 드롭다운 영역 열고 접기
	 * - Mount 이후 드롭다운 영역/사용자 정보 영역 외 클릭 시 닫는 이벤트 등록
	 */
	useEffect(() => {
		const closeDropDown = (event: CustomEvent<MouseEvent>) => {
			if (!refDrop.current.contains(event.target)) {
				setCurrentMenu(null);
				setShowUser(false);
			}
		};

		window.addEventListener('click', closeDropDown as EventListener);
		return () => {
			window.removeEventListener('click', closeDropDown as EventListener);
		};
	}, []);

	/**
	 * 메뉴 이동
	 * @param {object} menu 메뉴
	 * @returns {void}
	 */
	const { moveMenu } = useMoveMenu();
	const onClickMoveMenu = (menu: any) => {
		setCurrentMenu(null);
		setShowUser(false);
		moveMenu(menu.menuUrl);
	};

	const refModal = useRef(null);
	const refUserModal = useRef(null);

	const closePop = () => {
		refModal.current.handlerClose();
	};

	const onClickHeadMenu = (selectedMenu: MenuType) => {
		setCurrentMenu(selectedMenu);
		setShowUser(false);
	};

	const onClickSiteMap = () => {
		refModal.current.handlerOpen();
	};
	/* 사용자 정보 조회 */
	const [showUser, setShowUser] = useState(false);
	const onClickMyPage = () => {
		setShowUser(!showUser);
	};

	//메뉴 자동 완성 검색 선택 시
	const onSelectAutoComplete = (data: string, option: any) => {
		//1계층, 2계층과 같은 메뉴가 아닌 부모 Depth일 경우 어떻게 처리해야 할까?
		option.menuYn === '1' ? moveMenu(option.menuUrl) : '';
	};

	/* 다계층 메뉴를 한계층으로 변환 */
	const flattenMenuNames = (data: any) => {
		const flatMenuInfo: any[] = [];
		/**
		 * 메뉴명 추출
		 * @param {object} item 메뉴 객체
		 */
		function extractMenuNames(item: any) {
			flatMenuInfo.push({
				value: item.menuNm,
				menuUrl: item.menuUrl,
				menuYn: item.menuYn,
			});
			if (item.children && item.children.length > 0) {
				item.children.map((child: any) => extractMenuNames(child));
			}
		}
		data.forEach((item: any) => extractMenuNames(item));
		return flatMenuInfo;
	};

	const flatMenu = flattenMenuNames(menus);

	/**
	 * 로그아웃
	 */
	const logoutUser = () => {
		apiGetLogout().then(res => {
			if (res.statusCode === 0) {
				userLogout();
			} else {
				showAlert('', t('msg.systemError'));
			}
		});
	};

	return (
		<DropHeader ref={refDrop}>
			{/* 대메뉴 */}
			<nav className={isReverse ? 'reverse' : null}>
				<a onClick={() => (location.href = '/home')}>
					{isReverse === true && <Icon icon="calcalFrame-Gnb-Ci-w" />}
					{isReverse === false && <Icon icon="calcalFrame-Gnb-Ci" />}
				</a>
				<div className="header-inner">
					<>
						{menus?.map((main: any) => {
							return (
								<a id={`header-${main.menuId}`} key={main.menuId} onClick={() => onClickHeadMenu(main)}>
									{main.menuNm}
								</a>
							);
						})}
					</>
				</div>
				<div className="header-right">
					<ConfigProvider
						theme={{
							components: {
								Select: {
									zIndexPopup: 9999,
								},
							},
						}}
					>
						<AutoComplete
							style={{ width: 200 }}
							options={flatMenu}
							onSelect={(val, flatMenu) => onSelectAutoComplete(val, flatMenu)}
							filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
							placeholder="한글자 이상 입력하세요"
						/>
					</ConfigProvider>
					<div onClick={onClickMyPage}>
						<p>{user.userNm}</p>
						{showUser && (
							<ul className="header-user">
								<Button
									icon={<Icon icon="icon-user" />}
									onClick={() => {
										refUserModal.current.handlerOpen();
									}}
								>
									접속이력
								</Button>
								<Button icon={<Icon icon="icon-monitor" />} onClick={() => onClickSiteMap()}>
									사이트맵
								</Button>
								<Button icon={<Icon icon="icon-logout" />} onClick={logoutUser}>
									로그아웃
								</Button>
							</ul>
						)}
					</div>
				</div>
			</nav>

			{/* 드롭다운 메뉴 */}
			{currentMenu !== null && (
				<div className="dropdown">
					{currentMenu.children.map((middle: any) => {
						return (
							<ul key={middle.menuId} className="middle-item">
								<h2>{middle.menuNm}</h2>
								<li key={`li_${middle.menuId}`}>
									{/* 소메뉴 및 세메뉴 */}
									{middle.children?.map((sub: any) => {
										return sub.children ? (
											<div key={sub.menuId}>
												<span>{sub.menuNm}</span>
												<ul className="sub-item" key={sub.menuId}>
													{sub.children.map((detail: any) => (
														<li key={detail.menuId}>
															<a key={`a-btn-${sub.menuId}`} onClick={() => onClickMoveMenu(sub)}>
																<span>{detail.menuNm}</span>
															</a>
														</li>
													))}
												</ul>
											</div>
										) : (
											<a key={`a-btn-${sub.menuId}`} onClick={() => onClickMoveMenu(sub)}>
												<span key={sub.menuId}>{sub.menuNm}</span>
											</a>
										);
									})}
								</li>
							</ul>
						);
					})}
				</div>
			)}

			{/* 사이트맵 */}
			<CustomModal ref={refModal} width="1280px">
				<SiteMap closePop={closePop} />
			</CustomModal>

			{/* 접속이력 */}
			<CustomModal ref={refUserModal} width="480px">
				<PopupUserHistory />
			</CustomModal>
		</DropHeader>
	);
};

export default DropMenu;
