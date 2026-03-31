/*
 ############################################################################
 # FiledataField	: StDailyInoutExDcSearch.tsx
 # Description		: 외부비축상품별수불현황
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputText, Rangepicker, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import dayjs from 'dayjs';

interface StDailyInoutExDcProps {
	form: any;
}
const StDailyInoutExDcSearch = (props: StDailyInoutExDcProps) => {
	const form = props.form;
	const { t } = useTranslation();
	const dcCode = Form.useWatch('fixDcCode', props.form);
	const dateFormat = 'YYYY-MM-DD';
	const [dates, setDates] = useState([dayjs(), dayjs()]);

	// * 날짜 기간 초기값 설정
	useEffect(() => {
		const initialStart = dayjs().subtract(1, 'month');
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		form.setFieldValue('date', [initialStart, initialEnd]);
	}, []);
	return (
		<>
			{/* 수불일자 */}
			<li>
				<Rangepicker
					label="수불일자"
					name="date"
					span={24}
					defaultValue={dates}
					format={dateFormat}
					allowClear
					showNow={false}
					required={true}
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 물류센터 */}
			<li>
				<SelectBox
					name="fixDcCode"
					span={24}
					options={getCommonCodeList('SUPPLY_DC').map(item => ({
						...item,

						cdNm: item.comCd ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
					}))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DCCODE')}
					required
					disabled
				/>
			</li>

			{/* 창고코드/명 */}
			<li>
				<CmOrganizeSearch
					form={form}
					selectionMode="singleRow"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={dcCode}
				/>
			</li>
			{/* 상품코드/명 */}
			<li>
				<li>
					<CmSkuSearch
						form={props.form}
						name="skuName"
						code="sku"
						selectionMode="singleRow"
						returnValueFormat="name"
						required={true}
					/>
				</li>
			</li>
			{/* B/L번호 */}
			<li>
				<InputText name="blNo" label="B/L번호" maxLength={32} />
			</li>
		</>
	);
};
export default StDailyInoutExDcSearch;
