/*
 ############################################################################
 # File name    : KpSyncStockMonitoringSearch.tsx
 # Description  : 재고동기화 모니터링 검색 (물류센터 단일, 상품 멀티)
 # Author       :
 # Since        :
 ############################################################################
*/
import { useTranslation } from 'react-i18next';

// component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';

interface KpSyncStockMonitoringSearchProps {
	form: any;
}

const KpSyncStockMonitoringSearch = (props: KpSyncStockMonitoringSearchProps) => {
	const { form } = props;
	const { t } = useTranslation();

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					mode="single"
					name="dcCode"
					label={t('lbl.DCCODE')}
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					required
					rules={[
						{
							required: true,
							validateTrigger: 'none',
							message: '물류센터를 선택해주세요.',
						},
					]}
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form}
					name="skuName"
					code="skuCode"
					label={t('lbl.SKU')}
					selectionMode="multipleRows"
				/>
			</li>
		</>
	);
};

export default KpSyncStockMonitoringSearch;
