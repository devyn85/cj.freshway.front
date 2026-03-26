/*
 ############################################################################
 # FiledataField	: RtReceiptConfirmSearch.tsx
 # Description		: 반품 > 반품작업 > 반품확정처리 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.09.16
 ############################################################################
*/

import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch20251208';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';

const RtReceiptConfirmSearch = ({ form, initialValues, dates, setDates, activeKey }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const fixdccodeWatch = Form.useWatch('fixdccode', form);
	const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();

	return (
		<>
			{/* 반품요청일자 */}
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_RT')}
					name="slipdt"
					defaultValue={dates}
					format={dateFormat}
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 물류센터(물류센터코드/명) */}
				<CmGMultiDccodeSelectBox
					name={'fixdccode'}
					required
					onChange={() => {
						form.setFieldsValue({ organize: '', organizenm: '' });
					}}
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')}
				/>
			</li>
			{/* 창고코드/명 */}
			<li>
				<CmOrganizeSearch
					dccodeDisabled={true}
					form={form}
					label={'창고코드/명'}
					selectionMode="multipleRows"
					name="organizenm"
					code="organize"
					returnValueFormat="name"
					dccode={fixdccodeWatch}
				/>
			</li>
			{/* 고객반품주문번호 */}
			<li>
				<MultiInputText
					label={t('lbl.SOURCEKEY_RT')}
					name="docno"
					placeholder={t('msg.placeholder1', [t('lbl.SOURCEKEY_RT')])}
				/>
			</li>
			{/* 관리처코드(고객코드/명) */}
			<li>
				<CmCustSearch
					label={t('lbl.FROM_CUSTKEY_RT')}
					form={form}
					name="custName"
					code="fromCustkey"
					selectionMode={'multipleRows'}
				/>
			</li>
			{/* 상품코드/명 */}
			<li>
				<CmSkuSearch form={form} selectionMode="multipleRows" name="skuName" code="sku" required={false} />
			</li>
			{/* 저장조건 */}
			<li>
				<SelectBox
					name="storagetype"
					span={24}
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.STORAGETYPE')}
				/>
			</li>
			{/* 저장유무 */}
			<li>
				<SelectBox
					name="channel"
					span={24}
					options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.CHANNEL_DMD')}
				/>
			</li>
			{/* 진행상태 */}
			<li>
				<SelectBox
					label={t('lbl.STATUS_RT')}
					name="status"
					placeholder="선택해주세요"
					options={getCommonCodeList('STATUS_RT', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 회수여부 */}
			<li>
				<SelectBox
					label={t('lbl.RETURNTYPE_RT')}
					name="returntype"
					placeholder="선택해주세요"
					options={getCommonCodeList('RETURNTYPE_RT', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 협력사반품 */}
			<li>
				<SelectBox
					name="vendoreturn"
					span={24}
					options={getCommonCodeList('VENDORETURNYN', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.VENDORETURNYN')}
				/>
			</li>
			{/* 고객주문번호 */}
			<li>
				<MultiInputText
					label={t('lbl.DOCNO_RT')}
					name="docnoWd"
					placeholder={t('msg.placeholder1', [t('lbl.DOCNO_RT')])}
				/>
			</li>
			{/* 실물여부 */}
			<li>
				<SelectBox
					label={t('lbl.PACKINGMETHOD')}
					name="packingmethod"
					placeholder="선택해주세요"
					options={[
						{ cdNm: t('lbl.SELECT'), comCd: '' },
						{ cdNm: t('Y'), comCd: 'Y' },
						{ cdNm: t('N'), comCd: 'N' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 식별번호유무 */}
			<li>
				<SelectBox
					name="serialyn"
					span={24}
					options={getCommonCodeList('SERIALYN', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.SERIALYN')}
				/>
			</li>
			{/* B/L 번호 */}
			<li>
				<InputText label={t('lbl.BLNO')} name="blno" placeholder={t('msg.placeholder1', [t('lbl.BLNO')])} />
			</li>
			{/* 이력번호 */}
			<li>
				<InputText label={t('lbl.SERIALNO')} name="serialno" placeholder={t('msg.placeholder1', [t('lbl.SERIALNO')])} />
			</li>
			{/* 계약업체 */}
			<li>
				<CmCustSearch
					form={form}
					selectionMode={'multipleRows'}
					name="wdCustkeyNm"
					code="wdCustkey"
					label={t('lbl.CONTRACTCOMPANY')}
				/>
			</li>
		</>
	);
};

export default RtReceiptConfirmSearch;
