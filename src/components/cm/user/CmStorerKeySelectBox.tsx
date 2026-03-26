/*
 ############################################################################
 # FiledataField	: CmUserAuthSelectBox.tsx
 # Description		: 사용 가능한 고객 리스트 SelectBox
 # Author			: JangGwangSeok
 # Since			: 25.05.13
 ############################################################################
*/

// Components
import { SelectBox } from '@/components/common/custom/form';

// Store
import { useAppSelector } from '@/store/core/coreHook';
import { getUserStorerkeyList } from '@/store/core/userStore';

const CmStorerKeySelectBox = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// props 선언 및 초기화
	const { nameKey = 'storerkey' } = props;
	const { t } = useTranslation();

	// 사용자 정보
	const user = useAppSelector(state => state.user.userInfo);

	return (
		<>
			<SelectBox
				name={nameKey}
				options={getUserStorerkeyList('', user.defDccode)}
				fieldNames={{ label: 'storername', value: 'storerkey' }}
				initval={user.defStorerkey}
				disabled={true}
				label={t('lbl.STORERKEY')}
			/>
		</>
	);
};

export default CmStorerKeySelectBox;
