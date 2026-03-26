/* eslint-disable react/jsx-no-undef */
/*
 ############################################################################
 # FiledataField	: WdQuickSearchSearch.tsx
 # Description		: 출고 > 출고작업 > 퀵배송조회 Search
 # Author			:sss
 # Since			: 25.07.10
 ############################################################################
*/

//Component
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
//Lib
import dayjs from 'dayjs';

// API Call Function
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
//Util

const dateFormat = 'YYYY-MM-DD';

const WdQuickSearchSearch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어 처리
	const { search, form } = props; // Antd Form
	//const [dates, setDates] = useState([dayjs(), dayjs()]);
	const [dates, setDates] = useState([dayjs().startOf('month'), dayjs()]); //  당월 1일 ~ 오늘

	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	/**
	 * 현재날짜를 셋팅한다.
	 */
	useEffect(() => {
		const dt1 = dayjs().startOf('month'); // 당월 1일
		//const dt1 = dayjs(); // 오늘
		const dt2 = dayjs(); // 오늘
		setDates([dt1, dt2]);
		form.setFieldValue('docdt', [dt1, dt2]);
		form.setFieldValue('status', ''); // status를 전체로 설정
	}, []);

	return (
		<>
			<li>
				<Rangepicker
					label="접수일자" // 접수일자
					name="docdt"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
					//nChange={handleDateChange}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					placeholder={t('lbl.SELECT')} // 선택
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')} // 물류센터
					mode={'single'}
					required
					onChange={async () => {
						//loadZone(); // 센터에 해당되는 zone 정보 조회
					}}
				/>
			</li>
			<li>
				<SelectBox
					label={t('VOC퀵진행사항')} // VOC퀵진행사항
					name="status"
					options={[
						{ comCd: '', cdNm: '전체' },
						{ comCd: '대기', cdNm: '대기' },
						{ comCd: '접수', cdNm: '접수' },
						{ comCd: '예약', cdNm: '예약' },
						{ comCd: '취소', cdNm: '취소' },
						{ comCd: '배차', cdNm: '배차' },
						{ comCd: '운행', cdNm: '운행' },
						{ comCd: '완료', cdNm: '완료' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<InputText
					label={t('퀵주문번호')} // 퀵주문번호
					name="quickDocno"
					placeholder={t('msg.placeholder1', [t('퀵주문번호')])}
					onPressEnter={search}
				/>
			</li>
		</>
	);
});

export default WdQuickSearchSearch;
