/*
 ############################################################################
 # FiledataField	: StOutMoveSearch.tsx
 # Description		: 외부비축센터간이동
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.25
 ############################################################################
*/

import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { Form } from 'antd';

const StOutMoveSearch = (props: any) => {
	const form = props.form;
	const { t } = useTranslation();
	const dccode = Form.useWatch('fixDcCode', form);
	const user = useAppSelector(state => state.user.userInfo);

	return (
		<>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="fixDcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
					onChange={() => {
						props.setZoneOptions(getMsZoneList(form.getFieldValue('dcCode')));
						form.setFieldsValue({ zone: null, loc: '' });
					}}
					disabled={
						user.roles?.includes('00') ||
						user.roles?.includes('20') ||
						user.roles?.includes('000') ||
						user.roles?.includes('200')
					}
				/>
			</li>
			{/* 창고 */}
			<li>
				<CmOrganizeSearch
					form={form}
					selectionMode="multipleRows"
					name="organizeNm"
					code="organize"
					returnValueFormat="name"
					dccode={dccode}
					label={t('lbl.ORGANIZE')}
				/>
			</li>
			{/* B/L번호 */}
			<li>
				<MultiInputText
					name="blNo"
					label={t('lbl.CONVSERIALNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.CONVSERIALNO')])}
				/>
			</li>
			{/* 이력번호 */}
			<li>
				<InputText name="serialNo" label="이력번호" maxLength={32} />
			</li>
			{/* 상품코드/명 */}
			<li>
				<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 재고위치 */}
			<li>
				<SelectBox
					name="stockType"
					label="재고위치"
					options={getCommonCodeList('STOCKTYPE', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 재고속성 */}
			<li>
				<SelectBox
					name="stockGrade"
					label="재고속성"
					options={getCommonCodeList('STOCKGRADE', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 계약업체 */}
			<li>
				<CmCustSearch
					form={props.form}
					name="contractCompany"
					code="contractCompany"
					selectionMode="multipleRows"
					returnValueFormat="name"
					label={t('lbl.CONTRACTCOMPANY')}
				/>
			</li>
		</>
	);
};

export default StOutMoveSearch;
