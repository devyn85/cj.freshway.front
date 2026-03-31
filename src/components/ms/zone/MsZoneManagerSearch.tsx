/*
 ############################################################################
 # FiledataField	: MsZoneManagerSearch.tsx
 # Description		: 기준정보 > 센터기준정보 > 존정보
 # Author			: JeongHyeongCheol
 # Since			: 25.05.27
 ############################################################################
*/
// component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import MsZoneListSelectBox from '@/components/ms/zone/MsZoneListSelectBox';

// CSS

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// lib

interface MsZoneManagerSearchProps {
	dccode?: string[];
	gridChange?: boolean;
	setGridChange?: any;
	form?: any;
}

const MsZoneManagerSearch = (props: MsZoneManagerSearchProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, dccode, gridChange, setGridChange } = props;
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
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
				/>
			</li>
			<li>
				<MsZoneListSelectBox form={form} dccode={dccode} gridChange={gridChange} setGridChange={setGridChange} />
			</li>
			<li>
				<SelectBox
					name="delYn"
					span={24}
					placeholder="선택해주세요"
					options={getCommonCodeList('DEL_YN', '--- 전체 ---', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DEL_YN')}
				/>
			</li>
		</>
	);
};

export default MsZoneManagerSearch;
