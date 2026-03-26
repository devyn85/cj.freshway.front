// Component
import { InputText } from '@/components/common/custom/form';

const CbCommunitySearch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	const { t } = useTranslation();

	return (
		<>
			<li>
				<InputText name="brdTit" label={t('lbl.TITLE')} />
			</li>
			<li>
				<InputText name="brdCntt" label={t('lbl.CONTENT')} />
			</li>
		</>
	);
});

export default CbCommunitySearch;
