/*
 ############################################################################
 # FiledataField	: MsPopMngSTOSearch.tsx
 # Description		: 기준정보 > 권역기준정보 > 거래처별POP관리(광역일배)
 # Author			: JeongHyeongCheol
 # Since			: 25.07.18
 ############################################################################
*/
// component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText } from '@/components/common/custom/form';

// CSS

// store

// lib

interface MsPopMngSTOSearchProps {
	form: any;
}
const MsPopMngSTOSearch = (props: MsPopMngSTOSearchProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
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
					name="dccode"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					// mode="multiple"
					label={t('lbl.DCCODE')} // 물류센터
				/>
			</li>
			<li>
				<InputText
					label={t('lbl.POPNO')} // POP번호
					placeholder="입력해주세요"
					name="popno"
				/>
			</li>
		</>
	);
};

export default MsPopMngSTOSearch;
