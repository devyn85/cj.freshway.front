// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import Datepicker from '@/components/common/custom/form/Datepicker';

//Store

interface StDailyInoutCloseSearchProps {
	form: any;
	search: any;
}

const StDailyInoutCloseSearch = ({ form, search }: StDailyInoutCloseSearchProps) => {
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
					name="inoutDt"
					allowClear
					showNow={false}
					label={t('lbl.INOUTDT')}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
					picker="month"
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox
					name="multiDcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={'물류센터'}
					mode="multiple"
				/>
			</li>
			<li>
				<SelectBox
					name="delYn"
					placeholder="선택해주세요"
					options={[
						{ cdNm: '전체', comCd: '' },
						{ cdNm: '마감전', comCd: 'Y' },
						{ cdNm: '마감완료', comCd: 'N' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.CLOSEYN')}
				/>
			</li>
		</>
	);
};

export default StDailyInoutCloseSearch;
