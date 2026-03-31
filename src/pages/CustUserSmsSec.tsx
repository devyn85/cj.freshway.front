/*
 ############################################################################
 # FiledataField	: CustUserSmsSec.tsx
 # Description		: 사용자 SMS 인증
 # Author			: JGS
 # Since			: 25.10.01
 ############################################################################
*/
// lib
import { Button, Form } from 'antd';
import hex from 'crypto-js/enc-hex';
import sha256 from 'crypto-js/sha256';

// component
import Icon from '@/components/common/Icon';
import { InputText } from '@/components/common/custom/form';

// API
import {
	apiGetCheckVerificationCode,
	apiGetDupUserIdCnt,
	apiPostSaveUserInfo,
	apiPostSendVerificationCode,
} from '@/api/cm/apiCmLogin';

// Util
import { validatePassword } from '@/util/FormUtil';

const CustUserSmsSec = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [smsForm] = Form.useForm();
	const [isVerificationCode, setIsVerificationCode] = useState(false); // 인증번호 검증 여부
	const [isDupUserId, setIsDupUserId] = useState(false); // 사용자ID 중복 검증 여부
	const [visiblePwdNo, setVisiblePwdNo] = useState(false); // 신규 비밀번호 숨김 상태
	const [visibleConfirmPwdNo, setVisibleConfirmPwdNo] = useState(false); // 비밀번호 확인 숨김 상태

	const { VITE_SHA256_SALT_KEY } = import.meta.env; // SHA256 SALT KEY

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 인증번호 전송
	 */
	const sendVerificationCode = async () => {
		const isValid = await validateForm(smsForm, ['userNm', 'handphoneNo']);
		if (!isValid) return;

		const param = {
			userNm: smsForm.getFieldValue('userNm'),
			handphoneNo: smsForm.getFieldValue('handphoneNo'),
		};

		apiPostSendVerificationCode(param).then((res: any) => {
			if (res.statusCode === 0) {
				showAlert(null, t('인증번호가 발송되었습니다.'));
			}
		});
	};

	/**
	 * 인증번호 검증
	 */
	const checkVerificationCode = async () => {
		const isValid = await validateForm(smsForm, ['handphoneNo', 'securityKey']);
		if (!isValid) return;

		const param = {
			handphoneNo: smsForm.getFieldValue('handphoneNo'),
			securityKey: smsForm.getFieldValue('securityKey'),
		};

		apiGetCheckVerificationCode(param).then((res: any) => {
			if (res.statusCode === 0) {
				setIsVerificationCode(true);
				showAlert(null, t('정상적으로 확인되었습니다.'));
			} else {
				setIsVerificationCode(false);
				smsForm.setFields([
					{
						name: 'securityKey',
						errors: [t('인증번호가 일치하지 않습니다.')], // 강제로 에러 상태
					},
				]);
				document.getElementById('securityKey').focus();
			}
		});
	};

	/**
	 * 사용자ID 중복 체크
	 */
	const checkDupUserId = async () => {
		const isValid = await validateForm(smsForm, ['userId']);
		if (!isValid) return;

		const param = {
			userId: smsForm.getFieldValue('userId'),
		};

		apiGetDupUserIdCnt(param).then((res: any) => {
			if (res.statusCode === 0) {
				if (res.data['dupCnt'] !== '0') {
					setIsDupUserId(false);
					showAlert(null, t('msg.MSG_COM_VAL_029', ['사용자ID'])); // 동일한 {{0}}이(가) 존재합니다.
					smsForm.setFields([
						{
							name: 'userId',
							errors: [t('msg.MSG_COM_VAL_029', ['사용자ID'])], // 강제로 에러 상태
						},
					]);
					document.getElementById('userId').focus();
				} else {
					setIsDupUserId(true);
					showAlert(null, t('사용 가능한 ID입니다.'));
				}
			} else {
				setIsDupUserId(false);
			}
		});
	};

	/**
	 * 사용자 정보 저장
	 */
	const saveUserInfo = async () => {
		const isValid = await validateForm(smsForm);
		if (!isValid) return;

		// 인증번호 검증 여부 체크
		if (!isVerificationCode) {
			showAlert(null, t('인증번호 확인이 되지 않았습니다.'));
			return;
		}

		// 사용자ID 중복 검증 여부
		if (!isDupUserId) {
			showAlert(null, t('사용자ID 중복 확인이 되지 않았습니다.'));
			return;
		}

		// 비밀번호 확인
		if (smsForm.getFieldValue('pwdNo') !== smsForm.getFieldValue('confirmPwdNo')) {
			showAlert(null, t('비밀번호가 일치하지 않습니다.'));
			smsForm.setFields([
				{
					name: 'confirmPwdNo',
					errors: [t('비밀번호가 일치하지 않습니다.')], // 강제로 에러 상태
				},
			]);
			document.getElementById('confirmPwdNo').focus();
			return;
		}

		const param = {
			handphoneNo: smsForm.getFieldValue('handphoneNo'),
			userId: smsForm.getFieldValue('userId'),
			// pwdNo: hex.stringify(sha256(smsForm.getFieldValue('pwdNo'))),
			pwdNo: hex.stringify(sha256(smsForm.getFieldValue('pwdNo') + VITE_SHA256_SALT_KEY)),
		};

		apiPostSaveUserInfo(param).then((res: any) => {
			if (res.statusCode === 0) {
				showConfirm(null, '정상적으로 변경 되었습니다. 로그인 페이지로 이동 하시겠습니까?', () => {
					// 로그인 페이지로 이동
					return navigate('/custLogin');
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
					<h2>사용자 SMS 인증</h2>
					<div className="sms-form">
						<Form className="inner" form={smsForm}>
							<dl>
								<dt>사용자명</dt>
								<dd>
									<InputText
										placeholder={t('사용자명 입력')}
										name="userNm"
										required
										rules={[{ required: true, message: t('msg.MSG_COM_VAL_001', ['사용자명']) }]}
									/>
								</dd>
							</dl>
							<dl>
								<dt>핸드폰번호</dt>
								<dd>
									<div className="inline">
										<InputText
											placeholder={t('핸드폰번호 입력')}
											name="handphoneNo"
											rules={[
												{
													required: true,
													message: t('msg.MSG_COM_VAL_001', ['핸드폰번호']),
												},
												{
													pattern: /^01[016789]-\d{3,4}-\d{4}$/,
													message: '올바른 휴대폰 번호 형식이 아닙니다.',
												},
											]}
											onBlur={(e: any) => {
												const formatted = dataRegex.formatPhone(e.target.value);
												if (commUtil.isNotEmpty(formatted)) {
													smsForm.setFieldsValue({ handphoneNo: formatted });
												}
											}}
										/>
										<Button size="middle" onClick={sendVerificationCode}>
											인증번호 요청
										</Button>
									</div>
								</dd>
							</dl>
							<dl>
								<dt>인증번호</dt>
								<dd>
									<div className="inline">
										<InputText
											placeholder={t('인증번호 입력')}
											name="securityKey"
											maxLength={6}
											rules={[{ required: true, message: t('msg.MSG_COM_VAL_001', ['인증번호']) }]}
										/>
										<Button size="middle" onClick={checkVerificationCode}>
											인증 확인
										</Button>
									</div>
								</dd>
							</dl>
							<dl>
								<dt>사용자ID</dt>
								<dd>
									<div className="inline">
										<InputText
											placeholder={t('사용자ID 입력')}
											name={'userId'}
											rules={[
												{ required: true, message: t('msg.MSG_COM_VAL_001', ['사용자ID']) },
												{ pattern: /^.{4,20}$/, message: '사용자ID는 4~18자리여야 합니다.' },
												{
													validator: (_, value) => {
														if (!value) return Promise.resolve();
														if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value)) {
															return Promise.reject(new Error('한글은 입력할 수 없습니다.'));
														}
														return Promise.resolve();
													},
												},
											]}
										/>
										<Button size="middle" onClick={checkDupUserId}>
											중복 확인
										</Button>
									</div>
								</dd>
							</dl>
							<dl>
								<dt>신규 비밀번호</dt>
								<dd>
									<InputText
										className="direc-reverse"
										type={visiblePwdNo ? 'text' : 'password'}
										prefix={
											<Icon
												icon={visiblePwdNo ? 'icon-view' : 'icon-pass-hide'}
												onClick={() => setVisiblePwdNo(!visiblePwdNo)}
											/>
										}
										placeholder={t('현재 비밀번호 입력')}
										name="pwdNo"
										allowClear={false}
										rules={[
											{
												validator: (_, value) => validatePassword(value, smsForm.getFieldValue('userId')),
											},
										]}
									/>
								</dd>
							</dl>
							<dl>
								<dt>비밀번호 확인</dt>
								<dd>
									<InputText
										className="direc-reverse"
										type={visibleConfirmPwdNo ? 'text' : 'password'}
										prefix={
											<Icon
												icon={visibleConfirmPwdNo ? 'icon-view' : 'icon-pass-hide'}
												onClick={() => setVisibleConfirmPwdNo(!visibleConfirmPwdNo)}
											/>
										}
										placeholder={t('현재 비밀번호 입력')}
										name="confirmPwdNo"
										id="confirmPwdNo"
										allowClear={false}
										rules={[{ required: true, message: t('msg.MSG_COM_VAL_001', ['비밀번호 확인']) }]}
									/>
								</dd>
							</dl>

							<Form.Item>
								<Button type="primary" size="middle" block onClick={saveUserInfo}>
									{t('요청하기')}
								</Button>
							</Form.Item>
						</Form>
					</div>
				</div>
			</div>
		</main>
	);
};

export default CustUserSmsSec;
