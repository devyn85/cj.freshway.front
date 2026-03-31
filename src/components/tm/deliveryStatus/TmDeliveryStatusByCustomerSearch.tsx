/*
 ############################################################################
 # FiledataField	: TmDeliveryStatusByCustomerSearch.tsx
 # Description		: 지표모니터링 > 차량관제 > 배송현황 > 거래처별 탭 > 검색
 # Author			: BS.kim
 # Since			: 2025.11.17
 ############################################################################
*/

import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmPopSearch from '@/components/cm/popup/CmPopSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import DatePicker from '@/components/common/custom/form/Datepicker';
import SelectBox from '@/components/common/custom/form/SelectBox';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import dayjs from 'dayjs';

const TmDeliveryStatusByCustomerSearch = forwardRef((props: any, ref: any) => {
	const { form } = props;
	const dateFormat = 'YYYY-MM-DD';
	const initDate = dayjs();
	const dccode = Form.useWatch('dccode', form);

	// * 현재날짜를 셋팅한다.
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
			{/* 계약유형 */}
			<li>
				<SelectBox
					label={'계약유형'}
					name="contracttype"
					placeholder="선택해주세요"
					options={getCommonCodeList('CONTRACTTYPE', '전체').filter(item => item.comCd != 'SELF')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* POP 번호 */}
			<li>
				<CmPopSearch
					form={form}
					code="popno"
					name="popnoNm"
					label="POP번호"
					selectionMode="multipleRows"
					customDccode={dccode}
				/>
			</li>

			<Form.Item name="listCount" hidden initialValue={'10000'}></Form.Item>
			<Form.Item name="pageNum" hidden initialValue={'0'}></Form.Item>
		</>
	);
});

export default TmDeliveryStatusByCustomerSearch;
