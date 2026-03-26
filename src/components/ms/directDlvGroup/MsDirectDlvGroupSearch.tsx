/*
 ############################################################################
 # FiledataField	: MsDirectDlvGroupSearch.tsx
 # Description		: 기준정보 > 상품기준정보 > 발주직송그룹관리
 # Author			: JeongHyeongCheol
 # Since			: 25.06.27
 ############################################################################
*/
// component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';

// CSS

// store

// API Call Function

const MsDirectDlvGroupSearch = (prop: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const { t } = useTranslation();
	const codeList = prop.codeList;
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
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
				/>
			</li>
			<li>
				<SelectBox
					name="directdlvgroup"
					span={24}
					placeholder={t('msg.selectBox')} //선택해주세요
					options={codeList}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					mode="multiple"
					label={'직송그룹'} //직송그룹
				/>
			</li>
		</>
	);
};

export default MsDirectDlvGroupSearch;
