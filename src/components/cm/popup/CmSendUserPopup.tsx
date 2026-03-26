// CSS
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import { Button, Form } from 'antd';

// component
import { InputText, InputTextArea, SearchForm } from '@/components/common/custom/form';
import InputQuillEditor from '@/components/common/custom/form/InputQuillEditor';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// API Call Function
import { apiGetUserBySelType } from '@/api/cm/apiCmMain';

interface PropsType {
	callBack?: any;
	close?: any;
	popupType?: string;
	params?: any;
}

const CmSendUserPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, callBack, popupType, params } = props;

	const [popupForm] = Form.useForm(); // 팝업 내부 폼

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	const onSend = () => {
		callBack(popupForm);
	};

	/**
	 * 대상자 노출명 조회
	 * @returns {void}
	 */
	const searchRcvrNm = () => {
		const reqParams = {
			selType: 'userNm',
			userId: params.rcvrId,
		};
		// 대상자 명칭 조회
		apiGetUserBySelType(reqParams).then(res => {
			if (res.statusCode === 0) {
				if (commUtil.isNotEmpty(res.data?.userNm)) {
					let rcvrNm = res.data?.userNm;
					if (commUtil.isNotEmpty(res.data?.department)) {
						rcvrNm = `[${res.data?.department}] ${rcvrNm}`;
					}
					popupForm.setFieldValue('rcvrNm', rcvrNm);
				} else {
					if (close && close instanceof Function) {
						close();
					}
					showAlert(null, '담당자 정보가 없습니다.');
				}
			}
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		searchRcvrNm();
	}, []);

	const titleName = popupType === 'sendEmail' ? '이메일 전송' : popupType === 'sendSms' ? 'SMS 전송' : '전송';

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={titleName} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={popupForm} isAlwaysVisible>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-1">
						<li>
							<InputText name="rcvrNm" label={'대상자'} width={80} disabled />
						</li>
						<li>
							<InputText name="title" label={'제목'} width={80} placeholder={'제목을 입력해주세요.'} />
						</li>
						<li>
							{popupType === 'sendEmail' ? (
								<InputQuillEditor name="contents" label={'내용'} width={80} placeholder={'내용을 입력해주세요.'} />
							) : (
								<InputTextArea
									name="contents"
									label={'내용'}
									width={80}
									autoSize={{ minRows: 8, maxRows: 8 }}
									placeholder={'내용을 입력해주세요.'}
								/>
							)}
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{'닫기'}
				</Button>
				<Button size={'middle'} type="primary" onClick={onSend}>
					{'전송'}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmSendUserPopup;
