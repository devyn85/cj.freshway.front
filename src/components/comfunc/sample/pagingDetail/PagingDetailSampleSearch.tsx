/*
 ############################################################################
 # FiledataField	: PagingDetailSearch.tsx
 # Description		: 페이징 및 상세영역
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.05.23
 ############################################################################
*/

// CSS

// Lib

// Utils

// Store

// Component
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

// API

interface PagingDetailSearchProps {
	form: any;
}

const PagingDetailSearch = (props: PagingDetailSearchProps) => {
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
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="dccode"
					label={t('lbl.DCCODE')}
					span={24}
					placeholder="선택해주세요"
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmSkuSearch
					form={props.form}
					selectionMode="multipleRows"
					name="skuName"
					code="skuCode"
					returnValueFormat="name"
				/>
			</li>

			<li>
				<CmCarrierSearch
					form={props.form}
					selectionMode="singleRow"
					name="carrierName"
					code="carrierCode"
					returnValueFormat="name"
				/>
			</li>
		</>
	);
};

export default PagingDetailSearch;
