// Component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

//Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface MsCenterDocSearchProps {
	form: any;
	search: any;
}

const MsCenterDocSearch = ({ form, search }: MsCenterDocSearchProps) => {
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

	/**
	 * data onChange Event Handler
	 * @param  {string} value 변경 후 data
	 */
	const onChangeAddDt = (value: any) => {
		// //console.log('>>>onChange', [value[0].format('YYYYMMDD'), value[1].format('YYYYMMDD')]);
	};

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
				<Rangepicker
					name="addDt"
					onChange={onChangeAddDt}
					allowClear
					showNow={false}
					label={t('lbl.ADDDATE')}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<SelectBox
					name="reqDoc"
					placeholder="선택해주세요"
					options={getCommonCodeList('COP_FILE_GUBUN', '--- 선택 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'요청서류'}
				/>
			</li>
			<li>
				<CmCustSearch form={form} name="custNm" code="custKey" />
			</li>
			<li>
				<SelectBox
					name="regYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 선택 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'등록완료여부'}
				/>
			</li>
		</>
	);
};

export default MsCenterDocSearch;
