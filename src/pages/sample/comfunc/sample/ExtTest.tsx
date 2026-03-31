/*
 ############################################################################
 # FiledataField	: ExtTest.tsx
 # Description		: 외부 연동 테스트 페이지
 # Author			: JGS
 # Since			: 25.07.14
 ############################################################################
*/

// Antd Items
import { Button, Form } from 'antd';
import FileSaver from 'file-saver';

// API
import { apiPostSaveSmsRealTime } from '@/api/cm/apiCmSend';
import {
	apiGetDriverUser,
	apiGetEaiIamTest,
	apiGetEaiTest,
	apiGetSapTest,
	apiGetSendEmailTest,
	apiPostLargeDataExcel,
	apiPostSaveAICsv,
	apiPostSaveFax,
	apiPostSaveSms,
} from '@/api/sample/apiSample';

// Component
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText, SearchForm } from '@/components/common/custom/form';
import PopupReportViewer from '@/components/popup/PopupReportViewer';

const ExtTest = () => {
	const [form] = Form.useForm();
	const refModal = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * SAP 연동 테스트
	 * @returns {void}
	 */
	const onClickSapTest = () => {
		apiGetSapTest(null).then(res => {
			showAlert(null, res.data);
		});
	};

	/**
	 * EAI 연동 테스트
	 * @returns {void}
	 */
	const onClickEaiTest = () => {
		apiGetEaiTest(null).then(res => {
			showAlert(null, res.data);
		});
	};

	/**
	 * EAI IAM 연동 테스트
	 * @returns {void}
	 */
	const onClickEaiIamTest = () => {
		apiGetEaiIamTest(null).then(res => {
			showAlert(null, res.data);
		});
	};

	/**
	 * SMS 전송 테스트
	 * @returns {void}
	 */
	const onClickSendSmsTest = () => {
		if (
			commUtil.isEmpty(form.getFieldValue('title_phone')) ||
			commUtil.isEmpty(form.getFieldValue('cnts_phone')) ||
			commUtil.isEmpty(form.getFieldValue('rcvrNm_phone')) ||
			commUtil.isEmpty(form.getFieldValue('rcvrPhone'))
		) {
			showAlert(null, '필수값을 입력해주세요.');
			return false;
		}
		const params = {
			title: form.getFieldValue('title_phone'),
			cnts: form.getFieldValue('cnts_phone'),
			rcvrNm: form.getFieldValue('rcvrNm_phone'),
			rcvrPhone: form.getFieldValue('rcvrPhone'),
		};
		apiPostSaveSms(params).then(res => {
			//
		});
	};

	/**
	 * Email 전송 테스트
	 * @returns {void}
	 */
	const onClickSendEmailTest = () => {
		if (
			commUtil.isEmpty(form.getFieldValue('title')) ||
			commUtil.isEmpty(form.getFieldValue('cnts')) ||
			commUtil.isEmpty(form.getFieldValue('rcvrNm')) ||
			commUtil.isEmpty(form.getFieldValue('rcvrEmail'))
		) {
			showAlert(null, '필수값을 입력해주세요.');
			return false;
		}
		const params = {
			title: form.getFieldValue('title'),
			cnts: form.getFieldValue('cnts'),
			rcvrNm: form.getFieldValue('rcvrNm'),
			rcvrEmail: form.getFieldValue('rcvrEmail'),
		};
		apiGetSendEmailTest(params).then(res => {
			//
		});
	};

	/**
	 * SMS 전송 (실시간)
	 * @returns {void}
	 */
	const onClickSendSmsReal = () => {
		if (
			commUtil.isEmpty(form.getFieldValue('fromTelNo')) ||
			commUtil.isEmpty(form.getFieldValue('toTelNo')) ||
			commUtil.isEmpty(form.getFieldValue('message'))
		) {
			showAlert(null, '필수값을 입력해주세요.');
			return false;
		}
		const params = {
			sendPhone: form.getFieldValue('fromTelNo'),
			rcvrPhone: form.getFieldValue('toTelNo'),
			cnts: form.getFieldValue('message'),
		};
		apiPostSaveSmsRealTime(params).then(res => {
			//
		});
	};

	/**
	 * FAX 전송
	 * @returns {void}
	 */
	const onClickSendFax = () => {
		if (
			commUtil.isEmpty(form.getFieldValue('trTitle')) ||
			commUtil.isEmpty(form.getFieldValue('trSendfaxnum')) ||
			commUtil.isEmpty(form.getFieldValue('trName')) ||
			commUtil.isEmpty(form.getFieldValue('trPhone'))
		) {
			showAlert(null, '필수값을 입력해주세요.');
			return false;
		}
		const params = {
			trTitle: form.getFieldValue('trTitle'),
			trSendfaxnum: form.getFieldValue('trSendfaxnum'),
			trName: form.getFieldValue('trName'),
			trPhone: form.getFieldValue('trPhone'),
		};
		apiPostSaveFax(params).then(res => {
			//
		});
	};

	/**
	 * 드라이버 사용자 ID 생성
	 * @returns {void}
	 */
	const onClickSaveDriverUser = () => {
		apiGetDriverUser(null).then(res => {
			//
		});
	};

	/**
	 * 대량데이터 엑셀 다운로드
	 * @returns {void}
	 */
	const onClickDownloadLargeDataExcel = () => {
		apiPostLargeDataExcel({ codelist: '' }).then(res => {
			FileSaver.saveAs(res.data, dataRegex.decodeDisposition(res.headers['content-disposition']));
		});
	};

	/**
	 * AI팀 CSV 파일 저장 예제
	 * @returns {void}
	 */
	const onClickSaveAICsv = () => {
		apiPostSaveAICsv(null);
	};

	return (
		<SearchForm
			form={form}
			initialValues={{
				title_phone: '[ SMS ] 전송 테스트 2026-03-06 13:54',
				cnts_phone: '문자 내용은 아무거나 ABCDEF',
				rcvrNm_phone: '홍길동',
				rcvrPhone: '01011112222',
				title: '[ 이메일 ] 전송 테스트 2025-08-04 13:54',
				cnts: '이메일 내용은 아무거나 가나다라마바사',
				rcvrNm: '홍길동',
				rcvrEmail: '받는사람@cj.net',
				fromTelNo: '15770807',
				toTelNo: '01077778888',
				message: '[ SMS ] 전송 테스트 2025-08-04 11:24',
				trTitle: '[테스트] FAX 전송 테스트 2025-09-02 09:37',
				trSendfaxnum: '0221496609',
				trName: 'YTN CJ 17층',
				trPhone: '0221496609',
			}}
		>
			<Button onClick={onClickSapTest}>SAP 연동</Button>

			<br />
			<br />
			<Button onClick={onClickEaiTest}>EAI 연동</Button>

			<br />
			<br />
			<Button onClick={onClickEaiIamTest}>EAI IAM 연동</Button>

			<br />
			<br />
			<InputText name="title_phone" label="제목" />
			<InputText name="cnts_phone" label="내용" />
			<InputText name="rcvrNm_phone" label="수신자명" />
			<InputText name="rcvrPhone" label="수신자 핸드폰 번호" />
			<Button onClick={onClickSendSmsTest}>SMS 전송</Button>

			<br />
			<br />
			<InputText name="title" label="제목" />
			<InputText name="cnts" label="내용" />
			<InputText name="rcvrNm" label="수신자명" />
			<InputText name="rcvrEmail" label="수신자 이메일 주소" />
			<Button onClick={onClickSendEmailTest}>Email 전송 (실시간) [ 외부 메일 발송 막혀 있음 ]</Button>

			<br />
			<br />
			<InputText name="trTitle" label="제목" />
			<InputText name="trSendfaxnum" label="발신자 번호" />
			<InputText name="trName" label="수신자명" />
			<InputText name="trPhone" label="수신자 팩스 번호" />
			<Button onClick={onClickSendFax}>FAX 전송 [ 문서 이미지는 테스트 파일로 고정해 놓음 ]</Button>
			<br />
			<i className={'color-danger'}>※ "모바일팩스"와 비슷한 APP 설치 후 실제로 받을 FAX 번호 만들어서 테스트 진행</i>

			{/* <br />
			<br />
			<InputText name="fromTelNo" label="발신 전화번호" />
			<InputText name="toTelNo" label="수신 전화번호" />
			<InputText name="message" label="메시지" />
			<Button onClick={onClickSendSmsReal}>
				SMS 전송 (실시간) [ 실제 전송 서버 AGENT 꺼져 있음. 테스트시 김혜연님에게 요청 ]
			</Button>

			<br />
			<br />
			<Button onClick={onClickSaveDriverUser}>드라이버 사용자 ID 생성</Button>

			<br />
			<br />
			<Button onClick={onClickDownloadLargeDataExcel}>대량 DATA 엑셀 다운로드</Button>

			<br />
			<br />
			<Button onClick={onClickSaveAICsv}>AI CSV 파일 다운로드</Button> */}

			<CustomModal ref={refModal} width="1280px">
				<PopupReportViewer fileName="RD 테스트" height={660} width="100%" />
			</CustomModal>
		</SearchForm>
	);
};

export default ExtTest;
