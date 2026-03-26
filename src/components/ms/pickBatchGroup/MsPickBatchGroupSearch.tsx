// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
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
					name="batchGroup"
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.BATCHGROUP')])}
					onPressEnter={search}
					label={t('lbl.BATCHGROUP')}
				/>
			</li>
			<li>
				<InputText
					name="description"
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.DESCRIPTION')])}
					onPressEnter={search}
					label={t('lbl.DESCRIPTION')}
				/>
			</li>
		</>
	);
};

export default MsPickBatchGroupSearch;
