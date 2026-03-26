/*
 ############################################################################
 # FiledataField	: SysManualSearch.tsx
 # Description		: ADMIN > 시스템운영 > 매뉴얼 검색 영역
 # Author			: JangGwangSeok
 # Since			: 26.01.29
 ############################################################################
*/

// Component
import { SelectBox } from '@/components/common/custom/form';

const SysManualSearch = () => {
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
		<li>
			<SelectBox name="systemCl" label={t('lbl.SYSTEM_CL')} options={systemClList} initval={'LOGISONE'} />
		</li>
	);
};

export default SysManualSearch;
