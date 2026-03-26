/*
 ############################################################################
 # FiledataField	: StAdjustmentTRBLExDCSearch.tsx
 # Description		: 외부비축BL내재고이관
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/

// CSS

// Lib

// Utils

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Component
import CmMngPlcSearch from '@/components/cm/popup/CmMngPlcSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';

// API

interface StAdjustmentTRBLExDCSearchProps {
	form: any;
}

const StAdjustmentTRBLExDCSearch = (props: StAdjustmentTRBLExDCSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
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
				<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODENAME')} required disabled />
			</li>
			<li>
				<CmOrganizeSearch
					form={props.form}
					selectionMode="multipleRows"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={props.form.getFieldValue('fixdccode')}
				/>
			</li>
			<li>
				<CmSkuSearch
					form={props.form}
					name="skuName"
					code="sku"
					selectionMode="singleRow"
					returnValueFormat="name"
					required
				/>
			</li>
			<li>
				<SelectBox
					name="stocktype"
					span={24}
					options={getCommonCodeList('STOCKTYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.STOCKTYPE')}
				/>
			</li>
			<li>
				<InputText
					name="blno"
					label={t('lbl.BLNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.BLNO')])}
					allowClear
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<InputText
					name="serialno"
					label={t('lbl.SERIALNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.SERIALNO')])}
					allowClear
				/>
			</li>
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
			<li>
				<SelectBox
					name="stockgrade"
					span={24}
					options={getCommonCodeList('STOCKGRADE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.STOCKGRADE')}
				/>
			</li>
		</>
	);
};

export default StAdjustmentTRBLExDCSearch;
