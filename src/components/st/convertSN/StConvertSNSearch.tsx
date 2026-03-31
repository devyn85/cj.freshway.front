/*
 ############################################################################
 # FiledataField	: StConvertSNSearch.tsx
 # Description		: 재고 > 재고작업 > 상품이력번호변경 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.09.11
 ############################################################################
*/

import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuGroup2Search from '@/components/cm/popup/CmSkuGroup2Search';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { getUserDccodeList } from '@/store/core/userStore';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux/es/hooks/useSelector';

const StConvertSNSearch = ({ form }: any) => {
	const { t } = useTranslation();
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// * 사용자 물류센터 기본값 세팅
	useEffect(() => {
		if (gDccode) {
			form.setFieldValue('dccode', gDccode);
		}
	}, []);
	return (
		<>
			{/* 물류센터 */}
			<li>
				<SelectBox
					label={t('lbl.DCCODE')}
					name="dccode"
					options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 상품코드 */}
			<li>
				<CmSkuSearch
					form={form}
					name="skuName"
					code="sku"
					label={t('lbl.SKU')}
					selectionMode={'multipleRows'}
					required
				/>
			</li>
			{/* 상품분류 */}
			<li>
				<CmSkuGroup2Search
					form={form}
					name="skugroupName"
					code="skugroup"
					selectionMode={'multipleRows'}
					label={t('lbl.MC')}
				/>
			</li>
			{/* B/L번호 */}
			<li>
				<InputText
					label={t('lbl.CONVSERIALNO')}
					name="blno"
					placeholder={t('msg.placeholder1', [t('lbl.CONVSERIALNO')])}
				/>
			</li>
			{/* 이력번호 */}
			<li>
				<InputText label={t('lbl.SERIALNO')} name="serialno" placeholder={t('msg.placeholder1', [t('lbl.SERIALNO')])} />
			</li>
			{/* 계약업체 */}
			<li>
				<CmCustSearch
					form={form}
					name="contractcompanyName"
					code="contractcompany"
					label={t('lbl.CONTRACTCOMPANY')}
					selectionMode={'multipleRows'}
				/>
			</li>
			{/* 재고유무 */}
			<li>
				<SelectBox
					label={t('lbl.STOCKYN')}
					name="stockyn"
					options={[
						{ cdNm: t('lbl.ALL'), comCd: '' },
						{ cdNm: 'Yes', comCd: 'Y' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default StConvertSNSearch;
