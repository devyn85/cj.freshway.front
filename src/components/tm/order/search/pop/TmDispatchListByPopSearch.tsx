import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmPopSearch from '@/components/cm/popup/CmPopSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Rangepicker } from '@/components/common/custom/form';
import { DatePickerProps, Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

interface ITmDispatchListByPopSearchProps {
	form: any;
}

const TmDispatchListByPopSearch = ({ form }: ITmDispatchListByPopSearchProps) => {
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
			{/* 차량ID/명 */}
			<li>
				<CmCarSearch form={form} name="carname" code="carno" selectionMode="multipleRows" />
			</li>
		</>
	);
};
export default TmDispatchListByPopSearch;
