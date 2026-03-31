/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelPrintPopup.tsx
 # Description		: 출력선택 팝업
 # Author			: 공두경
 # Since			: 25.11.15
 ############################################################################
*/
//Api
//Api

// lib
import { Button, Form } from 'antd';
import { useTranslation } from 'react-i18next';
// utils
// component
import FormWrap from '@/assets/styled/FormWrap/FormWrap';
import { RadioBox } from '@/components/common/custom/form';
// API Call Function
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// 넘겨받은 Props 타입 정의
type modalProps = {
	close?: any;
};

const WdDeliveryLabelPrintPopup = (props: modalProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { close } = props; // props
	const [form] = Form.useForm();

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 저장
	 */
	async function closePopup() {
		close(form.getFieldValue('printFlag'));
	}

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		//기본값 설정
		form.setFieldValue('printFlag', 'ALL');
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="출력 선택" />
			{/* {입력부} */}
			<Form form={form} className="lab-auto">
				<FormWrap form={form} preserve={false}>
					<li>
						<RadioBox
							label="출력선택"
							options={[
								{ label: '전체', value: 'ALL' },
								{ label: '선택내역', value: 'CHECK' },
							]}
							name="printFlag"
						/>
					</li>
				</FormWrap>
			</Form>
			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL')}</Button> {/* 취소 */}
				<Button type="primary" onClick={closePopup}>
					{t('lbl.BTN_CONFIRM')} {/* 확인 */}
				</Button>
			</ButtonWrap>
		</>
	);
};
export default WdDeliveryLabelPrintPopup;
