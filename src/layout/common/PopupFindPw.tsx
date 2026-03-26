/*
 ############################################################################
 # FiledataField	: PopupFindPw.tsx
 # Description		: 비밀번호 찾기 팝업
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import { Button, Col, Form, Input, Row } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// utils
import commUtil from '@/util/commUtil';
import dataRegex from '@/util/dataRegex';
import { showAlert } from '@/util/MessageUtil';
import hex from 'crypto-js/enc-hex';
import sha256 from 'crypto-js/sha256';
// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import FormWrap from '@/assets/styled/FormWrap/FormWrap';
import MenuTitle from '@/components/common/custom/MenuTitle';
// API Call Function
import {
	apiPostCheckVerificationCode,
	apiPostFindPwdSearch,
	apiPostSendVerificationCode,
} from '@/api/common/apiCommon';

const PopupFindPw = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();
	// variable
	const [formParam, setFormParam] = useState({
		userId: '',
		email: '',
		vrfctnCd: '',
		pwd: '',
		pwdCheck: '',
	});
	const [beforeData, setBeforeData] = useState({
		userId: '',
		email: '',
	});
	const [pwDisabled, setPwDisabled] = useState(true);
	const [isSendVerif, setIsSendVerif] = useState(false);
	const [isCheck, setIsCheck] = useState(false);

	const { VITE_SHA256_SALT_KEY } = import.meta.env; // SHA256 SALT KEY

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 * @param {*} e param 변경 이벤트
	 */
	//input에 입력될 때마다 state값 변경되게 하는 함수
	const onChangeParam = (e: any) => {
		setFormParam({
			...formParam,
			[e.target.name]: e.target.value,
		});
	};

	/**
	 * 인증코드 전송
	 * @function sendVerificationCode
	 * @returns {void}
	 */
	function sendVerificationCode() {
		// 초기값
		setIsSendVerif(false);
		form.setFieldValue('pwd', '');
		form.setFieldValue('pwdCheck', '');
		// id
		if (commUtil.isEmpty(formParam.userId)) {
			showAlert('', t('login.idValid'), false);
			return;
		}
		// email
		if (commUtil.isEmpty(formParam.email)) {
			showAlert('', t('com.msg.errFindEmail'), false);
			return;
		}
		// email 규칙
		if (!dataRegex.validEmail(formParam.email)) {
			showAlert('', t('com.msg.wrongEmail'), false);
			return false;
		}

		// api
		const params = {
			...formParam,
			// pwd: hex.stringify(sha256(formParam.pwd)),
			// pwdCheck: hex.stringify(sha256(formParam.pwdCheck)),
			pwd: hex.stringify(sha256(formParam.pwd + VITE_SHA256_SALT_KEY)),
			pwdCheck: hex.stringify(sha256(formParam.pwdCheck + VITE_SHA256_SALT_KEY)),
		};
		apiPostSendVerificationCode(params).then(res => {
			tranCallBack('send', res);
		});
	}
	/**
	 * callback 일괄 처리
	 * @param {string} type callback type
	 * @param {*} data callback data
	 * @returns {*} callback result
	 */
	function tranCallBack(type: string, data: any) {
		if (type == 'send') {
			// 인증코드 전송
			if (data.data.successYn === '1') {
				setIsSendVerif(true);
				setIsCheck(false);
				setFormParam(formParam => {
					formParam.vrfctnCd = data.data.verificationCd;
					return { ...formParam };
				});
				setBeforeData({ userId: formParam.userId, email: formParam.email });
				timerStart();
			} else {
				timerStop();
				showAlert('', t('com.msg.invalidInfo'), false);
				return;
			}
		} else if (type === 'confirm') {
			// 인증코드 확인
			if (data.data.successYn === '1') {
				timerStop();
				clearCheckedData();
				setIsSendVerif(true);
				setIsCheck(true);
				setPwDisabled(pwDisabled => {
					pwDisabled = isSendVerif && isCheck ? true : false;
					return pwDisabled;
				});
			} else {
				showAlert('', t('com.msg.invalidInfo'), false);
			}
		} else if (type == 'update') {
			// 비밀번호 변경
			if (data.data.successYn === '1') {
				showAlert('', t('com.msg.changeDone'), () => {
					ref.current.handlerClose();
				});
			} else {
				// api error message
				showAlert('', data.statusMessage, false);
			}
		}
	}

	/**
	 * #################### 타이머 ####################
	 */
	//	const [timeCounter, setTimeCounter] = useState<number>(60);
	let timeCounter = 0;
	const [timerStr, setTimerStr] = useState('');
	// let interval: any = null;
	const timeRef = useRef(null);

	/**
	 * 인증 코드 발송 이후 타이머 동작
	 * @returns {*} timer ref
	 */
	function timerStart() {
		clearInterval(timeRef.current);
		//setTimeCounter(60);
		timeCounter = 60;
		timeRef.current = setInterval(() => {
			timeCounter = timeCounter - 1; //1초씩 감소
			setTimerStr(convertTime(timeCounter));
			if (timeCounter <= 0) {
				timerStop();
				setTimerStr(t('login.findPwPopup.timeout'));
			}
		}, 1000);
		return timeRef.current;
	}

	/**
	 * 타이머 변환
	 * @param {number} timeCounter 타이머 시간
	 * @returns {string} time을 시간 형식으로 변환
	 */
	function convertTime(timeCounter: number) {
		// 시간 형식으로 변환 리턴
		const minutes = Math.floor(timeCounter / 60); // 값은 2
		const secondes = timeCounter % 60; // 값은 3

		//		const time = timeCounter / 60;
		//		const minutes = time;
		//		const secondes = Math.round((time - minutes) * 60);
		return minutes.toString().padStart(2, '0') + ':' + secondes.toString().padStart(2, '0');
	}

	/**
	 * 타이머 멈춤
	 */
	function timerStop() {
		clearInterval(timeRef.current);
	}
	/**
	 * 데이터 초기값
	 */
	function clearCheckedData() {
		timeCounter = 0;
		setIsSendVerif(false);
		setIsCheck(false);
		setTimerStr('');
	}
	/**
	 * 인증코드 확인
	 */
	function checkVerificationCode() {
		setIsCheck(false);
		// 인증코드 전송 확인
		if (!isSendVerif) {
			// focus 적용
			showAlert('', t('login.findPwPopup.noCode'), false);
			return;
		}

		// 인증코드 입력
		if (commUtil.isEmpty(formParam.vrfctnCd)) {
			showAlert('', t('login.findPwPopup.inputCode'), false);
			return;
		}

		// 인증 코드 확인 완료
		if (isCheck) {
			showAlert('', t('login.findPwPopup.aleadyCheck'), false);
			return;
		}

		// 데이터 검증
		if (!checkSendData()) {
			showAlert('', t('login.findPwPopup.differentCode'), false);
			return;
		}

		// api 호출
		const params = { ...formParam };
		apiPostCheckVerificationCode(params).then(res => {
			tranCallBack('confirm', res);
		});
	}
	/**
	 * 데이터 값 비교
	 * @returns {boolean} send data 검증 여부
	 */
	function checkSendData() {
		if (beforeData.userId != formParam.userId || beforeData.email != formParam.email) {
			return false;
		}
		return true;
	}

	/**
	 * 확인 버튼
	 */
	function changePassword() {
		//먼저 인증코드 전송을 해주세요
		if (!isSendVerif) {
			showAlert('', t('login.findPwPopup.noCode'), false);
			return;
		}

		//먼저 인증코드를 확인 해주세요
		if (!isCheck) {
			showAlert('', t('login.findPwPopup.differentCode'), false);
			return;
		}

		// 데이터 검증
		if (!checkSendData()) {
			showAlert('', t('login.findPwPopup.differentCode'), false);
			return;
		}

		// 비밀번호
		if (commUtil.isEmpty(formParam.pwd)) {
			showAlert('', t('login.pwValid'), false);
			return;
		}

		// 비밀번호 확인
		if (commUtil.isEmpty(formParam.pwdCheck)) {
			showAlert('', t('login.findPwPopup.pwConfirmValid'), false);
			return;
		}

		// 비밀번호, 비밀번호 확인
		if (formParam.pwd != formParam.pwdCheck) {
			showAlert('', t('login.findPwPopup.differentPassword'), false);
			return;
		}

		// 비밀번호 조건
		// 8자리 이상
		if (formParam.pwd.length < 8) {
			showAlert('', t('login.findPwPopup.checkPwLengs'), false);
			return;
		}

		// 영문, 숫자, 특수문자 중 2종 이상 혼용
		if (
			(!dataRegex.validNumber(formParam.pwd) && !dataRegex.validSpecial(formParam.pwd)) ||
			(!dataRegex.validNumber(formParam.pwd) && !dataRegex.validEng(formParam.pwd)) ||
			(!dataRegex.validSpecial(formParam.pwd) && !dataRegex.validEng(formParam.pwd))
		) {
			showAlert('', t('login.findPwPopup.pwValidRule'), false);
			return;
		}

		// api
		// const params = { ...formParam };
		const params = {
			...formParam,
			// pwd: hex.stringify(sha256(formParam.pwd)),
			// pwdCheck: hex.stringify(sha256(formParam.pwdCheck)),
			pwd: hex.stringify(sha256(formParam.pwd + VITE_SHA256_SALT_KEY)),
			pwdCheck: hex.stringify(sha256(formParam.pwdCheck + VITE_SHA256_SALT_KEY)),
		};
		apiPostFindPwdSearch(params).then(res => {
			tranCallBack('update', res);
		});
	}

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		form.setFieldsValue(formParam);
	}, [formParam]);

	return (
		<>
			{/* 비밀번호 변경 */}
			<MenuTitle name={t('login.findPwPopup.title')} />
			<FormWrap form={form}>
				<Row>
					<Col span={24}>
						{/* 로그인ID */}
						<Form.Item label={t('login.findPwPopup.id')}>
							<Input
								placeholder={t('msg.placeholder2', [t('login.findPwPopup.id')])}
								name="userId"
								onChange={onChangeParam}
							/>
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						{/* email */}
						<Form.Item label={t('login.findPwPopup.email')}>
							<Input
								placeholder={t('com.msg.placeholder1', [t('login.findPwPopup.email')])}
								name="email"
								onChange={onChangeParam}
							/>
							<Button onClick={sendVerificationCode}>{t('login.findPwPopup.emailBtn')}</Button>
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						{/* 인증코드 */}
						<Form.Item label={t('login.findPwPopup.code')} className="flex-wrap">
							<div>
								<Input
									placeholder={t('msg.placeholder2', [t('login.findPwPopup.code')])}
									name="vrfctnCd"
									value={formParam.vrfctnCd}
									onChange={onChangeParam}
								/>
								<Button onClick={checkVerificationCode}>{t('login.findPwPopup.codeBtn')}</Button>
							</div>
							{commUtil.isEmpty(timerStr) ? null : <a className="time">{timerStr}</a>}
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						{/* 비밀번호 */}
						<Form.Item label={t('login.findPwPopup.pwd')}>
							<Input
								placeholder={t('msg.placeholder2', [t('login.findPwPopup.pwd')])}
								disabled={pwDisabled}
								type="password"
								name="pwd"
								onChange={onChangeParam}
							/>
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Form.Item label={t('login.findPwPopup.pwdConfirm')}>
							<Input
								placeholder={t('login.findPwPopup.pwdConfirmMsg')}
								disabled={pwDisabled}
								type="password"
								name="pwdCheck"
								onChange={onChangeParam}
							/>
						</Form.Item>
					</Col>
				</Row>
			</FormWrap>
			<ButtonWrap data-props="single">
				<Button type="primary" onClick={changePassword}>
					{t('com.btn.confirm')}
				</Button>
			</ButtonWrap>
		</>
	);
});

export default PopupFindPw;
