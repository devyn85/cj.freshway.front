/*
 ############################################################################
 # FiledataField	: TmCalculationSendemailPopup.tsx
 # Description		: 운송비정산서 이메일 발송 팝업
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.10.20
 ############################################################################
*/

// CSS
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import { Button, Form } from 'antd';

// component
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SearchForm } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// API Call Function
import { apiPostCustEmail } from '@/api/tm/apiTmTrxCalculationReport';

interface PropsType {
	callBack?: any;
	dccode?: string;
	courier?: string;
	courierName?: string;
	slipdtRange?: any;
	params?: any;
	close?: any;
}

const TmCalculationSendemailPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const { callBack, dccode, courier, courierName, slipdtRange, params, close } = props;

	// 팝업 내부 폼
	const [popupForm] = Form.useForm();

	// 운송사 코드
	const courierCd = Form.useWatch('courier', popupForm);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	const onSend = async () => {
		// 입력 값 검증
		const isValid = await validateForm(popupForm);
		if (!isValid) {
			return;
		}

		const searchParams = popupForm.getFieldsValue();
		if (commUtil.isEmpty(searchParams.email)) {
			showAlert(null, '이메일 주소를 입력해주세요.');
			return;
		}

		// 발송 실행
		callBack(popupForm);
	};

	/**
	 * 운송사 이메일 조회
	 * @returns {void}
	 */
	const searchCustEmail = () => {
		const reqParams = {
			courier: popupForm.getFieldValue('courier'),
		};

		apiPostCustEmail(reqParams).then(res => {
			if (res.statusCode === 0) {
				if (res.data && res.data.length > 0 && commUtil.isNotEmpty(res.data[0].email)) {
					const email = res.data[0].email;
					popupForm.setFieldValue('email', email);
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

	/**
	 * 초기화
	 */
	useEffect(() => {
		popupForm.setFieldValue('dccode', props.dccode ?? props.dccode);
		popupForm.setFieldValue('courier', props.courier ?? props.courier);
		popupForm.setFieldValue('courierName', props.courierName ?? props.courierName);
		popupForm.setFieldValue('slipdtRange', props.slipdtRange ?? props.slipdtRange);

		if (props.courier) {
			searchCustEmail();
		}
	}, []);

	/**
	 * 운송사의 이메일 주소 조회
	 */
	useEffect(() => {
		if (courierCd) {
			searchCustEmail();
		}
	}, [courierCd]);

	const titleName = '이메일 전송';

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
							<CmGMultiDccodeSelectBox
								name="dccode" //물류센터
								label={t('lbl.DCCODE')}
								mode="single"
								required
							/>
						</li>
						<li>
							<CmCarrierSearch //운송사
								form={popupForm}
								selectionMode="singleRow"
								name="courierName"
								code="courier"
								returnValueFormat="name"
								required
							/>
						</li>
						<li>
							<Rangepicker //기준일자
								label={t('lbl.BASEDT')}
								name="slipdtRange"
								//defaultValue={dates} // 초기값 설정
								format={'YYYY-MM-DD'} // 화면에 표시될 형식
								span={24}
								allowClear
								showNow={false}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</li>
						<li>
							<InputText
								name="email"
								label={t('lbl.EMAILADDR')}
								width={80}
								placeholder={'이메일 주소를 입력해주세요.'}
								required={true}
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{t('lbl.CLOSE')}
				</Button>
				<Button size={'middle'} type="primary" onClick={onSend}>
					{t('lbl.SEND')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default TmCalculationSendemailPopup;
