import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const StStockChainSearch = (props: any) => {
	const { t } = useTranslation(); // 다국어
	const { form } = props; // Antd Form

	useEffect(() => {
		if (form) {
			const ynCodeList = getCommonCodeList('YN', '--- 전체 ---');
			const allValue = ynCodeList?.[0]?.comCd;
			if (allValue !== undefined) {
				form.setFieldsValue({
					reference15: allValue,
				});
			}
		}
	}, [form]);

	return (
		<>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="multiDcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
				/>
			</li>
			{/* 상품코드 */}
			<li>
				<CmSkuSearch
					form={props.form}
					selectionMode="singleRow"
					name="skuName"
					label={'상품코드'}
					code="sku"
					returnValueFormat="name"
				/>
			</li>
			{/* 외식여부 */}
			<li>
				<SelectBox
					name="reference15"
					placeholder="선택해주세요"
					initialValue={getCommonCodeList('YN', t('lbl.ALL'))?.[0]?.comCd || ''}
					options={getCommonCodeList('YN', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'외식여부'}
				/>
			</li>
		</>
	);
};

export default StStockChainSearch;
