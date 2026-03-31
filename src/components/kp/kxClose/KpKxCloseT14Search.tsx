/*
 ############################################################################
 # FiledataField    : KpKxCloseT14Search.tsx
 # Description      : I/F관리
 # Author           : sss
 # Since            : 25.07.04
 ############################################################################
*/

// lib
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

// component
import { CheckBox, InputText, Rangepicker } from '@/components/common/custom/form';
import dayjs from 'dayjs';

// store

// api

// util

// hook

// type

const KpKxCloseT14Search = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, activeKey } = props; // Antd Form
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)
	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	/**
	 * 현재날짜를 셋팅한다.
	 */
	useEffect(() => {
		const dt1 = dayjs().add(-3, 'day');
		const dt2 = dayjs();
		setDates([dt1, dt2]);
		form.setFieldValue('ifDateRange', [dt1, dt2]);

		// form.setFieldValue('ifDateRange', [dayjs('2025-12-05'), dayjs('2025-12-05')]);
		// 모든 체크박스 기본값 체크
		form.setFieldsValue({
			dmH: true,
			dmD: true,
			ifSndRst: true,
			dmSndd: true,
			ifStR: true,
			ifStS: true,
		});
	}, [form]);

	return (
		<>
			{/* I/F 일자 범위 */}
			<li>
				<Rangepicker
					label={t('lbl.IF_DATE')}
					name="ifDateRange"
					format={'YYYY-MM-DD'}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>

			{/* 상태 체크박스: DM_H, DM_D */}
			<li style={{ gridColumn: 'span 3' }} className="flex-wrap">
				<span>
					<CheckBox name="dmH" trueValue={true} falseValue={false}>
						{'DM_H'}
					</CheckBox>
					<CheckBox name="dmD" trueValue={true} falseValue={false}>
						{'DM_D'}
					</CheckBox>
					<CheckBox name="ifSndRst" trueValue={true} falseValue={false}>
						{'SND_R'}
					</CheckBox>
					<CheckBox name="dmSndd" trueValue={true} falseValue={false}>
						{'SND_D'}
					</CheckBox>
					<CheckBox name="ifStR" trueValue={true} falseValue={false}>
						{'ST_R'}
					</CheckBox>
					<CheckBox name="ifStS" trueValue={true} falseValue={false}>
						{'ST_S'}
					</CheckBox>
				</span>
			</li>

			{/* 문서번호 입력 */}
			<li>
				<InputText name="docno" label={t('lbl.DOCNO')} placeholder={t('msg.placeholder1', ['문서번호'])} />
			</li>

			{/* IF_ID 입력 */}
			<li>
				<InputText name="ifId" label={t('lbl.IF_ID')} placeholder={t('msg.placeholder1', ['IF_ID'])} />
			</li>

			{/* 전표번호 입력 */}
			<li>
				<InputText name="slipno" label={t('lbl.SLIPNO')} placeholder={t('msg.placeholder1', ['전표번호'])} />
			</li>
		</>
	);
});
export default KpKxCloseT14Search;
