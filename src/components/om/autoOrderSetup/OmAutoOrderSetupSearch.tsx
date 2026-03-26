/*
 ############################################################################
 # FiledataField	: OmAutoOrderSetupSearch.tsx
 # Description		: 주문 > 주문등록 > 저장품자동발주관리
 # Author			: JeongHyeongCheol
 # Since			: 25.07.25
 ############################################################################
*/

import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface OmAutoOrderSetupSearchProps {
	form?: any;
}

const OmAutoOrderSetupSearch = (props: OmAutoOrderSetupSearchProps) => {
	const { form } = props;
	const { t } = useTranslation();

	return (
		<>
			{/* 공급센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="frDccode"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={t('lbl.FROM_DCCODE')}
				/>
			</li>
			{/* 공급받는센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="toDccode"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={t('lbl.TO_DCCODE')}
					initval={''}
				/>
			</li>
			{/* 상품코드 */}
			<li>
				<CmSkuSearch label={t('lbl.SKU')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 발주코드/명 */}
			<li>
				<InputText name="purchaseTxt" label={'발주코드/명'} placeholder={'발주코드/명을 입력해주세요'} allowClear />
			</li>
			{/* 사용여부 */}
			<li>
				<SelectBox
					name="delYn"
					label={t('lbl.DEL_YN')}
					span={24}
					options={getCommonCodeList('DEL_YN', t('lbl.ALL'), '').filter(item => ['Y', 'N', ''].includes(item.comCd))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default OmAutoOrderSetupSearch;
