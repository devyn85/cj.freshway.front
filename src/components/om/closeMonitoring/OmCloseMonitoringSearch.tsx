/*
 ############################################################################
 # FiledataField	: OmCloseMonitoringSearch.tsx
 # Description		: 마감주문반영 Search
 # Author			: 공두경
 # Since			: 25.06.23
 ############################################################################
*/

//Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

//Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// API Call Function
import { apiGetCloseTime } from '@/api/om/apiOmCloseMonitoring';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const dateFormat = 'YYYY-MM-DD';

const OmCloseMonitoringSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form } = props;
	const [dates, setDates] = useState(dayjs());
	const [closeTimeOptions, setCloseTimeOptions] = useState([{ comCd: '', cdNm: '--- 전체 ---' }]);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const fixdccode = Form.useWatch('fixdccode', props.form);

	// const sampleForm = Form.useFormInstance();

	// const [form] = Form.useForm();
	const { t } = useTranslation();

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
		const initialDate = dayjs();
		setDates(initialDate);
		form.setFieldValue('searchDate', initialDate);

		apiGetCloseTime({}).then(res => {
			const options = res.data.map((item: any) => ({
				comCd: item.basecode,
				cdNm: item.basedescr,
			}));
			setCloseTimeOptions([{ comCd: null, cdNm: '--- 전체 ---' }, ...options]);

			if (gDccode) {
				props.form.setFieldValue('fixdccode', gDccode);
			}
		});
	}, []);

	return (
		<>
			<li>
				<DatePicker
					label={t('lbl.DELIVERYDT')} //배송일자
					name="searchDate"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
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
					label={t('lbl.DCCODE')} //물류센터(에러)
					mode={'single'}
					disabled={form.getFieldValue('fixdccodeDisabled')}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.CLOSETIME_STANDARD')} //마감기준시간
					name="closetimeStandard"
					placeholder="선택해주세요"
					options={closeTimeOptions}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.SERIALYN')} //식별번호유무
					name="serialyn"
					placeholder="선택해주세요"
					options={getCommonCodeList('SERIALYN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
});

export default OmCloseMonitoringSearch;
