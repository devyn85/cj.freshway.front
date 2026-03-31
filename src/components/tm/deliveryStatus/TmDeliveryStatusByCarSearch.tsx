/*
 ############################################################################
 # FiledataField	: TmDeliveryStatusByCarSearch.tsx
 # Description		: 지표모니터링 > 차량관제 > 배송현황 > 차량별 탭 > 검색
 # Author			: BS.kim
 # Since			: 2025.11.17
 ############################################################################
*/

import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { Form } from 'antd';
import dayjs from 'dayjs';

const TmDeliveryStatusByCarSearch = forwardRef((props: any, ref: any) => {
	const { form } = props;
	const initDate = dayjs();
	const dateFormat = 'YYYY-MM-DD';

	useEffect(() => {
		form.setFieldValue('deliverydtOri', initDate);
	}, []);

	return (
		<>
			{/* 배송일자  */}
			<li>
				<DatePicker name="deliverydtOri" label={'배송일자'} initValue={initDate} format={dateFormat} required={true} />
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox name={'dccode'} rules={[{ required: true }]} />
			</li>
			<Form.Item name="dccode" hidden></Form.Item>
			{/* 차량번호/기사 */}
			<li>
				<CmCarSearch
					form={form}
					code="carnoList"
					name="carnoListCode"
					label="차량번호/기사"
					selectionMode="multipleRows"
				/>
			</li>
		</>
	);
});

export default TmDeliveryStatusByCarSearch;
