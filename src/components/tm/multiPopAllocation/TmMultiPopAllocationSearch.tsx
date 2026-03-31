/*
 ############################################################################
 # FiledataField	: TmMultiPopAllocationSearch.tsx
 # Description		: 거래처별이중POP배차현황
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.09.23
 ############################################################################
*/

import CmMngPlcSearch from '@/components/cm/popup/CmMngPlcSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import DatePicker from '@/components/common/custom/form/Datepicker';

interface TmMultiPopAllocationSearchProps {
	form: any;
}

const TmMultiPopAllocationSearch = (props: TmMultiPopAllocationSearchProps) => {
	// 다국어
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
			{/* 물류센터코드/명 */}
			<li>
				<CmGMultiDccodeSelectBox name="fixdccode" label={t('lbl.DCCODENAME')} mode="single" required />
			</li>
			{/* 관리처 */}
			<li>
				<CmMngPlcSearch
					form={props.form}
					selectionMode="multipleRows"
					name="custName"
					code="custCode"
					returnValueFormat="name"
				/>
			</li>
		</>
	);
};

export default TmMultiPopAllocationSearch;
