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
import { InputText, Rangepicker, SelectBox } from '@/components/common/custom/form';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// api
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { useAppSelector } from '@/store/core/coreHook';
import { Form } from 'antd';

// util

// hook

// type

// asset
interface StAdjustmentRequestExDCProps {
	form: any;
}
const StAdjustmentReqeustExDCProcessSearch = (props: StAdjustmentRequestExDCProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const form = props.form;
	const dttype = Form.useWatch('dttype', form);
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
			<li>
				<SelectBox
					name="apprstatus"
					span={24}
					options={getCommonCodeList('APPROVALSTATUS', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={'진행상태'}
				/>
			</li>
			<li>
				<SelectBox
					name="dttype"
					span={24}
					options={getCommonCodeList('DATETYPE_DISUSE', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={'감모일자 유형'}
				/>
			</li>
			<li>
				{dttype === 'APPRREQDT' && (
					<Rangepicker
						label={'감모요청일자'}
						name="apprreqdtRange"
						format={'YYYY-MM-DD'} // 화면에 표시될 형식
						span={24}
						allowClear
						showNow={false}
						//nChange={handleDateChange}
					/>
				)}
				{dttype === 'SLIPDT' && (
					<Rangepicker
						label={'감모일자'}
						name="slipdtRange"
						format={'YYYY-MM-DD'} // 화면에 표시될 형식
						span={24}
						allowClear
						showNow={false}
						//nChange={handleDateChange}
					/>
				)}
			</li>
		</>
	);
};

export default StAdjustmentReqeustExDCProcessSearch;
