/* eslint-disable react/jsx-no-undef */
/*
 ############################################################################
 # FiledataField	: OmAutoOrderMonitoringSearch.tsx
 # Description		: 시스템운영 > 시스템운영현황 > 자동발주 모니터링 Search
 # Author			: JiSooKim
 # Since			: 2025.08.12
 ############################################################################
*/

//Component
import Datepicker from '@/components/common/custom/form/Datepicker';
//Lib
import dayjs from 'dayjs';

// API Call Function
//Util

const dateFormat = 'YYYY-MM-DD';

const OmAutoOrderMonitoringSearch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어 처리
	const { search, form } = props; // Antd Form
	const [date, setDate] = useState(dayjs());

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
		form.setFieldValue('taskDtRt', setDate(dayjs()));
	}, []);

	return (
		<>
			<li>
				<Datepicker
					label={t('lbl.EXECUTEDT')}
					name="taskDtRt"
					defaultValue={date} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
				/>
			</li>
		</>
	);
});

export default OmAutoOrderMonitoringSearch;
