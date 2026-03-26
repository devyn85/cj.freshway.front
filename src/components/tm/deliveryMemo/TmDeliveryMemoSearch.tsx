/*
 ############################################################################
 # FiledataField	: TmDeliveryMemoSearch.tsx
 # Description		:배송 > 배차현황 > 거래처별 메모사항 조회 (조회)
 # Author					: JiHoPark
 # Since					: 2025.10.27.
 ############################################################################
*/

import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import CheckBox from '@/components/common/custom/form/CheckBox';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

interface TmDeliveryMemoSearchProps {
	form: any;
}

const TmDeliveryMemoSearch = (props: TmDeliveryMemoSearchProps) => {
	const { form } = props;
	const { t } = useTranslation();

	return (
		<>
			{/* 배송일자 */}
			<li>
				<Rangepicker
					label={t('lbl.DELIVERYDATE')}
					name="deliverydt"
					format={'YYYY-MM-DD'}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 물류센터코드/명 */}
			<li>
				<CmGMultiDccodeSelectBox disabled={false} label={t('lbl.DCCODENAME')} allLabel={t('lbl.ALL')} />
			</li>
			{/* 고객 */}
			<li>
				<CmCustSearch
					form={form}
					name="toCustkeyNm"
					code="toCustkey"
					label={t('lbl.CUST')}
					selectionMode="multipleRows"
				/>
			</li>
			{/* 차량번호 */}
			<li>
				<CmCarSearch form={form} name="carnoNm" code="carno" label={t('lbl.VHCNUM')} selectionMode="multipleRows" />
			</li>
			{/* 입력건만 조회 */}
			<li>
				<CheckBox label={t('lbl.ONLY_INPUT_SEARCH')} name="chkMemo" trueValue={'Y'} falseValue={'N'}>
					{t('lbl.ONLY_INPUT_SEARCH')}
				</CheckBox>
			</li>
		</>
	);
};

export default TmDeliveryMemoSearch;
