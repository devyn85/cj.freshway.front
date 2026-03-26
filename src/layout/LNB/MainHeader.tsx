/*
 ############################################################################
 # FiledataField	: MainHeader.tsx
 # Description		: 메인 헤더
 # Author			: Canal Frame
 # Since			: 23.10.02
 ############################################################################
*/
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// lib
import { Button, Form } from 'antd';
import { v4 as uuidv4 } from 'uuid';

// utils
import commUtil from '@/util/commUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';

// CSS
import Nav from '@/assets/styled/Nav/Nav';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';

// component
import CmMyMenuPopup from '@/components/cm/popup/CmMyMenuPopup';
import CmNoticePopup from '@/components/cm/popup/CmNoticePopup';
import CustomModal from '@/components/common/custom/CustomModal';
import CustomTooltip from '@/components/common/custom/CustomTooltip';
import { SearchForm, SelectBox } from '@/components/common/custom/form';

// Store
import { useMoveMenu } from '@/hooks/useMoveMenu';
import { useMoveTab } from '@/hooks/useMoveTab';
import { useAppDispatch, useAppSelector } from '@/store/core/coreHook';
import { setGlobalVariable } from '@/store/core/globalStore';
import { showSidebarVisible } from '@/store/core/layoutStore';
import {
	getChildMenu,
	getFindMenu,
	MenuType,
	setNoticeCnt,
	setSelectedRootMenuId,
	setShowBookmarkMenu,
} from '@/store/core/menuStore';
import { homeTab, setCachedTabs, setTabs, TabType } from '@/store/core/tabStore';
import {
	getUserAreaList,
	getUserDccodeList,
	getUserOrganizeList,
	getUserStorerkeyList,
	userLogout,
} from '@/store/core/userStore';

// API
import { apiGetLogout } from '@/api/cm/apiCmLogin';
import { apiPostSaveNoticeRead } from '@/api/cm/apiCmMain';
import logo from '@/assets/img/login/waylo_logo.png';
import CmLoginHistoryPopup from '@/components/cm/popup/CmLoginHistoryPopup';
import Chip from '@/components/common/Chip';
import Icon from '@/components/common/Icon';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// * 공지사항 유형에 따라 스타일 적용 위한 타입 정의
type NoticeChipStyle = {
	bgColor: string;
	textColor: string;
	variant: 'filled' | 'outlined';
};

const MainHeader = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const refHeader = useRef(null);
	const dispatch = useAppDispatch();
	const { moveTab } = useMoveTab();

	// * 홈메뉴 이동
	const onClickMoveHome = () => {
		moveTab(homeTab);
		dispatch(setSelectedRootMenuId());
	};

	const scrollRef = useRef<HTMLDivElement | null>(null);
	const [isOverflow, setIsOverflow] = useState(false);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const updateOverflow = () => {
			const isNarrowScreen = window.innerWidth <= 1800;

			if (!isNarrowScreen) {
				setIsOverflow(false);
				return;
			}

			setIsOverflow(el.scrollWidth > el.clientWidth);
		};

		updateOverflow();
		const rafId = window.requestAnimationFrame(updateOverflow);

		const handleResize = () => updateOverflow();
		window.addEventListener('resize', handleResize);

		let ro: ResizeObserver | null = null;
		if (typeof ResizeObserver !== 'undefined') {
			ro = new ResizeObserver(() => updateOverflow());
			ro.observe(el);
		}

		return () => {
			window.cancelAnimationFrame(rafId);
			window.removeEventListener('resize', handleResize);
			if (ro) ro.disconnect();
		};
	}, []);

	// * 헤더 가로 스크롤 이동
	const scrollLeft = () => {
		if (!scrollRef.current) return;
		scrollRef.current.scrollLeft -= 400;
	};

	const scrollRight = () => {
		if (!scrollRef.current) return;
		scrollRef.current.scrollLeft += 400;
	};

	return (
		<header id="mainHeader">
			<Nav ref={refHeader}>
				<h1 onClick={() => onClickMoveHome()} aria-label="CJ FRESHWAY WMS">
					<img src={logo} alt="logo" />
					{import.meta.env.MODE === 'dev' && <p className="part">(DEV)</p>}
					{import.meta.env.MODE === 'qa' && <p className="part">(QA)</p>}
					{import.meta.env.MODE === 'set' && <p className="part">(SET)</p>}
				</h1>

				<div className="gnb-wrap" ref={scrollRef}>
					<HierarchicalMenu />
				</div>

				{isOverflow && (
					<div className="gnb-controls">
						<Button type="link" size="small" className="left-icon" onClick={scrollLeft}>
							<Icon icon="icon-arrow-left-20" />
						</Button>
						<Button type="link" size="small" className="right-icon" onClick={scrollRight}>
							<Icon icon="icon-arrow-right-20" />
						</Button>
					</div>
				)}

				<SubHeaderEvent />
			</Nav>
		</header>
	);
};

