/*
 ############################################################################
 # FiledataField	: WdSendOutOrderSendFaxPopup.tsx
 # Description		: 팩스 발송 팝업
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

// Store
import { useAppSelector } from '@/store/core/coreHook';
import store from '@/store/core/coreStore';
import { setReportParams } from '@/store/report/reportStore';

// Component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { InputText } from '@/components/common/custom/form';

// API Call Function
import { apiPostSaveFax, apiSavePrintHistory } from '@/api/wd/apiWdSendOutOrder';
import CmFaxHistoryPopup from '@/components/cm/popup/CmFaxHistoryPopup';
import CustomModal from '@/components/common/custom/CustomModal';

interface PropsType {
	closeEventHandler?: any;
	rptFileName: any;
	sendInfo: any;
	sendData: any;
}

const WdSendOutOrderSendFaxPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	const [url, setUrl] = useState<string>('');

	const { VITE_RD_BASE_URL } = import.meta.env; // RD 기본 URL

	//로그인 사용자 정보
	const user = useAppSelector(state => state.user.userInfo);

	// 팩스 이력 조회  팝업용 Ref
	const refFaxHistoryModal = useRef(null);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const handleClose = () => {
		props.closeEventHandler();
	};

	/**
	 * 팩스 발송 이력 조회
	 */
	const searchFaxHistory = () => {
		refFaxHistoryModal.current.handlerOpen();
	};

	/**
	 * 팩스 이력 조회 팝업 닫기
	 */
	const closeEventFaxHistoryPopup = () => {
		refFaxHistoryModal.current.handlerClose();
	};

	/**
	 * 팩스를 발송한다.
	 */
	const sendFax = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		const today = new Date();
		const attchFile = await sendAttachFile();
		const fullAttachFile =
			String(today.getFullYear()) +
			'/' +
			String(today.getMonth() + 1).padStart(2, '0') +
			'/' +
			String(today.getDate()).padStart(2, '0') +
			'/' +
			attchFile;

		//const msg = `fc_${dayjs().format('YYYYMMDDHHmmss')}${user.userId}_${props.sendData?.ds_reportHeader[0].docno}`;

		// 저장 파라미터
		const params = {
			...form.getFieldsValue(),
			attchFileName: fullAttachFile,
			sendType: 'RPT',
			trName: form.getFieldValue('recvName'),
			trPhone: form.getFieldValue('recvFaxno'),
			trPhone2: form.getFieldValue('recvFaxno2'),
			trDocname: fullAttachFile,
		};

		const data = {
			printType: 'FAX',
			saveList: props.sendData?.ds_reportHeader,
			docName: params.trDocname,
		};

		const res = await apiPostSaveFax(params);
		if (res.statusCode === 0) {
			const res2 = await apiSavePrintHistory(data);
			if (res2.statusCode === 0) {
				showAlert('', '팩스가 발송 되었습니다.');
				handleClose();
			}
		}

		// apiSavePrintHistory(data).then(res => {
		// 	if (res.statusCode === 0) {
		// 		handleClose();
		// 	}
		// });

		// apiPostSaveFax(params).then(res => {
		// 	if (res.statusCode === 0) {
		// 		apiSavePrintHistory(data).then(res => {
		// 			if (res.statusCode === 0) {
		// 				handleClose();
		// 			}
		// 		});
		// 	}
		// });
	};

	// /**
	//  * 팩스 발송에 첨부할 파일 업로드
	//  * @returns {string} 업로드된 첨부 파일의 파일명(확장자 포함, 예: "rpt-YYYYMMDDhhmmssSSS.tif")
	//  */
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

		return reportViewerUrl;
	};

	/**
	 * 리포트 뷰어(Agent Viewer) 팝업 열기 함수
	 * @param fileName    - 리포트 파일명(필수)
	 * @param dataSet     - 리포트 데이터셋(필수)
	 * @param params      - 리포트 파라미터
	 * @param title       - 리포트 제목
	 */
	const openAgentReportViewer = (fileName: string, dataSet: any, params?: any, title?: string) => {
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

		// 1. url 설정
		const reportUrl = `${VITE_RD_BASE_URL}/report/ReportingServer/mrd/${fileName}`;

		// 2. dataSet xml 변환
		const xml = reportUtil.makeRdXml(dataSet);

		// 3. 파라미터 문자열 생성
		// 파라미터가 N 개인 경우(|로 구분)
		// params = 'INVOICE_TITLE1=납품서 (공급받는자용)';
		// params+= '|INVOICE_TITLE2=납품서 (공급받는자용)';
		// params 예시: 'INVOICE_TITLE1=납품서 (공급받는자용)|INVOICE_TITLE2=납품서 (공급받는자용)'
		const rvParam = reportUtil.makeRvParam(params);

		// 디버깅 로그

		// ClientAgentInvoker 인스턴스 생성 및 설정
		if (window.m2soft?.crownix?.ClientAgentInvoker) {
			const invoker = new window.m2soft.crownix.ClientAgentInvoker('ws://localhost:8571/');

			invoker.setReadTimeout(30 * 1000);
			invoker.setConnectTimeout(30 * 1000);
			invoker.setStayConnection(false);
			invoker.setUseAliveCheck(false);

			invoker.addParameter('opcode', 'preview');
			invoker.addParameter('protocol', 'async');
			invoker.addParameter('mrdList', [
				{
					mrdPath: reportUrl,
					mrdParam: rvParam,
					// 파라미터 예시: "mrdParam": '/rv [TITLE=TEST] /rpaperlength [1000] /rpaperwidth [1000]',
					setRData: xml,
				},
			]);
			invoker.addParameter('previewOption', {
				width: 1200,
				height: 1000,
				title: title || 'ClientAgent',
				zoomRatio: 100,
			});

			invoker.invoke(function (e: any) {
				if (e.type === 'error') {
					const downloadUrl = `${VITE_RD_BASE_URL}/report/ReportingServer/Crownix%20Client%20Agent%208.0u.exe`;
					showConfirm(null, i18next.t('msg.MSG_RPT_CFM_001'), () => {
						window.open(downloadUrl, '_blank');
					});
					return;
				}
			});
		} else {
		}

		return reportUrl;
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
			form.setFieldValue('trTitle', props.sendInfo.FAX_TITLE);
			form.setFieldValue('recvName', props.sendInfo.RECV_NAME);
			form.setFieldValue('recvFaxno', props.sendInfo.RECV_FAX);
			form.setFieldValue('recvFaxno2', props.sendInfo.RECV_FAX2);
			form.setFieldValue('sendName', props.sendInfo.SEND_NAME);
			form.setFieldValue('sendFaxno', props.sendInfo.SEND_FAX);

			const rptUrl = openHtmlReportViewer(props.rptFileName, props.sendData);
			form.setFieldValue('url', rptUrl);

			setUrl(rptUrl);
		}, 100);
	});

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={t('lbl.FAX_SEND')} func={titleFunc} />

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
									name="trTitle"
									label={t('lbl.TITLE')}
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
								<InputText //수신자FAX번호
									name="recvFaxno"
									label={t('lbl.TR_RECEIVERFAXNUM')}
									required={true}
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li style={{ gridColumn: '3 / span 4' }}>
								<InputText //수신자FAX번호2
									name="recvFaxno2"
									label={t('lbl.TR_RECEIVERFAXNUM2')}
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
								<InputText //송신자FAX번호
									name="sendFaxno"
									label={t('lbl.TR_SENDERFAXNUM')}
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
					{t('lbl.BTN_CANCEL')}
				</Button>
				<Button size={'middle'} onClick={sendFax} type="primary">
					{t('lbl.SEND')}
				</Button>
				<Button size={'middle'} onClick={searchFaxHistory} type="primary">
					{t('lbl.SERIALINFOTAB')}
				</Button>
			</ButtonWrap>

			{/* 팩스 이력 조회 팝업 영역 정의 */}
			<CustomModal ref={refFaxHistoryModal} width="1000px">
				<CmFaxHistoryPopup callBack={searchFaxHistory} close={closeEventFaxHistoryPopup}></CmFaxHistoryPopup>
			</CustomModal>
		</>
	);
};

export default WdSendOutOrderSendFaxPopup;
