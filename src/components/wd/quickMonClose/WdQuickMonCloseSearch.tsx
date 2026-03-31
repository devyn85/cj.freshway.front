/*
 ############################################################################
 # FiledataField	: QuickMonCloseSearch.tsx
 # Description		: 출고 > 출고작업 > 퀴배송상세 Search
 # Author			:sss
 # Since			: 25.07.10
 ############################################################################
*/

//Component
import { Datepicker, InputText, RadioBox, Rangepicker, SelectBox } from '@/components/common/custom/form';
//Lib
import dayjs from 'dayjs';

// API Call Function
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
//Util

const dateFormat = 'YYYY-MM-DD';

const QuickMonCloseSearch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어 처리
	const { search, form, clearAllGridData } = props; // Antd Form
	//const [dates, setDates] = useState([dayjs(), dayjs()]);
	const [dates, setDates] = useState([dayjs().startOf('month'), dayjs()]); //  당월 1일 ~ 오늘

	const [dateFlag, setDateFlag] = useState('1'); // 조회구분

	const radioOption = [
		{ label: t('정산월'), value: '1' }, // 정산월
		{ label: t('퀵접수일자'), value: '2' }, // 퀵접수일자
	];

	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// 라디오 버튼 변경 핸들러
	const onChangeRadio = (event: any) => {
		setDateFlag(event.target.value);
	};

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
		// 조회구분 기본값을 '1' (정산월)로 설정
		form.setFieldValue('dateFlag', '1');

		const now = dayjs();
		const dt1 = now.subtract(1, 'month').date(26); // 전월 26일
		const dt2 = now.date(25); // 당월 25일
		setDates([dt1, dt2]);
		form.setFieldValue('docdt', [dt1, dt2]);

		// 요청월을 당월로 설정
		form.setFieldValue('fixdccode', '');
		form.setFieldValue('sttlYm', now);
		form.setFieldValue('status', ''); // status를 전체로 설정
	}, []);

	return (
		<>
			<li>
				{/* 조회구분 */}
				<RadioBox
					label={t('기간구분')}
					name="dateFlag"
					options={radioOption}
					onChange={onChangeRadio}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{dateFlag === '1' && (
				<li>
					<Datepicker
						label={t('전월26일~당월25일')} // 정산월
						name="sttlYm" // 정산월
						//defaultValue={dates} // 초기값 설정
						format="YYYY-MM"
						picker="month"
						span={24}
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
						onChange={() => {
							// 기준월 변경 시 모든 그리드 데이터 초기화
							if (props.clearAllGridData) {
								props.clearAllGridData();
							}
						}}
						style={{ width: '200px' }} // 넓이 조정
					/>
				</li>
			)}
			{dateFlag === '2' && (
				<li>
					<Rangepicker
						label="퀵접수일자" // 퀵접수일자
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
			)}

			<li>
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')} // 물류센터
					mode={'single'}
					allowClear
					onChange={async () => {
						//loadZone(); // 센터에 해당되는 zone 정보 조회
					}}
				/>
			</li>
			<li>
				<SelectBox
					label={t('퀵진행사항')} // 퀵진행사항
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

export default QuickMonCloseSearch;
