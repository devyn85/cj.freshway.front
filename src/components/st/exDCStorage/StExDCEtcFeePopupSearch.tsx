/*
 ############################################################################
 # FiledataField	: StExDCEtcFeePopupSearch.tsx
 # Description		: 외부창고정산 - 기타비용등록 팝업
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.21
 ############################################################################
*/

// CSS

// Lib

// Utils

// Store

// Component
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';

// API

interface StExDCEtcFeePopupSearchProps {
	form: any;
}

const StExDCEtcFeePopupSearch = (props: StExDCEtcFeePopupSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<li style={{ gridColumn: '1 / span 2' }}>
			<CmPartnerSearch //거래처
				form={props.form}
				name="custname"
				code="custkey"
				selectionMode="singleRow"
				returnValueFormat="name"
				required
			/>
		</li>
	);
};

export default StExDCEtcFeePopupSearch;
