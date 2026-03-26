/*
 ############################################################################
 # FiledataField	: TmDeliveryStatusByRouteSearch.tsx
 # Description		: 지표모니터링 > 차량관제 > 배송현황 > 경로별 탭 > 검색
 # Author			: BS.kim
 # Since			: 2025.11.17
 ############################################################################
*/

import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { Form } from 'antd';
import dayjs from 'dayjs';

const TmDeliveryStatusByRouteSearch = forwardRef((props: any, ref: any) => {
	const { form } = props;
	const dateFormat = 'YYYY-MM-DD';
	const initDate = dayjs().add(1, 'day');

	// * 다음날 초기값 설정
	useEffect(() => {
		form.setFieldValue('deliverydtOri', initDate);
	}, []);

	return (
		<>
			<li>
				{/* 배송일자  */}
				<DatePicker name="deliverydtOri" label={'배송일자'} initValue={initDate} format={dateFormat} required={true} />
			</li>
			<li>
				{/* 물류센터 */}
				<CmGMultiDccodeSelectBox name={'dccode'} rules={[{ required: true }]} />
			</li>
			<Form.Item name="listCount" hidden initialValue={'10000'}></Form.Item>
			<Form.Item name="pageNum" hidden initialValue={'0'}></Form.Item>
		</>
	);
});

export default TmDeliveryStatusByRouteSearch;
