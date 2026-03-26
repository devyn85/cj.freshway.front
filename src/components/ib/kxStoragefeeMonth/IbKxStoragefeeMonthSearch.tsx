// Component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import Datepicker from '@/components/common/custom/form/Datepicker';

//Store

interface IbKxStoragefeeMonthSearchProps {
	form: any;
	search: any;
}

const IbKxStoragefeeMonthSearch = ({ form, search }: IbKxStoragefeeMonthSearchProps) => {
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
					name="stockDate"
					allowClear
					showNow={false}
					label={t('lbl.CLOSEMONTH')}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
					picker="month"
				/>
			</li>
			<li>
				<CmOrganizeSearch
					form={form}
					selectionMode="multipleRows"
					label={'창고'}
					name="organizeName"
					code="organize"
					returnValueFormat="name"
				/>
			</li>
			<li>
				<CmSkuSearch form={form} selectionMode="multipleRows" name="skuName" code="multiSku" />
			</li>
		</>
	);
};

export default IbKxStoragefeeMonthSearch;
