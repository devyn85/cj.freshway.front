/*
 ############################################################################
 # FiledataField	: MsCustDeliveryInfoPSearch.tsx
 # Description		: 기준정보 > 거래처기준정보 > 협력사집하조건 
 # Author			: JeongHyeongCheol
 # Since			: 25.08.22
 ############################################################################
*/
// component
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// CSS

// store

// API Call Function

interface MsCustDeliveryInfoPSearchProps {
	form?: any;
}

const MsCustDeliveryInfoPSearch = (props: MsCustDeliveryInfoPSearchProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const { form } = props;
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="dlvDccode"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={t('lbl.DLV_DCCODE')}
				/>
			</li>
			<li>
				<CmPartnerSearch
					// label={t('lbl.FROM_VATNO')} //고객코드
					form={form}
					name="custName"
					code="custkey"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<InputText
					label={t('lbl.VATNO_1')}
					name="vatNo"
					placeholder={t('msg.placeholder1', [t('lbl.VATNO_1')])}
					// onPressEnter={search}
				/>
			</li>
			<li>
				<SelectBox //속성
					name="status"
					label={t('lbl.STATUS')}
					span={24}
					options={getCommonCodeList('STATUS_CUST', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default MsCustDeliveryInfoPSearch;
