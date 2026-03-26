/*
 ############################################################################
 # FiledataField	: Ms3plMapingSearch.tsx
 # Description		: 기준정보 > 기준정보작업 > 3PL전산기준목록 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.11.18
 ############################################################################
*/

// Components
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';

// Store

// Libs

// Utils

const Ms3plMapingSearch = ({ form, initialValues, dates, setDates, activeKey }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();
	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<CmPartnerSearch
					form={form}
					name="courierNm"
					code="courier"
					label={t('lbl.THIRD_PARTY_VENDOR')}
					selectionMode={'multipleRows'}
				/>
			</li>
			<li>
				<CmPartnerSearch
					form={form}
					name="custkeyNm"
					code="custkey"
					label={t('lbl.PARTNER1')}
					selectionMode={'multipleRows'}
				/>
			</li>
		</>
	);
};

export default Ms3plMapingSearch;
