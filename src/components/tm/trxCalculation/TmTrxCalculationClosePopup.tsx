/*
 ############################################################################
 # FiledataField	: TmTrxCalculationClosePopup.tsx
 # Description		: 운송비정산 - 월마감 팝업 
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 26.01.11
 ############################################################################
 */

// CSS
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import { Button, Form } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { validateForm } from '@/util/FormUtil';

// Utils

// API
import { apiPostSaveClosing } from '@/api/tm/apiTmTrxCalculation';

interface PropsType {
	dccode: any;
	courier: any;
	courierName: any;
	deliverydate: any;
	callBack?: any;
	close?: any;
}

const TmTrxCalculationClosePopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { dccode, courier, courierName, deliverydate, callBack, close } = props;

	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// searchForm data 초기화
	const [searchBox] = useState({
		closemonth: props.deliverydate,
		courierName: props.courierName ?? props.courierName,
		courier: props.courier ?? props.courier,
	});

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 저장 버튼 클릭
	 */
	const saveMaster = async () => {
		// 필수 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		// API 실행
		showConfirm(null, t('msg.KP_CLOSE_MSG_002'), () => {
			// 파라미터에 처리 대상 설정
			const params = {
				avc_COMMAND: 'CLOSE_MONTHLY',
				fixdccode: props.dccode,
				deliverydate: props.deliverydate,
				courier: props.courier,
				closeYn: 'Y',
			};

			apiPostSaveClosing(params).then(res => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_009'),
						modalType: 'info',
					});
				}
			});
		});
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = {
		//searchYn: onClickSearchButton,
		//refresh: onClickRefreshButton,
		//saveYn: save,
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		if (searchBox.closemonth) {
			form.setFieldValue('closemonth', searchBox.closemonth);
			searchBox.closemonth;
		}
		if (searchBox.courier) {
			form.setFieldValue('courier', searchBox.courier ?? searchBox.courier);
			form.setFieldValue('courierName', searchBox.courierName ?? searchBox.courierName);
		}
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={'월 마감'} func={titleFunc} />

			<Form form={form}>
				<UiDetailViewArea>
					<UiDetailViewGroup>
						<li style={{ gridColumn: '1 / span 4' }}>
							<DatePicker //마감월
								name="closemonth"
								label={t('lbl.CLOSEMONTH')}
								format="YYYY-MM"
								showSearch
								allowClear
								picker="month"
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
								disabled={true}
							/>
						</li>
						<li style={{ gridColumn: '1 / span 4' }}>
							<CmCarrierSearch //운송사
								form={form}
								selectionMode="singleRow"
								name="courierName"
								code="courier"
								returnValueFormat="name"
								required
								disabled={true}
							/>
						</li>
					</UiDetailViewGroup>
				</UiDetailViewArea>
			</Form>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
				<Button onClick={saveMaster}>마감</Button>
			</ButtonWrap>
		</>
	);
});

export default TmTrxCalculationClosePopup;
