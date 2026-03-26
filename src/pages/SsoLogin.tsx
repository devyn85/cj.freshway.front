/*
 ############################################################################
 # FiledataField	: SsoLogin.tsx
 # Description		: SSO 연동 로그인
 # Author			: JGS
 # Since			: 25.10.13
 ############################################################################
*/
// lib
import { useLocation } from 'react-router-dom';

// Store
import { useAppSelector } from '@/store/core/coreHook';
import store from '@/store/core/coreStore';
import * as TabStore from '@/store/core/tabStore';

const SsoLogin = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const location = useLocation();
	const navigate = useNavigate();
	const tabs = useAppSelector(state => state.tab.tabs);
	const { VITE_APP_AXIOS_BASE_URL } = import.meta.env; // Axios 기본 URL

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		// redirect 하기 위한 로그인 페이지 저장
		localStorage.setItem('savedLoginPage', '/login');

		const accessToken = location?.state?.accessToken;
		const username = location?.state?.username;
		const errorCode = location?.state?.errorCode;
		const cjWorldId = location?.state?.cjWorldId;
		if (commUtil.isNotEmpty(errorCode)) {
			switch (Number(errorCode)) {
				case 40: // 비밀번호 사용기간 만료 전 안내
					showConfirm(
						null,
						'비밀번호 사용 만료기간이 7일 이내입니다. 비밀번호를 변경 하시겠습니까?',
						() => {
							// 비밀번호 변경 페이지로 이동
							return navigate('/PwdChange', { state: { userId: username } });
						},
						() => {
							if (commUtil.isNotEmpty(cjWorldId)) {
								const form = document.createElement('form');
								form.method = 'POST';
								form.action = `${VITE_APP_AXIOS_BASE_URL}/api/cm/sso/v1.0/loginCJWorld?language=KOR&verification_yn=N`;

								const input = document.createElement('input');
								input.type = 'hidden';
								input.name = 'cjworld_id';
								input.value = cjWorldId;

								form.appendChild(input);
								document.body.appendChild(form);

								form.submit();
							} else {
								window.close();
							}
						},
						{ okText: '비밀번호 변경하기', cancelText: '취소' },
					);
					return;
				case 60: // 임시 비밀번호 발급 상태
					showConfirm(
						null,
						'임시 비밀번호 발급 상태입니다. 비밀번호를 변경 하시겠습니까?',
						() => {
							// 비밀번호 변경 페이지로 이동
							return navigate('/PwdChange', { state: { userId: username } });
						},
						() => {
							window.close();
						},
						{ okText: '비밀번호 변경하기', cancelText: '취소' },
					);
					return;
				default: // 로그인 실패
					showAlert(null, '해당 기능에 대한 접근 또는 실행 권한이 없습니다.', () => {
						window.close();
					});
					return;
			}
		} else if (commUtil.isNotEmpty(accessToken)) {
			// 전체 TAB 닫기 (로그인ID가 다를 경우)
			if (username !== localStorage.getItem('username')) {
				store.dispatch(TabStore.setInitTabStore());
			}

			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('username', username);
			localStorage.setItem('isShowAccessInfo', 'Y');

			// HOME 화면 이동
			return navigate(tabs[0].menuUrl, {
				state: { menu: tabs[0], uuid: tabs[0].menuUUID },
			});
		}
	}, []);

	return <></>;
};

export default SsoLogin;
