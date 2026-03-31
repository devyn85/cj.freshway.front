// Component
import { InputText, SelectBox } from '@/components/common/custom/form';

const SysAuthorityUserSearch = ({ search }: any) => {
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
				<InputText name="userId" label={t('lbl.USER_ID')} onPressEnter={search} />
			</li>
			<li>
				<InputText name="userNm" label={t('lbl.USER_NM')} onPressEnter={search} />
			</li>
			<li>
				<InputText name="upAuthGroupCd" label={t('lbl.UP_AUTH_GROUP_CD')} />
			</li>
			<li>
				<SelectBox
					name="lowAuthYn"
					label={t('lbl.LOW_AUTH_YN')}
					initval={''}
					options={[
						{ comCd: '', cdNm: t('lbl.ALL') },
						{ comCd: 'Y', cdNm: 'Y' },
						{ comCd: 'N', cdNm: 'N' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default SysAuthorityUserSearch;
