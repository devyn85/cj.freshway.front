/**
 * 메뉴 이동에 관련된 함수 모음
 */
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { useAppDispatch, useAppSelector } from '@/store/core/coreHook';

import { getFindMenu } from '@/store/core/menuStore';
import { getFindTab } from '@/store/core/tabStore';
import Constants from '@/util/constants';

/**
 * LNB 또는 GNB 등을 통해 메뉴를 이동하는 Custom Hook
 * @returns {object} isCanOpen, moveMenu method
 */
export const useMoveMenu = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const tabs = useAppSelector(state => state.tab.tabs);

	const isCanOpen = () => {
		// 열린 탭의 개수와 MAX_TAB_SIZE 비교
		if (tabs.length > Constants.MENU_INFO.MAX_TAB_SIZE) {
			showAlert('', t('msg.tabMaxCountExceed'), false);
			return false;
		} else {
			return true;
		}
	};

	/**
	 * 메뉴 이동 hook
	 * @param {string} url 목적지 url
	 * @param {object} params 목적지로 전달할 param
	 * @returns {void}
	 */
	const moveMenu = (url: string, params = {}) => {
		if (commUtil.isEmpty(url)) return;
		const isExist = getFindTab(url);

		if (isExist) {
			navigateMenu(url, isExist.menuUUID, null, params);
		} else {
			if (isCanOpen()) {
				navigateMenu(url, null, null, params);
			}
		}
	};

	/**
	 * 메뉴 이동 라우터
	 * @param {string} url (필수) url 정보
	 * @param {string} uuid (선택) uuid 없는 경우 신규 발행
	 * @param {object} menuObj (선택) 메뉴 정보
	 * @param {any} params (선택) 추가 params
	 */
	const navigateMenu = (url: string, uuid?: string, menuObj?: object, params?: any) => {
		// uuid 없는 경우 신규 발급
		const naviUuid = uuid ? uuid : uuidv4();
		// 메뉴 권한 정보 저장
		const menuInfo = !commUtil.isEmpty(menuObj) ? menuObj : getFindMenu(url);
		navigate(url, {
			state: { menu: menuInfo, uuid: naviUuid, ...params },
		});

		// TAB 이동시 그리드 사이즈 때문에 'resize' 이벤트 강제 호출
		window.dispatchEvent(new Event('resize'));
	};

	/**
	 * 메뉴 route searchParam
	 * @param {*} location location object
	 * @param {string} menuUrl menuUrl 정보
	 * @returns {string} url + searchparam
	 */
	const setSearchParam = (location: any, menuUrl?: string) => {
		let fullUrl = null;
		// url 정확한 경우 location 사용
		if (commUtil.isEmpty(menuUrl) || location.pathname === menuUrl) {
			fullUrl = commUtil.isEmpty(location.search) ? location.pathname : location.pathname + location.search;
		} else {
			fullUrl = menuUrl;
		}
		return fullUrl;
	};

	return { isCanOpen, moveMenu, navigateMenu, setSearchParam };
};
