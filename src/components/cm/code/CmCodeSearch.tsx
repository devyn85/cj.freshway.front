// Component
import { InputText, SelectBox } from '@/components/common/custom/form';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface CmCodeSearchProps {
	codelistDisabled?: boolean;
	search?: any;
}

const CmCodeSearch = ({ codelistDisabled, search }: CmCodeSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	return (
		<>
			<li>
				<InputText
					name="codelist"
					label={t('lbl.CODELIST')}
					maxLength={24}
					onPressEnter={search}
					disabled={codelistDisabled}
				/>
			</li>
			<li>
				<InputText name="basecode" label={t('lbl.BASECODE')} maxLength={32} onPressEnter={search} />
			</li>
			<li>
				<InputText name="basedescr" label={t('lbl.BASEDESCR')} maxLength={256} onPressEnter={search} />
			</li>
			<li>
				<SelectBox
					name="delYn"
					label={t('lbl.USE_YN')}
					initval={''}
					options={getCommonCodeList('DEL_YN', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default CmCodeSearch;
