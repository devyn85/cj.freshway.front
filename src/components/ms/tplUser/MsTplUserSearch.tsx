/*
  ############################################################################
 # FiledataField	: MsTplUserSearch.tsx
 # Description		: 정산 > 위탁물류 >  화주정보관리
 # Author			: ParkYoSep
 # Since			: 2025.10.23
 ############################################################################
*/

//Component
import { Rangepicker, SelectBox } from '@/components/common/custom/form';
import { getUserDccodeList } from '@/store/core/userStore';

//Lib
import dayjs from 'dayjs';

// Store

const MsTplUserSearch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어 처리
	const { search, form } = props; // Antd Form
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const dateFormat = 'YYYY-MM-DD';
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
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialStart = dayjs();
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		props.form.setFieldValue('date', [initialStart, initialEnd]);
		props.form.setFieldValue('dcCode', '');
	}, []);
	return (
		<>
			{/* <li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dcCode' }}
					mode="single"
					label={t('lbl.DCCODE')} //출발센터
				/>
			</li> */}
			<li>
				{/* 물류센터 */}
				<SelectBox
					label={t('lbl.DCCODENAME')} //물류센터
					name="dcCode"
					options={[{ dcname: t('lbl.ALL'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					// rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<Rangepicker
					label={t('lbl.TERM')} //기간
					name="date"
					defaultValue={dates}
					format={dateFormat}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
		</>
	);
});

export default MsTplUserSearch;
