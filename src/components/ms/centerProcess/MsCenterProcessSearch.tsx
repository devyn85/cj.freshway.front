// Component
import { InputText } from '@/components/common/custom/form';

interface MsPickBatchGroupSearchProps {
	form: any;
	search: any;
}

const MsPickBatchGroupSearch = ({ form, search }: MsPickBatchGroupSearchProps) => {
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
				<span>
					<InputText
						name="batchGroup"
						placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.BATCHGROUP')])}
						onPressEnter={search}
						label={t('lbl.BATCHGROUP')}
					/>
				</span>
			</li>
			<li>
				<span>
					<InputText
						name="description"
						placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.DESCRIPTION')])}
						onPressEnter={search}
						label={t('lbl.DESCRIPTION')}
					/>
				</span>
			</li>
		</>
	);
};

export default MsPickBatchGroupSearch;
