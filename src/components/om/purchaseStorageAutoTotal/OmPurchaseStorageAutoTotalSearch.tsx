import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, Datepicker, InputNumber, SelectBox } from '@/components/common/custom/form';
import { fetchGrpCommCode, getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { Form } from 'antd';

interface OmPurchaseStorageAutoTotalSearchProps {
	form: any;
	isOutOrder: boolean;
	setIsOutOrder: (value: boolean) => void;
}

const OmPurchaseStorageAutoTotalSearch = ({
	form,
	isOutOrder,
	setIsOutOrder,
}: OmPurchaseStorageAutoTotalSearchProps) => {
	const { t } = useTranslation();
	const userDccodeList = getUserDccodeList('') ?? [];
	const dccode = Form.useWatch('multiDcCode', form);
	const [options, setOptions] = useState(getCommonCodeList('BUYERKEY', '--- 전체 ---'));
	const [options2, setOptions2] = useState(getCommonCodeList('DIRECTTYPE'));
	const [loaded, setLoaded] = useState(false); // 중복 호출 방지

	const fetchOptions = async (type: string) => {
		if (loaded) return;

		setLoaded(true);

		// 공통코드 다시 가져오기
		fetchGrpCommCode().then(() => {
			if (type === 'BUYERKEY') {
				setOptions(getCommonCodeList('BUYERKEY', '--- 전체 ---'));
			} else if (type === 'DIRECTTYPE') {
				setOptions2(getCommonCodeList('DIRECTTYPE'));
			}
			setLoaded(false);
		});
	};
	const changeOutOrder = (e: any) => {
		const isChecked = e.target.checked;
		setIsOutOrder(isChecked);
	};

	// 수급센터 변경 시
	const onChangeMultiDcCode = (value: any) => {
		// 2170 외부비축센터 선택 시 외부비축센터발주만 체크
		if (value.includes('2170')) {
			form.setFieldsValue({ multiDcCodeOut: ['2170'] });
			setIsOutOrder(true);
			form.setFieldsValue({ outOrder: true });
		} else if (value.split(',').length > 25 && value.includes('2170')) {
			//value를 array로 변환 후 2170 제거
			value = value.split(',');
			value.splice(value.indexOf('2170'), 1);
			form.setFieldsValue({ multiDcCode: value });
			setIsOutOrder(false);
			form.setFieldsValue({ outOrder: false });
		}
	};

	return (
		<>
			{/* 수급담당 */}
			<li>
				<SelectBox
					name="buyerKey"
					options={options}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.POMDCODE')}
					showSearch={true}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
					onDropdownVisibleChange={(open: boolean) => {
						if (open) {
							fetchOptions('BUYERKEY');
						}
					}}
				/>
			</li>
			{/* 수급센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="multiDcCode"
					placeholder="선택해주세요"
					mode="multiple"
					label={'수급센터'}
					dataType={'CENTER_ALL'}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 발주구분 */}
			<li>
				<SelectBox
					name="purchaseTypeArr"
					options={getCommonCodeList('PURCHASETYPE_PO')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.PURCHASETYPE_PO')}
					mode={'multiple'}
					placeholder="선택해주세요"
					required
					rules={[{ required: true }]}
					onChange={(value: any) => {
						// 'PO'가 포함되어 있거나 'STO'가 포함되어 있으면 동시 선택 불가
						if (value.toString().includes('PO') && value.toString().includes('STO')) {
							form.setFieldsValue({ purchaseTypeArr: undefined });
							showMessage({
								content: 'PO와 STO는 동시 선택 불가합니다.',
								modalType: 'info',
							});
						}
					}}
				/>
			</li>
			{/* 직송그룹 */}
			<li>
				<SelectBox
					name="deliveryTypeArr"
					options={options2}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DELIVERYTYPE_PO')}
					mode={'multiple'}
					placeholder="선택해주세요"
					required
					rules={[{ required: true }]}
					onDropdownVisibleChange={(open: boolean) => {
						if (open) {
							fetchOptions('DIRECTTYPE');
						}
					}}
				/>
			</li>
			{/* 협력사코드/명 */}
			<li>
				<CmPartnerSearch form={form} selectionMode="multipleRows" name="partnerName" code="multiFromCustkey" />
			</li>
			{/* 상품코드/명 */}
			<li>
				<CmSkuSearch form={form} selectionMode="multipleRows" name="skuName" code="multiSku" />
			</li>
			{/* 저장조건 */}
			<li>
				<SelectBox
					name="storageType"
					options={getCommonCodeList('STORAGETYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.STORAGETYPE')}
				/>
			</li>
			{/* 산정기준일 */}
			<li>
				<Datepicker
					name="stdDt"
					allowClear
					showNow={false}
					label={'산정기준일'}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 산정기간 */}
			<li>
				<InputNumber
					name="execDay"
					label={'산정기간'}
					placeholder="산정기간 입력"
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{!isOutOrder && (
				<li>
					<CmGMultiDccodeSelectBox
						name="route"
						placeholder="선택해주세요"
						label={'실공급센터'}
						dataType={'CENTER_ALL'}
					/>
				</li>
			)}
			<li>
				<CheckBox label="통합배송" name="reference03" trueValue={'HAW4'} falseValue={''}>
					통합배송
				</CheckBox>
			</li>
			<li>
				<CheckBox label="외부비축센터발주" name="outOrder" onChange={changeOutOrder}>
					외부비축센터발주
				</CheckBox>
			</li>
			{isOutOrder && (
				<>
					{/* 물류센터 */}
					<li>
						<CmGMultiDccodeSelectBox
							name="multiDcCodeOut"
							placeholder="선택해주세요"
							label={'물류센터'}
							dataType={'CENTER_ALL'}
							rules={[{ required: true, validateTrigger: 'none' }]}
							disabled={isOutOrder}
							initval={'2170'}
						/>
					</li>
					{/* 창고 */}
					<li>
						<CmOrganizeSearch
							form={form}
							label={'창고'}
							name="organizeName"
							code="organizeCode"
							returnValueFormat="name"
							selectionMode="multipleRows"
							dccode={dccode}
						/>
					</li>
				</>
			)}
		</>
	);
};

export default OmPurchaseStorageAutoTotalSearch;
