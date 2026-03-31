/*
 ############################################################################
 # FiledataField	: WdTaskSkuSearch.tsx
 # Description		: 피킹작업지시(상품별) Search
 # Author			: 공두경
 # Since			: 25.09.29
 ############################################################################
*/

//Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

//Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// API Call Function
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const dateFormat = 'YYYY-MM-DD';

const WdTaskSkuSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, activeKey } = props;
	const [dates, setDates] = useState(dayjs());
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
		if (gDccode) {
			props.form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	// 조회생성
	return (
		<>
			<li>
				<DatePicker
					label={t('lbl.TASKDT_WD')} //작업지시일자
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
				<CmSkuSearch
					form={form}
					label={t('lbl.SKU')} //상품코드
					name="skuNm"
					code="sku"
				/>
			</li>
			<li style={{ gridColumn: ' span 2' }} className="flex-wrap">
				<SelectBox
					label={t('lbl.SKUGROUP')} //SKU그룹
					name="skugroup"
					placeholder="선택해주세요"
					options={getCommonCodeList('SKUGROUP', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
				<CheckBox name={'chkYn'} trueValue={'Y'} falseValue={'N'}>
					{' '}
					상품제외
				</CheckBox>
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
		</>
	);
});

export default WdTaskSkuSearch;
