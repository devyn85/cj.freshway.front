// Component
import { InputText, SelectBox } from '@/components/common/custom/form';

const SysAuthorityProgramSearch = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const systemClList = [
		{ label: t('lbl.WEB'), value: 'LOGISONE' },
		{ label: t('lbl.CENTER_APP'), value: 'WMMOB' },
		{ label: t('lbl.DRIVER_APP'), value: 'DMMOB' },
	];

	return (
		<>
			<li>
				<SelectBox name="systemCl" label={t('lbl.SYSTEM_CL')} options={systemClList} initval={'LOGISONE'} />
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

export default SysAuthorityProgramSearch;
