/*
 ############################################################################
 # FiledataField	: MsExDCSimulationSearch2.tsx
 # Description		: 외부창고정산 시뮬레이션
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.23
 ############################################################################
*/

// CSS

// Utils

// Store

// Component
import { Datepicker } from '@/components/common/custom/form';

// API

interface MsExDCSimulationSearchearchProps {
	form: any;
	activeTabKey: any;
}

const MsExDCSimulationSearch2 = (props: MsExDCSimulationSearchearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 적용 물류센터
	const [defDccode, setDefDccode] = useState('2170');

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<Datepicker //기준월
					label={t('lbl.BASEMONTH')}
					name="stockmonth2"
					//defaultValue={dates} // 초기값 설정
					format="YYYY-MM"
					picker="month"
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
		</>
	);
};

export default MsExDCSimulationSearch2;
