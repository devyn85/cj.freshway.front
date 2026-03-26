// Component
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

// Lib
import { SelectBox } from '@/components/common/custom/form';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

const MsSkuDcSetSTOSearch = (props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form } = props;
	// 다국어
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="multiDcCode"
					placeholder="선택해주세요"
					mode="multiple"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={'경유센터'}
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox
					name="multiToDcCode"
					placeholder="선택해주세요"
					mode="multiple"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={'실주문센터'}
				/>
			</li>
			<li>
				<CmSkuSearch form={form} name="skuName" code="skuCode" selectionMode="multipleRows" />
			</li>
			<li>
				{/* 삭제여부 */}
				<SelectBox
					name="delYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('DEL_YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DEL_YN')}
				/>
			</li>
		</>
	);
};

export default MsSkuDcSetSTOSearch;
