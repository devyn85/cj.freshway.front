/*
 ############################################################################
 # FiledataField	: SearchlatlngSearch.tsx
 # Description		: 기준정보 > 거래처기준정보 > 거래처별전용차량정보
 # Author			: JeongHyeongCheol
 # Since			: 25.08.29
 ############################################################################
*/
// component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';

// CSS

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// lib

interface SearchlatlngSearchProps {
	dccode?: string[];
	form?: any;
}

const SearchlatlngSearch = (props: SearchlatlngSearchProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, dccode } = props;
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
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
				/>
			</li>
			<li>
				<CmCustSearch
					form={form}
					// label={t('lbl.TO_CUSTKEY_WD')} //관리처코드
					name="custNm"
					code="custkey"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<InputText
					name="address1"
					placeholder={'주소를 입력해주세요'}
					// onPressEnter={search}
					label={'주소'}
				/>
			</li>

			<li>
				<SelectBox
					name="yn"
					span={24}
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'등록여부'}
				/>
			</li>
		</>
	);
};

export default SearchlatlngSearch;
