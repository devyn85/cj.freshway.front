/*
 ############################################################################
 # FiledataField	: TmAllocationCheckSearch.tsx
 # Description		: 배차마스터체크결과
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/

import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import DatePicker from '@/components/common/custom/form/Datepicker';

interface TmAllocationCheckProps {
	form: any;
}
const TmAllocationCheckSearch = (props: TmAllocationCheckProps) => {
	return (
		<>
			{/* 배송일자 */}
			<li>
				<DatePicker
					label={'배송일자'}
					name="pvcDeliveryDt"
					placeholder={`시작일자를 입력해 주세요.`}
					required
					autoFocus
					colon={false}
					allowClear
					showNow
					rules={[
						{
							required: true,
							validateTrigger: 'none',
						},
					]}
				/>
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={'물류센터'}
					required
				/>
			</li>
		</>
	);
};
export default TmAllocationCheckSearch;
