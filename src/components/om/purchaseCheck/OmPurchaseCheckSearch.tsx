import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

const OmPurchaseCheckSearch = (props: any) => {
	const { form } = props;

	const { t } = useTranslation();

	return (
		<>
			{/* 전표일자 */}
			<li>
				<DatePicker name="slipDt" allowClear showNow={false} label={t('lbl.SLIPDT')} />
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
				/>
			</li>

			{/* 상품코드 */}
			<li>
				<CmSkuSearch form={form} label={t('lbl.LBL_SKU')} name="skuNm" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 구분 */}
			<li>
				<SelectBox
					name="gubun"
					placeholder="선택해주세요"
					options={[
						{ descr: 'PO', code: 'PO' },
						{ descr: 'STO', code: 'STO' },
					]}
					fieldNames={{ label: 'descr', value: 'code' }}
					label={'구분'}
				/>
			</li>
		</>
	);
};

export default OmPurchaseCheckSearch;
