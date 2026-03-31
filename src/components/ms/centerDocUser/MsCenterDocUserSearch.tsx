// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';

//Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface MsCenterDocUserSearchProps {
	form: any;
	search: any;
}

const MsCenterDocUserSearch = ({ form, search }: MsCenterDocUserSearchProps) => {
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

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="multiDcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
				/>
			</li>
			<li>
				<InputText
					name="userNm"
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.USERNAME')])}
					onPressEnter={search}
					label={t('lbl.USERNAME')}
				/>
			</li>
			<li>
				<SelectBox
					name="delYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 선택 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DEL_YN')}
				/>
			</li>
		</>
	);
};

export default MsCenterDocUserSearch;
