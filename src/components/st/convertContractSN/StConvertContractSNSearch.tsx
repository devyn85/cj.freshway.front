/*
 ############################################################################
 # FiledataField	: StConvertContractSNSearch.tsx
 # Description		: 상품이력계약정보변경
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.11.14
 ############################################################################
*/
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputText } from '@/components/common/custom/form';

const StConvertContractSNSearch = forwardRef((props: any) => {
	const form = props.form;
	const { t } = useTranslation();

	return (
		<>
			{/* 상품코드/명 */}
			<li>
				<CmSkuSearch form={form} name="skuName" code="multiSku" required={true} />
			</li>
			{/* B/L번호 */}
			<li>
				<InputText name="blNo" label="B/L번호" maxLength={32} />
			</li>
			{/* 이력번호 */}
			<li>
				<InputText name="serialNo" label="이력번호" maxLength={32} />
			</li>
			{/* 계약업체 */}
			<li>
				<CmCustSearch
					form={form}
					name="wdCustKeyNm"
					code="contractCompany"
					returnValueFormat="name"
					label={t('lbl.CONTRACTCOMPANY')}
				/>
			</li>
		</>
	);
});
export default StConvertContractSNSearch;
