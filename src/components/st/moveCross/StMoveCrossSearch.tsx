/*
 ############################################################################
 # FiledataField	: StMoveCrossSearch.tsx
 # Description		: 재고 > 재고현황 > CROSS자동보충 Search
 # Author			:sss
 # Since			: 25.07.10
 ############################################################################
*/

import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useSelector } from 'react-redux';

const StMoveCrossSearch = forwardRef((props: any) => {
	const { form } = props; // Antd Form
	const { t } = useTranslation(); // 다국어 처리
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// * 사용자 물류센터 기본값 세팅
	useEffect(() => {
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	return (
		<>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					placeholder={t('lbl.SELECT')}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')}
					mode={'single'}
					required
				/>
			</li>
			{/* 상품 */}
			<li>
				<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 저장조건 */}
			<li>
				<SelectBox
					name="storagetype"
					label="저장조건"
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
});

export default StMoveCrossSearch;
