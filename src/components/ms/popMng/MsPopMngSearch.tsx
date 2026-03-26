/*
 ############################################################################
 # FiledataField	: MsPopMngSearch.tsx
 # Description		: 기준정보 > 권역기준정보 > 거래처별POP관리
 # Author			: JeongHyeongCheol
 # Since			: 25.07.18
 ############################################################################
*/
// component
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmPopSearch from '@/components/cm/popup/CmPopSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

// CSS

// store

// lib

interface MsPopMngSearchProps {
	form: any;
	dccode: string;
}
const MsPopMngSearch = (props: MsPopMngSearchProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { form, dccode } = props;
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
					name="dccode"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					// mode="multiple"
					label={t('lbl.DCCODE')} // 물류센터
				/>
			</li>
			<li>
				<CmCustSearch form={form} name="custName" code="custkey" selectionMode="multipleRows" />
			</li>
			<li>
				<CmPopSearch
					form={form}
					name="popName"
					code="popno"
					selectionMode="multipleRows"
					label={t('lbl.POPNO')} // POP번호
					customDccode={dccode}
				/>
			</li>
			<li>
				<CmCarSearch form={form} name="carName" code="carno" selectionMode="multipleRows" />
			</li>
		</>
	);
};

export default MsPopMngSearch;
