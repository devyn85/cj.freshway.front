import ExclusiveScreen from '@/components/common/ExclusiveScreen';
import i18n from '@/lang/i18n';
import Layout from '@/layout/Layout';
import authRoutes from '@/routes/auth';
import commUtil from '@/util/commUtil';
import Constants from '@/util/constants';
import * as React from 'react';
import routes from '~react-pages';

import { useMoveMenu } from '@/hooks/useMoveMenu';
import { useMoveTab } from '@/hooks/useMoveTab';

import useGlobalRouter from '@/hooks/useGlobalRouter';
import { fetchGrpCommCode } from '@/store/core/comCodeStore';
import { useAppDispatch, useAppSelector } from '@/store/core/coreHook';
import * as MenuStore from '@/store/core/menuStore';
import { fetchMenuList, getFindMenu } from '@/store/core/menuStore';
import { fetchTranslationList } from '@/store/core/translationStore';
import { fetchUserAuthInfo, fetchUserInfo } from '@/store/core/userStore';

import useRouteAuth from '@/hooks/useRouteAuth';

const RouteIndex = (): React.ReactElement => {
	const location = useLocation();
	const [auth, setAuth] = useState(null); // 권한 여부
	const [layout, setLayout] = useState(null); // 레이아웃 타입
	/**
	 * page meta 정보 가져오기
	 * @param {string} path location.pathname
	 */
	function getPageMeta(path: string) {
		const page = useRouteAuth(path);
		setAuth(page.authority); // 권한 설정
		setLayout(page.layout); // 레이아웃 설정
	}

	useEffect(() => {
		// route 변경시 meta 정보 호출
		getPageMeta(location.pathname);
		return () => {
			// setView(false);
		};
	}, [location.pathname]);

	return (
		<>
			<LayoutRoute auth={auth} layout={layout} />
		</>
	);
};

export default RouteIndex;

const LayoutRoute = ({ auth, layout }: any) => {
	const route = useRoutes(routes);

	const location = useLocation();
	const locationParams = new URLSearchParams(location.search);
	const window = locationParams.get(Constants.WIN_POPUP.KEY);

	const tabs = useAppSelector(state => state.tab.tabs);
	const dispatch = useAppDispatch(); // store 에 요청 전송

	const { moveMenuTab } = useMoveTab();
	const { moveMenu } = useMoveMenu();

	// 자식 컴포넌트 제어
	const [isLoading, setIsLoading] = useState(false);
	const [isInit, setIsInit] = useState(false);

	useEffect(() => {
		// 다국어 설정
		if (auth !== null) {
			fetchTranslationList({ gLang: i18n.language }).then((response: any) => {
				// 다국어 정제
				const lblJsonTmp = response?.reduce((acc: any, cur: any) => {
					if (cur['labelType'] === 'LBL') {
						acc[cur['labelCd']] = cur['labelNm']?.replaceAll(/\\r\\n/g, '\n')?.replaceAll(/\\n/g, '\n');
					}
					return acc;
				}, {});
				const msgJsonTmp = response?.reduce((acc: any, cur: any) => {
					if (cur['labelType'] === 'MSG') {
						acc[cur['labelCd']] = cur['labelNm']?.replaceAll(/\\r\\n/g, '\n')?.replaceAll(/\\n/g, '\n');
					}
					return acc;
				}, {});

				i18n.addResourceBundle(
					i18n.language,
					'translation',
					{
						lbl: lblJsonTmp || {},
						msg: msgJsonTmp || {},
					},
					true, // 목록 병합
					true, // key 중복시 덮어쓰기
				);
			});
		}

		if (commUtil.isNotEmpty(route) && !commUtil.isNull(auth)) {
			// 권한 있는 메뉴 접근시 로그인 여부 체크
			const accessToken = localStorage.getItem('accessToken');
			if (auth && commUtil.isEmpty(accessToken)) {
				const savedLoginPage = localStorage.getItem('savedLoginPage') || '/custLogin';
				useGlobalRouter.navigate(savedLoginPage);
			} else {
				/**
				 * 최초 1회 설정 (로그인 또는 새로 고침)
				 */
				async function fetchInitApi() {
					if (auth) {
						await fetchMenuList();
						await fetchUserInfo();
						await fetchUserAuthInfo();
						await fetchGrpCommCode();
					}
				}
				// init api
				fetchInitApi()
					.then(() => {
						// 최초 세팅되는 API 호출 후 DOM 노출
						setIsInit(true);
						if (auth) {
							dispatch(MenuStore.setInitialized(true));
						}
					})
					.catch(() => {
						// API 호출 실패 시 (토큰 만료 등) 로그인 페이지로 이동
						localStorage.removeItem('accessToken');
						const savedLoginPage = localStorage.getItem('savedLoginPage') || '/custLogin';
						useGlobalRouter.navigate(savedLoginPage);
					});

				// DOM 적용 대기
				// setTimeout(() => {
				// 	setIsInit(true);
				// }, 100);
			}
		}
	}, [auth]);

	useEffect(() => {
		if (!commUtil.isNull(auth) && !commUtil.isNull(layout) && isInit) {
			// 권한 없는 메뉴 접근시 에러 페이지로 Redirect
			const currentMenu = getFindMenu(location.pathname);
			if (auth && commUtil.isEmpty(currentMenu)) {
				// 예외 페이지 제외
				// "/sample/" 페이지 권한 예외 처리
				const exists = authRoutes.PAGE_ROUTER.some(item => item.url === location.pathname);
				if (!exists && !location.pathname.includes('/sample/')) {
					useGlobalRouter.navigate('/error');
				}
			}

			const foundTab = tabs.filter(tab => tab.menuUrl === location.pathname);
			// 메뉴&탭을 통한 페이지 유입된 경우 또는 window 팝업인 경우
			if (commUtil.isNotEmpty(location.state) || window === Constants.WIN_POPUP.VALUE) {
				setIsLoading(true);
			}
			// URL 직접 입력 후 메뉴 Store에 메뉴 data가 저장된 경우
			else {
				if (commUtil.isNotEmpty(foundTab)) {
					// 이미 tab list에 존재하는 URL 접근 시 기존 탭으로 이동
					moveMenuTab(foundTab[0]);
				} else {
					const params = new URLSearchParams(location.search);
					const queryObj = Object.fromEntries(params?.entries());
					moveMenu(location.pathname, queryObj);
				}
			}
		}
	}, [location.state, isInit]);

	//return route === null ? <ExclusiveScreen /> : isLoading && <Layout route={route} layout={layout} />;

	if (route === null) return <ExclusiveScreen />;
	return isLoading ? <Layout route={route} layout={layout} /> : <ExclusiveScreen />;
};
