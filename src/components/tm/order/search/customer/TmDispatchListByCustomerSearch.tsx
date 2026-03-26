import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmPopSearch from '@/components/cm/popup/CmPopSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, Rangepicker, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import { DatePickerProps } from 'antd/lib';
import dayjs, { Dayjs } from 'dayjs';
interface ITmDispatchListByCustomerSearchProps {
	form: any;
}

const TmDispatchListByCustomerSearch = ({ form }: ITmDispatchListByCustomerSearchProps) => {
	const dccode = Form.useWatch('dccode', form);
	const dateFormat = 'YYYY-MM-DD';
	const [dates, setDates] = useState([dayjs().subtract(12, 'day'), dayjs().add(1, 'day')]);

	useEffect(() => {
		const deliveryDtFrom = dayjs().subtract(12, 'day');
		const deliveryDtTo = dayjs().add(1, 'day');
		setDates([deliveryDtFrom, deliveryDtTo]);
		form.setFieldValue('deliveryDt', [deliveryDtFrom, deliveryDtTo]);
	}, []);

	const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();
	const disabledDaysDate: DatePickerProps['disabledDate'] = (current, { from, type }) => {
		if (from) {
			const minDate = from.add(-31, 'days');
			const maxDate = from.add(0, 'days');

			switch (type) {
				case 'year':
					return current.year() < minDate.year() || current.year() > maxDate.year();

				case 'month':
					return getYearMonth(current) < getYearMonth(minDate) || getYearMonth(current) > getYearMonth(maxDate);

				default:
					return Math.abs(current.diff(from, 'days')) >= 31;
			}
		}

		return false;
	};

	return (
		<>
			{/* 배송일자 */}
			<li>
				<Rangepicker
					label={'배송일자'}
					name="deliveryDt"
					defaultValue={dates}
					format={dateFormat}
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
					disabled={false}
					disabledDate={disabledDaysDate}
				/>
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox mode={'single'} name={'dccode'} rules={[{ required: true }]} />
			</li>
			{/* 배송유형 */}
			<li>
				<SelectBox
					name="tmDeliverytype"
					label="배송유형"
					options={getCommonCodeList('TM_DELIVERYTYPE', '전체').filter(
						item => item.comCd !== '5' && item.comCd !== '7' && item.comCd !== '8' && item.comCd !== '2',
					)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					defaultValue=""
				/>
			</li>
			{/* 차량번호/기사 */}
			<li>
				<CmCarSearch form={form} code="carno" name="carnoNm" label="차량번호/기사" selectionMode="multipleRows" />
			</li>
			{/* 권역그룹 */}
			<li>
				<InputText label={'권역그룹'} name="districtgroup" placeholder={'권역그룹을 입력해주세요'} />
			</li>
			<li>
				{/* 권역 */}
				<InputText label={'권역'} name="districtcode" placeholder={'권역을 입력해주세요'} />
			</li>
			{/* POP번호 */}
			<li>
				<CmPopSearch
					form={form}
					name="popName"
					code="popno"
					selectionMode="multipleRows"
					label="POP번호"
					customDccode={dccode}
				/>
			</li>
			{/* 거래처코드/명 */}
			<li>
				<CmCustSearch
					form={form}
					name="truthcustkeyNm"
					code="truthcustkeyList"
					selectionMode="multipleRows"
					expandedColumns="Y"
				/>
			</li>
			{/* 주문마감경로 */}
			<li>
				<SelectBox
					name="ordercloseroute"
					label="주문마감경로"
					options={getCommonCodeList('CUSTORDERCLOSETYPE', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					defaultValue=""
				/>
			</li>
		</>
	);
};

export default TmDispatchListByCustomerSearch;
