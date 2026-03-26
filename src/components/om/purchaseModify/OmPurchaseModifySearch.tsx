import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { fetchGrpCommCode, getCommonCodeList } from '@/store/core/comCodeStore';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface OmPurchaseModifySearchProps {
	form: any;
	onChangeSelectPoSto: (e: any) => void;
	purchaseType?: 'PO' | 'STO';
}

const OmPurchaseModifySearch = ({ form, onChangeSelectPoSto, purchaseType }: OmPurchaseModifySearchProps) => {
	const { t } = useTranslation();

	const [options, setOptions] = useState(getCommonCodeList('BUYERKEY', '--- 전체 ---'));
	const [loaded, setLoaded] = useState(false);

	const resetLocationFields = useCallback(() => {
		form.setFieldsValue({ zone: null, loc: '' });
	}, [form]);

	const fetchOptions = useCallback(async () => {
		if (loaded) return;

		setLoaded(true);

		try {
			await fetchGrpCommCode();
			setOptions(getCommonCodeList('BUYERKEY', '--- 전체 ---'));
		} finally {
			setLoaded(false);
		}
	}, [loaded]);

	const handleBuyerDropdownVisibleChange = useCallback(
		(open: boolean) => {
			if (open) {
				fetchOptions();
			}
		},
		[fetchOptions],
	);

	return (
		<>
			{/* 입고일자 */}
			<li>
				<Rangepicker
					name="slipDt"
					allowClear
					showNow={false}
					label={t('lbl.DOCDT_DP')}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>

			{/* 입고센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="multiDcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={t('lbl.DP_CENTER')}
					onChange={resetLocationFields}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>

			{/* 수급담당 */}
			<li>
				<SelectBox
					name="buyerKey"
					placeholder="선택해주세요"
					options={options}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.POMDCODE')}
					onDropdownVisibleChange={handleBuyerDropdownVisibleChange}
				/>
			</li>

			{/* 발주유형 */}
			<li>
				<SelectBox
					name="selectPoSto"
					placeholder="선택해주세요"
					options={[
						{ comCd: 'PO', cdNm: 'PO' },
						{ comCd: 'STO', cdNm: 'STO' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					onChange={onChangeSelectPoSto}
					label="발주유형"
				/>
			</li>

			{/* 발주유형이 PO인 경우 노출 */}
			{purchaseType === 'PO' && (
				<>
					{/* 협력사코드/명 */}
					<li>
						<CmPartnerSearch form={form} selectionMode="multipleRows" name="partnerName" code="partnerCode" />
					</li>
				</>
			)}

			{/* 상품코드/명 */}
			<li>
				<CmSkuSearch form={form} selectionMode="multipleRows" name="skuName" code="skuCode" />
			</li>

			{/* 발주구분 */}
			<li>
				<SelectBox
					name="purchaseType"
					placeholder="선택해주세요"
					options={getCommonCodeList('PURCHASETYPE_PO', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.PURCHASETYPE_PO')}
				/>
			</li>

			{/* 발주유형이 PO인 경우 노출 */}
			{purchaseType === 'PO' && (
				<>
					{/* 구매전표 */}
					<li>
						<InputText name="docNo" placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.POKEY')])} label={t('lbl.POKEY')} />
					</li>
				</>
			)}

			{/* 발주유형이 STO인 경우 노출 */}
			{purchaseType === 'STO' && (
				<>
					{/* 창고 */}
					<li>
						<CmOrganizeSearch form={form} label="창고" name="fromOrganizeNm" code="fromOrganize" />
					</li>

					{/* 출고센터 */}
					<li>
						<CmGMultiDccodeSelectBox
							name="fromMultiDcCode"
							placeholder="선택해주세요"
							fieldNames={{ label: 'dcname', value: 'dccode' }}
							label={t('lbl.WD_CENTER')}
							onChange={resetLocationFields}
							initval={''}
						/>
					</li>

					{/* 주문번호 */}
					<li>
						<InputText
							name="requestNo"
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.ORDRNUM')])}
							label={t('lbl.ORDRNUM')}
						/>
					</li>
				</>
			)}
		</>
	);
};

export default OmPurchaseModifySearch;
