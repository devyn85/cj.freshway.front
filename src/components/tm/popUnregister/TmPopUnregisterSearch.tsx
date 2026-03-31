/*
 ############################################################################
 # FiledataField	: TmPopUnregisterSearch.tsx
 # Description		: 거래처별POP미등록현황
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.02
 ############################################################################
*/

import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface TmPopUnregisterSearchProps {
	form: any;
}

const TmPopUnregisterSearch = (props: TmPopUnregisterSearchProps) => {
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
			{/* 고객 유형 */}
			<li>
				<SelectBox
					name="custtype"
					label={t('lbl.CUSTTYPE')}
					span={24}
					placeholder="선택해주세요"
					options={getCommonCodeList('CUSTTYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default TmPopUnregisterSearch;
