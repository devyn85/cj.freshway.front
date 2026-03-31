/*
 ############################################################################
 # FiledataField	: Mail.tsx
 # Description		: MailTemplate
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/
// lib
import { Button, Form, Row } from 'antd';
// utils
import * as messageUtil from '@/util/MessageUtil';
// component
import { DateRange, InputText, SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
// API Call Function
import { apiPostSendSimpleMail } from '@/api/common/apiComfunc';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

const Mail = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// const { menu } = useLocation().state;

	const [form] = Form.useForm();
	const { t } = useTranslation();
	const [searchBox] = useState({
		emailAddr: null,
	});

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const onClickSendMailButton = () => {
		// TO-DO validation
		// if (!searchBoxRef?.current?.checkRequired()) return;
		const params = form.getFieldsValue();
		apiPostSendSimpleMail(params).then(res => {
			if (res.statusCode === 0) {
				// 정상 처리
			} else {
				messageUtil.showAlert('', res.statusMessage);
			}
		});
	};

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle />
			{/* 검색 영역 */}

			<SearchForm form={form} initialValues={searchBox}>
				<UiFilterArea>
					<UiFilterGroup className="grid-column-1">
						<li className={'grid-column-1'}>
							<InputText
								label={t('comfunc.mail.receiver')}
								name="receiverAddr"
								span={21}
								required={true}
								placeholder={t('msg.placeholder2', [t('comfunc.mail.receiver')])}
								onPressEnter={onClickSendMailButton}
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			{/* 메일 양식 */}
			<MailForm />
		</>
	);
};

export default Mail;

/**
 * 메일 양식
 * @returns {*} mail form 컴포넌트
 */
const MailForm = () => {
	return (
		<>
			<div className="table-wrap">
				<table>
					<thead>
						<tr>
							<th scope="col">메일 요소</th>
							<th scope="col">Mail Message member variable</th>
							<th scope="col">설명</th>
							<th scope="col">필수 여부</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>보낼 메일의 내용 템플릿 아이디</td>
							<td>Id (String)</td>
							<td>
								<ul>
									<li>-classpath:static/form/mail/ 내의 .mtp파일 참조</li>
									<li>- html 형식</li>
									<li>- 내용에 {'key'}를 포함해 치환 가능</li>
									<li>- 예: 안녕하세요 {'username'}님.</li>
								</ul>
							</td>
							<td>필수</td>
						</tr>
						<tr>
							<td>보내는이 메일 주소</td>
							<td>Sender</td>
							<td>
								보내는 이로 보여질 메일 주소
								<br />
							</td>
							<td>필수</td>
						</tr>

						<tr>
							<td>보내는이 아이디</td>
							<td>senderId (String)</td>
							<td>보내는 이 ID로 로그 입력시 사용</td>
							<td>필수</td>
						</tr>

						<tr>
							<td>메일 제목 (String)</td>
							<td>title (String)</td>
							<td>보낼 메일의 제목</td>
							<td>필수</td>
						</tr>

						<tr>
							<td>템플렛에 넣을 key-value 값</td>
							<td>
								contentsArgsMap <br />
								(Map &#60;String, String&#62;)
							</td>
							<td>템플릿 내용 안의 {'key'}를 value로 치환하기 위한 Map</td>
							<td>템플릿에 필요할 경우 입력</td>
						</tr>
						<tr>
							<td>받는이 정보 (String)</td>
							<td>
								recipients
								<br />
								(List &#60;InternetAddress&#62;)
							</td>
							<td>
								<ul>
									<li>
										- 받는이의 이름과 주소를 {'"이름<주소>"'} 형태로 .addRecipient(String recipient)를 호출해 추가
									</li>
									<li>- n명일 경우 n번 호출</li>
									<li>- 예: 홍길동&#60;cj@abc.com&#62;</li>
								</ul>
							</td>
							<td>필수</td>
						</tr>
						<tr>
							<td>첨부파일 리스트</td>
							<td>
								AttachFileList <br />
								(List &#60;AttachFile&#62; )
							</td>
							<td>
								<ul>
									<li>- 첨부파일의 upload.dir 이후의 경로를 가진 AttachFile의 list</li>
									<li>- newFileName : 전송될 파일의 새 이름</li>
									<li>- PhysicFilePath : 파일의 경로 (upload.dir 이후 경로)</li>
									<li>- PhysicFileName : 파일의 이름 (PhysicFilePath 내의 이름)</li>
								</ul>
							</td>
							<td>필수 아님</td>
						</tr>
					</tbody>
				</table>
				<p>
					* 기타 <mark>smtpHost, smtpId, smtpPw</mark> 는 property에 없을 경우 참고됩니다.
				</p>
			</div>
		</>
	);
};
