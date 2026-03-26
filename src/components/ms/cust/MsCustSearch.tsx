/*
 ############################################################################
 # FiledataField	: MsCustSearch.tsx
 # Description		: 기준정보 > 거래처기준정보 > 고객정보
 # Author			: JeongHyeongCheol
 # Since			: 25.06.09
 ############################################################################
*/
// component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

// CSS

// store

// API Call Function

interface MsCustSearchProps {
	form?: any;
}

const MsCustSearch = (props: MsCustSearchProps) => {
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
				<CmCustSearch
					label={t('lbl.FROM_VATNO')} //고객코드
					form={form}
					name="custName"
					code="custkey"
					selectionMode="multipleRows"
				/>
			</li>
		</>
	);
};

export default MsCustSearch;
