/*
 ############################################################################
 # FiledataField	: TmMonitoringCustomerSearch.tsx
 # Description		:배송 > 배차현황 > 배송고객모니터링 (조회)
 # Author					: JiHoPark
 # Since					: 2025.11.20.
 ############################################################################
*/

import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputNumber } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import TmMonitoringCustomerGroupSearch from '@/components/tm/monitoringCustomer/TmMonitoringCustomerGroupSearch';

interface TmMonitoringCustomerSearchProps {
	form: any;
}

const TmMonitoringCustomerSearch = (props: TmMonitoringCustomerSearchProps) => {
	const { t } = useTranslation();

	const { form } = props;

	return (
		<>
			{/* 배송일자 */}
			<li>
				<DatePicker
					name="deliverydt"
					label={t('lbl.DELIVERYDT')}
					format={'YYYY-MM-DD'}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 물류센터코드/명 */}
			<li>
				<CmGMultiDccodeSelectBox label={t('lbl.DCCODENAME')} />
			</li>
			{/* 관리처 */}
			<li>
				<CmCustSearch
					form={form}
					name="custkeyNm"
					code="custkey"
					selectionMode={'multipleRows'}
					label={t('lbl.TO_CUSTKEY_WD2')}
				/>
			</li>
			{/* 모니터링그룹 */}
			<li>
				<TmMonitoringCustomerGroupSearch form={form} name="groupCdName" code="groupCd" returnValueFormat="name" />
			</li>
			{/* 신규고객 */}
			<li className="flex-wrap">
				<InputNumber
					name="diffAddDate"
					label={t('lbl.NEW_CUST')}
					min={0}
					controls={false}
					parser={(value: any) => value?.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim, '')}
				/>
				<span>일 이하</span>
			</li>
		</>
	);
};

export default TmMonitoringCustomerSearch;
