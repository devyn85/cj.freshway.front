// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';

// Lib

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

const OmPurchaseCtlSearch = (props: any) => {
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
					name="multiDcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
				/>
			</li>
			<li>
				<SelectBox
					name="buyerKey"
					placeholder="선택해주세요"
					options={getCommonCodeList('BUYERKEY', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.POMDCODE')}
				/>
			</li>
		</>
	);
};

export default OmPurchaseCtlSearch;
