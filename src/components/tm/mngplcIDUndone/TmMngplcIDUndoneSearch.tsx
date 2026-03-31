/*
 ############################################################################
 # FiledataField	: TmMngplcIDUndoneSearch.tsx
 # Description		:배송 > 배차작업 > 분할 미적용 관리처 (조회)
 # Author					: JiHoPark
 # Since					: 2025.11.20.
 ############################################################################
*/

import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

interface TmMngplcIDUndoneSearchProps {
	form: any;
}

const TmMngplcIDUndoneSearch = (props: TmMngplcIDUndoneSearchProps) => {
	const { t } = useTranslation();

	const { form } = props;

	return (
		<>
			{/* 출고일자 */}
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_WD')}
					name="deliverydate"
					format={'YYYY-MM-DD'}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox />
			</li>
			{/* 관리처 고객 */}
			<li>
				<CmCustSearch form={form} name="toCustkeyNm" code="toCustkey" label={t('lbl.FROM_CUSTNAME_STORER')} />
			</li>
			{/* 주문번호 */}
			<li>
				<InputText label={t('lbl.ORDRNUM')} name="docno" />
			</li>
		</>
	);
};

export default TmMngplcIDUndoneSearch;
