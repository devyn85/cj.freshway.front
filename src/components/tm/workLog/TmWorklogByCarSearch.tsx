/*
 ############################################################################
 # FiledataField	: TmWorklogByCustomerSearch.tsx
 # Description		: 배차작업로그(거래처별) 검색
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.18
 ############################################################################
*/
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import DatePicker from '@/components/common/custom/form/Datepicker';
interface TmWorklogByCarProps {
	form: any;
}
const TmWorklogByCarSearch = (props: TmWorklogByCarProps) => {
	const { t } = useTranslation();

	return (
		<>
			{/* 배송일자 */}
			<li>
				<DatePicker
					name="deliverydate"
					label={t('lbl.DELIVERYDATE')}
					required
					showSearch
					allowClear
					showNow={true}
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox required />
			</li>
			{/* 고객코드/명 */}
			<li>
				<CmCustSearch
					form={props.form}
					selectionMode="multipleRows"
					name="custName"
					code="custCode"
					returnValueFormat="name"
				/>
			</li>
			{/* 차량ID/명 */}
			<li>
				<CmCarSearch
					form={props.form}
					selectionMode="singleRow"
					name="carnoName"
					code="carno"
					returnValueFormat="name"
				/>
			</li>
		</>
	);
};

export default TmWorklogByCarSearch;
