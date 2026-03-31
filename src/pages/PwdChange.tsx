/*
 ############################################################################
 # FiledataField	: PwdChange.tsx
 # Description		: 비밀번호 변경
 # Author			: JGS
 # Since			: 25.10.15
 ############################################################################
*/
// lib
import { Button, Form } from 'antd';
import hex from 'crypto-js/enc-hex';
import sha256 from 'crypto-js/sha256';
import { useLocation } from 'react-router-dom';

// component
import Icon from '@/components/common/Icon';

// API
import { apiPostSaveUserPwdNo } from '@/api/cm/apiCmLogin';
import logo from '@/assets/img/login/waylo_logo.png';
import { InputText } from '@/components/common/custom/form';

const PwdChange = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { state } = useLocation();
	const navigate = useNavigate();
	const [visibleCurPwdNo, setVisibleCurPwdNo] = useState(false); // 현재 비밀번호 숨김 상태
	const [visiblePwdNo, setVisiblePwdNo] = useState(false); // 신규 비밀번호 숨김 상태
	const [visibleConfirmPwdNo, setVisibleConfirmPwdNo] = useState(false); // 신규 비밀번호 확인 숨김 상태

	const { VITE_SHA256_SALT_KEY } = import.meta.env; // SHA256 SALT KEY

	// form
	const [pwdChangeForm] = Form.useForm();

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 비밀번호 변경
	 */
	const saveUserPwdNo = async () => {
		const isValid = await validateForm(pwdChangeForm);
		if (!isValid) return;

		// 비밀번호 확인
		if (pwdChangeForm.getFieldValue('pwdNo') !== pwdChangeForm.getFieldValue('confirmPwdNo')) {
			showAlert(null, t('비밀번호가 일치하지 않습니다.'));
			setTimeout(() => {
				pwdChangeForm.setFields([
					{
						name: 'confirmPwdNo',
						errors: [t('비밀번호가 일치하지 않습니다.')], // 강제로 에러 발생
					},
				]);
			});
			document.getElementById('confirmPwdNo').focus();
			return;
		}

		const param = {
			userId: state['userId'],
			// curPwdNo: hex.stringify(sha256(pwdChangeForm.getFieldValue('curPwdNo'))),
			// pwdNo: hex.stringify(sha256(pwdChangeForm.getFieldValue('pwdNo'))),
			curPwdNo: hex.stringify(sha256(pwdChangeForm.getFieldValue('curPwdNo') + VITE_SHA256_SALT_KEY)),
			pwdNo: hex.stringify(sha256(pwdChangeForm.getFieldValue('pwdNo') + VITE_SHA256_SALT_KEY)),
		};

		apiPostSaveUserPwdNo(param).then((res: any) => {
			if (res.statusCode === 0) {
				showConfirm(null, '비밀번호가 정상적으로 변경 되었습니다. 로그인 페이지로 이동 하시겠습니까?', () => {
					// 로그인 페이지로 이동
					const savedLoginPage = localStorage.getItem('savedLoginPage') || '/custLogin';
					return navigate(savedLoginPage);
				});
			}
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<main className="login-main">
			<div className="login-section">
				<div id="loginFrame" className="login-wrap">
					<h1 aria-label="CJ FRESHWAY WMS">
						<img src={logo} alt="logo" />
					</h1>
					<div className="login-form">
						<Form form={pwdChangeForm} layout="vertical">
							<div className="input-form">
								<Form.Item
									name="curPwdNo"
									rules={[{ required: true, message: t('msg.MSG_COM_VAL_001', ['현재 비밀번호']) }]}
								>
									<InputText
										label="현재 비밀번호"
										className="direc-reverse"
										placeholder={t('현재 비밀번호 입력')}
										name="curPwdNo"
										type={visibleCurPwdNo ? 'text' : 'password'}
										prefix={
											<Icon
												icon={visibleCurPwdNo ? 'icon-view' : 'icon-pass-hide'}
												onClick={() => setVisibleCurPwdNo(!visibleCurPwdNo)}
											/>
										}
										allowClear={false}
									/>
								</Form.Item>
								<Form.Item
									name="pwdNo"
									rules={[
										{
											validator: (_, value) => validatePassword(value, state['userId']),
										},
									]}
								>
									<InputText
										label="신규 비밀번호"
										className="direc-reverse"
										placeholder={t('신규 비밀번호 입력')}
										id="pwdNo"
										name="pwdNo"
										type={visiblePwdNo ? 'text' : 'password'}
										prefix={
											<Icon
												icon={visiblePwdNo ? 'icon-view' : 'icon-pass-hide'}
												onClick={() => setVisiblePwdNo(!visiblePwdNo)}
											/>
										}
										allowClear={false}
									/>
								</Form.Item>
								<Form.Item
									name="confirmPwdNo"
									rules={[{ required: true, message: t('msg.MSG_COM_VAL_001', ['신규 비밀번호 확인']) }]}
								>
									<InputText
										label="신규 비밀번호 확인"
										className="direc-reverse"
										placeholder={t('신규 비밀번호 확인 입력')}
										id="confirmPwdNo"
										name="confirmPwdNo"
										type={visibleConfirmPwdNo ? 'text' : 'password'}
										prefix={
											<Icon
												icon={visibleConfirmPwdNo ? 'icon-view' : 'icon-pass-hide'}
												onClick={() => setVisibleConfirmPwdNo(!visibleConfirmPwdNo)}
											/>
										}
										allowClear={false}
									/>
								</Form.Item>
								<Form.Item>
									<Button type="primary" size="large" htmlType="submit" block onClick={saveUserPwdNo}>
										{t('비밀번호 변경')}
									</Button>
								</Form.Item>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</main>
	);
};

export default PwdChange;
