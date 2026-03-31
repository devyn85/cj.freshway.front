// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';

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
				<SelectBox
					label={t('피킹유형')}
					name="distanceType"
					options={getCommonCodeList('DISTANCETYPE', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.DEL_YN')}
					name="delYn"
					options={getCommonCodeList('DEL_YN', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default MsPickBatchGroupSearch;
