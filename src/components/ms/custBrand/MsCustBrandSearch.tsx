/*
 ############################################################################
 # FiledataField	: MsCustBrandSearch.tsx
 # Description		: 기준정보 > 상품기준정보 > 본점별브랜드마스터 검색 영역
 # Author			: YeoSeungCheol
 # Since			: 25.07.11
 ############################################################################
*/
// Component
import CmCustBrandSearch from '@/components/cm/popup/CmCustBrandSearch';

interface MsCustBrandSearchProps {
	form: any;
}

const MsCustBrandSearch = ({ form }: MsCustBrandSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	return (
		<li>
			<CmCustBrandSearch
				form={form}
				label={t('lbl.CUSTBRAND_CODENAME')}
				name="custName"
				code="custKey"
				// returnValueFormat="code"
				// returnValueFormat="name"
				selectionMode="multipleRows"
			/>
		</li>
	);
};

export default MsCustBrandSearch;
