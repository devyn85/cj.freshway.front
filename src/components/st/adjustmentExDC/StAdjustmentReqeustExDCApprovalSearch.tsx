/*
 ############################################################################
 # FiledataField	: StAdjustmentReqeustExDCApprovalSearch.tsx
 # Description		: 외부비축재고감모요청 결재검색
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.07.14
 ############################################################################
*/
// lib

// component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import { Rangepicker, SelectBox } from '@/components/common/custom/form';

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
const StAdjustmentReqeustExDCApprovalSearch = (props: StAdjustmentRequestExDCProps) => {
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
			<li style={{ gridColumn: '1 / span 1' }}>
				<Rangepicker
					label={'기준일'}
					name="basedtRange"
					format={'YYYY-MM-DD'} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
					//nChange={handleDateChange}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox data-type={''} name={'gMultiDccode'} />
			</li>
			<li>
				<CmOrganizeSearch label={'창고'} form={form} name="oranizeName" code="organize" returnValueFormat="name" />
			</li>
			<li>
				<SelectBox
					name="approvaltype"
					span={24}
					options={getCommonCodeList('APPROVALTYPE', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={'유형'}
				/>
			</li>
			<li>
				<CmSkuSearch
					label={'상품'}
					form={form}
					name="skuName"
					code="sku"
					returnValueFormat="name"
					selectionMode="multipleRows"
					required={false}
				/>
			</li>
		</>
	);
};

export default StAdjustmentReqeustExDCApprovalSearch;
