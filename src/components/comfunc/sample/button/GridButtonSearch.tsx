/*
 ############################################################################
 # FiledataField	: GridButtonSearch.tsx
 # Description		: 
 # Author			: JangGwangSeok
 # Since			: 25.05.20
 ############################################################################
*/

// CSS

// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, LabelText, MultiInputText, SelectBox } from '@/components/common/custom/form';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

const GridButtonSearch = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					mode={'multiple'}
					name={'dcCode'}
					rules={[{ required: true }]}
					initval={['2170', '1000']}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.STORERKEY')}
					name="storerkey"
					options={getCommonCodeList('STORAGETYPE', '===선택===')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<InputText label={t('lbl.PROG_CD')} name="progCd" />
			</li>
			<li>
				<InputText label={t('lbl.PROG_NM')} name="progNm" />
			</li>
			<li>
				<InputText label={t('lbl.PROG_LVL')} name="progLvl" />
			</li>
			<li>
				<InputText label={t('lbl.PROG_URL')} name="progUrl" />
			</li>
			<li>
				<InputText label={t('lbl.SYSTEM_CL')} name="systemCl" />
			</li>
			<li>
				<LabelText label={'라벨 영역 테스트'} value={'test1234'} />
			</li>
			<li>
				<MultiInputText label={'멀티 입력'} name="multiValue" />
			</li>
		</>
	);
};

export default GridButtonSearch;
