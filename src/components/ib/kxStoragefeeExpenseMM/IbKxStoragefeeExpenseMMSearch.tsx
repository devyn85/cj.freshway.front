// Component
import Datepicker from '@/components/common/custom/form/Datepicker';

//Store

interface IbKxStoragefeeMonthSearchProps {
	form: any;
	search: any;
}

const IbKxStoragefeeExpenseMMSearch = ({ form, search }: IbKxStoragefeeMonthSearchProps) => {
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
				<Datepicker
					name="closeDate"
					allowClear
					showNow={false}
					label={t('lbl.CLOSEMONTH')}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
					picker="month"
				/>
			</li>
		</>
	);
};

export default IbKxStoragefeeExpenseMMSearch;
