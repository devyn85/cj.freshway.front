import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Rangepicker, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { DatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
interface ITmDispatchListByCarSearchProps {
	form: any;
}

const TmDispatchListByCarSearch = ({ form }: ITmDispatchListByCarSearchProps) => {
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
			{/* 배송유형 : 전체, 배송, 수송, 조달(일배), 조달(저장), 반품, 고객자차 */}
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
			{/* 차량ID/명 */}
			<li>
				<CmCarSearch form={form} name="carName" code="carno" selectionMode="multipleRows" />
			</li>
			{/* 계약유형 */}
			<li>
				<SelectBox
					label={'계약유형'}
					name={'contracttype'}
					options={getCommonCodeList('CONTRACTTYPE', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					defaultValue=""
				/>
			</li>
			{/* 차량톤급 */}
			<li>
				<SelectBox
					label={'차량톤급'}
					name={'carcapacity'}
					options={getCommonCodeList('CARCAPACITY', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					defaultValue=""
				/>
			</li>
		</>
	);
};

export default TmDispatchListByCarSearch;
