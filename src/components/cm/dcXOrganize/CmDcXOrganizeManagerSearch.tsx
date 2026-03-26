// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

//Store

interface CmDcXOrganizeManagerSearchProps {
	form: any;
	search: any;
}

const CmDcXOrganizeManagerSearch = ({ form, search }: CmDcXOrganizeManagerSearchProps) => {
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
		<li>
			<CmGMultiDccodeSelectBox
				name="multiDcCode"
				placeholder="선택해주세요"
				fieldNames={{ label: 'dcname', value: 'dccode' }}
				mode="multiple"
				label={'물류센터'}
			/>
		</li>
	);
};

export default CmDcXOrganizeManagerSearch;
