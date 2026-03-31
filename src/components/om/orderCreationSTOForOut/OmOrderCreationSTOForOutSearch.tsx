/*
 ############################################################################
 # FiledataField	: OmOrderCreationSTOForOutSearch.tsx
 # Description		: 당일광역보충발주(FO)
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 26.03.10
 ############################################################################
*/

import CmMngPlcSearch from '@/components/cm/popup/CmMngPlcSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface OmorderCreationSTOForOutSearchSearchProps {
	form: any;
}

const OmorderCreationSTOForOutSearch = (props: OmorderCreationSTOForOutSearchSearchProps) => {
	const { t } = useTranslation();

	return (
		<>
			{/* 이체일자 */}
			<li>
				<DatePicker
					name="deliverydate"
					label={t('lbl.DOCDT_STO')}
					required
					showSearch
					allowClear
					showNow={true}
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 공급센터 */}
			<li>
				<CmGMultiDccodeSelectBox data-type={''} name={'fromDccode'} label={t('lbl.FROM_DCCODE')} required disabled />
			</li>
			{/* 공급받는센터 */}
			<li>
				<CmGMultiDccodeSelectBox data-type={''} name={'toDccode'} label={t('lbl.TO_DCCODE')} required />
			</li>
			{/* 창고코드/명 */}
			<li>
				<CmOrganizeSearch
					form={props.form}
					selectionMode="multipleRows"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={props.form.getFieldValue('fromDccode')}
				/>
			</li>
			{/* 상품코드/명 */}
			<li>
				<CmSkuSearch
					form={props.form}
					name="skuName"
					code="skuCode"
					selectionMode="multipleRows"
					returnValueFormat="name"
				/>
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
			{/* B/L번호 */}
			<li>
				<MultiInputText
					label={t('lbl.CONVSERIALNO')}
					name="blno"
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.BLNO')])}
				/>
			</li>
			{/* 이력번호 */}
			<li>
				<InputText
					name="serialno"
					label={t('lbl.SERIALNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.SERIALNO')])}
					allowClear
				/>
			</li>
			{/* 계약업체 */}
			<li>
				<CmMngPlcSearch
					form={props.form}
					name="contractcompanyName"
					code="contractcompany"
					selectionMode="singleRow"
					returnValueFormat="name"
					label={t('lbl.CONTRACTCOMPANY')}
				/>
			</li>
			{/* 창고코드/명 */}
			{/* <li>
				<InputText
					name="blno"
					label={t('lbl.BLNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.BLNO')])}
					allowClear
				/>
			</li> */}
		</>
	);
};

export default OmorderCreationSTOForOutSearch;
