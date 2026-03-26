/*
 ############################################################################
 # FiledataField	: RtReturnOutExDCSearch.tsx
 # Description		: 외부비축협력사반품지시
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.27
 ############################################################################
*/

import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, MultiInputText } from '@/components/common/custom/form';

// API

interface RtReturnOutExDCSearchProps {
	form: any;
}

const RtReturnOutExDCSearch = (props: RtReturnOutExDCSearchProps) => {
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
			{/* 물류센터(물류센터코드/명) */}
			<li>
				<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODENAME')} required disabled />
			</li>
			{/* 창고코드/명 */}
			<li>
				<CmOrganizeSearch
					form={props.form}
					selectionMode="singlRow"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={props.form.getFieldValue('fixdccode')}
				/>
			</li>
			<li>
				<CmSkuSearch //상품
					form={props.form}
					name="skuName"
					code="sku"
					selectionMode="multipleRows"
					returnValueFormat="name"
				/>
			</li>
			<li>
				<CmPartnerSearch //협력사
					form={props.form}
					name="fromCustkeyName"
					code="fromCustkey"
					selectionMode="multipleRows"
					returnValueFormat="name"
					label={t('lbl.PARTNER')}
				/>
			</li>
			<li>
				<MultiInputText //BL번호
					name="blno"
					label={t('lbl.BLNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.BLNO')])}
					allowClear
				/>
			</li>
			<li>
				<InputText //이력번호
					name="serialno"
					label={t('lbl.SERIALNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.SERIALNO')])}
					allowClear
				/>
			</li>
			<li>
				<CmCustSearch //고객
					form={props.form}
					name="wdCustkeyName"
					code="wdCustkey"
					selectionMode="multipleRows"
					returnValueFormat="name"
				/>
			</li>
		</>
	);
};

export default RtReturnOutExDCSearch;
