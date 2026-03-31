/*
 ############################################################################
 # FiledataField	: StDailyOnhandQtyAPISearch.tsx
 # Description		: 외부창고 API 재고현황
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.09.041
 ############################################################################
*/

// CSS

// Lib

// Utils

// Store

// Component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

// API

interface StDailyOnhandQtyAPISearchhProps {
	form: any;
}

const StDailyOnhandQtyAPISearch = (props: StDailyOnhandQtyAPISearchhProps) => {
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
				<DatePicker //일자
					label={t('lbl.DATE')}
					name="searchdate"
					format="YYYY-MM-DD"
					showSearch
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODENAME')} required disabled />
			</li>
			<li>
				<CmOrganizeSearch //창고
					form={props.form}
					name="organizeName"
					code="organize"
					selectionMode="multipleRows"
					returnValueFormat="name"
					dccode={props.form.getFieldValue('fixdccode')}
				/>
			</li>
			<li></li>
			<li>
				<CmSkuSearch
					form={props.form} //상품
					name="skuName"
					code="sku"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<InputText
					name="convserialno" //B/L번호
					label={t('lbl.CONVSERIALNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.CONVSERIALNO')])}
					allowClear
				/>
			</li>
		</>
	);
};

export default StDailyOnhandQtyAPISearch;
