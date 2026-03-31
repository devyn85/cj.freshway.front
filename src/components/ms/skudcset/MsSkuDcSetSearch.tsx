/*
 ############################################################################
 # FiledataField	: MsSkuDcSetSearch.tsx
 # Description		: 센터상품속성
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.05.23
 ############################################################################
*/

// CSS

// Lib

// Utils

// Store

// Component
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

// API

interface MsSkuDcSetSearchProps {
	form: any;
}

const MsSkuDcSetSearch = (props: MsSkuDcSetSearchProps) => {
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
					name="fixdccode"
					label={t('lbl.DCCODENAME')} //물류센터
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
					name="skuDescr"
					code="sku"
					returnValueFormat="name"
				/>
			</li>
		</>
	);
};

export default MsSkuDcSetSearch;