export default MainHeader;

/**
 * 계층 메뉴 구성
 * @returns {*} 계층 메뉴 컴포넌트
 */
const HierarchicalMenu = () => {
	const dispatch = useAppDispatch();
	const location = useLocation();

	const menuList = useAppSelector(state => state.menu.menuList);
	const mainMenus = getChildMenu(menuList, null);
	const selectedRootMenuId = useAppSelector(state => state.menu.selectedRootMenuId);

	/**
	 * 전체 메뉴 닫기
	 * @param {string} menuLevel 'main': 대메뉴, 'middle': 중메뉴
	 * @returns {void}
	 */
	const closeAllMenu = (menuLevel?: string) => {
		if (menuLevel === 'middle') {
			document.querySelectorAll('#mainHeader .sub .on').forEach(element => {
				element.classList.remove('on');
			});
		} else {
			document.querySelectorAll('#mainHeader .on').forEach(element => {
				element.classList.remove('on');
			});
		}
	};

	/**
	 * 메뉴 타이틀 클릭 이벤트
	 * @param {object} e 클릭 이벤트
	 * @param {string} menuLevel 'main': 대메뉴
	 * @returns {void}
	 */
	const onClickTitleMenu = (e: any, menuLevel: string) => {
		dispatch(showSidebarVisible());

		window.dispatchEvent(new Event('resize'));

		e.stopPropagation();

		if (e.target.className.includes('on')) {
			// 유지
		} else {
			closeAllMenu(menuLevel);
			e.target.classList.add('on');

			setTimeout(() => {
				dispatch(setShowBookmarkMenu(false));
				dispatch(setSelectedRootMenuId(e.target.id));
			});
		}
	};

	const currentMenu = getFindMenu(location.pathname);
	const currentRootProgNo = String(currentMenu?.progNo || '').slice(0, 6);
	const activeRootProgNo = selectedRootMenuId || currentRootProgNo;

	return (
		<>
			{mainMenus.map(main => {
				const middleMenus = getChildMenu(menuList, main.progNo);

				if (middleMenus.length > 0) {
					return (
						<div key={`header_div_${main.progNo}`}>
							<a
								className={activeRootProgNo === main.progNo ? 'on' : ''}
								onClick={e => onClickTitleMenu(e, 'main')}
								id={main.progNo}
							>
								{main.progNm}
							</a>
						</div>
					);
				}

				return null;
			})}
		</>
	);
};

/**
 * 헤더 우측 컴포넌트
 * @returns {*} 헤더 우측 컴포넌트
 */
