/*
 ############################################################################
 # FiledataField	: MsSkuChainMoqSearch.tsx
 # Description		: 기준정보 > 상품기준정보 > MOQ/LT 마스터
 # Author			: JeongHyeongCheol
 # Since			: 25.06.26
 ############################################################################
*/
// component
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';

// CSS

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// lib

interface MsSkuChainMoqSearchProps {
	form: any;
}
const MsSkuChainMoqSearch = (props: MsSkuChainMoqSearchProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { form } = props;
	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="dccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
				/>
			</li>
			<li>
				<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			<li>
				<SelectBox
					name="delYn"
					span={24}
					placeholder="선택해주세요"
					options={getCommonCodeList('DEL_YN', '--- 전체 ---').filter(
						(item: any) => item.comCd === 'Y' || item.comCd === 'N' || item.comCd === null,
					)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DEL_YN')}
				/>
			</li>
		</>
	);
};

export default MsSkuChainMoqSearch;
