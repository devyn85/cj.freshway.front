// Component
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, InputNumber, SelectBox } from '@/components/common/custom/form';

//Store
import { fetchGrpCommCode, getCommonCodeList } from '@/store/core/comCodeStore';

interface MsPurchaseCustSearchProps {
	form: any;
}

const MsPurchaseCustSearch = ({ form }: MsPurchaseCustSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const [options, setOptions] = useState(getCommonCodeList('BUYERKEY', '--- 전체 ---'));
	const [loaded, setLoaded] = useState(false); // 중복 호출 방지

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const fetchOptions = async () => {
		if (loaded) return;

		setLoaded(true);

		// 공통코드 다시 가져오기
		fetchGrpCommCode().then(() => {
			setOptions(getCommonCodeList('BUYERKEY', '--- 전체 ---'));
			setLoaded(false);
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="multiDcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={t('lbl.DCCODE')}
					onChange={() => {
						form.setFieldsValue({ zone: null, loc: '' });
					}}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<SelectBox
					name="buyerKey"
					placeholder="선택해주세요"
					options={options}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.POMDCODE')}
					onDropdownVisibleChange={(open: boolean) => {
						if (open) {
							fetchOptions();
						}
					}}
				/>
			</li>
			<li>
				<SelectBox
					name="poType"
					placeholder="선택해주세요"
					options={getCommonCodeList('POTYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'발주유형'}
				/>
			</li>
			<li>
				<SelectBox
					name="purchaseType"
					placeholder="선택해주세요"
					options={getCommonCodeList('PURCHASETYPE_PO', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.PURCHASETYPE_PO')}
				/>
			</li>
			<li>
				<CmPartnerSearch form={form} selectionMode="multipleRows" name="partnerName" code="partnerCode" />
			</li>
			<li>
				<CmSkuSearch form={form} selectionMode="multipleRows" name="skuName" code="skuCode" />
			</li>
			<li>
				<SelectBox
					name="deliveryType"
					placeholder="선택해주세요"
					options={getCommonCodeList('DIRECTTYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DELIVERYTYPE_PO')}
				/>
			</li>
			<li>
				<InputNumber
					name="leadTime"
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.LEADTIME')])}
					label={t('lbl.LEADTIME')}
				/>
			</li>
			<li>
				<InputNumber
					name="coefficientSafety"
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.COEFFICIENTSAFETY')])}
					label={t('lbl.COEFFICIENTSAFETY')}
				/>
			</li>
			<li>
				<InputNumber
					name="purInterval"
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.PURINTERVAL')])}
					label={t('lbl.PURINTERVAL')}
				/>
			</li>
			<li>
				<SelectBox
					name="storageType"
					placeholder="선택해주세요"
					options={getCommonCodeList('STORAGETYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.STORAGETYPE')}
				/>
			</li>
			<li>
				<CheckBox name="purchaseYn" label={'수급대상만 조회'} />
			</li>
			<li>
				<SelectBox
					name="channel"
					placeholder="선택해주세요"
					options={getCommonCodeList('PUTAWAYTYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.CHANNEL_DMD')}
				/>
			</li>
			<li>
				<SelectBox
					name="serialYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('SERIALYN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.SERIALYN')}
				/>
			</li>
			<li>
				<SelectBox
					name="line01"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.SKUNOTFIXEDAMOUNTYN')}
				/>
			</li>
			{/* <li>
				<SelectBox
					name="chkPurchasemst"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'수급대상'}
				/>
			</li> */}
		</>
	);
};

export default MsPurchaseCustSearch;
