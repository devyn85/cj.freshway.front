/*
 ############################################################################
 # FiledataField	: StAdjustmentRequeStExDCSearch.tsx
 # Description		: 저장위치정보 검색
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.18
 ############################################################################
*/
// lib

// component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import { InputText, SelectBox } from '@/components/common/custom/form';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// api
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { useAppSelector } from '@/store/core/coreHook';

// util

// hook

// type

// asset
interface StAdjustmentRequestExDCProps {
	form: any;
}
const StAdjustmentRequestExDCReqeustSearch = (props: StAdjustmentRequestExDCProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const form = props.form;
	const gDccode = useAppSelector(state => state.global.globalVariable.gDccode);

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
	useEffect(() => {
		if (gDccode) {
			form.setFieldsValue({
				gMultiDccode: gDccode,
			});
		}
	}, [gDccode]);
	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox data-type={''} name={'gMultiDccode'} disabled={true} />
			</li>
			<li>
				<CmOrganizeSearch label={'창고'} form={form} name="oranizeName" code="organize" returnValueFormat="name" />
			</li>
			<li>
				<CmSkuSearch
					label={'상품'}
					form={form}
					name="skuName"
					code="sku"
					returnValueFormat="code"
					selectionMode="multipleRows"
					required={false}
				/>
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
					label={'재고속성'}
				/>
			</li>
			<li>
				<InputText name="serialno" label={'이력번호'} />
			</li>
			<li>
				<InputText name="blno" label={'B/L번호'} />
			</li>
			<li></li>
		</>
	);
};

export default StAdjustmentRequestExDCReqeustSearch;
