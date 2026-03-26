/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelForcePop.tsx
 # Description		: 출고 > 출고 > 배송 라벨 출력(예외 기준 적용) POP
 # Author			: KimDongHan
 # Since			: 2025.10.17
 ############################################################################
*/

import { apiPostPopMasterList, apiPostSavePopMasterList } from '@/api/wd/apiWdDeliveryLabelForce';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import { InputText, MultiInputText, SearchFormResponsive } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { Button } from 'antd';

const WdDeliveryLabelForcePop = ({ popupForm, initValues, close }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	const [deliverydt, setDeliverydt] = useState('');
	const [yn, setYn] = useState('');

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 조회
	const searchPopMasterList = async () => {
		const requestParams = popupForm.getFieldsValue();
		requestParams.taskdt = requestParams.taskdt.format('YYYYMMDD');

		const { data } = await apiPostPopMasterList(requestParams);

		setDeliverydt(data?.[0]?.deliverydt);
		setYn(data?.[0]?.yn);

		popupForm.setFieldsValue({
			docno: data?.[0]?.docno,
		});
	};

	// 저장
	const saveMasterList = async () => {
		// 유효성 검사 필수 항목
		const isValid = await validateForm(popupForm);

		if (!isValid) {
			return;
		}

		const requestParams = popupForm.getFieldsValue();
		requestParams.taskdt = requestParams.taskdt.format('YYYYMMDD');

		// const { data } = await apiPostPopMasterList(requestParams);

		// let yn = data?.[0]?.yn;
		// if (yn !== 'X') {
		// 	// 이미 등록된 STO가 있습니다.
		// 	showAlert(null, t('msg.MSG_WD_DELIVERY_LABEL_FORCE_003'));
		// 	return;
		// }

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), async () => {
			const params = {
				dccode: requestParams.dccode,
				taskdt: requestParams.taskdt,
				docno: requestParams.docno,
			};

			// 저장 API 호출
			apiPostSavePopMasterList(params).then(res => {
				// 저장 성공시
				if (res.statusCode === 0) {
					// 저장 되었습니다.
					showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
						// 창닫기
						close();
					});
				}
				// 실패시는 서버에서 에러 메시지를 보여줌
			});
		});
	};

	/**
	 * =====================================================================
	 *  02. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		searchPopMasterList();
	}, []);

	/**
	 * ==========================================================================
	 -  AUI Grid Event Initailize
	 - [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={t('lbl.OTHER_CENTER_STOCK_STO_REG')} />

			{/* 조회 컴포넌트 */}
			<SearchFormResponsive form={popupForm} initialValues={initValues} groupClass="grid-column-2">
				<li>
					{/* 물류센터 */}
					<InputText label={t('lbl.DCCODE')} name="dccode" readOnly />
				</li>
				<li>
					{/* 물류센터명 */}
					<InputText label={t('lbl.DCNAME')} name="dcname" readOnly />
				</li>
				<li>
					{/* 출고일자 */}
					<DatePicker
						label={t('lbl.DOCDT_WD')}
						name="taskdt"
						format="YYYY-MM-DD"
						onChange={searchPopMasterList}
						required={true}
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
				<li>
					{/* <InputText
						label={t('lbl.DOCNO_WD')}
						name="docno"
						required={true}
						rules={[{ required: true, validateTrigger: 'none' }]}
					/> */}
					{/* 주문번호 */}
					<MultiInputText
						label={t('lbl.DOCNO_WD')}
						name="docno"
						required={true}
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
			</SearchFormResponsive>
			<div>
				<p>
					{/* {popupForm.getFieldValue('docno') == 'X' ? */}
					{yn == 'X' ? (
						// 등록된 STO가 없습니다.
						<span className="fc-red">
							({deliverydt}) {t('msg.MSG_WD_DELIVERY_LABEL_FORCE_002')}
						</span>
					) : (
						// 등록된 STO가 되어있습니다.
						<span className="fc-blue">
							({deliverydt}) {t('msg.MSG_WD_DELIVERY_LABEL_FORCE_001')}
						</span>
					)}
				</p>
				{/* 주문번호 입력 시 우측 연필모양 클릭 후 한줄에 주문1개씩(엔터로 줄바꿈) 입력 */}
				<p>{t('msg.MSG_WD_DELIVERY_LABEL_FORCE_006')}</p>
			</div>

			<ButtonWrap data-props="single">
				{/* <Button size={'middle'} type="primary" onClick={sendMasterList}> */}
				<Button size={'middle'} type="primary" onClick={saveMasterList}>
					{t('lbl.BTN_CONFIRM')}
				</Button>
				<Button size={'middle'} onClick={close}>
					{t('lbl.CLOSE')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default WdDeliveryLabelForcePop;
