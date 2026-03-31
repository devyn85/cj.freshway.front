/*
 ############################################################################
 # FiledataField	: MsSkuDcLabelSearch.tsx
 # Description		: 기준정보 > 상품기준정보 > 센터라벨상품속성 검색 영역
 # Author			: YeoSeungCheol
 # Since			: 25.07.16
 ############################################################################
*/
// Component
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface MsSkuDcLabelSearchProps {
	form: any;
}

const MsSkuDcLabelSearch = (props: MsSkuDcLabelSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					label={t('lbl.DCCODE')}
					span={24}
					placeholder="선택해주세요"
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmSkuSearch form={props.form} selectionMode="multipleRows" name="skuName" code="sku" />
			</li>
			<li>
				<SelectBox
					name="storageGubun"
					placeholder="선택해주세요"
					options={getCommonCodeList('MS_SKUDCLABEL_STORAGE', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.SKUGROUP')}
				/>
			</li>
			<li>
				<SelectBox
					name="delYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('DEL_YN', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DEL_YN')}
				/>
			</li>
		</>
	);
};

export default MsSkuDcLabelSearch;
