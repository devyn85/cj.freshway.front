/*
 ############################################################################
 # FiledataField	: WdSendOutOrderSendMailPopup.tsx
 # Description		: 메일 발송 팝업
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.01
 ############################################################################
 */

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import { Button, Form } from 'antd';
import i18next from 'i18next';
import { useEffect } from 'react';

// Type

// Utils
import dayjs from 'dayjs';

// Store
import { useAppSelector } from '@/store/core/coreHook';
import store from '@/store/core/coreStore';
import { setReportParams } from '@/store/report/reportStore';

// Component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { InputText, InputTextArea } from '@/components/common/custom/form';

// API Call Function
import { apiPostSaveEmail, apiSavePrintHistory } from '@/api/wd/apiWdSendOutOrder';

interface PropsType {
	closeEventHandler?: any;
	rptFileName: any;
	sendInfo: any;
	sendData: any;
}

const WdSendOutOrderSendMailPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	const [dis, setDis] = useState(false);
	// Antd Form 사용
	const [form] = Form.useForm();

	const [url, setUrl] = useState<string>('');

	const { VITE_RD_BASE_URL } = import.meta.env; // RD 기본 URL

	//로그인 사용자 정보
	const user = useAppSelector(state => state.user.userInfo);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const handleClose = () => {
		props.closeEventHandler();
	};

	/**
	 * 전송 버튼 클릭 이벤트
	 */
	// const sendMail = async () => {
	// 	const isValid = await validateForm(form);
	// 	if (!isValid) {
	// 		return;
	// 	}

	// 	const attchFile = sendAttachFile();

	// 	const msg = `fc_${dayjs().format('YYYYMMDDHHmmss')}${user.userId}_${props.sendData?.ds_reportHeader[0].docno}`;

	// 	// 저장 파라미터
	// 	const params = {
	// 		...form.getFieldsValue(),
	// 		attchFileName: attchFile,
	// 		sendType: 'RPT',
	// 		// trPhone: form.getFieldValue('recvFaxno'),
	// 		docName: msg,
	// 		sendEmail: 'postmaster@fwportalqa01a.cjfwqa.com',
	// 	};

	// 	const data = {
	// 		printType: 'EMAIL',
	// 		saveList: props.sendData?.ds_reportHeader,
	// 		docName: params.docName,
	// 	};

	// 	// // API 호출
	// 	// apiSavePrintHistory(data).then(res => {
	// 	// 	if (res.statusCode === 0) {
	// 	// 		const data = {
	// 	// 			printType: 'EMAIL',
	// 	// 			saveList: props.sendData?.ds_reportHeader,
	// 	// 		};
	// 	// 		handleClose();
	// 	// 	}
	// 	// });

	// 	apiPostSaveEmail(params).then(res => {
	// 		if (res.statusCode === 0) {
	// 			// API 호출
	// 			apiSavePrintHistory(data).then(res => {
	// 				if (res.statusCode === 0) {
	// 					const data = {
	// 						printType: 'EMAIL',
	// 						saveList: props.sendData?.ds_reportHeader,
	// 					};
	// 					showAlert('', '메일이 발송 되었습니다.');
	// 					handleClose();
	// 				}
	// 			});
	// 		}
	// 	});
	// };

	/**
	 * 이메일을 발송한다.
	 */
	const sendMail = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		const attchFile = await sendAttachFile();

		const msg = `fc_${dayjs().format('YYYYMMDDHHmmss')}${user.userId}_${props.sendData?.ds_reportHeader[0].docno}`;

		const params = {
			...form.getFieldsValue(),
			attchFileName: attchFile,
			sendType: 'RPT',
			docName: msg,
			//sendEmail: 'postmaster@fwportalqa01a.cjfwqa.com',
			sendEmail: props.sendInfo.SEND_EMAIL,
		};

		const data = {
			printType: 'EMAIL',
			saveList: props.sendData?.ds_reportHeader,
			docName: params.docName,
		};

		const res = await apiPostSaveEmail(params);
		if (res.statusCode === 0) {
			const res2 = await apiSavePrintHistory(data);
			if (res2.statusCode === 0) {
				showAlert('', '메일이 발송 되었습니다.');
				handleClose();
			}
		}
	};

	/**
	 * 메일 발송에 첨부할 파일 업로드
	 * @param ms
	 * @returns {string} 업로드된 첨부 파일의 파일명(확장자 포함, 예: "rpt-YYYYMMDDhhmmssSSS.tif")
	 */
	// const sendAttachFile = () => {
	// 	const today = new Date();
	// 	const filename = [
	// 		'RPT',
	// 		String(today.getFullYear()),
	// 		String(today.getMonth() + 1).padStart(2, '0'),
	// 		String(today.getDate()).padStart(2, '0'),
	// 		String(today.getHours()).padStart(2, '0'),
	// 		String(today.getMinutes()).padStart(2, '0'),
	// 		String(today.getSeconds()).padStart(2, '0'),
	// 		String(today.getMilliseconds()).padStart(3, '0'),
	// 	].join('');

	// 	//reportUtil.openRdToAttachFile(fileName, dataSet, '', '', yyyymmddhhmmss, 'jpg');
	// 	//const reportUrl = `${VITE_RD_BASE_URL}/report/ReportingServer/mrd/${fileName}`;
	// 	//const reportUrl = `/app/deploy/report/ReportingServer/mrd/${fileName}`;
	// 	// /app/deploy/report/ReportingServer/report/YYYY/MM/DD/
	// 	reportUtil.openRdToAttachFile(props.rptFileName, props.sendData, '', '', filename, 'tif');

	// 	return filename + '.tif';
	// };

	/**
	 * 대기
	 * @param ms
	 */
	const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

	/**
	 * 리포트 파일을 첨부하기 위해서 invoker 실행
	 * @returns 파일명
	 */
	const sendAttachFile = async () => {
		const today = new Date();
		const filename = [
			'fc_',
			String(today.getFullYear()),
			String(today.getMonth() + 1).padStart(2, '0'),
			String(today.getDate()).padStart(2, '0'),
			String(today.getHours()).padStart(2, '0'),
			String(today.getMinutes()).padStart(2, '0'),
			String(today.getSeconds()).padStart(2, '0'),
			String(today.getMilliseconds()).padStart(3, '0'),
			user.userId,
			'_',
			props.sendData.ds_reportHeader[0].spid,
		].join('');

		// 여기서 끝날 때까지 기다림
		await reportUtil.openRdToAttachFile(props.rptFileName, props.sendData, '', '', filename, 'tif');

		// 완료 후 파일명 반환
		await delay(1000);
		return `${filename}.tif`;
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		// URL 값이 변경되면 상태 업데이트
		if (changedValues.url !== undefined) {
			setUrl(changedValues.url);
		}
	};

	/**
	 * 리포트 뷰어(Agent Viewer) 팝업 열기 함수
	 * @param fileName    - 리포트 파일명(필수)
	 * @param dataSet     - 리포트 데이터셋(필수)
	 * @param params      - 리포트 파라미터
	 * @param title       - 리포트 제목
	 */
	const openHtmlReportViewer = (fileName: string, dataSet: any, params?: any, title?: string) => {
		// 필수값 예외처리
		if (!fileName || typeof fileName !== 'string' || fileName.trim() === '') {
			// 파일명을 찾을 수 없습니다.
			showAlert(null, i18next.t('msg.MSG_RPT_ERR_001'));
			return;
		}
		if (!dataSet || typeof dataSet !== 'object' || Object.keys(dataSet).length === 0) {
			// 데이터를 찾을 수 없습니다.
			showAlert(null, i18next.t('msg.MSG_RPT_ERR_002'));
			return;
		}

		// 디버깅 로그

		// Redux store에 리포트 파라미터 저장
		store.dispatch(setReportParams({ fileName, dataSet, params, title }));

		// 팝업 오픈 (GET/POST 불필요, 단순 window.open)
		const reportViewerUrl = '/cm/CmReportViewer?window=open';
		const width = 1200;
		const height = 900;
		const left = window.screenX + (window.outerWidth - width) / 2;
		const top = window.screenY + (window.outerHeight - height) / 2;
		const windowFeatures = `width=${width},height=${height},left=${left},top=${top},popup=yes`;

		return reportViewerUrl;
		//window.open(reportViewerUrl, 'ReportViewer', windowFeatures);
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// 로딩 시 자동 조회 실행
	useEffect(() => {
		setTimeout(() => {
			//	searchMasterList();

			form.setFieldValue('title', props.sendInfo.EMAIL_TITLE);
			form.setFieldValue('conts', props.sendInfo.EMAIL_CONTS);
			form.setFieldValue('recvName', props.sendInfo.RECV_NAME);
			form.setFieldValue('recvEmail', props.sendInfo.RECV_EMAIL);
			form.setFieldValue('recvEmail2', props.sendInfo.RECV_EMAIL2);
			form.setFieldValue('sendName', props.sendInfo.SEND_NAME);
			form.setFieldValue('sendEmail', props.sendInfo.SEND_EMAIL);

			//form.setFieldValue('url', 'https://cj.cj.net/PT/login.aspx');
			//setUrl('https://cj.cj.net/PT/login.aspx');

			const rptUrl = openHtmlReportViewer(props.rptFileName, props.sendData);
			// //console.log(props);
			form.setFieldValue('url', rptUrl);
			setUrl(rptUrl);
		}, 100);
	});

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={t('lbl.EMAIL_SEND')} func={titleFunc} />

			{/* URL로 HTML 표시 영역 */}
			{url && (
				<div style={{ margin: '16px 0', border: '1px solid #eee', borderRadius: 4, overflow: 'hidden' }}>
					<iframe src={url} title="HTML Preview" style={{ width: '100%', height: 400, border: 'none' }} />
				</div>
			)}

			{/* 화면 상세 영역 정의 */}
			<Form form={form} onValuesChange={onValuesChange}>
				<AGrid>
					<UiDetailViewArea>
						<UiDetailViewGroup>
							<li style={{ gridColumn: '1 / span 4' }}>
								<InputText //제목
									name="title"
									label={t('lbl.TITLE')}
									required={true}
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li style={{ gridColumn: '1 / span 4' }}>
								<InputTextArea //내용
									name="conts"
									label={t('lbl.CONTENT')}
									autoSize={{ minRows: 3, maxRows: 15 }}
									required={true}
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li style={{ gridColumn: '1 / span 4' }}>
								<InputText //수신자
									name="recvName"
									label={t('lbl.TR_RECEIVER')}
									readOnly={true}
									required={true}
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li style={{ gridColumn: '1 / span 2' }}>
								<InputText //수신자이메일
									name="recvEmail"
									label={t('lbl.TR_RECEIVEREMAIL')}
									required={true}
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li style={{ gridColumn: '3 / span 2' }}>
								<InputText //수신자이메일2
									name="recvEmail2"
									label={t('lbl.TR_RECEIVEREMAIL2')}
								/>
							</li>
							<li style={{ gridColumn: '1 / span 2' }}>
								<InputText //송신자
									name="sendName"
									label={t('lbl.TR_SENDER')}
									readOnly={true}
									required={true}
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li style={{ gridColumn: '3 / span 4' }}>
								<InputText //송신자이메일
									name="sendEmail"
									label={t('lbl.TR_SENDEREMAIL')}
									readOnly={true}
									required={true}
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
						</UiDetailViewGroup>
					</UiDetailViewArea>
				</AGrid>
			</Form>

			{/* 버튼 영역 정의 */}
			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={handleClose}>
					취소
				</Button>
				<Button size={'middle'} onClick={sendMail} type="primary">
					전송
				</Button>
			</ButtonWrap>
		</>
	);
};

export default WdSendOutOrderSendMailPopup;
