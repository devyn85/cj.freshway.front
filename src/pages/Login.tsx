/*
 ############################################################################
 # FiledataField	: Login.tsx
 # Description		: 로그인
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/
// lib
import { Button, Checkbox, Form, Input } from 'antd';
import hex from 'crypto-js/enc-hex';
import sha256 from 'crypto-js/sha256';
// utils
import { useAppDispatch, useAppSelector } from '@/store/core/coreHook';
import { setLocale } from '@/store/core/userStore';
import { showAlert } from '@/util/MessageUtil';
// Store
import { fetchGrpCommCode } from '@/store/core/comCodeStore';
import store from '@/store/core/coreStore';
import * as TabStore from '@/store/core/tabStore';

// component
import Icon from '@/components/common/Icon';
// API Call Function
import { apiPostAuthLogin } from '@/api/cm/apiCmLogin';
import logo from '@/assets/img/login/waylo_logo.png';

const Login = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const tabs = useAppSelector(state => state.tab.tabs);
	const lang = useAppSelector(state => state.user.locale);
	// form
	const [loginForm] = Form.useForm();
	// Ref
	const refModal = useRef(null);
	const refPwModal = useRef(null);

	const [saveId, setSaveId] = useState(false); // 아이디 저장 여부
	const [visiblePwdNo, setVisiblePwdNo] = useState(false); // 비밀번호 숨김 상태

	const { VITE_SHA256_SALT_KEY } = import.meta.env; // SHA256 SALT KEY

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// 로그인
	const lastSubmitRef = useRef(0);
	const doLogin = async (verificationYn?: string) => {
		// 1초 이내 여러번 호출시 무시
		const now = Date.now();
		if (now - lastSubmitRef.current < 1000) return;
		lastSubmitRef.current = now;

		// todo : VALIDATION
		await loginForm.validateFields();

		// 협력사 직원 로그인 되지 않게 방지
		if (loginForm.getFieldValue('username')?.includes('_WAYLO')) {
			showAlert('', '로그인 정보가 잘못되었습니다.');
			return false;
		}

		if (saveId) {
			localStorage.setItem('savedUserId', loginForm.getFieldValue('username'));
		} else {
			localStorage.removeItem('savedUserId');
		}

		// redirect 하기 위한 로그인 페이지 저장
		localStorage.setItem('savedLoginPage', '/login');

		const param = {
			username: loginForm.getFieldValue('username'),
			// password: hex.stringify(sha256(loginForm.getFieldValue('password'))),
			password: hex.stringify(sha256(loginForm.getFieldValue('password') + VITE_SHA256_SALT_KEY)),
			verificationYn: verificationYn,
		};

		apiPostAuthLogin(param).then(res => {
			if (res.statusCode !== -1) {
				switch (res.statusCode) {
					case 0: // 성공
						const token = res.data;

						// 전체 TAB 닫기 (로그인ID가 다를 경우)
						if (param.username !== localStorage.getItem('username')) {
							store.dispatch(TabStore.setInitTabStore());
						}

						localStorage.setItem('accessToken', token.accessToken);
						localStorage.setItem('username', param.username);
						localStorage.setItem('isShowAccessInfo', 'Y');

						// HOME 화면 이동
						return navigate(tabs[0].menuUrl, {
							state: { menu: tabs[0], uuid: tabs[0].menuUUID },
						});
					case 40: // 비밀번호 사용기간 만료 전 안내
						showConfirm(
							null,
							'비밀번호 사용 만료기간이 7일 이내입니다. 비밀번호를 변경 하시겠습니까?',
							() => {
								// 비밀번호 변경 페이지로 이동
								return navigate('/PwdChange', { state: { userId: loginForm.getFieldValue('username') } });
							},
							() => {
								doLogin('N');
							},
							{ okText: '비밀번호 변경하기', cancelText: '다음에 변경하기' },
						);
						return;
					case 60: // 임시 비밀번호 발급 상태
						showConfirm(
							null,
							'임시 비밀번호 발급 상태입니다. 비밀번호를 변경 하시겠습니까?',
							() => {
								// 비밀번호 변경 페이지로 이동
								return navigate('/PwdChange', { state: { userId: loginForm.getFieldValue('username') } });
							},
							null,
							{ okText: '비밀번호 변경하기', cancelText: '취소' },
						);
						return;
					default: // 로그인 실패
						showAlert('', res.statusMessage, false);
						return;
				}
			}
		});
	};

	/**
	 *	locale 변경
	 * @param {string} value 변경할 locale
	 * @returns {void}
	 */
	function onChangeLocale(value: string) {
		dispatch(setLocale(value));
	}

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		fetchGrpCommCode();

		// 다국어 기본 세팅
		loginForm.setFieldValue('formLocale', lang);

		// 아이디 저장 체크
		const savedId = localStorage.getItem('savedUserId');
		if (savedId) {
			loginForm.setFieldValue('username', savedId.replace('_WAYLO', ''));
			setSaveId(true);
		}
	}, []);

	return (
		<main className="login-main">
			<div className="login-section">
				<div id="loginFrame" className="login-wrap">
					<h1 aria-label="CJ FRESHWAY WMS">
						<img src={logo} alt="logo" />
					</h1>
					<div className="login-form">
						<Form form={loginForm} onFinish={() => doLogin()} layout="vertical">
							<div className="input-form">
								<Form.Item name="username" rules={[{ required: true, message: t('login.idValid') }]}>
									<Input prefix={<Icon icon="" />} placeholder={t('아이디 입력')} id="username" name="username" />
								</Form.Item>
								<Form.Item rules={[{ required: true, message: t('login.idValid') }]} name="password">
									<Input
										className="direc-reverse"
										type={visiblePwdNo ? 'text' : 'password'}
										prefix={
											<Icon
												icon={visiblePwdNo ? 'icon-view' : 'icon-pass-hide'}
												onClick={() => setVisiblePwdNo(!visiblePwdNo)}
											/>
										}
										placeholder={t('비밀번호 입력')}
										id="password"
										name="password"
									/>
								</Form.Item>
								<Form.Item>
									<Checkbox checked={saveId} onChange={e => setSaveId(e.target.checked)}>
										아이디 저장
									</Checkbox>
								</Form.Item>
								<Form.Item>
									<Button type="primary" size="large" htmlType="submit" block>
										{t('로그인')}
									</Button>
								</Form.Item>
							</div>

							<div className="info-desc">
								<div>계정 및 비밀번호 확인 안내</div>
								<ul>
									<li>- Chrome과 Edge 브라우저에 최적화되어 있습니다.</li>
									<li>- 비밀번호 3회 입력 오류 시 비밀번호 초기화가 필요합니다.</li>
									<li>- 대표ID 관리자에게 연락하여 조치를 취하시기 바랍니다.</li>
								</ul>
							</div>
						</Form>
					</div>
				</div>
			</div>
			<footer>
				<p>
					본 시스템은 CJ프레시웨이와 계약된 법인 및 해당 법인에서 허용한 직원만 사용하실 수 있습니다.
					<br />
					불법적인 접근 및 사용시 관련 법규에 의해 처벌될 수 있습니다.
					<br />
					<br />
					Copyright © CJ Freshway Corp. All Rights Reserved.
				</p>
			</footer>
		</main>
	);
};

export default Login;
