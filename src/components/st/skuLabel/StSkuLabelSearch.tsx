/*
 ############################################################################
 # FiledataField	: StSkuLabelSearch.tsx
 # Description		: 상품이력번호등록
 # Author			    : Baechan
 # Since			    : 25.08.25
 ############################################################################
*/

import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';

const StSkuLabelSearch = (props: any) => {
	const { t } = useTranslation();

	return (
		<>
			{/* 협력사코드 */}
			<li>
				<CmPartnerSearch form={props.form} name="fromCustkeyNm" code="fromCustkey" label={t('lbl.FROM_CUSTKEY_DP')} />
			</li>
			{/* 상품코드/명 */}
			<li>
				<CmSkuSearch
					form={props.form}
					selectionMode="multipleRows"
					name="skuName"
					code="sku"
					returnValueFormat="name"
					required
				/>
			</li>
		</>
	);
};

export default StSkuLabelSearch;
