import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, Rangepicker } from '@/components/common/custom/form';
import { DatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

interface ITmDispatchListByDistrictSearchProps {
	form: any;
}
const TmDispatchListByDistrictSearch = ({ form }: ITmDispatchListByDistrictSearchProps) => {
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
			{/* 행정구역 */}
			<li>
				<InputText label={'행정구역'} name="administrativeRegion" placeholder={'행정구역을 입력해주세요'} />
			</li>
		</>
	);
};

export default TmDispatchListByDistrictSearch;
