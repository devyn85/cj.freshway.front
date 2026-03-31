/*
 ############################################################################
 # FiledataField	: MsCustRedzoneSearch.tsx
 # Description		: 기준정보 > 거래처기준정보 > 특별관리고객 검색 영역
 # Author			: YeoSeungCheol
 # Since			: 25.05.28
 ############################################################################
*/
// Component

import CmCustRedZoneSearch from '@/components/cm/popup/CmCustRedZoneSearch';

const MsCustRedzoneSearch = ({ form }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	return (
		<li>
			<CmCustRedZoneSearch
				form={form}
				label={t('lbl.CUSTCODENAME')}
				name="custName"
				code="custCode"
				returnValueFormat="name"
			/>
		</li>
	);
};

export default MsCustRedzoneSearch;
