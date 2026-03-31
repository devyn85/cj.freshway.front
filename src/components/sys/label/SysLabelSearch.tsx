// Component
import { InputText, SelectBox } from '@/components/common/custom/form';

//Store

interface SysLabelSearchProps {
	form: any;
	search: any;
}

const SysLabelSearch = ({ form, search }: SysLabelSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어s
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	return (
		<>
			{/* <li>
				<SelectBox
					name="systemCl"
					placeholder="선택해주세요"
					// options={getCommonCodeList('LOCTYPE_BLANK', '--- 전체 ---')}
					options={[
						{
							comCd: 'LOGISONE',
							cdNm: 'LOGISONE',
						},
						{
							comCd: 'COMMON',
							cdNm: 'Miplatform',
						},
						{
							comCd: 'HTML',
							cdNm: 'HTML',
						},
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.SYSTEM_CL')}
					initval={'LOGISONE'}
					// required={true}
				/>
			</li> */}
			<li>
				<SelectBox
					name="labelType"
					placeholder="선택해주세요"
					// options={getCommonCodeList('LOCTYPE_BLANK', '--- 전체 ---')}
					options={[
						{
							comCd: '',
							cdNm: '전체',
						},
						{
							comCd: 'LBL',
							cdNm: 'LBL',
						},
						{
							comCd: 'MSG',
							cdNm: 'MSG',
						},
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.LABEL_TP')}
				/>
			</li>
			<li>
				<InputText name="labelCd" onPressEnter={search} label={t('lbl.LABEL_CD')} />
			</li>
			<li>
				<InputText name="labelNm" onPressEnter={search} label={t('lbl.LABEL_NM')} />
			</li>
			<li>
				<SelectBox
					name="useYn"
					placeholder="선택해주세요"
					// options={getCommonCodeList('LOCTYPE_BLANK', '--- 전체 ---')}
					options={[
						{
							comCd: '',
							cdNm: '전체',
						},
						{
							comCd: '1',
							cdNm: '사용',
						},
						{
							comCd: '0',
							cdNm: '미사용',
						},
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.USE_YN')}
				/>
			</li>
		</>
	);
};

export default SysLabelSearch;
