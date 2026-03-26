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
import { InputText, MultiInputText, Rangepicker, SelectBox } from '@/components/common/custom/form';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// api
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { Form } from 'antd';

// util

// hook

// type

// asset
interface StDisuseRequestExDCProps {
	form: any;
}
const StDisuseReqeustExDCProcessSearch = (props: StDisuseRequestExDCProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const form = props.form;
	const dttype = Form.useWatch('dttype', form);

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
					label={'창고'}
					form={form}
					name="oranizeName"
					dccode={'2170'}
					code="organize"
					returnValueFormat="name"
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
				<InputText
					name="serialno"
					label={t('lbl.SERIALNO')} // 이력번호
				/>
			</li>
			<li>
				<MultiInputText
					name="blno"
					label={t('lbl.CONVSERIALNO')} // B/L번호
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.BLNO')])}
				/>
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
					label={'폐기일자 유형'}
				/>
			</li>
			<li>
				{dttype === 'APPRREQDT' && (
					<Rangepicker
						label={'폐기요청일자'}
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
						label={'폐기일자'}
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

export default StDisuseReqeustExDCProcessSearch;
