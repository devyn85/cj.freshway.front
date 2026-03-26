// Component
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';

// Lib
import { InputText, SelectBox } from '@/components/common/custom/form';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

const MsSkuSearch = (props: any) => {
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
				<CmPartnerSearch form={form} name="partnerName" code="partnerCode" selectionMode="multipleRows" />
			</li>
			<li>
				<CmSkuSearch form={form} name="skuName" code="skuCode" selectionMode="multipleRows" />
			</li>
			<li>
				{/* 저장조건 */}
				<SelectBox
					name="storageType"
					placeholder="선택해주세요"
					options={getCommonCodeList('STORAGETYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.STORAGETYPE')}
				/>
			</li>
			<li>
				{/* 상품유형 */}
				<SelectBox
					name="skuType"
					placeholder="선택해주세요"
					options={getCommonCodeList('SKUTYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.SKUTYPE')}
				/>
			</li>
			<li>
				{/* 담당MD명 */}
				<InputText name="somdName" placeholder="입력해주세요" label={t('lbl.SOMDCODE')} />
			</li>
			{/* <li>
				<SelectBox
					name="statusSku"
					placeholder="선택해주세요"
					options={getCommonCodeList('STATUS_SKU', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.STATUS')}
				/>
			</li> */}
			<li>
				{/* 식별번호유무 */}
				<SelectBox
					name="serialYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.SERIALYN')}
				/>
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

export default MsSkuSearch;
