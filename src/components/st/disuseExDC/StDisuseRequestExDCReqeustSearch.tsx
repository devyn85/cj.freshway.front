/*
 ############################################################################
 # FiledataField	: StDisuseRequeStExDCSearch.tsx
 # Description		: 저장위치정보 검색
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.18
 ############################################################################
*/
// lib

// component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import { InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// api
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';

// util

// hook

// type

// asset
interface StDisuseRequestExDCProps {
	form: any;
}
const StDisuseRequestExDCReqeustSearch = (props: StDisuseRequestExDCProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const form = props.form;

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			<li>
				{/* <CmGMultiDccodeSelectBox data-type={''} name={'gMultiDccode'} disabled={true} /> */}
				<SelectBox
					name="dccode" //IF Status
					span={24}
					options={getCommonCodeList('SUPPLY_DC').map(item => ({
						...item,
						cdNm: item.comCd ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
					}))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DCCODE')}
					required
					disabled
				/>
			</li>
			<li>
				<CmOrganizeSearch
					form={form}
					dccode={'2170'}
					name="oranizeName"
					selectionMode={'multipleRows'}
					code="organize"
					returnValueFormat="name"
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form}
					name="skuName"
					code="sku"
					returnValueFormat="name"
					selectionMode="multipleRows"
					required={false}
				/>
			</li>
			<li></li>

			<li>
				<MultiInputText name="blno" label={'B/L번호'} placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.BLNO')])} />
			</li>
			<li>
				<InputText name="serialno" label={'이력번호'} />
			</li>
			<li>
				<SelectBox
					name="stocktype"
					span={24}
					options={getCommonCodeList('STOCKTYPE', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={'재고위치'}
				/>
			</li>
			<li>
				<SelectBox
					name="stockgrade"
					span={24}
					options={getCommonCodeList('STOCKGRADE', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={'재고속성22'}
				/>
			</li>
		</>
	);
};

export default StDisuseRequestExDCReqeustSearch;
