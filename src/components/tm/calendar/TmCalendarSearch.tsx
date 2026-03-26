/*
 ############################################################################
 # FiledataField	: TmCalendarSearch.tsx
 # Description		: 휴일관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.22
 ############################################################################
*/

import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Rangepicker, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from 'dayjs';

const TmCalendarSearch = forwardRef((props: any, ref) => {
	const { t } = useTranslation();
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const dateFormat = 'YYYY-MM';

	// 초기값 설정 (컴포넌트 마운트 시)
	useEffect(() => {
		const initialStart = dayjs();
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		props.form.setFieldValue('date', [initialStart, initialEnd]);
	}, []);

	return (
		<>
			{/* 일월 */}
			<li>
				<Rangepicker
					label="일월"
					name="date"
					defaultValue={dates}
					format={dateFormat}
					picker="month"
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
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
				/>
			</li>
			{/* 휴일유무 */}
			<li>
				<SelectBox
					name="restYn"
					span={24}
					options={getCommonCodeList('YN', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'휴일유무'}
				/>
			</li>
			{/* 근무여부 */}
			<li>
				<SelectBox
					name="workYn"
					span={24}
					options={getCommonCodeList('YN', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'근무여부'}
				/>
			</li>
		</>
	);
});
export default TmCalendarSearch;
