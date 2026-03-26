import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const OmOrderCreationSTOForDcSearch = (props: any) => {
	const { form, activeTabKey } = props;
	const { t } = useTranslation();

	// 전체센터 제외하고 실제 센터들만
	const userDccodeList = getUserDccodeList() ?? [];

	// 사용자 물류센터 코드
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 사용자 물류센터를 공급받는센터 기본값으로 설정
	useEffect(() => {
		if (gDccode) {
			form.setFieldValue('toDccode', gDccode);
		}
	}, [gDccode, form]);

	return (
		<>
			{activeTabKey === '1' && (
				<>
					{/* 이체일자 */}
					<li>
						<DatePicker
							name="deliverydate"
							label={t('lbl.DOCDT_STO')}
							required
							allowClear
							showNow={true}
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					{/* 공급센터 */}
					<li>
						<SelectBox
							name="fromDccode"
							label={t('lbl.FROM_DCCODE')}
							options={userDccodeList}
							fieldNames={{ label: 'dcname', value: 'dccode' }}
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.FROM_DCCODE')])}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					{/* 공급받는센터 */}
					<li>
						<SelectBox
							name="toDccode"
							label={t('lbl.TO_DCCODE')}
							options={userDccodeList}
							fieldNames={{ label: 'dcname', value: 'dccode' }}
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.TO_DCCODE')])}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					{/* 상품코드/명 */}
					<li>
						<CmSkuSearch form={form} name="skuName" code="skuCode" selectionMode="multipleRows" />
					</li>
					{/* 저장조건 */}
					<li>
						<SelectBox
							name="storagetype"
							options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.STORAGETYPE')])}
							label={t('lbl.STORAGETYPE')}
						/>
					</li>
				</>
			)}
		</>
	);
};

export default OmOrderCreationSTOForDcSearch;
