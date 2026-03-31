/*
 ############################################################################
 # FiledataField	: WdLoadSearch.tsx
 # Description		: 출고 > 출차지시 > 출차지시처리 (조회)
 # Author					: JiHoPark
 # Since					: 2025.11.12.
 ############################################################################
*/

// Lib

// Component
import { InputText, RadioBox, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmMngPlcSearch from '@/components/cm/popup/CmMngPlcSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

// Util

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// API

// Hooks

// lib

// hook

// type

// asset

interface WdLoadSearchProps {
	form: any;
	autodcHandler: any;
	autodc?: any;
}

const WdLoadSearch = (props: WdLoadSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const { form, autodcHandler, autodc } = props;

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_WD')} // 출고일자
					name="slipdt"
					format={'YYYY-MM-DD'} // 화면에 표시될 형식
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox
					disabled={false}
					onChange={async () => {
						autodcHandler();
					}}
					label={t('lbl.DCCODENAME')} // 물류센터
				/>
			</li>
			<li>
				<CmOrganizeSearch // 창고
					form={form}
					name="oranizeName"
					dccode={form.gMultiDccode}
					code="organize"
					returnValueFormat="name"
					selectionMode="singleRow"
				/>
			</li>
			<li>
				<CmCarSearch
					label={t('lbl.VHCNUM')} // 차량번호
					form={form}
					code="carno"
					name="carnoNm"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<CmCustSearch
					label={t('lbl.TO_CUSTKEY_WD2')} // 관리처
					form={form}
					name="toCustkeyName"
					code="toCustkey"
					selectionMode="multipleRows"
					returnValueFormat="name"
				/>
			</li>
			<li>
				<CmSkuSearch
					label={t('lbl.SKU2')} // 상품
					form={form}
					name="skuNm"
					code="sku"
					returnValueFormat="name"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<CmMngPlcSearch
					label={t('lbl.SUPPLIER')} // 협력사
					form={form}
					name="vendorName"
					code="vendor"
					returnValueFormat="name"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.CHANNEL_DMD')} // 저장유무
					name="channel"
					options={getCommonCodeList('PUTAWAYTYPE', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.INSPECTSTATUS_WD')} // 검수진행상태
					name="status"
					options={getCommonCodeList('INSPECTSTATUS_WD', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.FORCECMPYN')} // 검수완료여부
					name="inspectedyn"
					options={getCommonCodeList('YN', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<InputText
					label={t('lbl.LBL_DELIVERYGROUP')} // POP
					name="deliverygroup"
					disabled={!autodc}
				/>
			</li>
			<li>
				<RadioBox
					label={t('lbl.PRINTBASE')} // 출력기준
					name="searchtype"
					options={[
						{ comCd: '0', cdNm: t('lbl.CARNO') }, // 차량번호
						{ comCd: '1', cdNm: t('lbl.DLV_PLACE') }, // 납품처
					]}
					optionValue="comCd"
					optionLabel="cdNm"
					defaultValue="0"
					disabled={!autodc}
				/>
			</li>
			<li>
				<RadioBox
					label={t('lbl.PRINTTYPE')} // 출력유형
					name="searchgubun"
					options={[
						{ comCd: '0', cdNm: t('lbl.FO_LOADTASKDOC') }, // FO상차지시서
						{ comCd: '1', cdNm: t('lbl.FW_LOADTASKDOC') }, // FW상차지시서
					]}
					optionValue="comCd"
					optionLabel="cdNm"
					defaultValue="0"
					disabled={!autodc}
				/>
			</li>
		</>
	);
};

export default WdLoadSearch;