const SubHeaderEvent = () => {
	const { t } = useTranslation();
	const refModal = useRef<any>(null);
	const refNoticeModal = useRef<any>(null);
	const refSettingModal = useRef<any>(null);
	const user = useAppSelector(state => state.user.userInfo);
	const userAuthInfo = useAppSelector(state => state.user.userAuthInfo);
	const [form] = Form.useForm();
	const dispatch = useAppDispatch();
	const prevValueRef = useRef<any>();
	const { moveTab } = useMoveTab();
	const tabs = useAppSelector(state => state.tab.tabs);
	const location = useLocation();
	const noticeCnt = useAppSelector(state => state.menu.noticeCnt);
	const [noticeList, setNoticeList] = useState<any[]>([]);
	const isPopupOpenRef = useRef<any>(false);
	const [popYnList] = useState<any[]>([]);
	const { moveMenu } = useMoveMenu();

	// * 공지사항 유형 공통 코드
	const docKndCdList = useMemo(() => {
		return getCommonCodeList('DOC_KND_CD') ?? [];
	}, []);

	// * brdDocKndCd 값 cdNm 매핑
	const getDocKndCdName = (brdDocKndCd?: string) => {
		if (!brdDocKndCd) return '';
		const found = docKndCdList.find((item: any) => item.comCd === brdDocKndCd);
		return found?.cdNm ?? brdDocKndCd;
	};

	// * brdDocKndCd 값에 따른 Chip 색상 매핑
	const getDocKndCdChipStyle = (brdDocKndCd?: string): NoticeChipStyle => {
		switch (brdDocKndCd) {
			case 'EMERGENCY':
				return { bgColor: '#FFEBEE', textColor: '#C62828', variant: 'filled' };
			case 'OPP':
				return { bgColor: '#E3F2FD', textColor: '#1565C0', variant: 'filled' };
			case 'CENTER':
				return { bgColor: '#E8F5E9', textColor: '#2E7D32', variant: 'filled' };
			case 'DSP':
				return { bgColor: '#FFF3E0', textColor: '#EF6C00', variant: 'filled' };
			case 'SUPPLY':
				return { bgColor: '#E0F2F1', textColor: '#00695C', variant: 'filled' };
			case 'EWH':
				return { bgColor: '#F3E5F5', textColor: '#6A1B9A', variant: 'filled' };
			case 'SYS':
				return { bgColor: '#E8EAF6', textColor: '#283593', variant: 'filled' };
			case 'EVENT':
				return { bgColor: '#FCE4EC', textColor: '#AD1457', variant: 'filled' };
			default:
				return { bgColor: '#F5F5F5', textColor: '#424242', variant: 'filled' };
		}
	};

	// * 로그아웃 처리
	const logoutUser = () => {
		apiGetLogout().then(res => {
			if (res.statusCode === 0) {
				userLogout();
			} else {
				showAlert('', t('msg.systemError'));
			}
		});
	};

	/**
	 * 센터 코드 변경시
	 */
	const setChangeHDccode = () => {
		prevValueRef.current = form.getFieldValue('hDccode');

		let storerkeyTmp = 'FW00';
		let organizeTmp = '';
		let areaTmp = '1000';

		const storerkeyList = getUserStorerkeyList('', form.getFieldValue('hDccode'));
		if (storerkeyList && storerkeyList.length > 0) {
			storerkeyTmp = storerkeyList[0].storerkey;
		}

		const organizeList = getUserOrganizeList('', form.getFieldValue('hDccode'), storerkeyTmp);
		if (organizeList && organizeList.length > 0) {
			organizeTmp = organizeList[0].organize;
		}

		const areaList = getUserAreaList('', form.getFieldValue('hDccode'), storerkeyTmp);
		if (areaList && areaList.length > 0) {
			areaTmp = areaList[0].area;
		}

		let dcname = '';
		let dcnameOnlyNm = '';
		if (commUtil.isNotEmpty(form.getFieldValue('hDccode'))) {
			dcname = getUserDccodeList('')?.find((opt: any) => opt.dccode === form.getFieldValue('hDccode'))?.dcname;
			dcnameOnlyNm = getUserDccodeList('')?.find(
				(opt: any) => opt.dccode === form.getFieldValue('hDccode'),
			)?.dcnameOnlyNm;
		}

		dispatch(
			setGlobalVariable({
				gDccode: form.getFieldValue('hDccode') === '9999' ? null : form.getFieldValue('hDccode'),
				gDccodeNm: form.getFieldValue('hDccode') === '9999' ? null : dcname,
				gDccodeNmOnlyNm: form.getFieldValue('hDccode') === '9999' ? null : dcnameOnlyNm,
				gStorerkey: storerkeyTmp,
				gOrganize: form.getFieldValue('hDccode') === '9999' ? null : organizeTmp,
				gArea: areaTmp,
				gMultiDccode: form.getFieldValue('hDccode') === '9999' ? null : form.getFieldValue('hDccode'),
				gMultiStorerkey: storerkeyTmp,
				gMultiOrganize: form.getFieldValue('hDccode') === '9999' ? null : organizeTmp,
				gMultiArea: areaTmp,
			}),
		);
	};

	/**
	 * 초기화
	 * /src/layout/Tab/MainTabs.tsx >>> onClickRefreshTab function 그대로 가져옴
	 * @returns {void}
	 */
	const reset = () => {
		const currentIndex = tabs.findIndex((tab: TabType) => tab.menuUUID === location.state.uuid);

		const uuid = location.state.uuid === 'HOME' ? 'HOME' : uuidv4();
		const refreshTab = { ...tabs[currentIndex], menuUUID: uuid };

		const refreshTabs = tabs.map((tab: MenuType, index: number) => {
			if (index === currentIndex) {
				return refreshTab;
			}
			return tab;
		});

		dispatch(setTabs(refreshTabs));
		dispatch(setCachedTabs(refreshTabs));
		moveTab(refreshTab);
	};

	/**
	 * 센터 코드 변경 이벤트
	 * @param {string} type 초기 호출 유무
	 */
	const onChangeHDccode = (type: string) => {
		if (type === 'init') {
			const defDccode = localStorage.getItem('defDccode');
			const filterDccode: any = getUserDccodeList('HQ')?.filter((opt: any) => opt.dccode === defDccode);
			if (commUtil.isNotEmpty(defDccode) && filterDccode?.length > 0) {
				form.setFieldValue('hDccode', defDccode);
			}

			setChangeHDccode();
		} else {
			showConfirm(
				null,
				'기본 센터 변경시 해당 화면이 초기화됩니다.',
				() => {
					setChangeHDccode();
					reset();
					localStorage.setItem('defDccode', form.getFieldValue('hDccode'));
				},
				() => {
					form.setFieldValue('hDccode', prevValueRef.current);
				},
			);
		}
	};

	// * 사용자 접속 권한 설정
	useEffect(() => {
		if (user && user.defDccode && commUtil.isEmpty(form.getFieldValue('hDccode'))) {
			const defDccode = localStorage.getItem('defDccode');
			const filterDccode: any = getUserDccodeList('HQ')?.filter((opt: any) => opt.dccode === defDccode);
			if (filterDccode?.length > 0) {
				form.setFieldValue('hDccode', defDccode);
			} else {
				form.setFieldValue('hDccode', user.defDccode);
			}
		}
	}, [user, form]);

	// * 센터/회사/조직 글로벌 변수 초기값 설정
	useEffect(() => {
		onChangeHDccode('init');
	}, [userAuthInfo]);

	const handleClickSetting = () => {
		refSettingModal.current.handlerOpen();
	};

	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const popupRef = useRef<any>(null);

	// * 팝업 외부 클릭 시 닫기
	useEffect(() => {
		/**
		 *
		 * @param event
		 */
		function handleClickOutside(event: any) {
			if (popupRef.current && !popupRef.current.contains(event.target)) {
				setIsPopupOpen(false);
				isPopupOpenRef.current = false;
			}
		}

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// * 알림 팝업 열기 및 읽음 처리
	const showPopup = () => {
		if (noticeCnt > 0) {
			setIsPopupOpen(true);
			isPopupOpenRef.current = true;

			apiPostSaveNoticeRead({}).then(res => {
				if (res.statusCode === 0) {
					dispatch(setNoticeCnt(0));
				}
			});
		}
	};

	/**
	 * 공지사항 업무 페이지로 이동
	 * @param {any} item 아이템
	 */
	const goNotice = (item: any) => {
		setIsPopupOpen(false);
		isPopupOpenRef.current = false;

		if (commUtil.isNotEmpty(item?.redirectUrl) && item?.redirectUrl.includes('http')) {
			window.open(item.redirectUrl, '_blank');
		} else {
			moveMenu(item.redirectUrl || '/cb/cbNotice', { state: { brdNum: item.brdnum } });
		}
	};

	// * 공지 목록 주기적 조회
	useEffect(() => {
		/*
		const fetchData = async () => {
			if (!isPopupOpenRef.current) {
				await apiGetNoticeList(null).then(res => {
					if (res.statusCode === 0) {
						const resultData = res?.data;
						dispatch(setNoticeCnt(resultData?.length));
						setNoticeList(resultData);
					}
				});
			}
		};

		fetchData();

		const intervalId = setInterval(fetchData, 60 * 5 * 1000);

		return () => {
			clearInterval(intervalId);
		};
		*/
	}, [dispatch]);

	return (
		<div id="userMenu">
			기본 선택 센터
			<SearchForm form={form} isAlwaysVisible>
				<SelectBox
					name={'hDccode'}
					options={getUserDccodeList('HQ')}
					onChange={onChangeHDccode}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					initval={user.defDccode}
				/>
			</SearchForm>
			<em>
				<span
					onClick={() => {
						refModal.current.handlerOpen();
					}}
				>
					{user?.userNm}
					{['01', '02', '03'].includes(user?.emptype) ? '' : '님'}
				</span>{' '}
				환영합니다
			</em>
			<CustomTooltip placement="bottomLeft">
				<Button
					className="btn-alarm"
					onClick={showPopup}
					aria-label="알림"
					icon={<IcoSvg data={icoSvgData.icoNotify} />}
				>
					{noticeCnt > 0 && <em>{noticeCnt}</em>}
				</Button>
			</CustomTooltip>
			{isPopupOpen && (
				<div ref={popupRef} className="alert-cont">
					<span className="arr"></span>
					<h3>알림</h3>
					<div className="inner">
						{noticeList.map((item, index) => {
							const label = getDocKndCdName(item?.brdDocKndCd);
							const chipStyle = getDocKndCdChipStyle(item?.brdDocKndCd);

							return (
								<p key={index}>
									<a
										href="#"
										onClick={(e: any) => {
											e.preventDefault();
											goNotice(item);
										}}
									>
										<PusheChipWrap>
											<Chip
												label={label}
												size="small"
												variant={chipStyle.variant}
												bgColor={chipStyle.bgColor}
												textColor={chipStyle.textColor}
											/>
											<p style={{ color: '#8f8f8f', fontSize: '10px' }}>{item.adddate}</p>
										</PusheChipWrap>

										<p style={{ fontWeight: 500, fontSize: '14px', margin: '0 4px' }}>{item.brdtit}</p>

										<div
											className="txt-wrap"
											dangerouslySetInnerHTML={{ __html: item.brdcntt }}
											style={{ margin: '6px 4px 0px 4px', fontSize: '12px' }}
										/>
									</a>
								</p>
							);
						})}
					</div>
				</div>
			)}
			<Button className="btn-my-setting" onClick={handleClickSetting} icon={<IcoSvg data={icoSvgData.icoSetting} />} />
			<CustomTooltip placement="bottomLeft" title={'로그아웃'}>
				<Button className="btn-logout" type="link" onClick={logoutUser} icon={<IcoSvg data={icoSvgData.icoLogout} />} />
			</CustomTooltip>
			<CustomModal ref={refModal} width="720px">
				<CmLoginHistoryPopup close={() => refModal.current.handlerClose()} />
			</CustomModal>
			<CustomModal ref={refSettingModal} width="1280px">
				<CmMyMenuPopup close={() => refSettingModal.current.handlerClose()} />
			</CustomModal>
			<CustomModal ref={refNoticeModal} width="720px">
				<CmNoticePopup
					data={popYnList}
					close={() => {
						refNoticeModal.current.handlerClose();
					}}
				/>
			</CustomModal>
		</div>
	);
};

const PusheChipWrap = styled.div`
	display: flex;
	align-items: center;
	gap: 5px;
`;
