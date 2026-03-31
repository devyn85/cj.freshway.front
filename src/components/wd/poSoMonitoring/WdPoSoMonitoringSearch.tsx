/*
 ############################################################################
 # FiledataField	: WdPoSoMonitoringSearch.tsx
 # Description		: 재고 > 재고현황 > 일배PO/SO연결모니터링 조회 조건 화면
 # Author			: YangChangHwan
 # Since			: 25.06.23
 ############################################################################
*/
import { Form } from 'antd';
// Components
import DatePicker from '@/components/common/custom/form/Datepicker';
import dayjs from 'dayjs';

// Store

// Libs
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { getUserDccodeList } from '@/store/core/userStore';
import { useSelector } from 'react-redux';

// Utils

const dateFormat = 'YYYY-MM-DD';

const WdPoSoMonitoringSearch = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, slipdt } = props;
	const dccode = Form.useWatch('fixdccode', form);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const dateFormat = 'YYYY-MM-DD';

	const [dates, setDates] = useState(dayjs());

	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	const dccodeList: any[] = getUserDccodeList('');

	dccodeList.unshift({
		dccode: null,
		dcname: t('lbl.ALL'),
	});
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	//검색영역 줄 높이
	useEffect(() => {
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialDate = dayjs();
		setDates(initialDate);
		form.setFieldValue('slipdt', initialDate);

		// 사용자 물류센터 기본값 세팅
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	return (
		<>
			<li>
				<DatePicker
					label={t('lbl.SLIPDT')}
					name="slipdt"
					format={dateFormat}
					placeholder={`${t('lbl.SLIPDT')}를 입력해 주세요.`}
					defaultValue={dates}
					span={24}
					required
					allowClear
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>

			<li>
				{/* 물류센터 */}
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					allLabel={t('lbl.ALL')}
					label={'물류센터'}
					mode={'single'}
					required
					onChange={async () => {
						//loadZone(); // 센터에 해당되는 zone 정보 조회
					}}
				/>
			</li>
		</>
	);
};

export default WdPoSoMonitoringSearch;
