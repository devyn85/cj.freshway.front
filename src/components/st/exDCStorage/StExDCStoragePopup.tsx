/*
 ############################################################################
 # FiledataField	: StExDCStoragePopup.tsx
 # Description		: 외부창고정산 - 보관료계산 팝업 
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.21
 ############################################################################
 */

// CSS
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import { Button, Col, Form } from 'antd';
import dayjs from 'dayjs';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { InputNumber } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { validateForm } from '@/util/FormUtil';

// Utils

// API Call Function
import { apiPostSaveExdcStorage } from '@/api/st/apiStExDCStorage';

interface PropsType {
	dccode: any;
	organize: any;
	organizeName: any;
	closemonth: any;
	callBack?: any;
	close?: any;
	popupProcType: string;
}

const StExDCStoragePopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, close, popupProcType } = props;

	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// searchForm data 초기화
	const [searchBox] = useState({
		closemonth: props.closemonth,
		organizeName: props.organizeName ?? props.organizeName,
		organize: props.organize ?? props.organize,
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

		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			// 파라미터 설정
			const searchParams = dataTransform.convertSearchData(form.getFieldsValue());
			const params = {
				fixdccode: props.dccode,
				procType: props.popupProcType,
				yyyymm: dayjs(searchParams.closemonth).format('YYYYMM'),
				organize: searchParams.organize,
				w1amt: searchParams.tax,
				x3amt: searchParams.dutyfree,
			};

			// API 실행
			apiPostSaveExdcStorage(params).then(res => {
				if (res.statusCode === 0) {
					props.callBack?.();

					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
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
		if (props.closemonth) {
			form.setFieldValue('closemonth', props.closemonth);
		}
		if (props.organize) {
			form.setFieldValue('organize', props.organize ?? props.organize);
			form.setFieldValue('organizeName', props.organizeName ?? props.organizeName);
		}
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle
				name={props.popupProcType === 'CALC_STORAGEFEE' ? '보관료 계산' : '보관료 비용 마감'}
				func={titleFunc}
			/>

			<Form form={form}>
				{props.popupProcType === 'CALC_STORAGEFEE' && <Col>* 저장 시 이전에 입력하신 내역은 모두 삭제됩니다.</Col>}

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
							/>
						</li>
						<li style={{ gridColumn: '1 / span 4' }}>
							<CmOrganizeSearch //창고
								form={form}
								name="organizeName"
								code="organize"
								selectionMode="singleRow"
								returnValueFormat="name"
								required
								dccode={props.dccode}
								value={props.organize}
							/>
						</li>{' '}
						{props.popupProcType === 'DSTB_STORAGEFEE' && (
							<li style={{ gridColumn: '1 / span 4' }}>
								<InputNumber name="tax" label="과세금액" />
							</li>
						)}{' '}
						{props.popupProcType === 'DSTB_STORAGEFEE' && (
							<li style={{ gridColumn: '1 / span 4' }}>
								<InputNumber name="dutyfree" label="면세금액" />
							</li>
						)}
					</UiDetailViewGroup>
				</UiDetailViewArea>
			</Form>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
				<Button onClick={saveMaster}>저장</Button>
			</ButtonWrap>
		</>
	);
});

export default StExDCStoragePopup;
