// Component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

//Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface MsDCxCustSearchProps {
	form: any;
}

const MsDCxCustSearch = ({ form }: MsDCxCustSearchProps) => {
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
	const onChangeAddDt = (value: any) => {};

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="multiDcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={t('lbl.DCCODE')}
				/>
			</li>
			<li>
				<CmCustSearch
					form={form}
					label={t('lbl.TO_CUSTKEY_WD')} //관리처코드
					name="custNm"
					code="custKey"
				/>
			</li>
			<li>
				<SelectBox
					name="custType"
					options={getCommonCodeList('CUSTTYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'거래처유형'}
				/>
			</li>
			<li>
				<Rangepicker
					name="addDt"
					onChange={onChangeAddDt}
					allowClear
					showNow={false}
					label={t('lbl.ADDDATE')}
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<SelectBox
					name="partnerKey"
					options={getCommonCodeList('PARTNERKEY', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.PARTNERKEY')}
				/>
			</li>
		</>
	);
};

export default MsDCxCustSearch;
