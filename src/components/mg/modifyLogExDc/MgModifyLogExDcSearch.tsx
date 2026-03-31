/*
 ############################################################################
 # FiledataField	: MgModifyLogExDcSearch.tsx
 # Description		: 외부비축재고변경사유현황 (변경이력) 검색
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.07.11
 ############################################################################
*/

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputText, Rangepicker, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Col, Form } from 'antd';
import dayjs from 'dayjs';

interface MgModifyLogExDcProps {
	form: any;
}
const MgModifyLogExDcSearch = (props: MgModifyLogExDcProps) => {
	const form = props.form;
	const { t } = useTranslation();
	const dateFormat = 'YYYY-MM-DD';
	const dcCode = Form.useWatch('fixDcCode', props.form);
	const [dates, setDates] = useState([dayjs(), dayjs()]);

	// 날짜 초기값 설정
	useEffect(() => {
		const initialStart = dayjs().subtract(1, 'month');
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		form.setFieldValue('date', [initialStart, initialEnd]);
	}, []);

	return (
		<>
			{/* 날짜 및 상품이력 */}
			<li>
				<span>
					<Col span={9}>
						<SelectBox
							name="modifyType"
							placeholder="선택해주세요"
							options={getCommonCodeList('MODIFYTYPE', t('lbl.SELECT'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</Col>
					<Col span={15}>
						<Rangepicker
							name="date"
							defaultValue={dates}
							format={dateFormat}
							allowClear
							showNow={false}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</Col>
				</span>
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
					selectionMode="multipleRows"
					name="organizeNm"
					code="organize"
					returnValueFormat="name"
					dccode={dcCode}
				/>
			</li>
			{/* 상품코드 */}
			<li>
				<CmSkuSearch
					form={form}
					name="skuNm"
					code="sku"
					selectionMode="multipleRows"
					returnValueFormat="name"
					label={t('상품코드')}
				/>
			</li>
			{/* B/L번호 */}
			<li>
				<InputText name="blNo" label="B/L번호" maxLength={32} />
			</li>
		</>
	);
};
export default MgModifyLogExDcSearch;
