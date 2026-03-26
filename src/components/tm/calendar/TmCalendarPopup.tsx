/*
 ############################################################################
 # FiledataField	: TmCalendarPopup.tsx
 # Description		: 휴일관리
 # Author			    : ParkYoSep(dytpq362@cj.net)
 # Since			    : 25.09.24
 ############################################################################
 */

// CSS
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import { Button, Form } from 'antd';
import dayjs from 'dayjs';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { validateForm } from '@/util/FormUtil';
import { showAlert } from '@/util/MessageUtil';

// Utils

// API Call Function
import { apiPostCreateCalendar } from '@/api/tm/apiTmCalendar';
import { getUserDccodeList } from '@/store/core/userStore';

interface PropsType {
	callBack?: any;
	close?: any;
}

const TmCalendarPopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, close } = props;

	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

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

		const params = {
			yy: form.getFieldValue('year').format('YYYY'),
			dcCodeList: getUserDccodeList().map(item => item.dccode),
		};

		// API 실행
		apiPostCreateCalendar(params)
			.then(res => {
				if (res.statusCode === 0) {
					showAlert('저장', '저장되었습니다.');
					callBack?.();
				}
			})
			.catch(e => {
				showAlert('저장 실패', e.message);
			});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		form.setFieldValue('year', dayjs());
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="달력생성" />

			<Form form={form}>
				<UiDetailViewArea>
					<UiDetailViewGroup>
						<li style={{ gridColumn: 'span 4' }}>
							<DatePicker // 연도선택
								name="year"
								label={t('lbl.YY')}
								format="YYYY"
								showSearch
								allowClear
								picker="year"
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</li>
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

export default TmCalendarPopup;
